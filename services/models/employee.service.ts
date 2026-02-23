import { apiCall } from "@/utils/httpClient";
import { Employee } from "@/types";
import { FEATURES_ENDPOINTS } from "@/constants/api";

const ENDPOINT = FEATURES_ENDPOINTS.EMPLOYEES;

export const employeeService = {
  async getAll(token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, {}, token, handleUnauthorized);
  },

  async getById(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, {}, token, handleUnauthorized);
  },

  async create(employee: Employee, token?: string, handleUnauthorized?: () => void) {
    return apiCall(ENDPOINT, { method: "POST", body: JSON.stringify(employee) }, token, handleUnauthorized);
  },

  async update(id: number, employee: Employee, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "PUT", body: JSON.stringify(employee) }, token, handleUnauthorized);
  },

  async patch(id: number, employee: Partial<Employee>, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "PATCH", body: JSON.stringify(employee) }, token, handleUnauthorized);
  },

  async delete(id: number, token?: string, handleUnauthorized?: () => void) {
    return apiCall(`${ENDPOINT}${id}/`, { method: "DELETE" }, token, handleUnauthorized);
  },
};