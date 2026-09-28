import { describe, it, expect } from 'vitest';
import {
  todayISO,
  stage,
  bookingBalance,
  outstandingSummary,
  occupancySnapshot,
  isBookingOverlapping,
  normalizePaymentMethod,
  guestSummaries,
  getDateRange,
  cancellationRate,
  stayLengthBuckets,
  conflicts
} from './index';
import { Booking, Payment, Unit, UnitBlock, Customer } from '../repository/types';

describe('todayISO', () => {
  it('correctly handles 00:30 IST (which is previous day in UTC)', () => {
    // 2026-09-27T19:00:00Z UTC is 2026-09-28T00:30:00+05:30 IST
    const dateAtMidnightHalfIST = new Date('2026-09-27T19:00:00Z');
    const result = todayISO('Asia/Kolkata', dateAtMidnightHalfIST);
    expect(result).toBe('2026-09-28');
  });

  it('correctly formats noon IST', () => {
    const noon = new Date('2026-09-28T06:30:00Z'); // 12:00 PM IST
    const result = todayISO('Asia/Kolkata', noon);
    expect(result).toBe('2026-09-28');
  });
});

describe('stage', () => {
  const baseBooking: Booking = {
    id: 'b1',
    booking_no: 'BK-1',
    customer_id: 'c1',
    property_id: 'p1',
    check_in: '2026-09-28',
    check_out: '2026-10-01',
    nights: 3,
    rooms: 1,
    guests: 2,
    room_type: 'Deluxe',
    base_amount: 10000,
    tax_enabled: false,
    tax_rate: 0,
    tax_amount: 0,
    grand_total: 10000,
    booking_status: 'Confirmed',
    payment_status: 'Unpaid',
    created_at: '2026-09-25T10:00:00Z'
  };

  it('returns arriving on check-in day', () => {
    expect(stage(baseBooking, '2026-09-28')).toBe('arriving');
  });

  it('returns inHouse when between check-in and check-out', () => {
    expect(stage(baseBooking, '2026-09-29')).toBe('inHouse');
  });

  it('returns departing on check-out day', () => {
    expect(stage(baseBooking, '2026-10-01')).toBe('departing');
  });

  it('returns upcoming before check-in', () => {
    expect(stage(baseBooking, '2026-09-27')).toBe('upcoming');
  });

  it('returns past after check-out', () => {
    expect(stage(baseBooking, '2026-10-02')).toBe('past');
  });

  it('returns cancelled when booking_status is Cancelled', () => {
    expect(stage({ ...baseBooking, booking_status: 'Cancelled' }, '2026-09-28')).toBe('cancelled');
  });
});

describe('bookingBalance and outstandingSummary', () => {
  const b1: Booking = {
    id: 'b1',
    booking_no: 'BK-1',
    customer_id: 'c1',
    property_id: 'p1',
    check_in: '2026-09-28',
    check_out: '2026-10-01',
    nights: 3,
    rooms: 1,
    guests: 2,
    room_type: 'Deluxe',
    base_amount: 10000,
    tax_enabled: false,
    tax_rate: 0,
    tax_amount: 0,
    grand_total: 10000,
    booking_status: 'Confirmed',
    payment_status: 'Partially Paid',
    created_at: '2026-09-25T10:00:00Z'
  };

  const bCancelled: Booking = {
    ...b1,
    id: 'b-canc',
    booking_no: 'BK-CANC',
    booking_status: 'Cancelled',
    grand_total: 8000
  };

  const payments: Payment[] = [
    {
      id: 'p1',
      payment_no: 'P-1',
      booking_id: 'b1',
      date: '2026-09-26',
      amount: 4000,
      method: 'UPI',
      status: 'Recorded',
      created_at: '2026-09-26T10:00:00Z'
    }
  ];

  it('calculates correct balance for active booking', () => {
    const summary = bookingBalance(b1, payments);
    expect(summary.totalAmount).toBe(10000);
    expect(summary.netPaid).toBe(4000);
    expect(summary.balanceDue).toBe(6000);
    expect(summary.paymentStatus).toBe('Partially Paid');
  });

  it('outstandingSummary excludes cancelled bookings', () => {
    const out = outstandingSummary([b1, bCancelled], payments);
    expect(out.totalOutstanding).toBe(6000);
    expect(out.bookingsWithBalanceCount).toBe(1);
    expect(out.balancesByBookingId['b-canc']).toBeUndefined();
  });
});

describe('occupancySnapshot', () => {
  const units: Unit[] = [
    { id: 'u1', property_id: 'p1', number: '101', unit_type: 'Deluxe', status: 'active', created_at: '' },
    { id: 'u2', property_id: 'p1', number: '102', unit_type: 'Deluxe', status: 'active', created_at: '' },
    { id: 'u3', property_id: 'p1', number: '103', unit_type: 'Suite', status: 'active', created_at: '' },
    { id: 'u4', property_id: 'p1', number: '104', unit_type: 'Suite', status: 'inactive', created_at: '' } // inactive
  ];

  const blocks: UnitBlock[] = [
    {
      id: 'blk1',
      unit_id: 'u3',
      property_id: 'p1',
      start_date: '2026-09-28',
      end_date: '2026-09-30',
      reason: 'Maintenance',
      created_at: ''
    }
  ];

  const bookings: Booking[] = [
    {
      id: 'b1',
      booking_no: 'BK-1',
      customer_id: 'c1',
      property_id: 'p1',
      unit_id: 'u1',
      check_in: '2026-09-28',
      check_out: '2026-09-30',
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe',
      base_amount: 5000,
      tax_enabled: false,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: 5000,
      booking_status: 'Checked In',
      payment_status: 'Paid',
      created_at: ''
    }
  ];

  it('returns null occupancyPct when no units configured', () => {
    const res = occupancySnapshot([], [], [], '2026-09-28');
    expect(res.totalUnits).toBe(0);
    expect(res.occupancyPct).toBeNull();
  });

  it('computes correct occupancy with maintenance block and active units', () => {
    const res = occupancySnapshot(units, blocks, bookings, '2026-09-28');
    // Active units: u1, u2, u3 (3 units)
    expect(res.totalUnits).toBe(3);
    expect(res.occupied).toBe(1); // u1
    expect(res.blocked).toBe(1); // u3
    expect(res.available).toBe(1); // u2
    // Occupancy pct = (1 / 3) * 100 = 33%
    expect(res.occupancyPct).toBe(33);
  });
});

describe('overlap detection and conflicts', () => {
  const blocks: UnitBlock[] = [
    {
      id: 'blk1',
      unit_id: 'u1',
      property_id: 'p1',
      start_date: '2026-10-05',
      end_date: '2026-10-08',
      reason: 'Maintenance',
      created_at: ''
    }
  ];

  const bookings: Booking[] = [
    {
      id: 'b1',
      booking_no: 'BK-101',
      customer_id: 'c1',
      property_id: 'p1',
      unit_id: 'u1',
      check_in: '2026-10-01',
      check_out: '2026-10-04',
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Deluxe',
      base_amount: 6000,
      tax_enabled: false,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: 6000,
      booking_status: 'Confirmed',
      payment_status: 'Paid',
      created_at: ''
    }
  ];

  it('allows same-day checkout/checkin turnover', () => {
    // b1 checks out 2026-10-04. New booking checks in 2026-10-04.
    const res = isBookingOverlapping(bookings, blocks, 'u1', '2026-10-04', '2026-10-05');
    expect(res.hasConflict).toBe(false);
  });

  it('blocks booking overlapping another booking', () => {
    // Overlaps 2026-10-02 to 2026-10-05
    const res = isBookingOverlapping(bookings, blocks, 'u1', '2026-10-02', '2026-10-05');
    expect(res.hasConflict).toBe(true);
    expect(res.message).toContain('Room is already booked');
  });

  it('blocks booking overlapping maintenance block', () => {
    const res = isBookingOverlapping(bookings, blocks, 'u1', '2026-10-06', '2026-10-09');
    expect(res.hasConflict).toBe(true);
    expect(res.message).toContain('maintenance');
  });
});

describe('normalizePaymentMethod', () => {
  it('normalizes various raw payment names', () => {
    expect(normalizePaymentMethod('Google Pay')).toBe('UPI');
    expect(normalizePaymentMethod('PhonePe')).toBe('UPI');
    expect(normalizePaymentMethod('Paytm UPI')).toBe('UPI');
    expect(normalizePaymentMethod('Credit Card POS')).toBe('Card');
    expect(normalizePaymentMethod('NEFT Transfer')).toBe('Bank Transfer');
    expect(normalizePaymentMethod('Cash')).toBe('Cash');
    expect(normalizePaymentMethod('Crypto')).toBe('Other');
  });
});

describe('getDateRange', () => {
  it('computes thisMonth and comparison correctly', () => {
    const range = getDateRange('thisMonth', undefined, undefined, '2026-09-28');
    expect(range.startDate).toBe('2026-09-01');
    expect(range.endDate).toBe('2026-09-30');
    expect(range.comparisonStart).toBe('2026-08-01');
    expect(range.comparisonEnd).toBe('2026-08-31');
  });
});
