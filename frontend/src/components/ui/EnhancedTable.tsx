import React, { useState, useMemo, useCallback } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Filter, 
  Search, 
  ChevronRight, 
  ChevronDown as ChevronDownExpand 
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

export interface Column<T = Record<string, unknown>> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  expandable?: boolean;
  renderExpandedRow?: (row: T) => React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

type SortConfig<T> = {
  key: keyof T | string;
  direction: 'asc' | 'desc';
} | null;

export function EnhancedTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  onRowClick,
  onEdit: _onEdit,
  onDelete: _onDelete,
  expandable = false,
  renderExpandedRow,
  selectable = false,
  onSelectionChange,
  className = '',
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [globalFilter, setGlobalFilter] = useState('');

  // Get cell value utility function
  const getCellValue = useCallback((row: T, accessor: keyof T | ((row: T) => unknown)) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  }, []);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row =>
        columns.some(column => {
          const value = getCellValue(row, column.accessor);
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find(col => col.id === columnId);
        if (column) {
          filtered = filtered.filter(row => {
            const value = getCellValue(row, column.accessor);
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const column = columns.find(col => col.id === sortConfig.key || col.accessor === sortConfig.key);
        if (!column) return 0;

        const aValue = getCellValue(a, column.accessor);
        const bValue = getCellValue(b, column.accessor);

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, columns, sortConfig, filters, globalFilter, getCellValue]);

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = column.id;
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null; // Remove sorting
        }
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle row expansion
  const toggleRowExpanded = (rowId: string | number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Handle row selection
  const toggleRowSelected = (rowId: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      
      // Notify parent of selection change
      const selectedData = data.filter(row => newSet.has(row.id));
      onSelectionChange?.(selectedData);
      
      return newSet;
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    const allSelected = processedData.every(row => selectedRows.has(row.id));
    if (allSelected) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(processedData.map(row => row.id));
      setSelectedRows(allIds);
      onSelectionChange?.(processedData);
    }
  };

  // Get sort icon
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const key = column.id;
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' 
        ? <ChevronUp className="w-4 h-4" />
        : <ChevronDown className="w-4 h-4" />;
    }
    return <ChevronsUpDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card overflow-hidden ${className}`}>
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Global Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search across all columns..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selection Info */}
          {selectable && selectedRows.size > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedRows.size} of {processedData.length} selected
            </div>
          )}
        </div>

        {/* Column Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.filter(col => col.filterable).map(column => (
            <div key={column.id} className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Filter by ${column.header.toLowerCase()}...`}
                value={filters[column.id] || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, [column.id]: e.target.value }))}
                className="pl-10"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={processedData.length > 0 && processedData.every(row => selectedRows.has(row.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {expandable && <th className="px-4 py-3 w-8"></th>}
              {columns.map(column => (
                <th 
                  key={column.id} 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => handleSort(column)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {processedData.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              const isSelected = selectedRows.has(row.id);
              
              return (
                <React.Fragment key={row.id}>
                  <tr 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelected(row.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {expandable && (
                      <td className="px-4 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpanded(row.id);
                          }}
                          className="p-1"
                        >
                          {isExpanded ? (
                            <ChevronDownExpand className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </td>
                    )}
                    {columns.map(column => {
                      const value = getCellValue(row, column.accessor);
                      return (
                        <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                          {column.render ? column.render(value, row) : String(value)}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr>
                      <td 
                        colSpan={columns.length + (selectable ? 1 : 0) + 1} 
                        className="px-6 py-4 bg-gray-50 dark:bg-gray-800"
                      >
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {processedData.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {globalFilter || Object.values(filters).some(f => f) 
              ? 'No results found. Try adjusting your filters.' 
              : 'No data available.'
            }
          </p>
        </div>
      )}
    </div>
  );
}