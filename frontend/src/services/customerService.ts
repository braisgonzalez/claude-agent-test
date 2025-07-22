import { apiClient } from '../api/config';
import type { PaginatedResponse } from '../types/api';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerFilterParams } from '../types/customer';

export const customerService = {
  // Get paginated customers
  getCustomers: async (params?: CustomerFilterParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>('/customers', customerData);
    return response.data;
  },

  // Update existing customer
  updateCustomer: async (id: string, customerData: UpdateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },

  // Get customers by status
  getCustomersByStatus: async (status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT', params?: CustomerFilterParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: {
        ...params,
        status,
      },
    });
    return response.data;
  },

  // Get customers by industry
  getCustomersByIndustry: async (industry: string, params?: CustomerFilterParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: {
        ...params,
        industry,
      },
    });
    return response.data;
  },

  // Search customers
  searchCustomers: async (searchTerm: string, params?: CustomerFilterParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: {
        ...params,
        search: searchTerm,
      },
    });
    return response.data;
  },
};