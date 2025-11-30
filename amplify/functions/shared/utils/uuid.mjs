/**
 * UUID generation utility
 * Generates UUIDs for resource identifiers
 */

import { randomUUID } from 'crypto';

/**
 * Generate a new UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
  return randomUUID();
}
