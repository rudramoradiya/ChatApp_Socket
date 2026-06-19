import { api } from "../lib/api-client";

// Get current user
export const getUser = async () => {
  const response = await api.get("/user/get-user");
  return response.data.data.user;
};

// Get user by ID (for profile viewing)
export const getUserById = async (userId: string) => {
  const response = await api.get(`/user/get-user/${userId}`);
  return response.data.data.user;
};

// Update user 
export const updateUser = async (userId: string, data: FormData) => {
  const response = await api.put(`/user/update-user/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get all users with optional filters
export const getAllUsers = async (params?: {
  status?: string | string[];
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/user/get-all-user", { params });
  return response.data;
};
