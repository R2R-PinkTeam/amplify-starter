# Requirements Document

## Introduction

GumWall.ai is a monumentally over-engineered AI-powered platform that helps users plan and create their own gum walls. The system employs a multi-agent architecture with complex AWS infrastructure to solve a problem nobody has.

The POC focuses on three specialized agents with simple responsibilities: one scores the wall, one writes a proposal, one tracks progress. The complexity lives in the AWS architecture, not the agent logic.

## Glossary

- **Gum Wall**: A wall covered in chewed gum, inspired by Seattle's famous Post Alley Gum Wall
- **Gum Receptivity Score**: An AI-generated metric (0-100) indicating wall suitability for gum
- **Gum Wall Site Selection Agent**: AI agent that scores a wall's gum potential
- **Municipal Gum Wall Proposal Agent**: AI agent that generates a city council proposal
- **Gum Wall Progress Tracker Agent**: AI agent that estimates progress toward Seattle-level density
- **Seattle-Level Density**: Approximately 1 million pieces of gum
- **Feasibility Report**: The combined output from all agents

## Requirements

### Requirement 1

**User Story:** As an aspiring gum wall creator, I want to upload a photo of a wall, so that I can have it analyzed.

#### Acceptance Criteria

1. WHEN a user uploads an image THEN the System SHALL accept JPEG and PNG formats
2. WHEN an image is uploaded THEN the System SHALL store the image in S3
3. WHEN the upload succeeds THEN the System SHALL trigger the agent pipeline

### Requirement 2

**User Story:** As an aspiring gum wall creator, I want the Site Selection Agent to score my wall, so that I know if it's gum-worthy.

#### Acceptance Criteria

1. WHEN the pipeline starts THEN the Site Selection Agent SHALL analyze the image using Amazon Bedrock
2. WHEN analysis completes THEN the Site Selection Agent SHALL return a Gum Receptivity Score (0-100)
3. WHEN the score is below 30 THEN the Site Selection Agent SHALL reject the wall with a snarky comment
4. WHEN responding THEN the Site Selection Agent SHALL use a Gordon Ramsay personality

### Requirement 3

**User Story:** As an aspiring gum wall creator, I want the Proposal Agent to generate a city council proposal, so that I can petition my city.

#### Acceptance Criteria

1. WHEN wall analysis passes THEN the Proposal Agent SHALL generate a formal proposal
2. WHEN generating the proposal THEN the Proposal Agent SHALL include a "Hygiene Concerns (We Can't Address)" section
3. WHEN responding THEN the Proposal Agent SHALL use a passive-aggressive HOA president personality

### Requirement 4

**User Story:** As an aspiring gum wall creator, I want the Progress Tracker Agent to estimate my progress, so that I know how far I am from Seattle-level density.

#### Acceptance Criteria

1. WHEN the proposal completes THEN the Progress Tracker Agent SHALL estimate current gum count
2. WHEN analyzing THEN the Progress Tracker Agent SHALL calculate percentage toward 1 million pieces
3. WHEN responding THEN the Progress Tracker Agent SHALL use a Gen-Z hype beast personality with emoji

### Requirement 5

**User Story:** As an aspiring gum wall creator, I want a combined Feasibility Report, so that I can see all insights together.

#### Acceptance Criteria

1. WHEN all agents complete THEN the System SHALL compile a unified Feasibility Report
2. WHEN displaying the report THEN the System SHALL show each agent's contribution with attribution

### Requirement 6

**User Story:** As a developer, I want the system to use Amazon Bedrock AgentCore, so that we achieve maximum over-engineering with cutting-edge managed services.

#### Acceptance Criteria

1. WHEN processing requests THEN the System SHALL use Amazon Bedrock for foundation model access
2. WHEN implementing agents THEN the System SHALL use the Strands SDK with BedrockAgentCoreApp wrapper
3. WHEN deploying agents THEN the System SHALL use AgentCore Runtime for managed agent hosting
4. WHEN orchestrating agents THEN the System SHALL use Strands SDK multi-agent patterns
5. WHEN handling images THEN the System SHALL use S3 for storage
6. WHEN exposing the API THEN the System SHALL use AgentCore Runtime's built-in HTTP endpoint

### Requirement 7

**User Story:** As a developer, I want the agent to function as an MCP client, so that it can call external MCP servers for additional tools.

#### Acceptance Criteria

1. WHEN the agent initializes THEN the System SHALL configure an MCPClient using Strands SDK
2. WHEN the agent needs external tools THEN the System SHALL connect to the configured MCP server
3. WHEN calling MCP tools THEN the System SHALL use the managed MCPClient integration pattern
