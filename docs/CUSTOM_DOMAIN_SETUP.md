# Custom Domain Setup for ChewView.me

This guide walks you through setting up the custom domain `chewview.me` for your Amplify app.

## Current Amplify App Info

- **App Name:** amplify-starter
- **App ID:** d2w2ndupz7hq1f
- **Default Domain:** d2w2ndupz7hq1f.amplifyapp.com
- **Region:** us-west-2

## Option 1: AWS Console (Recommended for Quick Setup)

### Step 1: Add Custom Domain in Amplify Console

1. Go to [AWS Amplify Console](https://us-west-2.console.aws.amazon.com/amplify/home?region=us-west-2#/d2w2ndupz7hq1f)
2. Click on **"Domain management"** in the left sidebar
3. Click **"Add domain"**
4. Enter your domain: `chewview.me`
5. Click **"Configure domain"**
6. Amplify will automatically:
   - Create an SSL certificate
   - Set up CloudFront distribution
   - Provide DNS records to configure

### Step 2: Configure DNS Records

Amplify will provide you with DNS records. You need to add these to your domain registrar:

**For Root Domain (chewview.me):**
- Type: `A` or `ALIAS`
- Name: `@` or leave blank
- Value: Provided by Amplify (CloudFront distribution)

**For WWW Subdomain (www.chewview.me):**
- Type: `CNAME`
- Name: `www`
- Value: Provided by Amplify

**For SSL Verification:**
- Type: `CNAME`
- Name: Provided by Amplify (e.g., `_abc123.chewview.me`)
- Value: Provided by Amplify (ACM validation)

### Step 3: Wait for DNS Propagation

- DNS propagation can take 5-48 hours
- SSL certificate validation typically takes 5-30 minutes
- You can check status in Amplify Console

## Option 2: AWS CLI

### Add Custom Domain

```bash
# Add the custom domain
aws amplify create-domain-association \
  --app-id d2w2ndupz7hq1f \
  --domain-name chewview.me \
  --sub-domain-settings prefix=,branchName=main \
  --region us-west-2

# Get DNS records to configure
aws amplify get-domain-association \
  --app-id d2w2ndupz7hq1f \
  --domain-name chewview.me \
  --region us-west-2
```

### Update DNS Records

The CLI output will provide the DNS records you need to add to your domain registrar.

## Option 3: Route 53 (If Domain is in Route 53)

If your domain is managed by Route 53, Amplify can automatically configure DNS:

1. In Amplify Console, when adding the domain, select **"Route 53 hosted zone"**
2. Amplify will automatically create the necessary records
3. No manual DNS configuration needed!

## Verification

Once DNS is configured, verify your setup:

```bash
# Check DNS propagation
dig chewview.me
dig www.chewview.me

# Check SSL certificate
curl -I https://chewview.me
```

## Expected Timeline

- **Domain association:** Immediate
- **SSL certificate request:** 1-2 minutes
- **SSL certificate validation:** 5-30 minutes (requires DNS records)
- **DNS propagation:** 5 minutes to 48 hours
- **Full availability:** Usually within 1 hour if DNS is configured correctly

## Troubleshooting

### SSL Certificate Pending

If SSL certificate is stuck in "Pending validation":
1. Verify CNAME records for ACM validation are correct
2. Check DNS propagation: `dig _abc123.chewview.me CNAME`
3. Wait up to 30 minutes for validation

### Domain Not Resolving

If domain doesn't resolve after 24 hours:
1. Verify A/ALIAS record points to Amplify CloudFront distribution
2. Check for conflicting DNS records
3. Ensure TTL is not too high (recommended: 300 seconds)

### Mixed Content Warnings

If you see mixed content warnings:
1. Ensure all resources use HTTPS
2. Update any hardcoded HTTP URLs to HTTPS
3. Check browser console for specific issues

## Quick Setup Script

For Route 53 domains, you can use this script:

```bash
#!/bin/bash

APP_ID="d2w2ndupz7hq1f"
DOMAIN="chewview.me"
REGION="us-west-2"

echo "Adding custom domain to Amplify app..."
aws amplify create-domain-association \
  --app-id $APP_ID \
  --domain-name $DOMAIN \
  --enable-auto-sub-domain \
  --sub-domain-settings prefix=www,branchName=main prefix=,branchName=main \
  --region $REGION

echo "Domain association created. Check Amplify Console for DNS records."
echo "https://us-west-2.console.aws.amazon.com/amplify/home?region=us-west-2#/$APP_ID/settings/domain"
```

## Post-Setup

After domain is active:

1. Update README.md with new domain
2. Update any hardcoded URLs in the app
3. Set up redirects from www to root (or vice versa)
4. Test all functionality on the new domain
5. Update demo credentials documentation if needed

## Resources

- [Amplify Custom Domains Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
- [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1)
- [Route 53 Console](https://console.aws.amazon.com/route53/)
