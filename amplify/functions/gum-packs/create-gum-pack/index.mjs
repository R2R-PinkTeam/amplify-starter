/**
 * POST /gum-packs Lambda function
 * Creates a new gum pack
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { created, badRequest, internalError } from '../../shared/apigateway/responses.mjs';
import { generateUUID } from '../../shared/utils/uuid.mjs';
import { isValidQuantity } from '../../shared/utils/validation.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GUM_PACKS_TABLE_NAME;

/**
 * Lambda handler for POST /gum-packs
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { color, flavor, origin, packSize, stockQuantity } = body;

    // Validate required fields
    if (!color || typeof color !== 'string') {
      return badRequest('Color is required and must be a string');
    }

    if (!flavor || typeof flavor !== 'string') {
      return badRequest('Flavor is required and must be a string');
    }

    if (!origin || typeof origin !== 'string') {
      return badRequest('Origin is required and must be a string');
    }

    if (!packSize || typeof packSize !== 'number' || packSize <= 0) {
      return badRequest('Pack size is required and must be a positive number');
    }

    if (stockQuantity === undefined || !isValidQuantity(stockQuantity)) {
      return badRequest('Stock quantity is required and must be a non-negative integer');
    }

    // Generate UUID for packId
    const packId = generateUUID();
    const now = new Date().toISOString();

    const gumPack = {
      packId,
      color,
      flavor,
      origin,
      packSize,
      stockQuantity,
      averageRating: 0,
      ratingCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: gumPack,
    });

    await docClient.send(command);

    return created(gumPack);
  } catch (error) {
    console.error('Error creating gum pack:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return badRequest('Invalid JSON in request body');
    }

    return internalError('Failed to create gum pack', { message: error.message });
  }
}
