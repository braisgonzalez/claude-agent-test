import React, { useState } from 'react';
import { X, Calendar, User, MapPin, Clock, Tag, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import toast from 'react-hot-toast';

interface Activity {
  id: string;
  type: 'user_registered' | 'customer_updated' | 'payment_received' | 'system_backup' | 'login_attempt' | 'contract_signed';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    resource?: string;
    amount?: string;
  };
  severity: 'low' | 'medium' | 'high';
}

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activities: Activity[] = [
    {
      id: '1',
      type: 'user_registered',
      title: 'New user registered',
      description: 'John Smith created a new account and completed email verification',
      timestamp: '2 minutes ago',
      user: {
        name: 'System',
        email: 'system@company.com',
      },
      metadata: {
        ipAddress: '192.168.1.45',
        location: 'New York, NY',
        userAgent: 'Chrome 119.0.0.0',
        resource: 'User ID: 1234',
      },
      severity: 'low',
    },
    {
      id: '2',
      type: 'payment_received',
      title: 'Payment received',
      description: 'Received payment from Acme Corp for invoice #INV-2024-001',
      timestamp: '15 minutes ago',
      user: {
        name: 'Payment System',
        email: 'payments@company.com',
      },
      metadata: {
        amount: '$2,500.00',
        resource: 'Invoice #INV-2024-001',
        location: 'Stripe Payment',
      },
      severity: 'medium',
    },
    {
      id: '3',
      type: 'customer_updated',
      title: 'Customer profile updated',
      description: 'StartupXYZ customer profile was modified by admin user',
      timestamp: '1 hour ago',
      user: {
        name: 'Admin User',
        email: 'admin@company.com',
      },
      metadata: {
        ipAddress: '10.0.0.2',
        location: 'San Francisco, CA',
        resource: 'Customer ID: 5678',
        userAgent: 'Firefox 120.0.0.0',
      },
      severity: 'low',
    },
    {
      id: '4',
      type: 'system_backup',
      title: 'System backup completed',
      description: 'Daily automated backup completed successfully with no errors',
      timestamp: '2 hours ago',
      user: {
        name: 'Backup Service',
        email: 'backup@company.com',
      },
      metadata: {
        resource: 'Database backup - 2.3GB',
        location: 'AWS S3 Bucket',
      },
      severity: 'low',
    },
    {
      id: '5',
      type: 'login_attempt',
      title: 'Multiple login attempts detected',
      description: 'Suspicious login activity detected for admin@company.com',
      timestamp: '3 hours ago',
      user: {
        name: 'Security System',
        email: 'security@company.com',
      },
      metadata: {
        ipAddress: '203.0.113.0',
        location: 'Unknown',
        userAgent: 'Unknown',
        resource: 'admin@company.com',
      },
      severity: 'high',
    },
    {
      id: '6',
      type: 'contract_signed',
      title: 'Contract signed',
      description: 'New service agreement signed by Global Industries',
      timestamp: '4 hours ago',
      user: {
        name: 'Contract System',
        email: 'contracts@company.com',
      },
      metadata: {
        resource: 'Contract #CON-2024-015',
        amount: '$15,000.00',
        location: 'DocuSign',
      },
      severity: 'medium',
    },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'user_registered', label: 'User Registration' },
    { value: 'customer_updated', label: 'Customer Updates' },
    { value: 'payment_received', label: 'Payments' },
    { value: 'system_backup', label: 'System Backups' },
    { value: 'login_attempt', label: 'Login Attempts' },
    { value: 'contract_signed', label: 'Contracts' },
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || activity.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Activity log refreshed');
  };

  const getSeverityColor = (severity: Activity['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user_registered':
        return User;
      case 'customer_updated':
        return User;
      case 'payment_received':
        return Tag;
      case 'system_backup':
        return RefreshCw;
      case 'login_attempt':
        return User;
      case 'contract_signed':
        return ExternalLink;
      default:
        return Calendar;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Log</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detailed system and user activity history
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
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={typeOptions}
                  className="w-40"
                />
                <Select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  options={severityOptions}
                  className="w-32"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  loading={isRefreshing}
                  icon={RefreshCw}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
            {filteredActivities.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No activities found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  
                  return (
                    <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <ActivityIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {activity.title}
                                </h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(activity.severity)}`}>
                                  {activity.severity}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{activity.timestamp}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{activity.user.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                              Activity Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {activity.metadata.resource && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Resource</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.metadata.resource}
                                  </p>
                                </div>
                              )}
                              {activity.metadata.ipAddress && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">IP Address</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.metadata.ipAddress}
                                  </p>
                                </div>
                              )}
                              {activity.metadata.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Location</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {activity.metadata.location}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {activity.metadata.userAgent && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">User Agent</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activity.metadata.userAgent}
                                  </p>
                                </div>
                              )}
                              {activity.metadata.amount && (
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Amount</p>
                                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {activity.metadata.amount}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Initiated By</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {activity.user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredActivities.length} of {activities.length} activities
              </p>
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};