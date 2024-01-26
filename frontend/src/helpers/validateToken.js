import { backendUrl } from "../store/backend-url";

/**
 * @typedef {{message: string} | {tokenIsValid: boolean}} Response
 */

/**
 * @param {string | null} token 
 * @returns {Promise<Response>}
 */

export const validateToken = async (token) => {

  try {
    if (!token) return { valid: false };

    const response = await fetch(`${backendUrl}/validate-token`, {
      method: "GET",
      headers: {
        token
      }
    });

    if (response.status === 500) return { status: response.status };

    /** @type {Response} */
    const data = await response.json();

    if ("message" in data) {
      return { valid: false }
    }

    return { valid: data.tokenIsValid };
  } catch {
    return { status: 500 };
  }
}