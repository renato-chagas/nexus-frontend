import { apiCall } from "@/utils/httpClient";
import { Asset } from "@/types";
import { FEATURES_ENDPOINTS } from "@/constants/api";

const ENDPOINT = FEATURES_ENDPOINTS.ASSETS;

export const assetService = {
  async getAll(token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, {}, token, handleUnauthorized);
  },

  async getById(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, {}, token, handleUnauthorized);
  },

  async create(asset: Asset, token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, { method: "POST", body: JSON.stringify(asset) }, token, handleUnauthorized);
  },

  async update(id: number, asset: Asset, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "PUT", body: JSON.stringify(asset) }, token, handleUnauthorized);
  },

  async patch(id: number, asset: Partial<Asset>, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "PATCH", body: JSON.stringify(asset) }, token, handleUnauthorized);
  },

  async delete(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "DELETE" }, token, handleUnauthorized);
  },
};