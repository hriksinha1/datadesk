import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useReportsModel, useWorkspaceData } from '../../context/WorkspaceDataContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/FormControls';
import { StatStrip, StatCell } from '../../components/ui/StatStrip';
import { ChartCard } from '../../components/ui/ChartCard';
import { Money, DateText } from '../../components/ui/Typography';
import { useToast } from '../../components/ui/Toast';

export default function ReportsList() {
  const { showToast } = useToast();
  const [periodPreset, setPeriodPreset] = useState<
    'thisMonth' | 'lastMonth' | 'last30' | 'thisQuarter' | 'allTime'
  >('thisMonth');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [expandedPaymentMethod, setExpandedPaymentMethod] = useState<string | null>(null);

  const reports = useReportsModel(periodPreset);

  const { summary, range, collectionsTrend, mix, topDebtors, rollups, scopedUnitsCount } = reports;

  // Comparison delta for summary
  const collectionDelta = useMemo(() => {
    if (!compareEnabled || !summary.hasCompData || summary.compCollected <= 0) return undefined;
    const diffPct = Math.round(
      ((summary.collected - summary.compCollected) / summary.compCollected) * 100
    );
    return {
      value: `${diffPct >= 0 ? '+' : ''}${diffPct}% vs prev`,
      positive: diffPct >= 0,
    };
  }, [compareEnabled, summary.hasCompData, summary.compCollected, summary.collected]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Report Section',
      'Metric / Item',
      'Value (INR or Count)',
      'Basis / Notes',
    ];

    const rows = [
      ['Summary', 'Booked Value', summary.bookedValue, range.label],
      ['Summary', 'Collected Net', summary.netCollected, range.label],
      ['Summary', 'Outstanding Active', summary.outstanding, 'As of today'],
      ['Summary', 'Refunded', summary.refunded, range.label],
      ['Summary', 'Total Bookings', summary.bookingsCount, range.label],
      ['Summary', 'Average Booking Value', summary.avgBookingValue, range.label],
      ['Summary', 'Average Stay Nights', summary.avgStayNights, range.label],
      ...topDebtors.map((d) => [
        'Top Debtors',
        `${d.booking.customer?.name} (${d.booking.booking_no})`,
        d.balanceDue,
        `${d.daysPastCheckout > 0 ? `${d.daysPastCheckout} days overdue` : 'In stay'}`,
      ]),
      ...mix.items.map((m) => [
        'Payment Mix',
        m.method,
        m.amount,
        `${m.percentage}% (${m.count} payments)`,
      ]),
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial_report_${range.startDate}_to_${range.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({ message: `Exported ${range.label} report to CSV`, type: 'success' });
  };

  // Stacked chart data for property dues
  const propertyDuesChartData = useMemo(() => {
    return rollups.map((r) => ({
      name: r.property.name,
      collected: r.collected,
      outstanding: r.outstanding,
      total: r.bookedValue,
    }));
  }, [rollups]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Controls */}
      <PageHeader
        title="Financial & Operations Reports"
        scopeLabel={
          reports.activeProperty
            ? reports.activeProperty.name
            : `All properties · ${rollups.length}`
        }
        subtitle={`Period: ${range.label} (${range.startDate} to ${range.endDate}) · Cash basis and realized folios`}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period selector */}
            <Select
              value={periodPreset}
              onChange={(e) =>
                setPeriodPreset(
                  e.target.value as 'thisMonth' | 'lastMonth' | 'last30' | 'thisQuarter' | 'allTime'
                )
              }
              aria-label="Select report time window"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="allTime">All Time</option>
            </Select>

            {/* Compare Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-[#64748B] bg-white border border-[#E4E7EC] hover:border-[#CBD2DC] px-2.5 h-9 rounded-[6px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compareEnabled}
                onChange={(e) => setCompareEnabled(e.target.checked)}
                className="rounded text-[#0D5C4D]"
              />
              <span>Compare previous</span>
            </label>

            {/* Real Export Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* 2. Summary Strip (5 cells) */}
      <StatStrip>
        <StatCell
          label="BOOKED VALUE"
          value={<Money amount={summary.bookedValue} />}
          caption={`${summary.bookingsCount} reservations in period`}
        />

        <StatCell
          label="COLLECTED (NET)"
          value={<Money amount={summary.netCollected} />}
          delta={collectionDelta}
          caption={
            summary.refunded > 0 ? (
              <span>₹{summary.collected.toLocaleString('en-IN')} collected · ₹{summary.refunded.toLocaleString('en-IN')} refunded</span>
            ) : (
              <span>Realized cash payments</span>
            )
          }
        />

        <StatCell
          label="OUTSTANDING AS OF TODAY"
          value={
            <span className={summary.outstanding > 0 ? 'text-[#B45309]' : 'text-[#0E1726]'}>
              <Money amount={summary.outstanding} />
            </span>
          }
          caption="Unsettled balances across active stays"
        />

        <StatCell
          label="AVERAGE BOOKING VALUE"
          value={<Money amount={summary.avgBookingValue} />}
          caption={`Avg stay: ${summary.avgStayNights} nights`}
        />
      </StatStrip>

      {/* 3. "How much came in, and when?" Collections Line Chart */}
      <ChartCard
        title="How much came in, and when?"
        subtitle={`Daily payment collections during ${range.label}`}
        empty={collectionsTrend.length === 0}
        emptyMessage="No payments recorded in this selected period."
      >
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={collectionsTrend}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const parts = val.split('-');
                  return `${parts[2]}/${parts[1]}`;
                }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                width={45}
              />
              <Tooltip
                formatter={(val: unknown) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collections']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#0E1726',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                name="Collections"
                stroke="#0D5C4D"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0D5C4D' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 4. "Where is money still due?" (Multi-property stacked breakdown) */}
      {reports.scopeIsAll && rollups.length > 1 && (
        <ChartCard
          title="Where is money still due?"
          subtitle="Collected payments vs. outstanding folios by property"
        >
          <div className="w-full h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={propertyDuesChartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E7EC" />
                <XAxis
                  type="number"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#0E1726"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  formatter={(val: unknown) => `₹${Number(val).toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: '#0E1726',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                />
                <Bar dataKey="collected" name="Collected" stackId="a" fill="#0D5C4D" radius={[0, 0, 0, 0]} />
                <Bar dataKey="outstanding" name="Outstanding" stackId="a" fill="#B45309" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}

      {/* 5. "Who owes us, and for how long?" Table */}
      <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-3">
          <div>
            <h3 className="text-base font-semibold text-[#0E1726]">Who owes us, and for how long?</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Top unsettled guest folios ranked by balance</p>
          </div>
        </div>

        {topDebtors.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#64748B]">
            No outstanding balances found for bookings in this period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="h-9 bg-[#F7F8FA] border-b border-[#E4E7EC] text-[#64748B] font-medium text-xs">
                  <th className="pl-3 pr-4">Guest</th>
                  <th className="px-3">Room / Unit</th>
                  <th className="px-3">Check-out</th>
                  <th className="px-3">Aging category</th>
                  <th className="pr-3 pl-3 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {topDebtors.map((d) => {
                  let agingLabel = 'In stay / Not departed';
                  let agingBadge = 'bg-[#F7F8FA] text-[#64748B]';

                  if (d.daysPastCheckout > 30) {
                    agingLabel = `${d.daysPastCheckout}d (30+ days overdue)`;
                    agingBadge = 'bg-[#FEF3F2] text-[#B42318] font-semibold';
                  } else if (d.daysPastCheckout > 7) {
                    agingLabel = `${d.daysPastCheckout}d (8–30 days overdue)`;
                    agingBadge = 'bg-[#FEF3C7] text-[#B45309] font-medium';
                  } else if (d.daysPastCheckout > 0) {
                    agingLabel = `${d.daysPastCheckout}d (0–7 days overdue)`;
                    agingBadge = 'bg-[#FFFBEB] text-[#B45309]';
                  }

                  return (
                    <tr key={d.booking.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="py-2.5 pl-3 pr-4">
                        <Link
                          to={`/app/bookings/${d.booking.id}`}
                          className="font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
                        >
                          {d.booking.customer?.name || 'Guest'}
                        </Link>
                        <div className="font-mono text-xs text-[#64748B]">{d.booking.booking_no}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        {d.booking.room_number ? `Room ${d.booking.room_number}` : d.booking.room_type}
                      </td>

                      <td className="py-2.5 px-3">
                        <DateText date={d.booking.check_out} format="short" />
                      </td>

                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-xs ${agingBadge}`}>
                          {agingLabel}
                        </span>
                      </td>

                      <td className="py-2.5 pr-3 pl-3 text-right font-semibold text-[#B42318] tabular-nums">
                        <Money amount={d.balanceDue} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. "How are guests paying?" Payment Mix Breakdown */}
      <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#0E1726]">How are guests paying?</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Normalized collection channels ({mix.totalAmount > 0 ? `Total: ₹${mix.totalAmount.toLocaleString('en-IN')}` : 'No payments'})
            </p>
          </div>
        </div>

        {mix.items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#64748B]">
            No payment transactions recorded during this period.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Visual Bars (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              {mix.items.map((m) => (
                <div key={m.method} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium text-[#0E1726]">{m.method}</span>
                    <span className="tabular-nums font-semibold text-[#0E1726]">
                      <Money amount={m.amount} /> ({m.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#E4E7EC] rounded-full overflow-hidden">
                    <div
                      className="bg-[#0D5C4D] h-full rounded-full transition-all duration-300"
                      style={{ width: `${m.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Method Details Table (5 cols) */}
            <div className="md:col-span-5 border border-[#E4E7EC] rounded-[6px] p-3 text-xs divide-y divide-[#E4E7EC] self-start bg-[#F7F8FA]">
              <div className="pb-2 font-semibold text-[#0E1726]">Channel Breakdown</div>
              {mix.items.map((m) => {
                const isExpanded = expandedPaymentMethod === m.method;
                const rawKeys = Object.keys(m.rawMethods);

                return (
                  <div key={m.method} className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-[#0E1726]">{m.method}</span>
                        <span className="text-[#64748B] ml-1.5">({m.count} txns)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums text-[#0E1726]">
                          <Money amount={m.amount} />
                        </span>
                        {rawKeys.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setExpandedPaymentMethod(isExpanded ? null : m.method)}
                            className="p-0.5 text-[#64748B] hover:text-[#0E1726]"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Raw sub-methods if expanded */}
                    {isExpanded && (
                      <div className="mt-1.5 pl-3 space-y-1 text-[11px] text-[#64748B] border-l-2 border-[#CBD2DC]">
                        {Object.entries(m.rawMethods).map(([rawName, amt]) => (
                          <div key={rawName} className="flex justify-between">
                            <span>{rawName}</span>
                            <span className="tabular-nums font-medium text-[#0E1726]">
                              <Money amount={amt} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. Collapsible Definitions */}
      <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-[8px] p-4 text-xs">
        <button
          type="button"
          onClick={() => setShowDefinitions(!showDefinitions)}
          className="w-full flex items-center justify-between text-left font-semibold text-[#0E1726] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#64748B]" />
            <span>Accounting & Operational Metric Definitions</span>
          </div>
          {showDefinitions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDefinitions && (
          <div className="mt-3 pt-3 border-t border-[#E4E7EC] grid grid-cols-1 md:grid-cols-2 gap-3 text-[#334155] leading-relaxed">
            <div>
              <strong className="text-[#0E1726]">Collected:</strong> Sum of payments recorded with status Recorded or Completed whose date falls within the selected period window.
            </div>
            <div>
              <strong className="text-[#0E1726]">Refunded & Net:</strong> Sum of payments with status Refunded in the date window. Net collected equals Collected minus Refunded.
            </div>
            <div>
              <strong className="text-[#0E1726]">Booked Value:</strong> Sum of grand totals of all non-cancelled reservations whose check-in date falls in the selected period.
            </div>
            <div>
              <strong className="text-[#0E1726]">Outstanding:</strong> As of today, sum per non-cancelled booking of (grand_total − netPaid) for all bookings with check-in on or before period end.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
