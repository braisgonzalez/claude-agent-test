import React, { useState } from 'react';
import { X, Bell, Check, Trash2, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { ModalPortal } from './ModalPortal';
import { mockNotifications, getNotificationColors, type Notification } from '../../data/mockNotifications';
import toast from 'react-hot-toast';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success('Notification deleted');
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.read));
    toast.success('All read notifications deleted');
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' ? notification.read : !notification.read);
    
    return matchesSearch && matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ];

  const readOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' },
  ];

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 10001 }}>
        <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notifications.length} total, {unreadCount} unread
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={typeOptions}
                  className="w-32"
                />
                <Select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  options={readOptions}
                  className="w-36"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={deleteAllRead}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear Read
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 16rem)' }}>
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || filterType !== 'all' || filterRead !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => {
                  const colors = getNotificationColors(notification.type);
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Status indicator */}
                        <div className={`w-3 h-3 rounded-full mt-2 ${colors.dot} ${!notification.read ? 'animate-pulse' : ''}`} />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className={`text-base font-semibold ${
                                  notification.read 
                                    ? 'text-gray-600 dark:text-gray-400' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {notification.title}
                                </h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                                  {notification.type}
                                </span>
                              </div>
                              <p className={`text-sm mb-3 ${
                                notification.read 
                                  ? 'text-gray-500 dark:text-gray-500' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 mt-4">
                            {notification.actionUrl && (
                              <Link to={notification.actionUrl} onClick={onClose}>
                                <Button variant="soft" size="sm">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </Link>
                            )}
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
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
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </p>
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};