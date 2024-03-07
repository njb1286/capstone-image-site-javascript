const location = "_token";

export const setToken = (token: string) => {
  localStorage.setItem(location, token);
}

export const getToken = () => {
  const token = localStorage.getItem(location);

  if (!token) return "";

  return `Bearer ${token}`;
}