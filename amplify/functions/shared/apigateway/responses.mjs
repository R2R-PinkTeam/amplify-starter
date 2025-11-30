/**
 * API Gateway response utilities
 * Standardized response formatting for Lambda functions
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Create a success response
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response data
 * @returns {object} API Gateway response
 */
export function successResponse(statusCode, data) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

/**
 * Create an error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {object} details - Additional error details
 * @returns {object} API Gateway response
 */
export function errorResponse(statusCode, message, code = 'ERROR', details = {}) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: message,
      code,
      details,
    }),
  };
}

/**
 * Create a 200 OK response
 * @param {object} data - Response data
 * @returns {object} API Gateway response
 */
export function ok(data) {
  return successResponse(200, data);
}

/**
 * Create a 201 Created response
 * @param {object} data - Response data
 * @returns {object} API Gateway response
 */
export function created(data) {
  return successResponse(201, data);
}

/**
 * Create a 400 Bad Request response
 * @param {string} message - Error message
 * @param {object} details - Additional error details
 * @returns {object} API Gateway response
 */
export function badRequest(message, details = {}) {
  return errorResponse(400, message, 'INVALID_INPUT', details);
}

/**
 * Create a 404 Not Found response
 * @param {string} message - Error message
 * @returns {object} API Gateway response
 */
export function notFound(message = 'Resource not found') {
  return errorResponse(404, message, 'NOT_FOUND');
}

/**
 * Create a 500 Internal Server Error response
 * @param {string} message - Error message
 * @param {object} details - Additional error details
 * @returns {object} API Gateway response
 */
export function internalError(message = 'Internal server error', details = {}) {
  return errorResponse(500, message, 'INTERNAL_ERROR', details);
}
