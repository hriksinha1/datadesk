import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection() {
  const { user, quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const handleDemoOpen = async () => {
    if (!user) {
      await quickDemoAccess();
    }
    navigate('/app');
  };

  return (
    <section className="relative overflow-hidden border-b border-[#E4E1D8] bg-[#F6F4EF] pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="mk-content">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="mk-time text-[0.72rem] font-semibold tracking-[0.12em] text-[#4B5567]">08:30 · Free property management for independent stays</div>
            <h1 className="mt-5 max-w-[14ch] text-[#0E1726] mk-display">Know what’s happening at your property before the phone rings.</h1>
            <p className="mt-5 max-w-[62ch] text-base text-[#4B5567] md:text-lg">Track bookings, rooms, guest balances and arrivals in one calm workspace built for hotels, homestays, hostels and lodges.</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-[#0E1726] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#16213A]">Create your free workspace</Link>
              <a href="#story" className="inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] bg-white px-5 py-3 text-sm font-semibold text-[#0E1726] transition-colors hover:bg-[#F5F5F5]">See how it works</a>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-[#4B5567] sm:flex-row sm:items-center">
              <button type="button" onClick={handleDemoOpen} className="inline-flex items-center gap-2 text-left font-medium text-[#0D5C4D] hover:underline">Open the sample workspace</button>
              <span className="hidden text-[#94A3B8] sm:inline">•</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#0D5C4D]" />Free to use</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#4B5567]">
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#0D5C4D]" />One property or several</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#0D5C4D]" />Amounts in ₹</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#0D5C4D]" />No installation required</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-[720px] rounded-[22px] border border-[#E4E7EC] bg-[#0E1726] p-4 shadow-[0_24px_50px_-28px_rgba(14,23,38,0.5)] md:p-6">
              <div className="absolute inset-x-10 -bottom-8 h-12 rounded-full bg-[#0E1726]/20 blur-2xl" />
              <div className="rounded-[18px] border border-white/10 bg-[#111F2F] p-4 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#A8D6C4]">Today</div>
                    <div className="mt-1 text-lg font-semibold">Mon 08:30</div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-[#D6F0E5]">Sample data</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    ['Occupancy', '12 / 24'],
                    ['Arrivals', '3'],
                    ['Departures', '2'],
                    ['In house', '12'],
                  ].map(([label, value], idx) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3" style={{ animationDelay: `${idx * 60}ms` }}>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-slate-300">{label}</div>
                      <div className="mt-2 text-[1.1rem] font-semibold text-white tabular-nums">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#2B3949] bg-[#142234] p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold">Attention required</div>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8D6C4]">3 items</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-200">
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-2">
                      <span>Meera Rao leaves today with ₹18,040 still due</span>
                      <button type="button" className="rounded-md bg-[#0D5C4D] px-2.5 py-1.5 text-[10px] font-semibold text-white">Take payment</button>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">3 arrivals still to check in</div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-2">Room 104 was due to turn over yesterday</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-slate-300">Arrivals</div>
                    <div className="mt-1 font-medium">Priya Nair · Room 201</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#D6F0E5]">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#6FD3B0]" />Check in 14:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
