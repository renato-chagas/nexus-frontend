import { apiCall } from "@/utils/httpClient";
import { Category, CreateCategoryDTO } from "@/types";
import { FEATURES_ENDPOINTS } from "@/constants/api";

const ENDPOINT = FEATURES_ENDPOINTS.CATEGORIES;

export const categoryService = {
    async getAll (token?: string, handleUnauthorized?: () => void) {
        return apiCall(ENDPOINT, {}, token, handleUnauthorized);
    },

    async getById (id: number, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, {}, token, handleUnauthorized);
    },

    async create (category: CreateCategoryDTO, token?: string, handleUnauthorized?: () => void) {
        return apiCall(ENDPOINT, { method: "POST", body: JSON.stringify(category) }, token, handleUnauthorized);
    },

    async update (id: number, category: Category, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "PUT", body: JSON.stringify(category) }, token, handleUnauthorized);
    },

    async patch (id: number, category: Partial<Category>, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "PATCH", body: JSON.stringify(category) }, token, handleUnauthorized);
    },

    async delete (id: number, token?: string, handleUnauthorized?: () => void) {
        return apiCall(`${ENDPOINT}${id}/`, { method: "DELETE" }, token, handleUnauthorized);
    },
}