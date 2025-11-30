//! Lambda wrapper for gum-wall-calculator MCP Server
//!
//! This binary wraps the MCP server for AWS Lambda deployment.
//! It uses the lambda_http runtime and runs the MCP HTTP server as a background task,
//! proxying Lambda requests to it.

use lambda_http::{run, service_fn, Body, Error, Request, Response};
use once_cell::sync::OnceCell;
use reqwest::Client;
use tracing_subscriber::EnvFilter;
use std::net::SocketAddr;

static BASE_URL: OnceCell<String> = OnceCell::new();
static HTTP: OnceCell<Client> = OnceCell::new();

/// Build the MCP server
async fn build_server() -> pmcp::Result<pmcp::Server> {
    mcp_gum_wall_calculator_core::build_gum_wall_calculator_server()
}

/// Start the HTTP server in the background and return the bound address
async fn start_http_in_background(default_port: u16, server_name: &str) -> pmcp::Result<SocketAddr> {
    let server = build_server().await?;
    let server = std::sync::Arc::new(tokio::sync::Mutex::new(server));

    // Resolve bind host and port
    let port = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse::<u16>().ok())
        .unwrap_or(default_port);

    let host = std::env::var("MCP_HTTP_HOST")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or_else(|| "127.0.0.1".parse().unwrap());

    let addr = SocketAddr::new(host, port);

    // Create and start HTTP server
    let config = pmcp::server::streamable_http_server::StreamableHttpServerConfig {
        session_id_generator: None,
        enable_json_response: true,
        event_store: None,
        on_session_initialized: None,
        on_session_closed: None,
        http_middleware: None,
    };

    let http_server = pmcp::server::streamable_http_server::StreamableHttpServer::with_config(
        addr,
        server,
        config,
    );

    let (bound, handle) = http_server.start().await?;
    tracing::info!("{}: MCP Server started on {}", server_name, bound);

    // Spawn server task
    tokio::spawn(async move {
        if let Err(e) = handle.await {
            tracing::error!("HTTP server error: {}", e);
        }
    });

    Ok(bound)
}

/// Ensure the background server is started once
async fn ensure_server_started() -> Result<String, Error> {
    if let Some(url) = BASE_URL.get() {
        return Ok(url.clone());
    }

    // Prefer 127.0.0.1 binding for Lambda runtime
    std::env::set_var("MCP_HTTP_HOST", std::env::var("MCP_HTTP_HOST").unwrap_or_else(|_| "127.0.0.1".into()));

    // Default port for Lambda sidecar
    let bound = start_http_in_background(8080, "gum-wall-calculator")
        .await
        .map_err(|e| lambda_http::Error::from(e.to_string()))?;

    let base = format!("http://{}", bound);
    let _ = BASE_URL.set(base.clone());
    let _ = HTTP.set(Client::builder().build().unwrap());
    Ok(base)
}

/// Lambda handler that proxies to background HTTP server
async fn handler(event: Request) -> Result<Response<Body>, Error> {
    let method = event.method().clone();
    let path_q = event.uri().path_and_query().map(|pq| pq.as_str().to_string()).unwrap_or("/".to_string());

    let internal_path = if path_q.is_empty() { "/" } else { path_q.as_str() };

    // Health check for GET requests
    if method.as_str() == "GET" {
        let body = serde_json::json!({
            "ok": true,
            "server": "gum-wall-calculator",
            "message": "gum-wall-calculator MCP Server. POST JSON-RPC to '/' for MCP requests."
        }).to_string();
        return Ok(
            Response::builder()
                .status(200)
                .header("content-type", "application/json")
                .header("access-control-allow-origin", "*")
                .body(Body::Text(body))
                .unwrap(),
        );
    }

    // CORS preflight
    if method.as_str() == "OPTIONS" {
        return Ok(
            Response::builder()
                .status(200)
                .header("access-control-allow-origin", "*")
                .header("access-control-allow-methods", "POST, OPTIONS, GET")
                .header("access-control-allow-headers", "content-type, authorization")
                .body(Body::Empty)
                .unwrap(),
        );
    }

    let base = ensure_server_started().await?;
    let client = HTTP.get().expect("client");

    // Map Lambda request to local HTTP request
    let url = format!("{}{}", base, internal_path);

    // Convert lambda_http Method to reqwest Method
    let reqwest_method = reqwest::Method::from_bytes(method.as_str().as_bytes())
        .map_err(|e| lambda_http::Error::from(e.to_string()))?;

    let mut req = client.request(reqwest_method, &url);

    // Copy headers
    for (name, value) in event.headers() {
        if let Ok(val) = value.to_str() {
            if name.as_str().eq_ignore_ascii_case("host") { continue; }
            req = req.header(name.as_str(), val);
        }
    }

    // Copy body
    let body_bytes = match event.body() {
        Body::Empty => Vec::new(),
        Body::Text(s) => s.as_bytes().to_vec(),
        Body::Binary(b) => b.clone(),
    };

    req = req.body(body_bytes);

    // Forward request
    let resp = req.send().await.map_err(|e| lambda_http::Error::from(e.to_string()))?;
    let status = resp.status();
    let headers = resp.headers().clone();
    let bytes = resp.bytes().await.map_err(|e| lambda_http::Error::from(e.to_string()))?;

    // Build response
    let mut builder = Response::builder().status(status.as_u16());
    builder = builder.header("access-control-allow-origin", "*");

    for (name, value) in headers.iter() {
        if let Ok(val) = value.to_str() {
            if name.as_str().eq_ignore_ascii_case("transfer-encoding") ||
               name.as_str().eq_ignore_ascii_case("content-length") { continue; }
            builder = builder.header(name.as_str(), val);
        }
    }

    Ok(builder.body(Body::Binary(bytes.to_vec())).unwrap())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Initialize logging for Lambda
    let _ = tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with_ansi(false)  // Clean CloudWatch logs
        .try_init();

    run(service_fn(handler)).await
}
