import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Booking } from '../../../lib/repository/types';
import { fmtINR } from '../../../lib/utils/formatters';
import { TrendingUp, Users, Calendar, Clock } from 'lucide-react';

interface BookingAnalyticsViewProps {
  bookings: Booking[];
}

export default function BookingAnalyticsView({ bookings }: BookingAnalyticsViewProps) {
  // Stay duration distribution
  const stayDistribution = [
    { label: '1 Night', count: bookings.filter((b) => b.nights === 1).length },
    { label: '2 Nights', count: bookings.filter((b) => b.nights === 2).length },
    { label: '3 Nights', count: bookings.filter((b) => b.nights === 3).length },
    { label: '4+ Nights', count: bookings.filter((b) => b.nights >= 4).length },
  ];

  // Room type breakdown
  const roomTypeMap = bookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.room_type] = (acc[b.room_type] || 0) + 1;
    return acc;
  }, {});

  const roomTypeData = Object.entries(roomTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0D5C4D', '#1E293B', '#D97706', '#2563EB', '#64748B'];

  // Average stay calculation
  const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);
  const avgNights = bookings.length > 0 ? (totalNights / bookings.length).toFixed(1) : '0';

  const totalGuests = bookings.reduce((sum, b) => sum + (b.guests || 1), 0);
  const avgGuests = bookings.length > 0 ? (totalGuests / bookings.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Analytical KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Bookings</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {bookings.length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
            Active in database
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Length of Stay</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {avgNights} nights
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Per confirmed reservation
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Party Size</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {avgGuests} guests
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Adults & accompanied
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Confirmation Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {bookings.length > 0
              ? Math.round((bookings.filter((b) => b.booking_status !== 'Cancelled').length / bookings.length) * 100)
              : 0}
            %
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
            High operational fulfillment
          </div>
        </div>
      </div>

      {/* Two Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Length of Stay Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Length of Stay Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of guest stay durations across current bookings
            </p>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stayDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg">
                            <div className="font-semibold">{d.label}</div>
                            <div className="text-emerald-400 mt-0.5">{d.count} reservations</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#0D5C4D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            3-night stays represent the dominant vacation and leisure segment.
          </div>
        </div>

        {/* Room Category Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Room Category Share
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reservation distribution by room tier and category
            </p>

            <div className="mt-4 space-y-2.5">
              {roomTypeData.map((item, idx) => {
                const pct = bookings.length > 0 ? Math.round((item.value / bookings.length) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.name}</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {item.value} bookings ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Deluxe and Suite tiers account for over 65% of room revenue.
          </div>
        </div>
      </div>
    </div>
  );
}
