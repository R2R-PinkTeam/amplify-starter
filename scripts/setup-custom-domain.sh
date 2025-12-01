#!/bin/bash

# Script to set up custom domain for ChewView Amplify app
# Usage: ./scripts/setup-custom-domain.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_ID="d2w2ndupz7hq1f"
DOMAIN="chewview.me"
REGION="us-west-2"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ChewView Custom Domain Setup            ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  App ID:  ${GREEN}$APP_ID${NC}"
echo -e "  Domain:  ${GREEN}$DOMAIN${NC}"
echo -e "  Region:  ${GREEN}$REGION${NC}"
echo ""

# Check if domain already exists
echo -e "${YELLOW}Checking if domain is already configured...${NC}"
EXISTING_DOMAIN=$(aws amplify get-domain-association \
  --app-id "$APP_ID" \
  --domain-name "$DOMAIN" \
  --region "$REGION" 2>/dev/null || echo "")

if [ ! -z "$EXISTING_DOMAIN" ]; then
  echo -e "${YELLOW}⚠️  Domain already configured!${NC}"
  echo ""
  echo -e "${BLUE}Current domain status:${NC}"
  echo "$EXISTING_DOMAIN" | jq -r '.domainAssociation | "Status: \(.domainStatus)\nSSL: \(.certificateVerificationDNSRecord // "N/A")"'
  echo ""
  read -p "Do you want to update the configuration? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Exiting without changes.${NC}"
    exit 0
  fi
fi

# Create domain association
echo -e "\n${YELLOW}Creating domain association...${NC}"
aws amplify create-domain-association \
  --app-id "$APP_ID" \
  --domain-name "$DOMAIN" \
  --enable-auto-sub-domain \
  --sub-domain-settings \
    prefix=,branchName=main \
    prefix=www,branchName=main \
  --region "$REGION" > /tmp/domain-association.json

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Domain association created successfully!${NC}"
else
  echo -e "${RED}✗ Failed to create domain association${NC}"
  exit 1
fi

# Get domain details
echo -e "\n${YELLOW}Fetching domain configuration...${NC}"
sleep 2
aws amplify get-domain-association \
  --app-id "$APP_ID" \
  --domain-name "$DOMAIN" \
  --region "$REGION" > /tmp/domain-details.json

# Extract DNS records
echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DNS Records to Configure                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# SSL Verification Record
SSL_RECORD=$(cat /tmp/domain-details.json | jq -r '.domainAssociation.certificateVerificationDNSRecord // "Pending..."')
echo -e "${YELLOW}1. SSL Certificate Verification (CNAME):${NC}"
echo -e "   Add this record to verify SSL certificate:"
echo -e "   ${GREEN}$SSL_RECORD${NC}"
echo ""

# Root domain
echo -e "${YELLOW}2. Root Domain (chewview.me):${NC}"
cat /tmp/domain-details.json | jq -r '.domainAssociation.subDomains[] | select(.subDomainSetting.prefix == "") | "   Type: CNAME\n   Name: @\n   Value: \(.dnsRecord)"'
echo ""

# WWW subdomain
echo -e "${YELLOW}3. WWW Subdomain (www.chewview.me):${NC}"
cat /tmp/domain-details.json | jq -r '.domainAssociation.subDomains[] | select(.subDomainSetting.prefix == "www") | "   Type: CNAME\n   Name: www\n   Value: \(.dnsRecord)"'
echo ""

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Next Steps                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}1.${NC} Add the DNS records above to your domain registrar"
echo -e "${YELLOW}2.${NC} Wait for DNS propagation (5 mins - 48 hours)"
echo -e "${YELLOW}3.${NC} SSL certificate will be issued automatically"
echo -e "${YELLOW}4.${NC} Check status in Amplify Console:"
echo -e "   ${BLUE}https://us-west-2.console.aws.amazon.com/amplify/home?region=us-west-2#/$APP_ID/settings/domain${NC}"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""

# Save records to file
cat /tmp/domain-details.json | jq -r '.domainAssociation' > dns-records.json
echo -e "${YELLOW}DNS records saved to: ${GREEN}dns-records.json${NC}"
