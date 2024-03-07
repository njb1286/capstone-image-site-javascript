import { backendUrl } from "../store/backend-url";

type Response = {
  message: string;
} | {
  tokenIsValid: boolean;
}

export const validateToken = async (token: string | null): Promise<{ valid: boolean } | { status: number }> => {
  try {    
    if (!token) return { valid: false };
    
    const response = await fetch(`${backendUrl}/validate-token`, {
      method: "GET",
      headers: {
        token,
      }
    });
    
    if (response.status === 500) return { status: response.status };

    if (response.status > 299) {
      return { valid: false }
    }

    const data = await response.json() as Response;    

    if ("message" in data) {
      return { valid: false }
    }

    return { valid: data.tokenIsValid };
  } catch {
    return { status: 500 };
  }
}