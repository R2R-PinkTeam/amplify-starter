import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { created, badRequest, internalError } from '../../shared/apigateway/responses.mjs';
import { generateUUID } from '../../shared/utils/uuid.mjs';
import { validateGumProduct } from '../../shared/utils/validation.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * POST /gum-products
 * Create a new gum product
 */
export const handler = async (event) => {
  try {
    const tableName = process.env.GUM_PRODUCTS_TABLE_NAME;
    const body = JSON.parse(event.body || '{}');

    // Validate input
    const validation = validateGumProduct(body);
    if (!validation.valid) {
      return badRequest(validation.error);
    }

    const now = new Date().toISOString();
    const product = {
      productId: generateUUID(),
      brandName: body.brandName,
      color: body.color,
      flavor: body.flavor,
      packSize: body.packSize,
      purchaseUrl: body.purchaseUrl,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: product,
    });

    await docClient.send(command);

    return created(product);
  } catch (error) {
    console.error('Error creating gum product:', error);
    return internalError('Failed to create gum product');
  }
};
