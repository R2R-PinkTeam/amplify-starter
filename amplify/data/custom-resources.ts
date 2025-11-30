import { defineFunction } from '@aws-amplify/backend';

/**
 * Custom DynamoDB configuration for GSIs
 * Amplify Gen 2 data models automatically create tables, but we need custom GSIs
 * for efficient querying by color, flavor, celebrity, and status
 */

// Note: Amplify Gen 2 automatically creates DynamoDB tables for models
// Additional GSIs can be added through CDK customization in backend.ts if needed
// For now, the basic schema provides the core functionality

export const customDynamoDBConfig = {
  gumPackIndexes: {
    colorIndex: 'color-index',
    flavorIndex: 'flavor-index',
  },
  ratingIndexes: {
    timestampIndex: 'timestamp-index',
  },
  orderIndexes: {
    timestampIndex: 'timestamp-index',
  },
  celebrityRequestIndexes: {
    celebrityIndex: 'celebrity-index',
    statusIndex: 'status-index',
  },
};
