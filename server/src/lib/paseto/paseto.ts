/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { V3 } from "paseto";
import { afterTime } from "../../utils/misc";
import { configs } from "../../utils/configs";

const { encrypt, decrypt } = V3;

export const ErrInvalidToken = new Error("token is invalid");
export const ErrExpiredToken = new Error("token has expired");

export interface Payload {
  id: string;
  userId: number;
  email: string;
  extra: any;
  expiredAt: Date;
  iat: Date;
}

/**
 * Class representing a token maker using PASETO (Platform-Agnostic Security Tokens).
 * @param {string} symmetricKey - The symmetric key used for token encryption and decryption.
 */
class PasetoMaker {
  private symmetricKey: Buffer;

  constructor(symmetricKey: string) {
    if (symmetricKey.length !== 32) {
      throw new Error("Invalid key size: must be exactly 32 characters");
    }
    this.symmetricKey = Buffer.from(symmetricKey);
  }

  /**
   * Creates a token with a specified payload.
   *
   * @async
   * @param {number} userID - The user ID.
   * @param {string} email - The user's email.
   * @param {number} duration - The token's duration in minutes.
   * @param {any} extra - Additional payload data.
   * @returns {Promise<{ token: string; payload: Payload }>} - The created token and its payload.
   */
  async createToken(
    userId: number,
    email: string,
    duration: number,
    extra: any
  ): Promise<{ token: string; payload: Payload }> {
    const newId = uuidv4();
    const payload = {
      id: newId,
      userId,
      email,
      extra,
      expiredAt: new Date(Date.now() + duration * 60 * 1000),
      iat: new Date(Date.now())
    };

    const token = await encrypt(payload, this.symmetricKey);

    return { token, payload };
  }

  /**
   * Verifies a token and returns its payload.
   *
   * @async
   * @param {string} token - The token to be verified.
   * @returns {Promise<Payload>} - The token's payload.
   * @throws Will throw an error if the token is invalid or expired.
   */
  async verifyToken(token: string): Promise<Payload> {
    let payload: Payload;
    try {
      payload = await decrypt(token, this.symmetricKey);
    } catch (error) {
      throw ErrInvalidToken;
    }

    if (afterTime(new Date(payload.expiredAt))) {
      throw ErrExpiredToken;
    }

    return payload;
  }
}

const pasetoMaker = new PasetoMaker(configs.TokenSymmetricKey);

export default pasetoMaker;