import React, { useEffect, useState, useMemo } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { repository } from '../../lib/repository';
import { Booking, Customer, Property, Payment } from '../../lib/repository/types';
import { AppContextType } from '../../components/layout/AppShell';
import { Plus, Download } from 'lucide-react';

import BookingMetricsBar from './components/BookingMetricsBar';
import BookingToolbar from './components/BookingToolbar';
import BookingTableView from './components/BookingTableView';
import HotelCalendarView from './components/HotelCalendarView';
import BookingAnalyticsView from './components/BookingAnalyticsView';

export default function BookingsList() {
  const { propertyFilter } = useOutletContext<AppContextType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & View State
  const initialView = (searchParams.get('view') as 'list' | 'calendar' | 'analytics') || 'list';
  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'analytics'>(initialView);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Sync activeView with searchParams
  const handleViewChange = (view: 'list' | 'calendar' | 'analytics') => {
    setActiveView(view);
    setSearchParams((prev) => {
      prev.set('view', view);
      return prev;
    });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [bRes, cRes, pRes, payRes] = await Promise.all([
          repository.getBookings(propertyFilter || undefined),
          repository.getCustomers(),
          repository.getProperties(),
          repository.getAllPayments(propertyFilter || undefined),
        ]);

        const custMap = cRes.reduce<Record<string, Customer>>((acc, c) => {
          acc[c.id] = c;
          return acc;
        }, {});

        const propMap = pRes.reduce<Record<string, Property>>((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {});

        const enhanced = bRes.map((b) => ({
          ...b,
          customer: custMap[b.customer_id],
          property: propMap[b.property_id],
        }));

        setBookings(enhanced);
        setProperties(pRes.filter((p) => p.active));
        setPayments(payRes);
      } catch (err) {
        console.error('Failed to load bookings data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertyFilter]);

  // Pre-calculate payments by booking ID
  const paymentsByBooking = useMemo(() => {
    return payments.reduce<Record<string, number>>((acc, p) => {
      if (p.status === 'Completed' || p.status === 'Recorded') {
        acc[p.booking_id] = (acc[p.booking_id] || 0) + Number(p.amount);
      }
      return acc;
    }, {});
  }, [payments]);

  // Derived filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        b.booking_no.toLowerCase().includes(q) ||
        b.customer?.name?.toLowerCase().includes(q) ||
        b.customer?.phone?.includes(q) ||
        b.room_number?.toLowerCase().includes(q) ||
        b.room_type?.toLowerCase().includes(q) ||
        b.property?.name?.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || b.booking_status === statusFilter;
      const matchesPayment = !paymentFilter || b.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const inHouseCount = bookings.filter((b) => b.check_in <= todayStr && b.check_out >= todayStr && b.booking_status === 'Checked In').length;
  const arrivalsTodayCount = bookings.filter((b) => b.check_in === todayStr).length;
  const departuresTodayCount = bookings.filter((b) => b.check_out === todayStr).length;

  const totalBookingValue = bookings.reduce((sum, b) => sum + Number(b.grand_total), 0);
  const totalPaid = payments
    .filter((p) => p.status === 'Completed' || p.status === 'Recorded')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const outstandingBalance = Math.max(0, totalBookingValue - totalPaid);

  const hasActiveFilters = Boolean(search || statusFilter || paymentFilter);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPaymentFilter('');
  };

  const handleExportCSV = () => {
    const headers = ['Booking No,Guest Name,Property,Check In,Check Out,Nights,Room Type,Room No,Grand Total,Payment Status,Status\n'];
    const rows = filteredBookings.map((b) =>
      `"${b.booking_no}","${b.customer?.name || ''}","${b.property?.name || ''}","${b.check_in}","${b.check_out}",${b.nights},"${b.room_type}","${b.room_number || ''}",${b.grand_total},"${b.payment_status}","${b.booking_status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-10 bg-slate-200 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white border border-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-white border border-slate-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {propertyFilter
              ? 'Manage room reservations, check-ins, and unit folios for the selected property.'
              : 'Master reservation workspace across all properties in your portfolio.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/app/bookings/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary Metrics Bar */}
      <BookingMetricsBar
        totalCount={bookings.length}
        inHouseCount={inHouseCount}
        arrivalsTodayCount={arrivalsTodayCount}
        departuresTodayCount={departuresTodayCount}
        outstandingBalance={outstandingBalance}
      />

      {/* 3. Toolbar (Search, View Switcher: List/Calendar/Analytics, Filters) */}
      <BookingToolbar
        searchTerm={search}
        onSearchChange={setSearch}
        activeView={activeView}
        onViewChange={handleViewChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        onExport={handleExportCSV}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Active View Content */}
      {activeView === 'list' && (
        <BookingTableView
          bookings={filteredBookings}
          paymentsByBooking={paymentsByBooking}
        />
      )}

      {activeView === 'calendar' && (
        <HotelCalendarView
          bookings={bookings}
          properties={properties}
          selectedPropertyId={propertyFilter || undefined}
        />
      )}

      {activeView === 'analytics' && (
        <BookingAnalyticsView bookings={bookings} />
      )}
    </div>
  );
}
