import React from 'react';
import { Download, List, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import { SearchField, Select, FilterBar } from '../../../components/ui/FormControls';
import { Button } from '../../../components/ui/Button';
import { UnderlineTabs, TabItem } from '../../../components/ui/Tabs';

interface BookingToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeView: 'list' | 'calendar' | 'analytics';
  onViewChange: (view: 'list' | 'calendar' | 'analytics') => void;
  stageFilter: string;
  onStageFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (val: string) => void;
  onExport: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

export const BookingToolbar: React.FC<BookingToolbarProps> = ({
  searchTerm,
  onSearchChange,
  activeView,
  onViewChange,
  stageFilter,
  onStageFilterChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  onExport,
  onClearFilters,
  hasActiveFilters,
  totalFilteredCount,
}) => {
  const viewTabs: TabItem[] = [
    { id: 'list', label: 'List view', icon: <List className="w-4 h-4" /> },
    { id: 'calendar', label: 'Reservation board', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-3 mb-4">
      {/* View Switcher Underline Tabs */}
      <div className="flex items-center justify-between border-b border-[#E4E7EC]">
        <UnderlineTabs
          tabs={viewTabs}
          activeId={activeView}
          onChange={(id) => onViewChange(id as 'list' | 'calendar' | 'analytics')}
          className="border-b-0"
        />

        <div className="text-xs text-[#64748B] hidden sm:block">
          <span className="font-semibold text-[#0E1726] tabular-nums">{totalFilteredCount}</span> bookings in view
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar>
        {/* Search */}
        <SearchField
          value={searchTerm}
          onChangeValue={onSearchChange}
          placeholder="Search guest name, booking #, phone, or unit..."
          className="min-w-[260px]"
        />

        {/* Stage Filter */}
        <Select
          value={stageFilter}
          onChange={(e) => onStageFilterChange(e.target.value)}
          aria-label="Filter by stay stage"
        >
          <option value="">Stage: Any</option>
          <option value="arriving">Arriving today</option>
          <option value="inHouse">In house</option>
          <option value="departing">Departing today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past stay</option>
        </Select>

        {/* Booking Status Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          aria-label="Filter by booking status"
        >
          <option value="">Status: All active</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Checked In">Checked In</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="all">Include cancelled</option>
        </Select>

        {/* Payment Status Filter */}
        <Select
          value={paymentFilter}
          onChange={(e) => onPaymentFilterChange(e.target.value)}
          aria-label="Filter by payment status"
        >
          <option value="">Payment: Any</option>
          <option value="Paid">Paid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Unpaid">Unpaid</option>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}

        {/* Export CSV */}
        <div className="ml-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </FilterBar>
    </div>
  );
};

export default BookingToolbar;
