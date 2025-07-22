import React from 'react';
import { Button } from '../ui/Button';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    loading?: boolean;
  };
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <Button
            variant="primary"
            icon={action.icon}
            onClick={action.onClick}
            loading={action.loading}
          >
            {action.label}
          </Button>
        )}
      </div>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};