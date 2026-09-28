import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Check, Sparkles, Building2, Play } from 'lucide-react';
import InteractiveDashboardPreview from './InteractiveDashboardPreview';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
  const { quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    await quickDemoAccess();
    navigate('/app');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            HOSPITALITY PROPERTY MANAGEMENT SAAS
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Run your property with less paperwork and more control.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed">
            MyTrackYo brings reservations, guest records, room folios, payments, and multi-property reporting into one connected workspace. Designed specifically for boutique hotels, homestays, lodges, and hostels.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Explore Live Workspace <ArrowRight size={18} />
            </button>
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Quick Assurance Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" /> Multi-property ready
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" /> Instant ₹ INR folios
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" /> Setup in under 5 minutes
            </span>
          </div>
        </div>

        {/* Hero Interactive UI Preview */}
        <div className="mt-12 lg:mt-16">
          <InteractiveDashboardPreview />
        </div>
      </div>
    </section>
  );
}
