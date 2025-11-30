//! Gum-wall-calculator Server Binary

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = mcp_gum_wall_calculator_core::build_gum_wall_calculator_server()?;
    server_common::run_http(server).await
}
