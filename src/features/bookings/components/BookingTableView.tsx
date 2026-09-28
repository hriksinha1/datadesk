import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Booking } from '../../../lib/repository/types';
import { DataTable, Column } from '../../../components/ui/DataTable';
import { StatusBadge, BalanceCell } from '../../../components/ui/Badges';
import { Money, DateText } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/StateFeedback';
import { BookingPaymentSummary } from '../../../lib/utils/financials';
import { stage } from '../../../lib/analytics';

interface BookingTableViewProps {
  bookings: Booking[];
  balancesByBookingId: Record<string, BookingPaymentSummary>;
  scopeIsAll: boolean;
  today: string;
  onCheckIn: (bookingId: string) => Promise<void>;
  onCheckOut: (bookingId: string) => Promise<void>;
  onAddPayment: (booking: Booking) => void;
  // Sorting & pagination
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

export const BookingTableView: React.FC<BookingTableViewProps> = ({
  bookings,
  balancesByBookingId,
  scopeIsAll,
  today,
  onCheckIn,
  onCheckOut,
  onAddPayment,
  sortKey,
  sortOrder,
  onSort,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
  hasFilters,
}) => {
  const navigate = useNavigate();

  const columns: Column<Booking>[] = [
    // 1. Guest
    {
      key: 'customer',
      header: 'Guest',
      sortable: true,
      width: '28%',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAF4F1] text-[#0D5C4D] flex items-center justify-center font-medium text-xs shrink-0 select-none">
            {b.customer?.name ? b.customer.name.slice(0, 2).toUpperCase() : 'G'}
          </div>
          <div className="min-w-0">
            <Link
              to={`/app/bookings/${b.id}`}
              className="font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline block truncate"
            >
              {b.customer?.name || 'Guest'}
            </Link>
            <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
              <span className="font-mono">{b.booking_no}</span>
              {b.customer?.phone && (
                <>
                  <span>·</span>
                  <span className="hidden xl:inline">{b.customer.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },

    // 2. Stay Dates
    {
      key: 'check_in',
      header: 'Stay',
      sortable: true,
      width: '22%',
      render: (b) => (
        <div>
          <div className="font-medium text-[#0E1726] text-xs sm:text-sm whitespace-nowrap">
            <DateText date={b.check_in} format="short" /> &rarr;{' '}
            <DateText date={b.check_out} format="short" />
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            {b.nights} {b.nights === 1 ? 'night' : 'nights'} · {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
          </div>
        </div>
      ),
    },

    // 3. Unit / Room
    {
      key: 'unit',
      header: 'Unit',
      width: '18%',
      render: (b) => (
        <div>
          <div className="font-medium text-[#0E1726] text-xs sm:text-sm">
            {b.room_number ? `Room ${b.room_number}` : b.room_type}
          </div>
          <div className="text-xs text-[#64748B] mt-0.5 truncate">
            {b.room_number ? b.room_type : 'Unassigned'}
            {scopeIsAll && b.property && (
              <span className="text-[#0D5C4D]"> · {b.property.name}</span>
            )}
          </div>
        </div>
      ),
    },

    // 4. Booking Status
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      render: (b) => <StatusBadge status={b.booking_status} />,
    },

    // 5. Total
    {
      key: 'grand_total',
      header: 'Total',
      align: 'right',
      sortable: true,
      width: '10%',
      render: (b) => (
        <span className="font-medium text-[#0E1726] tabular-nums">
          <Money amount={b.grand_total} />
        </span>
      ),
    },

    // 6. Balance Due
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      sortable: true,
      width: '10%',
      render: (b) => {
        const bal = balancesByBookingId[b.id]?.balanceDue || 0;
        return <BalanceCell balanceDue={bal} />;
      },
    },

    // 7. Context Action & Chevron
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '8%',
      render: (b) => {
        const st = stage(b, today);
        const bal = balancesByBookingId[b.id]?.balanceDue || 0;

        return (
          <div className="flex items-center justify-end gap-2">
            {st === 'arriving' && b.booking_status === 'Confirmed' && (
              <Button size="sm" variant="secondary" onClick={() => onCheckIn(b.id)}>
                Check in
              </Button>
            )}

            {st === 'departing' && b.booking_status === 'Checked In' && (
              <Button size="sm" variant="secondary" onClick={() => onCheckOut(b.id)}>
                Check out
              </Button>
            )}

            {st === 'inHouse' && bal > 0 && (
              <Button size="sm" variant="ghost" onClick={() => onAddPayment(b)}>
                Pay
              </Button>
            )}

            <Link
              to={`/app/bookings/${b.id}`}
              className="p-1 text-[#94A3B8] hover:text-[#0E1726] transition-colors"
              aria-label={`View booking ${b.booking_no}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        );
      },
    },
  ];

  // Mobile card renderer (<768px)
  const renderMobileCard = (b: Booking) => {
    const bal = balancesByBookingId[b.id]?.balanceDue || 0;
    return (
      <Link to={`/app/bookings/${b.id}`} className="block space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-sm text-[#0E1726]">{b.customer?.name || 'Guest'}</div>
          <StatusBadge status={b.booking_status} />
        </div>

        <div className="text-xs text-[#64748B] flex items-center justify-between">
          <span>
            {b.check_in} &rarr; {b.check_out} ({b.nights}N)
          </span>
          <span className="font-medium text-[#334155]">
            {b.room_number ? `Room ${b.room_number}` : b.room_type}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#E4E7EC] text-xs">
          <span className="font-semibold text-[#0E1726]">
            <Money amount={b.grand_total} />
          </span>
          <BalanceCell balanceDue={bal} />
        </div>
      </Link>
    );
  };

  const emptyState = hasFilters ? (
    <EmptyState
      title="No bookings match your filters"
      description="Try clearing search or relaxing status/stage filters."
      action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : undefined}
    />
  ) : (
    <EmptyState
      title="No bookings recorded yet"
      description="Create your first guest reservation to start tracking stays and folios."
      action={{ label: 'New booking', onClick: () => navigate('/app/bookings/new') }}
    />
  );

  return (
    <DataTable
      columns={columns}
      data={bookings}
      keyExtractor={(b) => b.id}
      sortKey={sortKey}
      sortOrder={sortOrder}
      onSort={onSort}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      renderMobileCard={renderMobileCard}
      emptyState={emptyState}
    />
  );
};

export default BookingTableView;
