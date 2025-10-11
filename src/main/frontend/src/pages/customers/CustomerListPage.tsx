import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import { DataTable, TableFilters, TableActions, createCommonActions } from '@components/tables';
import { Button } from '@components/ui';
import { useToast, useConfirmationDialog } from '../../hooks';
import customerService from '../../services/customerService';
import type { CustomerDto } from '../../api';
import type { Column, FilterValue, SortConfig } from '@components/tables';

/**
 * Customer listing page with pagination, filtering, and actions
 */
const CustomerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { confirmDelete } = useConfirmationDialog();

  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'customerName',
    direction: 'asc',
  });

  // Load customers data
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await customerService.getCustomers();

      setCustomers(response || []);
      setPagination(prev => ({
        ...prev,
        total: response?.length || 0,
      }));
    } catch (err) {
      error('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: FilterValue[]) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle customer deletion
  const handleDeleteCustomer = async (customer: CustomerDto) => {
    confirmDelete(customer.name || 'this customer', async () => {
      try {
        await customerService.deleteCustomer(customer.id!);
        success(`Customer "${customer.name}" deleted successfully`);
        loadCustomers(); // Reload the list
      } catch (err) {
        error('Failed to delete customer');
        console.error('Error deleting customer:', err);
      }
    });
  };

  // Define table columns
  const columns: Column<CustomerDto>[] = [
    {
      key: 'customerName',
      header: 'Name',
      sortable: true,
      render: (value, customer) => (
        <div className="font-medium">
          <button
            onClick={() => navigate(`/customers/${customer.id}`)}
            className="text-primary hover:underline"
          >
            {String(value)}
          </button>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: value => String(value || '-'),
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: false,
      render: value => String(value || '-'),
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
      render: value => String(value || '-'),
    },
    {
      key: 'state',
      header: 'State',
      sortable: true,
      render: value => String(value || '-'),
    },
    {
      key: 'createdDate',
      header: 'Created',
      sortable: true,
      render: value => (value ? new Date(String(value)).toLocaleDateString() : '-'),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '100px',
      align: 'center',
      render: (_, customer) => (
        <TableActions
          row={customer}
          actions={createCommonActions({
            onView: (customer: CustomerDto) => navigate(`/customers/${customer.id}`),
            onEdit: (customer: CustomerDto) => navigate(`/customers/${customer.id}/edit`),
            onDelete: (customer: CustomerDto) => handleDeleteCustomer(customer),
          })}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer directory"
        actions={
          <Button onClick={() => navigate('/customers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        }
      />

      <PageContent>
        <div className="space-y-4">
          {/* Filters */}
          <TableFilters
            filters={[]}
            values={filters}
            onFiltersChange={handleFiltersChange}
            searchPlaceholder="Search customers..."
          />

          {/* Data Table */}
          <DataTable
            data={customers}
            columns={columns}
            loading={loading}
            sortConfig={sortConfig}
            onSort={setSortConfig}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            emptyMessage="No customers found. Create your first customer to get started."
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default CustomerListPage;
