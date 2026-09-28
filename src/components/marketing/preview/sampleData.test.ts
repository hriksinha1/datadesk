import { describe, expect, it } from 'vitest';
import {
  formatINR,
  getArrivals,
  getBalance,
  getDepartures,
  getOccupiedCount,
  getOpenBalance,
  getPortfolioOpenBalance,
  getPortfolioTotals,
  getTotal,
  sampleBookings,
  sampleProperties,
} from './sampleData';

describe('homepage sample data selectors', () => {
  it('keeps the hero, booking detail, and folio amounts consistent', () => {
    const meera = sampleBookings.find((booking) => booking.id === 'BK-1046');
    expect(meera).toBeDefined();
    expect(getTotal(meera!)).toBe(21040);
    expect(meera!.paid).toBe(3000);
    expect(getBalance(meera!)).toBe(18040);
    expect(formatINR(123456)).toBe('₹1,23,456.00');
  });

  it('derives the 08:30 activity counts without counting future arrivals as in house', () => {
    expect(getArrivals()).toHaveLength(3);
    expect(getDepartures()).toHaveLength(2);
    expect(getOccupiedCount('fern')).toBe(14);
  });

  it('keeps portfolio room, occupancy, and balance totals equal to property values', () => {
    const totals = getPortfolioTotals();
    expect(totals).toEqual({ rooms: 46, occupied: 17, properties: 3 });
    const sumOfPropertyBalances = sampleProperties.reduce((sum, property) => sum + getOpenBalance(property.id), 0);
    expect(getPortfolioOpenBalance()).toBe(78640);
    expect(getPortfolioOpenBalance()).toBe(sumOfPropertyBalances);
  });
});
