import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Check } from 'lucide-react';
import hotelPhoto from '../../assets/images/hotel_reception_editorial_1790573399379.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Left Column: Hospitality Visual & Brand Pillar (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={hotelPhoto}
            alt="Boutique hotel front desk"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              MYTRACKYO
            </span>
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Independent Hospitality Operations
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
            Run your hotel, homestay or hostel with clarity and control.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            From morning arrivals to final folio settlements, MyTrackYo keeps reservations, guests, and payments unified in one reliable workspace.
          </p>

          <div className="space-y-2 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <span>Multi-property context switching</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <span>Indian Rupee (₹) GST-ready invoices</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" />
              <span>Instant check-ins & advance tracking</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust Note */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Trusted by independent hoteliers & homestays</span>
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" /> Bank-grade security
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                MYTRACKYO
              </span>
            </Link>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            {children}
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Secure access to your property workspace · Encrypted connection
          </p>
        </div>
      </div>
    </div>
  );
}
