const location = "_token";

/**
 * @param {string} token 
 */
export const setToken = (token: string) => {
  localStorage.setItem(location, token);
}

export const getToken = () => {
  return localStorage.getItem(location);
}

/**
 * @param {string} method 
 */
export const getRequestData = (method: string) => {
  return {
    method,
    headers: {
      token: getToken() ?? "",
    }
  }
}