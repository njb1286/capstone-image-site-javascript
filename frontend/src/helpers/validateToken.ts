import { backendUrl } from "../store/backend-url";

type Response = {
  message: string;
} | {
  tokenIsValid: boolean;
}

export const validateToken = async (token: string | null) => {

  if (!token) return false;

  const response = await fetch(`${backendUrl}/validate-token`, {
    method: "GET",
    headers: {
      token
    }
  });

  const data = await response.json() as Response;

  if ("message" in data) {
    return false;
  }

  return data.tokenIsValid;
}