# AWS Serverless Project Structure Standards

## Overview

This document outlines the folder structure and organizational standards for AWS serverless applications. These standards follow AWS Serverless Best Practices and implement a clean separation between frontend and backend concerns, enabling consistency across multiple projects.

## Root Directory Structure

```
project-name/
├── backend/                 # Node.js serverless backend
├── frontend/               # React.js frontend application
├── infrastructure/         # IaC resources
├── docs/                   # Project documentation
├── scripts/                # Build and deployment scripts
├── .github/                # GitHub Actions workflows
├── package.json            # Root package.json for workspace management
├── .gitignore              # Git ignore patterns
└── README.md               # Project documentation
```

## Backend Structure Standards

The backend follows AWS Serverless Best Practices with a hybrid architecture:

- **Python Agents**: Containerized with AgentCore Runtime (Strands SDK)
- **Node.js APIs**: Lambda functions for REST endpoints and data processing

```
backend/
├── src/
│   ├── functions/          # Node.js Lambda function implementations
│   └── agents/             # Python agent implementations (containerized)
├── docs/                   # Documentation and images
├── portman/                # API testing configuration
├── coverage/               # Test coverage reports
├── tmp/                    # Temporary build artifacts
├── package.json            # Node.js API dependencies and scripts
├── requirements.txt        # Python agent dependencies
├── openapi.yaml            # OpenAPI 3.0 specification
├── eslint.config.mjs       # ESLint configuration (Node.js)
└── pyproject.toml          # Python configuration and linting
```

### Hybrid Architecture Organization

#### Node.js API Functions (src/functions/)

Lambda functions for REST APIs organized by domain/resource type:

```
src/functions/
├── [domain-1]/              # Business domain grouping (e.g., users, health-profiles)
│   ├── create-[resource]/
│   │   ├── index.mjs        # Main Lambda handler (Node.js)
│   │   └── tests/           # Unit tests for this function
│   ├── get-[resource]/
│   ├── get-[resources]/     # List/search endpoints
│   ├── update-[resource]/
│   ├── delete-[resource]/
│   └── [custom-operation]/  # Domain-specific operations
├── [domain-2]/
│   ├── create-[resource]/
│   ├── get-[resource]/
│   └── [custom-operations]/
└── shared/                  # Cross-domain shared utilities (Node.js)
```

#### Python Agent Organization (src/agents/)

Containerized agents using Strands SDK and AgentCore Runtime:

```
src/agents/
├── [agent-name]/            # Individual agent implementations
│   ├── agent.py            # Main agent implementation (Python)
│   ├── Dockerfile          # Container configuration
│   ├── requirements.txt    # Python dependencies
│   ├── config/             # Agent-specific configuration
│   ├── prompts/            # Agent prompts and instructions
│   ├── tools/              # Agent-specific tools
│   └── tests/              # Agent unit tests (pytest)
└── shared/                 # Shared agent utilities (Python)
```

**Example Implementation:**

```
src/functions/
├── users/
│   ├── create-user/
│   ├── get-user/
│   ├── get-users/
│   ├── update-user/
│   ├── delete-user/
│   └── reset-password/
├── orders/
│   ├── create-order/
│   ├── get-order/
│   ├── get-orders/
│   ├── update-order/
│   ├── cancel-order/
│   └── process-payment/
└── shared/
```

### Multi-Agent System Organization

For multi-agent systems using Amazon Bedrock AgentCore and AWS Strands SDK:

#### Amazon Bedrock AgentCore Services

- **Runtime**: Secure, serverless runtime for deploying and scaling AI agents
- **Identity**: Secure agent identity and access management with credential providers
- **Memory**: Short-term and long-term memory for context-aware agents
- **Gateway**: Secure tool discovery and API transformation for agent integration
- **Observability**: Tracing, debugging, and monitoring agent performance

#### AWS Strands SDK

- Python-based open-source framework with model-first approach for building autonomous agents
- Native support for Model Context Protocol (MCP)
- Integration with Amazon Bedrock, AWS Lambda, and other AWS services
- Support for multiple foundation models (Claude, Nova, etc.)

```
# Python Agents (containerized with AgentCore Runtime)
src/agents/
├── architecture-agent/
│   ├── agent.py            # Main agent implementation (Python + Strands)
│   ├── Dockerfile          # Container configuration
│   ├── requirements.txt    # Python dependencies
│   ├── config/
│   │   ├── agent-config.json # AgentCore configuration
│   │   └── prompts.yaml    # Agent prompts
│   └── tests/              # pytest unit tests
├── code-generation-agent/
├── code-review-agent/
├── testing-agent/
├── documentation-agent/
├── deployment-agent/
├── monitoring-agent/
└── shared/                 # Shared Python utilities
    ├── agentcore_client.py # AgentCore service clients
    ├── strands_utils.py    # Strands SDK utilities
    └── agent_base.py       # Base agent class

# Node.js APIs (Lambda functions)
src/functions/
├── workflows/              # Multi-agent workflow orchestration (Node.js)
│   ├── development-workflow/
│   │   ├── index.mjs       # Workflow orchestration handler
│   │   ├── workflow-definition.json
│   │   └── tests/
│   ├── code-review-workflow/
│   └── deployment-workflow/
├── api/                    # REST API endpoints (Node.js)
│   ├── projects/
│   ├── code-repositories/
│   ├── agent-proxy/        # Proxy to invoke Python agents
│   └── system-status/
└── shared/                 # Node.js shared utilities
    ├── agent-communication/ # Agent invocation utilities
    ├── workflow-utils/     # Workflow orchestration utilities
    └── agentcore-clients/  # AgentCore service clients (Node.js)
```

### Agent Configuration Structure

Each Python agent should include standardized configuration:

```
src/agents/[agent-name]/
├── agent.py               # Main agent implementation (Python + Strands)
├── Dockerfile             # Container configuration for AgentCore Runtime
├── requirements.txt       # Python dependencies
├── config/                # Agent configuration
│   ├── agent-config.json  # AgentCore Runtime configuration
│   ├── prompts.yaml       # Agent prompts and instructions
│   └── model-config.yaml  # Model-specific settings
├── tools/                 # Agent-specific tools (Python)
│   ├── __init__.py
│   └── [tool-name].py
├── schemas/               # Input/output schemas
│   ├── input-schema.json
│   └── output-schema.json
└── tests/
    ├── test_agent.py      # Unit tests (pytest)
    ├── test_tools.py      # Tool tests
    └── fixtures/          # Test data and mocks
```

### Workflow Organization

Multi-agent workflows orchestrated by Node.js Lambda functions:

```
src/functions/workflows/[workflow-name]/
├── index.mjs              # Workflow orchestration handler (Node.js)
├── workflow-definition.json # Workflow configuration
├── steps/                 # Individual workflow steps (Node.js)
│   ├── step-1-validation.mjs
│   ├── step-2-agent-coordination.mjs  # Invokes Python agents
│   └── step-3-result-aggregation.mjs
└── tests/
    ├── workflow.test.mjs  # Workflow integration tests (Vitest)
    └── steps/             # Individual step tests
```

### Shared Modules Structure

#### Node.js Shared Utilities (src/shared/)

```
src/shared/
├── apigateway/             # API Gateway response utilities
├── data-access/            # Database access layer
├── dynamodb/               # DynamoDB utilities and configuration
├── lambda-powertools/      # AWS Lambda Powertools setup
├── models/                 # Data models and validation schemas
├── agent-communication/    # Agent invocation utilities
├── workflow-utils/         # Workflow orchestration utilities
└── agentcore-clients/      # AgentCore service clients (Node.js)
```

#### Python Shared Utilities (src/agents/shared/)

```
src/agents/shared/
├── __init__.py
├── agent_base.py           # Base agent class with common functionality
├── agentcore_client.py     # AgentCore service clients (Python)
├── strands_utils.py        # Strands SDK utilities
├── memory_manager.py       # Memory management utilities
├── tool_registry.py        # Tool registration and management
└── observability.py        # Logging and monitoring utilities
```

## Frontend Structure Standards

The frontend follows React.js best practices with a component-based architecture:

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # Application favicon
│   └── [app-assets]/       # Static assets (images, icons)
├── src/
│   ├── components/         # Reusable React components
│   │   ├── [Component].js  # Feature-specific components
│   │   ├── [Component].css # Component styles
│   │   └── common/         # Shared/common components
│   ├── pages/              # Route-based page components
│   │   ├── [PageName].js
│   │   └── [PageName].css
│   ├── services/           # API integration layer
│   │   ├── api.js          # Centralized API client
│   │   └── [domain]Api.js  # Domain-specific API modules
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── context/            # React context providers
│   ├── constants/          # Application constants
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── App.css             # Global styles
├── build/                  # Production build artifacts
├── package.json            # Frontend dependencies
└── README.md               # Frontend-specific documentation
```

## File Naming Conventions

### Backend APIs (Node.js/Lambda)

- **Lambda handlers**: `index.mjs` (ESM modules)
- **Test files**: `*.test.mjs` or organized in `tests/` folders
- **Configuration**: `*.yaml` for CloudFormation/SAM, `*.json` for API specs
- **Shared modules**: Descriptive names following camelCase

### Backend Agents (Python/Containers)

- **Agent implementations**: `agent.py` (main agent file)
- **Test files**: `test_*.py` or organized in `tests/` folders
- **Configuration**: `*.yaml` for agent config, `*.json` for schemas
- **Shared modules**: Descriptive names following snake_case
- **Tools**: `[tool_name].py` in tools/ directory

### Frontend (React)

- **Components**: PascalCase (e.g., `UserForm.js`, `OrderList.js`)
- **Pages**: PascalCase (e.g., `Dashboard.js`, `UserProfile.js`)
- **Services**: camelCase (e.g., `api.js`, `userApi.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`, `useApi.js`)
- **Utils**: camelCase (e.g., `formatDate.js`, `validation.js`)
- **Styles**: Match component/page name (e.g., `UserForm.css`)
- **Test files**: `*.test.js` or `*.spec.js`

## Configuration Management

### Environment-Specific Configuration

- **Development**: Local configuration files and environment variables
- **Staging/Production**: AWS Systems Manager Parameter Store or AWS Secrets Manager
- **API Configuration**: Centralized in `frontend/src/services/api.js`
- **Environment Files**: `.env.local`, `.env.development`, `.env.production`

### Build Configuration

- **Backend**: SAM template (`template.yaml`) with build specifications
- **Frontend**: React build process with environment-specific builds
- **CI/CD**: GitHub Actions workflows
- **Infrastructure**: SAM templates in `infrastructure/` folder

## Testing Organization

### Backend Testing

```
backend/src/functions/[function-name]/tests/
├── unit.test.mjs           # Unit tests
├── integration.test.mjs    # Integration tests
└── fixtures/               # Test data and mocks
```

### Frontend Testing

```
frontend/src/
├── components/
│   ├── [ComponentName]/
│   │   ├── index.js        # Component implementation
│   │   ├── [ComponentName].test.js
│   │   └── [ComponentName].css
│   └── common/
│       ├── [SharedComponent].js
│       └── [SharedComponent].test.js
├── pages/
│   ├── [PageName].js
│   └── [PageName].test.js
├── services/
│   ├── api.js
│   ├── api.test.js
│   └── [domainApi].test.js
└── hooks/
    ├── [hookName].js
    └── [hookName].test.js
```

## Documentation Standards

### Code Documentation

- **README.md**: Project overview, setup instructions, and usage
- **API Documentation**: Generated from OpenAPI specification
- **Component Documentation**: JSDoc comments for complex components
- **Function Documentation**: Clear function descriptions and parameter documentation
- **Architecture Diagrams**: System architecture and data flow diagrams

### Architecture Documentation

- **Flow Diagrams**: Visual representation of data flow
- **API Specifications**: OpenAPI 3.0 complete documentation
- **Deployment Guides**: Step-by-step deployment instructions
- **Infrastructure Diagrams**: AWS architecture diagrams
- **Decision Records**: Architectural Decision Records (ADRs) for significant decisions

## Dependencies Management

### Backend Dependencies

- **Runtime**: Node.js 22.x with ESM modules
- **AWS SDK**: Latest v3 SDK with specific service clients
- **Testing**: Vitest, c8 for coverage
- **Utilities**: AWS Lambda Powertools for observability

### Frontend Dependencies

- **Framework**: React.js with modern hooks
- **HTTP Client**: Fetch API
- **State Management**: Context API, Redux
- **UI Library**: Tailwind CSS
- **Testing**: React Testing Library, Jest
- **Build Tools**: Create React App, Vite, or custom Webpack configuration

## Security and Compliance

### File Security

- **Secrets**: Never commit secrets; use environment variables
- **API Keys**: Stored in AWS Systems Manager Parameter Store
- **Sensitive Data**: Excluded via `.gitignore` patterns

### Access Control

- **IAM Roles**: Least privilege principle for Lambda execution
- **API Security**: AWS Cognito User Pools, API Keys, or custom authorizers
- **CORS**: Proper configuration for cross-origin requests
- **Resource Policies**: S3 bucket policies, DynamoDB access policies

## Build and Deployment

### Backend Deployment

- **SAM CLI**: For local development and testing
- **SAM**: Infrastructure as Code
- **CI/CD**: GitHub Actions
- **Multi-Environment**: Separate deployments for dev/staging/production

### Frontend Deployment

- **S3 + CloudFront**: Static site hosting with CDN
- **Environment Variables**: Build-time configuration
- **Static Assets**: Optimized for CDN delivery

## Maintenance Standards

### Code Quality

- **Linting**: ESLint for JavaScript/Node.js code and frontend code
- **Formatting**: Consistent code formatting rules
- **Type Safety**: JSDoc comments for type documentation

### Monitoring

- **Logs**: Structured logging with Lambda Powertools
- **Metrics**: Custom CloudWatch metrics
- **Alerts**: CloudWatch alarms for critical issues

### Updates

- **Dependencies**: Regular updates with security audits
- **Runtime**: Keep Lambda runtime updated
- **API Versions**: Semantic versioning for API changes

## Best Practices Summary

1. **Separation of Concerns**: Clear boundaries between frontend and backend
2. **Single Responsibility**: One Lambda function per API endpoint
3. **Code Reusability**: Shared modules for common functionality
4. **Testing**: Comprehensive unit and integration tests
5. **Documentation**: Keep documentation current with code changes
6. **Security**: Follow AWS security best practices
7. **Monitoring**: Implement comprehensive observability
8. **Scalability**: Design for growth and high availability

## Domain-Specific Patterns

### E-commerce Applications

```
src/functions/
├── products/
│   ├── create-product/
│   ├── get-product/
│   ├── search-products/
│   └── update-inventory/
├── orders/
│   ├── create-order/
│   ├── process-payment/
│   └── update-status/
├── users/
│   ├── register-user/
│   ├── authenticate/
│   └── update-profile/
└── analytics/
    ├── track-event/
    └── generate-report/
```

### Content Management Systems

```
src/functions/
├── content/
│   ├── create-article/
│   ├── publish-content/
│   └── moderate-content/
├── media/
│   ├── upload-file/
│   ├── process-image/
│   └── generate-thumbnail/
├── users/
│   ├── manage-permissions/
│   └── audit-actions/
└── notifications/
    ├── send-email/
    └── push-notification/
```

### Data Processing Applications

```
src/functions/
├── ingestion/
│   ├── receive-data/
│   ├── validate-format/
│   └── queue-processing/
├── processing/
│   ├── transform-data/
│   ├── enrich-data/
│   └── aggregate-metrics/
├── storage/
│   ├── save-to-warehouse/
│   └── archive-data/
└── reporting/
    ├── generate-dashboard/
    └── export-report/
```

## Using This Template

### For New Projects

1. **Replace placeholders** with your specific domain terms:

   - `[domain]` → your business domain (e.g., `users`, `products`, `content`)
   - `[resource]` → your resource types (e.g., `user`, `product`, `article`)
   - `[app-assets]` → your application name and assets

2. **Choose your domain pattern** from the examples provided or create your own

3. **Adapt folder structure** to your specific needs while maintaining the core principles

### For Existing Projects

1. **Gradually migrate** to this structure during refactoring cycles
2. **Prioritize high-impact areas** like shared utilities and configuration
3. **Update documentation** to match the new structure
4. **Ensure team alignment** on the new standards

## Multi-Agent System Patterns

### Software Development Agent Examples

For the software development multi-agent system, here are specific domain patterns:

```
src/functions/
├── agents/
│   ├── architecture-agent/         # System design and architecture
│   │   ├── index.mjs
│   │   ├── agent-config.json
│   │   ├── prompts/
│   │   │   ├── architecture-design-prompts.txt
│   │   │   └── technology-selection-prompts.txt
│   │   └── tests/
│   ├── code-generation-agent/      # Code writing and implementation
│   │   ├── index.mjs
│   │   ├── agent-config.json
│   │   ├── prompts/
│   │   │   ├── code-generation-prompts.txt
│   │   │   ├── best-practices-prompts.txt
│   │   │   └── pattern-implementation-prompts.txt
│   │   └── tests/
│   ├── code-review-agent/          # Code quality and review
│   │   ├── index.mjs
│   │   ├── agent-config.json
│   │   ├── prompts/
│   │   │   ├── code-review-prompts.txt
│   │   │   └── security-analysis-prompts.txt
│   │   └── tests/
│   ├── testing-agent/              # Test generation and validation
│   ├── documentation-agent/        # Technical documentation
│   ├── deployment-agent/           # CI/CD and infrastructure
│   └── shared-agent-utils/
│       ├── agentcore-client.mjs
│       ├── strands-client.mjs
│       ├── agent-communication.mjs
│       └── prompt-templates.mjs
├── workflows/
│   ├── development-workflow/       # Full development lifecycle
│   │   ├── index.mjs
│   │   ├── workflow-definition.json
│   │   └── steps/
│   │       ├── requirements-analysis.mjs
│   │       ├── architecture-design.mjs
│   │       ├── code-generation.mjs
│   │       └── testing-validation.mjs
│   ├── code-review-workflow/       # Code review process
│   │   ├── index.mjs
│   │   ├── workflow-definition.json
│   │   └── steps/
│   │       ├── static-analysis.mjs
│   │       ├── security-scan.mjs
│   │       ├── performance-review.mjs
│   │       └── generate-feedback.mjs
│   └── deployment-workflow/        # Deployment and monitoring
└── api/
    ├── projects/
    ├── code-repositories/
    ├── build-pipelines/
    └── deployment-status/
```

### Agent Communication Patterns

Agents should follow these communication patterns:

1. **Event-Driven Communication**: Agents communicate through AWS EventBridge or SQS
2. **Workflow Orchestration**: Amazon Bedrock AgentCore Runtime coordinates multi-agent workflows
3. **State Management**: DynamoDB stores agent state and conversation history
4. **Result Sharing**: Agents share results through standardized data contracts

### Configuration Management for Agents

Each agent should have environment-specific configuration:

```
src/functions/agents/[agent-name]/
├── config/
│   ├── dev.json            # Development environment config
│   ├── staging.json        # Staging environment config
│   └── prod.json           # Production environment config
├── prompts/
│   ├── system-prompts/     # Core agent behavior prompts
│   ├── interaction-prompts/ # User interaction prompts
│   └── error-prompts/      # Error handling prompts
└── schemas/
    ├── input-validation.json
    ├── output-format.json
    └── agent-metadata.json
```

This structure ensures that each agent is:

- Independently deployable and testable
- Properly configured for different environments
- Following consistent patterns for maintainability
- Integrated with the overall workflow orchestration system