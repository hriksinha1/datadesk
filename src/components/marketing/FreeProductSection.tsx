import React from 'react';
import { Check, ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreeProductSection() {
  return (
    <section id="why-free" className="py-20 lg:py-28 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            OUR PHILOSOPHY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Good property software shouldn’t feel out of reach.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            MyTrackYo is built to be available to independent hospitality businesses without another recurring monthly software bill.
          </p>

          {/* Core Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                01
              </div>
              <div className="font-semibold text-sm text-white">No Monthly Subscription</div>
              <div className="text-xs text-slate-400 mt-1 leading-normal">
                Use every feature — reservations, folios, payments, and multi-property switching — permanently without a plan.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                02
              </div>
              <div className="font-semibold text-sm text-white">No Booking Commissions</div>
              <div className="text-xs text-slate-400 mt-1 leading-normal">
                You earned the guest. MyTrackYo never takes a percentage of your room tariffs or offline bookings.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                03
              </div>
              <div className="font-semibold text-sm text-white">No Credit Card Required</div>
              <div className="text-xs text-slate-400 mt-1 leading-normal">
                Sign up with your work email, set up your room categories, and begin managing your front desk immediately.
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Create your workspace</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
