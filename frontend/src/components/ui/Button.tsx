import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'soft';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  fullWidth = false,
  rounded = 'lg',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden group
    ${fullWidth ? 'w-full' : ''}
  `;
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
      text-white shadow-lg hover:shadow-xl focus:ring-blue-500 
      transform hover:-translate-y-0.5 active:translate-y-0
    `,
    secondary: `
      bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
      text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 
      shadow-md hover:shadow-lg focus:ring-gray-500 
      transform hover:-translate-y-0.5 active:translate-y-0
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
      text-white shadow-lg hover:shadow-xl focus:ring-red-500 
      transform hover:-translate-y-0.5 active:translate-y-0
    `,
    ghost: `
      text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 
      hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 
      transition-colors
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white 
      dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900
      focus:ring-blue-500 transform hover:-translate-y-0.5 active:translate-y-0
    `,
    soft: `
      bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 
      hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:ring-blue-500
      border border-blue-200 dark:border-blue-800
    `,
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  
  const isDisabled = disabled || loading;
  const shouldShowIcon = Icon && !loading;
  const iconOnly = shouldShowIcon && !children;

  return (
    <button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${roundedClasses[rounded]}
        ${iconOnly ? 'aspect-square' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      
      {loading ? (
        <>
          <svg 
            className={`animate-spin ${iconSizes[size]} ${children ? 'mr-2' : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children && <span className="relative z-10">Loading...</span>}
        </>
      ) : (
        <>
          {shouldShowIcon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''} relative z-10`} />
          )}
          
          {children && <span className="relative z-10">{children}</span>}
          
          {shouldShowIcon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''} relative z-10`} />
          )}
        </>
      )}
    </button>
  );
};