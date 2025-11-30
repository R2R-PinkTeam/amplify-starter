/**
 * POST /gum-packs/{packId}/ratings Lambda function
 * Creates a new rating for a gum pack and updates the pack's average rating
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { created, badRequest, notFound, internalError } from '../../shared/apigateway/responses.mjs';
import { generateUUID } from '../../shared/utils/uuid.mjs';
import { isValidRating } from '../../shared/utils/validation.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const RATINGS_TABLE_NAME = process.env.RATINGS_TABLE_NAME;
const GUM_PACKS_TABLE_NAME = process.env.GUM_PACKS_TABLE_NAME;

/**
 * Lambda handler for POST /gum-packs/{packId}/ratings
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const packId = event.pathParameters?.packId;
    const body = JSON.parse(event.body || '{}');
    const { rating } = body;

    // Validate rating value
    if (!isValidRating(rating)) {
      return badRequest('Rating must be an integer between 1 and 10');
    }

    // Check if gum pack exists
    const getPackCommand = new GetCommand({
      TableName: GUM_PACKS_TABLE_NAME,
      Key: { packId },
    });

    const packResult = await docClient.send(getPackCommand);
    if (!packResult.Item) {
      return notFound('Gum pack not found');
    }

    const gumPack = packResult.Item;

    // Generate UUID for ratingId
    const ratingId = generateUUID();
    const now = new Date().toISOString();

    // Create rating record
    const ratingRecord = {
      packId,
      ratingId,
      rating,
      createdAt: now,
    };

    const putRatingCommand = new PutCommand({
      TableName: RATINGS_TABLE_NAME,
      Item: ratingRecord,
    });

    await docClient.send(putRatingCommand);

    // Calculate new average rating
    const currentRatingCount = gumPack.ratingCount || 0;
    const currentAverageRating = gumPack.averageRating || 0;
    const newRatingCount = currentRatingCount + 1;
    const newAverageRating = ((currentAverageRating * currentRatingCount) + rating) / newRatingCount;

    // Update gum pack with new average rating and count
    const updatePackCommand = new UpdateCommand({
      TableName: GUM_PACKS_TABLE_NAME,
      Key: { packId },
      UpdateExpression: 'SET averageRating = :avgRating, ratingCount = :count, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':avgRating': newAverageRating,
        ':count': newRatingCount,
        ':updatedAt': now,
      },
    });

    await docClient.send(updatePackCommand);

    return created(ratingRecord);
  } catch (error) {
    console.error('Error creating rating:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return badRequest('Invalid JSON in request body');
    }

    return internalError('Failed to create rating', { message: error.message });
  }
}
