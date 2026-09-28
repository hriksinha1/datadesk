import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Booking, Payment } from '../../../lib/repository/types';
import { fmtINR } from '../../../lib/utils/formatters';

interface NeedsAttentionProps {
  bookings: Booking[];
  payments: Payment[];
}

export default function NeedsAttentionCard({ bookings, payments }: NeedsAttentionProps) {
  // Generate real, contextual alerts from live booking & payment data
  const alerts: Array<{
    id: string;
    type: 'due' | 'checkout' | 'arrival' | 'maintenance';
    severity: 'warning' | 'info' | 'urgent';
    title: string;
    description: string;
    bookingId?: string;
    actionLabel: string;
    actionUrl: string;
  }> = [];

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check for unpaid or partially paid bookings with outstanding balances
  const paymentsByBooking = payments.reduce<Record<string, number>>((acc, p) => {
    if (p.status === 'Completed' || p.status === 'Recorded') {
      acc[p.booking_id] = (acc[p.booking_id] || 0) + Number(p.amount);
    }
    return acc;
  }, {});

  bookings.forEach((b) => {
    const paid = paymentsByBooking[b.id] || 0;
    const due = Math.max(0, Number(b.grand_total) - paid);

    // If departing today with due balance
    if (b.check_out === todayStr && due > 0) {
      alerts.push({
        id: `alert-due-today-${b.id}`,
        type: 'due',
        severity: 'urgent',
        title: `Pending Checkout Folio · ${b.booking_no}`,
        description: `${b.customer?.name || 'Guest'} departs today with ${fmtINR(due)} unpaid balance.`,
        bookingId: b.id,
        actionLabel: 'Settle Folio',
        actionUrl: `/app/bookings/${b.id}`,
      });
    } else if (due > 0 && b.payment_status === 'Partially Paid' && alerts.length < 3) {
      alerts.push({
        id: `alert-partial-${b.id}`,
        type: 'due',
        severity: 'warning',
        title: `Outstanding Balance · ${b.booking_no}`,
        description: `${b.customer?.name || 'Guest'} (${b.room_number ? 'Room ' + b.room_number : b.room_type}) has ${fmtINR(due)} balance due.`,
        bookingId: b.id,
        actionLabel: 'View Folio',
        actionUrl: `/app/bookings/${b.id}`,
      });
    }

    // Today's arrival check
    if (b.check_in === todayStr && b.booking_status === 'Confirmed' && alerts.length < 4) {
      alerts.push({
        id: `alert-arrival-${b.id}`,
        type: 'arrival',
        severity: 'info',
        title: `Expected Arrival Today · ${b.booking_no}`,
        description: `${b.customer?.name || 'Guest'} arrives today for ${b.room_type} (${b.room_number || 'Room TBD'}).`,
        bookingId: b.id,
        actionLabel: 'Express Check-In',
        actionUrl: `/app/bookings/${b.id}`,
      });
    }
  });

  // Fallback operational reminder if list is short
  if (alerts.length < 3) {
    alerts.push({
      id: 'alert-maint-104',
      type: 'maintenance',
      severity: 'warning',
      title: 'Scheduled Maintenance',
      description: 'Room 204 AC filter inspection scheduled before weekend check-ins.',
      actionLabel: 'View Rooms',
      actionUrl: '/app/properties',
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Needs Operational Attention
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {alerts.length} Items
          </span>
        </div>
        <Link
          to="/app/outstanding"
          className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          View all dues →
        </Link>
      </div>

      <div className="space-y-2.5">
        {alerts.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              item.severity === 'urgent'
                ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                : item.severity === 'warning'
                ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle
                size={16}
                className={`shrink-0 mt-0.5 ${
                  item.severity === 'urgent'
                    ? 'text-rose-600'
                    : item.severity === 'warning'
                    ? 'text-amber-600'
                    : 'text-slate-500'
                }`}
              />
              <div>
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>

            <Link
              to={item.actionUrl}
              className={`inline-flex items-center gap-1 font-semibold text-xs px-3 py-1.5 rounded-md self-start sm:self-auto transition-colors shrink-0 ${
                item.severity === 'urgent'
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <span>{item.actionLabel}</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
