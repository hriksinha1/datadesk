import React from 'react';
import { CalendarDays, Users, ArrowDownRight, ArrowUpRight, AlertCircle } from 'lucide-react';
import { fmtINR } from '../../../lib/utils/formatters';

interface BookingMetricsBarProps {
  totalCount: number;
  inHouseCount: number;
  arrivalsTodayCount: number;
  departuresTodayCount: number;
  outstandingBalance: number;
}

export default function BookingMetricsBar({
  totalCount,
  inHouseCount,
  arrivalsTodayCount,
  departuresTodayCount,
  outstandingBalance,
}: BookingMetricsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <span className="text-[11px] font-medium text-slate-500">Total Bookings</span>
        <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
          {totalCount}
        </div>
        <span className="text-[10px] text-slate-400">All registered</span>
      </div>

      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <span className="text-[11px] font-medium text-emerald-800">In-House Stays</span>
        <div className="text-xl font-bold text-emerald-950 mt-0.5 tabular-nums">
          {inHouseCount}
        </div>
        <span className="text-[10px] text-emerald-700">Currently staying</span>
      </div>

      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <span className="text-[11px] font-medium text-blue-800">Arriving Today</span>
        <div className="text-xl font-bold text-blue-950 mt-0.5 tabular-nums">
          {arrivalsTodayCount}
        </div>
        <span className="text-[10px] text-blue-700">Due for check-in</span>
      </div>

      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <span className="text-[11px] font-medium text-slate-700">Departing Today</span>
        <div className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
          {departuresTodayCount}
        </div>
        <span className="text-[10px] text-slate-500">Checkout schedule</span>
      </div>

      <div className="p-3 bg-white border border-amber-200 rounded-xl shadow-2xs bg-amber-50/20 col-span-2 sm:col-span-1">
        <span className="text-[11px] font-semibold text-amber-900">Total Due</span>
        <div className="text-xl font-bold text-amber-900 mt-0.5 tabular-nums truncate">
          {fmtINR(outstandingBalance)}
        </div>
        <span className="text-[10px] text-amber-700 font-medium">Pending collection</span>
      </div>
    </div>
  );
}
