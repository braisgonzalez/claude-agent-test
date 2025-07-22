import { apiClient } from '../api/config';
import type { PaginatedResponse } from '../types/api';
import type { User, CreateUserRequest, UpdateUserRequest, UserFilterParams } from '../types/user';

export const userService = {
  // Get paginated users
  getUsers: async (params?: UserFilterParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  },

  // Update existing user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Search users
  searchUsers: async (searchTerm: string, params?: UserFilterParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: {
        ...params,
        search: searchTerm,
      },
    });
    return response.data;
  },
};