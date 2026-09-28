import React from 'react';
import { Shield, KeyRound, Database, Download, FolderOpen } from 'lucide-react';

export default function TrustSecuritySection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            TRANSPARENT ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            A simple, honest system for daily hospitality work.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            The product is built to keep property data understandable and usable, with clear boundaries about what it does and what it does not yet do.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <KeyRound size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Secure access</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Sign-in sessions are handled through the application’s authentication flow, keeping access limited to the authorized workspace user.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Database size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Property scope</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Each property keeps its own room list, guest records, and payment movements so owner context stays clear.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Download size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">CSV export</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Reservation and guest data can be exported in standard CSV format for accounting, tax review, and backup workflows.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <FolderOpen size={18} />
            </div>
            <div className="font-bold text-sm text-slate-900">Demo-safe workflow</div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Sample data stays in the browser, keeping the product preview separate from the real workspace and preserving the operator’s account context.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
