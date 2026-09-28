import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './StateFeedback';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyState?: React.ReactNode;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  renderMobileCard?: (row: T) => React.ReactNode;
  // Pagination
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyState,
  sortKey,
  sortOrder,
  onSort,
  renderMobileCard,
  page = 1,
  pageSize = 25,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`w-full bg-white border border-[#E4E7EC] rounded-[8px] overflow-hidden p-4 space-y-3 ${className}`}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const effectiveTotal = totalItems ?? data.length;
  const totalPages = Math.ceil(effectiveTotal / pageSize) || 1;
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, effectiveTotal);

  return (
    <div className={`w-full bg-white border border-[#E4E7EC] rounded-[8px] overflow-hidden flex flex-col ${className}`}>
      {/* Mobile view (<768px): Card stack if renderMobileCard provided */}
      {renderMobileCard && (
        <div className="md:hidden divide-y divide-[#E4E7EC] p-2 space-y-2">
          {data.map((row) => (
            <div key={keyExtractor(row)} className="p-3 bg-white rounded-[6px] border border-[#E4E7EC]">
              {renderMobileCard(row)}
            </div>
          ))}
        </div>
      )}

      {/* Desktop view (>=768px): Proper HTML <table> */}
      <div className={`overflow-x-auto ${renderMobileCard ? 'hidden md:block' : 'block'}`}>
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">Data Table</caption>
          <thead>
            <tr className="h-10 bg-[#F7F8FA] border-b border-[#E4E7EC]">
              {columns.map((col, idx) => {
                const isSortable = !!col.sortable && !!onSort;
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={isSorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                    style={{ width: col.width }}
                    className={`text-xs font-medium text-[#64748B] tracking-normal select-none ${
                      idx === 0 ? 'pl-4 pr-3' : 'px-3'
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1 hover:text-[#0E1726] transition-colors cursor-pointer"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC]">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="group hover:bg-[#F7F8FA] focus-within:bg-[#F7F8FA] transition-colors"
              >
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`py-3 text-sm text-[#0E1726] align-middle ${
                      idx === 0 ? 'pl-4 pr-3' : 'px-3'
                    } ${col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {onPageChange && (
        <div className="h-12 px-4 border-t border-[#E4E7EC] bg-[#F7F8FA] flex items-center justify-between text-xs text-[#64748B] shrink-0">
          <div className="flex items-center gap-2">
            <span>
              Showing {startIdx}–{endIdx} of {effectiveTotal}
            </span>
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="ml-2 h-7 px-2 text-xs bg-white border border-[#E4E7EC] rounded-[4px]"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1 rounded-[4px] hover:bg-white border border-transparent hover:border-[#E4E7EC] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="tabular-nums font-medium text-[#0E1726]">
              {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1 rounded-[4px] hover:bg-white border border-transparent hover:border-[#E4E7EC] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
