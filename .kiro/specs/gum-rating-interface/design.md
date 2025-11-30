# Design Document

## Overview

The Gum Rating Interface is a comprehensive bubble gum management system built with AWS Amplify (React frontend) and AWS serverless backend (Lambda + DynamoDB). The system allows users to browse gum packs, submit ratings, manage inventory, place orders, and send gum packs to celebrities for endorsement.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Amplify Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Gum Packs   │  │   Ratings    │  │   Orders     │     │
│  │     Page     │  │     Page     │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Celebrity   │  │  Stock Mgmt  │                        │
│  │  Requests    │  │     Page     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (REST)                        │
│  /gum-packs  /ratings  /orders  /celebrity-requests         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS Lambda Functions                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Gum Pack    │  │   Rating     │  │    Order     │     │
│  │  Functions   │  │  Functions   │  │  Functions   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                           │
│  │  Celebrity   │                                           │
│  │  Functions   │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Amazon DynamoDB                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  GumPacks    │  │   Ratings    │  │   Orders     │     │
│  │    Table     │  │    Table     │  │    Table     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                           │
│  │  Celebrity   │                                           │
│  │  Requests    │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React with AWS Amplify UI components
- **Backend**: AWS Lambda (Node.js 22.x, arm64)
- **API**: AWS API Gateway (REST API with OpenAPI 3.0)
- **Database**: Amazon DynamoDB
- **Infrastructure**: AWS SAM (Serverless Application Model)
- **Hosting**: AWS Amplify Hosting

## Components and Interfaces

### Frontend Components (React + Amplify)

#### 1. GumPacksList Component
- **Purpose**: Display all available gum packs with filtering and sorting
- **Props**: None (fetches data internally)
- **State**: 
  - `gumPacks`: Array of gum pack objects
  - `loading`: Boolean for loading state
  - `error`: Error message string
- **Features**:
  - Grid/card layout for gum packs
  - Display color, flavor, origin, pack size, stock, average rating
  - Filter by color, flavor, origin
  - Sort by rating, stock, name
  - "Out of Stock" indicator
  - Click to view details

#### 2. GumPackDetail Component
- **Purpose**: Show detailed information for a single gum pack
- **Props**: `packId` (string)
- **State**:
  - `gumPack`: Gum pack object
  - `ratings`: Array of rating objects
  - `loading`: Boolean
- **Features**:
  - Full pack details display
  - All ratings list with timestamps
  - Average rating calculation
  - "Rate This Pack" button
  - "Add to Order" button
  - "Send to Celebrity" button

#### 3. RatingForm Component
- **Purpose**: Submit a rating for a gum pack
- **Props**: `packId` (string), `onSuccess` (callback)
- **State**:
  - `rating`: Number (1-10)
  - `submitting`: Boolean
  - `error`: String
- **Features**:
  - Rating input (1-10 scale)
  - Validation
  - Submit button
  - Success/error messages

#### 4. OrderForm Component
- **Purpose**: Place an order for gum packs
- **Props**: `packId` (string), `availableStock` (number)
- **State**:
  - `quantity`: Number
  - `submitting`: Boolean
  - `error`: String
- **Features**:
  - Quantity input with validation
  - Stock availability check
  - Submit button
  - Order confirmation

#### 5. OrdersList Component
- **Purpose**: Display user's order history
- **Props**: None
- **State**:
  - `orders`: Array of order objects
  - `loading`: Boolean
- **Features**:
  - Table/card layout
  - Show pack details, quantity, timestamp
  - Sort by date
  - Empty state message

#### 6. CelebrityRequestForm Component
- **Purpose**: Send gum packs to celebrities
- **Props**: `packId` (string)
- **State**:
  - `celebrity`: String (selected from dropdown)
  - `gumWallDestination`: String
  - `quantity`: Number
  - `submitting`: Boolean
- **Features**:
  - Celebrity dropdown (Emma Watson, Brad Pitt, etc.)
  - Gum wall destination input
  - Quantity selector
  - Submit button
  - Confirmation message

#### 7. CelebrityRequestsList Component
- **Purpose**: View all celebrity endorsement requests
- **Props**: None
- **State**:
  - `requests`: Array of celebrity request objects
  - `loading`: Boolean
- **Features**:
  - Table layout
  - Show celebrity, pack, destination, status, timestamp
  - Status badges (pending, sent, delivered)
  - Sort by date

### Backend API Endpoints

#### Gum Packs API

**GET /gum-packs**
- **Purpose**: Retrieve all gum packs
- **Query Parameters**: 
  - `color` (optional): Filter by color
  - `flavor` (optional): Filter by flavor
  - `origin` (optional): Filter by origin
- **Response**: Array of gum pack objects
- **Lambda**: `get-gum-packs`

**GET /gum-packs/{packId}**
- **Purpose**: Retrieve a specific gum pack
- **Path Parameters**: `packId`
- **Response**: Gum pack object with ratings
- **Lambda**: `get-gum-pack`

**POST /gum-packs**
- **Purpose**: Create a new gum pack (admin)
- **Request Body**: Gum pack object
- **Response**: Created gum pack with ID
- **Lambda**: `create-gum-pack`

**PUT /gum-packs/{packId}/stock**
- **Purpose**: Update stock quantity
- **Path Parameters**: `packId`
- **Request Body**: `{ "quantity": number }`
- **Response**: Updated gum pack
- **Lambda**: `update-gum-pack-stock`

#### Ratings API

**GET /gum-packs/{packId}/ratings**
- **Purpose**: Get all ratings for a gum pack
- **Path Parameters**: `packId`
- **Response**: Array of rating objects
- **Lambda**: `get-ratings`

**POST /gum-packs/{packId}/ratings**
- **Purpose**: Submit a rating for a gum pack
- **Path Parameters**: `packId`
- **Request Body**: `{ "rating": number }`
- **Response**: Created rating object
- **Lambda**: `create-rating`

#### Orders API

**GET /orders**
- **Purpose**: Get all orders
- **Query Parameters**: 
  - `limit` (optional): Pagination limit
  - `lastKey` (optional): Pagination token
- **Response**: Array of order objects
- **Lambda**: `get-orders`

**POST /orders**
- **Purpose**: Create a new order
- **Request Body**: `{ "packId": string, "quantity": number }`
- **Response**: Created order object
- **Lambda**: `create-order`

**GET /orders/{orderId}**
- **Purpose**: Get a specific order
- **Path Parameters**: `orderId`
- **Response**: Order object
- **Lambda**: `get-order`

#### Celebrity Requests API

**GET /celebrity-requests**
- **Purpose**: Get all celebrity requests
- **Response**: Array of celebrity request objects
- **Lambda**: `get-celebrity-requests`

**POST /celebrity-requests**
- **Purpose**: Create a celebrity endorsement request
- **Request Body**: 
  ```json
  {
    "packId": "string",
    "celebrity": "string",
    "gumWallDestination": "string",
    "quantity": number
  }
  ```
- **Response**: Created celebrity request object
- **Lambda**: `create-celebrity-request`

**PUT /celebrity-requests/{requestId}/status**
- **Purpose**: Update celebrity request status
- **Path Parameters**: `requestId`
- **Request Body**: `{ "status": "pending" | "sent" | "delivered" }`
- **Response**: Updated celebrity request
- **Lambda**: `update-celebrity-request-status`

## Data Models

### GumPack

```typescript
{
  packId: string;           // Partition key (UUID)
  color: string;            // e.g., "Pink", "Blue", "Green"
  flavor: string;           // e.g., "Strawberry", "Mint", "Grape"
  origin: string;           // e.g., "USA", "Japan", "Mexico"
  packSize: number;         // Number of pieces per pack
  stockQuantity: number;    // Current available stock
  averageRating: number;    // Calculated average (0-10)
  ratingCount: number;      // Total number of ratings
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

**DynamoDB Table**: `GumPacks`
- **Partition Key**: `packId` (String)
- **GSI**: `ColorIndex` on `color`
- **GSI**: `FlavorIndex` on `flavor`

### Rating

```typescript
{
  packId: string;           // Partition key
  ratingId: string;         // Sort key (UUID)
  rating: number;           // 1-10
  createdAt: string;        // ISO 8601 timestamp
}
```

**DynamoDB Table**: `Ratings`
- **Partition Key**: `packId` (String)
- **Sort Key**: `ratingId` (String)
- **GSI**: `TimestampIndex` on `createdAt`

### Order

```typescript
{
  orderId: string;          // Partition key (UUID)
  packId: string;           // Reference to gum pack
  packDetails: {            // Denormalized for display
    color: string;
    flavor: string;
    origin: string;
    packSize: number;
  };
  quantity: number;         // Number of packs ordered
  totalPieces: number;      // quantity * packSize
  status: string;           // "pending", "confirmed", "shipped", "delivered"
  createdAt: string;        // ISO 8601 timestamp
}
```

**DynamoDB Table**: `Orders`
- **Partition Key**: `orderId` (String)
- **GSI**: `TimestampIndex` on `createdAt`

### CelebrityRequest

```typescript
{
  requestId: string;        // Partition key (UUID)
  packId: string;           // Reference to gum pack
  packDetails: {            // Denormalized for display
    color: string;
    flavor: string;
    origin: string;
    packSize: number;
  };
  celebrity: string;        // Celebrity name
  gumWallDestination: string; // Target gum wall location
  quantity: number;         // Number of packs
  status: string;           // "pending", "sent", "delivered"
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

**DynamoDB Table**: `CelebrityRequests`
- **Partition Key**: `requestId` (String)
- **GSI**: `CelebrityIndex` on `celebrity`
- **GSI**: `StatusIndex` on `status`

## Error Handling

### Frontend Error Handling

1. **Network Errors**: Display user-friendly error messages with retry options
2. **Validation Errors**: Show inline validation messages on form fields
3. **API Errors**: Parse error responses and display appropriate messages
4. **Loading States**: Show loading indicators during API calls
5. **Empty States**: Display helpful messages when no data exists

### Backend Error Handling

1. **Input Validation**: Validate all inputs before processing
2. **Stock Validation**: Prevent orders/requests when stock is insufficient
3. **DynamoDB Errors**: Handle conditional check failures for stock updates
4. **Error Responses**: Return standardized error format:
   ```json
   {
     "error": "Error message",
     "code": "ERROR_CODE",
     "details": {}
   }
   ```

### Error Codes

- `INVALID_INPUT`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `INSUFFICIENT_STOCK`: Not enough stock available
- `DUPLICATE_RATING`: User already rated this pack
- `DATABASE_ERROR`: DynamoDB operation failed

## Testing Strategy

### Frontend Testing

1. **Component Tests**: Test each React component in isolation
   - Render tests
   - User interaction tests
   - State management tests
   - API integration tests (mocked)

2. **Integration Tests**: Test component interactions
   - Form submission flows
   - Navigation between pages
   - Data fetching and display

3. **E2E Tests**: Test complete user flows
   - Browse and rate gum packs
   - Place orders
   - Send celebrity requests

### Backend Testing

1. **Unit Tests**: Test Lambda functions
   - Input validation
   - Business logic
   - DynamoDB operations (mocked)
   - Error handling

2. **Integration Tests**: Test API endpoints
   - Request/response validation
   - DynamoDB integration
   - Stock update atomicity

3. **Load Tests**: Test performance
   - Concurrent order placement
   - Stock depletion scenarios
   - API Gateway throttling

### Test Data

- Seed DynamoDB with sample gum packs
- Create test celebrity list
- Generate sample ratings and orders

## Security Considerations

1. **API Authentication**: Use AWS Cognito for user authentication (future enhancement)
2. **Input Validation**: Validate all inputs on both frontend and backend
3. **Rate Limiting**: Configure API Gateway throttling
4. **CORS**: Configure appropriate CORS headers
5. **Data Sanitization**: Sanitize user inputs to prevent injection attacks
6. **Stock Atomicity**: Use DynamoDB conditional updates to prevent overselling

## Performance Optimization

1. **Frontend**:
   - Lazy load components
   - Implement pagination for large lists
   - Cache API responses
   - Optimize images

2. **Backend**:
   - Use DynamoDB batch operations where possible
   - Implement pagination for list endpoints
   - Optimize Lambda cold starts with arm64 architecture
   - Use DynamoDB GSIs for efficient queries

3. **Database**:
   - Design efficient partition keys
   - Use GSIs for common query patterns
   - Implement pagination for large result sets
   - Denormalize data where appropriate (pack details in orders)

## Deployment Strategy

1. **Infrastructure**: Deploy using AWS SAM
2. **Frontend**: Deploy to AWS Amplify Hosting
3. **Environment Variables**: Configure API endpoint URLs
4. **Database**: Create DynamoDB tables with SAM
5. **API**: Deploy API Gateway with OpenAPI specification

## Future Enhancements

1. **User Authentication**: Add AWS Cognito for user management
2. **Image Uploads**: Allow users to upload gum pack images
3. **Reviews**: Add text reviews in addition to numeric ratings
4. **Notifications**: Email notifications for celebrity request status
5. **Analytics**: Track popular gum packs and rating trends
6. **Admin Dashboard**: Manage gum packs, stock, and celebrity requests
7. **Payment Integration**: Add payment processing for orders
8. **Shipping Integration**: Track order shipments
