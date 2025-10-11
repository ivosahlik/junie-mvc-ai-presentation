import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageContainer, PageHeader, PageContent } from '@components/layout';
import { DataTable, TableFilters, TableActions, createCommonActions } from '@components/tables';
import { Button } from '@components/ui';
import { useToast, useConfirmationDialog } from '../../hooks';
import beerService from '../../services/beerService';
import type { BeerDto } from '../../api';
import type { Column, FilterValue, SortConfig } from '@components/tables';

/**
 * Beer listing page with pagination, filtering, and actions
 */
const BeerListPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { confirmDelete } = useConfirmationDialog();

  const [beers, setBeers] = useState<BeerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'beerName', direction: 'asc' });

  // Load beers data
  const loadBeers = useCallback(async () => {
    setLoading(true);
    try {
      // Extract filter values
      const searchFilter = filters.find(f => f.key === 'search');
      const styleFilter = filters.find(f => f.key === 'beerStyle');

      const response = await beerService.getBeers(
        { page: pagination.page - 1, size: pagination.pageSize }, // API uses 0-based pagination
        { sort: sortConfig.key, direction: sortConfig.direction },
        searchFilter?.value ? String(searchFilter.value) : undefined,
        styleFilter?.value ? String(styleFilter.value) : undefined
      );

      setBeers(response.content || []);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements || 0,
      }));
    } catch (err) {
      error('Failed to load beers');
      console.error('Error loading beers:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters, sortConfig, error]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadBeers();
  }, [loadBeers]);

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

  // Handle beer deletion
  const handleDeleteBeer = async (beer: BeerDto) => {
    confirmDelete(beer.beerName || 'this beer', async () => {
      try {
        await beerService.deleteBeer(beer.id!);
        success(`Beer "${beer.beerName}" deleted successfully`);
        loadBeers(); // Reload the list
      } catch (err) {
        error('Failed to delete beer');
        console.error('Error deleting beer:', err);
      }
    });
  };

  // Define table columns
  const columns: Column<BeerDto>[] = [
    {
      key: 'beerName',
      header: 'Name',
      sortable: true,
      render: (value, beer) => (
        <div className="font-medium">
          <button
            onClick={() => navigate(`/beers/${beer.id}`)}
            className="text-primary hover:underline"
          >
            {String(value)}
          </button>
        </div>
      ),
    },
    {
      key: 'beerStyle',
      header: 'Style',
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      align: 'right',
      render: value => (value ? `$${Number(value).toFixed(2)}` : '-'),
    },
    {
      key: 'quantityOnHand',
      header: 'Quantity',
      sortable: true,
      align: 'right',
      render: value => value?.toLocaleString() || '0',
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
      render: (_, beer) => (
        <TableActions
          row={beer}
          actions={createCommonActions({
            onView: (beer: BeerDto) => navigate(`/beers/${beer.id}`),
            onEdit: (beer: BeerDto) => navigate(`/beers/${beer.id}/edit`),
            onDelete: (beer: BeerDto) => handleDeleteBeer(beer),
          })}
        />
      ),
    },
  ];

  // Define filter configuration
  const filterConfig = [
    {
      key: 'beerStyle',
      label: 'Beer Style',
      type: 'select' as const,
      options: [
        { value: 'IPA', label: 'IPA' },
        { value: 'Lager', label: 'Lager' },
        { value: 'Stout', label: 'Stout' },
        { value: 'Pilsner', label: 'Pilsner' },
        { value: 'Wheat', label: 'Wheat' },
        { value: 'Porter', label: 'Porter' },
      ],
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Beers"
        subtitle="Manage your beer inventory"
        actions={
          <Button onClick={() => navigate('/beers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Beer
          </Button>
        }
      />

      <PageContent>
        <div className="space-y-4">
          {/* Filters */}
          <TableFilters
            filters={filterConfig}
            values={filters}
            onFiltersChange={handleFiltersChange}
            searchPlaceholder="Search beers..."
          />

          {/* Data Table */}
          <DataTable
            data={beers}
            columns={columns}
            loading={loading}
            sortConfig={sortConfig}
            onSort={setSortConfig}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            emptyMessage="No beers found. Create your first beer to get started."
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default BeerListPage;
