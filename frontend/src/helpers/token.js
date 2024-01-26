const location = "_token";

export const setToken = (token) => {
  localStorage.setItem(location, token);
}

export const getToken = () => {
  return localStorage.getItem(location);
}

export const getRequestData = (method) => {
  return {
    method,
    headers: {
      token: getToken() ?? "",
    }
  }
}