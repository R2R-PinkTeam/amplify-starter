# AWS Serverless Best Practices

## API Development Standards

### RESTful API Design

- Follow REST architectural principles for all API endpoints
- Use appropriate HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Implement proper HTTP status codes (200, 201, 400, 404, 500, etc.)
- Use consistent URL patterns and resource naming conventions
- Implement proper error handling with standardized error responses

### OpenAPI Integration

- Start with OpenAPI 3.0 specification as the single source of truth
- Use API Gateway's OpenAPI integration to generate API paths
- Schema validation for request bodies are handled by API Gateway, there is no need to do this type of schema validation in the Lambda functions or code.
- If in the design phase build the aws integration with the mock type.

## Runtime and Architecture Standards

### Node.js Runtime

- Use Node.js 22.x as the backend runtime for all Lambda functions
- Use ESM modules with .mjs file extensions for all Lambda functions
- Keep dependencies updated to latest stable versions using npm audit
- Implement proper dependency management with package-lock.json

### Architecture

- Use arm64 for the Lambda architecture for cost optimization
- Optimize bundle sizes for faster cold starts using ESBuild
- Implement single-responsibility principle with one Lambda function per API endpoint

## AWS Services Integration

### API Gateway

- Use API Gateway with OpenAPI integration for all API endpoints
- Implement proper CORS configuration for frontend integration in SAM
- Use API Gateway request validation based on OpenAPI schemas
- Configure appropriate throttling and rate limiting

### Lambda Functions

- Use AWS Lambda for all backend processing
- Implement single-responsibility principle for each Lambda function
- Use environment variables for configuration
- Implement proper error handling and retries
- Use ESBuild with optimized configuration for Lambda packaging
- Implement Middy middleware for Lambda Powertools integration
- Use shared utility modules for common functionality (API Gateway responses, Powertools setup)

### DynamoDB

- Use DynamoDB as the primary database
- Design efficient partition and sort key strategies
- Implement proper indexing for query patterns
- Use DynamoDB best practices for data modeling

## Observability and Monitoring

### Lambda Powertools

- Use AWS Lambda Powertools for Node.js for all Lambda functions
- Implement structured logging with Lambda Powertools Logger
- Add distributed tracing with Lambda Powertools Tracer
- Capture custom metrics with Lambda Powertools Metrics
- Follow Lambda Powertools best practices for:
  - Correlation IDs for request tracing
  - Structured logging with consistent log levels
  - Custom metrics for business and operational insights
  - Error handling and exception tracking

### Monitoring Standards

- Implement CloudWatch alarms for critical metrics
- Use X-Ray for distributed tracing across services
- Monitor Lambda function performance and errors
- Track API Gateway metrics and response times

## Development Workflow

### Code Quality

- Use ESLint for code formatting and linting following existing configuration
- Implement unit tests for all business logic using Vitest
- Maintain high code coverage standards with automated coverage reporting
- Use Spectral for OpenAPI specification linting and validation
- All validations should pass (build, linting, unit tests) before moving forward. Before closing out a task we need to run all validations (npm test, sam validate, sam validate --lint, etc)

### Testing Standards

- **Unit Tests**:
  - Required for all Lambda functions
  - Test business logic in isolation with mocked dependencies
  - Verify correct handling of various input scenarios
  - Verify error handling and edge cases
  - Use Vitest for test framework

- **Test Organization**:
  ```
  src/functions/[domain]/[function-name]/
  ├── index.mjs                # Lambda handler
  └── tests/
      └── index.test.mjs       # Unit tests
  ```

### Infrastructure as Code

- Use SAM for Infrastructure as Code
- Allow AWS to generate resource names where possible instead of specifying explicit names
- Define all resources (API Gateway, Lambda, DynamoDB) in the same stack
- Define tags globally in the samconfig.yaml file, not in individual templates
- Use environment variables to pass resource references between components
- Use CloudFormation outputs for important resource identifiers

### Deployment

- Implement CI/CD pipelines with GitHub Actions
- Use separate environments (dev, staging, production)
- Implement proper rollback strategies
- Include SAM resource creation/update as part of each implementation task