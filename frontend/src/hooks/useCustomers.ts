import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import type { CreateCustomerRequest, UpdateCustomerRequest, CustomerFilterParams } from '../types/customer';
import { toast } from 'react-hot-toast';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Query keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerFilterParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// Custom hooks for customer operations
export const useCustomers = (params?: CustomerFilterParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData: CreateCustomerRequest) => customerService.createCustomer(customerData),
    onSuccess: (newCustomer) => {
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success(`Customer "${newCustomer.companyName}" created successfully`);
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Failed to create customer';
      toast.error(message);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerData }: { id: string; customerData: UpdateCustomerRequest }) =>
      customerService.updateCustomer(id, customerData),
    onSuccess: (updatedCustomer) => {
      // Update the customer in cache
      queryClient.setQueryData(customerKeys.detail(updatedCustomer.id), updatedCustomer);
      // Invalidate customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success(`Customer "${updatedCustomer.companyName}" updated successfully`);
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Failed to update customer';
      toast.error(message);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      // Remove customer from cache
      queryClient.removeQueries({ queryKey: customerKeys.detail(deletedId) });
      // Invalidate customers list
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('Customer deleted successfully');
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || 'Failed to delete customer';
      toast.error(message);
    },
  });
};