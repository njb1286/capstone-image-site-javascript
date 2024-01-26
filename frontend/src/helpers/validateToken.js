import { backendUrl } from "../store/backend-url";

export const validateToken = async (token) => {

  if (!token) return false;

  const response = await fetch(`${backendUrl}/validate-token`, {
    method: "GET",
    headers: {
      token
    }
  });

  const data = await response.json();

  if ("message" in data) {
    return false;
  }

  return data.tokenIsValid;
}