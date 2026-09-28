import React from 'react';
import { Clock, AlertCircle, ArrowDownRight, ArrowUpRight, BedDouble, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TodayOperationsSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: The Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
              MORNING BRIEFING
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Start the day knowing what needs attention.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Before the front desk gets busy with walk-ins and phone calls, get a clear briefing of every arrival, scheduled departure, and pending folio.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Express check-in in under 60 seconds with pre-assigned room numbers.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Zero forgotten dues: pending folio balances surface right on the checkout list.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Clear room turnover status so housekeeping and reception stay in sync.</span>
              </div>
            </div>
          </div>

          {/* Right Column: The 08:30 AM Morning Briefing Interface Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            {/* Header with Time Anchor */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                  <Clock size={15} />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">08:30 AM Briefing · The Fern Residency</div>
                  <div className="text-[11px] text-slate-500">Front Desk Morning Standup</div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                78% Occupied
              </span>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Arrivals</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">12 guests</div>
                <div className="text-[10px] text-blue-700">4 due by 14:00</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Departures</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">8 rooms</div>
                <div className="text-[10px] text-amber-700">3 checkouts pending</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Collected</div>
                <div className="text-lg font-bold text-emerald-800 mt-0.5 tabular-nums">₹48,240</div>
                <div className="text-[10px] text-slate-500">Reconciled today</div>
              </div>
            </div>

            {/* Operational Priority Items */}
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-slate-400 font-medium">14:00</span>
                  <div>
                    <span className="font-semibold text-slate-900">Ananya Desai</span>
                    <span className="text-slate-500 text-[11px]"> · Room 204 (Deluxe King)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Arriving
                </span>
              </div>

              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-amber-800 font-medium">11:00</span>
                  <div>
                    <span className="font-semibold text-amber-950">Rahul Sharma</span>
                    <span className="text-amber-800 text-[11px]"> · Room 302 · ₹4,200 due</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  Folio Due
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-slate-400 font-medium">HOLD</span>
                  <div>
                    <span className="font-semibold text-slate-900">Room 108</span>
                    <span className="text-slate-500 text-[11px]"> · AC filter inspection scheduled</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                  Maintenance
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Everything you need to brief front office staff in 2 minutes.</span>
              <Link to="/app" className="font-semibold text-slate-900 hover:text-emerald-800 flex items-center gap-1">
                Open Morning Briefing <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
