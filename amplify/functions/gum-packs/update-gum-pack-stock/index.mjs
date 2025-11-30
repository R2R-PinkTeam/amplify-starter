/**
 * PUT /gum-packs/{packId}/stock Lambda function
 * Updates stock quantity for a gum pack with atomic conditional update
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ok, badRequest, notFound, internalError } from '../../shared/apigateway/responses.mjs';
import { isValidQuantity } from '../../shared/utils/validation.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GUM_PACKS_TABLE_NAME;

/**
 * Lambda handler for PUT /gum-packs/{packId}/stock
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const packId = event.pathParameters?.packId;

    if (!packId) {
      return badRequest('Pack ID is required');
    }

    const body = JSON.parse(event.body || '{}');
    const { quantity } = body;

    // Validate quantity
    if (quantity === undefined || !isValidQuantity(quantity)) {
      return badRequest('Quantity is required and must be a non-negative integer');
    }

    const now = new Date().toISOString();

    // Use conditional update to ensure stock never goes negative
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        packId,
      },
      UpdateExpression: 'SET stockQuantity = :quantity, updatedAt = :updatedAt',
      ConditionExpression: 'attribute_exists(packId)',
      ExpressionAttributeValues: {
        ':quantity': quantity,
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    });

    try {
      const result = await docClient.send(command);
      return ok(result.Attributes);
    } catch (error) {
      // Handle conditional check failure (item doesn't exist)
      if (error.name === 'ConditionalCheckFailedException') {
        return notFound(`Gum pack with ID ${packId} not found`);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating gum pack stock:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return badRequest('Invalid JSON in request body');
    }

    return internalError('Failed to update gum pack stock', { message: error.message });
  }
}
