import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Bed, 
  AlertTriangle,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Booking, Property } from '../../../lib/repository/types';
import { fmtINR, fmtDate } from '../../../lib/utils/formatters';

interface HotelCalendarViewProps {
  bookings: Booking[];
  properties: Property[];
  selectedPropertyId?: string;
}

interface RoomUnit {
  number: string;
  type: string;
  floor: string;
  propertyId: string;
  propertyName: string;
}

export default function HotelCalendarView({
  bookings,
  properties,
  selectedPropertyId,
}: HotelCalendarViewProps) {
  const navigate = useNavigate();

  // Calendar date range state: anchor date (start date)
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1); // Start from yesterday to see today in context
    return d;
  });

  const [daysCount, setDaysCount] = useState<7 | 14>(14);
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);

  // Generate date array
  const dateColumns = useMemo(() => {
    const list: Date[] = [];
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, [startDate, daysCount]);

  // Master list of room units across properties
  const allRooms: RoomUnit[] = useMemo(() => {
    return [
      { number: '101', type: 'Deluxe King', floor: '1st Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '102', type: 'Deluxe Twin', floor: '1st Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '103', type: 'Executive Suite', floor: '1st Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '104', type: 'Standard Queen', floor: '1st Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '201', type: 'Deluxe King', floor: '2nd Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '202', type: 'Deluxe Balcony', floor: '2nd Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: '203', type: 'Executive Suite', floor: '2nd Floor', propertyId: 'p1', propertyName: 'The Fern Residency' },
      { number: 'C-01', type: 'Cottage Villa', floor: 'Garden', propertyId: 'p2', propertyName: 'Valley View Resort' },
      { number: 'C-02', type: 'Cottage Villa', floor: 'Garden', propertyId: 'p2', propertyName: 'Valley View Resort' },
      { number: 'V-04', type: 'Valley Suite', floor: 'Valley Wing', propertyId: 'p2', propertyName: 'Valley View Resort' },
      { number: 'H-01', type: 'Sea View Room', floor: 'Ground', propertyId: 'p3', propertyName: 'Coral Beach Homestay' },
      { number: 'H-02', type: 'Garden Cottage', floor: 'Ground', propertyId: 'p3', propertyName: 'Coral Beach Homestay' },
    ];
  }, []);

  const visibleRooms = useMemo(() => {
    if (!selectedPropertyId) return allRooms;
    return allRooms.filter((r) => r.propertyId === selectedPropertyId);
  }, [allRooms, selectedPropertyId]);

  // Helper date conversions
  const toDateStr = (d: Date) => d.toISOString().split('T')[0];
  const todayStr = toDateStr(new Date());

  // Date Navigation handlers
  const handleToday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setStartDate(d);
  };

  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - (daysCount === 7 ? 7 : 7));
    setStartDate(d);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + (daysCount === 7 ? 7 : 7));
    setStartDate(d);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
      {/* Top Calendar Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation & Jump to Today */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            Today
          </button>

          <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs overflow-hidden">
            <button
              onClick={handlePrev}
              title="Previous period"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-r border-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              title="Next period"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-xs font-bold text-slate-900 ml-1">
            {startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
            {dateColumns[dateColumns.length - 1]?.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* View Range & Status Legend */}
        <div className="flex items-center gap-3">
          {/* Status Legend */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700"></span> Checked In
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span> Confirmed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span> Due Balance
            </span>
          </div>

          {/* 7 vs 14 Days Switcher */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60">
            <button
              onClick={() => setDaysCount(7)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                daysCount === 7
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDaysCount(14)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                daysCount === 14
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 Days
            </button>
          </div>
        </div>
      </div>

      {/* Main Reservation Tape Chart Grid */}
      <div className="overflow-x-auto relative min-h-[500px]">
        <div className="inline-block min-w-full align-middle">
          <table className="border-collapse table-fixed text-left w-full">
            {/* Header Row: Dates */}
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs">
                {/* Sticky Left Room Column Header */}
                <th className="sticky left-0 z-20 bg-slate-100 px-4 py-3 w-48 font-bold text-slate-800 border-r border-slate-200 shadow-xs">
                  Room & Category
                </th>

                {/* Date Columns */}
                {dateColumns.map((colDate, idx) => {
                  const dateStr = toDateStr(colDate);
                  const isToday = dateStr === todayStr;
                  const dayName = colDate.toLocaleDateString('en-IN', { weekday: 'short' });
                  const dayNum = colDate.getDate();

                  return (
                    <th
                      key={idx}
                      className={`py-2 px-1 text-center font-medium border-r border-slate-200/70 w-28 select-none ${
                        isToday ? 'bg-emerald-50/80 text-emerald-900 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider">{dayName}</div>
                      <div className={`text-sm mt-0.5 ${isToday ? 'text-emerald-700 font-extrabold' : 'text-slate-900'}`}>
                        {dayNum}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body Rows: Rooms and Booking Spans */}
            <tbody className="divide-y divide-slate-100 text-xs">
              {visibleRooms.map((room) => {
                // Find all bookings mapped to this room
                const roomBookings = bookings.filter(
                  (b) =>
                    (b.room_number === room.number || (!b.room_number && b.room_type === room.type)) &&
                    b.property_id === room.propertyId
                );

                return (
                  <tr key={room.number} className="hover:bg-slate-50/50 transition-colors h-14">
                    {/* Fixed Sticky Room Title */}
                    <td className="sticky left-0 z-10 bg-white px-4 py-2 border-r border-slate-200 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {room.number}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">
                            {room.type}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {room.floor} · {room.propertyName.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date Grid Cells */}
                    {dateColumns.map((colDate, dayIdx) => {
                      const dateStr = toDateStr(colDate);
                      const isToday = dateStr === todayStr;

                      // Check if a booking starts or continues on this date
                      const activeBooking = roomBookings.find(
                        (b) => b.check_in <= dateStr && b.check_out > dateStr
                      );

                      const isBookingStart = activeBooking && activeBooking.check_in === dateStr;

                      return (
                        <td
                          key={dayIdx}
                          onClick={() => {
                            if (!activeBooking) {
                              navigate(
                                `/app/bookings/new?date=${dateStr}&room=${room.number}&prop=${room.propertyId}`
                              );
                            }
                          }}
                          className={`relative border-r border-slate-200/60 p-0 text-center transition-colors cursor-pointer group ${
                            isToday ? 'bg-emerald-50/20' : ''
                          } ${!activeBooking ? 'hover:bg-slate-100/60' : ''}`}
                        >
                          {/* If a booking starts on this day, render a span bar across its stay days */}
                          {isBookingStart && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/bookings/${activeBooking.id}`);
                              }}
                              onMouseEnter={() => setHoveredBooking(activeBooking)}
                              onMouseLeave={() => setHoveredBooking(null)}
                              className={`absolute inset-y-1.5 left-1 z-10 rounded-md px-2 flex items-center justify-between text-left text-white shadow-xs transition-all hover:brightness-110 cursor-pointer overflow-hidden ${
                                activeBooking.booking_status === 'Checked In'
                                  ? 'bg-emerald-800 border-l-4 border-emerald-400'
                                  : activeBooking.payment_status === 'Partially Paid'
                                  ? 'bg-slate-900 border-l-4 border-amber-400'
                                  : 'bg-slate-800 border-l-4 border-slate-500'
                              }`}
                              style={{
                                width: `calc(${activeBooking.nights * 100}% + ${(activeBooking.nights - 1) * 1}px - 8px)`,
                              }}
                            >
                              <div className="truncate">
                                <div className="font-semibold text-xs text-white truncate">
                                  {activeBooking.customer?.name || 'Guest'}
                                </div>
                                <div className="text-[10px] text-slate-300 truncate">
                                  {activeBooking.booking_no} · {activeBooking.nights}N
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hover preview tooltip on empty slot */}
                          {!activeBooking && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center text-slate-400">
                              <Plus size={12} />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Hover Card Detail */}
      {hoveredBooking && (
        <div className="p-3 bg-slate-950 text-white border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 flex items-center justify-center font-bold text-xs">
              {hoveredBooking.customer?.name ? hoveredBooking.customer.name.slice(0, 2).toUpperCase() : 'G'}
            </div>
            <div>
              <div className="font-semibold text-white">
                {hoveredBooking.customer?.name || 'Guest'} ({hoveredBooking.booking_no})
              </div>
              <div className="text-[11px] text-slate-400">
                {hoveredBooking.room_number ? `Room ${hoveredBooking.room_number}` : hoveredBooking.room_type} · {fmtDate(hoveredBooking.check_in)} → {fmtDate(hoveredBooking.check_out)} ({hoveredBooking.nights} nights)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-400 tabular-nums">
                {fmtINR(hoveredBooking.grand_total)}
              </div>
              <div className="text-[10px] text-slate-400">
                Status: {hoveredBooking.booking_status} · {hoveredBooking.payment_status}
              </div>
            </div>

            <button
              onClick={() => navigate(`/app/bookings/${hoveredBooking.id}`)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-md transition-colors cursor-pointer text-xs"
            >
              Open Folio Details →
            </button>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
        <span>Click any open cell to create an express reservation for that room.</span>
        <span>Tape Chart view updated live</span>
      </div>
    </div>
  );
}
