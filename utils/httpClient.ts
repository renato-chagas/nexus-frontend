import { API_BASE, DEFAULT_API_HEADERS } from "@/constants/api";

export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
  handleUnauthorized?: () => void
) {
  const headers: HeadersInit = {
    ...DEFAULT_API_HEADERS,
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) headers.Authorization = `Bearer ${storedToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (handleUnauthorized) handleUnauthorized();
    return null;
  }

  if (res.ok) return res.json();

  throw new Error(`Erro ${res.status}: ${res.statusText}`);
}