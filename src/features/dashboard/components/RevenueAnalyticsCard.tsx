import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Wallet, 
  CalendarDays, 
  CreditCard 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { fmtINR } from '../../../lib/utils/formatters';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  bookings: number;
}

interface RevenueAnalyticsProps {
  totalRevenue: number;
  totalBookingsCount: number;
  avgBookingValue: number;
  growthPct: number;
  chartData: RevenueDataPoint[];
}

export default function RevenueAnalyticsCard({
  totalRevenue,
  totalBookingsCount,
  avgBookingValue,
  growthPct,
  chartData,
}: RevenueAnalyticsProps) {
  const [metricMode, setMetricMode] = useState<'revenue' | 'bookings'>('revenue');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Revenue & Financial Performance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily realized collections vs prior period comparison
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setMetricMode('revenue')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setMetricMode('bookings')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                metricMode === 'bookings'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookings (#)
            </button>
          </div>
        </div>

        {/* Primary Metric Strip */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Total Realized</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {fmtINR(totalRevenue)}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight size={11} /> +{growthPct}% vs prior period
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Total Bookings</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {totalBookingsCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Active reservations
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Avg Folio Value</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {fmtINR(avgBookingValue)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Per booking stay
            </div>
          </div>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="pt-2 border-t border-slate-100">
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D5C4D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0D5C4D" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (metricMode === 'revenue' ? `₹${val >= 1000 ? val / 1000 + 'k' : val}` : val)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as RevenueDataPoint;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg">
                        <div className="font-semibold text-slate-200">{d.date}</div>
                        <div className="text-emerald-400 font-bold mt-1">
                          Revenue: {fmtINR(d.revenue)}
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          Bookings: {d.bookings}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={metricMode === 'revenue' ? 'revenue' : 'bookings'}
                stroke="#0D5C4D"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
