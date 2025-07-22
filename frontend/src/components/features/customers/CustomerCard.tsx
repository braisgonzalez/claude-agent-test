import React from 'react';
import { Building2, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import type { Customer } from '../../../types/customer';
import { formatDate, formatPhoneNumber, formatCustomerStatus } from '../../../utils/formatters';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const statusInfo = formatCustomerStatus(customer.status);

  return (
    <div className="card p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {customer.companyName}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>

          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              <Users className="w-3 h-3 mr-1" />
              {customer.industry}
            </span>
          </div>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href={`mailto:${customer.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {customer.email}
              </a>
            </div>

            {customer.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`tel:${customer.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {formatPhoneNumber(customer.phone)}
                </a>
              </div>
            )}

            {customer.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">
                  {customer.address.street}, {customer.address.city}
                  {customer.address.state && `, ${customer.address.state}`}
                  {customer.address.zipCode && ` ${customer.address.zipCode}`}
                  {customer.address.country && `, ${customer.address.country}`}
                </span>
              </div>
            )}


            <div className="flex items-center space-x-3 pt-2 border-t border-gray-200 dark:border-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Created {formatDate(customer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};