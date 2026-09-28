import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreeProductSection() {
  return (
    <section id="why-free" className="py-20 lg:py-28 bg-[#0B1220] text-white border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-semibold text-[#ABEFC6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ABEFC6]"></span>
            OUR PHILOSOPHY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Good property software shouldn’t feel out of reach.
          </h2>

          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            MyTrackYo is built to be available to independent hospitality businesses without recurring software friction.
          </p>

          {/* Core Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="p-4 rounded-[8px] bg-[#0E1726] border border-[#1E293B]">
              <div className="w-8 h-8 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-sm mb-3">
                01
              </div>
              <div className="font-semibold text-sm text-white">Free for Independent Hospitality</div>
              <div className="text-xs text-[#94A3B8] mt-1 leading-normal">
                Use every feature — reservations, folios, payments, and multi-property switching — permanently without fees.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#0E1726] border border-[#1E293B]">
              <div className="w-8 h-8 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-sm mb-3">
                02
              </div>
              <div className="font-semibold text-sm text-white">No Booking Commissions</div>
              <div className="text-xs text-[#94A3B8] mt-1 leading-normal">
                You earned the guest. MyTrackYo never takes a percentage of your room tariffs or offline bookings.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#0E1726] border border-[#1E293B]">
              <div className="w-8 h-8 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-sm mb-3">
                03
              </div>
              <div className="font-semibold text-sm text-white">Instant Setup</div>
              <div className="text-xs text-[#94A3B8] mt-1 leading-normal">
                Sign up with your work email, set up your room categories, and begin managing your front desk immediately.
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-6">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#0E1726] bg-white hover:bg-[#F7F8FA] rounded-[6px] transition-all shadow-md cursor-pointer"
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
