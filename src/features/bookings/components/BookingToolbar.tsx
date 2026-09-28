import React from 'react';
import { 
  Search, 
  Filter, 
  List, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Download, 
  X 
} from 'lucide-react';

interface BookingToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeView: 'list' | 'calendar' | 'analytics';
  onViewChange: (view: 'list' | 'calendar' | 'analytics') => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (val: string) => void;
  onExport: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function BookingToolbar({
  searchTerm,
  onSearchChange,
  activeView,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  onExport,
  onClearFilters,
  hasActiveFilters,
}: BookingToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by booking #, guest name, room, phone..."
            className="input pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border-slate-200 shadow-2xs placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right Action Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter: Booking Status */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="select py-2 pl-3 pr-8 text-xs bg-white border-slate-200 shadow-2xs font-medium text-slate-700 w-auto"
          >
            <option value="">Status: All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Quick Filter: Payment Status */}
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="select py-2 pl-3 pr-8 text-xs bg-white border-slate-200 shadow-2xs font-medium text-slate-700 w-auto"
          >
            <option value="">Payment: All</option>
            <option value="Fully Paid">Fully Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          {/* Export Action */}
          <button
            onClick={onExport}
            title="Export bookings CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Download size={14} className="text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* View Switcher Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewChange('list')}
              title="Table List View"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeView === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              title="Reservation Tape Chart Calendar"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeView === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon size={14} />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => onViewChange('analytics')}
              title="Booking Analytics"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
              Keyword: "{searchTerm}"
              <button onClick={() => onSearchChange('')} className="hover:text-slate-900">
                <X size={12} />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
              Status: {statusFilter}
              <button onClick={() => onStatusFilterChange('')} className="hover:text-slate-900">
                <X size={12} />
              </button>
            </span>
          )}
          {paymentFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
              Payment: {paymentFilter}
              <button onClick={() => onPaymentFilterChange('')} className="hover:text-slate-900">
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 ml-1 underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
