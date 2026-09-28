import { Booking, Payment, Property, Unit, UnitBlock, Customer } from '../repository/types';
import { calculateBookingPaymentSummary, BookingPaymentSummary } from '../utils/financials';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns YYYY-MM-DD for the given date in specified timezone.
 * Defaults to Asia/Kolkata.
 */
export function todayISO(tz: string = DEFAULT_TIMEZONE, date: Date = new Date()): string {
  // Use Intl.DateTimeFormat with Asia/Kolkata to extract exact year, month, day in target tz
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // en-CA outputs YYYY-MM-DD
}

export type BookingStage = 'arriving' | 'inHouse' | 'departing' | 'upcoming' | 'past' | 'cancelled';

export function stage(booking: Booking, today: string): BookingStage {
  if (booking.booking_status === 'Cancelled') {
    return 'cancelled';
  }
  if (booking.check_in === today) {
    return 'arriving';
  }
  if (booking.check_out === today) {
    return 'departing';
  }
  if (booking.check_in < today && booking.check_out > today) {
    return 'inHouse';
  }
  if (booking.check_in > today) {
    return 'upcoming';
  }
  return 'past';
}

export function bookingBalance(booking: Booking, payments: Payment[]): BookingPaymentSummary {
  const bookingPayments = payments.filter(p => p.booking_id === booking.id);
  return calculateBookingPaymentSummary(booking, bookingPayments);
}

export interface OutstandingSummary {
  totalOutstanding: number;
  bookingsWithBalanceCount: number;
  balancesByBookingId: Record<string, BookingPaymentSummary>;
}

export function outstandingSummary(bookings: Booking[], payments: Payment[]): OutstandingSummary {
  let totalOutstanding = 0;
  let count = 0;
  const balancesByBookingId: Record<string, BookingPaymentSummary> = {};

  // Group payments by booking_id
  const paymentsByBooking: Record<string, Payment[]> = {};
  for (const p of payments) {
    if (!paymentsByBooking[p.booking_id]) paymentsByBooking[p.booking_id] = [];
    paymentsByBooking[p.booking_id].push(p);
  }

  for (const b of bookings) {
    if (b.booking_status === 'Cancelled') continue;
    const summary = calculateBookingPaymentSummary(b, paymentsByBooking[b.id] || []);
    balancesByBookingId[b.id] = summary;
    if (summary.balanceDue > 0) {
      totalOutstanding += summary.balanceDue;
      count++;
    }
  }

  return {
    totalOutstanding,
    bookingsWithBalanceCount: count,
    balancesByBookingId
  };
}

export interface DayCollection {
  date: string; // YYYY-MM-DD
  amount: number;
  count: number;
}

export function collectionsByDay(payments: Payment[], startDate?: string, endDate?: string): DayCollection[] {
  const map: Record<string, { amount: number; count: number }> = {};

  for (const p of payments) {
    if (p.status !== 'Recorded' && p.status !== 'Completed') continue;
    if (startDate && p.date < startDate) continue;
    if (endDate && p.date > endDate) continue;

    if (!map[p.date]) {
      map[p.date] = { amount: 0, count: 0 };
    }
    map[p.date].amount += Number(p.amount) || 0;
    map[p.date].count += 1;
  }

  return Object.keys(map)
    .sort()
    .map(date => ({
      date,
      amount: map[date].amount,
      count: map[date].count
    }));
}

export interface OccupancySnapshot {
  totalUnits: number;
  occupied: number;
  reserved: number;
  blocked: number;
  available: number;
  occupancyPct: number | null;
}

export function occupancySnapshot(
  units: Unit[],
  blocks: UnitBlock[],
  bookings: Booking[],
  date: string
): OccupancySnapshot {
  const activeUnits = units.filter(u => u.status !== 'inactive');
  const totalUnits = activeUnits.length;

  if (totalUnits === 0) {
    return {
      totalUnits: 0,
      occupied: 0,
      reserved: 0,
      blocked: 0,
      available: 0,
      occupancyPct: null
    };
  }

  // Active blocks covering this night (start_date <= date < end_date)
  const blockedUnitIds = new Set<string>();
  for (const b of blocks) {
    if (b.start_date <= date && b.end_date > date) {
      blockedUnitIds.add(b.unit_id);
    }
  }

  let occupied = 0;
  let reserved = 0;

  for (const bk of bookings) {
    if (bk.booking_status === 'Cancelled') continue;
    // Overnights check: check_in <= date < check_out
    if (bk.check_in <= date && bk.check_out > date) {
      if (bk.booking_status === 'Checked In') {
        occupied++;
      } else {
        reserved++;
      }
    }
  }

  const blocked = blockedUnitIds.size;
  const occupiedTotal = occupied + reserved;
  const available = Math.max(0, totalUnits - blocked - occupiedTotal);
  const occupancyPct = Math.round((occupiedTotal / totalUnits) * 100);

  return {
    totalUnits,
    occupied,
    reserved,
    blocked,
    available,
    occupancyPct
  };
}

export interface OccupancyDaySeries {
  date: string;
  dayLabel: string;
  occupied: number;
  totalUnits: number;
  occupancyPct: number | null;
  isToday: boolean;
}

export function occupancySeries(
  units: Unit[],
  blocks: UnitBlock[],
  bookings: Booking[],
  startDate: string,
  days = 14,
  today = startDate
): OccupancyDaySeries[] {
  const result: OccupancyDaySeries[] = [];
  const parts = startDate.split('-').map(Number);
  const baseDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  for (let i = 0; i < days; i++) {
    const current = new Date(baseDate);
    current.setUTCDate(current.getUTCDate() + i);
    const dateStr = current.toISOString().split('T')[0];

    const snapshot = occupancySnapshot(units, blocks, bookings, dateStr);
    const dayName = current.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const dayNum = current.getUTCDate();

    result.push({
      date: dateStr,
      dayLabel: `${dayName} ${dayNum}`,
      occupied: snapshot.occupied + snapshot.reserved,
      totalUnits: snapshot.totalUnits,
      occupancyPct: snapshot.occupancyPct,
      isToday: dateStr === today
    });
  }

  return result;
}

export interface AttentionItem {
  id: string;
  severity: 'danger' | 'warning' | 'info';
  title: string;
  subtitle: string;
  actionLabel: string;
  actionType: 'payment' | 'checkin' | 'checkout' | 'view_booking' | 'conflict';
  bookingId?: string;
  propertyId?: string;
}

export function attentionItems(
  today: string,
  properties: Property[],
  units: Unit[],
  blocks: UnitBlock[],
  bookings: Booking[],
  payments: Payment[]
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const balances = outstandingSummary(bookings, payments).balancesByBookingId;
  const propsMap = new Map(properties.map(p => [p.id, p]));
  const unitMap = new Map(units.map(u => [u.id, u]));

  // 1. Conflicts detection
  const conflictList = conflicts(bookings, blocks);
  for (const c of conflictList) {
    items.push({
      id: `conflict-${c.booking1.id}-${c.booking2?.id || 'block'}`,
      severity: 'danger',
      title: `Booking conflict: Room ${c.unitNumber}`,
      subtitle: c.message,
      actionLabel: 'Resolve',
      actionType: 'conflict',
      bookingId: c.booking1.id,
      propertyId: c.booking1.property_id
    });
  }

  // 2. Departing today with balance due (danger)
  for (const b of bookings) {
    if (b.booking_status === 'Cancelled' || b.booking_status === 'Completed') continue;
    if (b.check_out === today) {
      const bal = balances[b.id]?.balanceDue || 0;
      if (bal > 0) {
        const guestName = b.customer?.name || 'Guest';
        const room = b.room_number ? `Room ${b.room_number}` : 'Unassigned';
        items.push({
          id: `dep-due-${b.id}`,
          severity: 'danger',
          title: `${guestName}, ${room}, leaves today with ₹${bal.toLocaleString('en-IN')} unpaid`,
          subtitle: `Booking ${b.booking_no} · Folio clearance required before checkout`,
          actionLabel: 'Take payment',
          actionType: 'payment',
          bookingId: b.id,
          propertyId: b.property_id
        });
      }
    }
  }

  // 3. Past check-out date but still Checked In (danger)
  for (const b of bookings) {
    if (b.booking_status === 'Checked In' && b.check_out < today) {
      const guestName = b.customer?.name || 'Guest';
      const room = b.room_number ? `Room ${b.room_number}` : 'Unassigned';
      items.push({
        id: `overstay-${b.id}`,
        severity: 'danger',
        title: `${room} was due to leave on ${b.check_out}`,
        subtitle: `${guestName} (${b.booking_no}) is still marked Checked In`,
        actionLabel: 'Check out',
        actionType: 'checkout',
        bookingId: b.id,
        propertyId: b.property_id
      });
    }
  }

  // 4. Arrivals today not checked in
  for (const b of bookings) {
    if (b.booking_status === 'Confirmed' && b.check_in === today) {
      const guestName = b.customer?.name || 'Guest';
      const prop = propsMap.get(b.property_id);
      const room = b.room_number ? `Room ${b.room_number}` : 'Unassigned room';
      items.push({
        id: `arr-pending-${b.id}`,
        severity: 'warning',
        title: `Arrival pending check-in: ${guestName} (${room})`,
        subtitle: `${prop?.name || 'Property'} · Standard check-in ${prop?.check_in_time || '14:00'}`,
        actionLabel: 'Check in',
        actionType: 'checkin',
        bookingId: b.id,
        propertyId: b.property_id
      });
    }
  }

  // 5. Arrival with no unit assigned (warning)
  for (const b of bookings) {
    if (b.booking_status === 'Confirmed' && (!b.unit_id && !b.room_number)) {
      const guestName = b.customer?.name || 'Guest';
      items.push({
        id: `no-unit-${b.id}`,
        severity: 'warning',
        title: `Unassigned unit for ${guestName}`,
        subtitle: `Check-in ${b.check_in} · ${b.room_type}`,
        actionLabel: 'Assign room',
        actionType: 'view_booking',
        bookingId: b.id,
        propertyId: b.property_id
      });
    }
  }

  // 6. In-house stays with balance due
  const inHouseWithBalances: { booking: Booking; balance: number }[] = [];
  for (const b of bookings) {
    if (b.booking_status === 'Checked In' && b.check_in <= today && b.check_out > today) {
      const bal = balances[b.id]?.balanceDue || 0;
      if (bal > 0) {
        inHouseWithBalances.push({ booking: b, balance: bal });
      }
    }
  }

  if (inHouseWithBalances.length > 3) {
    const totalBal = inHouseWithBalances.reduce((acc, curr) => acc + curr.balance, 0);
    items.push({
      id: `inhouse-balances-agg`,
      severity: 'warning',
      title: `${inHouseWithBalances.length} in-house stays have balances · ₹${totalBal.toLocaleString('en-IN')}`,
      subtitle: 'Settle folios prior to morning checkout',
      actionLabel: 'View stays',
      actionType: 'view_booking'
    });
  } else {
    for (const item of inHouseWithBalances) {
      const guestName = item.booking.customer?.name || 'Guest';
      items.push({
        id: `inhouse-due-${item.booking.id}`,
        severity: 'warning',
        title: `${guestName} has balance of ₹${item.balance.toLocaleString('en-IN')}`,
        subtitle: `Room ${item.booking.room_number || '—'} · Depart ${item.booking.check_out}`,
        actionLabel: 'Take payment',
        actionType: 'payment',
        bookingId: item.booking.id,
        propertyId: item.booking.property_id
      });
    }
  }

  return items;
}

export interface ConflictItem {
  booking1: Booking;
  booking2?: Booking;
  block?: UnitBlock;
  unitNumber: string;
  message: string;
}

export function conflicts(bookings: Booking[], blocks: UnitBlock[]): ConflictItem[] {
  const result: ConflictItem[] = [];
  const nonCancelled = bookings.filter(b => b.booking_status !== 'Cancelled');

  // Check booking vs booking overlap on same unit
  for (let i = 0; i < nonCancelled.length; i++) {
    for (let j = i + 1; j < nonCancelled.length; j++) {
      const b1 = nonCancelled[i];
      const b2 = nonCancelled[j];

      const sameUnit =
        (b1.unit_id && b2.unit_id && b1.unit_id === b2.unit_id) ||
        (b1.property_id === b2.property_id && b1.room_number && b1.room_number === b2.room_number);

      if (sameUnit) {
        // Date overlap check: b1.check_in < b2.check_out && b1.check_out > b2.check_in
        if (b1.check_in < b2.check_out && b1.check_out > b2.check_in) {
          result.push({
            booking1: b1,
            booking2: b2,
            unitNumber: b1.room_number || 'Room',
            message: `Overlapping stay between ${b1.customer?.name || b1.booking_no} and ${b2.customer?.name || b2.booking_no} (${b1.check_in} to ${b1.check_out})`
          });
        }
      }
    }
  }

  // Check booking vs maintenance block
  for (const bk of nonCancelled) {
    for (const blk of blocks) {
      if (bk.unit_id === blk.unit_id || (bk.property_id === blk.property_id && bk.room_number)) {
        if (bk.check_in < blk.end_date && bk.check_out > blk.start_date) {
          result.push({
            booking1: bk,
            block: blk,
            unitNumber: bk.room_number || 'Room',
            message: `Stay overlaps with scheduled maintenance (${blk.start_date} to ${blk.end_date}): ${blk.note || blk.reason}`
          });
        }
      }
    }
  }

  return result;
}

export function isBookingOverlapping(
  bookings: Booking[],
  blocks: UnitBlock[],
  unitId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): { hasConflict: boolean; message?: string } {
  const nonCancelled = bookings.filter(
    b => b.booking_status !== 'Cancelled' && (!excludeBookingId || b.id !== excludeBookingId)
  );

  for (const b of nonCancelled) {
    if (b.unit_id === unitId) {
      if (checkIn < b.check_out && checkOut > b.check_in) {
        const guest = b.customer?.name || 'Another guest';
        return {
          hasConflict: true,
          message: `Room is already booked ${b.check_in} to ${b.check_out} by ${guest} (${b.booking_no}).`
        };
      }
    }
  }

  for (const blk of blocks) {
    if (blk.unit_id === unitId) {
      if (checkIn < blk.end_date && checkOut > blk.start_date) {
        return {
          hasConflict: true,
          message: `Room has maintenance blocked from ${blk.start_date} to ${blk.end_date} (${blk.note || blk.reason}).`
        };
      }
    }
  }

  return { hasConflict: false };
}

export interface GuestSummary {
  customer: Customer;
  staysCount: number;
  currentStay?: Booking;
  nextStay?: Booking;
  lastCompletedStay?: Booking;
  lifetimeValue: number;
  outstandingBalance: number;
  preferredPropertyId?: string;
  status: 'In house' | 'Upcoming' | 'Past' | 'New';
}

export function guestSummaries(
  bookings: Booking[],
  payments: Payment[],
  customers: Customer[],
  today = todayISO()
): GuestSummary[] {
  const balances = outstandingSummary(bookings, payments).balancesByBookingId;

  // Group bookings by customer_id
  const customerBookings: Record<string, Booking[]> = {};
  for (const b of bookings) {
    if (!customerBookings[b.customer_id]) customerBookings[b.customer_id] = [];
    customerBookings[b.customer_id].push(b);
  }

  return customers.map(c => {
    const allBks = customerBookings[c.id] || [];
    const activeBks = allBks.filter(b => b.booking_status !== 'Cancelled');

    let lifetimeValue = 0;
    let outstandingBalance = 0;
    const propertyCounts: Record<string, number> = {};

    let currentStay: Booking | undefined;
    let nextStay: Booking | undefined;
    let lastCompletedStay: Booking | undefined;

    for (const b of activeBks) {
      lifetimeValue += Number(b.grand_total) || 0;
      const bal = balances[b.id]?.balanceDue || 0;
      outstandingBalance += bal;

      propertyCounts[b.property_id] = (propertyCounts[b.property_id] || 0) + 1;

      if (b.booking_status === 'Checked In' || (b.check_in <= today && b.check_out >= today)) {
        if (!currentStay || b.check_in > currentStay.check_in) {
          currentStay = b;
        }
      } else if (b.check_in > today) {
        if (!nextStay || b.check_in < nextStay.check_in) {
          nextStay = b;
        }
      } else if (b.check_out <= today) {
        if (!lastCompletedStay || b.check_out > lastCompletedStay.check_out) {
          lastCompletedStay = b;
        }
      }
    }

    // Preferred property = mode
    let preferredPropertyId: string | undefined;
    let maxPropCount = 0;
    for (const [pId, cnt] of Object.entries(propertyCounts)) {
      if (cnt > maxPropCount) {
        maxPropCount = cnt;
        preferredPropertyId = pId;
      }
    }

    let status: 'In house' | 'Upcoming' | 'Past' | 'New' = 'New';
    if (currentStay) {
      status = 'In house';
    } else if (nextStay) {
      status = 'Upcoming';
    } else if (activeBks.length > 0) {
      status = 'Past';
    }

    return {
      customer: c,
      staysCount: activeBks.length,
      currentStay,
      nextStay,
      lastCompletedStay,
      lifetimeValue,
      outstandingBalance,
      preferredPropertyId,
      status
    };
  });
}

export type NormalizedPaymentMethod = 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Other';

export function normalizePaymentMethod(rawMethod: string): NormalizedPaymentMethod {
  const m = (rawMethod || '').toLowerCase().trim();
  if (
    m.includes('upi') ||
    m.includes('gpay') ||
    m.includes('google pay') ||
    m.includes('phonepe') ||
    m.includes('paytm') ||
    m.includes('whatsapp') ||
    m.includes('bhim')
  ) {
    return 'UPI';
  }
  if (m.includes('card') || m.includes('pos') || m.includes('credit') || m.includes('debit')) {
    return 'Card';
  }
  if (
    m.includes('bank') ||
    m.includes('transfer') ||
    m.includes('neft') ||
    m.includes('rtgs') ||
    m.includes('imps') ||
    m.includes('wire')
  ) {
    return 'Bank Transfer';
  }
  if (m.includes('cash')) {
    return 'Cash';
  }
  return 'Other';
}

export interface PaymentMixItem {
  method: NormalizedPaymentMethod;
  amount: number;
  percentage: number;
  count: number;
  rawMethods: Record<string, number>;
}

export function paymentMix(
  payments: Payment[],
  startDate?: string,
  endDate?: string
): { items: PaymentMixItem[]; totalAmount: number } {
  let totalAmount = 0;
  const map: Record<
    NormalizedPaymentMethod,
    { amount: number; count: number; rawMethods: Record<string, number> }
  > = {
    UPI: { amount: 0, count: 0, rawMethods: {} },
    Card: { amount: 0, count: 0, rawMethods: {} },
    'Bank Transfer': { amount: 0, count: 0, rawMethods: {} },
    Cash: { amount: 0, count: 0, rawMethods: {} },
    Other: { amount: 0, count: 0, rawMethods: {} }
  };

  for (const p of payments) {
    if (p.status !== 'Recorded' && p.status !== 'Completed') continue;
    if (startDate && p.date < startDate) continue;
    if (endDate && p.date > endDate) continue;

    const amt = Number(p.amount) || 0;
    const norm = normalizePaymentMethod(p.method);
    totalAmount += amt;

    map[norm].amount += amt;
    map[norm].count += 1;
    const raw = p.method || 'Unspecified';
    map[norm].rawMethods[raw] = (map[norm].rawMethods[raw] || 0) + amt;
  }

  const items: PaymentMixItem[] = (['UPI', 'Card', 'Bank Transfer', 'Cash', 'Other'] as NormalizedPaymentMethod[])
    .map(method => {
      const entry = map[method];
      const percentage = totalAmount > 0 ? Math.round((entry.amount / totalAmount) * 100) : 0;
      return {
        method,
        amount: entry.amount,
        percentage,
        count: entry.count,
        rawMethods: entry.rawMethods
      };
    })
    .filter(i => i.amount > 0);

  return { items, totalAmount };
}

export interface StayLengthBucket {
  label: string;
  count: number;
  share: number;
}

export function stayLengthBuckets(bookings: Booking[]): StayLengthBucket[] {
  const nonCancelled = bookings.filter(b => b.booking_status !== 'Cancelled');
  const total = nonCancelled.length;

  const buckets = {
    '1 night': 0,
    '2 nights': 0,
    '3 nights': 0,
    '4–6 nights': 0,
    '7+ nights': 0
  };

  for (const b of nonCancelled) {
    const n = b.nights || 1;
    if (n === 1) buckets['1 night']++;
    else if (n === 2) buckets['2 nights']++;
    else if (n === 3) buckets['3 nights']++;
    else if (n <= 6) buckets['4–6 nights']++;
    else buckets['7+ nights']++;
  }

  return Object.entries(buckets).map(([label, count]) => ({
    label,
    count,
    share: total > 0 ? Math.round((count / total) * 100) : 0
  }));
}

export function cancellationRate(bookings: Booking[]): {
  totalBookings: number;
  cancelledCount: number;
  ratePct: number;
} {
  const totalBookings = bookings.length;
  if (totalBookings === 0) {
    return { totalBookings: 0, cancelledCount: 0, ratePct: 0 };
  }
  const cancelledCount = bookings.filter(b => b.booking_status === 'Cancelled').length;
  const ratePct = Math.round((cancelledCount / totalBookings) * 100);
  return { totalBookings, cancelledCount, ratePct };
}

export interface PropertyRollup {
  property: Property;
  totalUnits: number;
  occupiedToday: number;
  occupancyPct: number | null;
  arrivalsToday: number;
  departuresToday: number;
  bookedValue: number;
  collected: number;
  outstanding: number;
}

export function propertyRollups(
  properties: Property[],
  units: Unit[],
  blocks: UnitBlock[],
  bookings: Booking[],
  payments: Payment[],
  today = todayISO()
): PropertyRollup[] {
  const balances = outstandingSummary(bookings, payments).balancesByBookingId;

  return properties.map(property => {
    const propUnits = units.filter(u => u.property_id === property.id && u.status !== 'inactive');
    const propBlocks = blocks.filter(b => b.property_id === property.id);
    const propBookings = bookings.filter(b => b.property_id === property.id);
    const propPayments = payments.filter(p => {
      const b = bookings.find(bk => bk.id === p.booking_id);
      return b && b.property_id === property.id;
    });

    const snapshot = occupancySnapshot(propUnits, propBlocks, propBookings, today);

    let arrivalsToday = 0;
    let departuresToday = 0;
    let bookedValue = 0;
    let outstanding = 0;

    for (const b of propBookings) {
      if (b.booking_status === 'Cancelled') continue;
      bookedValue += Number(b.grand_total) || 0;
      outstanding += balances[b.id]?.balanceDue || 0;

      if (b.check_in === today) arrivalsToday++;
      if (b.check_out === today) departuresToday++;
    }

    let collected = 0;
    for (const p of propPayments) {
      if (p.status === 'Recorded' || p.status === 'Completed') {
        collected += Number(p.amount) || 0;
      } else if (p.status === 'Refunded') {
        collected -= Number(p.amount) || 0;
      }
    }

    return {
      property,
      totalUnits: propUnits.length,
      occupiedToday: snapshot.occupied + snapshot.reserved,
      occupancyPct: snapshot.occupancyPct,
      arrivalsToday,
      departuresToday,
      bookedValue,
      collected,
      outstanding
    };
  });
}

export interface DateRangePreset {
  startDate: string;
  endDate: string;
  label: string;
  comparisonStart?: string;
  comparisonEnd?: string;
}

export function getDateRange(
  preset: 'thisMonth' | 'lastMonth' | 'last30' | 'thisQuarter' | 'allTime' | 'custom',
  customStart?: string,
  customEnd?: string,
  today = todayISO()
): DateRangePreset {
  const [yearStr, monthStr, dayStr] = today.split('-');
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10); // 1-indexed

  if (preset === 'thisMonth') {
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    const prevLastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    const compStart = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
    const compEnd = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevLastDay).padStart(2, '0')}`;

    return { startDate, endDate, label: 'This Month', comparisonStart: compStart, comparisonEnd: compEnd };
  }

  if (preset === 'lastMonth') {
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    const prevLastDay = new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    const startDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
    const endDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevLastDay).padStart(2, '0')}`;

    const compMonth = prevMonth === 1 ? 12 : prevMonth - 1;
    const compYear = prevMonth === 1 ? prevYear - 1 : prevYear;
    const compLastDay = new Date(Date.UTC(compYear, compMonth, 0)).getUTCDate();
    const compStart = `${compYear}-${String(compMonth).padStart(2, '0')}-01`;
    const compEnd = `${compYear}-${String(compMonth).padStart(2, '0')}-${String(compLastDay).padStart(2, '0')}`;

    return { startDate, endDate, label: 'Last Month', comparisonStart: compStart, comparisonEnd: compEnd };
  }

  if (preset === 'last30') {
    const d = new Date(Date.UTC(y, m - 1, parseInt(dayStr, 10)));
    const end = d.toISOString().split('T')[0];
    const prev30 = new Date(d);
    prev30.setUTCDate(prev30.getUTCDate() - 30);
    const start = prev30.toISOString().split('T')[0];

    const prev60 = new Date(prev30);
    prev60.setUTCDate(prev60.getUTCDate() - 30);
    const compStart = prev60.toISOString().split('T')[0];

    return { startDate: start, endDate: end, label: 'Last 30 Days', comparisonStart: compStart, comparisonEnd: start };
  }

  if (preset === 'thisQuarter') {
    const q = Math.floor((m - 1) / 3); // 0, 1, 2, 3
    const startM = q * 3 + 1;
    const endM = startM + 2;
    const lastDay = new Date(Date.UTC(y, endM, 0)).getUTCDate();
    const startDate = `${y}-${String(startM).padStart(2, '0')}-01`;
    const endDate = `${y}-${String(endM).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    return { startDate, endDate, label: 'This Quarter' };
  }

  if (preset === 'custom' && customStart && customEnd) {
    return { startDate: customStart, endDate: customEnd, label: `${customStart} to ${customEnd}` };
  }

  // All time
  return { startDate: '2020-01-01', endDate: '2030-12-31', label: 'All Time' };
}
