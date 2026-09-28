import React from 'react';
import { Shield, KeyRound, Database, Download, CheckCircle2 } from 'lucide-react';

export default function TrustSecuritySection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            TRANSPARENT ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Your property data belongs strictly to you.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            We prioritize operational reliability, privacy, and full data portability. No vendor lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <KeyRound size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Secure Authentication</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Protected login sessions backed by modern token verification so only authorized property managers access folios.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Database size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Isolated Property Data</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Multi-property scoping ensures bookings, payments, and guest notes are strictly isolated per location.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Download size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Full CSV Data Export</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Export your reservations and guest records anytime in standard CSV format for accounting and tax filing.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Shield size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Cloud Persistence</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Access your reservation calendar and daily movements from your phone, reception desktop, or laptop anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
