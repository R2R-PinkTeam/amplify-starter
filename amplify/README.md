# Gum Rating Interface - AWS Amplify Gen 2 Backend

This directory contains the AWS Amplify Gen 2 backend configuration for the Gum Rating Interface application.

## Architecture

- **Framework**: AWS Amplify Gen 2
- **Database**: Amazon DynamoDB (via Amplify Data)
- **Authentication**: Amazon Cognito (via Amplify Auth)
- **API**: GraphQL API with AppSync
- **Authorization**: API Key (30-day expiration)

## Data Models

### GumPack
Stores information about gum packs available for rating and purchase.
- **Primary Key**: packId
- **Attributes**: name, color, flavor, origin, stock, price, ratings, description, imageUrl

### Rating
Stores individual ratings for gum packs.
- **Primary Key**: packId (partition), ratingId (sort)
- **Attributes**: rating (1-10), comment, userName, createdAt

### Order
Stores customer orders.
- **Primary Key**: orderId
- **Attributes**: items, totalAmount, status, shippingAddress, timestamps

### CelebrityRequest
Stores celebrity endorsement requests.
- **Primary Key**: requestId
- **Attributes**: celebrity (Emma Watson/Brad Pitt), packId, destination, status, notes, timestamps

## Project Structure

```
amplify/
├── auth/                   # Cognito authentication configuration
│   └── resource.ts
├── data/                   # DynamoDB data models
│   ├── resource.ts         # Main schema definition
│   └── custom-resources.ts # Custom DynamoDB configurations
├── functions/              # Lambda functions (future)
│   └── shared/             # Shared utilities
│       ├── apigateway/     # API Gateway response helpers
│       └── utils/          # Validation and utility functions
├── backend.ts              # Main backend configuration
└── package.json            # Amplify package configuration
```

## Setup

### Prerequisites

- Node.js 18.x or later
- AWS CLI configured
- Amplify CLI installed: `npm install -g @aws-amplify/cli`

### Install Dependencies

From the project root:
```bash
npm install
```

### Deploy Backend

```bash
npx ampx sandbox
```

For production deployment:
```bash
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

## Development

### Local Sandbox

The Amplify sandbox provides a local development environment:

```bash
npx ampx sandbox
```

This will:
- Deploy backend resources to AWS
- Generate TypeScript types for the data schema
- Watch for changes and auto-deploy

### Generated Types

After running sandbox, types are generated in:
```
amplify/data/resource.ts → generates types for frontend
```

Import in your frontend:
```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();
```

## Data Operations

### Query Examples

```typescript
// List all gum packs
const { data: gumPacks } = await client.models.GumPack.list();

// Get a specific gum pack
const { data: gumPack } = await client.models.GumPack.get({ packId: 'pack-123' });

// Create a rating
await client.models.Rating.create({
  packId: 'pack-123',
  ratingId: 'rating-456',
  rating: 9,
  comment: 'Amazing flavor!',
  userName: 'John Doe',
  createdAt: new Date().toISOString(),
});

// Create an order
await client.models.Order.create({
  orderId: 'order-789',
  items: [{ packId: 'pack-123', quantity: 2 }],
  totalAmount: 19.98,
  status: 'PENDING',
  shippingAddress: { street: '123 Main St', city: 'Seattle' },
  createdAt: new Date().toISOString(),
});

// Create a celebrity request
await client.models.CelebrityRequest.create({
  requestId: 'req-101',
  celebrity: 'Emma Watson',
  packId: 'pack-123',
  destination: 'Seattle Gum Wall',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
});
```

## Authorization

Currently using API Key authorization for public access. To switch to authenticated access:

1. Update `amplify/data/resource.ts`:
```typescript
.authorization((allow) => [allow.authenticated()])
```

2. Update frontend to use authenticated requests

## Custom Lambda Functions

Lambda functions can be added under `amplify/functions/`:

```typescript
// amplify/functions/my-function/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const myFunction = defineFunction({
  name: 'my-function',
  entry: './handler.ts',
});
```

Then add to `backend.ts`:
```typescript
import { myFunction } from './functions/my-function/resource';

defineBackend({
  auth,
  data,
  myFunction,
});
```

## Environment Variables

Amplify automatically manages environment variables. Access them in Lambda:

```typescript
const tableName = process.env.AMPLIFY_DATA_GUMPACK_TABLE_NAME;
```

## Monitoring

- **CloudWatch Logs**: Automatic logging for all resources
- **AppSync Console**: Query and mutation monitoring
- **DynamoDB Console**: Table metrics and item inspection

## Migration from SAM

This backend replaces the previous SAM-based implementation with Amplify Gen 2:

**Benefits:**
- Automatic type generation for frontend
- Simplified deployment with `npx ampx sandbox`
- Built-in authentication and authorization
- GraphQL API with real-time subscriptions
- Automatic CloudFormation stack management

**Key Differences:**
- GraphQL API instead of REST API
- Amplify Data models instead of raw DynamoDB tables
- Cognito authentication built-in
- No manual SAM template management

## Troubleshooting

### Sandbox Issues

```bash
# Reset sandbox
npx ampx sandbox delete
npx ampx sandbox
```

### Type Generation Issues

```bash
# Regenerate types
npx ampx generate graphql-client-code
```

### Deployment Issues

```bash
# Check Amplify status
npx ampx sandbox status

# View logs
npx ampx sandbox logs
```

## Resources

- [Amplify Gen 2 Documentation](https://docs.amplify.aws/gen2/)
- [Amplify Data Documentation](https://docs.amplify.aws/gen2/build-a-backend/data/)
- [Amplify Auth Documentation](https://docs.amplify.aws/gen2/build-a-backend/auth/)
