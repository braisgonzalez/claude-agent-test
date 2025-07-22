import React, { useState } from 'react';
import { Edit, Eye, Trash2, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { Customer } from '../../../types/customer';
import { Button, ConfirmDialog, LoadingSpinner } from '../../ui';
import { useDeleteCustomer } from '../../../hooks/useCustomers';
import { formatDate, formatPhoneNumber, formatCustomerStatus } from '../../../utils/formatters';

interface CustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onView?: (customer: Customer) => void;
  loading?: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onView,
  loading = false,
}) => {
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id, {
        onSuccess: () => {
          setCustomerToDelete(null);
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading customers..." />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No customers found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by adding your first customer.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => {
                const statusInfo = formatCustomerStatus(customer.status);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.companyName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.industry}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1 mb-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{formatPhoneNumber(customer.phone)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(customer.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => onView(customer)}
                            className="text-gray-600 hover:text-blue-600"
                          />
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                            onClick={() => onEdit(customer)}
                            className="text-gray-600 hover:text-blue-600"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteCustomer(customer)}
                          className="text-gray-600 hover:text-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {customers.map((customer) => {
            const statusInfo = formatCustomerStatus(customer.status);
            return (
              <div key={customer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {customer.companyName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.industry}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{formatPhoneNumber(customer.phone)}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{customer.address.street}, {customer.address.city}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(customer.createdAt)}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => onView(customer)}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => onEdit(customer)}
                      className="text-gray-600 hover:text-blue-600"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteCustomer(customer)}
                    className="text-gray-600 hover:text-red-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.companyName}"? This action cannot be undone.`}
        confirmText="Delete Customer"
        variant="danger"
        loading={deleteCustomerMutation.isPending}
      />
    </>
  );
};