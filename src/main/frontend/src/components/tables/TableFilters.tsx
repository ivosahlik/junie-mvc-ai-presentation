import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import SelectInput, { type SelectOption } from '../forms/SelectInput';
import { Search, X, Filter } from 'lucide-react';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: SelectOption[];
  placeholder?: string;
}

export interface FilterValue {
  key: string;
  value: unknown;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

interface TableFiltersProps {
  filters: FilterConfig[];
  values: FilterValue[];
  onFiltersChange: (filters: FilterValue[]) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showClearAll?: boolean;
  className?: string;
}

/**
 * Table filtering component with search and multiple filter types
 */
const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  values,
  onFiltersChange,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showClearAll = true,
  className = '',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});

  // Initialize filter values from props
  useEffect(() => {
    const initialValues: Record<string, unknown> = {};
    values.forEach(filter => {
      initialValues[filter.key] = filter.value;
    });
    setFilterValues(initialValues);

    // Set search value if it exists
    const searchFilter = values.find(f => f.key === 'search');
    if (searchFilter) {
      setSearchValue(String(searchFilter.value || ''));
    }
  }, [values]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    updateFilters('search', value);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    updateFilters(key, value);
  };

  const updateFilters = (key: string, value: unknown) => {
    const newFilters = values.filter(f => f.key !== key);

    if (value !== '' && value !== null && value !== undefined) {
      const operator = getDefaultOperator(key);
      newFilters.push({ key, value, operator });
    }

    onFiltersChange(newFilters);
  };

  const getDefaultOperator = (key: string): FilterValue['operator'] => {
    if (key === 'search') return 'contains';

    const filter = filters.find(f => f.key === key);
    if (!filter) return 'equals';

    switch (filter.type) {
      case 'text':
        return 'contains';
      case 'number':
        return 'equals';
      case 'date':
        return 'equals';
      case 'select':
        return 'equals';
      default:
        return 'equals';
    }
  };

  const clearAllFilters = () => {
    setSearchValue('');
    setFilterValues({});
    onFiltersChange([]);
  };

  const hasActiveFilters = values.length > 0;

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.key] || '';

    switch (filter.type) {
      case 'text':
        return (
          <Input
            key={filter.key}
            placeholder={filter.placeholder || filter.label}
            value={String(value)}
            onChange={e => handleFilterChange(filter.key, e.target.value)}
            className="w-48"
          />
        );

      case 'select':
        return (
          <SelectInput
            key={filter.key}
            value={String(value)}
            onChange={newValue => handleFilterChange(filter.key, newValue)}
            options={filter.options || []}
            placeholder={filter.placeholder || `Select ${filter.label}`}
            allowClear
            className="w-48"
          />
        );

      case 'number':
        return (
          <Input
            key={filter.key}
            type="number"
            placeholder={filter.placeholder || filter.label}
            value={String(value)}
            onChange={e => handleFilterChange(filter.key, e.target.value)}
            className="w-32"
          />
        );

      case 'date':
        return (
          <Input
            key={filter.key}
            type="date"
            placeholder={filter.placeholder || filter.label}
            value={String(value)}
            onChange={e => handleFilterChange(filter.key, e.target.value)}
            className="w-40"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {showSearch && (
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {filters.map(filter => (
          <div key={filter.key} className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">{filter.label}</label>
            {renderFilter(filter)}
          </div>
        ))}

        {showClearAll && hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Active filters:</span>
          {values.map(filter => (
            <div
              key={filter.key}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
            >
              <span>
                {filter.key === 'search'
                  ? 'Search'
                  : filters.find(f => f.key === filter.key)?.label || filter.key}
                : {String(filter.value)}
              </span>
              <button
                onClick={() => updateFilters(filter.key, '')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableFilters;
