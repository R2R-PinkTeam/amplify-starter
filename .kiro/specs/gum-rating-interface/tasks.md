# Implementation Plan

- [x] 1. Set up project structure and DynamoDB tables
  - Create SAM template with DynamoDB table definitions for GumPacks, Ratings, Orders, and CelebrityRequests
  - Configure GSIs for efficient querying (ColorIndex, FlavorIndex, TimestampIndex, CelebrityIndex, StatusIndex)
  - Set up environment variables for table names
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 2. Implement Gum Packs API endpoints
- [ ] 2.1 Create get-gum-packs Lambda function
  - Implement GET /gum-packs endpoint to retrieve all gum packs with optional filtering
  - Add query parameter support for color, flavor, and origin filters
  - Implement DynamoDB scan/query with filter expressions
  - _Requirements: 1.1, 1.2_

- [ ] 2.2 Create get-gum-pack Lambda function
  - Implement GET /gum-packs/{packId} endpoint to retrieve a specific gum pack
  - Fetch gum pack details from DynamoDB
  - Return 404 if pack not found
  - _Requirements: 1.5_

- [ ] 2.3 Create create-gum-pack Lambda function
  - Implement POST /gum-packs endpoint to create new gum packs
  - Validate input data (color, flavor, origin, packSize, stockQuantity)
  - Generate UUID for packId
  - Store in DynamoDB with timestamps
  - _Requirements: 7.1, 7.2_

- [ ] 2.4 Create update-gum-pack-stock Lambda function
  - Implement PUT /gum-packs/{packId}/stock endpoint
  - Use DynamoDB conditional update to prevent negative stock
  - Update stock quantity atomically
  - _Requirements: 7.3, 7.4_

- [ ]* 2.5 Write unit tests for gum pack functions
  - Test get-gum-packs with various filters
  - Test get-gum-pack with valid and invalid IDs
  - Test create-gum-pack validation
  - Test update-gum-pack-stock atomic updates
  - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3_

- [ ] 3. Implement Ratings API endpoints
- [ ] 3.1 Create get-ratings Lambda function
  - Implement GET /gum-packs/{packId}/ratings endpoint
  - Query ratings by packId from DynamoDB
  - Sort by timestamp in descending order
  - Implement pagination support
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 3.2 Create create-rating Lambda function
  - Implement POST /gum-packs/{packId}/ratings endpoint
  - Validate rating value (1-10 range)
  - Generate UUID for ratingId
  - Store rating in DynamoDB
  - Update gum pack's average rating and rating count
  - _Requirements: 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 3.3 Write unit tests for rating functions
  - Test get-ratings pagination
  - Test create-rating validation
  - Test average rating calculation
  - Test rating count updates
  - _Requirements: 2.3, 2.4, 3.1, 3.5_

- [ ] 4. Implement Orders API endpoints
- [ ] 4.1 Create get-orders Lambda function
  - Implement GET /orders endpoint to retrieve all orders
  - Query orders from DynamoDB sorted by timestamp
  - Implement pagination with limit and lastKey parameters
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 4.2 Create get-order Lambda function
  - Implement GET /orders/{orderId} endpoint
  - Fetch specific order from DynamoDB
  - Return 404 if order not found
  - _Requirements: 6.1_

- [ ] 4.3 Create create-order Lambda function
  - Implement POST /orders endpoint
  - Validate packId and quantity
  - Check stock availability before creating order
  - Use DynamoDB transaction to atomically create order and reduce stock
  - Denormalize pack details in order record
  - Calculate totalPieces (quantity * packSize)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.5_

- [ ]* 4.4 Write unit tests for order functions
  - Test get-orders pagination
  - Test create-order stock validation
  - Test create-order transaction atomicity
  - Test insufficient stock error handling
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 5. Implement Celebrity Requests API endpoints
- [ ] 5.1 Create get-celebrity-requests Lambda function
  - Implement GET /celebrity-requests endpoint
  - Query all celebrity requests from DynamoDB
  - Sort by timestamp in descending order
  - Include status in response
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 5.2 Create create-celebrity-request Lambda function
  - Implement POST /celebrity-requests endpoint
  - Validate celebrity name from predefined list (Emma Watson, Brad Pitt)
  - Validate gum wall destination (max 200 characters)
  - Check stock availability
  - Use DynamoDB transaction to create request and reduce stock
  - Denormalize pack details in request record
  - Set initial status to "pending"
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 5.3 Create update-celebrity-request-status Lambda function
  - Implement PUT /celebrity-requests/{requestId}/status endpoint
  - Validate status value (pending, sent, delivered)
  - Update status and updatedAt timestamp
  - _Requirements: 9.5_

- [ ]* 5.4 Write unit tests for celebrity request functions
  - Test get-celebrity-requests sorting
  - Test create-celebrity-request validation
  - Test celebrity name validation
  - Test stock reduction transaction
  - Test update-celebrity-request-status
  - _Requirements: 8.2, 8.3, 8.5, 8.7, 9.5_

- [ ] 6. Create OpenAPI specification
  - Define all API endpoints with request/response schemas
  - Add validation rules for request bodies
  - Configure CORS settings
  - Define error response schemas
  - _Requirements: All API requirements_

- [ ] 7. Update SAM template with API Gateway integration
  - Configure API Gateway with OpenAPI integration
  - Link Lambda functions to API endpoints
  - Set up environment variables for DynamoDB table names
  - Configure CORS for frontend integration
  - Add Lambda execution roles with DynamoDB permissions
  - _Requirements: All requirements_

- [ ] 8. Implement shared utilities
- [ ] 8.1 Create DynamoDB utility module
  - Helper functions for common DynamoDB operations
  - Transaction helper for atomic stock updates
  - Pagination helper
  - _Requirements: 7.5, 10.6_

- [ ] 8.2 Create API Gateway response utility
  - Standardized success response formatter
  - Standardized error response formatter
  - CORS headers helper
  - _Requirements: All API requirements_

- [ ] 8.3 Create validation utility
  - Input validation functions
  - Rating range validation (1-10)
  - Stock quantity validation (non-negative)
  - Celebrity name validation
  - _Requirements: 2.4, 5.2, 7.3, 8.3_

- [ ] 9. Set up React frontend with AWS Amplify
- [ ] 9.1 Initialize Amplify project
  - Create React app with Amplify CLI
  - Configure Amplify hosting
  - Set up API endpoint configuration
  - _Requirements: All frontend requirements_

- [ ] 9.2 Create GumPacksList component
  - Display gum packs in grid/card layout
  - Implement filtering by color, flavor, origin
  - Implement sorting options
  - Show stock status and average rating
  - Add "Out of Stock" indicator
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 9.3 Create GumPackDetail component
  - Display full pack details
  - Show all ratings with timestamps
  - Calculate and display average rating
  - Add action buttons (Rate, Order, Send to Celebrity)
  - _Requirements: 1.5, 4.4, 4.5_

- [ ] 9.4 Create RatingForm component
  - Rating input field (1-10)
  - Form validation
  - Submit button with loading state
  - Success/error message display
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 9.5 Create OrderForm component
  - Quantity input with validation
  - Stock availability check
  - Submit button with loading state
  - Order confirmation display
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9.6 Create OrdersList component
  - Display orders in table/card layout
  - Show pack details, quantity, timestamp
  - Sort by date descending
  - Empty state message
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9.7 Create CelebrityRequestForm component
  - Celebrity dropdown (Emma Watson, Brad Pitt)
  - Gum wall destination input
  - Quantity selector
  - Submit button with loading state
  - Confirmation message
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 9.8 Create CelebrityRequestsList component
  - Display requests in table layout
  - Show celebrity, pack, destination, status, timestamp
  - Status badges (pending, sent, delivered)
  - Sort by date descending
  - Empty state message
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9.9 Create API service module
  - Centralized API client with fetch
  - Functions for all API endpoints
  - Error handling and response parsing
  - _Requirements: All API requirements_

- [ ] 9.10 Implement routing and navigation
  - Set up React Router
  - Create navigation menu
  - Link all pages together
  - _Requirements: All frontend requirements_

- [ ]* 9.11 Write component tests
  - Test GumPacksList rendering and filtering
  - Test RatingForm validation
  - Test OrderForm stock validation
  - Test CelebrityRequestForm validation
  - _Requirements: All frontend requirements_

- [ ] 10. Deploy and test end-to-end
- [ ] 10.1 Deploy backend infrastructure
  - Run sam build and sam deploy
  - Verify DynamoDB tables created
  - Verify Lambda functions deployed
  - Verify API Gateway endpoints active
  - _Requirements: All requirements_

- [ ] 10.2 Seed initial data
  - Create sample gum packs with various colors, flavors, origins
  - Add initial stock quantities
  - _Requirements: 1.1, 1.2_

- [ ] 10.3 Deploy frontend to Amplify
  - Build React app
  - Deploy to Amplify Hosting
  - Configure API endpoint environment variables
  - _Requirements: All frontend requirements_

- [ ] 10.4 Test complete user flows
  - Browse gum packs and view details
  - Submit ratings and verify average calculation
  - Place orders and verify stock reduction
  - Send celebrity requests and verify stock reduction
  - View orders and celebrity requests lists
  - _Requirements: All requirements_

- [ ]* 10.5 Validate all endpoints
  - Run API tests against deployed endpoints
  - Verify error handling
  - Test edge cases (insufficient stock, invalid inputs)
  - _Requirements: All requirements_
