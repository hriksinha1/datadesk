import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow & Hero Copy */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            HOSPITALITY PROPERTY MANAGEMENT
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.14]">
            Everything your property needs. In one calm workspace.
          </h1>

          {/* Subtitle - Short, grounded, 2 lines */}
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Reservations, guest folios, room availability, and payments. Simple, fast, and completely free for independent properties.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Create your workspace — it’s free</span>
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Explore the workspace
            </button>
          </div>

          {/* Assurance Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700" /> Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700" /> Multi-property ready
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-700" /> Instant ₹ INR folios
            </span>
          </div>
        </div>

        {/* Hero Interactive UI Preview */}
        <div className="mt-10 lg:mt-14">
          <InteractiveDashboardPreview />
        </div>
      </div>
    </section>
  );
}
