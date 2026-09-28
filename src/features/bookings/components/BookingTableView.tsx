import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Booking } from '../../../lib/repository/types';
import { fmtINR, fmtDate } from '../../../lib/utils/formatters';
import { ChevronRight, ExternalLink, Calendar, User, Building } from 'lucide-react';

interface BookingTableViewProps {
  bookings: Booking[];
  paymentsByBooking: Record<string, number>;
}

export default function BookingTableView({ bookings, paymentsByBooking }: BookingTableViewProps) {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Calendar size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No reservations match your criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try clearing search filters or add a new booking for your property.
        </p>
        <div className="mt-4">
          <Link
            to="/app/bookings/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
          >
            Create New Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4">Guest</th>
              <th className="py-3 px-3">Booking #</th>
              <th className="py-3 px-3">Property</th>
              <th className="py-3 px-3">Stay Dates</th>
              <th className="py-3 px-3">Room / Unit</th>
              <th className="py-3 px-3 text-right">Grand Total</th>
              <th className="py-3 px-3 text-right">Balance Due</th>
              <th className="py-3 px-3 text-center">Payment</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((b) => {
              const guestName = b.customer?.name || 'Guest';
              const initials = guestName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              const paidAmount = paymentsByBooking[b.id] || 0;
              const dueAmount = Math.max(0, Number(b.grand_total) - paidAmount);
              const isPaid = b.payment_status === 'Paid' || b.payment_status === 'Fully Paid';
              const isPartial = b.payment_status === 'Partially Paid';

              return (
                <tr
                  key={b.id}
                  onClick={() => navigate(`/app/bookings/${b.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Guest Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {guestName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {b.customer?.phone || b.customer?.email || 'Direct Walk-in'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Booking Number */}
                  <td className="py-3.5 px-3 font-mono font-medium text-slate-600">
                    {b.booking_no}
                  </td>

                  {/* Property */}
                  <td className="py-3.5 px-3 text-slate-600">
                    <div className="truncate max-w-[130px] font-medium text-slate-800">
                      {b.property?.name || '—'}
                    </div>
                  </td>

                  {/* Stay Dates */}
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {fmtDate(b.check_in)} → {fmtDate(b.check_out)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {b.nights} {b.nights === 1 ? 'night' : 'nights'} · {b.guests} {b.guests === 1 ? 'guest' : 'guests'}
                    </div>
                  </td>

                  {/* Room / Unit */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">
                      {b.room_number ? `Room ${b.room_number}` : b.room_type}
                    </div>
                    {b.room_number && (
                      <div className="text-[10px] text-slate-400">{b.room_type}</div>
                    )}
                  </td>

                  {/* Grand Total */}
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                    {fmtINR(b.grand_total)}
                  </td>

                  {/* Balance Due */}
                  <td className="py-3.5 px-3 text-right tabular-nums">
                    {dueAmount > 0 ? (
                      <span className="font-bold text-amber-800">{fmtINR(dueAmount)}</span>
                    ) : (
                      <span className="text-slate-400">₹0</span>
                    )}
                  </td>

                  {/* Payment Status Badge */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
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

                  {/* Booking Status Badge */}
                  <td className="py-3.5 px-3 text-center">
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

                  {/* 1-Click Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/bookings/${b.id}`);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-slate-100"
                    >
                      <span>Folio</span>
                      <ChevronRight size={13} />
                    </button>
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
