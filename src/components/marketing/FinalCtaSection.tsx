import React from 'react';
import { ArrowRight, Check, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FinalCtaSection() {
  const { quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const handleLaunchDemo = async () => {
    await quickDemoAccess();
    navigate('/app');
  };

  return (
    <section className="py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            OPERATIONAL CLARITY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Your property has enough to keep track of. Let MyTrackYo handle the tracking.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Free forever for independent hotels, homestays, lodges, and hostels. Ready in minutes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Create your workspace — it’s free</span>
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Explore sample workspace
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> Free to use
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> No credit card needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" /> Setup under 5 minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
