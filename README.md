## Gum Rating Interface - AWS re:Invent 2025 Pink Team

A monumentally over-engineered AI-powered platform for rating gum and planning gum walls, built with AWS Amplify Gen 2.

## Overview

The Gum Rating Interface helps users discover, rate, and purchase gum packs while planning their own gum wall installations. Features celebrity endorsement requests (Emma Watson and Brad Pitt only!) and comprehensive order management.

Built with React, TypeScript, and AWS Amplify Gen 2, showcasing modern serverless architecture and real-time data synchronization.

## Features

- **Gum Pack Catalog**: Browse and rate gum packs by color, flavor, and origin
- **Rating System**: 1-10 rating scale with comments and user attribution
- **Order Management**: Complete e-commerce flow with order tracking
- **Celebrity Requests**: Request celebrity endorsements for your gum wall
- **Real-time Updates**: Live data synchronization with GraphQL subscriptions
- **Authentication**: Secure user authentication with Amazon Cognito
- **Type Safety**: Full TypeScript support with auto-generated types

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **UI**: AWS Amplify UI Components
- **State**: AWS Amplify Data Client

### Backend (AWS Amplify Gen 2)
- **Database**: Amazon DynamoDB (4 tables)
- **API**: AWS AppSync (GraphQL)
- **Authentication**: Amazon Cognito
- **Authorization**: API Key (public access)
- **Infrastructure**: AWS Amplify Gen 2

## Quick Start

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Start Amplify sandbox (deploys backend)
npx ampx sandbox

# In another terminal, start frontend
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Data Models

### GumPack
Gum pack catalog with ratings and inventory.
- Fields: packId, name, color, flavor, origin, stock, price, ratings, description, imageUrl

### Rating
Individual ratings for gum packs.
- Fields: packId, ratingId, rating (1-10), comment, userName, createdAt

### Order
Customer orders with items and shipping.
- Fields: orderId, items, totalAmount, status, shippingAddress, timestamps

### CelebrityRequest
Celebrity endorsement requests.
- Fields: requestId, celebrity (Emma Watson/Brad Pitt), packId, destination, status, notes, timestamps

## Project Structure

```
.
├── amplify/                    # AWS Amplify Gen 2 backend
│   ├── auth/                   # Cognito authentication
│   ├── data/                   # DynamoDB data models
│   ├── functions/              # Lambda functions
│   │   └── shared/             # Shared utilities
│   └── backend.ts              # Backend configuration
├── src/                        # React frontend
│   ├── components/             # React components
│   ├── App.tsx                 # Main app
│   └── main.tsx                # Entry point
├── QUICKSTART.md               # Quick start guide
├── AMPLIFY_MIGRATION.md        # Migration from SAM
└── package.json                # Dependencies
```

## Development

```bash
# Start backend sandbox
npx ampx sandbox

# Start frontend dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deploying to AWS

### Option 1: Amplify Console (Recommended)

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. Click "New app" → "Host web app"
4. Connect your repository
5. Amplify auto-detects configuration and deploys

### Option 2: CLI Deployment

```bash
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

For detailed deployment instructions, see the [Amplify deployment docs](https://docs.amplify.aws/gen2/deploy-and-host/).

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.