#!/bin/bash

# Script to create a demo user in Cognito User Pool
# This creates a user with a confirmed email that doesn't require verification

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating demo user in Cognito...${NC}"

# Get the User Pool ID from amplify_outputs.json
USER_POOL_ID=$(jq -r '.auth.user_pool_id' amplify_outputs.json)

if [ -z "$USER_POOL_ID" ] || [ "$USER_POOL_ID" = "null" ]; then
    echo -e "${RED}Error: Could not find User Pool ID in amplify_outputs.json${NC}"
    echo "Make sure you have deployed your Amplify app first."
    exit 1
fi

echo -e "User Pool ID: ${GREEN}$USER_POOL_ID${NC}"

# Demo user credentials
DEMO_EMAIL="demo@chewview.local"
DEMO_PASSWORD="DemoUser123!"

echo -e "\n${YELLOW}Creating user: $DEMO_EMAIL${NC}"

# Create the user
aws cognito-idp admin-create-user \
    --user-pool-id "$USER_POOL_ID" \
    --username "$DEMO_EMAIL" \
    --user-attributes Name=email,Value="$DEMO_EMAIL" Name=email_verified,Value=true \
    --message-action SUPPRESS \
    --region us-east-1

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create user. User may already exist.${NC}"
    echo -e "${YELLOW}Attempting to set password for existing user...${NC}"
fi

# Set permanent password
echo -e "\n${YELLOW}Setting permanent password...${NC}"
aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$DEMO_EMAIL" \
    --password "$DEMO_PASSWORD" \
    --permanent \
    --region us-east-1

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Demo user created successfully!${NC}"
    echo -e "\n${GREEN}Demo Credentials:${NC}"
    echo -e "  Email:    ${YELLOW}$DEMO_EMAIL${NC}"
    echo -e "  Password: ${YELLOW}$DEMO_PASSWORD${NC}"
    echo -e "\n${YELLOW}Note: This user can log in immediately without email verification.${NC}"
else
    echo -e "\n${RED}Failed to set password for demo user.${NC}"
    exit 1
fi
