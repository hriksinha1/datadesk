import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Payment } from '../../lib/repository/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { UnderlineTabs, TabItem } from '../../components/ui/Tabs';
import { SearchField, FilterBar } from '../../components/ui/FormControls';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Money, DateText } from '../../components/ui/Typography';
import { StatStrip, StatCell } from '../../components/ui/StatStrip';
import { EmptyState } from '../../components/ui/StateFeedback';

export default function PaymentsList() {
  const navigate = useNavigate();
  const { data, propertyFilter, activeProperty } = useWorkspaceData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const paymentTabs: TabItem[] = [
    { id: 'payments', label: 'All payments' },
    { id: 'outstanding', label: 'Outstanding balances' },
  ];

  const scopedPayments = useMemo(() => {
    let ps = data.payments;
    if (propertyFilter) {
      const bIds = new Set(data.bookings.filter((b) => b.property_id === propertyFilter).map((b) => b.id));
      ps = ps.filter((p) => bIds.has(p.booking_id));
    }
    return ps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.payments, data.bookings, propertyFilter]);

  const bookingMap = useMemo(() => new Map(data.bookings.map((b) => [b.id, b])), [data.bookings]);

  const filteredPayments = useMemo(() => {
    if (!search) return scopedPayments;
    const q = search.toLowerCase();
    return scopedPayments.filter((p) => {
      const b = bookingMap.get(p.booking_id);
      const guestName = (b?.customer?.name || '').toLowerCase();
      const bNo = (b?.booking_no || '').toLowerCase();
      const pNo = (p.payment_no || '').toLowerCase();
      const method = (p.method || '').toLowerCase();
      const ref = (p.ref_id || '').toLowerCase();
      return guestName.includes(q) || bNo.includes(q) || pNo.includes(q) || method.includes(q) || ref.includes(q);
    });
  }, [scopedPayments, search, bookingMap]);

  // Statistics
  const totalCollected = useMemo(() => {
    return scopedPayments
      .filter((p) => p.status === 'Recorded' || p.status === 'Completed')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [scopedPayments]);

  const totalRefunded = useMemo(() => {
    return scopedPayments
      .filter((p) => p.status === 'Refunded')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [scopedPayments]);

  const columns: Column<Payment>[] = [
    {
      key: 'payment_no',
      header: 'Receipt #',
      width: '18%',
      render: (p) => {
        const b = bookingMap.get(p.booking_id);
        return (
          <div>
            <span className="font-mono text-xs font-semibold text-[#0E1726]">{p.payment_no}</span>
            <div className="text-xs text-[#64748B]">
              Booking:{' '}
              {b ? (
                <Link to={`/app/bookings/${b.id}`} className="hover:underline text-[#0D5C4D]">
                  {b.booking_no}
                </Link>
              ) : (
                '—'
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'guest',
      header: 'Guest & Property',
      width: '28%',
      render: (p) => {
        const b = bookingMap.get(p.booking_id);
        return (
          <div>
            <div className="font-medium text-[#0E1726]">{b?.customer?.name || 'Guest'}</div>
            <div className="text-xs text-[#64748B] mt-0.5">
              {b?.property?.name || 'Property'} · {b?.room_number ? `Room ${b.room_number}` : b?.room_type}
            </div>
          </div>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      width: '18%',
      render: (p) => <DateText date={p.date} format="medium" />,
    },
    {
      key: 'method',
      header: 'Method & Purpose',
      width: '20%',
      render: (p) => (
        <div>
          <span className="font-medium text-[#0E1726]">{p.method}</span>
          <div className="text-xs text-[#64748B] mt-0.5">
            {p.purpose || 'Payment'} {p.ref_id ? `· ${p.ref_id}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      width: '16%',
      render: (p) => {
        const isRefund = p.status === 'Refunded';
        return (
          <span
            className={`font-semibold tabular-nums ${
              isRefund ? 'text-[#B42318]' : 'text-[#067647]'
            }`}
          >
            {isRefund ? '-' : ''}
            <Money amount={p.amount} />
          </span>
        );
      },
    },
  ];

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, page, pageSize]);

  return (
    <div className="space-y-4 pb-8">
      <PageHeader
        title="Payments"
        scopeLabel={activeProperty ? activeProperty.name : `All properties · ${data.properties.length}`}
        subtitle="Complete ledger of payments, refunds, and receipts"
      />

      {/* Shared Tab Header */}
      <UnderlineTabs
        tabs={paymentTabs}
        activeId="payments"
        onChange={(id) => {
          if (id === 'outstanding') navigate('/app/outstanding');
        }}
      />

      {/* Summary KPI Strip */}
      <StatStrip>
        <StatCell
          label="NET RECORDED PAYMENTS"
          value={<Money amount={totalCollected - totalRefunded} />}
          caption={`${scopedPayments.length} transactions across workspace`}
        />
        <StatCell
          label="GROSS COLLECTED"
          value={<Money amount={totalCollected} />}
          caption="Positive payment entries"
        />
        <StatCell
          label="REFUNDS PROCESSED"
          value={<Money amount={totalRefunded} />}
          caption="Returned deposits & adjustments"
        />
        <StatCell
          label="TRANSACTION COUNT"
          value={<span>{scopedPayments.length}</span>}
          caption="Ledger payment records"
        />
      </StatStrip>

      {/* Search Filter */}
      <FilterBar>
        <SearchField
          value={search}
          onChangeValue={setSearch}
          placeholder="Search receipt #, booking #, guest name, or ref..."
          className="min-w-[280px]"
        />
      </FilterBar>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(p) => p.id}
        page={page}
        pageSize={pageSize}
        totalItems={filteredPayments.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        emptyState={
          <EmptyState
            title="No payments found"
            description={search ? `No receipts matching "${search}".` : 'No payments recorded yet.'}
          />
        }
      />
    </div>
  );
}
