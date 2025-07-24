import React, { useState } from 'react';
import { X, Save, User, Shield, Bell, Palette, Globe, Database } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'My Company',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
    },
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@company.com',
      phone: '+1 (555) 123-4567',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      securityAlerts: true,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
    },
    appearance: {
      theme: 'auto',
      sidebarCollapsed: false,
      compactMode: false,
    },
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    onClose();
  };

  const handleReset = () => {
    toast.success('Settings reset to defaults');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'EST', label: 'Eastern Time (GMT-5)' },
    { value: 'PST', label: 'Pacific Time (GMT-8)' },
    { value: 'CET', label: 'Central European Time (GMT+1)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  const themeOptions = [
    { value: 'auto', label: 'Auto (System)' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-8rem)]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Name
                          </label>
                          <Input
                            value={settings.general.companyName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, companyName: e.target.value }
                            }))}
                            placeholder="Enter company name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timezone
                          </label>
                          <Select
                            value={settings.general.timezone}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, timezone: e.target.value }
                            }))}
                            options={timezoneOptions}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <Select
                            value={settings.general.language}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, language: e.target.value }
                            }))}
                            options={languageOptions}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Format
                          </label>
                          <Select
                            value={settings.general.dateFormat}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, dateFormat: e.target.value }
                            }))}
                            options={[
                              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                          </label>
                          <Input
                            value={settings.profile.firstName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, firstName: e.target.value }
                            }))}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                          </label>
                          <Input
                            value={settings.profile.lastName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, lastName: e.target.value }
                            }))}
                            placeholder="Enter last name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, email: e.target.value }
                            }))}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <Input
                            value={settings.profile.phone}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              profile: { ...prev.profile, phone: e.target.value }
                            }))}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage your notification preferences
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  notifications: { ...prev.notifications, [key]: e.target.checked }
                                }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.security.twoFactorEnabled}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  security: { ...prev.security, twoFactorEnabled: e.target.checked }
                                }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme
                          </label>
                          <Select
                            value={settings.appearance.theme}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              appearance: { ...prev.appearance, theme: e.target.value }
                            }))}
                            options={themeOptions}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings */}
                {activeTab === 'system' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Version</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">v1.0.0</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Database Status</h4>
                          <p className="text-sm text-green-600 dark:text-green-400">Connected</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Last Backup</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Server Status</h4>
                          <p className="text-sm text-green-600 dark:text-green-400">Online</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Button variant="ghost" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" icon={Save} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};