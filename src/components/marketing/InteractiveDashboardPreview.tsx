import React, { useState } from 'react';
import { 
  Building2, 
  CalendarDays, 
  CreditCard, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  BedDouble,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyMetric {
  id: string;
  name: string;
  type: string;
  occupancy: number;
  totalRooms: number;
  occupiedRooms: number;
  arrivals: number;
  departures: number;
  revenue: number;
  outstanding: number;
}

const propertiesData: Record<string, PropertyMetric> = {
  all: {
    id: 'all',
    name: 'All Properties (3)',
    type: 'Multi-Property Portfolio',
    occupancy: 78,
    totalRooms: 42,
    occupiedRooms: 33,
    arrivals: 12,
    departures: 8,
    revenue: 284500,
    outstanding: 34800,
  },
  fern: {
    id: 'fern',
    name: 'The Fern Residency',
    type: 'Boutique Hotel · 24 Rooms',
    occupancy: 83,
    totalRooms: 24,
    occupiedRooms: 20,
    arrivals: 7,
    departures: 5,
    revenue: 194200,
    outstanding: 21500,
  },
  lakeview: {
    id: 'lakeview',
    name: 'Lakeview Homestay',
    type: 'Heritage Homestay · 6 Cottages',
    occupancy: 83,
    totalRooms: 6,
    occupiedRooms: 5,
    arrivals: 2,
    departures: 1,
    revenue: 52300,
    outstanding: 4300,
  },
  zostel: {
    id: 'zostel',
    name: 'Zostel Urban Dorms',
    type: 'Hostel & Pods · 12 Dorm Rooms',
    occupancy: 66,
    totalRooms: 12,
    occupiedRooms: 8,
    arrivals: 3,
    departures: 2,
    revenue: 38000,
    outstanding: 9000,
  },
};

const sampleArrivals = [
  {
    guest: 'Vikram Malhotra',
    room: 'Room 204 · Deluxe King',
    dates: 'Today → 30 Sep (2 nights)',
    amount: 14500,
    paid: 14500,
    status: 'Confirmed',
    eta: '14:30 IST',
    source: 'Direct Phone',
  },
  {
    guest: 'Ananya Deshmukh',
    room: 'Cottage 3 · Lake Front',
    dates: 'Today → 02 Oct (4 nights)',
    amount: 28000,
    paid: 15000,
    status: 'Partially Paid',
    eta: '16:00 IST',
    source: 'Website',
  },
  {
    guest: 'David Kim',
    room: 'Dorm B · Bed 4',
    dates: 'Today → 29 Sep (1 night)',
    amount: 1200,
    paid: 1200,
    status: 'Confirmed',
    eta: '18:15 IST',
    source: 'Walk-in',
  },
  {
    guest: 'Priya Sundaram',
    room: 'Room 302 · Executive Suite',
    dates: 'Today → 01 Oct (3 nights)',
    amount: 32400,
    paid: 10000,
    status: 'Partially Paid',
    eta: '15:00 IST',
    source: 'Direct',
  }
];

export default function InteractiveDashboardPreview() {
  const [selectedPropKey, setSelectedPropKey] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'arrivals' | 'dues'>('overview');

  const current = propertiesData[selectedPropKey] || propertiesData.all;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 font-sans">
      {/* Top OS Window Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-700"></span>
          <span className="w-3 h-3 rounded-full bg-slate-700"></span>
          <span className="w-3 h-3 rounded-full bg-slate-700"></span>
          <span className="ml-3 text-xs text-slate-400 font-medium tracking-wide">
            MyTrackYo Workspace — Live Operations Desk
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Connected
          </span>
        </div>
      </div>

      {/* Main SaaS App Frame */}
      <div className="flex min-h-[580px] bg-slate-900">
        {/* Compact Sidebar */}
        <div className="w-48 bg-slate-950/80 border-r border-slate-800/80 p-3 hidden sm:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="px-2 py-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Front Desk
              </div>
              <div className="text-sm font-semibold text-white truncate mt-0.5">
                {current.name}
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <TrendingUp size={14} className="text-emerald-400" /> Dashboard
              </button>
              <button
                onClick={() => setActiveTab('arrivals')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  activeTab === 'arrivals'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <CalendarDays size={14} className="text-blue-400" /> Today's Arrivals
              </button>
              <button
                onClick={() => setActiveTab('dues')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  activeTab === 'dues'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <CreditCard size={14} className="text-amber-400" /> Payments & Dues
              </button>
              <div className="text-slate-500 text-xs px-2.5 py-1.5 flex items-center gap-2.5 opacity-60">
                <Users size={14} /> Guest Register
              </div>
              <div className="text-slate-500 text-xs px-2.5 py-1.5 flex items-center gap-2.5 opacity-60">
                <Building2 size={14} /> Properties (3)
              </div>
            </nav>
          </div>

          <div className="p-2 border-t border-slate-800/60">
            <Link
              to="/app"
              className="w-full flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1"
            >
              <span>Full Screen PMS</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-x-auto">
          {/* Top Control Bar with Property Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Viewing:</span>
              <div className="relative">
                <select
                  value={selectedPropKey}
                  onChange={(e) => setSelectedPropKey(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">All Properties (3 Locations)</option>
                  <option value="fern">The Fern Residency (Hotel)</option>
                  <option value="lakeview">Lakeview Homestay</option>
                  <option value="zostel">Zostel Urban Dorms</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-2 pointer-events-none text-slate-400" />
              </div>
              <span className="text-xs text-slate-400 hidden md:inline">
                {current.type}
              </span>
            </div>

            {/* Quick Interactive View Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('arrivals')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'arrivals'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Arrivals ({current.arrivals})
              </button>
              <button
                onClick={() => setActiveTab('dues')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'dues'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dues (₹{current.outstanding.toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          {/* Operational KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
            {/* Occupancy Card */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Occupancy</span>
                <BedDouble size={14} className="text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                  {current.occupancy}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {current.occupiedRooms} of {current.totalRooms} rooms booked
                </div>
              </div>
              <div className="w-full bg-slate-700/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${current.occupancy}%` }}
                ></div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Collected</span>
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                  ₹{current.revenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400/90 mt-0.5 flex items-center gap-1">
                  <ArrowUpRight size={12} /> Realized cash flow
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Verified against folios
              </div>
            </div>

            {/* Outstanding Balance */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Outstanding Dues</span>
                <AlertCircle size={14} className="text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-amber-300 tabular-nums">
                  ₹{current.outstanding.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Pending at check-out
                </div>
              </div>
              <div className="text-[11px] text-amber-400/80 mt-2 font-medium">
                4 guest folios pending
              </div>
            </div>

            {/* Front Desk Flow */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Today's Movements</span>
                <Clock size={14} className="text-blue-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                    {current.arrivals}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1">in</span>
                </div>
                <span className="text-slate-600">/</span>
                <div>
                  <span className="text-lg sm:text-xl font-bold text-white tabular-nums">
                    {current.departures}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1">out</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Front desk on schedule
              </div>
            </div>
          </div>

          {/* Main Table / Operational View */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 sm:p-4 mt-2">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
              <div className="font-semibold text-slate-200">
                {activeTab === 'overview' && "Live Reservations & Today's Stays"}
                {activeTab === 'arrivals' && "Expected Arrivals Today"}
                {activeTab === 'dues' && "Pending Folio Dues Awaiting Settlement"}
              </div>
              <div className="text-[11px] text-slate-400">
                Showing realistic property ledger data
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/60">
                    <th className="pb-2 font-medium">Guest & Room</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Stay Dates</th>
                    <th className="pb-2 font-medium">Total Tariff</th>
                    <th className="pb-2 font-medium">Balance Due</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {sampleArrivals.map((row, idx) => {
                    const balance = row.amount - row.paid;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="font-medium text-slate-200">{row.guest}</div>
                          <div className="text-[11px] text-slate-400">{row.room}</div>
                        </td>
                        <td className="py-2.5 pr-2 hidden sm:table-cell text-slate-300">
                          {row.dates}
                        </td>
                        <td className="py-2.5 pr-2 font-medium text-slate-200 tabular-nums">
                          ₹{row.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 pr-2 tabular-nums">
                          {balance === 0 ? (
                            <span className="text-emerald-400 font-medium">Settled</span>
                          ) : (
                            <span className="text-amber-400 font-medium">
                              ₹{balance.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                              row.status === 'Confirmed'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Bar: Action prompt to open the real software */}
          <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="text-slate-500">
              Interactive preview · Switch properties above or explore the live system
            </span>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Enter Live Demo PMS <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
