import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Property,
  Unit,
  UnitBlock,
  Customer,
  Booking,
  Payment,
  BusinessSettings,
  IRepository
} from '../lib/repository/types';
import { getRepository } from '../lib/repository';
import { useAuth } from './AuthContext';
import { calculateBookingPaymentSummary } from '../lib/utils/financials';
import {
  todayISO,
  isBookingOverlapping,
  outstandingSummary,
  attentionItems,
  occupancySnapshot,
  occupancySeries,
  propertyRollups,
  collectionsByDay,
  paymentMix,
  guestSummaries,
  getDateRange,
  stayLengthBuckets,
  cancellationRate,
  stage
} from '../lib/analytics';

export interface WorkspaceData {
  properties: Property[];
  units: Unit[];
  unit_blocks: UnitBlock[];
  customers: Customer[];
  bookings: Booking[];
  payments: Payment[];
  settings: BusinessSettings;
}

export interface WorkspaceContextType {
  data: WorkspaceData;
  status: 'loading' | 'ready' | 'error';
  error: Error | null;
  lastUpdated: Date;
  refetch: () => Promise<void>;
  propertyFilter: string; // '' = all, or property_id
  setPropertyFilter: (id: string) => void;
  activeProperty: Property | null;
  isDemoMode: boolean;
  // Domain actions
  checkIn: (bookingId: string) => Promise<void>;
  checkOut: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled') => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'created_at'>) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
  addPayment: (paymentData: Omit<Payment, 'id' | 'created_at'>) => Promise<Payment>;
  createUnit: (unitData: Omit<Unit, 'id' | 'created_at'>) => Promise<Unit>;
  updateUnit: (id: string, updates: Partial<Unit>) => Promise<Unit>;
  createUnitBlock: (blockData: Omit<UnitBlock, 'id' | 'created_at'>) => Promise<UnitBlock>;
  deleteUnitBlock: (id: string) => Promise<void>;
  createCustomer: (customerData: Omit<Customer, 'id' | 'created_at'>) => Promise<Customer>;
  resetDemoData: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const initialData: WorkspaceData = {
  properties: [],
  units: [],
  unit_blocks: [],
  customers: [],
  bookings: [],
  payments: [],
  settings: { name: '', legalName: '', gstin: '' }
};

export function WorkspaceDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<WorkspaceData>(initialData);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [searchParams, setSearchParams] = useSearchParams();
  const urlProp = searchParams.get('property') || '';

  const [propertyFilter, setPropertyFilterState] = useState<string>(() => {
    return urlProp || (typeof window !== 'undefined' ? localStorage.getItem('mytrackyo_prop_scope') || '' : '');
  });

  const isAppwriteUser = !!(user && !user.isDemo);
  const repo: IRepository = useMemo(() => getRepository(isAppwriteUser), [isAppwriteUser]);
  const isDemoMode = !isAppwriteUser;

  const setPropertyFilter = useCallback((id: string) => {
    setPropertyFilterState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mytrackyo_prop_scope', id);
    }
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (id) {
        next.set('property', id);
      } else {
        next.delete('property');
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Sync if URL search param changes
  useEffect(() => {
    if (urlProp !== propertyFilter) {
      setPropertyFilterState(urlProp);
    }
  }, [urlProp]);

  const loadAll = useCallback(async () => {
    try {
      setStatus(prev => (prev === 'ready' ? 'ready' : 'loading'));
      const [properties, units, unit_blocks, customers, bookings, payments, settings] = await Promise.all([
        repo.getProperties(),
        repo.getUnits(),
        repo.getUnitBlocks(),
        repo.getCustomers(),
        repo.getBookings(),
        repo.getAllPayments(),
        repo.getSettings()
      ]);

      // Populate joined customer and property references onto bookings for easy display
      const custMap = new Map(customers.map(c => [c.id, c]));
      const propMap = new Map(properties.map(p => [p.id, p]));
      const unitMap = new Map(units.map(u => [u.id, u]));

      const enrichedBookings = bookings.map(b => ({
        ...b,
        customer: custMap.get(b.customer_id) || b.customer,
        property: propMap.get(b.property_id) || b.property,
        unit: b.unit_id ? unitMap.get(b.unit_id) || b.unit : b.unit
      }));

      setData({
        properties,
        units,
        unit_blocks,
        customers,
        bookings: enrichedBookings,
        payments,
        settings
      });
      setLastUpdated(new Date());
      setStatus('ready');
      setError(null);
    } catch (err: unknown) {
      console.error('Failed to load workspace data', err);
      setError(err instanceof Error ? err : new Error('Failed to load workspace data'));
      setStatus('error');
    }
  }, [repo]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Active property object
  const activeProperty = useMemo(() => {
    if (!propertyFilter) return null;
    return data.properties.find(p => p.id === propertyFilter) || null;
  }, [propertyFilter, data.properties]);

  // Mutations
  const updateBookingStatus = useCallback(async (
    bookingId: string,
    nextStatus: 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled'
  ) => {
    // Optimistic
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, booking_status: nextStatus } : b)
    }));
    try {
      await repo.updateBooking(bookingId, { booking_status: nextStatus });
    } catch (err) {
      loadAll();
      throw err;
    }
  }, [repo, loadAll]);

  const checkIn = useCallback(async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'Checked In');
  }, [updateBookingStatus]);

  const checkOut = useCallback(async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'Completed');
  }, [updateBookingStatus]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    return updateBookingStatus(bookingId, 'Cancelled');
  }, [updateBookingStatus]);

  const createBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'created_at'>) => {
    // Conflict check
    if (bookingData.unit_id) {
      const check = isBookingOverlapping(
        data.bookings,
        data.unit_blocks,
        bookingData.unit_id,
        bookingData.check_in,
        bookingData.check_out
      );
      if (check.hasConflict) {
        throw new Error(check.message || 'Room is not available for these dates.');
      }
    }

    const created = await repo.createBooking(bookingData);
    await loadAll();
    return created;
  }, [data.bookings, data.unit_blocks, repo, loadAll]);

  const updateBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
    const existing = data.bookings.find(b => b.id === id);
    if (!existing) throw new Error('Booking not found');

    const unitId = updates.unit_id ?? existing.unit_id;
    const checkInDate = updates.check_in ?? existing.check_in;
    const checkOutDate = updates.check_out ?? existing.check_out;

    if (unitId && (updates.unit_id || updates.check_in || updates.check_out)) {
      const check = isBookingOverlapping(
        data.bookings,
        data.unit_blocks,
        unitId,
        checkInDate,
        checkOutDate,
        id
      );
      if (check.hasConflict) {
        throw new Error(check.message || 'Room conflict detected for updated dates.');
      }
    }

    const updated = await repo.updateBooking(id, updates);
    await loadAll();
    return updated;
  }, [data.bookings, data.unit_blocks, repo, loadAll]);

  const addPayment = useCallback(async (paymentData: Omit<Payment, 'id' | 'created_at'>) => {
    const createdPayment = await repo.createPayment(paymentData);
    // Recompute booking payment status
    const targetBooking = data.bookings.find(b => b.id === paymentData.booking_id);
    if (targetBooking) {
      const bookingPayments = [...data.payments.filter(p => p.booking_id === targetBooking.id), createdPayment];
      const summary = calculateBookingPaymentSummary(targetBooking, bookingPayments);
      await repo.updateBooking(targetBooking.id, { payment_status: summary.paymentStatus });
    }
    await loadAll();
    return createdPayment;
  }, [data.bookings, data.payments, repo, loadAll]);

  const createUnit = useCallback(async (unitData: Omit<Unit, 'id' | 'created_at'>) => {
    const created = await repo.createUnit(unitData);
    await loadAll();
    return created;
  }, [repo, loadAll]);

  const updateUnit = useCallback(async (id: string, updates: Partial<Unit>) => {
    const updated = await repo.updateUnit(id, updates);
    await loadAll();
    return updated;
  }, [repo, loadAll]);

  const createUnitBlock = useCallback(async (blockData: Omit<UnitBlock, 'id' | 'created_at'>) => {
    const created = await repo.createUnitBlock(blockData);
    await loadAll();
    return created;
  }, [repo, loadAll]);

  const deleteUnitBlock = useCallback(async (id: string) => {
    await repo.deleteUnitBlock(id);
    await loadAll();
  }, [repo, loadAll]);

  const createCustomer = useCallback(async (custData: Omit<Customer, 'id' | 'created_at'>) => {
    const created = await repo.createCustomer(custData);
    await loadAll();
    return created;
  }, [repo, loadAll]);

  const resetDemoData = useCallback(async () => {
    await repo.resetDemoData();
    await loadAll();
  }, [repo, loadAll]);

  const contextValue: WorkspaceContextType = {
    data,
    status,
    error,
    lastUpdated,
    refetch: loadAll,
    propertyFilter,
    setPropertyFilter,
    activeProperty,
    isDemoMode,
    checkIn,
    checkOut,
    cancelBooking,
    updateBookingStatus,
    createBooking,
    updateBooking,
    addPayment,
    createUnit,
    updateUnit,
    createUnitBlock,
    deleteUnitBlock,
    createCustomer,
    resetDemoData
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceData(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceData must be used within a WorkspaceDataProvider');
  }
  return context;
}

export function usePropertyScope() {
  const { propertyFilter, setPropertyFilter, activeProperty, data } = useWorkspaceData();
  return {
    propertyFilter,
    setPropertyFilter,
    activeProperty,
    properties: data.properties,
    scopeLabel: activeProperty ? activeProperty.name : `All properties · ${data.properties.length}`
  };
}

// Selectors for Dashboard
export function useDashboardModel() {
  const { data, propertyFilter, activeProperty, lastUpdated, refetch, checkIn, checkOut } = useWorkspaceData();
  const today = todayISO();

  return useMemo(() => {
    // Filter scoped data
    const scopedProperties = propertyFilter ? data.properties.filter(p => p.id === propertyFilter) : data.properties;
    const scopedUnits = propertyFilter ? data.units.filter(u => u.property_id === propertyFilter) : data.units;
    const scopedBlocks = propertyFilter ? data.unit_blocks.filter(b => b.property_id === propertyFilter) : data.unit_blocks;
    const scopedBookings = propertyFilter ? data.bookings.filter(b => b.property_id === propertyFilter) : data.bookings;
    const scopedPayments = propertyFilter
      ? data.payments.filter(p => {
          const b = data.bookings.find(bk => bk.id === p.booking_id);
          return b && b.property_id === propertyFilter;
        })
      : data.payments;

    // Occupancy today
    const occupancyNow = occupancySnapshot(scopedUnits, scopedBlocks, scopedBookings, today);

    // Arrivals today
    const arrivals = scopedBookings.filter(b => b.booking_status !== 'Cancelled' && b.check_in === today);
    const arrivalsPending = arrivals.filter(b => b.booking_status === 'Confirmed');

    // Departures today
    const departures = scopedBookings.filter(b => b.booking_status !== 'Cancelled' && b.check_out === today);
    const departuresPending = departures.filter(b => b.booking_status === 'Checked In');

    // Outstanding summary
    const dues = outstandingSummary(scopedBookings, scopedPayments);

    // Departing with balances
    let departingBalanceTotal = 0;
    for (const d of departures) {
      departingBalanceTotal += dues.balancesByBookingId[d.id]?.balanceDue || 0;
    }

    // In-house stays
    const inHouse = scopedBookings.filter(
      b => b.booking_status === 'Checked In' && b.check_in <= today && b.check_out >= today
    );
    const inHouseGuests = inHouse.reduce((acc, curr) => acc + (curr.guests || 1), 0);

    // Attention items
    const attention = attentionItems(today, scopedProperties, scopedUnits, scopedBlocks, scopedBookings, scopedPayments);

    // 14-day occupancy series
    const occupancyTrend = occupancySeries(scopedUnits, scopedBlocks, scopedBookings, today, 14, today);

    // Money panel (This month)
    const monthRange = getDateRange('thisMonth', undefined, undefined, today);
    const monthPayments = scopedPayments.filter(
      p => (p.status === 'Recorded' || p.status === 'Completed') && p.date >= monthRange.startDate && p.date <= monthRange.endDate
    );
    const collectedThisMonth = monthPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const prevMonthPayments = monthRange.comparisonStart && monthRange.comparisonEnd
      ? scopedPayments.filter(
          p => (p.status === 'Recorded' || p.status === 'Completed') &&
               p.date >= monthRange.comparisonStart! && p.date <= monthRange.comparisonEnd!
        )
      : [];
    const collectedPrevMonth = prevMonthPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Booked value this month
    const bookedThisMonth = scopedBookings
      .filter(b => b.booking_status !== 'Cancelled' && b.check_in >= monthRange.startDate && b.check_in <= monthRange.endDate)
      .reduce((acc, curr) => acc + (Number(curr.grand_total) || 0), 0);

    const collectionsChart = collectionsByDay(scopedPayments, monthRange.startDate, monthRange.endDate);

    // Multi-property rollup (when All properties)
    const rollups = !propertyFilter && data.properties.length > 1
      ? propertyRollups(data.properties, data.units, data.unit_blocks, data.bookings, data.payments, today)
      : [];

    return {
      today,
      lastUpdated,
      refetch,
      checkIn,
      checkOut,
      activeProperty,
      scopeIsAll: !propertyFilter,
      totalPropertiesCount: data.properties.length,
      occupancyNow,
      arrivals,
      arrivalsPendingCount: arrivalsPending.length,
      departures,
      departuresPendingCount: departuresPending.length,
      departingBalanceTotal,
      inHouse,
      inHouseGuests,
      attention,
      occupancyTrend,
      money: {
        collectedThisMonth,
        collectedPrevMonth,
        bookedThisMonth,
        totalOutstanding: dues.totalOutstanding,
        bookingsWithBalanceCount: dues.bookingsWithBalanceCount,
        collectionsChart
      },
      rollups,
      balancesByBookingId: dues.balancesByBookingId
    };
  }, [data, propertyFilter, activeProperty, today, lastUpdated, refetch, checkIn, checkOut]);
}

// Selectors for Bookings
export function useBookingsModel() {
  const { data, propertyFilter, activeProperty, checkIn, checkOut, cancelBooking, updateBooking } = useWorkspaceData();
  const today = todayISO();

  return useMemo(() => {
    const scopedBookings = propertyFilter ? data.bookings.filter(b => b.property_id === propertyFilter) : data.bookings;
    const scopedPayments = propertyFilter
      ? data.payments.filter(p => {
          const b = data.bookings.find(bk => bk.id === p.booking_id);
          return b && b.property_id === propertyFilter;
        })
      : data.payments;
    const scopedUnits = propertyFilter ? data.units.filter(u => u.property_id === propertyFilter) : data.units;
    const scopedBlocks = propertyFilter ? data.unit_blocks.filter(b => b.property_id === propertyFilter) : data.unit_blocks;

    const dues = outstandingSummary(scopedBookings, scopedPayments);

    let arrivingTodayCount = 0;
    let inHouseCount = 0;
    let departingTodayCount = 0;

    for (const b of scopedBookings) {
      if (b.booking_status === 'Cancelled') continue;
      const st = stage(b, today);
      if (st === 'arriving') arrivingTodayCount++;
      if (st === 'inHouse') inHouseCount++;
      if (st === 'departing') departingTodayCount++;
    }

    return {
      today,
      activeProperty,
      scopeIsAll: !propertyFilter,
      bookings: scopedBookings,
      units: scopedUnits,
      blocks: scopedBlocks,
      payments: scopedPayments,
      properties: data.properties,
      balancesByBookingId: dues.balancesByBookingId,
      stats: {
        arrivingTodayCount,
        inHouseCount,
        departingTodayCount,
        totalOutstanding: dues.totalOutstanding,
        balanceBookingsCount: dues.bookingsWithBalanceCount
      },
      checkIn,
      checkOut,
      cancelBooking,
      updateBooking
    };
  }, [data, propertyFilter, activeProperty, today, checkIn, checkOut, cancelBooking, updateBooking]);
}

// Selectors for Guests
export function useGuestsModel() {
  const { data, propertyFilter, activeProperty } = useWorkspaceData();
  const today = todayISO();

  return useMemo(() => {
    // If scoped to a property, filter customers who have had bookings at this property
    let relevantBookings = data.bookings;
    let relevantCustomers = data.customers;

    if (propertyFilter) {
      relevantBookings = data.bookings.filter(b => b.property_id === propertyFilter);
      const custIds = new Set(relevantBookings.map(b => b.customer_id));
      relevantCustomers = data.customers.filter(c => custIds.has(c.id));
    }

    const summaries = guestSummaries(relevantBookings, data.payments, relevantCustomers, today);

    return {
      today,
      activeProperty,
      scopeIsAll: !propertyFilter,
      summaries,
      properties: data.properties,
      bookings: data.bookings
    };
  }, [data, propertyFilter, activeProperty, today]);
}

// Selectors for Reports
export function useReportsModel(preset: 'thisMonth' | 'lastMonth' | 'last30' | 'thisQuarter' | 'allTime' | 'custom' = 'thisMonth', customStart?: string, customEnd?: string) {
  const { data, propertyFilter, activeProperty } = useWorkspaceData();
  const today = todayISO();

  return useMemo(() => {
    const range = getDateRange(preset, customStart, customEnd, today);

    const scopedProperties = propertyFilter ? data.properties.filter(p => p.id === propertyFilter) : data.properties;
    const scopedUnits = propertyFilter ? data.units.filter(u => u.property_id === propertyFilter) : data.units;
    const scopedBlocks = propertyFilter ? data.unit_blocks.filter(b => b.property_id === propertyFilter) : data.unit_blocks;
    const scopedBookings = propertyFilter ? data.bookings.filter(b => b.property_id === propertyFilter) : data.bookings;
    const scopedPayments = propertyFilter
      ? data.payments.filter(p => {
          const b = data.bookings.find(bk => bk.id === p.booking_id);
          return b && b.property_id === propertyFilter;
        })
      : data.payments;

    // Payments in range
    let collectedInRange = 0;
    let refundedInRange = 0;
    const paymentsInRange: Payment[] = [];

    for (const p of scopedPayments) {
      if (p.date >= range.startDate && p.date <= range.endDate) {
        paymentsInRange.push(p);
        if (p.status === 'Recorded' || p.status === 'Completed') {
          collectedInRange += Number(p.amount) || 0;
        } else if (p.status === 'Refunded') {
          refundedInRange += Number(p.amount) || 0;
        }
      }
    }
    const netCollected = collectedInRange - refundedInRange;

    // Previous period collections if comparison exists
    let compCollected = 0;
    if (range.comparisonStart && range.comparisonEnd) {
      for (const p of scopedPayments) {
        if (p.date >= range.comparisonStart && p.date <= range.comparisonEnd) {
          if (p.status === 'Recorded' || p.status === 'Completed') {
            compCollected += Number(p.amount) || 0;
          }
        }
      }
    }

    // Booked value in range (check_in in range, non-cancelled)
    const bookingsInRange = scopedBookings.filter(
      b => b.booking_status !== 'Cancelled' && b.check_in >= range.startDate && b.check_in <= range.endDate
    );
    const bookedValue = bookingsInRange.reduce((acc, curr) => acc + (Number(curr.grand_total) || 0), 0);
    const avgBookingValue = bookingsInRange.length > 0 ? Math.round(bookedValue / bookingsInRange.length) : 0;
    const avgStayNights = bookingsInRange.length > 0
      ? Number((bookingsInRange.reduce((acc, curr) => acc + (curr.nights || 1), 0) / bookingsInRange.length).toFixed(1))
      : 0;

    // Outstanding as of today for bookings with check_in <= range.endDate
    const dues = outstandingSummary(scopedBookings, scopedPayments);
    let outstandingInRange = 0;
    const topDebtors: { booking: Booking; balanceDue: number; daysPastCheckout: number }[] = [];

    for (const b of scopedBookings) {
      if (b.booking_status === 'Cancelled') continue;
      if (b.check_in <= range.endDate) {
        const bal = dues.balancesByBookingId[b.id]?.balanceDue || 0;
        if (bal > 0) {
          outstandingInRange += bal;
          // Days past checkout calculation
          const checkOutMs = new Date(b.check_out).getTime();
          const todayMs = new Date(today).getTime();
          const diffDays = Math.floor((todayMs - checkOutMs) / (1000 * 3600 * 24));
          topDebtors.push({
            booking: b,
            balanceDue: bal,
            daysPastCheckout: diffDays
          });
        }
      }
    }

    topDebtors.sort((a, b) => b.balanceDue - a.balanceDue);

    // Collections trend by day
    const collectionsTrend = collectionsByDay(scopedPayments, range.startDate, range.endDate);

    // Payment mix
    const mix = paymentMix(scopedPayments, range.startDate, range.endDate);

    // Stay length distribution
    const stayBuckets = stayLengthBuckets(bookingsInRange);

    // Cancellation rate
    const canc = cancellationRate(
      scopedBookings.filter(b => b.check_in >= range.startDate && b.check_in <= range.endDate)
    );

    // Rollups by property
    const rollups = propertyRollups(scopedProperties, scopedUnits, scopedBlocks, scopedBookings, scopedPayments, today);

    return {
      range,
      today,
      activeProperty,
      scopeIsAll: !propertyFilter,
      summary: {
        bookedValue,
        collected: collectedInRange,
        refunded: refundedInRange,
        netCollected,
        outstanding: outstandingInRange,
        bookingsCount: bookingsInRange.length,
        avgBookingValue,
        avgStayNights,
        compCollected,
        hasCompData: compCollected > 0
      },
      collectionsTrend,
      mix,
      topDebtors: topDebtors.slice(0, 10),
      stayBuckets,
      cancellation: canc,
      rollups,
      scopedUnitsCount: scopedUnits.length
    };
  }, [data, propertyFilter, activeProperty, today, preset, customStart, customEnd]);
}
