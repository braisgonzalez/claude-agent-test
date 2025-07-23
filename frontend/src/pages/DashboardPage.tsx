import React, { useState } from 'react';
import { Users, UserCheck, Building2, TrendingUp, Plus, ArrowRight, Activity, Database, Wifi, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MainLayout, PageHeader } from '../components/layout';
import { DashboardSkeleton, Button, ReportsModal, SystemHealthModal, ActivityDetailModal } from '../components/ui';
import { CustomerForm } from '../components/features/customers';
import { useUsers } from '../hooks/useUsers';
import { useCustomers, useCreateCustomer } from '../hooks/useCustomers';
import type { CustomerFormData } from '../types/customer';

export const DashboardPage: React.FC = () => {
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showSystemHealthModal, setShowSystemHealthModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  const { data: usersData, isLoading: usersLoading } = useUsers({ size: 1 });
  const { data: customersData, isLoading: customersLoading } = useCustomers({ size: 1 });
  const { data: activeCustomersData } = useCustomers({ status: 'ACTIVE', size: 1 });
  const { data: prospectCustomersData } = useCustomers({ status: 'PROSPECT', size: 1 });
  const createCustomerMutation = useCreateCustomer();

  const isLoading = usersLoading || customersLoading;

  const stats = [
    {
      name: 'Total Users',
      value: usersData?.page.totalElements || 0,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive' as const,
      href: '/users',
    },
    {
      name: 'Total Customers',
      value: customersData?.page.totalElements || 0,
      icon: Building2,
      gradient: 'from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive' as const,
      href: '/customers',
    },
    {
      name: 'Active Customers',
      value: activeCustomersData?.page.totalElements || 0,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+15%',
      changeType: 'positive' as const,
      href: '/customers?status=active',
    },
    {
      name: 'Prospects',
      value: prospectCustomersData?.page.totalElements || 0,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-amber-600',
      change: '+23%',
      changeType: 'positive' as const,
      href: '/customers?status=prospect',
    },
  ];

  // Event Handlers
  const handleCreateCustomer = async (data: CustomerFormData) => {
    try {
      await createCustomerMutation.mutateAsync(data);
      setShowCreateCustomerModal(false);
      toast.success('Customer created successfully!');
    } catch {
      toast.error('Failed to create customer. Please try again.');
    }
  };

  const handleViewReports = () => {
    setShowReportsModal(true);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business today."
      />

      {/* Welcome Section */}
      <div className="card-elevated p-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Good morning, Admin! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Your business is growing. Here's a quick overview of your metrics.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" icon={BarChart3} onClick={handleViewReports}>
              View Reports
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreateCustomerModal(true)}>
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="group block transform transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="card-elevated p-6 h-full group-hover:shadow-glow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stat.value.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>View details</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/users"
                className="group flex items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-2xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-900/40 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    Manage Users
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add, edit, and manage user accounts
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/customers"
                className="group flex items-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-2xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-900/40 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-3 bg-green-500 rounded-xl shadow-lg mr-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">
                    Manage Customers
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View and manage customer relationships
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                System Status
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowSystemHealthModal(true)}
                className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <div className="flex items-center">
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Backend API</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Response time: 45ms</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge badge-success">Online</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </div>
              </button>
              
              <button 
                onClick={() => setShowSystemHealthModal(true)}
                className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Database</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Connections: 12/100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge badge-success">Healthy</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowActivityModal(true)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setShowActivityModal(true)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    New user registered
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
              <button 
                onClick={() => setShowActivityModal(true)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                    Customer updated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              </button>
              <button 
                onClick={() => setShowActivityModal(true)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    System backup completed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Creation Modal */}
      <CustomerForm
        isOpen={showCreateCustomerModal}
        onClose={() => setShowCreateCustomerModal(false)}
        onSubmit={handleCreateCustomer}
        loading={createCustomerMutation.isPending}
        mode="create"
      />

      {/* Reports Modal */}
      <ReportsModal 
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      {/* System Health Modal */}
      <SystemHealthModal 
        isOpen={showSystemHealthModal}
        onClose={() => setShowSystemHealthModal(false)}
      />

      {/* Activity Detail Modal */}
      <ActivityDetailModal 
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
      />
    </MainLayout>
  );
};