import React, { useState } from 'react';
import { Hotel, Home, Bed, Trees, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertyTypesSection() {
  const [activeSegment, setActiveSegment] = useState<'hotels' | 'homestays' | 'hostels' | 'resorts'>('hotels');

  const segments = {
    hotels: {
      title: 'Boutique & Independent Hotels',
      tagline: 'Structured room folios, front-desk speed, and tax compliance',
      icon: Hotel,
      description:
        'Designed for independent hotels with 10 to 60 rooms where front desk receptionists handle fast-paced check-ins, advance deposits, GST invoices, and room status updates.',
      highlights: [
        'Dedicated room categories (Deluxe, Executive, Suite) with custom pricing',
        'Automatic GST invoice generation with CGST, SGST, and IGST breakdowns',
        'Guest identity and ID document tracking linked directly to the booking',
        'Daily front desk cash drawer reconciliation and shift handovers',
      ],
      kpis: [
        { label: 'Typical Room Count', val: '12 – 60 Rooms' },
        { label: 'Check-in Speed', val: '< 60 Seconds' },
        { label: 'Invoice Format', val: 'GST Compliant PDF' },
      ],
    },
    homestays: {
      title: 'Homestays, Villas & Heritage Lodges',
      tagline: 'Simple guest records and warm hospitality without bureaucratic software',
      icon: Home,
      description:
        'Ideal for owner-operated homestays, cottages, and estate villas who need an intuitive, clean calendar to log direct WhatsApp bookings, track advances, and know upcoming arrival dates.',
      highlights: [
        'Clean booking calendar that anyone in the family or team can understand',
        'Track partial advance deposits received via UPI or bank transfer',
        'Store guest preferences, dietary notes, and arrival timings',
        'Zero complex training needed — up and running in under 10 minutes',
      ],
      kpis: [
        { label: 'Typical Units', val: '2 – 12 Cottages / Rooms' },
        { label: 'Booking Source', val: 'Direct Phone & Website' },
        { label: 'Setup Time', val: '5 Minutes' },
      ],
    },
    hostels: {
      title: 'Hostels & Co-Living Dormitories',
      tagline: 'Bed-level visibility, group stays, and fast-moving turnover',
      icon: Bed,
      description:
        'Manage high-volume bed inventories, individual traveler walk-ins, multi-bed dorms, and flexible length-of-stay extensions with real-time bed availability.',
      highlights: [
        'Track male, female, and mixed dormitory beds individually',
        'Quickly log backpacker check-ins with prepaid or pay-at-desk status',
        'Split group bookings across multiple dorm rooms effortlessly',
        'Spot unpaid beds instantly on the morning front desk register',
      ],
      kpis: [
        { label: 'Unit Type', val: 'Dorm Beds & Pods' },
        { label: 'Turnover Rate', val: 'High Daily Influx' },
        { label: 'Payment Flow', val: 'Immediate Prepayment / UPI' },
      ],
    },
    resorts: {
      title: 'Small Resorts & Multi-Property Groups',
      tagline: 'Multi-location visibility, centralized control, and portfolio analytics',
      icon: Trees,
      description:
        'For hospitality groups or owners operating multiple properties across different locations who need one unified platform to monitor occupancy, cash collection, and team performance.',
      highlights: [
        'Switch between properties instantly with isolated property folios',
        'A consolidated owner dashboard with portfolio-wide revenue metrics',
        'Tax settings configured per property, including GSTIN and legal details',
        'A single property view that keeps operations, balances and bookings in one place',
      ],
      kpis: [
        { label: 'Properties', val: '2 to 10 Locations' },
        { label: 'Analytics', val: 'Consolidated & Property-wise' },
        { label: 'Tax Profile', val: 'Multi-GSTIN Support' },
      ],
    },
  };

  const current = segments[activeSegment];
  const Icon = current.icon;

  return (
    <section id="property-types" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            TAILORED SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Built around how your specific property actually operates
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A boutique hotel has different operational rhythms than a 6-cottage homestay or a vibrant backpacker hostel. Select your property model below.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl max-w-2xl mx-auto mb-12">
          {(
            [
              ['hotels', 'Hotels', Hotel],
              ['homestays', 'Homestays & Lodges', Home],
              ['hostels', 'Hostels & Dorms', Bed],
              ['resorts', 'Small Resorts', Trees],
            ] as const
          ).map(([key, label, TabIcon]) => (
            <button
              key={key}
              onClick={() => setActiveSegment(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeSegment === key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <TabIcon size={16} className={activeSegment === key ? 'text-emerald-700' : 'text-slate-400'} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Solution Showcase */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Detail */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 font-semibold mt-0.5">
                    {current.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Configure for {current.title.split(' ')[0]} <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Operational Summary Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Operational Profile
              </div>

              <div className="space-y-4">
                {current.kpis.map((kpi, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium">{kpi.label}</span>
                    <span className="font-bold text-slate-900">{kpi.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">
                  Ready to test with your properties?
                </div>
                <p className="text-[11px] text-slate-500">
                  Explore pre-configured sample rooms, guest folios, and payment receipts in our interactive live demo.
                </p>
                <div className="pt-2">
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    Open Live Demo Workspace →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
