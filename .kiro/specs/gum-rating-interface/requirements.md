# Requirements Document

## Introduction

This feature adds a comprehensive bubble gum management system with a user interface for browsing available gum packs, submitting ratings based on multiple attributes (color, flavor, origin), managing stock inventory, and placing orders. The interface will be built using AWS Amplify and all data (ratings, stock, orders) will be stored in Amazon DynamoDB.

## Glossary

- **Gum Management System**: The complete user interface and backend system that manages gum packs, ratings, stock, and orders
- **Gum Pack**: A product unit of bubble gum available for rating and purchase, defined by color, flavor, origin, and pack size
- **Gum Rating**: A user-submitted evaluation of a specific gum pack with a numeric rating score
- **Stock Inventory**: The current quantity of available gum packs in the system
- **Order**: A user request to purchase one or more gum packs
- **Celebrity Request**: A request to send gum packs to a celebrity for endorsement and contribution to a specified gum wall
- **Celebrity**: A well-known person who can provide endorsement by chewing gum and contributing to a gum wall
- **Gum Wall Destination**: The specific gum wall location where celebrity-chewed gum will be contributed
- **DynamoDB Tables**: The AWS DynamoDB tables that persist gum pack data, ratings, stock levels, order information, and celebrity requests
- **Amplify Web Interface**: The React-based frontend built with AWS Amplify for browsing, rating, ordering gum packs, and sending to celebrities
- **Rating Attributes**: The specific characteristics of a gum pack (color, flavor, origin, pack size)

## Requirements

### Requirement 1

**User Story:** As a gum wall enthusiast, I want to browse available bubble gum packs with their details, so that I can see what options are available for rating and purchase

#### Acceptance Criteria

1. WHEN the user navigates to the gum packs page, THE Gum Management System SHALL display a list of all available gum packs
2. WHEN displaying gum packs, THE Gum Management System SHALL show color, flavor, origin, pack size, and current stock quantity for each pack
3. WHEN displaying gum packs, THE Gum Management System SHALL show the average rating for each pack
4. WHEN a gum pack has zero stock, THE Gum Management System SHALL display an "Out of Stock" indicator
5. WHEN the user clicks on a gum pack, THE Gum Management System SHALL display detailed information including all ratings

### Requirement 2

**User Story:** As a gum wall enthusiast, I want to submit ratings for specific bubble gum packs, so that I can share my opinions on which gums work best for gum walls

#### Acceptance Criteria

1. WHEN the user selects a gum pack to rate, THE Gum Management System SHALL display a rating form for that specific pack
2. WHEN the rating form is displayed, THE Gum Management System SHALL show the pack details (color, flavor, origin, pack size)
3. WHEN the user enters a rating value, THE Gum Management System SHALL accept a numeric value between 1 and 10
4. WHEN the user attempts to submit a rating outside the range of 1-10, THE Gum Management System SHALL display an error message indicating the valid range
5. WHEN the user submits a valid rating, THE Gum Management System SHALL display a success confirmation message

### Requirement 3

**User Story:** As a gum wall enthusiast, I want my ratings to be stored persistently and linked to specific gum packs, so that my contributions are saved and can be referenced later

#### Acceptance Criteria

1. WHEN the user submits a valid rating, THE Gum Management System SHALL send the rating data to a backend API endpoint
2. WHEN the backend receives rating data, THE Gum Management System SHALL store the rating in the DynamoDB Tables with a unique rating identifier
3. WHEN the rating is stored, THE Gum Management System SHALL link it to the specific gum pack identifier
4. WHEN the rating is successfully stored, THE Gum Management System SHALL include a timestamp of submission
5. WHEN the rating is successfully stored, THE Gum Management System SHALL update the average rating for the gum pack
6. IF the storage operation fails, THEN THE Gum Management System SHALL return an error response with details

### Requirement 4

**User Story:** As a gum wall enthusiast, I want to view all ratings for a specific gum pack, so that I can see what the community thinks about it

#### Acceptance Criteria

1. WHEN the user views a gum pack detail page, THE Gum Management System SHALL retrieve all ratings for that pack from the DynamoDB Tables
2. WHEN ratings are retrieved, THE Gum Management System SHALL display them showing the rating score and timestamp
3. WHEN ratings are displayed, THE Gum Management System SHALL sort them by submission timestamp in descending order
4. WHEN no ratings exist for a pack, THE Gum Management System SHALL display a message indicating no ratings have been submitted yet
5. WHEN ratings are displayed, THE Gum Management System SHALL show the average rating prominently

### Requirement 5

**User Story:** As a gum wall enthusiast, I want to place orders for gum packs, so that I can purchase the gums I need for my gum wall

#### Acceptance Criteria

1. WHEN the user selects a gum pack with available stock, THE Gum Management System SHALL display an "Add to Order" button
2. WHEN the user clicks "Add to Order", THE Gum Management System SHALL allow the user to specify a quantity
3. WHEN the user specifies a quantity greater than available stock, THE Gum Management System SHALL display an error message
4. WHEN the user submits a valid order, THE Gum Management System SHALL create an order record in the DynamoDB Tables
5. WHEN an order is created, THE Gum Management System SHALL reduce the stock quantity by the ordered amount

### Requirement 6

**User Story:** As a gum wall enthusiast, I want to view my order history, so that I can track what gum packs I have purchased

#### Acceptance Criteria

1. WHEN the user navigates to the orders page, THE Gum Management System SHALL retrieve all orders from the DynamoDB Tables
2. WHEN orders are retrieved, THE Gum Management System SHALL display them showing gum pack details, quantity, and order timestamp
3. WHEN orders are displayed, THE Gum Management System SHALL sort them by order timestamp in descending order
4. WHEN no orders exist, THE Gum Management System SHALL display a message indicating no orders have been placed yet
5. WHEN displaying an order, THE Gum Management System SHALL show the total quantity ordered

### Requirement 7

**User Story:** As a system administrator, I want gum pack and stock data to be managed efficiently, so that inventory is accurate and up-to-date

#### Acceptance Criteria

1. WHEN a gum pack is created, THE Gum Management System SHALL store it in the DynamoDB Tables with a unique pack identifier
2. WHEN a gum pack is stored, THE Gum Management System SHALL include all required attributes (color, flavor, origin, pack size, stock quantity)
3. WHEN stock quantity is updated, THE Gum Management System SHALL ensure the value is never negative
4. WHEN retrieving gum packs, THE Gum Management System SHALL include current stock levels
5. WHEN an order is placed, THE Gum Management System SHALL atomically update the stock quantity to prevent overselling

### Requirement 8

**User Story:** As a gum wall enthusiast, I want to send gum packs to celebrities for endorsement, so that they can chew the gum and contribute it to a gum wall of their choice

#### Acceptance Criteria

1. WHEN the user selects a gum pack, THE Gum Management System SHALL display a "Send to Celebrity" option
2. WHEN the user clicks "Send to Celebrity", THE Gum Management System SHALL display a form with celebrity name selection and gum wall destination
3. WHEN the user selects a celebrity, THE Gum Management System SHALL accept celebrity names from a predefined list including Emma Watson and Brad Pitt
4. WHEN the user specifies a gum wall destination, THE Gum Management System SHALL accept text input up to 200 characters
5. WHEN the user submits a celebrity endorsement request, THE Gum Management System SHALL create a celebrity request record in the DynamoDB Tables
6. WHEN a celebrity request is created, THE Gum Management System SHALL include the gum pack details, celebrity name, destination gum wall, and request timestamp
7. WHEN a celebrity request is successfully created, THE Gum Management System SHALL reduce the stock quantity by the requested amount
8. WHEN a celebrity request is created, THE Gum Management System SHALL display a confirmation message with the request details

### Requirement 9

**User Story:** As a gum wall enthusiast, I want to view all celebrity endorsement requests, so that I can see which celebrities have been sent gum packs

#### Acceptance Criteria

1. WHEN the user navigates to the celebrity requests page, THE Gum Management System SHALL retrieve all celebrity requests from the DynamoDB Tables
2. WHEN celebrity requests are retrieved, THE Gum Management System SHALL display them showing gum pack details, celebrity name, destination gum wall, and request timestamp
3. WHEN celebrity requests are displayed, THE Gum Management System SHALL sort them by request timestamp in descending order
4. WHEN no celebrity requests exist, THE Gum Management System SHALL display a message indicating no requests have been made yet
5. WHEN displaying a celebrity request, THE Gum Management System SHALL show the status (pending, sent, delivered)

### Requirement 10

**User Story:** As a system administrator, I want all data to be structured consistently in DynamoDB, so that it can be easily queried and analyzed

#### Acceptance Criteria

1. WHEN a gum pack is stored in the DynamoDB Tables, THE Gum Management System SHALL use a partition key with the pack identifier
2. WHEN a rating is stored in the DynamoDB Tables, THE Gum Management System SHALL use a partition key with the pack identifier and sort key with the rating identifier
3. WHEN an order is stored in the DynamoDB Tables, THE Gum Management System SHALL use a partition key with the order identifier
4. WHEN a celebrity request is stored in the DynamoDB Tables, THE Gum Management System SHALL use a partition key with the request identifier
5. WHEN storing any record, THE Gum Management System SHALL use consistent data types for each attribute
6. WHEN querying data, THE Gum Management System SHALL support pagination for large result sets
