import axios from "axios";
import { env } from "../config/env";
import { encrypt, decrypt } from "./encryption-utils";

// Optionally, use encrypted tokens in localStorage
const TOKEN_KEY = "token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, encrypt(token));
};

export const getToken = (): string | null => {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  if (!encrypted) return null;
  return decrypt(encrypted);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("email");
};

export const api = axios.create({
  baseURL: env.API_URL,
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout only on token/authentication failures, not every 401 response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message ?? '').toLowerCase();
    const tokenError =
      status === 401 &&
      (message.includes('invalid token') ||
        message.includes('no token') ||
        message.includes('token expired') ||
        message.includes('expired token'));

    if (tokenError) {
      clearAuthStorage();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
