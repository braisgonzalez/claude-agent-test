import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-xl';
      default:
        return 'rounded-lg';
    }
  };

  const style = {
    width: width,
    height: height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`skeleton ${getVariantClasses()} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={{ height: height || '1rem' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const UserTableSkeleton: React.FC = () => (
  <div className="card p-6 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton variant="text" width="150px" height="24px" />
      <Skeleton variant="rounded" width="100px" height="36px" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton variant="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="200px" height="16px" />
            <Skeleton variant="text" width="150px" height="14px" />
          </div>
          <div className="flex space-x-2">
            <Skeleton variant="circular" width="32px" height="32px" />
            <Skeleton variant="circular" width="32px" height="32px" />
            <Skeleton variant="circular" width="32px" height="32px" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CustomerCardSkeleton: React.FC = () => (
  <div className="card p-6">
    <div className="flex items-start space-x-4">
      <Skeleton variant="rounded" width="48px" height="48px" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton variant="text" width="180px" height="20px" />
          <Skeleton variant="rounded" width="80px" height="24px" />
        </div>
        <Skeleton variant="text" width="120px" height="16px" />
        <div className="space-y-2">
          <Skeleton variant="text" width="200px" height="14px" />
          <Skeleton variant="text" width="160px" height="14px" />
          <Skeleton variant="text" width="140px" height="14px" />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center">
            <Skeleton variant="rounded" width="48px" height="48px" />
            <div className="ml-4 space-y-2">
              <Skeleton variant="text" width="80px" height="12px" />
              <Skeleton variant="text" width="60px" height="20px" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6 space-y-4">
        <Skeleton variant="text" width="140px" height="20px" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circular" width="20px" height="20px" />
                <Skeleton variant="text" width="120px" height="16px" />
              </div>
              <Skeleton variant="text" width="80px" height="16px" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="card p-6 space-y-4">
        <Skeleton variant="text" width="120px" height="20px" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circular" width="12px" height="12px" />
                <Skeleton variant="text" width="100px" height="14px" />
              </div>
              <Skeleton variant="text" width="60px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="80px" height="14px" />
          <Skeleton variant="rounded" width="100%" height="42px" />
        </div>
      ))}
    </div>
    
    <div className="space-y-2">
      <Skeleton variant="text" width="60px" height="14px" />
      <Skeleton variant="rounded" width="100%" height="42px" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="70px" height="14px" />
          <Skeleton variant="rounded" width="100%" height="42px" />
        </div>
      ))}
    </div>
    
    <div className="flex justify-end space-x-3 pt-4">
      <Skeleton variant="rounded" width="80px" height="38px" />
      <Skeleton variant="rounded" width="100px" height="38px" />
    </div>
  </div>
);