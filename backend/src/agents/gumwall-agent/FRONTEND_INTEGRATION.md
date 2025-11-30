# GumWall AI - Frontend Integration Guide

## Overview

This guide shows how to integrate the GumWall AI agent (deployed on Amazon Bedrock AgentCore Runtime) with your React/Amplify frontend.

## Agent Details

- **Agent ARN**: `arn:aws:bedrock-agentcore:us-west-2:148290399417:runtime/gumwallagent-jsKzlk7a9v`
- **Region**: `us-west-2`
- **Endpoint**: AgentCore Runtime HTTP endpoint (accessed via AWS SDK)

## Integration Architecture

```
Frontend (React) → AWS SDK → AgentCore Runtime → GumWall Agent
```

## Prerequisites

1. Install AWS SDK for JavaScript v3:

```bash
npm install @aws-sdk/client-bedrock-agent-runtime
```

2. Configure AWS credentials in your Amplify app (already done via Amplify Auth)

## API Client Implementation

Create `src/services/gumwallAgent.ts`:

```typescript
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const AGENT_ID = "gumwallagent-jsKzlk7a9v";
const AGENT_ALIAS_ID = "DEFAULT";
const REGION = "us-west-2";

// Initialize client
const client = new BedrockAgentRuntimeClient({ region: REGION });

/**
 * Upload Mode: Analyze wall image for viability
 */
export async function analyzeWall(s3ImageUrl: string): Promise<string> {
  const payload = {
    mode: "upload",
    s3_image_url: s3ImageUrl,
  };

  return invokeAgent(payload);
}

/**
 * Generate Mode: Create color-by-numbers chart
 */
export async function generateColorChart(s3ImageUrl: string): Promise<string> {
  const payload = {
    mode: "generate",
    s3_image_url: s3ImageUrl,
  };

  return invokeAgent(payload);
}

/**
 * Chat Mode: Conversational interface
 */
export async function chatWithAgent(
  message: string,
  s3ImageUrl?: string,
  sessionId?: string
): Promise<string> {
  const payload: any = {
    mode: "chat",
    message: message,
  };

  if (s3ImageUrl) {
    payload.s3_image_url = s3ImageUrl;
  }

  if (sessionId) {
    payload.session_id = sessionId;
  }

  return invokeAgent(payload);
}

/**
 * Internal function to invoke the agent
 */
async function invokeAgent(payload: any): Promise<string> {
  const sessionId = `session-${Date.now()}`;

  const command = new InvokeAgentCommand({
    agentId: AGENT_ID,
    agentAliasId: AGENT_ALIAS_ID,
    sessionId: sessionId,
    inputText: JSON.stringify(payload),
  });

  try {
    const response = await client.send(command);

    // Stream the response
    let fullResponse = "";
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
        }
      }
    }

    // Parse the JSON response
    const result = JSON.parse(fullResponse);
    return (
      result.body?.response ||
      result.body?.analysis ||
      result.body?.color_chart ||
      fullResponse
    );
  } catch (error) {
    console.error("Error invoking agent:", error);
    throw new Error(`Failed to invoke agent: ${error.message}`);
  }
}
```

## Usage Examples

### 1. Upload & Analyze Wall

```typescript
import { analyzeWall } from "./services/gumwallAgent";

async function handleWallUpload(file: File) {
  // First, upload to S3 (using Amplify Storage)
  const s3Key = await Storage.put(`walls/${file.name}`, file);
  const s3Url = `s3://your-bucket/${s3Key}`;

  // Then analyze with agent
  const analysis = await analyzeWall(s3Url);
  console.log(analysis);
  // Returns: Gordon Ramsay-style wall assessment with score
}
```

### 2. Generate Color Chart

```typescript
import { generateColorChart } from "./services/gumwallAgent";

async function handleGenerateChart(s3Url: string) {
  const colorChart = await generateColorChart(s3Url);
  console.log(colorChart);
  // Returns: Color palette, grid layout, cost estimate
}
```

### 3. Chat Interface

```typescript
import { chatWithAgent } from "./services/gumwallAgent";
import { useState } from "react";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [currentS3Url, setCurrentS3Url] = useState("");

  async function sendMessage(userMessage: string) {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Get agent response
    const response = await chatWithAgent(userMessage, currentS3Url);

    // Add agent response
    setMessages((prev) => [...prev, { role: "agent", content: response }]);
  }

  return (
    <div>
      {/* Chat UI */}
      <button onClick={() => sendMessage("Give me a cost estimate")}>
        Get Cost Estimate
      </button>
      <button onClick={() => sendMessage("Write a city council proposal")}>
        Generate Proposal
      </button>
      <button onClick={() => sendMessage("How much progress have we made?")}>
        Check Progress
      </button>
    </div>
  );
}
```

## Dashboard Integration

Update your `Dashboard.tsx` to wire up the buttons:

```typescript
import {
  analyzeWall,
  generateColorChart,
  chatWithAgent,
} from "../services/gumwallAgent";
import { Storage } from "aws-amplify";

export default function Dashboard() {
  const [currentWallUrl, setCurrentWallUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleUpload(file: File) {
    setLoading(true);
    try {
      // Upload to S3
      const s3Key = await Storage.put(`walls/${file.name}`, file);
      const s3Url = `s3://your-bucket/${s3Key}`;
      setCurrentWallUrl(s3Url);

      // Analyze
      const analysis = await analyzeWall(s3Url);
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze wall");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!currentWallUrl) {
      alert("Please upload a wall first");
      return;
    }

    setLoading(true);
    try {
      const chart = await generateColorChart(currentWallUrl);
      setResult(chart);
    } catch (error) {
      console.error(error);
      alert("Failed to generate chart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* File upload */}
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Color Chart"}
      </button>

      {/* Results */}
      {result && <pre>{result}</pre>}
    </div>
  );
}
```

## S3 Upload Configuration

Configure Amplify Storage for wall image uploads:

```typescript
// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "gumwallImages",
  access: (allow) => ({
    "walls/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
```

## IAM Permissions

Your Amplify app needs permissions to invoke the AgentCore agent. Add to your Amplify backend:

```typescript
// amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  storage,
});

// Add AgentCore permissions
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["bedrock:InvokeAgent"],
    resources: [
      "arn:aws:bedrock-agentcore:us-west-2:148290399417:runtime/gumwallagent-jsKzlk7a9v",
    ],
  })
);
```

## Response Formats

### Upload Mode Response

```json
{
  "mode": "upload",
  "s3_image_url": "s3://...",
  "analysis": "Gordon Ramsay-style assessment with score and verdict"
}
```

### Generate Mode Response

```json
{
  "mode": "generate",
  "s3_image_url": "s3://...",
  "color_chart": "Color palette, grid layout, placement guide, cost estimate"
}
```

### Chat Mode Response

```json
{
  "mode": "chat",
  "session_id": "...",
  "message": "user message",
  "response": "Agent's natural language response"
}
```

## Error Handling

```typescript
try {
  const result = await analyzeWall(s3Url);
  // Handle success
} catch (error) {
  if (error.name === "AccessDeniedException") {
    // User doesn't have permission
    alert("You don't have permission to access the agent");
  } else if (error.name === "ThrottlingException") {
    // Rate limited
    alert("Too many requests, please try again later");
  } else {
    // Other errors
    alert(`Error: ${error.message}`);
  }
}
```

## Testing

Test the integration locally:

```bash
# In backend/src/agents/gumwall-agent
.venv/bin/python test_agent.py
```

## Monitoring

View agent logs and traces:

- **CloudWatch Logs**: `/aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT`
- **GenAI Dashboard**: https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#gen-ai-observability/agent-core

## Next Steps

1. Implement S3 upload in your frontend
2. Add the agent API client
3. Wire up dashboard buttons
4. Add loading states and error handling
5. Style the results display
6. Test end-to-end flow

## Support

For issues or questions:

- Check CloudWatch logs for agent errors
- Review the agent's system prompt in `agent.py`
- Test with `test_agent.py` to isolate backend issues
