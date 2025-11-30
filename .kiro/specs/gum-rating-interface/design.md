# Design Document

## Overview

The Gum Catalog is a simple data store for gum product information used by the GumWall.ai agent to generate realistic gum wall visualizations. The system provides a REST API backed by AWS Lambda and DynamoDB to store and retrieve gum product details including brand name, color, flavor, pack size, and purchase URL for buying the gum.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GumWall.ai Agent                          │
│                  (Python + Strands SDK)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (REST)                        │
│                    /gum-products                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS Lambda Functions                      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Get Products │  │Create Product│                        │
│  │   Function   │  │   Function   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Amazon DynamoDB                         │
│                  ┌──────────────┐                           │
│                  │ GumProducts  │                           │
│                  │    Table     │                           │
│                  └──────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Backend**: AWS Lambda (Node.js 22.x, arm64)
- **API**: AWS API Gateway (REST API with OpenAPI 3.0)
- **Database**: Amazon DynamoDB
- **Infrastructure**: AWS SAM (Serverless Application Model)

## Components and Interfaces

### Backend API Endpoints

**GET /gum-products**

- **Purpose**: Retrieve all gum products
- **Response**: Array of gum product objects
- **Lambda**: `get-gum-products`

**GET /gum-products/{productId}**

- **Purpose**: Retrieve a specific gum product
- **Path Parameters**: `productId`
- **Response**: Gum product object
- **Lambda**: `get-gum-product`

**POST /gum-products**

- **Purpose**: Create a new gum product
- **Request Body**: Gum product object (brandName, color, flavor, packSize, purchaseUrl)
- **Response**: Created gum product with ID
- **Lambda**: `create-gum-product`

## Data Models

### GumProduct

```typescript
{
  productId: string;        // Partition key (UUID)
  brandName: string;        // e.g., "Dubble Bubble", "Hubba Bubba", "Bazooka"
  color: string;            // e.g., "Pink", "Blue", "Green", "Yellow"
  flavor: string;           // e.g., "Original", "Strawberry", "Grape", "Watermelon"
  packSize: number;         // Number of pieces per pack
  purchaseUrl: string;      // URL where users can buy this gum (e.g., Amazon, store website)
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

**DynamoDB Table**: `GumProducts`

- **Partition Key**: `productId` (String)

## Error Handling

### Backend Error Handling

1. **Input Validation**: Validate all inputs before processing
2. **DynamoDB Errors**: Handle database operation failures gracefully
3. **Error Responses**: Return standardized error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Codes

- `INVALID_INPUT`: Invalid request parameters
- `INVALID_URL`: Invalid purchase URL format
- `NOT_FOUND`: Resource not found
- `DATABASE_ERROR`: DynamoDB operation failed

## Testing Strategy

### Backend Testing

1. **Unit Tests**: Test Lambda functions
   - Input validation
   - DynamoDB operations (mocked)
   - Error handling

2. **Integration Tests**: Test API endpoints
   - Request/response validation
   - DynamoDB integration
   - Error scenarios

### Test Data

- Seed DynamoDB with sample gum products representing popular brands and flavors

## Security Considerations

1. **Input Validation**: Validate all inputs on backend
2. **Rate Limiting**: Configure API Gateway throttling
3. **CORS**: Configure appropriate CORS headers for agent access
4. **Data Sanitization**: Sanitize user inputs to prevent injection attacks

## Performance Optimization

1. **Backend**:
   - Optimize Lambda cold starts with arm64 architecture
   - Use efficient DynamoDB queries

2. **Database**:
   - Simple partition key design for fast lookups
   - Scan operation for retrieving all products (acceptable for small dataset)

## Deployment Strategy

1. **Infrastructure**: Deploy using AWS SAM
2. **Database**: Create DynamoDB table with SAM
3. **API**: Deploy API Gateway with OpenAPI specification
4. **Environment Variables**: Configure table names via SAM template

## Future Enhancements

1. **Search**: Add filtering by color, flavor, or brand
2. **Images**: Store gum pack image URLs
3. **Popularity**: Track which gums are most used in visualizations
4. **Batch Operations**: Add bulk import/export capabilities
