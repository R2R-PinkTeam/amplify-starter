"""
Site Selection Tool - Gordon Ramsay Style Wall Evaluation

This tool analyzes wall images for gum wall potential using Amazon Bedrock
with a Gordon Ramsay personality for entertaining commentary.
"""

import json
import boto3
import base64
import re
from urllib.parse import urlparse
from strands import tool


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


def _analyze_wall_with_bedrock(image_bytes: bytes, media_type: str) -> dict:
    """
    Call Amazon Bedrock to analyze the wall image with Gordon Ramsay personality.
    
    Args:
        image_bytes: Raw image data
        media_type: MIME type of the image
        
    Returns:
        Dict with score, is_rejected, commentary, and wall_description
    """
    bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-west-2")
    
    # Encode image to base64
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")
    
    # Gordon Ramsay system prompt
    system_prompt = """You are Gordon Ramsay, but instead of judging restaurants, you judge walls 
for their potential as gum walls. You have the same fiery personality, dramatic reactions, 
and colorful language (keep it PG-13). You've seen the best gum walls in the world and 
have VERY strong opinions about what makes a wall worthy of being covered in chewed gum.

Your job is to evaluate walls and give them a "Gum Receptivity Score" from 0-100.

Factors you consider:
- Texture: Rough, porous surfaces hold gum better. Smooth surfaces are RUBBISH!
- Location: High foot traffic areas are ideal. Hidden walls are a WASTE!
- Material: Brick and concrete are excellent. Glass and metal are DISASTERS!
- Existing character: Walls with personality deserve gum. Boring walls need help!
- Accessibility: Can people actually reach the wall? Is it at gum-sticking height?

You MUST respond in valid JSON format with these exact fields:
{
    "score": <number 0-100>,
    "wall_description": "<brief description of what you see>",
    "commentary": "<your Gordon Ramsay style reaction, 2-3 sentences>"
}

Be dramatic! Be entertaining! But also be fair in your scoring."""

    user_message = """Look at this wall and evaluate its potential as a gum wall. 
Give me your honest Gordon Ramsay assessment with a Gum Receptivity Score (0-100).

Remember to respond ONLY with valid JSON containing: score, wall_description, and commentary."""

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


@tool
def site_selection_tool(s3_image_url: str) -> dict:
    """
    Analyze a wall image for gum wall potential using Gordon Ramsay's expert opinion.
    
    This tool fetches an image from S3, analyzes it using Amazon Bedrock with a 
    Gordon Ramsay personality, and returns a Gum Receptivity Score along with 
    entertaining commentary.
    
    Args:
        s3_image_url: S3 URL of the wall image to analyze (s3://bucket/key format)
        
    Returns:
        Dictionary containing:
        - score: Gum Receptivity Score (0-100)
        - is_rejected: True if score < 30, indicating the wall is not gum-worthy
        - commentary: Gordon Ramsay's colorful assessment
        - wall_description: Brief description of the wall characteristics
    """
    try:
        # Fetch image from S3
        image_bytes, media_type = _fetch_image_from_s3(s3_image_url)
        
        # Analyze with Bedrock
        analysis = _analyze_wall_with_bedrock(image_bytes, media_type)
        
        # Extract and validate score
        score = int(analysis.get("score", 0))
        score = max(0, min(100, score))  # Clamp to 0-100
        
        # Determine rejection status (score < 30 = rejected)
        is_rejected = score < 30
        
        # Get commentary and description
        commentary = analysis.get("commentary", "No comment.")
        wall_description = analysis.get("wall_description", "Unknown wall type.")
        
        # Add rejection message if applicable
        if is_rejected:
            rejection_phrases = [
                "This wall is an absolute DISASTER for gum! Get it out of my sight!",
                "You call THIS a gum wall candidate? My grandmother's dentures have more potential!",
                "SHUT IT DOWN! This wall couldn't hold gum if its life depended on it!",
            ]
            import random
            commentary = f"{commentary} {random.choice(rejection_phrases)}"
        
        return {
            "status": "success",
            "content": [{
                "json": {
                    "score": score,
                    "is_rejected": is_rejected,
                    "commentary": commentary,
                    "wall_description": wall_description
                }
            }]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "content": [{
                "text": f"Gordon Ramsay is FURIOUS! Error analyzing wall: {str(e)}"
            }]
        }
