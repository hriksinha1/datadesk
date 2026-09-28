import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { OccupancyDaySeries } from '../../../lib/analytics';
import { ChartCard } from '../../../components/ui/ChartCard';

interface OccupancyForecastCardProps {
  data: OccupancyDaySeries[];
  hasUnits: boolean;
}

export const OccupancyForecastCard: React.FC<OccupancyForecastCardProps> = ({
  data,
  hasUnits,
}) => {
  if (!hasUnits) {
    return (
      <ChartCard
        title="Occupancy — next 14 days"
        subtitle="Based on reservations"
        empty
        emptyMessage="Rooms not configured for this property."
        actions={
          <Link to="/app/properties" className="text-xs text-[#0D5C4D] font-medium hover:underline">
            Set up rooms &rarr;
          </Link>
        }
      >
        <div />
      </ChartCard>
    );
  }

  const chartData = data.map((d) => ({
    name: d.dayLabel,
    pct: d.occupancyPct || 0,
    occupied: d.occupied,
    total: d.totalUnits,
    isToday: d.isToday,
    rawDate: d.date,
  }));

  const dataTable = (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-[#E4E7EC] text-[#64748B]">
          <th className="py-1 text-left">Date</th>
          <th className="py-1 text-right">Occupancy %</th>
          <th className="py-1 text-right">Booked Units</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E4E7EC]">
        {chartData.map((r) => (
          <tr key={r.rawDate} className={r.isToday ? 'bg-[#EAF4F1]/60 font-semibold' : ''}>
            <td className="py-1">{r.name} {r.isToday ? '(Today)' : ''}</td>
            <td className="py-1 text-right tabular-nums">{r.pct}%</td>
            <td className="py-1 text-right tabular-nums">{r.occupied} / {r.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      title="Occupancy — next 14 days"
      subtitle="Based on reservations"
      dataTable={dataTable}
    >
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(val: unknown, _name: unknown, props: unknown) => {
                const p = props as { payload: { occupied: number; total: number } };
                return [`${val}% (${p.payload.occupied} of ${p.payload.total} units)`, 'Occupancy'];
              }}
              contentStyle={{
                backgroundColor: '#0E1726',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? '#0D5C4D' : '#94A3B8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
