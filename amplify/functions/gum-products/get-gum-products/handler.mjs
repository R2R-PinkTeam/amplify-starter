import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../../shared/apigateway/responses.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * GET /gum-products
 * Retrieve all gum products from the catalog
 */
export const handler = async (event) => {
  try {
    const tableName = process.env.GUM_PRODUCTS_TABLE_NAME;

    const command = new ScanCommand({
      TableName: tableName,
    });

    const response = await docClient.send(command);

    return ok(response.Items || []);
  } catch (error) {
    console.error('Error retrieving gum products:', error);
    return internalError('Failed to retrieve gum products');
  }
};
