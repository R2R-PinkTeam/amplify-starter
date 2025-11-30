/**
 * GET /gum-packs/{packId}/ratings Lambda function
 * Retrieves all ratings for a specific gum pack
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../../shared/apigateway/responses.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RATINGS_TABLE_NAME;

/**
 * Lambda handler for GET /gum-packs/{packId}/ratings
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const packId = event.pathParameters?.packId;
    const queryStringParams = event.queryStringParameters || {};
    const limit = queryStringParams.limit ? parseInt(queryStringParams.limit, 10) : 50;
    const lastKey = queryStringParams.lastKey ? JSON.parse(decodeURIComponent(queryStringParams.lastKey)) : undefined;

    // Query ratings by packId
    const queryParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'packId = :packId',
      ExpressionAttributeValues: {
        ':packId': packId,
      },
      ScanIndexForward: false, // Sort by timestamp descending
      Limit: limit,
    };

    if (lastKey) {
      queryParams.ExclusiveStartKey = lastKey;
    }

    const command = new QueryCommand(queryParams);
    const result = await docClient.send(command);

    const response = {
      ratings: result.Items || [],
      count: result.Count || 0,
    };

    // Include pagination token if there are more results
    if (result.LastEvaluatedKey) {
      response.lastKey = encodeURIComponent(JSON.stringify(result.LastEvaluatedKey));
    }

    return ok(response);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return internalError('Failed to fetch ratings', { message: error.message });
  }
}
