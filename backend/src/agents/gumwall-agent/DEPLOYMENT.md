# GumWall AI Agent - Deployment Guide

## Overview

This guide covers deploying and updating the GumWall AI agent to Amazon Bedrock AgentCore Runtime.

## Prerequisites

- Python 3.11+
- AWS CLI configured with credentials
- AgentCore CLI installed (via pip in venv)
- Docker (for local testing only - not required for cloud deployment)

## Initial Setup

### 1. Install Dependencies

```bash
cd backend/src/agents/gumwall-agent

# Create virtual environment
python3.11 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-west-2
```

## Deployment Process

### Quick Deploy (Recommended)

```bash
cd backend/src/agents/gumwall-agent
source .venv/bin/activate
agentcore launch
```

This will:

1. Build the Docker container in AWS CodeBuild (ARM64)
2. Push to ECR
3. Deploy to AgentCore Runtime
4. Configure observability (CloudWatch Logs + X-Ray)

### Step-by-Step Deploy

#### 1. Validate Configuration

```bash
# Check the config file
cat .bedrock_agentcore.yaml

# Ensure these are set:
# - aws.account: 148290399417
# - aws.region: us-west-2
# - aws.execution_role_auto_create: true
# - aws.ecr_auto_create: true
```

#### 2. Test Locally (Optional)

```bash
# Test without deploying
python test_agent.py
```

#### 3. Deploy to AgentCore

```bash
agentcore launch
```

Expected output:

```
🚀 Launching Bedrock AgentCore...
✅ CodeBuild completed successfully
✅ Agent deployed: arn:aws:bedrock-agentcore:us-west-2:148290399417:runtime/gumwallagent-jsKzlk7a9v
```

#### 4. Verify Deployment

```bash
# Check agent status
agentcore status

# Test with a simple invocation
agentcore invoke '{"mode": "chat", "message": "hello"}'
```

## Updating the Agent

### When to Update

Update the agent when you:

- Modify tool implementations (`tools/*.py`)
- Change the agent logic (`agent.py`)
- Update system prompts
- Add/remove dependencies (`requirements.txt`)
- Change the Dockerfile

### Update Process

#### 1. Make Your Changes

```bash
# Example: Update a tool
vim tools/site_selection.py

# Example: Update system prompt
vim agent.py

# Example: Add a dependency
echo "new-package>=1.0.0" >> requirements.txt
```

#### 2. Test Locally

```bash
# Quick test
python test_agent.py

# Or use the local test script
python test_local.py
```

#### 3. Deploy Update

```bash
agentcore launch
```

The deployment will:

- Rebuild the container with your changes
- Push new image to ECR
- Update the AgentCore Runtime
- **Zero downtime** - new requests use the new version

#### 4. Verify Update

```bash
# Test the updated agent
agentcore invoke '{"mode": "chat", "message": "test my changes"}'

# Check logs for any errors
aws logs tail /aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT \
  --log-stream-name-prefix "2025/11/30/[runtime-logs]" \
  --follow
```

## Rollback

If an update causes issues:

### Option 1: Redeploy Previous Version

```bash
# Checkout previous version from git
git checkout HEAD~1 backend/src/agents/gumwall-agent/

# Redeploy
agentcore launch

# Return to latest
git checkout main
```

### Option 2: Use Previous ECR Image

```bash
# List ECR images
aws ecr describe-images \
  --repository-name bedrock-agentcore-gumwall-agent \
  --region us-west-2

# Note the previous image digest
# Manually update the agent to use that image (via AWS Console)
```

## Monitoring

### View Logs

```bash
# Tail logs in real-time
aws logs tail /aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT \
  --log-stream-name-prefix "2025/11/30/[runtime-logs]" \
  --follow

# View last hour
aws logs tail /aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT \
  --log-stream-name-prefix "2025/11/30/[runtime-logs]" \
  --since 1h
```

### GenAI Observability Dashboard

View traces and metrics:
https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#gen-ai-observability/agent-core

### Check Agent Status

```bash
agentcore status
```

## Troubleshooting

### Build Fails

**Error**: `Docker build failed`

**Solution**: Check Dockerfile syntax and ensure all files are present

```bash
# Verify Dockerfile exists
ls -la Dockerfile

# Check for syntax errors
docker build -t test .
```

### Deployment Fails

**Error**: `ValidationException: Member must satisfy regular expression pattern`

**Solution**: Agent name must not contain hyphens

```bash
# Check .bedrock_agentcore.yaml
# Ensure name is: gumwallagent (not gumwall-agent)
```

### Agent Returns Errors

**Error**: `ModuleNotFoundError` or `ImportError`

**Solution**: Missing dependency in requirements.txt

```bash
# Add missing package
echo "missing-package>=1.0.0" >> requirements.txt

# Redeploy
agentcore launch
```

### Timeout Issues

**Error**: Agent times out on requests

**Solution**: Increase timeout or optimize tool execution

```bash
# Check tool performance in logs
# Optimize slow Bedrock calls
# Consider caching results
```

## Configuration Reference

### .bedrock_agentcore.yaml

```yaml
default_agent: gumwallagent
agents:
  gumwallagent:
    name: gumwallagent
    entrypoint: agent.py
    deployment_type: container
    platform: linux/amd64
    aws:
      execution_role_auto_create: true
      account: "148290399417"
      region: us-west-2
      ecr_auto_create: true
      network_configuration:
        network_mode: PUBLIC
      protocol_configuration:
        server_protocol: HTTP
      observability:
        enabled: true
    memory:
      mode: NO_MEMORY
```

### Key Settings

- **execution_role_auto_create**: Auto-create IAM role for agent
- **ecr_auto_create**: Auto-create ECR repository
- **network_mode**: PUBLIC (agent can access internet)
- **observability.enabled**: Enable CloudWatch Logs + X-Ray

## Best Practices

### 1. Test Before Deploy

Always test locally before deploying:

```bash
python test_agent.py
```

### 2. Use Version Control

Commit changes before deploying:

```bash
git add .
git commit -m "Update agent: description of changes"
git push
agentcore launch
```

### 3. Monitor After Deploy

Watch logs for 5-10 minutes after deployment:

```bash
aws logs tail /aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT \
  --log-stream-name-prefix "2025/11/30/[runtime-logs]" \
  --follow
```

### 4. Document Changes

Update this file or add comments when making significant changes.

### 5. Keep Dependencies Updated

Regularly update dependencies for security:

```bash
pip list --outdated
pip install --upgrade package-name
pip freeze > requirements.txt
```

## CI/CD Integration (Future)

For automated deployments, create a GitHub Actions workflow:

```yaml
name: Deploy GumWall Agent

on:
  push:
    branches: [main]
    paths:
      - "backend/src/agents/gumwall-agent/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          cd backend/src/agents/gumwall-agent
          pip install -r requirements.txt

      - name: Deploy to AgentCore
        run: |
          cd backend/src/agents/gumwall-agent
          agentcore launch
```

## Resources

- **Agent ARN**: `arn:aws:bedrock-agentcore:us-west-2:148290399417:runtime/gumwallagent-jsKzlk7a9v`
- **ECR Repository**: `bedrock-agentcore-gumwall-agent`
- **Execution Role**: `AmazonBedrockAgentCoreSDKRuntime-us-west-2-eb736912f3`
- **CloudWatch Logs**: `/aws/bedrock-agentcore/runtimes/gumwallagent-jsKzlk7a9v-DEFAULT`
- **GenAI Dashboard**: https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#gen-ai-observability/agent-core

## Support

For issues:

1. Check CloudWatch logs
2. Review error messages in deployment output
3. Test locally with `test_agent.py`
4. Verify AWS credentials and permissions
5. Check AgentCore documentation: https://docs.aws.amazon.com/bedrock/latest/userguide/agents-agentcore.html
