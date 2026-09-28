import React from 'react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProblemSolution() {
  const painPoints = [
    {
      title: 'Bookings split across Excel, WhatsApp & notebooks',
      desc: 'Guest reservation details end up scattered across chat messages and registers, leading to double-booking risks and missed dates.',
    },
    {
      title: 'Manual payment tracking & lost receipts',
      desc: 'Advances captured in UPI apps or cash drawers aren’t linked to room folios, causing awkward check-out disputes with guests.',
    },
    {
      title: 'Zero visibility across multiple locations',
      desc: 'Owners managing two or three properties spend hours on phone calls every night just asking: “How many check-ins did we have today?”',
    },
    {
      title: 'Front desk bottleneck during peak arrivals',
      desc: 'Staff waste 10–15 minutes per guest retyping identity details, calculating taxes manually, and drafting paper invoices.',
    },
  ];

  const solutions = [
    {
      title: 'Single connected live reservation calendar',
      desc: 'Every phone booking, walk-in, and online inquiry resides in one real-time calendar with instant room availability checks.',
    },
    {
      title: 'Every rupee accounted for against room folios',
      desc: 'Record advances and final settlements with payment modes (UPI, Card, Cash, Bank Transfer) and exact transaction reference IDs.',
    },
    {
      title: 'Instant property switching with master analytics',
      desc: 'Toggle between all properties or drill into a single homestay or lodge to see today’s arrivals, revenue, and occupancy in seconds.',
    },
    {
      title: '60-second express check-in and automated bills',
      desc: 'Select the guest, verify room allocation, collect pending balance, and generate an itemized GST-ready invoice in one tap.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            OPERATIONAL REALITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            The friction in running properties manually vs. with MyTrackYo
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Independent property management shouldn't require juggling four spreadsheets, paper registers, and late-night phone reconciliations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Before MyTrackYo */}
          <div className="bg-white border border-rose-100 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-rose-100">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Before MyTrackYo
                  </h3>
                  <p className="text-xs text-rose-600 font-medium">
                    Fragmented tools & manual registers
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {painPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 bg-rose-50/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 rounded-b-2xl text-xs text-rose-800 font-medium flex items-center justify-between">
              <span>Result: Revenue leakage & staff stress</span>
              <span className="text-[11px] text-rose-600">Disorganized records</span>
            </div>
          </div>

          {/* After MyTrackYo */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-10 pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    With MyTrackYo
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    One unified hospitality operating system
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {solutions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-emerald-100 bg-emerald-50/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 rounded-b-2xl text-xs text-emerald-900 font-medium flex items-center justify-between">
              <span>Result: Clean guest folios, zero lost revenue</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                Full control <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
