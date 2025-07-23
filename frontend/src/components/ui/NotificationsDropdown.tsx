import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNotifications, getUnreadCount, getNotificationColors, type Notification } from '../../data/mockNotifications';
import { Button } from './Button';
import { NotificationsModal } from './NotificationsModal';

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showAllModal, setShowAllModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount(notifications);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    setShowAllModal(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notifications Bell */}
      <button 
        className="p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 py-4 z-50 animate-slide-down">
          {/* Header */}
          <div className="px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => {
                  const colors = getNotificationColors(notification.type);
                  return (
                    <div key={notification.id}>
                      {notification.actionUrl ? (
                        <Link
                          to={notification.actionUrl}
                          className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <NotificationContent notification={notification} colors={colors} />
                        </Link>
                      ) : (
                        <div 
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <NotificationContent notification={notification} colors={colors} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={handleViewAll}
            >
              <Eye className="w-4 h-4 mr-2" />
              View all notifications
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={showAllModal}
        onClose={() => setShowAllModal(false)}
      />
    </div>
  );
};

interface NotificationContentProps {
  notification: Notification;
  colors: ReturnType<typeof getNotificationColors>;
}

const NotificationContent: React.FC<NotificationContentProps> = ({ notification, colors }) => (
  <div className="flex items-start space-x-3">
    {/* Status indicator */}
    <div className={`w-2 h-2 rounded-full mt-2 ${colors.dot} ${!notification.read ? 'animate-pulse' : ''}`} />
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {notification.title}
          </p>
          <p className={`text-xs mt-1 ${notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {notification.timestamp}
          </p>
        </div>
        {notification.actionUrl && (
          <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 ml-2 mt-1 flex-shrink-0" />
        )}
      </div>
    </div>
  </div>
);