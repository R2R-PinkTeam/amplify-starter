"""
Cost Calculator Tool - Estimate Gum Wall Project Costs

This tool calls the API Gateway MCP server to calculate the cost
of creating a gum wall based on gum count and color requirements.
"""

import requests
from strands import tool
from typing import Dict, Any

API_GATEWAY_URL = "https://ieyjwkygzg.execute-api.us-west-2.amazonaws.com"


@tool
def calculate_cost_tool(gum_count: int, color_count: int = 1) -> dict:
    """
    Calculate the estimated cost of creating a gum wall.
    
    This tool calls the API Gateway MCP server to estimate the total cost
    of a gum wall project based on the number of gum pieces needed and
    the variety of colors required.
    
    Args:
        gum_count: Total number of gum pieces needed for the wall
        color_count: Number of different gum colors needed (default: 1)
        
    Returns:
        Dictionary containing:
        - total_cost: Total estimated cost in USD
        - cost_breakdown: Detailed breakdown by category
        - gum_cost: Cost of gum pieces
        - labor_estimate: Estimated labor hours and cost
        - timeline: Estimated project timeline
    """
    try:
        response = requests.post(
            f"{API_GATEWAY_URL}/calculate-cost",
            json={
                "gum_count": gum_count,
                "color_count": color_count
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        return {
            "status": "success",
            "content": [{
                "json": result
            }]
        }
        
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "content": [{
                "text": f"Failed to calculate cost: {str(e)}"
            }]
        }
