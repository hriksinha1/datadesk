import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useBookingsModel, useWorkspaceData } from '../../context/WorkspaceDataContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Booking } from '../../lib/repository/types';
import { stage } from '../../lib/analytics';
import BookingMetricsBar from './components/BookingMetricsBar';
import BookingToolbar from './components/BookingToolbar';
import BookingTableView from './components/BookingTableView';
import HotelCalendarView from './components/HotelCalendarView';
import BookingAnalyticsView from './components/BookingAnalyticsView';
import AddPaymentModal from './AddPaymentModal';

export default function BookingsList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const bookingsModel = useBookingsModel();
  const { addPayment } = useWorkspaceData();

  const [searchParams, setSearchParams] = useSearchParams();

  // URL State
  const viewParam = searchParams.get('view') || 'list';
  const activeView = (['list', 'calendar', 'analytics'].includes(viewParam) ? viewParam : 'list') as
    | 'list'
    | 'calendar'
    | 'analytics';

  const searchTerm = searchParams.get('q') || '';
  const stageFilter = searchParams.get('stage') || '';
  const statusFilter = searchParams.get('status') || '';
  const paymentFilter = searchParams.get('pay') || '';
  const sortKey = searchParams.get('sort') || 'relevant';
  const sortOrder = (searchParams.get('order') || 'asc') as 'asc' | 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [pageSize, setPageSize] = useState(25);

  // Quick Payment Modal
  const [paymentModalBooking, setPaymentModalBooking] = useState<Booking | null>(null);

  // State Update Helpers with URL Sync
  const updateQueryParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
          if (key !== 'page') {
            next.delete('page'); // Reset to page 1 on filter/view change
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        if (prev.get('view')) next.set('view', prev.get('view')!);
        if (prev.get('property')) next.set('property', prev.get('property')!);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const hasActiveFilters = Boolean(searchTerm || stageFilter || statusFilter || paymentFilter);

  // Filtering Logic
  const filteredBookings = useMemo(() => {
    return bookingsModel.bookings.filter((b) => {
      // 1. Cancelled bookings hidden by default unless statusFilter is 'Cancelled' or 'all'
      if (statusFilter !== 'Cancelled' && statusFilter !== 'all') {
        if (b.booking_status === 'Cancelled') return false;
      }

      // 2. Status Filter
      if (statusFilter && statusFilter !== 'all') {
        if (b.booking_status !== statusFilter) return false;
      }

      // 3. Stage Filter
      if (stageFilter) {
        if (stageFilter === 'balanceDue') {
          const bal = bookingsModel.balancesByBookingId[b.id]?.balanceDue || 0;
          if (bal <= 0) return false;
        } else {
          const currentStage = stage(b, bookingsModel.today);
          if (currentStage !== stageFilter) return false;
        }
      }

      // 4. Payment Filter
      if (paymentFilter) {
        const pStatus = bookingsModel.balancesByBookingId[b.id]?.paymentStatus || b.payment_status;
        if (pStatus !== paymentFilter) return false;
      }

      // 5. Search keyword
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const guestName = (b.customer?.name || '').toLowerCase();
        const bNo = (b.booking_no || '').toLowerCase();
        const room = (b.room_number || '').toLowerCase();
        const phone = (b.customer?.phone || '').toLowerCase();
        const prop = (b.property?.name || '').toLowerCase();
        if (
          !guestName.includes(q) &&
          !bNo.includes(q) &&
          !room.includes(q) &&
          !phone.includes(q) &&
          !prop.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bookingsModel.bookings, bookingsModel.balancesByBookingId, bookingsModel.today, statusFilter, stageFilter, paymentFilter, searchTerm]);

  // Sorting Logic
  const sortedBookings = useMemo(() => {
    const list = [...filteredBookings];
    if (sortKey === 'customer') {
      list.sort((a, b) => {
        const nameA = a.customer?.name || '';
        const nameB = b.customer?.name || '';
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    } else if (sortKey === 'check_in') {
      list.sort((a, b) => {
        return sortOrder === 'asc'
          ? a.check_in.localeCompare(b.check_in)
          : b.check_in.localeCompare(a.check_in);
      });
    } else if (sortKey === 'grand_total') {
      list.sort((a, b) => {
        return sortOrder === 'asc'
          ? a.grand_total - b.grand_total
          : b.grand_total - a.grand_total;
      });
    } else if (sortKey === 'balance') {
      list.sort((a, b) => {
        const balA = bookingsModel.balancesByBookingId[a.id]?.balanceDue || 0;
        const balB = bookingsModel.balancesByBookingId[b.id]?.balanceDue || 0;
        return sortOrder === 'asc' ? balA - balB : balB - balA;
      });
    } else {
      // Default: Most relevant (arriving today -> in house -> upcoming ascending -> past descending)
      list.sort((a, b) => {
        const rank = (bk: Booking) => {
          const st = stage(bk, bookingsModel.today);
          if (st === 'arriving') return 1;
          if (st === 'inHouse') return 2;
          if (st === 'departing') return 3;
          if (st === 'upcoming') return 4;
          return 5;
        };
        const rankDiff = rank(a) - rank(b);
        if (rankDiff !== 0) return rankDiff;
        return a.check_in.localeCompare(b.check_in);
      });
    }
    return list;
  }, [filteredBookings, sortKey, sortOrder, bookingsModel.balancesByBookingId, bookingsModel.today]);

  // Pagination slice
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedBookings.slice(start, start + pageSize);
  }, [sortedBookings, page, pageSize]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const headers = [
      'Booking No',
      'Guest Name',
      'Phone',
      'Property',
      'Unit',
      'Check In',
      'Check Out',
      'Nights',
      'Guests',
      'Status',
      'Total (INR)',
      'Balance (INR)',
      'Payment Status',
    ];

    const escapeCSV = (val: unknown) => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = sortedBookings.map((b) => {
      const bal = bookingsModel.balancesByBookingId[b.id]?.balanceDue || 0;
      return [
        b.booking_no,
        b.customer?.name || '',
        b.customer?.phone || '',
        b.property?.name || '',
        b.room_number ? `Room ${b.room_number}` : b.room_type,
        b.check_in,
        b.check_out,
        b.nights,
        b.guests,
        b.booking_status,
        b.grand_total,
        bal,
        bookingsModel.balancesByBookingId[b.id]?.paymentStatus || b.payment_status,
      ].map(escapeCSV).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings_export_${bookingsModel.today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({ message: `Exported ${sortedBookings.length} bookings to CSV`, type: 'success' });
  }, [sortedBookings, bookingsModel.balancesByBookingId, bookingsModel.today, showToast]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      updateQueryParam('order', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateQueryParam('sort', key);
      updateQueryParam('order', 'asc');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Bookings"
        scopeLabel={
          bookingsModel.activeProperty
            ? bookingsModel.activeProperty.name
            : `All properties · ${bookingsModel.properties.length}`
        }
        subtitle={
          bookingsModel.activeProperty
            ? `Reservations and room allocations at ${bookingsModel.activeProperty.name}`
            : 'Reservations, stays, and availability across your portfolio'
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/app/bookings/new')}
            icon={<Plus className="w-4 h-4" />}
          >
            New booking
          </Button>
        }
      />

      {/* 2. StatStrip with quick-filter clickable cells */}
      <BookingMetricsBar
        arrivingTodayCount={bookingsModel.stats.arrivingTodayCount}
        inHouseCount={bookingsModel.stats.inHouseCount}
        departingTodayCount={bookingsModel.stats.departingTodayCount}
        totalOutstanding={bookingsModel.stats.totalOutstanding}
        balanceBookingsCount={bookingsModel.stats.balanceBookingsCount}
        activeStageFilter={stageFilter}
        onSelectStage={(st) => updateQueryParam('stage', st)}
      />

      {/* 3. Toolbar (View Switcher, Filters, CSV Export) */}
      <BookingToolbar
        searchTerm={searchTerm}
        onSearchChange={(val) => updateQueryParam('q', val)}
        activeView={activeView}
        onViewChange={(v) => updateQueryParam('view', v)}
        stageFilter={stageFilter}
        onStageFilterChange={(val) => updateQueryParam('stage', val)}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => updateQueryParam('status', val)}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={(val) => updateQueryParam('pay', val)}
        onExport={handleExportCSV}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalFilteredCount={sortedBookings.length}
      />

      {/* 4. Active View */}
      {activeView === 'list' && (
        <BookingTableView
          bookings={paginatedBookings}
          balancesByBookingId={bookingsModel.balancesByBookingId}
          scopeIsAll={bookingsModel.scopeIsAll}
          today={bookingsModel.today}
          onCheckIn={bookingsModel.checkIn}
          onCheckOut={bookingsModel.checkOut}
          onAddPayment={(b) => setPaymentModalBooking(b)}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          page={page}
          pageSize={pageSize}
          onPageChange={(p) => updateQueryParam('page', String(p))}
          onPageSizeChange={(sz) => setPageSize(sz)}
          onClearFilters={handleClearFilters}
          hasFilters={hasActiveFilters}
        />
      )}

      {activeView === 'calendar' && (
        <HotelCalendarView
          bookings={filteredBookings}
          properties={bookingsModel.properties}
          units={bookingsModel.units}
          blocks={bookingsModel.blocks}
          balancesByBookingId={bookingsModel.balancesByBookingId}
          selectedPropertyId={bookingsModel.activeProperty?.id}
          searchFilter={searchTerm}
          onCheckIn={bookingsModel.checkIn}
          onCheckOut={bookingsModel.checkOut}
          onAddPayment={(b) => setPaymentModalBooking(b)}
        />
      )}

      {activeView === 'analytics' && (
        <BookingAnalyticsView bookings={filteredBookings} />
      )}

      {/* Quick Add Payment Modal */}
      {paymentModalBooking && (
        <AddPaymentModal
          isOpen={!!paymentModalBooking}
          onClose={() => setPaymentModalBooking(null)}
          booking={paymentModalBooking}
          balanceDue={bookingsModel.balancesByBookingId[paymentModalBooking.id]?.balanceDue || 0}
          onSuccess={async () => {
            setPaymentModalBooking(null);
            showToast({ message: 'Payment recorded successfully', type: 'success' });
          }}
        />
      )}
    </div>
  );
}
