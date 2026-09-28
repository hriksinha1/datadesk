import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DayCollection } from '../../../lib/analytics';
import { Money } from '../../../components/ui/Typography';

interface MoneyPanelProps {
  collectedThisMonth: number;
  collectedPrevMonth: number;
  bookedThisMonth: number;
  totalOutstanding: number;
  bookingsWithBalanceCount: number;
  collectionsChart: DayCollection[];
}

export const MoneyPanel: React.FC<MoneyPanelProps> = ({
  collectedThisMonth,
  collectedPrevMonth,
  bookedThisMonth,
  totalOutstanding,
  bookingsWithBalanceCount,
  collectionsChart,
}) => {
  const [period, setPeriod] = useState<'thisMonth' | 'allTime'>('thisMonth');

  // Delta calculation: ONLY show if previous period has real, nonzero data
  let delta: { value: string; positive: boolean } | null = null;
  if (collectedPrevMonth > 0) {
    const diffPct = Math.round(((collectedThisMonth - collectedPrevMonth) / collectedPrevMonth) * 100);
    delta = {
      value: `${diffPct >= 0 ? '+' : ''}${diffPct}% vs last month`,
      positive: diffPct >= 0,
    };
  }

  // Progress bar calculation
  const bookedBase = Math.max(bookedThisMonth, collectedThisMonth + totalOutstanding);
  const collectedPct = bookedBase > 0 ? Math.min(100, Math.round((collectedThisMonth / bookedBase) * 100)) : 0;
  const outstandingPct = bookedBase > 0 ? Math.min(100, Math.round((totalOutstanding / bookedBase) * 100)) : 0;

  // Chart data
  const chartData = collectionsChart.map((c) => {
    const [y, m, d] = c.date.split('-');
    return {
      date: `${d}/${m}`,
      amount: c.amount,
      count: c.count,
    };
  });

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#0E1726]">Money</h2>
          <p className="text-xs text-[#64748B] mt-0.5">This month (cash collected & active dues)</p>
        </div>

        <Link
          to="/app/reports"
          className="text-xs font-medium text-[#0D5C4D] hover:underline"
        >
          Open reports &rarr;
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px]">
          <div className="text-xs text-[#64748B] font-medium mb-1">COLLECTED</div>
          <div className="text-lg font-semibold text-[#0E1726] tabular-nums">
            <Money amount={collectedThisMonth} />
          </div>
          {delta && (
            <div
              className={`text-[11px] font-medium mt-1 ${
                delta.positive ? 'text-[#067647]' : 'text-[#B42318]'
              }`}
            >
              {delta.value}
            </div>
          )}
        </div>

        <div className="p-3 bg-[#FEF3C7]/40 border border-[#F5D58A] rounded-[6px]">
          <div className="text-xs text-[#B45309] font-medium mb-1">OUTSTANDING</div>
          <div className="text-lg font-semibold text-[#B45309] tabular-nums">
            <Money amount={totalOutstanding} />
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Across {bookingsWithBalanceCount} bookings
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#64748B] mb-1.5 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D5C4D]" />
            Collected ({collectedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B45309]" />
            Outstanding ({outstandingPct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden flex">
          <div
            className="bg-[#0D5C4D] h-full transition-all duration-300"
            style={{ width: `${collectedPct}%` }}
          />
          <div
            className="bg-[#B45309] h-full transition-all duration-300"
            style={{ width: `${outstandingPct}%` }}
          />
        </div>
      </div>

      {/* Daily Collections Chart */}
      <div className="pt-2">
        <div className="text-xs font-medium text-[#64748B] mb-2">
          Collections per day
        </div>
        {chartData.length > 0 ? (
          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                />
                <Tooltip
                  formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collected']}
                  contentStyle={{
                    backgroundColor: '#0E1726',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0D5C4D"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0D5C4D' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-[#64748B]">
            No payments recorded yet this month.
          </div>
        )}
      </div>
    </div>
  );
};
