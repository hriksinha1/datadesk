import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  HelpCircle,
  X,
  CreditCard,
  LogIn,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Booking, Property, Unit, UnitBlock } from '../../../lib/repository/types';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { StatusBadge, BalanceCell } from '../../../components/ui/Badges';
import { Money, DateText } from '../../../components/ui/Typography';
import { BookingPaymentSummary } from '../../../lib/utils/financials';
import { todayISO } from '../../../lib/analytics';

interface HotelCalendarViewProps {
  bookings: Booking[];
  properties: Property[];
  units: Unit[];
  blocks: UnitBlock[];
  balancesByBookingId: Record<string, BookingPaymentSummary>;
  selectedPropertyId?: string;
  searchFilter?: string;
  onCheckIn: (bookingId: string) => Promise<void>;
  onCheckOut: (bookingId: string) => Promise<void>;
  onAddPayment: (booking: Booking) => void;
}

export const HotelCalendarView: React.FC<HotelCalendarViewProps> = ({
  bookings,
  properties,
  units,
  blocks,
  balancesByBookingId,
  selectedPropertyId,
  searchFilter = '',
  onCheckIn,
  onCheckOut,
  onAddPayment,
}) => {
  const navigate = useNavigate();
  const today = todayISO();

  // Range and Span
  const [daysSpan, setDaysSpan] = useState<7 | 14 | 30>(14);
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    // Start 1 day before today so today is clearly visible in context
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return todayISO('Asia/Kolkata', d);
  });

  const [showCancelled, setShowCancelled] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Drag selection state for empty cells
  const [dragState, setDragState] = useState<{
    unitId: string;
    propId: string;
    roomNum: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  // Keyboard navigation focus
  const [focusedCell, setFocusedCell] = useState<{ unitId: string; date: string } | null>(null);

  // Compute array of date strings in window
  const dateColumns = useMemo(() => {
    const list: string[] = [];
    const [y, m, d] = startDateStr.split('-').map(Number);
    const baseDate = new Date(Date.UTC(y, m - 1, d));

    for (let i = 0; i < daysSpan; i++) {
      const current = new Date(baseDate);
      current.setUTCDate(current.getUTCDate() + i);
      list.push(current.toISOString().split('T')[0]);
    }
    return list;
  }, [startDateStr, daysSpan]);

  const endDateStr = dateColumns[dateColumns.length - 1] || startDateStr;

  // Filtered units & properties
  const visibleProperties = useMemo(() => {
    if (!selectedPropertyId) return properties.filter((p) => p.active);
    return properties.filter((p) => p.id === selectedPropertyId);
  }, [properties, selectedPropertyId]);

  // Navigation handlers
  const handleToday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setStartDateStr(todayISO('Asia/Kolkata', d));
  };

  const handlePrev = () => {
    const [y, m, d] = startDateStr.split('-').map(Number);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() - (daysSpan - 1));
    setStartDateStr(base.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const [y, m, d] = startDateStr.split('-').map(Number);
    const base = new Date(Date.UTC(y, m - 1, d));
    base.setUTCDate(base.getUTCDate() + (daysSpan - 1));
    setStartDateStr(base.toISOString().split('T')[0]);
  };

  // Day occupancy summary counts
  const daySummaryMap = useMemo(() => {
    const map: Record<string, { occupied: number; total: number; hasConflict: boolean }> = {};
    const totalActiveUnits = units.filter(
      (u) => (!selectedPropertyId || u.property_id === selectedPropertyId) && u.status !== 'inactive'
    ).length;

    for (const d of dateColumns) {
      let count = 0;
      for (const b of bookings) {
        if (b.booking_status === 'Cancelled') continue;
        if (selectedPropertyId && b.property_id !== selectedPropertyId) continue;
        if (b.check_in <= d && b.check_out > d) {
          count++;
        }
      }
      map[d] = {
        occupied: count,
        total: totalActiveUnits,
        hasConflict: false,
      };
    }
    return map;
  }, [dateColumns, bookings, units, selectedPropertyId]);

  // Date Range label
  const rangeLabel = useMemo(() => {
    if (dateColumns.length === 0) return '';
    const first = dateColumns[0];
    const last = dateColumns[dateColumns.length - 1];
    const [y1, m1, d1] = first.split('-').map(Number);
    const [y2, m2, d2] = last.split('-').map(Number);
    const date1 = new Date(Date.UTC(y1, m1 - 1, d1)).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
    const date2 = new Date(Date.UTC(y2, m2 - 1, d2)).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return `${date1} – ${date2}`;
  }, [dateColumns]);

  // Booking matching helper: returns bookings for this unit
  const getBookingsForUnit = (unit: Unit) => {
    return bookings.filter((b) => {
      if (!showCancelled && b.booking_status === 'Cancelled') return false;
      const matched =
        (b.unit_id && b.unit_id === unit.id) ||
        (b.property_id === unit.property_id && b.room_number === unit.number);
      if (!matched) return false;
      // Overlaps calendar window?
      return b.check_in < dateColumns[dateColumns.length - 1] + 'Z' && b.check_out > dateColumns[0];
    });
  };

  const getBlocksForUnit = (unitId: string) => {
    return blocks.filter((blk) => {
      if (blk.unit_id !== unitId) return false;
      return blk.start_date < dateColumns[dateColumns.length - 1] + 'Z' && blk.end_date > dateColumns[0];
    });
  };

  const cellWidthPx = 56;
  const boardWidthPx = dateColumns.length * cellWidthPx;

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] flex flex-col overflow-hidden select-none">
      {/* 1. Calendar Toolbar */}
      <div className="p-3 sm:px-4 border-b border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3 bg-[#F7F8FA]">
        <div className="flex items-center gap-2">
          {/* Today Button */}
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Today
          </Button>

          {/* Prev / Next navigation */}
          <div className="flex items-center border border-[#E4E7EC] bg-white rounded-[6px] overflow-hidden">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 hover:bg-[#F7F8FA] border-r border-[#E4E7EC] text-[#64748B] hover:text-[#0E1726] cursor-pointer"
              aria-label="Previous span"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 hover:bg-[#F7F8FA] text-[#64748B] hover:text-[#0E1726] cursor-pointer"
              aria-label="Next span"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Range Label */}
          <span className="text-xs sm:text-sm font-semibold text-[#0E1726] ml-1 tabular-nums">
            {rangeLabel}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Span Switcher: 7 / 14 / 30 days */}
          <div className="flex items-center bg-white border border-[#E4E7EC] rounded-[6px] p-0.5 text-xs">
            {([7, 14, 30] as const).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setDaysSpan(cnt)}
                className={`px-2 py-1 rounded-[4px] font-medium cursor-pointer transition-colors ${
                  daysSpan === cnt ? 'bg-[#0D5C4D] text-white' : 'text-[#64748B] hover:text-[#0E1726]'
                }`}
              >
                {cnt}d
              </button>
            ))}
          </div>

          {/* Cancelled Toggle */}
          <label className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#64748B] cursor-pointer">
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
              className="rounded-[3px] text-[#0D5C4D]"
            />
            <span>Show cancelled</span>
          </label>

          {/* Legend Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLegend(!showLegend)}
              className="p-1.5 text-[#64748B] hover:text-[#0E1726] bg-white border border-[#E4E7EC] rounded-[6px] cursor-pointer"
              title="View status legend"
              aria-label="Calendar status legend"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {showLegend && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#0E1726] text-white rounded-[6px] shadow-[0_8px_24px_rgba(14,23,38,0.2)] text-xs z-50 space-y-2 border border-[#334155]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#334155] font-semibold text-[11px] uppercase tracking-wider text-[#94A3B8]">
                  <span>Status Legend</span>
                  <button onClick={() => setShowLegend(false)} className="text-[#94A3B8] hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-white border border-[#0D5C4D]" />
                  <span>Confirmed (Reserved)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-[#0D5C4D]" />
                  <span>Checked In (In House)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-[#F7F8FA] border border-[#CBD2DC] text-[#64748B]" />
                  <span>Completed (Departed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-white border-l-4 border-l-[#B45309] border border-[#E4E7EC]" />
                  <span>Balance Due (&gt; ₹0 pending)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-[#94A3B8]/30 border border-[#94A3B8]" />
                  <span>Maintenance (Blocked)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] border-2 border-[#B42318] bg-[#FEF3F2]" />
                  <span>Conflict (Overlapping stay)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Calendar Grid Area */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[70vh] flex flex-col">
        {/* Sticky Header Row: Left Room Label + Date Columns */}
        <div className="sticky top-0 z-20 flex bg-white border-b border-[#E4E7EC] min-w-max">
          {/* Top-Left Cell: Sticky Room Column Header */}
          <div className="sticky left-0 z-30 w-36 sm:w-48 bg-[#F7F8FA] border-r border-[#E4E7EC] px-3 py-2 shrink-0 flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>ROOM / UNIT</span>
          </div>

          {/* Date Headers */}
          <div className="flex" style={{ width: `${boardWidthPx}px` }}>
            {dateColumns.map((dateStr) => {
              const [y, m, d] = dateStr.split('-').map(Number);
              const dateObj = new Date(Date.UTC(y, m - 1, d));
              const isToday = dateStr === today;
              const isWeekend = dateObj.getUTCDay() === 0 || dateObj.getUTCDay() === 6;

              const weekday = dateObj.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'UTC' });
              const dayNum = dateObj.getUTCDate();
              const isMonthStart = dayNum === 1 || dateStr === dateColumns[0];
              const monthName = isMonthStart
                ? dateObj.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' })
                : null;

              return (
                <div
                  key={dateStr}
                  style={{ width: `${cellWidthPx}px` }}
                  className={`shrink-0 border-r border-[#E4E7EC] text-center py-1.5 flex flex-col justify-between ${
                    isToday ? 'bg-[#EAF4F1] border-b-2 border-b-[#0D5C4D]' : isWeekend ? 'bg-[#F7F8FA]' : 'bg-white'
                  }`}
                >
                  <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-tight">
                    {monthName ? `${monthName} ${dayNum}` : weekday}
                  </div>
                  <div className={`text-xs font-bold tabular-nums ${isToday ? 'text-[#0D5C4D]' : 'text-[#0E1726]'}`}>
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Occupancy Summary Row */}
        <div className="sticky top-12 z-20 flex bg-[#F7F8FA] border-b border-[#E4E7EC] min-w-max">
          <div className="sticky left-0 z-30 w-36 sm:w-48 bg-[#F7F8FA] border-r border-[#E4E7EC] px-3 py-1.5 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Occupied
          </div>
          <div className="flex" style={{ width: `${boardWidthPx}px` }}>
            {dateColumns.map((dateStr) => {
              const summary = daySummaryMap[dateStr];
              const isToday = dateStr === today;
              return (
                <div
                  key={dateStr}
                  style={{ width: `${cellWidthPx}px` }}
                  className={`shrink-0 border-r border-[#E4E7EC] text-center py-1 text-[11px] tabular-nums ${
                    isToday ? 'bg-[#EAF4F1] font-semibold text-[#0D5C4D]' : 'text-[#64748B]'
                  }`}
                >
                  {summary ? `${summary.occupied}/${summary.total}` : '—'}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Property Groups & Unit Rows */}
        {visibleProperties.map((prop) => {
          const propUnits = units.filter((u) => u.property_id === prop.id && u.status !== 'inactive');
          const propUnassignedBookings = bookings.filter(
            (b) =>
              b.property_id === prop.id &&
              !b.unit_id &&
              !b.room_number &&
              (showCancelled || b.booking_status !== 'Cancelled')
          );

          return (
            <div key={prop.id} className="min-w-max">
              {/* Property Group Header (when multi-property) */}
              {!selectedPropertyId && (
                <div className="flex items-center bg-[#F7F8FA] border-b border-[#E4E7EC] px-3 py-1.5">
                  <div className="sticky left-0 z-10 flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#0E1726]">{prop.name}</span>
                    <span className="text-[11px] text-[#64748B]">
                      ({propUnits.length} rooms · {prop.city})
                    </span>
                  </div>
                </div>
              )}

              {/* Unassigned Lane (if any unassigned bookings exist for this property) */}
              {propUnassignedBookings.length > 0 && (
                <div className="flex border-b border-[#E4E7EC] bg-[#FEF3C7]/20">
                  <div className="sticky left-0 z-10 w-36 sm:w-48 bg-[#FEF3C7]/40 border-r border-[#F5D58A] px-3 py-2 shrink-0">
                    <div className="text-xs font-semibold text-[#B45309]">Unassigned</div>
                    <div className="text-[11px] text-[#64748B]">
                      {propUnassignedBookings.length} stays pending room
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 overflow-x-auto py-2">
                    {propUnassignedBookings.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 text-xs bg-white border border-[#F5D58A] text-[#B45309] font-medium rounded-[4px] hover:bg-[#FEF3C7] cursor-pointer whitespace-nowrap"
                      >
                        {b.customer?.name || 'Guest'} ({b.check_in} to {b.check_out})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Units Rows */}
              {propUnits.map((unit) => {
                const unitBookings = getBookingsForUnit(unit);
                const unitBlocks = getBlocksForUnit(unit.id);

                return (
                  <div key={unit.id} className="flex border-b border-[#E4E7EC] hover:bg-[#F7F8FA]/50 group relative">
                    {/* Sticky Unit Info Column */}
                    <div className="sticky left-0 z-10 w-36 sm:w-48 bg-white group-hover:bg-[#F7F8FA] border-r border-[#E4E7EC] px-3 py-2 shrink-0 flex flex-col justify-center">
                      <div className="font-semibold text-xs sm:text-sm text-[#0E1726]">
                        {unit.number}
                      </div>
                      <div className="text-[11px] text-[#64748B] truncate">
                        {unit.unit_type} {unit.floor ? `· ${unit.floor}` : ''}
                      </div>
                    </div>

                    {/* Timeline Grid (cells + positioned booking blocks overlay) */}
                    <div className="relative flex" style={{ width: `${boardWidthPx}px` }}>
                      {/* Empty Background Cells */}
                      {dateColumns.map((dateStr) => {
                        const isToday = dateStr === today;
                        return (
                          <div
                            key={dateStr}
                            tabIndex={0}
                            style={{ width: `${cellWidthPx}px`, height: '44px' }}
                            onClick={() => {
                              navigate(
                                `/app/bookings/new?date=${dateStr}&room=${encodeURIComponent(
                                  unit.number
                                )}&prop=${unit.property_id}&unit=${unit.id}`
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate(
                                  `/app/bookings/new?date=${dateStr}&room=${encodeURIComponent(
                                    unit.number
                                  )}&prop=${unit.property_id}&unit=${unit.id}`
                                );
                              }
                            }}
                            className={`shrink-0 border-r border-[#E4E7EC] cursor-pointer hover:bg-[#EAF4F1]/40 transition-colors ${
                              isToday ? 'bg-[#EAF4F1]/20' : ''
                            }`}
                            aria-label={`Room ${unit.number}, ${dateStr}, Available`}
                          />
                        );
                      })}

                      {/* Maintenance Block Overlays */}
                      {unitBlocks.map((blk) => {
                        const startIdx = dateColumns.indexOf(blk.start_date);
                        const effectiveStartIdx = startIdx >= 0 ? startIdx : 0;
                        const endIdx = dateColumns.indexOf(blk.end_date);
                        const effectiveEndIdx = endIdx >= 0 ? endIdx : dateColumns.length;

                        const left = effectiveStartIdx * cellWidthPx;
                        const width = Math.max(cellWidthPx, (effectiveEndIdx - effectiveStartIdx) * cellWidthPx);

                        return (
                          <div
                            key={blk.id}
                            style={{ left: `${left}px`, width: `${width}px` }}
                            className="absolute top-1 bottom-1 rounded-[4px] border border-[#CBD2DC] bg-[#F1F5F9] px-2 flex items-center gap-1.5 text-xs text-[#475569] font-medium overflow-hidden shadow-2xs pointer-events-auto"
                            title={`Maintenance: ${blk.note || blk.reason} (${blk.start_date} to ${blk.end_date})`}
                          >
                            <Wrench className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
                            <span className="truncate">Maintenance: {blk.note || blk.reason}</span>
                          </div>
                        );
                      })}

                      {/* Booking Stay Overlays */}
                      {unitBookings.map((b) => {
                        const isClippedLeft = b.check_in < dateColumns[0];
                        const isClippedRight = b.check_out > dateColumns[dateColumns.length - 1];

                        const startIdx = isClippedLeft ? 0 : dateColumns.indexOf(b.check_in);
                        const endIdx = isClippedRight
                          ? dateColumns.length
                          : dateColumns.indexOf(b.check_out);

                        if (startIdx < 0 && endIdx < 0) return null;

                        const effectiveStart = Math.max(0, startIdx);
                        const effectiveEnd = endIdx >= 0 ? endIdx : dateColumns.length;

                        // Half-day turnover offset: start at 50% of check-in, end at 50% of check-out!
                        // If clipped, flush to edge (0% or 100%)
                        const leftOffset = isClippedLeft ? 0 : 0.5;
                        const rightOffset = isClippedRight ? 0 : 0.5;

                        const leftPx = (effectiveStart + leftOffset) * cellWidthPx;
                        const widthPx = Math.max(
                          24,
                          (effectiveEnd - effectiveStart - leftOffset + rightOffset) * cellWidthPx
                        );

                        const isCheckedIn = b.booking_status === 'Checked In';
                        const isConfirmed = b.booking_status === 'Confirmed';
                        const isCompleted = b.booking_status === 'Completed';
                        const isCancelled = b.booking_status === 'Cancelled';
                        const bal = balancesByBookingId[b.id]?.balanceDue || 0;
                        const hasBalance = bal > 0;

                        // Visual styling based on status rules
                        let blockStyle = 'bg-white text-[#0D5C4D] border border-[#0D5C4D] font-medium';
                        if (isCheckedIn) {
                          blockStyle = 'bg-[#0D5C4D] text-white font-medium border border-[#094539]';
                        } else if (isCompleted) {
                          blockStyle = 'bg-[#F7F8FA] text-[#64748B] border border-[#CBD2DC]';
                        } else if (isCancelled) {
                          blockStyle = 'bg-[#FEF3F2] text-[#B42318] line-through border border-[#FDA29B]';
                        }

                        // Search dimming
                        const isMatch =
                          !searchFilter ||
                          (b.customer?.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (b.booking_no || '').toLowerCase().includes(searchFilter.toLowerCase());

                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            style={{
                              left: `${leftPx}px`,
                              width: `${widthPx}px`,
                              opacity: isMatch ? 1 : 0.35,
                            }}
                            className={`absolute top-1 bottom-1 rounded-[4px] px-2 text-left flex items-center justify-between text-xs cursor-pointer shadow-2xs hover:brightness-95 transition-all overflow-hidden ${blockStyle} ${
                              hasBalance ? 'border-l-4 border-l-[#B45309]' : ''
                            }`}
                            aria-label={`${b.customer?.name || 'Guest'}, Room ${unit.number}, ${b.check_in} to ${
                              b.check_out
                            }, ${b.booking_status}, ${hasBalance ? `₹${bal} due` : 'Paid'}`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {isClippedLeft && <ChevronLeft className="w-3 h-3 shrink-0" />}
                              <span className="truncate font-medium">{b.customer?.name || 'Guest'}</span>
                              {widthPx > 160 && (
                                <span className="opacity-80 text-[10px] font-mono shrink-0">
                                  {b.booking_no} · {b.nights}N
                                </span>
                              )}
                            </div>

                            {widthPx > 220 && hasBalance && (
                              <span className="text-[10px] font-semibold text-[#B45309] bg-[#FEF3C7] px-1 rounded shrink-0">
                                ₹{bal.toLocaleString('en-IN')} due
                              </span>
                            )}

                            {isClippedRight && <ChevronRight className="w-3 h-3 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 4. Booking Preview Drawer (400px, bottom sheet on mobile) */}
      {selectedBooking && (
        <Drawer
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.booking_no}`}
          subtitle={`${selectedBooking.customer?.name || 'Guest'} · ${selectedBooking.room_type}`}
          width="400px"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/app/bookings/${selectedBooking.id}`);
                  setSelectedBooking(null);
                }}
              >
                Open full folio &rarr;
              </Button>

              <div className="flex items-center gap-2">
                {selectedBooking.booking_status === 'Confirmed' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={async () => {
                      await onCheckIn(selectedBooking.id);
                      setSelectedBooking((prev) => (prev ? { ...prev, booking_status: 'Checked In' } : null));
                    }}
                    icon={<LogIn className="w-3.5 h-3.5" />}
                  >
                    Check in
                  </Button>
                )}

                {selectedBooking.booking_status === 'Checked In' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await onCheckOut(selectedBooking.id);
                      setSelectedBooking((prev) => (prev ? { ...prev, booking_status: 'Completed' } : null));
                    }}
                    icon={<LogOut className="w-3.5 h-3.5" />}
                  >
                    Check out
                  </Button>
                )}
              </div>
            </div>
          }
        >
          {/* Guest Contact & Customer Profile Link */}
          <div className="p-3.5 bg-[#F7F8FA] rounded-[6px] border border-[#E4E7EC] flex items-center justify-between">
            <div>
              <Link
                to={`/app/customers?guest=${selectedBooking.customer_id}`}
                className="font-semibold text-sm text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
              >
                {selectedBooking.customer?.name || 'Guest'}
              </Link>
              <div className="text-xs text-[#64748B] mt-0.5">
                {selectedBooking.customer?.phone}
                {selectedBooking.customer?.email ? ` · ${selectedBooking.customer.email}` : ''}
              </div>
            </div>
            <StatusBadge status={selectedBooking.booking_status} />
          </div>

          {/* Dates & Room */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-[#E4E7EC] rounded-[6px]">
              <span className="text-[#64748B] block mb-1">Check-in</span>
              <span className="font-semibold text-sm text-[#0E1726]">
                <DateText date={selectedBooking.check_in} />
              </span>
            </div>
            <div className="p-3 border border-[#E4E7EC] rounded-[6px]">
              <span className="text-[#64748B] block mb-1">Check-out</span>
              <span className="font-semibold text-sm text-[#0E1726]">
                <DateText date={selectedBooking.check_out} />
              </span>
            </div>
          </div>

          {/* Stay Info */}
          <div className="text-xs space-y-2 py-2 border-y border-[#E4E7EC]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Duration</span>
              <span className="font-medium text-[#0E1726]">
                {selectedBooking.nights} nights · {selectedBooking.guests} guests
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Allocated Room</span>
              <span className="font-semibold text-[#0E1726]">
                {selectedBooking.room_number ? `Room ${selectedBooking.room_number} (${selectedBooking.room_type})` : selectedBooking.room_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Property</span>
              <span className="font-medium text-[#0D5C4D]">
                {selectedBooking.property?.name || 'Property'}
              </span>
            </div>
          </div>

          {/* Financials & Balance */}
          <div className="p-3.5 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Grand Total</span>
              <span className="font-semibold text-[#0E1726] tabular-nums">
                <Money amount={selectedBooking.grand_total} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Paid Net</span>
              <span className="font-medium text-[#067647] tabular-nums">
                <Money amount={balancesByBookingId[selectedBooking.id]?.netPaid || 0} />
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#E4E7EC] text-sm">
              <span className="font-medium text-[#0E1726]">Balance Due</span>
              <BalanceCell balanceDue={balancesByBookingId[selectedBooking.id]?.balanceDue || 0} />
            </div>
          </div>

          {/* Quick Pay Action if balance due */}
          {(balancesByBookingId[selectedBooking.id]?.balanceDue || 0) > 0 && (
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  onAddPayment(selectedBooking);
                  setSelectedBooking(null);
                }}
                icon={<CreditCard className="w-3.5 h-3.5" />}
              >
                Record Payment
              </Button>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
};

export default HotelCalendarView;
