import React from 'react';
import { CreditCard, CheckCircle2, Wallet, ArrowUpRight, ShieldCheck, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentsShowcaseSection() {
  return (
    <section id="payments" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: The Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
              REVENUE & SETTLEMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Know what has been paid. And what is still due.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Never wonder whether a guest paid their advance on Google Pay or in cash. Every rupee is recorded against the room folio with full audit clarity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Track payments by mode: UPI, Card POS, Cash receipts, and Bank Transfers.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>Automated folio balance calculation: Booking Grand Total minus Advances Paid.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>No checkout confusion: front desk staff know the exact balance before handing over keys.</span>
              </div>
            </div>
          </div>

          {/* Right: The Financial Ledger Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Portfolio Payment Reconciliation</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time collections across active bookings</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                87.8% Reconciled
              </span>
            </div>

            {/* Key Totals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Booking Value</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">₹2,84,500</div>
                <div className="text-[10px] text-slate-400">Total tariff + GST</div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <div className="text-[11px] text-emerald-800 font-medium">Total Collected</div>
                <div className="text-lg font-bold text-emerald-950 mt-0.5 tabular-nums">₹2,49,700</div>
                <div className="text-[10px] text-emerald-700">Cleared funds</div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <div className="text-[11px] text-amber-800 font-medium">Outstanding Due</div>
                <div className="text-lg font-bold text-amber-950 mt-0.5 tabular-nums">₹34,800</div>
                <div className="text-[10px] text-amber-700">5 guest folios</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">Refunds Logged</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">₹8,500</div>
                <div className="text-[10px] text-slate-400">Reconciled adjustments</div>
              </div>
            </div>

            {/* Visual Multi-Mode Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Settlement Modes Recorded
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-slate-700 text-xs mb-1">
                    <span>UPI (Google Pay, PhonePe, Paytm)</span>
                    <span className="font-bold text-slate-900 tabular-nums">₹1,28,400 (51%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '51%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 text-xs mb-1">
                    <span>Card POS Swipe</span>
                    <span className="font-bold text-slate-900 tabular-nums">₹78,200 (31%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 text-xs mb-1">
                    <span>Cash Register</span>
                    <span className="font-bold text-slate-900 tabular-nums">₹43,100 (18%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Generate itemized receipt vouchers with transaction reference IDs.</span>
              <Link to="/app/payments" className="font-semibold text-slate-900 hover:text-emerald-800">
                View Ledger →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
