import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Booking } from '../../../lib/repository/types';
import { stayLengthBuckets, cancellationRate } from '../../../lib/analytics';
import { ChartCard } from '../../../components/ui/ChartCard';
import { StatStrip, StatCell } from '../../../components/ui/StatStrip';

interface BookingAnalyticsViewProps {
  bookings: Booking[];
}

export const BookingAnalyticsView: React.FC<BookingAnalyticsViewProps> = ({ bookings }) => {
  const nonCancelled = useMemo(
    () => bookings.filter((b) => b.booking_status !== 'Cancelled'),
    [bookings]
  );

  // 1. Weekly arrivals for 12 weeks
  const weeklyArrivals = useMemo(() => {
    const buckets: Record<string, { label: string; count: number; nights: number }> = {};
    const now = new Date();

    // Generate 12 past weeks
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const weekKey = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6) / 7)}`;
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      buckets[weekKey] = { label, count: 0, nights: 0 };
    }

    for (const b of nonCancelled) {
      const bDate = new Date(b.check_in);
      const diffDays = Math.floor((now.getTime() - bDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays >= 0 && diffDays < 84) {
        const weekIdx = Math.floor(diffDays / 7);
        const d = new Date(now);
        d.setDate(d.getDate() - weekIdx * 7);
        const weekKey = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6) / 7)}`;
        if (buckets[weekKey]) {
          buckets[weekKey].count += 1;
          buckets[weekKey].nights += b.nights || 1;
        }
      }
    }

    return Object.values(buckets);
  }, [nonCancelled]);

  // 2. Stay duration distribution
  const stayDistribution = useMemo(() => stayLengthBuckets(bookings), [bookings]);

  // 3. Unit types booked most
  const unitTypePopularity = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of nonCancelled) {
      const t = b.room_type || 'Standard';
      map[t] = (map[t] || 0) + 1;
    }
    const total = nonCancelled.length;
    return Object.entries(map)
      .map(([type, count]) => ({
        type,
        count,
        share: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [nonCancelled]);

  // 4. Compact metrics
  const avgStay = useMemo(() => {
    if (nonCancelled.length === 0) return 0;
    const sum = nonCancelled.reduce((acc, curr) => acc + (curr.nights || 1), 0);
    return Number((sum / nonCancelled.length).toFixed(1));
  }, [nonCancelled]);

  const avgGuests = useMemo(() => {
    if (nonCancelled.length === 0) return 0;
    const sum = nonCancelled.reduce((acc, curr) => acc + (curr.guests || 1), 0);
    return Number((sum / nonCancelled.length).toFixed(1));
  }, [nonCancelled]);

  const canc = useMemo(() => cancellationRate(bookings), [bookings]);

  return (
    <div className="space-y-6">
      {/* Summary KPI Strip */}
      <StatStrip>
        <StatCell
          label="AVERAGE STAY DURATION"
          value={<span>{avgStay} nights</span>}
          caption="Per non-cancelled reservation"
        />
        <StatCell
          label="AVERAGE GUESTS"
          value={<span>{avgGuests} guests</span>}
          caption="Party size per booking"
        />
        <StatCell
          label="CANCELLATION RATE"
          value={<span className={canc.ratePct > 15 ? 'text-[#B45309]' : 'text-[#0E1726]'}>{canc.ratePct}%</span>}
          caption={`${canc.cancelledCount} of ${canc.totalBookings} total bookings`}
        />
        <StatCell
          label="ACTIVE BOOKINGS"
          value={<span>{nonCancelled.length}</span>}
          caption="Excluding cancelled reservations"
        />
      </StatStrip>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly arrivals */}
        <ChartCard
          title="How many bookings arrive each week?"
          subtitle="Past 12 weeks of check-in activity"
          empty={weeklyArrivals.length === 0}
        >
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyArrivals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: unknown) => [`${val} arrivals`, 'Bookings']}
                  contentStyle={{
                    backgroundColor: '#0E1726',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#0D5C4D" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Stay duration buckets */}
        <ChartCard
          title="How long do guests stay?"
          subtitle="Distribution of length of stay across reservations"
          empty={stayDistribution.length === 0}
        >
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stayDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: unknown, _name: unknown, props: unknown) => {
                    const p = props as { payload: { share: number } };
                    return [`${val} stays (${p.payload.share}%)`, 'Volume'];
                  }}
                  contentStyle={{
                    backgroundColor: '#0E1726',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#334155" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Unit type popularity */}
        <ChartCard
          title="Which unit types are booked most?"
          subtitle="Reservations ranked by room category"
          className="lg:col-span-2"
          empty={unitTypePopularity.length === 0}
        >
          <div className="space-y-3 py-2">
            {unitTypePopularity.map((item) => (
              <div key={item.type} className="flex items-center gap-4 text-xs sm:text-sm">
                <span className="w-36 font-medium text-[#0E1726] truncate">{item.type}</span>
                <div className="flex-1 bg-[#E4E7EC] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0D5C4D] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
                <span className="w-20 text-right tabular-nums text-[#64748B]">
                  {item.count} ({item.share}%)
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default BookingAnalyticsView;
