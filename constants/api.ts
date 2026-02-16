

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_PREFIX = "/api";

const API_BASE = `${API_BASE_URL}${API_PREFIX}`;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  TOKEN_REFRESH: `${API_BASE}/token/refresh/`,
  USER_ME: `${API_BASE}/users/me/`,
};

// Features Endpoints
export const FEATURES_ENDPOINTS = {
  ASSETS: `${API_BASE}/assets/`,
  ASSET_HISTORY: `${API_BASE}/asset-history/`,
  CATEGORIES: `${API_BASE}/categories/`,
  EMPLOYEES: `${API_BASE}/employees/`,
  IMAGES: `${API_BASE}/imagem/`,
  SOFTWARES: `${API_BASE}/softwares/`,
  USERS: `${API_BASE}/users/`,
};

// Default Values
export const DEFAULT_API_HEADERS = {
  "Content-Type": "application/json",
};

// Timeouts
export const API_TIMEOUTS = {
  DEFAULT: 10000, 
  LONG_REQUEST: 30000, 
};
