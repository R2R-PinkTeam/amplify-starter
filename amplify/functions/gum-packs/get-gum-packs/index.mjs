/**
 * GET /gum-packs Lambda function
 * Retrieves all gum packs with optional filtering by color, flavor, and origin
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../../shared/apigateway/responses.mjs';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GUM_PACKS_TABLE_NAME;

/**
 * Lambda handler for GET /gum-packs
 * @param {object} event - API Gateway event
 * @returns {object} API Gateway response
 */
export async function handler(event) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { color, flavor, origin } = queryParams;

    // Build filter expression
    const filterExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (color) {
      filterExpressions.push('#color = :color');
      expressionAttributeNames['#color'] = 'color';
      expressionAttributeValues[':color'] = color;
    }

    if (flavor) {
      filterExpressions.push('#flavor = :flavor');
      expressionAttributeNames['#flavor'] = 'flavor';
      expressionAttributeValues[':flavor'] = flavor;
    }

    if (origin) {
      filterExpressions.push('#origin = :origin');
      expressionAttributeNames['#origin'] = 'origin';
      expressionAttributeValues[':origin'] = origin;
    }

    const scanParams = {
      TableName: TABLE_NAME,
    };

    // Add filter expression if filters are present
    if (filterExpressions.length > 0) {
      scanParams.FilterExpression = filterExpressions.join(' AND ');
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const command = new ScanCommand(scanParams);
    const result = await docClient.send(command);

    return ok({
      gumPacks: result.Items || [],
      count: result.Count || 0,
    });
  } catch (error) {
    console.error('Error fetching gum packs:', error);
    return internalError('Failed to fetch gum packs', { message: error.message });
  }
}
