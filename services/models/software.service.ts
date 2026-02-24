import { apiCall } from "@/utils/httpClient";
import { Software } from "@/types";
import { FEATURES_ENDPOINTS } from "@/constants/api";

const ENDPOINT = FEATURES_ENDPOINTS.SOFTWARES;

export const softwareService = {
  async getAll(token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, {}, token, handleUnauthorized);
  },

  async getById(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, {}, token, handleUnauthorized);
  },

  async create(software: Partial<Software>, token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, { method: "POST", body: JSON.stringify(software) }, token, handleUnauthorized);
  },

  async patch(id: number, software: Partial<Software>, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "PATCH", body: JSON.stringify(software) }, token, handleUnauthorized);
  },

  async delete(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "DELETE" }, token, handleUnauthorized);
  },
};
