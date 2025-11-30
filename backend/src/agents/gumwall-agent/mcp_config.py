"""
MCP Configuration for GumWall Agent

Configures the agent to use the API Gateway MCP server for additional tools
like color chart generation and cost calculation.
"""

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from strands.tools.mcp import MCPClient

# API Gateway MCP Server endpoint
API_GATEWAY_MCP_URL = "https://ieyjwkygzg.execute-api.us-west-2.amazonaws.com"


def create_gumwall_mcp_client() -> MCPClient:
    """
    Create an MCPClient configured to use the GumWall API Gateway MCP server.
    
    This provides tools for:
    - Color-by-numbers chart generation
    - Cost calculation for gum wall projects
    - Any other custom tools exposed by the API Gateway
    
    Returns:
        Configured MCPClient instance
    """
    # For HTTP-based MCP servers, we need to use a different approach
    # Since the API Gateway is HTTP-based, we'll use a custom client
    
    # Note: If your API Gateway implements the MCP protocol over HTTP,
    # you would configure it here. For now, we'll use stdio as a template.
    
    return MCPClient(
        lambda: stdio_client(
            StdioServerParameters(
                command="uvx",
                args=["your-mcp-server-package"]  # Replace with actual package
            )
        ),
        prefix="gumwall"
    )


# Alternative: Direct HTTP client for API Gateway
import requests
from typing import Any, Dict

class GumwallApiClient:
    """
    Direct HTTP client for calling the GumWall API Gateway.
    
    Use this if the API Gateway doesn't implement the MCP protocol
    and you just need to make HTTP calls to specific endpoints.
    """
    
    def __init__(self, base_url: str = API_GATEWAY_MCP_URL):
        self.base_url = base_url.rstrip("/")
    
    def generate_color_chart(self, s3_image_url: str) -> Dict[str, Any]:
        """
        Generate a color-by-numbers chart for a gum wall design.
        
        Args:
            s3_image_url: S3 URL of the gum wall image
            
        Returns:
            Dictionary with color chart data
        """
        response = requests.post(
            f"{self.base_url}/generate-color-chart",
            json={"s3_image_url": s3_image_url}
        )
        response.raise_for_status()
        return response.json()
    
    def calculate_cost(self, gum_count: int, color_count: int) -> Dict[str, Any]:
        """
        Calculate the cost of creating a gum wall.
        
        Args:
            gum_count: Number of gum pieces needed
            color_count: Number of different colors
            
        Returns:
            Dictionary with cost breakdown
        """
        response = requests.post(
            f"{self.base_url}/calculate-cost",
            json={
                "gum_count": gum_count,
                "color_count": color_count
            }
        )
        response.raise_for_status()
        return response.json()
