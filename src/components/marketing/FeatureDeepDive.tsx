import React, { useState } from 'react';
import { 
  Check, 
  CalendarDays, 
  CreditCard, 
  BarChart3, 
  Building, 
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureDeepDive() {
  const [selectedDemoProp, setSelectedDemoProp] = useState('All Properties');

  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50 space-y-24 sm:space-y-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Every feature designed for the front desk, not enterprise IT
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Straightforward tools that hotel managers, homestay owners, and receptionists can start using on day one without technical training.
          </p>
        </div>

        {/* Feature 1: Front Desk & Daily Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              01 · FRONT DESK OPERATIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Know what needs attention before your morning begins.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Open your dashboard at 7:00 AM and see exactly who is checking in, who is departing, and which guests have pending folio balances before they walk to the desk.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Today's arrivals and departures with scheduled check-in times</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Real-time occupancy percentage and vacant room counts</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Automated alerts for partially paid folios due today</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-slate-800">
                    Front Desk Daily Briefing · Today
                  </span>
                </div>
                <span className="text-xs text-slate-400">Live operational sync</span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-xs text-slate-500">Check-ins Today</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">12</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">4 already checked in</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-xs text-slate-500">Check-outs</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">8</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">All folios balanced</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-xs text-slate-500">Occupancy</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">78%</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">33/42 units</div>
                </div>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <AlertCircle size={14} className="text-amber-700" />
                    <span>Vikram Malhotra (Deluxe 204) — Remaining dues: <strong>₹6,500</strong></span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium">Pending Collect</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700">Rohan Verma (Executive 102) — Check-in confirmed</span>
                  <span className="text-emerald-700 font-medium">Fully Paid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Reservations & Room Folios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="font-semibold text-xs text-slate-800">
                  Master Reservation Ledger
                </div>
                <div className="text-xs text-slate-500">Filter: Active Stays</div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  {
                    no: 'BK-8902',
                    guest: 'Ananya Deshmukh',
                    stay: '26 Sep → 30 Sep (4N)',
                    room: 'Cottage 3 · 2 Guests',
                    total: 28000,
                    status: 'Paid',
                  },
                  {
                    no: 'BK-8903',
                    guest: 'Siddharth Roy',
                    stay: '27 Sep → 29 Sep (2N)',
                    room: 'Executive Suite · 1 Guest',
                    total: 18500,
                    status: 'Partially Paid',
                  },
                  {
                    no: 'BK-8904',
                    guest: 'Maya Pillai',
                    stay: '28 Sep → 01 Oct (3N)',
                    room: 'Lake View King · 2 Guests',
                    total: 24000,
                    status: 'Confirmed',
                  },
                ].map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{item.guest}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.no} · {item.room} · {item.stay}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 tabular-nums">
                        ₹{item.total.toLocaleString('en-IN')}
                      </div>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded mt-0.5 ${
                        item.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Direct PDF receipt download available</span>
                <span className="font-semibold text-slate-700">Instant GST Breakdown</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              02 · RESERVATION & FOLIO CONTROL
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Keep every booking, guest profile, and room folio together.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              No more searching through email chains or paper vouchers to check whether a guest paid their advance. Every reservation includes guest contact, room tier, stay dates, tax rate, and payment receipts.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Calculates room rates, nights, and GST automatically</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Generates professional PDF confirmation vouchers</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Search by guest name, phone number, or booking reference</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 3: Payment & Dues Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              03 · PAYMENTS & SETTLEMENTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              Stay on top of advances, pending balances, and modes.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Accepting payments across UPI (Google Pay, PhonePe, Paytm), credit cards, cash, and NEFT transfers? Record every transaction against the reservation with transaction IDs so front desk audits take zero effort.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Multi-mode tracking (UPI, Credit/Debit Card, Cash, Bank Transfer)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Instant outstanding dues ledger to prevent unpaid check-outs</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Reconciled daily collection summaries for cash drawers</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="text-xs font-semibold text-slate-800">
                  Daily Payment & Collection Breakdown
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ₹2,84,500 Collected
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500">UPI / QR Code</span>
                  <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                    ₹1,64,000
                  </div>
                  <span className="text-[10px] text-slate-500">58% share</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500">Cards (POS)</span>
                  <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                    ₹82,500
                  </div>
                  <span className="text-[10px] text-slate-500">29% share</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500">Cash / NEFT</span>
                  <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                    ₹38,000
                  </div>
                  <span className="text-[10px] text-slate-500">13% share</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-amber-900">
                    Outstanding Collections Due
                  </div>
                  <div className="text-amber-800/80 text-[11px] mt-0.5">
                    ₹34,800 awaiting payment at check-out across 4 reservations
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold text-xs">
                  Review Folios
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Multi-Property Switching */}
        <div id="multi-property" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  Multi-Location Property Switcher
                </span>
                <span className="text-xs text-slate-500">
                  Active Context: {selectedDemoProp}
                </span>
              </div>

              {/* Property Tabs */}
              <div className="grid grid-cols-3 gap-2 my-4">
                {[
                  { name: 'All Properties', units: '42 Units Total', rev: '₹2,84,500' },
                  { name: 'The Fern Residency', units: '24 Hotel Rooms', rev: '₹1,94,200' },
                  { name: 'Lakeview Homestay', units: '6 Cottages', rev: '₹52,300' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDemoProp(p.name)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedDemoProp === p.name
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.units}
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 mt-2 tabular-nums">
                      {p.rev}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">
                  Isolated Property Scope
                </div>
                <p className="text-[11px] leading-relaxed">
                  Each location maintains its own room categories, GST numbers, contact details, and staff assignments while giving owners aggregate portfolio analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              04 · PORTFOLIO MANAGEMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              One system for every property you own or operate.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you run a single mountain homestay or manage three boutique hotels across town, MyTrackYo lets you switch contexts with one click or view consolidated figures in a master overview.
            </p>
            <ul className="space-y-2.5 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Instant property filter across all bookings, payments, and reports</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Distinct GSTIN, address, and contact numbers per property</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                <span>Aggregated occupancy and cash flow reports for owners</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
