# Deployment Checklist

Use this checklist to deploy the Gum Rating Interface with AWS Amplify Gen 2.

## Pre-Deployment

- [ ] Node.js 18.x or later installed
- [ ] AWS CLI configured with valid credentials
- [ ] Git repository initialized
- [ ] Dependencies installed (`npm install`)

## Backend Deployment

### Step 1: Deploy Amplify Sandbox

```bash
npx ampx sandbox
```

**Expected Output:**
```
✓ Deploying resources...
✓ Creating DynamoDB tables...
✓ Creating AppSync API...
✓ Creating Cognito User Pool...
✓ Generating amplify_outputs.json...

Sandbox deployed successfully!
```

**Verify:**
- [ ] `amplify_outputs.json` file created in project root
- [ ] No errors in terminal output
- [ ] Sandbox is running (keep terminal open)

### Step 2: Verify AWS Resources

Check AWS Console:

**DynamoDB Tables:**
- [ ] GumPack table exists
- [ ] Rating table exists
- [ ] Order table exists
- [ ] CelebrityRequest table exists

**AppSync:**
- [ ] GraphQL API created
- [ ] API Key generated
- [ ] Schema deployed

**Cognito:**
- [ ] User Pool created
- [ ] Identity Pool created

## Frontend Integration

### Step 3: Configure Amplify in Frontend

- [ ] Add Amplify configuration to `src/main.tsx`:
  ```typescript
  import { Amplify } from 'aws-amplify';
  import outputs from '../amplify_outputs.json';
  Amplify.configure(outputs);
  ```

### Step 4: Update API Calls

- [ ] Replace REST API calls with Amplify Data client
- [ ] Use generated TypeScript types
- [ ] Test all CRUD operations

### Step 5: Test Data Operations

Create test data:

```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// Test: Create a gum pack
await client.models.GumPack.create({
  packId: 'test-001',
  name: 'Test Pack',
  color: 'Pink',
  flavor: 'Strawberry',
  origin: 'USA',
  stock: 100,
  price: 2.99,
});

// Test: List gum packs
const { data } = await client.models.GumPack.list();
console.log('Gum packs:', data);
```

**Verify:**
- [ ] Gum pack created successfully
- [ ] Data appears in DynamoDB table
- [ ] List operation returns data
- [ ] No console errors

### Step 6: Test All Features

**Gum Packs:**
- [ ] List all gum packs
- [ ] Get single gum pack
- [ ] Create new gum pack
- [ ] Update gum pack (stock, price)
- [ ] Delete gum pack

**Ratings:**
- [ ] Create rating for gum pack
- [ ] List ratings for gum pack
- [ ] Update average rating calculation
- [ ] Delete rating

**Orders:**
- [ ] Create order with items
- [ ] List orders
- [ ] Update order status
- [ ] Calculate total amount

**Celebrity Requests:**
- [ ] Create request for Emma Watson
- [ ] Create request for Brad Pitt
- [ ] List all requests
- [ ] Update request status
- [ ] Filter by celebrity
- [ ] Filter by status

## Local Development

### Step 7: Start Development Server

```bash
npm run dev
```

**Verify:**
- [ ] Frontend loads at `http://localhost:5173`
- [ ] No console errors
- [ ] Data loads from backend
- [ ] All features work

## Production Deployment

### Option A: Amplify Console (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Gum Rating Interface"
   git push origin main
   ```
   - [ ] Code pushed to GitHub

2. **Connect to Amplify Console:**
   - [ ] Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - [ ] Click "New app" → "Host web app"
   - [ ] Connect GitHub repository
   - [ ] Select branch (main)
   - [ ] Review build settings
   - [ ] Click "Save and deploy"

3. **Wait for Deployment:**
   - [ ] Build completes successfully
   - [ ] Backend deployed
   - [ ] Frontend deployed
   - [ ] Domain assigned

4. **Verify Production:**
   - [ ] Visit production URL
   - [ ] Test all features
   - [ ] Check CloudWatch logs
   - [ ] Verify DynamoDB data

### Option B: CLI Deployment

```bash
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

- [ ] Deployment completes successfully
- [ ] Production URL provided
- [ ] All resources created

## Post-Deployment

### Step 8: Create Sample Data

Run data seeding script or manually create:

**Sample Gum Packs:**
- [ ] Bubble Blast (Pink, Strawberry)
- [ ] Mint Madness (Green, Peppermint)
- [ ] Citrus Burst (Orange, Orange)
- [ ] Berry Bonanza (Purple, Mixed Berry)
- [ ] Classic Chew (White, Original)

**Sample Ratings:**
- [ ] Add 3-5 ratings per gum pack
- [ ] Vary ratings (1-10)
- [ ] Include comments

**Sample Orders:**
- [ ] Create 2-3 test orders
- [ ] Different statuses (PENDING, PROCESSING, SHIPPED)

**Sample Celebrity Requests:**
- [ ] Emma Watson request (PENDING)
- [ ] Brad Pitt request (APPROVED)

### Step 9: Configure Monitoring

**CloudWatch:**
- [ ] Set up dashboard for key metrics
- [ ] Configure alarms for errors
- [ ] Set up log insights queries

**AppSync:**
- [ ] Enable detailed metrics
- [ ] Configure caching (if needed)
- [ ] Set up query logging

**DynamoDB:**
- [ ] Enable point-in-time recovery
- [ ] Configure auto-scaling (if needed)
- [ ] Set up CloudWatch alarms

### Step 10: Security Review

- [ ] Review IAM roles and permissions
- [ ] Check API authorization settings
- [ ] Verify CORS configuration
- [ ] Review Cognito user pool settings
- [ ] Enable MFA (if needed)
- [ ] Review CloudTrail logs

## Testing Checklist

### Functional Testing

- [ ] User can browse gum packs
- [ ] User can rate gum packs
- [ ] User can create orders
- [ ] User can request celebrity endorsements
- [ ] Real-time updates work
- [ ] Search/filter works
- [ ] Pagination works (if implemented)

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Handles 100+ concurrent users

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Alt text for images

## Rollback Plan

If issues occur:

1. **Revert Frontend:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Revert Backend:**
   - Go to Amplify Console
   - Select previous deployment
   - Click "Redeploy this version"

3. **Delete Sandbox:**
   ```bash
   npx ampx sandbox delete
   ```

## Success Criteria

- [ ] All backend resources deployed
- [ ] Frontend loads without errors
- [ ] All CRUD operations work
- [ ] Real-time updates function
- [ ] Sample data created
- [ ] Production URL accessible
- [ ] Monitoring configured
- [ ] Documentation updated

## Support Resources

- [Amplify Gen 2 Docs](https://docs.amplify.aws/gen2/)
- [Amplify Discord](https://discord.gg/amplify)
- [AWS Support](https://console.aws.amazon.com/support/)
- [GitHub Issues](https://github.com/aws-amplify/amplify-backend/issues)

## Notes

- Keep sandbox running during development
- Commit `amplify_outputs.json` to `.gitignore` (auto-generated)
- Monitor AWS costs in billing dashboard
- Set up budget alerts

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Production URL:** _____________

**Notes:** _____________
