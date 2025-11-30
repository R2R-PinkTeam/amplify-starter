# Dockerfile for GumWall AI Agent
FROM public.ecr.aws/docker/library/python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY . .

# Set the entrypoint
CMD ["python", "agent.py"]
