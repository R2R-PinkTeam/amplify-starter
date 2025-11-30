"""
GumWall AI Agent - Feasibility Report Generator

This agent evaluates potential gum wall locations and generates
comprehensive feasibility reports using specialized tools.
"""

from strands import Agent
from strands.models import BedrockModel

# Tools will be imported from the tools directory
from tools.site_selection import site_selection_tool
from tools.proposal import proposal_tool
from tools.progress import progress_tool


def create_agent():
    """Create and configure the GumWall AI agent."""
    
    system_prompt = """You are the GumWall AI Feasibility Analyst. Your job is to evaluate 
potential locations for new gum walls and generate comprehensive feasibility reports.

When a user provides a location for evaluation, you should:
1. Use the site_selection_tool to get Gordon Ramsay's assessment of the location
2. Use the proposal_tool to generate a city council proposal
3. Use the progress_tool to estimate gum count and progress toward the 1 million piece goal

Compile all results into a comprehensive Feasibility Report with the following sections:
- Executive Summary
- Site Assessment (from Gordon Ramsay)
- City Council Proposal
- Progress Metrics
- Final Recommendation

Be enthusiastic about gum walls while maintaining professional analysis standards."""

    model = BedrockModel(
        model_id="anthropic.claude-3-sonnet-20240229-v1:0",
        region_name="us-west-2"
    )
    
    agent = Agent(
        model=model,
        system_prompt=system_prompt,
        tools=[site_selection_tool, proposal_tool, progress_tool]
    )
    
    return agent


def invoke(event: dict) -> dict:
    """
    Main entry point for the agent.
    
    Args:
        event: Input event containing the location to evaluate
        
    Returns:
        Feasibility report for the proposed gum wall location
    """
    location = event.get("location", "Unknown Location")
    
    agent = create_agent()
    
    prompt = f"""Please evaluate the following location for a new gum wall installation 
and generate a comprehensive Feasibility Report:

Location: {location}

Use all available tools to gather information and compile the report."""

    response = agent(prompt)
    
    return {
        "statusCode": 200,
        "body": {
            "location": location,
            "feasibility_report": str(response)
        }
    }


if __name__ == "__main__":
    # Local testing
    test_event = {"location": "Pike Place Market Alley, Seattle, WA"}
    result = invoke(test_event)
    print(result)
