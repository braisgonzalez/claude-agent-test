import React, { useState } from 'react';
import { X, Wifi, Database, Server, Shield, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  responseTime: number;
  lastCheck: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const services: ServiceStatus[] = [
    {
      name: 'Backend API',
      status: 'online',
      uptime: '99.98%',
      responseTime: 45,
      lastCheck: '30 seconds ago',
      icon: Server,
      details: 'All endpoints responding normally',
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.95%',
      responseTime: 12,
      lastCheck: '30 seconds ago',
      icon: Database,
      details: 'PostgreSQL cluster healthy, 12/100 connections active',
    },
    {
      name: 'Authentication Service',
      status: 'online',
      uptime: '99.99%',
      responseTime: 67,
      lastCheck: '1 minute ago',
      icon: Shield,
      details: 'JWT validation and user sessions working normally',
    },
    {
      name: 'File Storage',
      status: 'warning',
      uptime: '99.89%',
      responseTime: 234,
      lastCheck: '2 minutes ago',
      icon: Database,
      details: 'S3 bucket responding slowly, investigating',
    },
    {
      name: 'Email Service',
      status: 'online',
      uptime: '99.92%',
      responseTime: 156,
      lastCheck: '1 minute ago',
      icon: Wifi,
      details: 'SMTP server operational, mail queue processing normally',
    },
    {
      name: 'Background Jobs',
      status: 'online',
      uptime: '99.87%',
      responseTime: 89,
      lastCheck: '45 seconds ago',
      icon: Clock,
      details: 'Redis queue processing, 5 jobs pending',
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    setLastUpdate(new Date());
    toast.success('System status refreshed');
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          dot: 'bg-green-500',
          icon: CheckCircle,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          dot: 'bg-yellow-500',
          icon: AlertTriangle,
        };
      case 'offline':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          dot: 'bg-red-500',
          icon: X,
        };
    }
  };

  const overallHealth = {
    online: services.filter(s => s.status === 'online').length,
    warning: services.filter(s => s.status === 'warning').length,
    offline: services.filter(s => s.status === 'offline').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time system status and performance metrics
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

          {/* Overall Status */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Status</h3>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">{overallHealth.online}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Services Online</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{overallHealth.warning}</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">With Warnings</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-200">{overallHealth.offline}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Services Down</p>
                  </div>
                  <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 16rem)' }}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Details</h3>
              
              <div className="space-y-4">
                {services.map((service, index) => {
                  const colors = getStatusColor(service.status);
                  const ServiceIcon = service.icon;
                  const StatusIcon = colors.icon;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-6 rounded-2xl border ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <ServiceIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {service.name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                                <span className={`text-sm font-medium capitalize ${colors.text}`}>
                                  {service.status}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {service.details}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Uptime</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {service.uptime}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Response Time</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {service.responseTime}ms
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Last Check</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {service.lastCheck}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <StatusIcon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdate.toLocaleString()}
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