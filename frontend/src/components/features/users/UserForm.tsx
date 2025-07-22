import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User, UserFormData } from '../../../types/user';
import { Input, Select, Button, Modal } from '../../ui';

const userFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.enum(['ADMIN', 'USER']),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100).optional(),
});

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  loading = false,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    } : {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'USER',
      password: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        });
      } else {
        reset({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          role: 'USER',
          password: '',
        });
      }
    }
  }, [isOpen, user, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New User' : 'Edit User'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
          />

          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />
        </div>

        <Input
          label="Username"
          {...register('username')}
          error={errors.username?.message}
          disabled={mode === 'edit'} // Username cannot be changed
          helperText={mode === 'edit' ? 'Username cannot be changed' : undefined}
          required
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Select
          label="Role"
          {...register('role')}
          options={roleOptions}
          error={errors.role?.message}
          required
        />

        {mode === 'create' && (
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            helperText="Password must be at least 8 characters long"
            required
          />
        )}

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
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};