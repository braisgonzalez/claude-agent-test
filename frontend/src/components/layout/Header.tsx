import React, { useState } from 'react';
import { Menu, User, Settings, Bell, Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd implement dark mode toggle logic here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="navbar sticky top-0 z-40 shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Menu button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers, users..."
              className="form-input pl-10 pr-4 py-2 w-64 text-sm bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-600/50"
            />
          </div>
        </div>

        {/* Center - Page title/breadcrumb */}
        <div className="hidden lg:block">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gradient">
              Customer Manager
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Modern Management System
            </p>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-3">
          {/* Mobile search button */}
          <button className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md">
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md">
            <Settings className="w-5 h-5" />
          </button>
          
          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 py-2 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@company.com</p>
                </div>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                  Profile Settings
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
                  Account Settings
                </a>
                <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};