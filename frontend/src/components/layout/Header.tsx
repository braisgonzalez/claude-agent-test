import React from 'react';
import { Menu, User, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UM</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              User Management
            </h1>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Welcome, <span className="font-medium">Admin</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};