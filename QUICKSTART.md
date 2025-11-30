# Gum Rating Interface - Quick Start Guide

Get the Gum Rating Interface up and running in minutes with AWS Amplify Gen 2.

## Prerequisites

- Node.js 18.x or later
- AWS Account with CLI configured
- Git

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Amplify Sandbox

```bash
npx ampx sandbox
```

This command will:
- Deploy your backend to AWS (DynamoDB tables, AppSync API, Cognito auth)
- Generate TypeScript types for your data models
- Create `amplify_outputs.json` for frontend configuration
- Watch for changes and auto-deploy

**Note:** First deployment takes 2-3 minutes. Keep the terminal open.

### 3. Start Frontend Development Server

In a new terminal:

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`

## What's Deployed

When you run `npx ampx sandbox`, Amplify creates:

### DynamoDB Tables
- **GumPack** - Gum pack catalog with ratings
- **Rating** - Individual ratings for gum packs
- **Order** - Customer orders
- **CelebrityRequest** - Celebrity endorsement requests

### AppSync GraphQL API
- Automatic CRUD operations for all models
- Real-time subscriptions
- API Key authentication (30-day expiration)

### Cognito Authentication
- Email-based user authentication
- User pool and identity pool

## Using the Data API

### In React Components

```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// List all gum packs
const { data: gumPacks } = await client.models.GumPack.list();

// Get a specific gum pack
const { data: gumPack } = await client.models.GumPack.get({ 
  packId: 'pack-123' 
});

// Create a new rating
await client.models.Rating.create({
  packId: 'pack-123',
  ratingId: crypto.randomUUID(),
  rating: 9,
  comment: 'Amazing flavor!',
  userName: 'John Doe',
  createdAt: new Date().toISOString(),
});

// Update a gum pack
await client.models.GumPack.update({
  packId: 'pack-123',
  stock: 50,
});

// Delete a rating
await client.models.Rating.delete({
  packId: 'pack-123',
  ratingId: 'rating-456',
});
```

### Real-time Subscriptions

```typescript
// Subscribe to new ratings
const subscription = client.models.Rating.onCreate().subscribe({
  next: (data) => console.log('New rating:', data),
  error: (error) => console.error('Subscription error:', error),
});

// Unsubscribe when done
subscription.unsubscribe();
```

## Project Structure

```
.
├── amplify/                    # Backend configuration
│   ├── auth/                   # Cognito authentication
│   ├── data/                   # DynamoDB data models
│   ├── functions/              # Lambda functions
│   │   └── shared/             # Shared utilities
│   └── backend.ts              # Main backend config
├── src/                        # Frontend React app
│   ├── components/             # React components
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # App entry point
├── amplify_outputs.json        # Generated backend config
└── package.json                # Dependencies
```

## Common Commands

```bash
# Start sandbox (backend + watch mode)
npx ampx sandbox

# Start frontend dev server
npm run dev

# Build frontend for production
npm run build

# Preview production build
npm run preview

# Generate GraphQL types
npx ampx generate graphql-client-code

# View sandbox status
npx ampx sandbox status

# Delete sandbox resources
npx ampx sandbox delete
```

## Sample Data

### Create Sample Gum Packs

```typescript
const samplePacks = [
  {
    packId: 'pack-001',
    name: 'Bubble Blast',
    color: 'Pink',
    flavor: 'Strawberry',
    origin: 'USA',
    stock: 100,
    price: 2.99,
    description: 'Classic bubble gum flavor',
    imageUrl: 'https://example.com/bubble-blast.jpg',
  },
  {
    packId: 'pack-002',
    name: 'Mint Madness',
    color: 'Green',
    flavor: 'Peppermint',
    origin: 'Canada',
    stock: 75,
    price: 3.49,
    description: 'Refreshing mint flavor',
    imageUrl: 'https://example.com/mint-madness.jpg',
  },
];

for (const pack of samplePacks) {
  await client.models.GumPack.create(pack);
}
```

## Troubleshooting

### Sandbox Won't Start

```bash
# Delete and recreate sandbox
npx ampx sandbox delete
npx ampx sandbox
```

### Types Not Generated

```bash
# Manually generate types
npx ampx generate graphql-client-code
```

### Frontend Can't Connect to Backend

1. Ensure `amplify_outputs.json` exists in project root
2. Check that Amplify is configured in `src/main.tsx`:
   ```typescript
   import { Amplify } from 'aws-amplify';
   import outputs from '../amplify_outputs.json';
   Amplify.configure(outputs);
   ```

### AWS Credentials Issues

```bash
# Configure AWS CLI
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

## Next Steps

1. ✅ Backend deployed with Amplify sandbox
2. ✅ Frontend running locally
3. ⏳ Create sample data
4. ⏳ Build rating interface UI
5. ⏳ Add celebrity request feature
6. ⏳ Implement order processing
7. ⏳ Deploy to production

## Production Deployment

When ready for production:

```bash
# Connect to Amplify Console
npx ampx pipeline-deploy --branch main

# Or use Amplify Console UI
# 1. Go to AWS Amplify Console
# 2. Connect your Git repository
# 3. Amplify auto-detects configuration
# 4. Deploy!
```

## Resources

- [Amplify Gen 2 Docs](https://docs.amplify.aws/gen2/)
- [Data API Reference](https://docs.amplify.aws/gen2/build-a-backend/data/)
- [Authentication Guide](https://docs.amplify.aws/gen2/build-a-backend/auth/)
- [Deployment Guide](https://docs.amplify.aws/gen2/deploy-and-host/)

## Support

Need help? Check:
- [Amplify Discord](https://discord.gg/amplify)
- [GitHub Discussions](https://github.com/aws-amplify/amplify-backend/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aws-amplify)
