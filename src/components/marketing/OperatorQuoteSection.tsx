import React from 'react';
import { Quote } from 'lucide-react';

export default function OperatorQuoteSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
          <Quote size={24} />
        </div>

        <blockquote className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight leading-relaxed">
          “Most hotel software was designed twenty years ago for 500-room corporate properties with full-time IT departments. Independent hoteliers and homestay owners just need clean reservations, fast check-ins, and accurate payment tracking.”
        </blockquote>

        <div className="mt-6 flex flex-col items-center">
          <div className="font-semibold text-slate-900 text-sm">
            MyTrackYo Product Architecture Philosophy
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Designed for real daily operations · Zero bloat · Immediate clarity
          </div>
        </div>
      </div>
    </section>
  );
}
