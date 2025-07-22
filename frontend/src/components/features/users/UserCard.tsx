import React from 'react';
import { User as UserIcon, Mail, Calendar, UserCheck, UserX } from 'lucide-react';
import type { User } from '../../../types/user';
import { formatDate, formatUserRole } from '../../../utils/formatters';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const roleInfo = formatUserRole(user.role);

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleInfo.className}`}>
              {roleInfo.text}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                {user.username}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {user.email}
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              {user.isActive ? (
                <>
                  <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-600 dark:text-green-400">Active</span>
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-600 dark:text-red-400">Inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};