import React from 'react';
import { CreditCard, Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { fmtINR } from '../../../lib/utils/formatters';

interface PaymentBreakdownProps {
  totalBookingValue: number;
  totalCollected: number;
  totalOutstanding: number;
  totalRefunded: number;
}

export default function PaymentBreakdownCard({
  totalBookingValue,
  totalCollected,
  totalOutstanding,
  totalRefunded,
}: PaymentBreakdownProps) {
  const collectedPct = totalBookingValue > 0 ? Math.round((totalCollected / totalBookingValue) * 100) : 0;
  const outstandingPct = totalBookingValue > 0 ? Math.round((totalOutstanding / totalBookingValue) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Payment & Settlement Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Collection efficiency across active reservations
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {collectedPct}% Collected
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mb-5">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span>Portfolio Booking Value: <strong className="text-slate-900 tabular-nums">{fmtINR(totalBookingValue)}</strong></span>
            <span className="text-slate-500">{collectedPct}% cleared</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, collectedPct)}%` }}
              title={`Collected: ${collectedPct}%`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, outstandingPct)}%` }}
              title={`Outstanding: ${outstandingPct}%`}
            />
          </div>
        </div>

        {/* Breakdown Values */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
            <div className="text-[11px] font-medium text-emerald-900">Total Collected</div>
            <div className="text-base sm:text-lg font-bold text-emerald-950 mt-1 tabular-nums truncate">
              {fmtINR(totalCollected)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              UPI, Card & Cash
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80">
            <div className="text-[11px] font-medium text-amber-900">Outstanding Due</div>
            <div className="text-base sm:text-lg font-bold text-amber-950 mt-1 tabular-nums truncate">
              {fmtINR(totalOutstanding)}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">
              Pending at desk
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-medium text-slate-600">Refunds Logged</div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 tabular-nums truncate">
              {fmtINR(totalRefunded)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Reconciled adjustments
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Multi-mode tracking: UPI · Card POS · Cash · Bank NEFT</span>
        <span className="font-semibold text-slate-700">Audit Ready</span>
      </div>
    </div>
  );
}
