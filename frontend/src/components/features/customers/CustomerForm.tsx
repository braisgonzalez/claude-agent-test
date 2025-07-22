import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Customer, CustomerFormData } from '../../../types/customer';
import { Input, Select, Button, Modal } from '../../ui';

const customerFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  contactPerson: z.string().min(1, 'Contact person is required').max(100),
  industry: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
  }),
  status: z.enum(['PROSPECT', 'ACTIVE', 'INACTIVE']),
});

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  customer?: Customer | null;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
  loading = false,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer ? {
      companyName: customer.companyName,
      contactPerson: customer.contactPerson,
      industry: customer.industry || '',
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || { street: '', city: '', state: '', zipCode: '', country: '' },
      status: customer.status,
    } : {
      companyName: '',
      contactPerson: '',
      industry: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      status: 'PROSPECT',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (customer) {
        reset({
          companyName: customer.companyName,
          contactPerson: customer.contactPerson,
          industry: customer.industry || '',
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || { street: '', city: '', state: '', zipCode: '', country: '' },
          status: customer.status,
        });
      } else {
        reset({
          companyName: '',
          contactPerson: '',
          industry: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', zipCode: '', country: '' },
          status: 'PROSPECT',
        });
      }
    }
  }, [isOpen, customer, reset]);

  const handleFormSubmit = (data: any) => {
    // Clean up empty strings to undefined for optional fields
    const cleanData = {
      ...data,
      phone: data.phone?.trim() || undefined,
      industry: data.industry?.trim() || undefined,
    };
    onSubmit(cleanData);
  };

  const statusOptions = [
    { value: 'PROSPECT', label: 'Prospect' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Customer' : 'Edit Customer'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            {...register('companyName')}
            error={errors.companyName?.message}
            placeholder="Enter company name"
            required
          />

          <Input
            label="Contact Person"
            {...register('contactPerson')}
            error={errors.contactPerson?.message}
            placeholder="Enter contact person name"
            required
          />
        </div>

        <Input
          label="Industry"
          {...register('industry')}
          error={errors.industry?.message}
          placeholder="e.g. Technology, Healthcare"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="contact@company.com"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</h4>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street"
              {...register('address.street')}
              error={errors.address?.street?.message}
              placeholder="Enter street address"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('address.city')}
                error={errors.address?.city?.message}
                placeholder="Enter city"
                required
              />
              
              <Input
                label="State/Province"
                {...register('address.state')}
                error={errors.address?.state?.message}
                placeholder="Enter state or province"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ZIP/Postal Code"
                {...register('address.zipCode')}
                error={errors.address?.zipCode?.message}
                placeholder="Enter ZIP or postal code"
              />
              
              <Input
                label="Country"
                {...register('address.country')}
                error={errors.address?.country?.message}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
        </div>

        <Select
          label="Status"
          {...register('status')}
          options={statusOptions}
          error={errors.status?.message}
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {mode === 'create' ? 'Create Customer' : 'Update Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};