import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Booking } from '../../lib/repository/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { UnderlineTabs, TabItem } from '../../components/ui/Tabs';
import { SearchField, FilterBar } from '../../components/ui/FormControls';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Money, DateText } from '../../components/ui/Typography';
import { StatStrip, StatCell } from '../../components/ui/StatStrip';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/StateFeedback';
import { outstandingSummary } from '../../lib/analytics';
import AddPaymentModal from '../bookings/AddPaymentModal';

export default function OutstandingPayments() {
  const navigate = useNavigate();
  const { data, propertyFilter, activeProperty } = useWorkspaceData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [payTarget, setPayTarget] = useState<{ booking: Booking; balanceDue: number } | null>(null);

  const paymentTabs: TabItem[] = [
    { id: 'payments', label: 'All payments' },
    { id: 'outstanding', label: 'Outstanding balances' },
  ];

  const dues = useMemo(() => {
    let scopedBookings = data.bookings;
    if (propertyFilter) {
      scopedBookings = scopedBookings.filter((b) => b.property_id === propertyFilter);
    }
    return outstandingSummary(scopedBookings, data.payments);
  }, [data.bookings, data.payments, propertyFilter]);

  const outstandingBookings = useMemo(() => {
    const list: { booking: Booking; balanceDue: number }[] = [];
    let bks = data.bookings;
    if (propertyFilter) {
      bks = bks.filter((b) => b.property_id === propertyFilter);
    }

    for (const b of bks) {
      if (b.booking_status === 'Cancelled') continue;
      const bal = dues.balancesByBookingId[b.id]?.balanceDue || 0;
      if (bal > 0) {
        list.push({ booking: b, balanceDue: bal });
      }
    }

    return list.sort((a, b) => b.balanceDue - a.balanceDue);
  }, [data.bookings, dues.balancesByBookingId, propertyFilter]);

  const filtered = useMemo(() => {
    if (!search) return outstandingBookings;
    const q = search.toLowerCase();
    return outstandingBookings.filter((item) => {
      const b = item.booking;
      const guestName = (b.customer?.name || '').toLowerCase();
      const bNo = (b.booking_no || '').toLowerCase();
      const phone = (b.customer?.phone || '').toLowerCase();
      const room = (b.room_number || '').toLowerCase();
      return guestName.includes(q) || bNo.includes(q) || phone.includes(q) || room.includes(q);
    });
  }, [outstandingBookings, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const columns: Column<{ booking: Booking; balanceDue: number }>[] = [
    {
      key: 'guest',
      header: 'Guest',
      width: '28%',
      render: ({ booking }) => (
        <div>
          <Link
            to={`/app/bookings/${booking.id}`}
            className="font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
          >
            {booking.customer?.name || 'Guest'}
          </Link>
          <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
            <span className="font-mono">{booking.booking_no}</span>
            <span>·</span>
            <span>{booking.customer?.phone || 'No phone'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stay',
      header: 'Stay dates',
      width: '20%',
      render: ({ booking }) => (
        <div>
          <div className="text-xs sm:text-sm font-medium text-[#0E1726]">
            <DateText date={booking.check_in} format="short" /> &rarr;{' '}
            <DateText date={booking.check_out} format="short" />
          </div>
          <div className="text-xs text-[#64748B] mt-0.5">
            {booking.room_number ? `Room ${booking.room_number}` : booking.room_type} · {booking.nights}N
          </div>
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      width: '18%',
      render: ({ booking }) => (
        <span className="text-xs text-[#334155] font-medium">{booking.property?.name || '—'}</span>
      ),
    },
    {
      key: 'total',
      header: 'Grand total',
      align: 'right',
      width: '14%',
      render: ({ booking }) => (
        <span className="text-xs sm:text-sm font-medium tabular-nums text-[#0E1726]">
          <Money amount={booking.grand_total} />
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance due',
      align: 'right',
      width: '14%',
      render: ({ balanceDue }) => (
        <span className="text-xs sm:text-sm font-semibold tabular-nums text-[#B45309]">
          <Money amount={balanceDue} />
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      width: '12%',
      render: (item) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPayTarget(item)}
          icon={<CreditCard className="w-3.5 h-3.5" />}
        >
          Collect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        title="Outstanding balances"
        scopeLabel={activeProperty ? activeProperty.name : `All properties · ${data.properties.length}`}
        subtitle="Unsettled guest folios requiring front desk collection"
      />

      {/* Shared Tab Header */}
      <UnderlineTabs
        tabs={paymentTabs}
        activeId="outstanding"
        onChange={(id) => {
          if (id === 'payments') navigate('/app/payments');
        }}
      />

      {/* Summary KPI Strip */}
      <StatStrip>
        <StatCell
          label="TOTAL OUTSTANDING DUES"
          value={
            <span className="text-[#B45309]">
              <Money amount={dues.totalOutstanding} />
            </span>
          }
          caption="Unpaid balances across active reservations"
        />
        <StatCell
          label="BOOKINGS WITH BALANCE"
          value={<span>{dues.bookingsWithBalanceCount}</span>}
          caption="Reservations with pending folio"
        />
        <StatCell
          label="AVERAGE BALANCE DUE"
          value={
            <Money
              amount={
                dues.bookingsWithBalanceCount > 0
                  ? Math.round(dues.totalOutstanding / dues.bookingsWithBalanceCount)
                  : 0
              }
            />
          }
          caption="Average per open folio"
        />
      </StatStrip>

      {/* Search */}
      <FilterBar>
        <SearchField
          value={search}
          onChangeValue={setSearch}
          placeholder="Search by guest name, booking #, phone, or unit..."
          className="min-w-[280px]"
        />
      </FilterBar>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(item) => item.booking.id}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        emptyState={
          <EmptyState
            title="No outstanding balances"
            description="All active bookings have been fully paid."
          />
        }
      />

      {/* Quick Collect Modal */}
      {payTarget && (
        <AddPaymentModal
          isOpen={!!payTarget}
          onClose={() => setPayTarget(null)}
          booking={payTarget.booking}
          balanceDue={payTarget.balanceDue}
          onSuccess={() => setPayTarget(null)}
        />
      )}
    </div>
  );
}
