import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { Column, SortConfig, PaginationConfig } from './DataTable';

export interface SelectionConfig<T> {
  selectedRows: T[];
  onSelectionChange: (selectedRows: T[]) => void;
  getRowId: (row: T) => string | number;
  selectableRowFilter?: (row: T) => boolean;
}

interface SelectableDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selection: SelectionConfig<T>;
  loading?: boolean;
  sortable?: boolean;
  sortConfig?: SortConfig;
  onSort?: (sortConfig: SortConfig) => void;
  pagination?: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  emptyMessage?: string;
  bulkActions?: React.ReactNode;
}

/**
 * Data table component with row selection functionality
 */
const SelectableDataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  selection,
  loading = false,
  sortable = true,
  sortConfig,
  onSort,
  pagination,
  onPageChange,
  onPageSizeChange,
  className = '',
  emptyMessage = 'No data available',
  bulkActions,
}: SelectableDataTableProps<T>) => {
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | null>(null);

  const { selectedRows, onSelectionChange, getRowId, selectableRowFilter } = selection;

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

  // Filter selectable rows
  const selectableRows = useMemo(() => {
    return selectableRowFilter ? sortedData.filter(selectableRowFilter) : sortedData;
  }, [sortedData, selectableRowFilter]);

  // Check if all selectable rows are selected
  const isAllSelected = useMemo(() => {
    return (
      selectableRows.length > 0 &&
      selectableRows.every(row =>
        selectedRows.some(selected => getRowId(selected) === getRowId(row))
      )
    );
  }, [selectableRows, selectedRows, getRowId]);

  // Check if some (but not all) rows are selected
  const isIndeterminate = useMemo(() => {
    const selectedCount = selectableRows.filter(row =>
      selectedRows.some(selected => getRowId(selected) === getRowId(row))
    ).length;
    return selectedCount > 0 && selectedCount < selectableRows.length;
  }, [selectableRows, selectedRows, getRowId]);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all selectable rows
      const newSelection = [...selectedRows];
      selectableRows.forEach(row => {
        const rowId = getRowId(row);
        if (!selectedRows.some(selected => getRowId(selected) === rowId)) {
          newSelection.push(row);
        }
      });
      onSelectionChange(newSelection);
    } else {
      // Deselect all rows from current page/data
      const currentRowIds = selectableRows.map(getRowId);
      const newSelection = selectedRows.filter(row => !currentRowIds.includes(getRowId(row)));
      onSelectionChange(newSelection);
    }
  };

  const handleRowSelect = (row: T, checked: boolean) => {
    const rowId = getRowId(row);

    if (checked) {
      onSelectionChange([...selectedRows, row]);
    } else {
      onSelectionChange(selectedRows.filter(selected => getRowId(selected) !== rowId));
    }
  };

  const isRowSelected = (row: T) => {
    const rowId = getRowId(row);
    return selectedRows.some(selected => getRowId(selected) === rowId);
  };

  const isRowSelectable = (row: T) => {
    return !selectableRowFilter || selectableRowFilter(row);
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
      {/* Bulk actions bar */}
      {selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm text-blue-700">{selectedRows.length} row(s) selected</span>
          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Selection column */}
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected ? true : isIndeterminate ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>

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
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow key={getRowId(row)} className={isRowSelected(row) ? 'bg-blue-50' : ''}>
                  {/* Selection cell */}
                  <TableCell>
                    <Checkbox
                      checked={isRowSelected(row)}
                      disabled={!isRowSelectable(row)}
                      onCheckedChange={(checked: boolean) => handleRowSelect(row, checked)}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>

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

// Reuse pagination component from DataTable
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

export default SelectableDataTable;
