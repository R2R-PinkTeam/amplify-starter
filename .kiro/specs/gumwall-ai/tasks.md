# Implementation Plan

## Scope: Tools + AgentCore

This plan covers tool implementations and AgentCore deployment. Teammates handle S3 and other infrastructure.

- [ ] 1. Set up agent project structure

  - [ ] 1.1 Create backend/src/agents/gumwall-agent/ directory structure
    - Create agent.py, requirements.txt, and tools/ directory
    - _Requirements: 6.2_
  - [ ] 1.2 Configure requirements.txt with dependencies
    - Add strands-agents, bedrock-agentcore, boto3, mcp
    - _Requirements: 6.2, 7.1_

- [ ] 2. Implement Site Selection Tool

  - [ ] 2.1 Create site_selection_tool function
    - Implement tool that calls Bedrock with Gordon Ramsay prompt
    - Return score (0-100), is_rejected flag, and commentary
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Implement Proposal Tool

  - [ ] 3.1 Create proposal_tool function
    - Implement tool that generates city council proposal with HOA president prompt
    - Include "Hygiene Concerns (We Can't Address)" section
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Implement Progress Tracker Tool

  - [ ] 4.1 Create progress_tool function
    - Implement tool that estimates gum count with Gen-Z hype beast prompt
    - Calculate percentage toward 1 million pieces
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Implement GumWall Agent with AgentCore wrapper

  - [ ] 5.1 Create main agent with BedrockAgentCoreApp wrapper
    - Set up BedrockAgentCoreApp with @app.entrypoint decorator
    - Wire up all three tools to Strands Agent
    - Implement invoke function that orchestrates tool calls
    - _Requirements: 6.2, 6.3_
  - [ ] 5.2 Configure MCPClient for external MCP server integration
    - Set up MCPClient with managed integration pattern
    - Add MCP tools to agent alongside local tools
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ] 5.3 Create system prompt for agent orchestration
    - Define how agent should orchestrate tool calls
    - Include instructions for compiling Feasibility Report
    - _Requirements: 5.1, 5.2_

- [ ] 6. Local testing

  - [ ] 6.1 Test agent locally with agentcore CLI
    - Run `agentcore launch --local` to test locally
    - Verify agent responds and tools execute correctly
    - _Requirements: 6.3_

- [ ] 7. Deploy to AgentCore Runtime

  - [ ] 7.1 Configure agent for AgentCore deployment
    - Run `agentcore configure --entrypoint agent.py`
    - _Requirements: 6.3_
  - [ ] 7.2 Deploy agent to AgentCore Runtime
    - Run `agentcore launch`
    - _Requirements: 6.3, 6.6_
  - [ ] 7.3 Test deployed agent
    - Run `agentcore invoke` with test payload
    - Verify feasibility report is returned
    - _Requirements: 5.1, 5.2_

- [ ] 8. Final Checkpoint
  - Ensure agent is deployed and all tools working, ask the user if questions arise.
