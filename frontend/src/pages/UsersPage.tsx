import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout, PageHeader } from '../components/layout';
import { SearchInput, Select, Modal, LoadingSpinner } from '../components/ui';
import { UserTable, UserForm, UserCard } from '../components/features/users';
import { useUsers, useCreateUser, useUpdateUser } from '../hooks/useUsers';
import type { User, UserFormData, UserFilterParams, CreateUserRequest } from '../types/user';

export const UsersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage] = useState(0);

  // Build filter params
  const filterParams: UserFilterParams = useMemo(() => ({
    page: currentPage,
    size: 20,
    search: searchTerm || undefined,
    role: (roleFilter as 'ADMIN' | 'USER') || undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  }), [currentPage, searchTerm, roleFilter, statusFilter]);

  const { data: usersData, isLoading } = useUsers(filterParams);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
  };

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      // Update existing user - exclude password from updates
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = data;
      updateUserMutation.mutate(
        { id: editingUser.id, userData: updateData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingUser(null);
          },
        }
      );
    } else {
      // Create new user
      if (!data.password) return;
      createUserMutation.mutate(data as CreateUserRequest, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Users"
        subtitle={`Manage user accounts and permissions (${usersData?.page.totalElements || 0} users)`}
        action={{
          label: 'Add User',
          onClick: handleCreateUser,
          icon: Plus,
        }}
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
              className="w-32"
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-32"
            />
          </div>
        </div>
      </PageHeader>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading users..." />
        </div>
      ) : (
        <UserTable
          users={usersData?.content || []}
          onEdit={handleEditUser}
          onView={handleViewUser}
          loading={isLoading}
        />
      )}

      {/* Forms and Modals */}
      <UserForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        user={editingUser}
        mode={editingUser ? 'edit' : 'create'}
        loading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      {/* User Detail Modal */}
      <Modal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Details"
        size="md"
      >
        {viewingUser && <UserCard user={viewingUser} />}
      </Modal>
    </MainLayout>
  );
};