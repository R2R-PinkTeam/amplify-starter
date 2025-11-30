"""
Color Chart Tool - Generate Color-by-Numbers Charts

This tool calls the API Gateway MCP server to generate color-by-numbers
charts for gum wall designs.
"""

import requests
from strands import tool
from typing import Dict, Any

API_GATEWAY_URL = "https://ieyjwkygzg.execute-api.us-west-2.amazonaws.com"


@tool
def generate_color_chart_tool(s3_image_url: str) -> dict:
    """
    Generate a color-by-numbers chart for a gum wall design.
    
    This tool calls the API Gateway MCP server to analyze a gum wall image
    and generate a detailed color-by-numbers chart showing which colors
    of gum should be placed where to recreate the design.
    
    Args:
        s3_image_url: S3 URL of the gum wall image to analyze
        
    Returns:
        Dictionary containing:
        - color_palette: List of colors used in the design
        - grid_size: Dimensions of the color chart grid
        - chart_data: Color-by-numbers mapping
        - color_counts: Number of pieces needed per color
    """
    try:
        response = requests.post(
            f"{API_GATEWAY_URL}/generate-color-chart",
            json={"s3_image_url": s3_image_url},
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
                "text": f"Failed to generate color chart: {str(e)}"
            }]
        }
