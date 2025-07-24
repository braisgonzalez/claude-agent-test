import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, Users, Building2, DollarSign, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import toast from 'react-hot-toast';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReportType = 'overview' | 'customers' | 'users' | 'revenue' | 'activity';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const [activeReport, setActiveReport] = useState<ReportType>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const reportTypes = [
    { id: 'overview' as ReportType, label: 'Overview', icon: BarChart3 },
    { id: 'customers' as ReportType, label: 'Customers', icon: Building2 },
    { id: 'users' as ReportType, label: 'Users', icon: Users },
    { id: 'revenue' as ReportType, label: 'Revenue', icon: DollarSign },
    { id: 'activity' as ReportType, label: 'Activity', icon: TrendingUp },
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'ytd', label: 'Year to date' },
  ];

  const overviewMetrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Active Customers',
      value: 234,
      change: '+8.2%',
      changeType: 'positive',
      icon: Building2,
    },
    {
      title: 'New Users',
      value: 45,
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '-2.1%',
      changeType: 'negative',
      icon: TrendingUp,
    },
  ];

  const customerMetrics: MetricCard[] = [
    {
      title: 'Total Customers',
      value: 456,
      change: '+18.9%',
      changeType: 'positive',
      icon: Building2,
    },
    {
      title: 'Active Customers',
      value: 234,
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'New Acquisitions',
      value: 28,
      change: '+25.4%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      title: 'Churn Rate',
      value: '2.3%',
      change: '-0.8%',
      changeType: 'positive',
      icon: BarChart3,
    },
  ];

  const userMetrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: 1247,
      change: '+22.1%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Active Users',
      value: 892,
      change: '+15.7%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      title: 'New Registrations',
      value: 67,
      change: '+31.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'User Retention',
      value: '76.4%',
      change: '+4.3%',
      changeType: 'positive',
      icon: BarChart3,
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Reports refreshed successfully!');
  };

  const handleExport = () => {
    toast.success(`Exporting ${activeReport} report...`);
  };

  const getCurrentMetrics = (): MetricCard[] => {
    switch (activeReport) {
      case 'customers':
        return customerMetrics;
      case 'users':
        return userMetrics;
      case 'revenue':
      case 'activity':
        return overviewMetrics.slice(0, 2);
      default:
        return overviewMetrics;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl mx-auto max-h-[98vh] sm:max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comprehensive business insights and metrics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col gap-4">
              {/* Report Type Tabs */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveReport(type.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        activeReport === type.id
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center sm:justify-end">
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  options={dateRangeOptions}
                  className="w-full sm:w-40"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    loading={isRefreshing}
                    icon={RefreshCw}
                    className="flex-1 sm:flex-none"
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleExport}
                    icon={Download}
                    className="flex-1 sm:flex-none"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto overflow-x-auto" style={{ maxHeight: 'calc(98vh - 12rem)' }}>
            <div className="p-4 sm:p-6 min-w-0">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {getCurrentMetrics().map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          metric.changeType === 'positive' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : metric.changeType === 'negative'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                        }`}>
                          {metric.change}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {dateRangeOptions.find(opt => opt.value === dateRange)?.label}
                    </span>
                  </div>
                </div>
                <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                      Interactive Chart
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      {activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} analytics visualization would appear here
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Performers */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Tech Solutions Inc.', value: '$45,200', change: '+12%' },
                      { name: 'Global Industries', value: '$38,900', change: '+8%' },
                      { name: 'Acme Corporation', value: '$32,100', change: '+15%' },
                      { name: 'StartupXYZ', value: '$28,700', change: '+22%' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {item.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New customer registered', time: '2 hours ago', type: 'success' },
                      { action: 'Payment received', time: '4 hours ago', type: 'success' },
                      { action: 'Contract renewed', time: '6 hours ago', type: 'info' },
                      { action: 'User account created', time: '8 hours ago', type: 'info' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Last updated: {new Date().toLocaleString()}
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button variant="outline" onClick={onClose} fullWidth className="sm:w-auto">
                  Close
                </Button>
                <Button variant="primary" onClick={handleExport} fullWidth className="sm:w-auto">
                  Generate Full Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};