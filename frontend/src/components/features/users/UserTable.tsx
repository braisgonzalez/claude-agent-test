import React, { useState } from 'react';
import { Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../../types/user';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { useDeleteUser } from '../../../hooks/useUsers';
import { formatDate } from '../../../utils/formatters';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  loading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onView,
  loading = false,
}) => {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId, {
        onSuccess: () => {
          setDeleteUserId(null);
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <UserCheck className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No users found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by creating a new user.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Username</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Created</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {user.username}
                    </span>
                  </td>
                  <td className="table-cell">
                    <a 
                      href={`mailto:${user.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {user.isActive ? (
                        <>
                          <UserCheck className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 dark:text-green-400">Active</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 text-red-500" />
                          <span className="text-red-700 dark:text-red-400">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-gray-600 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => onView(user)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteUserId(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteUserMutation.isPending}
        variant="danger"
      />
    </>
  );
};