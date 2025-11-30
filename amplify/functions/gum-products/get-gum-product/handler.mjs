import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ok, badRequest, notFound, internalError } from '../../shared/apigateway/responses.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * GET /gum-products/{productId}
 * Retrieve a specific gum product by ID
 */
export const handler = async (event) => {
  try {
    const tableName = process.env.GUM_PRODUCTS_TABLE_NAME;
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return badRequest('Product ID is required');
    }

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        productId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return notFound('Product not found');
    }

    return ok(response.Item);
  } catch (error) {
    console.error('Error retrieving gum product:', error);
    return internalError('Failed to retrieve gum product');
  }
};
