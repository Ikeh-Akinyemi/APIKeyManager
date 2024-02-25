import logger from "../lib/logger/logger";
import AppError from "./error";

/**
 * Compares the current time with a specified time to check if the current time is after the specified time.
 *
 * @param {Date} time - The time to compare against.
 * @returns {boolean} - Returns true if the current time is after the specified time, false otherwise.
 */
export function afterTime(time: Date): boolean {
  return new Date() > time;
}

/**
 * Calculates the time remaining until a future date in seconds.
 *
 * @param {Date} futureDate - The future date to calculate the time until.
 * @returns {number} - The time remaining in seconds until the future date. Returns 0 if the future date is in the past.
 */
export function timeUntil(futureDate: Date): number {
  const now = new Date();

  if (futureDate > now) {
    return Math.round((futureDate.getTime() - now.getTime()) / 1000);
  }
  return 0;
}

/**
 * Sanitizes a V3 paseto token returning only the payload component of the token.
 * @param {string} pasetoToken - The V3 paseto token.
 * @returns {string} - The sanitized part of the input token.
 */
export function sanitizeToken(pasetoToken: string): string {
  const subStrs = pasetoToken.split(".");
  if (subStrs.length == 3) {
    return subStrs[2]
  }
  throw new AppError(`failed to split token: ${pasetoToken}`);
}