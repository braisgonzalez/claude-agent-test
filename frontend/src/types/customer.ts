export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address?: Address;
  industry?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address: Address;
  industry?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
}

export interface UpdateCustomerRequest {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  industry?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
}

export interface CustomerFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  address: Address;
  industry?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
}

export interface CustomerFilterParams {
  page?: number;
  size?: number;
  sort?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  industry?: string;
  search?: string;
}