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

/**
 * Validate URL format (HTTP or HTTPS)
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(url) {
  if (typeof url !== 'string') {
    return false;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate gum product data
 * @param {Object} product - Product data to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export function validateGumProduct(product) {
  if (!product.brandName || typeof product.brandName !== 'string' || product.brandName.trim() === '') {
    return { valid: false, error: 'Brand name is required and must not be empty' };
  }

  if (!product.color || typeof product.color !== 'string' || product.color.trim() === '') {
    return { valid: false, error: 'Color is required and must not be empty' };
  }

  if (!product.flavor || typeof product.flavor !== 'string') {
    return { valid: false, error: 'Flavor is required' };
  }

  if (!product.packSize || typeof product.packSize !== 'number' || !Number.isInteger(product.packSize) || product.packSize <= 0) {
    return { valid: false, error: 'Pack size must be a positive integer' };
  }

  if (product.purchaseUrl && !isValidUrl(product.purchaseUrl)) {
    return { valid: false, error: 'Purchase URL must be a valid HTTP or HTTPS URL' };
  }

  return { valid: true };
}
