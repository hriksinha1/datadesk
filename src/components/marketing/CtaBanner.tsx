import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CtaBanner() {
  const { quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const handleDemoLaunch = async () => {
    await quickDemoAccess();
    navigate('/app');
  };

  return (
    <section className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
          OPERATIONAL CONTROL
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3 text-white">
          Run your property from one place.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bring reservations, guest records, room folios, payments, and multi-property reporting into one connected hospitality workspace.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md"
          >
            Create Your Workspace <ArrowRight size={16} />
          </Link>
          <button
            onClick={handleDemoLaunch}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Open Live Demo Workspace
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-emerald-400" /> 14-day free trial
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={14} className="text-emerald-400" /> Instant setup
          </span>
        </div>
      </div>
    </section>
  );
}
