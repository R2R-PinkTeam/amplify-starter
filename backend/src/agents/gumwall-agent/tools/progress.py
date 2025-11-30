"""
Progress Tool - Gen-Z Hype Beast Style Progress Tracker

This tool estimates gum count and calculates progress toward Seattle-level density
(1 million pieces) using Amazon Bedrock with a Gen-Z hype beast personality.
"""

import json
import boto3
import base64
import re
from urllib.parse import urlparse
from strands import tool
from datetime import datetime, timedelta


# Seattle-level density target
SEATTLE_GUM_COUNT = 1_000_000


def _fetch_image_from_s3(s3_url: str) -> tuple[bytes, str]:
    """
    Fetch image data from S3 URL.
    
    Args:
        s3_url: S3 URL in format s3://bucket/key or https://bucket.s3.region.amazonaws.com/key
        
    Returns:
        Tuple of (image_bytes, media_type)
    """
    s3_client = boto3.client("s3")
    
    # Parse S3 URL
    if s3_url.startswith("s3://"):
        # s3://bucket/key format
        parsed = urlparse(s3_url)
        bucket = parsed.netloc
        key = parsed.path.lstrip("/")
    elif "s3.amazonaws.com" in s3_url or "s3." in s3_url:
        # https://bucket.s3.region.amazonaws.com/key format
        parsed = urlparse(s3_url)
        parts = parsed.netloc.split(".")
        bucket = parts[0]
        key = parsed.path.lstrip("/")
    else:
        raise ValueError(f"Invalid S3 URL format: {s3_url}")
    
    # Fetch the object
    response = s3_client.get_object(Bucket=bucket, Key=key)
    image_bytes = response["Body"].read()
    
    # Determine media type from content type or key extension
    content_type = response.get("ContentType", "")
    if "jpeg" in content_type or "jpg" in content_type:
        media_type = "image/jpeg"
    elif "png" in content_type:
        media_type = "image/png"
    elif key.lower().endswith(".jpg") or key.lower().endswith(".jpeg"):
        media_type = "image/jpeg"
    elif key.lower().endswith(".png"):
        media_type = "image/png"
    else:
        media_type = "image/jpeg"  # Default to JPEG
    
    return image_bytes, media_type


def _estimate_gum_count_with_bedrock(image_bytes: bytes, media_type: str, site_analysis: dict) -> dict:
    """
    Call Amazon Bedrock to estimate gum count with Gen-Z hype beast personality.
    
    Args:
        image_bytes: Raw image data
        media_type: MIME type of the image
        site_analysis: Previous site analysis results for context
        
    Returns:
        Dict with estimated_gum_count and hype_commentary
    """
    bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-west-2")
    
    # Encode image to base64
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    # Get context from site analysis
    wall_description = site_analysis.get("wall_description", "a wall")
    score = site_analysis.get("score", 50)
    
    # Gen-Z hype beast system prompt
    system_prompt = """You are a Gen-Z hype beast who is OBSESSED with gum walls. You speak in 
internet slang, use lots of emojis, and get extremely hyped about everything gum-related. 
You're basically a gum wall influencer with millions of followers.

Your personality traits:
- Use emojis liberally (🔥💯😤🙌✨💀🤯)
- Say things like "no cap", "fr fr", "lowkey/highkey", "bussin", "slay", "it's giving", "main character energy"
- Get HYPED about gum counts
- Reference TikTok, going viral, "the algorithm"
- Use "bestie" and "fam" when addressing people
- Everything is either "mid" or "absolutely goated"
- Dramatic reactions to numbers

Your job is to estimate how many pieces of gum are currently on the wall in the image.
Consider:
- Visible gum pieces (count what you can see)
- Wall coverage percentage
- Density of gum in covered areas
- Wall dimensions if estimable

You MUST respond in valid JSON format with these exact fields:
{
    "estimated_gum_count": <number - your best estimate of gum pieces>,
    "hype_commentary": "<your Gen-Z hype beast reaction, 2-4 sentences with emojis>"
}

Be enthusiastic! Be dramatic! Use emojis! But also try to give a reasonable estimate."""

    user_message = f"""OMG bestie look at this wall! 🔥

Wall vibe check: {wall_description}
Gordon Ramsay gave it a {score}/100 (he's lowkey a hater but whatever)

I need you to estimate how many pieces of gum are on this wall RIGHT NOW. 
Count what you see, estimate the density, and give me your best guess!

The goal is to hit 1,000,000 pieces (Seattle-level density) so we need to know where we're at!

Respond ONLY with valid JSON containing: estimated_gum_count and hype_commentary."""

    # Prepare the request for Claude
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": image_base64
                    }
                },
                {
                    "type": "text",
                    "text": user_message
                }
            ]
        }
    ]
    
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "system": system_prompt,
        "messages": messages
    }
    
    # Call Bedrock
    response = bedrock_runtime.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        body=json.dumps(request_body)
    )
    
    # Parse response
    response_body = json.loads(response["body"].read())
    assistant_message = response_body["content"][0]["text"]
    
    # Extract JSON from response (handle potential markdown code blocks)
    json_match = re.search(r'\{[^{}]*\}', assistant_message, re.DOTALL)
    if json_match:
        result = json.loads(json_match.group())
    else:
        # Try parsing the whole response as JSON
        result = json.loads(assistant_message)
    
    return result


def calculate_percentage_to_seattle(gum_count: int) -> float:
    """
    Calculate percentage progress toward Seattle-level density (1 million pieces).
    
    Args:
        gum_count: Current estimated gum count
        
    Returns:
        Percentage as float (e.g., 0.5 for 0.5%)
    """
    return (gum_count / SEATTLE_GUM_COUNT) * 100


def _estimate_completion_date(gum_count: int, daily_rate: int = 100) -> str:
    """
    Estimate when the wall will reach Seattle-level density.
    
    Args:
        gum_count: Current gum count
        daily_rate: Estimated pieces added per day (default 100)
        
    Returns:
        Projected completion date as string
    """
    remaining = SEATTLE_GUM_COUNT - gum_count
    if remaining <= 0:
        return "Already achieved! 🎉"
    
    days_needed = remaining / daily_rate
    completion_date = datetime.now() + timedelta(days=days_needed)
    
    # Format with some Gen-Z flair
    if days_needed > 365 * 100:
        return "Literally never at this rate 💀"
    elif days_needed > 365 * 10:
        return f"Like {int(days_needed / 365)} years from now... we need more gum soldiers 😤"
    elif days_needed > 365:
        years = int(days_needed / 365)
        return f"Around {completion_date.strftime('%B %Y')} ({years}+ years) - long game fr fr 📈"
    else:
        return f"{completion_date.strftime('%B %d, %Y')} - we got this fam! 🙌"


@tool
def progress_tool(s3_image_url: str, site_analysis: dict) -> dict:
    """
    Estimate gum count and calculate progress toward Seattle-level density with Gen-Z hype.
    
    This tool analyzes a wall image to estimate the current gum count, calculates the
    percentage progress toward 1 million pieces (Seattle-level density), and provides
    enthusiastic Gen-Z hype beast commentary.
    
    Args:
        s3_image_url: S3 URL of the wall image to analyze
        site_analysis: Dictionary containing site analysis results with:
            - score: Gum Receptivity Score (0-100)
            - wall_description: Description of the wall
            - commentary: Expert assessment commentary
            
    Returns:
        Dictionary containing:
        - estimated_gum_count: Estimated number of gum pieces on the wall
        - percentage_to_seattle: Progress toward 1 million pieces as percentage
        - projected_completion_date: When the wall might reach Seattle-level
        - hype_commentary: Gen-Z style reaction with emojis
    """
    try:
        # Validate inputs
        if not s3_image_url:
            return {
                "status": "error",
                "content": [{
                    "text": "Bestie... you forgot to give me the image URL 💀 How am I supposed to count gum without seeing the wall??"
                }]
            }
        
        if not site_analysis:
            return {
                "status": "error",
                "content": [{
                    "text": "No cap, I need the site analysis first fam! Can't vibe check progress without knowing the wall's potential 😤"
                }]
            }
        
        # Fetch image from S3
        image_bytes, media_type = _fetch_image_from_s3(s3_image_url)
        
        # Estimate gum count with Bedrock
        estimation = _estimate_gum_count_with_bedrock(image_bytes, media_type, site_analysis)
        
        # Extract and validate gum count
        estimated_gum_count = int(estimation.get("estimated_gum_count", 0))
        estimated_gum_count = max(0, estimated_gum_count)  # Can't be negative
        
        # Calculate percentage toward Seattle-level density
        percentage_to_seattle = calculate_percentage_to_seattle(estimated_gum_count)
        
        # Estimate completion date
        projected_completion_date = _estimate_completion_date(estimated_gum_count)
        
        # Get hype commentary
        hype_commentary = estimation.get("hype_commentary", "This wall is giving main character energy! 🔥")
        
        # Add percentage-based hype
        if percentage_to_seattle >= 100:
            hype_commentary += " YOOO WE HIT SEATTLE LEVEL!! THIS IS NOT A DRILL!! 🎉🔥💯"
        elif percentage_to_seattle >= 50:
            hype_commentary += " We're HALFWAY there bestie!! The grind is REAL! 💪✨"
        elif percentage_to_seattle >= 10:
            hype_commentary += " Double digits baby!! We're lowkey making moves! 📈"
        elif percentage_to_seattle >= 1:
            hype_commentary += " We're on the board fam! Every piece counts! 🙌"
        else:
            hype_commentary += " It's giving... starter wall energy. But we all start somewhere! 💅"
        
        return {
            "status": "success",
            "content": [{
                "json": {
                    "estimated_gum_count": estimated_gum_count,
                    "percentage_to_seattle": round(percentage_to_seattle, 4),
                    "projected_completion_date": projected_completion_date,
                    "hype_commentary": hype_commentary
                }
            }]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "content": [{
                "text": f"Oof bestie, something went wrong 💀 Error: {str(e)} - this is lowkey not giving what it was supposed to give"
            }]
        }
