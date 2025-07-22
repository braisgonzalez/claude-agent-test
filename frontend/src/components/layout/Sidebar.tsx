import React from 'react';
import { Users, Building2, Home, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Building2,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 sidebar backdrop-blur-xl shadow-2xl
          transform transition-all duration-500 ease-out
          md:relative md:translate-x-0 md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between h-16 px-6 border-b border-white/10 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Customer Manager
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-600 hover:bg-white/20 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo/Brand - Desktop */}
        <div className="hidden md:flex items-center space-x-3 p-6 border-b border-white/10 dark:border-gray-700/50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CM</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg">
              Customer Manager
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`
                      group flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white hover:scale-[1.02]'
                      }
                    `}
                  >
                    {/* Background glow effect for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 blur-xl" />
                    )}
                    
                    <Icon className={`w-5 h-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                      isActive 
                        ? 'text-white drop-shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }`} />
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 w-1 h-8 bg-white/30 rounded-l-full transform -translate-y-1/2" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 dark:border-gray-700/50">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p className="font-medium">v1.0.0</p>
            <p>Modern UI Design</p>
          </div>
        </div>
      </aside>
    </>
  );
};