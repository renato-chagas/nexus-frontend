const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_PREFIX = "/api";

export const API_BASE = `${API_BASE_URL}${API_PREFIX}`;

export const AUTH_ENDPOINTS = {
  TOKEN_REFRESH: "/token/refresh/",
  USER_ME: "/users/me/",
};

export const FEATURES_ENDPOINTS = {
  ASSETS: `/assets/`,
  ASSET_HISTORY: `/asset-history/`,
  CATEGORIES: `/categories/`,
  EMPLOYEES: `/employees/`,
  IMAGES: `/imagem/`,
  SOFTWARES: `/softwares/`,
  USERS: `/users/`,
};

export const DEFAULT_API_HEADERS = {
  "Content-Type": "application/json",
};

