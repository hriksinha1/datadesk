import React from 'react';
import { CalendarPlus, UserCheck, CreditCard, Key, Coffee, FileSpreadsheet } from 'lucide-react';

export default function WorkflowTimeline() {
  const steps = [
    {
      num: '01',
      title: 'Reservation Logged',
      icon: CalendarPlus,
      desc: 'Capture walk-in, phone, or direct booking with guest name, phone, dates, and room selection.',
      tag: 'Front Desk / Intake',
    },
    {
      num: '02',
      title: 'Room & Rate Locked',
      icon: UserCheck,
      desc: 'Inventory locks immediately. Base tariff, GST rate, and night counts calculate automatically.',
      tag: 'Inventory Control',
    },
    {
      num: '03',
      title: 'Advance Recorded',
      icon: CreditCard,
      desc: 'Log UPI, cash, or card advance receipts with transaction reference IDs directly into the folio.',
      tag: 'Folio Accounting',
    },
    {
      num: '04',
      title: 'Express Check-In',
      icon: Key,
      desc: 'Verify arrival in seconds, update room status, and welcome your guest without awkward delays.',
      tag: 'Guest Arrival',
    },
    {
      num: '05',
      title: 'In-Stay Management',
      icon: Coffee,
      desc: 'Post extra nights, food services, or amenities into the live guest folio with zero paperwork.',
      tag: 'Daily Hospitality',
    },
    {
      num: '06',
      title: 'Check-Out & Settlement',
      icon: FileSpreadsheet,
      desc: 'Clear outstanding dues, issue instant tax invoice, and update occupancy statistics automatically.',
      tag: 'Clean Reconciliation',
    },
  ];

  return (
    <section id="workflows" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            THE OPERATIONAL LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            From reservation to reconciliation in one smooth rhythm
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Every guest stay follows a strict operational flow. MyTrackYo connects each step so nothing slips through the cracks.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 relative hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      STAGE {step.num}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {step.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-900 flex items-center justify-center mb-3 shadow-2xs">
                    <Icon size={20} className="text-emerald-700" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center text-[11px] text-slate-400">
                  <span>Connected to folio ledger</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
