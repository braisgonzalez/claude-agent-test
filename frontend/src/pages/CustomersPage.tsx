import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout, PageHeader } from '../components/layout';
import { SearchInput, Select, Modal, LoadingSpinner } from '../components/ui';
import { CustomerTable, CustomerForm, CustomerCard } from '../components/features/customers';
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import type { Customer, CustomerFormData, CustomerFilterParams } from '../types/customer';

export const CustomersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage] = useState(0);

  // Build filter params
  const filterParams: CustomerFilterParams = useMemo(() => ({
    page: currentPage,
    size: 20,
    search: searchTerm || undefined,
    industry: industryFilter || undefined,
    status: (statusFilter as 'PROSPECT' | 'ACTIVE' | 'INACTIVE') || undefined,
  }), [currentPage, searchTerm, industryFilter, statusFilter]);

  const { data: customersData, isLoading } = useCustomers(filterParams);
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
  };

  const handleFormSubmit = (data: CustomerFormData) => {
    if (editingCustomer) {
      // Update existing customer
      updateCustomerMutation.mutate(
        { id: editingCustomer.id, customerData: data },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingCustomer(null);
          },
        }
      );
    } else {
      // Create new customer
      createCustomerMutation.mutate(data, {
        onSuccess: () => {
          setShowForm(false);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  // Get unique industries from the current data for filter options
  const industryOptions = useMemo(() => {
    const industries = new Set(customersData?.content?.map(c => c.industry).filter(Boolean) || []);
    return [
      { value: '', label: 'All Industries' },
      ...Array.from(industries).map(industry => ({
        value: industry!,
        label: industry!
      }))
    ];
  }, [customersData]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PROSPECT', label: 'Prospect' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Customers"
        subtitle={`Manage customer accounts and relationships (${customersData?.page.totalElements || 0} customers)`}
        action={{
          label: 'Add Customer',
          onClick: handleCreateCustomer,
          icon: Plus,
        }}
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search customers by company, industry, or email..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              options={industryOptions}
              className="w-40"
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-32"
            />
          </div>
        </div>
      </PageHeader>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading customers..." />
        </div>
      ) : (
        <CustomerTable
          customers={customersData?.content || []}
          onEdit={handleEditCustomer}
          onView={handleViewCustomer}
          loading={isLoading}
        />
      )}

      {/* Forms and Modals */}
      <CustomerForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        customer={editingCustomer}
        mode={editingCustomer ? 'edit' : 'create'}
        loading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
      />

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        title="Customer Details"
        size="md"
      >
        {viewingCustomer && <CustomerCard customer={viewingCustomer} />}
      </Modal>
    </MainLayout>
  );
};