# gum-wall-calculator Lambda Deployment

This package deploys gum-wall-calculator MCP Server to AWS Lambda.

## Binary Naming

**Binary Name**: `bootstrap`

**Platform Requirement**: ✅ **REQUIRED BY AWS LAMBDA**

AWS Lambda Custom Runtime API requires the binary to be named exactly `bootstrap`.
This is a hard platform requirement and cannot be changed. The Lambda service looks for
an executable named `bootstrap` in the deployment package.

**Reference**: [AWS Lambda Custom Runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)

### Why This Matters

In Cargo workspaces, all binary names must be unique across packages. This means:

- ✅ This package uses `bootstrap` (required by AWS Lambda)
- ✅ Your standalone server should use a different name (e.g., `gum-wall-calculator-server`)
- ✅ Other deployment targets should use unique names (e.g., `gum-wall-calculator-cloudrun`)

If you see a binary naming conflict, see: `cargo-pmcp/docs/BINARY_NAMING_CONVENTIONS.md`

## Running Locally

```bash
# Run the Lambda handler locally (for testing)
cargo run --bin bootstrap

# With environment variables
RUST_LOG=debug cargo run --bin bootstrap
```

## Building for Deployment

```bash
# Build for Lambda (ARM64)
cargo build --release --target aarch64-unknown-linux-musl --bin bootstrap

# Or use cargo-lambda
cargo lambda build --release --bin bootstrap

# Or use cargo-pmcp
cargo pmcp deploy --target aws-lambda
```

## Deployment

```bash
# Deploy to AWS Lambda
cargo pmcp deploy --target aws-lambda

# View outputs
cargo pmcp outputs --target aws-lambda

# View logs
cargo pmcp logs --target aws-lambda --tail
```

## Environment Variables

- `RUST_LOG` - Logging level (default: `info`)
- `MCP_HTTP_HOST` - Internal HTTP host (default: `127.0.0.1`)
- `PORT` - Internal HTTP port (default: `8080`)

## Architecture

This Lambda handler:
1. Starts the MCP server as a background HTTP server on localhost
2. Proxies Lambda requests to the local HTTP server
3. Returns HTTP responses back to API Gateway

This architecture allows:
- ✅ Use the same MCP server code for Lambda and standalone deployments
- ✅ Simple testing with `cargo run --bin bootstrap`
- ✅ Efficient cold starts (server initialization happens once)
- ✅ Full MCP protocol support via HTTP transport

## Other Deployment Targets

If you need to deploy to multiple platforms:

- **AWS Lambda**: This package (`bootstrap` binary)
- **Google Cloud Run**: Use `cargo pmcp deploy init --target google-cloud-run`
- **Kubernetes**: Use `cargo pmcp deploy init --target kubernetes`
- **Standalone**: Run `gum-wall-calculator-server` directly

Each deployment target uses a unique binary name to avoid conflicts.

## Troubleshooting

### Error: "Cannot start a runtime from within a runtime"

This error occurs when using blocking async operations (`block_on()`) inside a `#[tokio::main]` function.

**Solution**: Make all functions `async` and use `.await` instead of `Runtime::new()?.block_on()`.

### Error: "multiple binaries with the same name"

This means another package in your workspace is also trying to use the `bootstrap` binary name.

**Solution**: See `cargo-pmcp/docs/BINARY_NAMING_CONVENTIONS.md` for guidance on resolving conflicts.

### Lambda times out on first request

Cold starts can take a few seconds. Consider:
- Increasing Lambda timeout (default: 30s)
- Using provisioned concurrency
- Optimizing server initialization

## Learn More

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [cargo-pmcp Documentation](../../cargo-pmcp/README.md)
- [Binary Naming Conventions](../../cargo-pmcp/docs/BINARY_NAMING_CONVENTIONS.md)
