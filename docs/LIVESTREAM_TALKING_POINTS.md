# GumWall.ai Livestream Talking Points

**Generated: November 30, 2025 at 11:24 AM PST**

---

## THE STORY

**What They're Building**: An AI-powered platform that helps you plan, evaluate, and petition your city council to create your very own gum wall—complete with Gordon Ramsay yelling at your wall choices.

**Why It's Hilarious**: This is a monumentally over-engineered solution to a problem literally nobody has. They're using cutting-edge AWS AI infrastructure to determine if a wall is worthy of being covered in chewed gum. The spec literally says "The complexity lives in the AWS architecture, not the agent logic."

**The Bold Technical Choice**: They're deploying a multi-agent AI system using Amazon Bedrock AgentCore—the same infrastructure designed for enterprise AI applications—to generate "Gum Receptivity Scores" and calculate how many years until your wall reaches "Seattle-level density" (1 million pieces of gum).

---

## WHAT'S HAPPENING NOW

**Current State**:

- ✅ Frontend is polished and working (React + Amplify + Listty theme)
- ✅ Authentication flow complete
- ✅ Site Selection Tool is FULLY IMPLEMENTED with Gordon Ramsay personality
- ⏳ Proposal Tool and Progress Tool are still placeholders (just return `{"status": "not_implemented"}`)
- ⏳ Main agent orchestration exists but tools aren't wired up yet

**Completion Reality Check**: They're about 40-50% done on the backend agent work. The frontend looks great, the hardest tool (image analysis with Bedrock) is done, but two tools are still stubs. The agent orchestration code exists but needs the tools to actually work.

**The Interesting Problem**: They built a multimodal AI tool that fetches images from S3, base64 encodes them, and sends them to Claude with a custom Gordon Ramsay system prompt. The prompt engineering for making an AI act like Gordon Ramsay judging walls is genuinely creative.

---

## TECHNICAL ARCHITECTURE

**AWS Services Used**:

- **Amazon Bedrock** - The AI/ML platform that powers the foundation models. They're using Claude 3 Sonnet for image analysis and text generation
- **Amazon S3** - Object storage where users upload wall photos. The agent fetches images from here for analysis
- **AWS Amplify** - Full-stack platform handling authentication (Cognito under the hood), hosting, and the GraphQL API
- **Amazon Bedrock AgentCore Runtime** - A managed service for deploying AI agents. Think "Lambda for AI agents" with built-in session management
- **Strands SDK** - AWS's open-source Python framework for building AI agents with tools

**Most Over-Engineered Component**:
The entire agent architecture. They have:

1. A main orchestrator agent
2. Three "sub-agents" implemented as tools
3. Each tool calls Bedrock separately with its own personality prompt
4. MCP (Model Context Protocol) client integration for calling external tool servers

All of this... to tell you if a wall is good for sticking gum on. A simple form with a dropdown would have sufficed.

**Data Flow**:

1. User uploads a wall photo → S3 bucket
2. User sends S3 URL to the agent endpoint
3. Agent calls `site_selection_tool` → fetches image from S3 → sends to Claude with Gordon Ramsay prompt → returns score
4. If score ≥ 30, agent calls `proposal_tool` → generates HOA-style city council proposal
5. Agent calls `progress_tool` → estimates gum count with Gen-Z hype beast personality
6. All results compiled into a "Feasibility Report"

Think of it like a relay race where each runner is a different AI personality, and the baton is your wall photo.

**Creative Technical Decisions**:

- **Personality-driven prompts**: Each tool has a distinct character (Gordon Ramsay, passive-aggressive HOA president, Gen-Z hype beast)
- **Rejection threshold**: Walls scoring below 30 get rejected with snarky comments like "My grandmother's dentures have more potential!"
- **Seattle benchmark**: They're tracking progress toward 1 million pieces of gum as the gold standard

---

## CONVERSATION STARTERS

**Most Demo-Worthy Feature**:
Ask them to show the Gordon Ramsay wall analysis! Upload a photo of any wall and watch Claude roast it. The `site_selection_tool` is fully implemented and the prompts are hilarious.

**User Journey**:

1. Land on a beautiful pink-themed homepage with "Create Your Digital Gum Wall" hero
2. Sign up/login with AWS Cognito
3. Upload a photo of a wall you're considering
4. Get a "Gum Receptivity Score" from 0-100 with Gordon Ramsay commentary
5. If your wall passes (score ≥ 30), receive a formal city council proposal
6. See your progress toward "Seattle-level density" with Gen-Z hype commentary
7. Get a compiled "Feasibility Report" you could theoretically present to your city

**The "Wait, Really?" Moment**:
The spec includes a "Hygiene Concerns (We Can't Address)" section that MUST be in every city council proposal. They're acknowledging the obvious health issues while deliberately not solving them.

**The Chaos Factor**:
The MCP client integration. They've set up the agent to potentially call external MCP servers for additional tools. This is cutting-edge stuff that could either be amazing or completely break during the demo.

**Abandoned Attempts**:
Looking at the tasks.md, they originally planned for:

- AgentCore Memory integration (crossed out in favor of stateless)
- Separate agent deployments (simplified to single agent with tools)
- The proposal and progress tools are literally just `return {"status": "not_implemented"}`

This tells a story of scope reduction under time pressure—classic hackathon survival.

---

## DEVELOPMENT INSIGHTS

**Time Pressure Adaptations**:

- **Single agent instead of four**: The design originally suggested separate agent deployments, but they consolidated to one agent with tools
- **Stateless design**: They explicitly skipped AgentCore Memory "for POC"
- **Hardcoded model IDs**: `anthropic.claude-3-sonnet-20240229-v1:0` is hardcoded rather than configurable
- **Placeholder tools**: Two of three tools are stubs—they prioritized the most impressive one (image analysis)

**Technical Learning Moments**:

1. **Multimodal AI with Bedrock**: The `site_selection_tool` shows how to send images to Claude via the Bedrock API—base64 encoding, proper message structure, media type handling
2. **Strands SDK @tool decorator**: Clean way to turn Python functions into agent-callable tools
3. **S3 URL parsing**: They handle both `s3://bucket/key` and `https://bucket.s3.region.amazonaws.com/key` formats
4. **Prompt engineering for personality**: The Gordon Ramsay system prompt is a masterclass in getting AI to adopt a character while still returning structured JSON

---

## QUICK STATS

| Metric                         | Value                                              |
| ------------------------------ | -------------------------------------------------- |
| Lines of Python (agent)        | ~250                                               |
| Lines of TypeScript (frontend) | ~500                                               |
| AI Personalities               | 3 (Gordon Ramsay, HOA President, Gen-Z Hype Beast) |
| Tools Implemented              | 1 of 3                                             |
| Seattle Gum Target             | 1,000,000 pieces                                   |
| Rejection Threshold            | Score < 30                                         |

---

## SUGGESTED QUESTIONS

1. "Walk me through what happens when I upload a photo of my bathroom wall"
2. "Why Gordon Ramsay? Was there a runner-up personality?"
3. "What's the most ridiculous wall you've tested this on?"
4. "If this actually worked, would you petition your city?"
5. "What would you add if you had another 5 hours?"
6. "Has Claude ever given a wall a perfect 100 score?"
