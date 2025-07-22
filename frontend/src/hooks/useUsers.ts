import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { CreateUserRequest, UpdateUserRequest, UserFilterParams } from '../types/user';
import { toast } from 'react-hot-toast';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserFilterParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Custom hooks for user operations
export const useUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`User "${newUser.username}" created successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserRequest }) =>
      userService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`User "${updatedUser.username}" updated successfully`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    },
  });
};