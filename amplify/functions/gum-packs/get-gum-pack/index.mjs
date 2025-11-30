/**
 * GET /gum-packs/{packId} Lambda function
 * Retrieves a specific gum pack by ID
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ok, notFound, internalError } from '../../shared/apigateway/responses.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GUM_PACKS_TABLE_NAME;

/**
 * Lambda handler for GET /gum-packs/{packId}
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const packId = event.pathParameters?.packId;

    if (!packId) {
      return notFound('Pack ID is required');
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        packId,
      },
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return notFound(`Gum pack with ID ${packId} not found`);
    }

    return ok(result.Item);
  } catch (error) {
    console.error('Error fetching gum pack:', error);
    return internalError('Failed to fetch gum pack', { message: error.message });
  }
}
