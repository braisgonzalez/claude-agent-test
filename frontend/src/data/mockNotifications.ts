export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New customer registered',
    message: 'John Doe from Tech Solutions has created a new account',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '/customers/1',
  },
  {
    id: '2',
    type: 'success',
    title: 'Payment received',
    message: 'Received $2,500 payment from Acme Corp',
    timestamp: '15 minutes ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Contract expiring soon',
    message: 'Global Industries contract expires in 7 days',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/customers/3',
  },
  {
    id: '4',
    type: 'info',
    title: 'System backup completed',
    message: 'Daily backup completed successfully',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'error',
    title: 'Failed login attempt',
    message: 'Multiple failed login attempts detected for user admin@company.com',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'Customer updated',
    message: 'Profile updated for StartupXYZ',
    timestamp: '4 hours ago',
    read: true,
    actionUrl: '/customers/2',
  },
  {
    id: '7',
    type: 'info',
    title: 'New user invitation sent',
    message: 'Invitation sent to sarah@company.com',
    timestamp: '5 hours ago',
    read: true,
  },
];

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

export const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
    default:
      return 'ℹ️';
  }
};

export const getNotificationColors = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-800 dark:text-green-200',
        dot: 'bg-green-500',
      };
    case 'error':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-800 dark:text-red-200',
        dot: 'bg-red-500',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-200',
        dot: 'bg-yellow-500',
      };
    case 'info':
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-200',
        dot: 'bg-blue-500',
      };
  }
};