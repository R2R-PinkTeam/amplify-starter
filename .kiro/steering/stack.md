# Technology Stack

## Core Technologies

- **Agent Development**: Python 3.11+ with Strands SDK
- **AI/ML Platform**: Amazon Bedrock (Claude Sonnet 4)
- **Agent Framework**: AWS Strands SDK with BedrockAgentCoreApp wrapper
- **Agent Runtime**: Amazon Bedrock AgentCore Runtime
- **Storage**: Amazon S3 (image uploads)
- **Database**: Amazon DynamoDB (session storage, analysis results)
- **API Runtime**: AWS Lambda (arm64 architecture)
- **API Gateway**: AWS API Gateway with OpenAPI 3.0
- **MCP Integration**: Strands MCPClient for external tools
- **Infrastructure**: SAM (Serverless Application Model)

## Build System

- **Agent Package Manager**: pip (Python agents with requirements.txt)
- **Agent CLI**: agentcore CLI for local testing and deployment
- **Build Tool**: SAM (Serverless Application Model)
- **Infrastructure as Code**: SAM Templates

## Development Environment

- Required Tools: AWS CLI, Python 3.11+, pip, agentcore CLI
- Recommended IDE/Editor: VS Code with Python extension
- **Agent Testing**: pytest with Hypothesis (property-based testing)
- **Agent Linting**: ruff

## AI and Agent Technologies

### Amazon Bedrock AgentCore Services

- **AgentCore Runtime**: Secure, serverless runtime for deploying and scaling AI agents
- **AgentCore CLI**: Local testing with `agentcore launch --local` and deployment with `agentcore launch`

### AWS Strands SDK

- Open-source framework with model-first approach for building autonomous AI agents
- Native Model Context Protocol (MCP) integration via MCPClient
- BedrockAgentCoreApp wrapper for AgentCore Runtime deployment
- @tool decorator for defining agent tools

## Common Commands

### Setup

```bash
# Install agent dependencies
pip install -r requirements.txt

# Install agentcore CLI
pip install bedrock-agentcore
```

### Local Development

```bash
# Test agent locally
agentcore launch --local

# Configure for deployment
agentcore configure --entrypoint agent.py
```

### Deploy

```bash
# Deploy to AgentCore Runtime
agentcore launch

# Test deployed agent
agentcore invoke --payload '{"s3_image_url": "s3://bucket/image.jpg"}'
```

### Test

```bash
# Run agent tests
pytest

# Run with coverage
pytest --cov=backend/src/agents

# Lint
ruff check backend/src/agents/
```

## Dependencies

### Agent Dependencies (Python)

- strands-agents: AI agent framework
- strands-agents-tools: Tool utilities including MCP
- bedrock-agentcore: AgentCore Runtime integration
- boto3: AWS SDK for Python
- mcp: Model Context Protocol client
- pytest: Testing framework
- hypothesis: Property-based testing
- ruff: Fast Python linter

### Infrastructure Dependencies

- @aws-sdk/client-s3: S3 operations
- @aws-sdk/client-dynamodb: DynamoDB operations
- @aws-lambda-powertools/logger: Structured logging
- @aws-lambda-powertools/tracer: Distributed tracing

## Version Requirements

- **Python**: 3.11+ (for Strands SDK compatibility)
- **AWS CLI**: Latest
- **SAM CLI**: Latest
- **pip**: Latest

## Project Structure

```
backend/src/agents/gumwall-agent/
├── agent.py              # Main agent with BedrockAgentCoreApp
├── requirements.txt      # Python dependencies
└── tools/
    ├── __init__.py
    ├── site_selection.py # Gordon Ramsay personality
    ├── proposal.py       # HOA president personality
    └── progress.py       # Gen-Z hype beast personality
```
