import bcrypt from "bcrypt";

/**
 * Returns the bcrypt hash of the given password.
 * 
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} The hashed password.
 * @throws Will throw an error if the hashing process fails.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword: string = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hashedPassword;
  } catch (error: any) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
}

/**
 * Checks if the provided password matches the hashed password.
 * 
 * @param {string} password - The password to check.
 * @param {string} hashPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} True if the password is correct, false otherwise.
 * @throws Will throw an error if the comparison process fails.
 */
export async function checkPassword(password: string, hashPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error: any) {
    throw new Error(`Password check failed: ${error.message}`);
  }
}