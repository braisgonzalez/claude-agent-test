export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  password?: string; // Optional for updates
}

export interface UserFilterParams {
  page?: number;
  size?: number;
  sort?: string[];
  search?: string;
  role?: 'ADMIN' | 'USER';
  isActive?: boolean;
}