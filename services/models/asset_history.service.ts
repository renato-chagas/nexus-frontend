import { apiCall } from "@/utils/httpClient";
import { AssetHistory, CreateAssetHistoryDTO } from "@/types";
import { FEATURES_ENDPOINTS } from "@/constants/api";

const ENDPOINT = FEATURES_ENDPOINTS.ASSET_HISTORY;

export const assetHistoryService = {
    async getAll (token?: string, handleUnauthorized?: () => void) {
        return apiCall(ENDPOINT, {}, token, handleUnauthorized);
    },

    async getById (id: number, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, {}, token, handleUnauthorized);
    },

    async create (data: CreateAssetHistoryDTO, token?: string, handleUnauthorized?: () => void) {
        return apiCall(ENDPOINT, { method: "POST", body: JSON.stringify(data) }, token, handleUnauthorized);
    },

    async update (id: number, data: AssetHistory, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "PUT", body: JSON.stringify(data) }, token, handleUnauthorized);
    },

    async patch (id: number, data: Partial<AssetHistory>, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "PATCH", body: JSON.stringify(data) }, token, handleUnauthorized);
    },

    async delete (id: number, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "DELETE" }, token, handleUnauthorized);
    },
}