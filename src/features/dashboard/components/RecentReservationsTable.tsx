import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Booking } from '../../../lib/repository/types';
import { fmtINR, fmtDate } from '../../../lib/utils/formatters';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface RecentReservationsProps {
  bookings: Booking[];
}

export default function RecentReservationsTable({ bookings }: RecentReservationsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Reservations Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest guest bookings across the property portfolio
          </p>
        </div>
        <Link
          to="/app/bookings"
          className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
        >
          View all bookings →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
              <th className="py-2.5 px-3 font-semibold">Guest</th>
              <th className="py-2.5 px-3 font-semibold">Booking #</th>
              <th className="py-2.5 px-3 font-semibold">Property</th>
              <th className="py-2.5 px-3 font-semibold">Stay Dates</th>
              <th className="py-2.5 px-3 font-semibold">Room / Unit</th>
              <th className="py-2.5 px-3 font-semibold text-right">Grand Total</th>
              <th className="py-2.5 px-3 font-semibold text-center">Payment</th>
              <th className="py-2.5 px-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.slice(0, 6).map((b) => {
              const guestName = b.customer?.name || 'Guest';
              const initials = guestName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              const isPaid = b.payment_status === 'Paid' || b.payment_status === 'Fully Paid';
              const isPartial = b.payment_status === 'Partially Paid';

              return (
                <tr
                  key={b.id}
                  onClick={() => navigate(`/app/bookings/${b.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Guest with avatar initials */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {guestName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.customer?.phone || 'Direct'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Booking # */}
                  <td className="py-3 px-3 font-mono font-medium text-slate-600">
                    {b.booking_no}
                  </td>

                  {/* Property */}
                  <td className="py-3 px-3 text-slate-600">
                    <div className="truncate max-w-[140px]">{b.property?.name || '—'}</div>
                  </td>

                  {/* Stay Dates */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    <div>
                      {fmtDate(b.check_in)} → {fmtDate(b.check_out)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {b.nights} {b.nights === 1 ? 'night' : 'nights'} · {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                    </div>
                  </td>

                  {/* Room */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">
                      {b.room_number ? `Room ${b.room_number}` : b.room_type}
                    </span>
                    {b.room_number && (
                      <div className="text-[10px] text-slate-400">{b.room_type}</div>
                    )}
                  </td>

                  {/* Grand Total */}
                  <td className="py-3 px-3 text-right font-semibold text-slate-900 tabular-nums">
                    {fmtINR(b.grand_total)}
                  </td>

                  {/* Payment Badge */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isPartial
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {b.payment_status}
                    </span>
                  </td>

                  {/* Booking Status */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        b.booking_status === 'Checked In'
                          ? 'bg-emerald-100 text-emerald-900'
                          : b.booking_status === 'Confirmed'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {b.booking_status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
