# Technology Stack

## Core Technologies

- **Agent Development**: Python 3.11+ with Strands SDK (AI agents only)
- **API Development**: Node.js 22.x with ESM modules (REST APIs and data processing)
- AI/ML Platform: Amazon Bedrock AgentCore (Runtime, Identity, Memory, Gateway, Observability)
- Agent Framework: AWS Strands SDK (Python-based open-source agent development framework)
- Agent Runtime: Amazon Bedrock AgentCore Runtime (containerized Python agents)
- API Runtime: AWS Lambda (arm64 architecture, Node.js for APIs and data processing)
- API: AWS API Gateway with OpenAPI 3.0
- Database: Amazon DynamoDB
- Authentication: AWS Cognito (planned)

## Build System

- Build Tool: SAM (Serverless Application Model)
- **Agent Package Manager**: pip (Python agents with requirements.txt)
- **API Package Manager**: npm (Node.js APIs with package.json)
- Agent Bundler: Docker containers for AgentCore Runtime
- API Bundler: ESBuild (optimized for Lambda)
- Infrastructure as Code: SAM Templates

## Development Environment

- Required Tools: AWS CLI, SAM CLI, Docker, Python 3.11+, Node.js 22.x, pip, npm
- Recommended IDE/Editor: VS Code with AWS extensions, Python extension
- **Agent Testing**: pytest (Python agents)
- **API Testing**: Vitest (Node.js APIs)
- **Agent Linting**: ruff or flake8 (Python)
- **API Linting**: ESLint (Node.js)
- **Agent Coverage**: coverage.py
- **API Coverage**: c8

## AI and Agent Technologies

- Amazon Bedrock AgentCore Runtime: Secure, serverless runtime for deploying and scaling AI agents
- Amazon Bedrock AgentCore Identity: Secure agent identity and access management
- Amazon Bedrock AgentCore Memory: Context-aware agents with short-term and long-term memory
- Amazon Bedrock AgentCore Gateway: Secure tool discovery and API transformation
- Amazon Bedrock AgentCore Observability: Tracing, debugging, and monitoring agent performance
- AWS Strands SDK: Open-source framework for building autonomous AI agents with model-first approach
- Lambda Powertools: Observability and structured logging

## Common Commands

### Setup

```bash
# Install API dependencies (Node.js)
npm install

# Install agent dependencies (Python)
pip install -r requirements.txt

# Install SAM CLI (if not already installed)
# macOS: brew install aws-sam-cli
# Other: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# Install Docker for agent containerization
# macOS: brew install --cask docker
# Other: https://docs.docker.com/get-docker/
```

### Build

```bash
# Build SAM application
sam build

# Validate SAM template
sam validate

# Lint SAM template
sam validate --lint
```

### Test

```bash
# Run API tests (Node.js)
npm test
npm run test:coverage
npm run lint

# Run agent tests (Python)
pytest
pytest --cov=src/agents
ruff check src/agents/
```

### Deploy

```bash
# Deploy to development
sam deploy --config-env dev

# Deploy to staging
sam deploy --config-env staging

# Deploy to production
sam deploy --config-env prod
```

## Dependencies

### API Dependencies (Node.js)

- @aws-lambda-powertools/logger: Structured logging
- @aws-lambda-powertools/tracer: Distributed tracing
- @aws-lambda-powertools/metrics: Custom metrics
- @middy/core: Lambda middleware engine
- aws-sdk (v3): AWS service clients
- vitest: Testing framework
- c8: Code coverage

### Agent Dependencies (Python)

- strands-agents: AI agent framework
- bedrock-agentcore: AgentCore Runtime integration
- boto3: AWS SDK for Python
- pytest: Testing framework
- coverage: Code coverage
- ruff: Fast Python linter

## Version Requirements

- **Agents**: Python 3.11+ (for Strands SDK compatibility)
- **APIs**: Node.js 22.x LTS
- AWS CLI: Latest
- SAM CLI: Latest
- Docker: Latest (for agent containerization)
- pip: Latest
- npm: 10.x or higher

## Agent-Specific Technologies

### Amazon Bedrock AgentCore Services

- **AgentCore Runtime**: Secure, serverless runtime for deploying and scaling AI agents with extended runtime support, fast cold starts, and session isolation
- **AgentCore Identity**: Secure agent identity and access management with credential providers and just-enough access principles
- **AgentCore Memory**: Context-aware agents with short-term conversation memory and long-term memory shared across agents and sessions
- **AgentCore Gateway**: Secure tool discovery and API transformation, converting Lambda functions and services into agent-compatible tools
- **AgentCore Code Interpreter**: Secure code execution in isolated sandbox environments for data analysis and complex workflows
- **AgentCore Browser**: Cloud-based browser runtime for agents to interact with websites at scale
- **AgentCore Observability**: Unified operational dashboards with OpenTelemetry support for tracing, debugging, and monitoring

### AWS Strands SDK

- Open-source framework with model-first approach for building autonomous AI agents
- Native Model Context Protocol (MCP) integration for standardized context provision
- Support for multiple frameworks: LangGraph, CrewAI, and native Strands agents
- Foundation model flexibility: Claude, Amazon Nova (Premier, Pro, Lite, Micro), OpenAI, and others
- Multimodal capabilities: text, speech, and image processing
- AWS service integration: Amazon Bedrock, Lambda, Step Functions, and more