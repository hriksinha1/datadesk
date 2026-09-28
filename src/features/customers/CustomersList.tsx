import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Plus, User } from 'lucide-react';
import { useGuestsModel } from '../../context/WorkspaceDataContext';
import { GuestSummary } from '../../lib/analytics';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SearchField, Select, FilterBar } from '../../components/ui/FormControls';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Money, DateText } from '../../components/ui/Typography';
import { EmptyState } from '../../components/ui/StateFeedback';
import { GuestDrawer } from './GuestDrawer';

export default function CustomersList() {
  const navigate = useNavigate();
  const guestsModel = useGuestsModel();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const guestIdParam = searchParams.get('guest') || '';
  const search = searchParams.get('q') || '';
  const segment = searchParams.get('segment') || 'all';
  const sortKey = searchParams.get('sort') || 'last_stay';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [pageSize, setPageSize] = useState(25);

  const updateParam = (key: string, val: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (val) next.set(key, val);
        else next.delete(key);
        if (key !== 'page') next.delete('page');
        return next;
      },
      { replace: true }
    );
  };

  const handleClearFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        if (prev.get('property')) next.set('property', prev.get('property')!);
        return next;
      },
      { replace: true }
    );
  };

  // Filter summaries
  const filteredSummaries = useMemo(() => {
    return guestsModel.summaries.filter((s) => {
      // 1. Search (name, phone, email)
      if (search) {
        const q = search.toLowerCase();
        const name = (s.customer.name || '').toLowerCase();
        const phone = (s.customer.phone || '').toLowerCase();
        const email = (s.customer.email || '').toLowerCase();
        if (!name.includes(q) && !phone.includes(q) && !email.includes(q)) {
          return false;
        }
      }

      // 2. Segment chips: All · In house · Upcoming · Has balance · Returning (2+ stays)
      if (segment === 'inHouse') {
        if (s.status !== 'In house') return false;
      } else if (segment === 'upcoming') {
        if (s.status !== 'Upcoming') return false;
      } else if (segment === 'hasBalance') {
        if (s.outstandingBalance <= 0) return false;
      } else if (segment === 'returning') {
        if (s.staysCount < 2) return false;
      }

      return true;
    });
  }, [guestsModel.summaries, search, segment]);

  // Sort summaries
  const sortedSummaries = useMemo(() => {
    const list = [...filteredSummaries];
    if (sortKey === 'name') {
      list.sort((a, b) => a.customer.name.localeCompare(b.customer.name));
    } else if (sortKey === 'ltv') {
      list.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
    } else if (sortKey === 'balance') {
      list.sort((a, b) => b.outstandingBalance - a.outstandingBalance);
    } else {
      // Default: Last stay (most recent checkout first)
      list.sort((a, b) => {
        const dateA = a.lastCompletedStay?.check_out || a.currentStay?.check_out || '';
        const dateB = b.lastCompletedStay?.check_out || b.currentStay?.check_out || '';
        return dateB.localeCompare(dateA);
      });
    }
    return list;
  }, [filteredSummaries, sortKey]);

  // Pagination slice
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedSummaries.slice(start, start + pageSize);
  }, [sortedSummaries, page, pageSize]);

  // Selected guest for drawer
  const activeGuestSummary = useMemo(() => {
    if (!guestIdParam) return null;
    return guestsModel.summaries.find((s) => s.customer.id === guestIdParam) || null;
  }, [guestIdParam, guestsModel.summaries]);

  // Columns definition
  const columns: Column<GuestSummary>[] = [
    // 1. Guest
    {
      key: 'name',
      header: 'Guest',
      sortable: true,
      width: '32%',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#EAF4F1] text-[#0D5C4D] flex items-center justify-center font-medium text-xs shrink-0 select-none">
            {s.customer.name ? s.customer.name.slice(0, 2).toUpperCase() : 'G'}
          </div>
          <div className="min-w-0">
            <Link
              to={`/app/customers?guest=${s.customer.id}`}
              className="font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline block truncate"
            >
              {s.customer.name}
            </Link>
            <div className="text-xs text-[#64748B] mt-0.5">{s.customer.phone || '—'}</div>
          </div>
        </div>
      ),
    },

    // 2. Status
    {
      key: 'status',
      header: 'Status',
      width: '16%',
      render: (s) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[4px] whitespace-nowrap ${
            s.status === 'In house'
              ? 'bg-[#EAF4F1] text-[#0D5C4D]'
              : s.status === 'Upcoming'
              ? 'bg-[#EFF4FF] text-[#1D4ED8]'
              : s.status === 'Past'
              ? 'bg-[#F7F8FA] text-[#64748B]'
              : 'bg-white border text-[#334155]'
          }`}
        >
          {s.status}
        </span>
      ),
    },

    // 3. Stays
    {
      key: 'stays',
      header: 'Stays',
      align: 'center',
      width: '12%',
      render: (s) => (
        <span className="tabular-nums font-medium text-[#0E1726]">
          {s.staysCount}
        </span>
      ),
    },

    // 4. Last Stay Date
    {
      key: 'last_stay',
      header: 'Last stay',
      sortable: true,
      width: '18%',
      render: (s) => {
        const lastStay = s.lastCompletedStay || s.currentStay;
        if (!lastStay) return <span className="text-[#64748B]">—</span>;
        return <DateText date={lastStay.check_out} format="medium" />;
      },
    },

    // 5. Lifetime Value
    {
      key: 'ltv',
      header: 'Lifetime value',
      align: 'right',
      sortable: true,
      width: '14%',
      render: (s) => (
        <span className="font-semibold text-[#0E1726] tabular-nums">
          <Money amount={s.lifetimeValue} />
        </span>
      ),
    },

    // 6. Balance Due
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      sortable: true,
      width: '14%',
      render: (s) => {
        if (s.outstandingBalance <= 0) {
          return <span className="text-[#64748B] text-xs">—</span>;
        }
        return (
          <span className="font-semibold text-[#B45309] text-xs tabular-nums">
            <Money amount={s.outstandingBalance} /> due
          </span>
        );
      },
    },

    // 7. Chevron Link
    {
      key: 'chevron',
      header: '',
      align: 'right',
      width: '4%',
      render: (s) => (
        <Link
          to={`/app/customers?guest=${s.customer.id}`}
          className="p-1 text-[#94A3B8] hover:text-[#0E1726] transition-colors"
          aria-label={`Open ${s.customer.name}`}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  // Mobile card view
  const renderMobileCard = (s: GuestSummary) => (
    <Link to={`/app/customers?guest=${s.customer.id}`} className="block space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm text-[#0E1726]">{s.customer.name}</div>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-[4px] font-medium ${
            s.status === 'In house'
              ? 'bg-[#EAF4F1] text-[#0D5C4D]'
              : s.status === 'Upcoming'
              ? 'bg-[#EFF4FF] text-[#1D4ED8]'
              : 'bg-[#F7F8FA] text-[#64748B]'
          }`}
        >
          {s.status}
        </span>
      </div>

      <div className="text-xs text-[#64748B] flex justify-between">
        <span>{s.customer.phone || 'No phone'}</span>
        <span>{s.staysCount} {s.staysCount === 1 ? 'stay' : 'stays'}</span>
      </div>

      <div className="flex justify-between items-center pt-1 border-t border-[#E4E7EC] text-xs">
        <span className="font-semibold text-[#0E1726]">
          LTV: <Money amount={s.lifetimeValue} />
        </span>
        {s.outstandingBalance > 0 && (
          <span className="text-[#B45309] font-medium">
            <Money amount={s.outstandingBalance} /> due
          </span>
        )}
      </div>
    </Link>
  );

  const hasFilters = Boolean(search || segment !== 'all');

  const emptyState = hasFilters ? (
    <EmptyState
      title="No guests match these filters"
      description={`No guest records found matching "${search}".`}
      action={{ label: 'Clear filters', onClick: handleClearFilters }}
    />
  ) : (
    <EmptyState
      title="No guests recorded yet"
      description="Guests automatically appear in this directory when you create reservations."
      action={{ label: 'Create a booking', onClick: () => navigate('/app/bookings/new') }}
    />
  );

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Guests"
        scopeLabel={
          guestsModel.activeProperty
            ? guestsModel.activeProperty.name
            : `All properties · ${guestsModel.properties.length}`
        }
        subtitle={
          guestsModel.activeProperty
            ? `Guests who have stayed at ${guestsModel.activeProperty.name}`
            : 'People who have stayed or booked reservations across your properties'
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

      {/* 2. Filter Bar */}
      <FilterBar>
        <SearchField
          value={search}
          onChangeValue={(val) => updateParam('q', val)}
          placeholder="Search guest by name, phone or email..."
          className="min-w-[260px]"
        />

        {/* Segment Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All guests' },
            { id: 'inHouse', label: 'In house' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'hasBalance', label: 'Has balance' },
            { id: 'returning', label: 'Returning (2+)' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => updateParam('segment', chip.id === 'all' ? '' : chip.id)}
              className={`px-2.5 py-1 text-xs rounded-[6px] font-medium transition-colors cursor-pointer whitespace-nowrap select-none ${
                (segment === chip.id || (chip.id === 'all' && segment === 'all'))
                  ? 'bg-[#0D5C4D] text-white'
                  : 'bg-[#F7F8FA] text-[#64748B] hover:text-[#0E1726] border border-[#E4E7EC]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="ml-auto">
          <Select
            value={sortKey}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort guest directory"
          >
            <option value="last_stay">Sort: Last stay</option>
            <option value="name">Sort: Name (A–Z)</option>
            <option value="ltv">Sort: Lifetime value</option>
            <option value="balance">Sort: Balance due</option>
          </Select>
        </div>
      </FilterBar>

      {/* 3. Guests Table */}
      <DataTable
        columns={columns}
        data={paginated}
        keyExtractor={(s) => s.customer.id}
        sortKey={sortKey}
        sortOrder="desc"
        page={page}
        pageSize={pageSize}
        totalItems={sortedSummaries.length}
        onPageChange={(p) => updateParam('page', String(p))}
        onPageSizeChange={(sz) => setPageSize(sz)}
        renderMobileCard={renderMobileCard}
        emptyState={emptyState}
      />

      {/* 4. Guest Drawer Details */}
      {activeGuestSummary && (
        <GuestDrawer
          summary={activeGuestSummary}
          onClose={() => updateParam('guest', '')}
          allBookings={guestsModel.bookings}
          properties={guestsModel.properties}
        />
      )}
    </div>
  );
}
