import React, { useState } from 'react';
import { Edit, Eye, Trash2, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { Customer } from '../../../types/customer';
import { Button, ConfirmDialog } from '../../ui';
import { EnhancedTable, type Column } from '../../ui/EnhancedTable';
import { useDeleteCustomer } from '../../../hooks/useCustomers';
import { formatDate, formatPhoneNumber, formatCustomerStatus } from '../../../utils/formatters';
import toast from 'react-hot-toast';

interface EnhancedCustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onView?: (customer: Customer) => void;
  loading?: boolean;
  onSelectionChange?: (selectedCustomers: Customer[]) => void;
}

export const EnhancedCustomerTable: React.FC<EnhancedCustomerTableProps> = ({
  customers,
  onEdit,
  onView,
  loading = false,
  onSelectionChange,
}) => {
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomerMutation.mutateAsync(customerToDelete.id);
        setCustomerToDelete(null);
        toast.success(`Customer "${customerToDelete.companyName}" deleted successfully`);
      } catch {
        toast.error('Failed to delete customer. Please try again.');
      }
    }
  };

  // Define table columns
  const columns: Column<Customer>[] = [
    {
      id: 'company',
      header: 'Company',
      accessor: 'companyName',
      sortable: true,
      filterable: true,
      render: (_, customer) => (
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
              {customer.industry || 'No industry specified'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: 'contactPerson',
      sortable: true,
      filterable: true,
      render: (_, customer) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {customer.contactPerson}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{formatPhoneNumber(customer.phone)}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      render: (value) => {
        const statusInfo = formatCustomerStatus(value);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      id: 'industry',
      header: 'Industry',
      accessor: 'industry',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {value || 'Not specified'}
        </span>
      ),
    },
    {
      id: 'created',
      header: 'Created',
      accessor: 'createdAt',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      width: '120px',
      render: (_, customer) => (
        <div className="flex justify-end space-x-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              icon={Eye}
              onClick={(e) => {
                e.stopPropagation();
                onView(customer);
              }}
              className="text-gray-600 hover:text-blue-600"
              title="View details"
            />
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(customer);
              }}
              className="text-gray-600 hover:text-blue-600"
              title="Edit customer"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCustomer(customer);
            }}
            className="text-gray-600 hover:text-red-600"
            title="Delete customer"
          />
        </div>
      ),
    },
  ];

  // Render expanded row content
  const renderExpandedRow = (customer: Customer) => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Contact Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {formatPhoneNumber(customer.phone)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        {customer.address && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Address
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div>{customer.address.street}</div>
                  <div>
                    {customer.address.city}
                    {customer.address.state && `, ${customer.address.state}`}
                    {customer.address.zipCode && ` ${customer.address.zipCode}`}
                  </div>
                  <div>{customer.address.country}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Details
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Industry:</span>{' '}
              <span className="text-gray-900 dark:text-white">
                {customer.industry || 'Not specified'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created:</span>{' '}
              <span className="text-gray-900 dark:text-white">
                {formatDate(customer.createdAt)}
              </span>
            </div>
            {customer.updatedAt && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Updated:</span>{' '}
                <span className="text-gray-900 dark:text-white">
                  {formatDate(customer.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => onView(customer)}
          >
            View Full Profile
          </Button>
        )}
        {onEdit && (
          <Button
            variant="primary"
            size="sm"
            icon={Edit}
            onClick={() => onEdit(customer)}
          >
            Edit Customer
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <EnhancedTable
        data={customers}
        columns={columns}
        loading={loading}
        expandable={true}
        renderExpandedRow={renderExpandedRow}
        selectable={true}
        onSelectionChange={onSelectionChange}
        onRowClick={(customer) => {
          if (onView) {
            onView(customer);
          } else {
            toast.success(`Viewing ${customer.companyName}`);
          }
        }}
      />

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