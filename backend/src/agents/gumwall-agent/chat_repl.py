#!/usr/bin/env python3
"""
GumWall Agent Chat REPL

Simulates the frontend chat interface for testing the deployed agent.
"""

import sys
import json
import subprocess
from datetime import datetime

# Agent ARN from deployment
AGENT_ARN = "arn:aws:bedrock-agentcore:us-west-2:148290399417:runtime/gumwallagent-jsKzlk7a9v"
REGION = "us-west-2"


def print_banner():
    """Print welcome banner."""
    print("=" * 80)
    print("🍬 GumWall AI - Chat REPL")
    print("=" * 80)
    print()
    print("Modes:")
    print("  upload <s3_url>     - Analyze wall for viability")
    print("  generate <s3_url>   - Generate color-by-numbers chart")
    print("  chat <message>      - Chat with the agent")
    print()
    print("Commands:")
    print("  set-url <s3_url>    - Set default S3 URL for chat")
    print("  clear               - Clear screen")
    print("  exit                - Exit REPL")
    print()
    print("=" * 80)
    print()


def invoke_agent(payload: dict) -> str:
    """Invoke the deployed agent via AgentCore Runtime."""
    try:
        # Use agentcore CLI for invocation
        import subprocess
        
        result = subprocess.run(
            [".venv/bin/agentcore", "invoke", json.dumps(payload)],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode != 0:
            return f"❌ Error: {result.stderr}"
        
        return result.stdout
        
    except subprocess.TimeoutExpired:
        return "❌ Error: Request timed out"
    except Exception as e:
        return f"❌ Error: {str(e)}"


def main():
    """Run the REPL."""
    print_banner()
    
    default_s3_url = ""
    
    while True:
        try:
            # Get user input
            user_input = input("🍬 > ").strip()
            
            if not user_input:
                continue
            
            # Parse command
            parts = user_input.split(maxsplit=1)
            command = parts[0].lower()
            args = parts[1] if len(parts) > 1 else ""
            
            # Handle commands
            if command == "exit":
                print("\n👋 Goodbye!")
                break
            
            elif command == "clear":
                print("\033[2J\033[H")  # Clear screen
                print_banner()
                continue
            
            elif command == "set-url":
                if not args:
                    print("❌ Usage: set-url <s3_url>")
                    continue
                default_s3_url = args
                print(f"✅ Default S3 URL set to: {default_s3_url}")
                continue
            
            elif command == "upload":
                if not args:
                    print("❌ Usage: upload <s3_url>")
                    continue
                
                print(f"\n📤 Uploading and analyzing: {args}")
                print("-" * 80)
                
                payload = {
                    "mode": "upload",
                    "s3_image_url": args
                }
                
                result = invoke_agent(payload)
                print(result)
                print("-" * 80)
                print()
            
            elif command == "generate":
                if not args:
                    print("❌ Usage: generate <s3_url>")
                    continue
                
                print(f"\n🎨 Generating color chart for: {args}")
                print("-" * 80)
                
                payload = {
                    "mode": "generate",
                    "s3_image_url": args
                }
                
                result = invoke_agent(payload)
                print(result)
                print("-" * 80)
                print()
            
            elif command == "chat":
                if not args:
                    print("❌ Usage: chat <message>")
                    continue
                
                print(f"\n💬 Chat: {args}")
                print("-" * 80)
                
                payload = {
                    "mode": "chat",
                    "message": args
                }
                
                if default_s3_url:
                    payload["s3_image_url"] = default_s3_url
                
                result = invoke_agent(payload)
                print(result)
                print("-" * 80)
                print()
            
            else:
                print(f"❌ Unknown command: {command}")
                print("Type 'exit' to quit or try: upload, generate, chat")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        
        except Exception as e:
            print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
