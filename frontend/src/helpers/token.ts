const location = "_token";

export const setToken = (token: string) => {
  localStorage.setItem(location, token);
}

export const getToken = () => {
  return localStorage.getItem(location);
}

export const getRequestData = (method: string) => {
  return {
    method,
    headers: {
      token: getToken() ?? "",
    }
  }
}