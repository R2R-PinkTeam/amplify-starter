/**
 * Validation utilities
 * Common validation functions for input data
 */

/**
 * Validate rating value (1-10 range)
 * @param {number} rating - Rating value to validate
 * @returns {boolean} True if valid
 */
export function isValidRating(rating) {
  return typeof rating === 'number' && rating >= 1 && rating <= 10 && Number.isInteger(rating);
}

/**
 * Validate stock quantity (non-negative)
 * @param {number} quantity - Quantity to validate
 * @returns {boolean} True if valid
 */
export function isValidQuantity(quantity) {
  return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity);
}

/**
 * Validate celebrity name from predefined list
 * @param {string} celebrity - Celebrity name to validate
 * @returns {boolean} True if valid
 */
export function isValidCelebrity(celebrity) {
  const validCelebrities = ['Emma Watson', 'Brad Pitt'];
  return typeof celebrity === 'string' && validCelebrities.includes(celebrity);
}

/**
 * Validate gum wall destination (max 200 characters)
 * @param {string} destination - Destination to validate
 * @returns {boolean} True if valid
 */
export function isValidDestination(destination) {
  return typeof destination === 'string' && destination.length > 0 && destination.length <= 200;
}

/**
 * Validate UUID format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
}
