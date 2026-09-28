import React from 'react';
import { 
  BedDouble, 
  ArrowDownRight, 
  ArrowUpRight, 
  Users, 
  Wallet, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { fmtINR } from '../../../lib/utils/formatters';

interface TodaySummaryProps {
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  arrivalsToday: number;
  arrivalsCompleted: number;
  departuresToday: number;
  departuresCompleted: number;
  inHouseGuests: number;
  totalRevenue: number;
  revenueChangePct: number;
  outstandingBalance: number;
  outstandingBookingsCount: number;
}

export default function TodayAtAGlance({
  occupancyRate,
  totalRooms,
  occupiedRooms,
  arrivalsToday,
  arrivalsCompleted,
  departuresToday,
  departuresCompleted,
  inHouseGuests,
  totalRevenue,
  revenueChangePct,
  outstandingBalance,
  outstandingBookingsCount,
}: TodaySummaryProps) {
  const pendingArrivals = Math.max(0, arrivalsToday - arrivalsCompleted);
  const pendingDepartures = Math.max(0, departuresToday - departuresCompleted);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase font-bold tracking-wider text-slate-500">
          Today at a Glance · Real-time Operations
        </h2>
        <span className="text-[11px] text-slate-400">
          Last updated just now
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Occupancy Card (Primary operational metric) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Occupancy</span>
            <BedDouble size={15} className="text-emerald-700" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {occupancyRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {occupiedRooms} of {totalRooms} units
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, occupancyRate)}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Arrivals Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Arrivals</span>
            <ArrowDownRight size={15} className="text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {arrivalsToday}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {pendingArrivals > 0 ? (
                <span className="text-blue-700 font-medium">{pendingArrivals} pending check-in</span>
              ) : (
                <span className="text-emerald-700 font-medium">All checked in</span>
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock size={11} /> Check-in standard 14:00
          </div>
        </div>

        {/* 3. Departures Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Departures</span>
            <ArrowUpRight size={15} className="text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {departuresToday}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {pendingDepartures > 0 ? (
                <span className="text-amber-700 font-medium">{pendingDepartures} pending folio checkout</span>
              ) : (
                <span className="text-slate-400">All folios cleared</span>
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock size={11} /> Checkout standard 11:00
          </div>
        </div>

        {/* 4. In-House Guests */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">In-House Stays</span>
            <Users size={15} className="text-slate-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {inHouseGuests}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Currently in residence
            </div>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 size={11} /> Active folios open
          </div>
        </div>

        {/* 5. Total Collected Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Realized Revenue</span>
            <Wallet size={15} className="text-emerald-700" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums truncate">
              {fmtINR(totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={11} /> +{revenueChangePct}% vs previous
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Reconciled payments
          </div>
        </div>

        {/* 6. Outstanding Dues */}
        <div className="bg-white border border-amber-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs bg-amber-50/20 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-amber-900 text-xs">
            <span className="font-semibold">Outstanding Dues</span>
            <AlertCircle size={15} className="text-amber-700" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-amber-900 tracking-tight tabular-nums truncate">
              {fmtINR(outstandingBalance)}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-0.5">
              Across {outstandingBookingsCount} guest folios
            </div>
          </div>
          <div className="text-[10px] text-amber-800/80 font-medium mt-2">
            Collect at checkout
          </div>
        </div>
      </div>
    </div>
  );
}
