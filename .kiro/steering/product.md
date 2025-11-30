# Product Overview

GumWall.ai is a monumentally over-engineered AI-powered platform that helps users plan and create their own gum walls. Built using AWS serverless technologies including Amazon Bedrock AgentCore and AWS Strands SDK.

## Purpose

Help aspiring gum wall creators evaluate wall suitability, generate city council proposals, and track progress toward Seattle-level gum density (approximately 1 million pieces).

## Problem Statement

Aspiring gum wall creators struggle with:

- No way to evaluate if their wall is suitable for gum
- Difficulty creating formal proposals for city councils
- No tracking of progress toward iconic gum wall status
- Lack of AI-powered snark in their gum wall planning process

## Solution: GumWall.ai Multi-Agent System

A single orchestrator agent with three specialized tools, each with a distinct personality:

### Core Tools

1. **Site Selection Tool** (Gordon Ramsay personality) → Analyzes wall photos and returns a Gum Receptivity Score (0-100)
2. **Proposal Tool** (Passive-aggressive HOA president personality) → Generates formal city council proposals with a "Hygiene Concerns (We Can't Address)" section
3. **Progress Tracker Tool** (Gen-Z hype beast personality) → Estimates gum count and calculates percentage toward 1 million pieces

### Output

A unified **Feasibility Report** combining all three agent outputs with attribution.

## Key Features

- **Image Analysis**: Upload wall photos for AI-powered gum receptivity scoring
- **Personality-Driven Responses**: Each tool has a distinct, entertaining personality
- **Formal Proposal Generation**: Ready-to-submit city council proposals
- **Progress Tracking**: Know exactly how far you are from Seattle-level density
- **Conversational AI Chat**: Ask questions about costs, recommended color palettes, gum types, maintenance tips, and more
- **MCP Client Integration**: Agent can call external MCP servers for additional tools
- **Serverless Architecture**: Built on AWS with AgentCore Runtime

## Target Users

- Aspiring gum wall creators
- City council proposal writers
- People who appreciate over-engineered solutions to problems nobody has
- Hackathon judges who appreciate humor

## Conversational Features

Users can chat with the AI to ask questions like:

- "How much will this gum wall cost to create?"
- "What color palette would look best on my brick wall?"
- "What types of gum stick best?"
- "How do I maintain a gum wall?"
- "What's the history of the Seattle Gum Wall?"

## Technical Architecture

- **Storage**: Amazon S3 (image uploads)
- **Database**: Amazon DynamoDB (session storage, analysis results)
- **API**: AWS Lambda + API Gateway
- **AI/ML Platform**: Amazon Bedrock (Claude Sonnet 4)
- **Agent Framework**: AWS Strands SDK with BedrockAgentCoreApp wrapper
- **Agent Runtime**: Amazon Bedrock AgentCore Runtime
- **MCP Integration**: MCPClient for external tool access
- **Infrastructure**: SAM (Serverless Application Model)

## Core Flow

1. User uploads wall image to S3 bucket
2. User sends S3 URL to AgentCore Runtime endpoint
3. GumWall Agent calls site_selection_tool
4. GumWall Agent calls proposal_tool (if wall passes)
5. GumWall Agent calls progress_tool
6. Agent returns unified Feasibility Report

## Development Status

- Spec and design complete
- Ready for implementation
- POC scope: Tools + AgentCore deployment (teammates handle S3 infrastructure)
