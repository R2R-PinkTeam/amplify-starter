# Migration to AWS Amplify Gen 2

This document describes the migration from SAM-based backend to AWS Amplify Gen 2.

## What Changed

### Architecture

**Before (SAM):**
- Manual DynamoDB table definitions in `template.yaml`
- REST API with API Gateway
- Manual Lambda function configuration
- Manual IAM role management
- Separate deployment with `sam deploy`

**After (Amplify Gen 2):**
- Declarative data models in `amplify/data/resource.ts`
- GraphQL API with AWS AppSync
- Automatic Lambda function generation
- Automatic IAM role management
- Simple deployment with `npx ampx sandbox`

### Data Models

All DynamoDB tables are now defined as Amplify Data models:

| SAM Table | Amplify Model | Changes |
|-----------|---------------|---------|
| GumPacksTable | GumPack | Same structure, GraphQL API |
| RatingsTable | Rating | Same structure, GraphQL API |
| OrdersTable | Order | Same structure, GraphQL API |
| CelebrityRequestsTable | CelebrityRequest | Same structure, GraphQL API |

### API Changes

**Before (REST):**
```javascript
// GET /gum-packs
fetch('https://api.example.com/gum-packs')
```

**After (GraphQL):**
```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';

const client = generateClient<Schema>();
const { data } = await client.models.GumPack.list();
```

### File Structure

**Removed:**
```
backend/
├── template.yaml          → Replaced by amplify/data/resource.ts
├── samconfig.toml         → Not needed
├── src/functions/         → Will be amplify/functions/
└── src/shared/            → Moved to amplify/functions/shared/
```

**Added:**
```
amplify/
├── data/
│   ├── resource.ts        → Data model definitions
│   └── custom-resources.ts → Custom configurations
├── functions/
│   └── shared/            → Shared utilities
└── README.md              → Amplify documentation
```

## Migration Steps

### 1. Data Model Migration

The data models have been migrated to Amplify Gen 2 schema:

```typescript
// amplify/data/resource.ts
const schema = a.schema({
  GumPack: a.model({
    packId: a.id().required(),
    name: a.string().required(),
    color: a.string().required(),
    // ... other fields
  }),
  // ... other models
});
```

### 2. Shared Utilities Migration

Shared utilities have been moved to `amplify/functions/shared/`:

- `apigateway/responses.mjs` → API Gateway response helpers
- `utils/validation.mjs` → Validation functions
- `utils/uuid.mjs` → UUID generation

### 3. Lambda Functions (Future)

When adding Lambda functions, create them under `amplify/functions/`:

```typescript
// amplify/functions/my-function/resource.ts
import { defineFunction } from '@aws-amplify/backend';

export const myFunction = defineFunction({
  name: 'my-function',
  entry: './handler.ts',
});
```

## Frontend Integration

### Install Amplify Client

```bash
npm install aws-amplify
```

### Configure Amplify

```typescript
// src/main.tsx or src/App.tsx
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

### Use Data Client

```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// List gum packs
const { data: gumPacks } = await client.models.GumPack.list();

// Create a rating
await client.models.Rating.create({
  packId: 'pack-123',
  ratingId: 'rating-456',
  rating: 9,
  comment: 'Great flavor!',
  userName: 'John Doe',
  createdAt: new Date().toISOString(),
});
```

## Deployment

### Development

```bash
# Start local sandbox
npx ampx sandbox

# This will:
# - Deploy backend to AWS
# - Generate types
# - Watch for changes
```

### Production

```bash
# Deploy to production
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

## Benefits of Amplify Gen 2

1. **Type Safety**: Automatic TypeScript type generation
2. **Simplified Deployment**: Single command deployment
3. **Real-time**: Built-in GraphQL subscriptions
4. **Authentication**: Integrated Cognito auth
5. **Developer Experience**: Hot reload, local sandbox
6. **Maintenance**: Less boilerplate, automatic updates

## Rollback Plan

If needed, the SAM template can be restored from git history:

```bash
git checkout <commit-hash> -- backend/
```

## Next Steps

1. ✅ Data models migrated to Amplify Gen 2
2. ✅ Shared utilities moved to amplify/functions/shared/
3. ⏳ Deploy sandbox: `npx ampx sandbox`
4. ⏳ Update frontend to use Amplify client
5. ⏳ Add Lambda functions as needed
6. ⏳ Configure CI/CD pipeline

## Support

- [Amplify Gen 2 Documentation](https://docs.amplify.aws/gen2/)
- [Amplify Discord](https://discord.gg/amplify)
- [GitHub Issues](https://github.com/aws-amplify/amplify-backend/issues)
