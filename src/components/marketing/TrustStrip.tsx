import React from 'react';
import { Hotel, Home, Bed, Building, ShieldCheck, MapPin } from 'lucide-react';

export default function TrustStrip() {
  const propertyCategories = [
    {
      icon: Hotel,
      title: 'Boutique & Independent Hotels',
      desc: 'Room inventory, check-in folios & GST invoicing',
    },
    {
      icon: Home,
      title: 'Homestays & Heritage Lodges',
      desc: 'Personalized guest tracking & advance payment logs',
    },
    {
      icon: Bed,
      title: 'Hostels & Dormitories',
      desc: 'Bed-level management, groups & rapid check-ins',
    },
    {
      icon: Building,
      title: 'Multi-Property Operators',
      desc: 'Consolidated view across multiple locations',
    },
  ];

  return (
    <section className="py-10 border-y border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            One workspace for your day-to-day property operations
          </p>
          <h2 className="text-lg font-semibold text-slate-900 mt-1">
            Purpose-built for independent hospitality models
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
