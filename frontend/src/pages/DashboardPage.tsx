import React from 'react';
import { Users, UserCheck, Building2, TrendingUp } from 'lucide-react';
import { MainLayout, PageHeader } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { useUsers } from '../hooks/useUsers';
import { useCustomers } from '../hooks/useCustomers';

export const DashboardPage: React.FC = () => {
  const { data: usersData, isLoading: usersLoading } = useUsers({ size: 1 }); // Just get count
  const { data: customersData, isLoading: customersLoading } = useCustomers({ size: 1 }); // Just get count
  const { data: activeCustomersData } = useCustomers({ status: 'ACTIVE', size: 1 });
  const { data: prospectCustomersData } = useCustomers({ status: 'PROSPECT', size: 1 });

  const stats = [
    {
      name: 'Total Users',
      value: usersData?.page.totalElements || 0,
      icon: Users,
      color: 'bg-blue-500',
      loading: usersLoading,
    },
    {
      name: 'Total Customers',
      value: customersData?.page.totalElements || 0,
      icon: Building2,
      color: 'bg-green-500',
      loading: customersLoading,
    },
    {
      name: 'Active Customers',
      value: activeCustomersData?.page.totalElements || 0,
      icon: UserCheck,
      color: 'bg-emerald-500',
      loading: customersLoading,
    },
    {
      name: 'Prospects',
      value: prospectCustomersData?.page.totalElements || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      loading: customersLoading,
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your user and customer management system"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  {stat.loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/users"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">
                Manage Users
              </span>
            </a>
            <a
              href="/customers"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Building2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">
                Manage Customers
              </span>
            </a>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Backend API
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Database
                </span>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};