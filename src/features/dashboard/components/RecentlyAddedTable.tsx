import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../../lib/repository/types';
import { Money, DateText } from '../../../components/ui/Typography';
import { BalanceCell, StatusBadge } from '../../../components/ui/Badges';
import { BookingPaymentSummary } from '../../../lib/utils/financials';

interface RecentlyAddedTableProps {
  bookings: Booking[];
  balancesByBookingId: Record<string, BookingPaymentSummary>;
}

export const RecentlyAddedTable: React.FC<RecentlyAddedTableProps> = ({
  bookings,
  balancesByBookingId,
}) => {
  const recent = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-3">
        <h2 className="text-base font-semibold text-[#0E1726]">Recently created bookings</h2>
        <Link to="/app/bookings" className="text-xs font-medium text-[#0D5C4D] hover:underline">
          View all bookings &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="h-9 bg-[#F7F8FA] border-b border-[#E4E7EC] text-[#64748B] font-medium text-xs">
              <th className="pl-3 pr-4">Guest</th>
              <th className="px-3">Stay</th>
              <th className="px-3">Room</th>
              <th className="px-3">Status</th>
              <th className="px-3 text-right">Total</th>
              <th className="pr-3 pl-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC]">
            {recent.map((b) => {
              const bal = balancesByBookingId[b.id]?.balanceDue || 0;
              return (
                <tr key={b.id} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="py-2.5 pl-3 pr-4">
                    <Link
                      to={`/app/bookings/${b.id}`}
                      className="font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
                    >
                      {b.customer?.name || 'Guest'}
                    </Link>
                    <div className="font-mono text-xs text-[#64748B]">{b.booking_no}</div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <DateText date={b.check_in} format="short" /> &rarr;{' '}
                    <DateText date={b.check_out} format="short" />
                  </td>
                  <td className="py-2.5 px-3">
                    {b.room_number ? `Room ${b.room_number}` : b.room_type}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={b.booking_status} />
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-medium text-[#0E1726]">
                    <Money amount={b.grand_total} />
                  </td>
                  <td className="py-2.5 pr-3 pl-3 text-right">
                    <BalanceCell balanceDue={bal} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
