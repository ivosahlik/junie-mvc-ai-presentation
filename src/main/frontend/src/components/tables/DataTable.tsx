import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  sortable?: boolean;
  sortConfig?: SortConfig;
  onSort?: (sortConfig: SortConfig) => void;
  pagination?: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  emptyMessage?: string;
}

/**
 * Reusable data table component with sorting and pagination
 */
const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  sortable = true,
  sortConfig,
  onSort,
  pagination,
  onPageChange,
  onPageSizeChange,
  className = '',
  emptyMessage = 'No data available',
}: DataTableProps<T>) => {
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | null>(null);

  // Use external sort config if provided, otherwise use internal
  const currentSortConfig = sortConfig || internalSortConfig;

  // Sort data if no external sorting is provided
  const sortedData = useMemo(() => {
    if (!currentSortConfig || sortConfig) {
      return data; // Use external data as-is if external sorting is handled
    }

    return [...data].sort((a, b) => {
      const aValue = a[currentSortConfig.key];
      const bValue = b[currentSortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return currentSortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, [data, currentSortConfig, sortConfig]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newDirection: 'asc' | 'desc' =
      currentSortConfig?.key === columnKey && currentSortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';

    const newSortConfig: SortConfig = { key: columnKey, direction: newDirection };

    if (onSort) {
      onSort(newSortConfig);
    } else {
      setInternalSortConfig(newSortConfig);
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortable) return null;

    if (currentSortConfig?.key === columnKey) {
      return currentSortConfig.direction === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
  };

  const renderCell = (column: Column<T>, row: T, index: number) => {
    const value = typeof column.key === 'string' ? row[column.key] : row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row, index);
    }

    return value?.toString() || '';
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead
                  key={column.key.toString()}
                  className={`${getAlignmentClass(column.align)} ${
                    sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key.toString())}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable !== false && getSortIcon(column.key.toString())}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map(column => (
                    <TableCell
                      key={column.key.toString()}
                      className={getAlignmentClass(column.align)}
                    >
                      {renderCell(column, row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <TablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

// Pagination component
interface TablePaginationProps {
  pagination: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {total} results
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(1)}
            disabled={page === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700 px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
