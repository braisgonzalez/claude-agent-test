/**
 * Format a date string into a human-readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a date string into a human-readable datetime format
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for 10-digit numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for 11-digit numbers starting with 1
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if it doesn't match expected patterns
  return phone;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Format customer status for display
 */
export const formatCustomerStatus = (status: string): { text: string; className: string } => {
  const statusMap = {
    ACTIVE: { text: 'Active', className: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' },
    INACTIVE: { text: 'Inactive', className: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' },
    PROSPECT: { text: 'Prospect', className: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' },
  };
  
  return statusMap[status as keyof typeof statusMap] || { text: status, className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' };
};

/**
 * Format user role for display
 */
export const formatUserRole = (role: string): { text: string; className: string } => {
  const roleMap = {
    ADMIN: { text: 'Admin', className: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' },
    USER: { text: 'User', className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' },
  };
  
  return roleMap[role as keyof typeof roleMap] || { text: role, className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' };
};