"""
GumWall AI Agent - Feasibility Report Generator

This agent evaluates potential gum wall locations and generates
comprehensive feasibility reports using specialized tools.

Deployed to Amazon Bedrock AgentCore Runtime with Strands SDK.
"""

from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp import MCPClient
from mcp import stdio_client, StdioServerParameters
from bedrock_agentcore.runtime import BedrockAgentCoreApp

# Import local tools
from tools.site_selection import site_selection_tool
from tools.proposal import proposal_tool
from tools.progress import progress_tool
from tools.cost_calculator import calculate_cost_tool
from tools.color_chart import generate_color_chart_tool

# Initialize BedrockAgentCoreApp
app = BedrockAgentCoreApp()

# System prompt for agent orchestration
SYSTEM_PROMPT = """You are the GumWall AI Feasibility Analyst, the world's premier expert in evaluating 
potential locations for new gum walls. Your mission is to analyze wall photos and generate comprehensive 
Feasibility Reports that combine insights from three specialized perspectives.

## Your Tools

You have access to three specialized tools:

1. **site_selection_tool**: Analyzes wall images with Gordon Ramsay's expert eye. Provides a Gum Receptivity 
   Score (0-100) and colorful commentary. Walls scoring below 30 are REJECTED.

2. **proposal_tool**: Generates formal city council proposals with a passive-aggressive HOA president 
   personality. Only works for walls that pass site selection (score >= 30). Always includes the 
   mandatory "Hygiene Concerns (We Can't Address)" section.

3. **progress_tool**: Estimates current gum count and calculates progress toward Seattle-level density 
   (1 million pieces) with Gen-Z hype beast energy and emojis.

4. **calculate_cost_tool**: Calculates the estimated cost of creating a gum wall based on gum count
   and color variety. Calls the API Gateway MCP server for cost calculations.

5. **generate_color_chart_tool**: Generates a color-by-numbers chart for a gum wall design. Calls
   the API Gateway MCP server to analyze the image and create a detailed placement guide.

## Workflow

When a user provides an S3 image URL for evaluation, follow this exact workflow:

1. **Site Selection Phase**: 
   - Call site_selection_tool with the S3 image URL
   - If the wall is REJECTED (score < 30), stop here and report the rejection
   - If the wall passes, proceed to the next phases

2. **Proposal Phase** (only if wall passed):
   - Call proposal_tool with the site analysis results
   - Capture the formal proposal with hygiene concerns section

3. **Progress Phase**:
   - Call progress_tool with the S3 image URL and site analysis
   - Get the gum count estimate and progress metrics

4. **Cost & Planning Phase** (optional):
   - Call calculate_cost_tool with the estimated gum count
   - Call generate_color_chart_tool with the S3 image URL for detailed planning

5. **Compile Feasibility Report**:
   Combine all results into a unified report with these sections:
   
   ## 🎯 Executive Summary
   Brief overview of the evaluation results and final recommendation
   
   ## 🍳 Site Assessment (Gordon Ramsay's Verdict)
   - Gum Receptivity Score: X/100
   - Wall Description
   - Gordon's Commentary
   - Status: APPROVED/REJECTED
   
   ## 📋 City Council Proposal (if approved)
   - Proposal Title
   - Executive Summary
   - Hygiene Concerns (We Can't Address)
   
   ## 📊 Progress Metrics
   - Estimated Gum Count
   - Progress to Seattle Level: X%
   - Projected Completion Date
   - Hype Commentary
   
   ## 💰 Cost Analysis (if requested)
   - Total Estimated Cost
   - Cost Breakdown
   - Timeline Estimate
   
   ## 🎨 Color Chart (if requested)
   - Color Palette
   - Placement Guide
   - Pieces per Color
   
   ## ✅ Final Recommendation
   Your professional recommendation based on all factors

## Important Notes

- Always use the exact S3 URL provided by the user
- If any tool returns an error, report it clearly in the relevant section
- Be enthusiastic about gum walls while maintaining analytical rigor
- The Feasibility Report should be comprehensive but readable
- Include emojis to make the report engaging (but keep it professional)
"""


def create_mcp_client():
    """
    Create MCPClient for external MCP server integration.
    
    This allows the agent to access additional tools from external MCP servers,
    such as AWS documentation for research purposes.
    """
    return MCPClient(
        lambda: stdio_client(
            StdioServerParameters(
                command="uvx",
                args=["awslabs.aws-documentation-mcp-server@latest"]
            )
        ),
        prefix="aws_docs"  # Prefix to avoid tool name conflicts
    )


def create_agent(include_mcp: bool = False):
    """
    Create and configure the GumWall AI agent.
    
    Args:
        include_mcp: Whether to include MCP tools (requires uvx to be available)
        
    Returns:
        Configured Strands Agent instance
    """
    model = BedrockModel(
        model_id="us.anthropic.claude-opus-4-20250514-v1:0",
        region_name="us-west-2"
    )
    
    # Base tools - our five specialized tools
    tools = [
        site_selection_tool, 
        proposal_tool, 
        progress_tool,
        calculate_cost_tool,
        generate_color_chart_tool
    ]
    
    # Optionally add MCP client for external tools
    if include_mcp:
        try:
            mcp_client = create_mcp_client()
            tools.append(mcp_client)
        except Exception as e:
            print(f"Warning: Could not initialize MCP client: {e}")
    
    agent = Agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=tools
    )
    
    return agent


@app.entrypoint
def invoke(payload: dict, context: dict) -> dict:
    """
    Main entry point for the GumWall Agent deployed to AgentCore Runtime.
    
    Supports three interaction modes:
    1. UPLOAD: Analyze uploaded wall images for viability
    2. GENERATE: Generate color-by-numbers implementation
    3. CHAT: Conversational interface for cost analysis, proposals, metrics
    
    Args:
        payload: Input payload containing:
            - mode: "upload" | "generate" | "chat" (required)
            - s3_image_url: S3 URL of the wall image (required for upload/generate)
            - message: User message (required for chat)
            - session_id: Optional session ID for chat continuity
            - include_mcp: Optional flag to include MCP tools (default: False)
        context: AgentCore runtime context
        
    Returns:
        Dictionary containing:
            - statusCode: HTTP status code
            - body: Response body (varies by mode)
    """
    # Extract parameters from payload
    mode = payload.get("mode", "").lower()
    s3_image_url = payload.get("s3_image_url", "")
    message = payload.get("message", "")
    session_id = payload.get("session_id", "")
    include_mcp = payload.get("include_mcp", False)
    
    # Validate mode
    if mode not in ["upload", "generate", "chat"]:
        return {
            "statusCode": 400,
            "body": {
                "error": "Invalid mode",
                "message": "Mode must be one of: upload, generate, chat"
            }
        }
    
    # Create the agent
    agent = create_agent(include_mcp=include_mcp)
    
    try:
        # Route to appropriate handler based on mode
        if mode == "upload":
            return handle_upload(agent, s3_image_url)
        elif mode == "generate":
            return handle_generate(agent, s3_image_url)
        elif mode == "chat":
            return handle_chat(agent, message, s3_image_url, session_id)
            
    except Exception as e:
        return {
            "statusCode": 500,
            "body": {
                "error": "Agent execution failed",
                "message": str(e)
            }
        }


def handle_upload(agent: Agent, s3_image_url: str) -> dict:
    """
    Handle UPLOAD mode: Quick viability check only.
    
    Returns ONLY site selection analysis - no proposals, cost, or progress.
    User can request those later via chat mode.
    """
    if not s3_image_url:
        return {
            "statusCode": 400,
            "body": {
                "error": "Missing s3_image_url",
                "message": "Upload mode requires an S3 image URL"
            }
        }
    
    prompt = f"""Quick viability check for this wall image.

S3 Image URL: {s3_image_url}

Use ONLY site_selection_tool to evaluate the wall. Provide:
- Gum Receptivity Score (0-100)
- Wall characteristics
- Gordon Ramsay's verdict
- Approval/rejection status

DO NOT generate proposals, cost estimates, or progress metrics. 
Keep it simple - just the viability score and commentary."""

    response = agent(prompt)
    
    return {
        "statusCode": 200,
        "body": {
            "mode": "upload",
            "s3_image_url": s3_image_url,
            "analysis": str(response)
        }
    }


def handle_generate(agent: Agent, s3_image_url: str) -> dict:
    """
    Handle GENERATE mode: Generate color-by-numbers implementation.
    
    Returns color chart with placement guide and cost estimate.
    """
    if not s3_image_url:
        return {
            "statusCode": 400,
            "body": {
                "error": "Missing s3_image_url",
                "message": "Generate mode requires an S3 image URL"
            }
        }
    
    prompt = f"""Generate a color-by-numbers implementation for this gum wall design.

S3 Image URL: {s3_image_url}

Use these tools:
1. generate_color_chart_tool - Create the color-by-numbers chart
2. calculate_cost_tool - Estimate the cost based on the chart

Provide:
- Color palette with hex codes
- Grid layout and placement guide
- Pieces needed per color
- Total cost estimate
- Timeline projection"""

    response = agent(prompt)
    
    return {
        "statusCode": 200,
        "body": {
            "mode": "generate",
            "s3_image_url": s3_image_url,
            "color_chart": str(response)
        }
    }


def handle_chat(agent: Agent, message: str, s3_image_url: str = "", session_id: str = "") -> dict:
    """
    Handle CHAT mode: User-driven conversational interface.
    
    Tools are called ONLY when user explicitly requests them:
    - "Generate a proposal" → proposal_tool
    - "What's the cost?" → calculate_cost_tool  
    - "How much progress?" → progress_tool
    - "Show me the color chart" → generate_color_chart_tool
    - "Give me a full report" → all relevant tools
    
    NO automatic tool execution - wait for user prompts.
    """
    if not message:
        return {
            "statusCode": 400,
            "body": {
                "error": "Missing message",
                "message": "Chat mode requires a message"
            }
        }
    
    # Build context-aware prompt
    context = f"\nS3 Image URL: {s3_image_url}" if s3_image_url else ""
    session_context = f"\nSession ID: {session_id}" if session_id else ""
    
    prompt = f"""You are the GumWall AI assistant. The user is asking: "{message}"{context}{session_context}

Available tools (use ONLY when user explicitly requests):
- site_selection_tool: Analyze wall viability (Gordon Ramsay style)
- proposal_tool: Generate city council proposal (HOA president style)  
- progress_tool: Estimate gum count and progress (Gen-Z hype)
- calculate_cost_tool: Calculate project costs
- generate_color_chart_tool: Create color-by-numbers chart

IMPORTANT: Only call tools when the user specifically asks for that information.
Examples:
- "What's the cost?" → use calculate_cost_tool
- "Write a proposal" → use proposal_tool
- "How's the progress?" → use progress_tool
- "Give me everything" → use all relevant tools

If the user is just chatting or asking questions, respond conversationally without calling tools."""

    response = agent(prompt)
    
    return {
        "statusCode": 200,
        "body": {
            "mode": "chat",
            "session_id": session_id,
            "message": message,
            "response": str(response)
        }
    }


# AgentCore Runtime entry point
if __name__ == "__main__":
    app.run()
