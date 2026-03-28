import { User } from "../../db/seq/init";

/**
 * Sanitizes a user object retrieved from the database by removing sensitive information.
 * @param {User} dbResult - The user object retrieved from the database.
 * @returns {any} - A sanitized version of the user object with sensitive information removed.
 */
function sanitizeUser(dbResult: User): any {
  const user = dbResult.toJSON();
  delete user["passwordHash"];
  return user;
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - The maximum allowed length before truncation.
 * @returns {string} - The original string if within bounds, or a truncated version with '...' appended.
 */
function truncate(str: string, maxLength: number = 32): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
