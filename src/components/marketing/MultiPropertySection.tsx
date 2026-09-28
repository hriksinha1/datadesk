import React, { useState } from 'react';
import { Building2, ArrowRight, BedDouble, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropItem {
  id: string;
  name: string;
  type: string;
  location: string;
  rooms: number;
  occupancy: number;
  revenue: string;
  bookings: number;
  due: string;
}

export default function MultiPropertySection() {
  const [selectedProp, setSelectedProp] = useState<string>('all');

  const properties: PropItem[] = [
    {
      id: 'p1',
      name: 'The Fern Residency',
      type: 'Boutique Hotel',
      location: 'Mysuru, Karnataka',
      rooms: 24,
      occupancy: 83,
      revenue: '₹1,94,200',
      bookings: 58,
      due: '₹21,500',
    },
    {
      id: 'p2',
      name: 'Valley View Resort',
      type: 'Hill Resort',
      location: 'Munnar, Kerala',
      rooms: 16,
      occupancy: 75,
      revenue: '₹1,12,400',
      bookings: 34,
      due: '₹18,040',
    },
    {
      id: 'p3',
      name: 'Coral Beach Homestay',
      type: 'Heritage Homestay',
      location: 'Anjuna, Goa',
      rooms: 6,
      occupancy: 67,
      revenue: '₹48,000',
      bookings: 18,
      due: '₹6,000',
    },
  ];

  const current = selectedProp === 'all'
    ? {
        name: 'Consolidated Portfolio (All 3 Properties)',
        type: 'Hotel, Resort & Homestay Portfolio',
        rooms: 46,
        occupancy: 78,
        revenue: '₹3,54,600',
        bookings: 110,
        due: '₹45,540',
      }
    : properties.find((p) => p.id === selectedProp)!;

  return (
    <section id="multi-property" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            PORTFOLIO CONTROL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            One workspace for every property you manage.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Whether you run one boutique hotel, a homestay, or multiple properties in different locations, switch context in a single click without logging in and out.
          </p>
        </div>

        {/* The Interactive Switcher Demo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 text-white shadow-xl max-w-4xl mx-auto">
          {/* Switcher Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Switch Context:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedProp('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedProp === 'all'
                      ? 'bg-emerald-800 text-white border border-emerald-600'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Properties
                </button>
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProp(p.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedProp === p.id
                        ? 'bg-emerald-800 text-white border border-emerald-600'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-medium">
              ● Context: {current.name}
            </span>
          </div>

          {/* Aggregated Real-Time Data Grid for Selected Context */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Active Occupancy</div>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                {current.occupancy}%
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                Across {current.rooms} total units
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Realized Revenue</div>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                {current.revenue}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Cleared payments
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Total Bookings</div>
              <div className="text-2xl font-bold text-white mt-1 tabular-nums">
                {current.bookings}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Active guest stays
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">Outstanding Balances</div>
              <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">
                {current.due}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">
                Pending folio checkout
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Each property retains its own GSTIN, address, check-in time, and room categories.
            </span>
            <Link to="/app/properties" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0">
              <span>View Properties</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
