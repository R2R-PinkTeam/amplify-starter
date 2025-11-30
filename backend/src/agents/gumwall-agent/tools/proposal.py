"""
Proposal Tool - Passive-Aggressive HOA President Style Proposal Generator

This tool generates city council proposals for gum wall creation using Amazon Bedrock
with a passive-aggressive HOA president personality.
"""

import json
import boto3
import re
from strands import tool


def _generate_proposal_with_bedrock(site_analysis: dict) -> dict:
    """
    Call Amazon Bedrock to generate a city council proposal with HOA president personality.
    
    Args:
        site_analysis: Dictionary containing site analysis results from site_selection_tool
        
    Returns:
        Dict with title, executive_summary, hygiene_section, and full_proposal
    """
    bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-west-2")
    
    # Extract site analysis details
    score = site_analysis.get("score", 50)
    wall_description = site_analysis.get("wall_description", "a wall")
    commentary = site_analysis.get("commentary", "")
    
    # Passive-aggressive HOA president system prompt
    system_prompt = """You are a passive-aggressive HOA president who has been asked to write 
a formal city council proposal for creating a public gum wall. You have VERY mixed feelings 
about this. On one hand, you want to seem supportive of community art. On the other hand, 
you're deeply concerned about property values, cleanliness, and "what the neighbors will think."

Your writing style:
- Start sentences with "While I certainly appreciate..." or "I'm not saying this is a bad idea, but..."
- Use phrases like "some might argue" and "I've heard concerns from certain residents"
- Include backhanded compliments
- Express support while simultaneously undermining the idea
- Be overly formal and bureaucratic
- Use lots of committee-speak and procedural language

CRITICAL: You MUST include a section titled EXACTLY "Hygiene Concerns (We Can't Address)" 
where you list health and cleanliness issues in a way that suggests you're washing your 
hands of responsibility while still bringing them up.

You MUST respond in valid JSON format with these exact fields:
{
    "title": "<formal proposal title>",
    "executive_summary": "<2-3 paragraph summary with passive-aggressive undertones>",
    "hygiene_section": "<the 'Hygiene Concerns (We Can't Address)' section content>",
    "full_proposal": "<complete proposal text, 4-6 paragraphs>"
}

Remember: You're technically supportive, but everyone should know you have reservations."""

    user_message = f"""Please draft a formal city council proposal for creating a public gum wall 
at the following location:

Wall Description: {wall_description}
Site Evaluation Score: {score}/100
Expert Assessment: {commentary}

The proposal should be formal enough for city council review but should clearly convey your 
passive-aggressive HOA president personality. Don't forget the mandatory "Hygiene Concerns 
(We Can't Address)" section!

Respond ONLY with valid JSON containing: title, executive_summary, hygiene_section, and full_proposal."""

    # Prepare the request for Claude
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": user_message
                }
            ]
        }
    ]
    
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
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
    json_match = re.search(r'\{[^{}]*"title"[^{}]*\}', assistant_message, re.DOTALL)
    if json_match:
        result = json.loads(json_match.group())
    else:
        # Try parsing the whole response as JSON
        result = json.loads(assistant_message)
    
    return result


@tool
def proposal_tool(site_analysis: dict) -> dict:
    """
    Generate a city council proposal for a gum wall with passive-aggressive HOA president style.
    
    This tool takes the site analysis results and generates a formal city council proposal
    using Amazon Bedrock with a passive-aggressive HOA president personality. The proposal
    includes a mandatory "Hygiene Concerns (We Can't Address)" section.
    
    Args:
        site_analysis: Dictionary containing site analysis results with:
            - score: Gum Receptivity Score (0-100)
            - wall_description: Description of the wall
            - commentary: Expert assessment commentary
            
    Returns:
        Dictionary containing:
        - title: Formal proposal title
        - executive_summary: Summary with passive-aggressive undertones
        - hygiene_section: The "Hygiene Concerns (We Can't Address)" section
        - full_proposal: Complete proposal text
    """
    try:
        # Validate input
        if not site_analysis:
            return {
                "status": "error",
                "content": [{
                    "text": "While I would certainly love to help, I cannot generate a proposal without site analysis data. Perhaps someone forgot to do their homework?"
                }]
            }
        
        # Check if wall was rejected (score < 30)
        score = site_analysis.get("score", 0)
        if score < 30:
            return {
                "status": "error", 
                "content": [{
                    "text": f"I'm not saying I told you so, but with a score of {score}/100, this wall was rejected. I cannot in good conscience draft a proposal for a site that doesn't meet minimum standards. Some of us have reputations to maintain."
                }]
            }
        
        # Generate proposal with Bedrock
        proposal = _generate_proposal_with_bedrock(site_analysis)
        
        # Validate required fields
        title = proposal.get("title", "Proposal for Community Gum Wall Installation")
        executive_summary = proposal.get("executive_summary", "")
        hygiene_section = proposal.get("hygiene_section", "")
        full_proposal = proposal.get("full_proposal", "")
        
        # Ensure hygiene section exists and has the correct title
        if not hygiene_section:
            hygiene_section = """While I'm certainly not one to dwell on the negative, I feel 
obligated to mention certain... considerations that fall outside our purview:

1. Bacterial growth from saliva residue (not our department)
2. Potential allergen exposure from various gum ingredients (consult health services)
3. Pest attraction possibilities (that's animal control's problem)
4. Long-term structural concerns from gum adhesive (engineering can worry about that)
5. The general "ick factor" that some residents have mentioned (their words, not mine)

I want to be clear: I'm not saying these are reasons to reject the proposal. I'm simply 
documenting them for the record so that when questions arise later, we can point to this 
section and note that concerns were raised. By someone. Not necessarily me."""

        return {
            "status": "success",
            "content": [{
                "json": {
                    "title": title,
                    "executive_summary": executive_summary,
                    "hygiene_section": hygiene_section,
                    "full_proposal": full_proposal
                }
            }]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "content": [{
                "text": f"I hate to be the bearer of bad news, but there was an error generating the proposal: {str(e)}. I'm sure someone will be held accountable."
            }]
        }
