## ChewView - AWS re:Invent 2025 Pink Team

A monumentally over-engineered AI-powered platform for creating and sharing digital chew wall art, built with AWS Amplify Gen 2.

## Overview

ChewView helps users design, plan, and generate unique chew wall art with AI. Upload wall photos, browse community creations, and share your colorful designs with the world.

Built with React, TypeScript, and AWS Amplify Gen 2, showcasing modern serverless architecture, real-time data synchronization, and AI-powered image generation.

## Features

- **Design Gallery**: Browse and explore amazing chew wall designs from the community
- **Image Upload**: Upload your wall photos to S3 with secure storage
- **AI Generation**: Generate unique chew wall images using advanced AI technology
- **My Designs**: View and manage your personal chew wall art collection
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

## Demo User

For demos and testing, a demo user account is available:

**Credentials:**
- Email: `demo@chewview.local`
- Password: `DemoUser123!`

### Creating the Demo User

After deploying your Amplify app, create the demo user by running:

```bash
node scripts/create-demo-user.mjs
```

This script will:
- ✅ Create a user with verified email (no verification needed)
- ✅ Set a permanent password
- ✅ Make the account ready for immediate login

The demo user is perfect for:
- Product demonstrations
- Testing image uploads
- Showcasing the full user experience
- Hackathon presentations

**Note:** The demo user is created in your Cognito User Pool and can upload images, create designs, and access all authenticated features.

## Data Models

### Todo
Task management for team collaboration.
- Fields: content, priority, category, completed, timestamps

### Challenge
Competition challenges with points and difficulty.
- Fields: title, description, points, difficulty, category, isCompleted, timestamps

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