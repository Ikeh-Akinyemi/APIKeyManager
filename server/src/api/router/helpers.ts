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

export {
  sanitizeUser
}