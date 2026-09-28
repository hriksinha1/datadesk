import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: 'Starter',
      badge: 'Single Homestay / Lodge',
      desc: 'Ideal for independent homestays, cottages, and bed & breakfasts up to 10 rooms.',
      priceMonthly: 1499,
      priceAnnual: 1199,
      features: [
        '1 Property location',
        'Up to 10 rooms or units',
        'Unlimited guest reservations',
        'Direct UPI & cash receipt logging',
        'Automated PDF invoice generation',
        'Standard operational reports',
        'Email & WhatsApp support',
      ],
      popular: false,
      cta: 'Start 14-Day Free Trial',
    },
    {
      name: 'Growth',
      badge: 'Independent Boutique Hotel',
      desc: 'For busy hotels, heritage lodges, and hostels requiring active front-desk operations.',
      priceMonthly: 2999,
      priceAnnual: 2399,
      features: [
        '1 Property location',
        'Up to 30 rooms or dorm beds',
        'Unlimited guest reservations',
        'Multi-mode payments (UPI, POS Cards, Cash)',
        'GST invoice with CGST/SGST/IGST breakdown',
        'Daily front-desk shift reconciliation',
        'Export data to CSV and PDF',
        'Priority phone & WhatsApp support',
      ],
      popular: true,
      cta: 'Start 14-Day Free Trial',
    },
    {
      name: 'Multi-Property',
      badge: 'Hospitality Groups & Chains',
      desc: 'For operators managing multiple guest houses, boutique hotels, or city hostels.',
      priceMonthly: 5999,
      priceAnnual: 4799,
      features: [
        'Up to 3 Property locations included',
        'Unlimited rooms and dorm units',
        'Consolidated portfolio analytics',
        'Distinct GSTIN & address per property',
        'Role-scoped staff & manager accounts',
        'Advanced financial & occupancy reporting',
        'Dedicated account onboarding manager',
        'Custom report formatting',
      ],
      popular: false,
      cta: 'Start 14-Day Free Trial',
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Simple pricing designed for independent hospitality
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            No hidden setup fees, no percentage cuts on direct guest bookings, and no complex contracts.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                !annualBilling
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                annualBilling
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  tier.popular
                    ? 'border-2 border-emerald-700 shadow-md ring-1 ring-emerald-700/20'
                    : 'border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Most Popular for Hotels
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 mt-1">
                    {tier.badge}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 min-h-[36px]">
                    {tier.desc}
                  </p>

                  <div className="mt-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        / property / month
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {annualBilling ? 'Billed annually (₹' + (price * 12).toLocaleString('en-IN') + '/yr)' : 'Billed monthly, cancel anytime'}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Included capabilities:
                    </div>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check size={15} className="text-emerald-700 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    to="/signup"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      tier.popular
                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </Link>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Instant access · No card required
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="mt-12 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-700" /> 14-day free trial on all plans
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={16} className="text-emerald-700" /> Export your data anytime in Excel & PDF
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={16} className="text-emerald-700" /> No commission on direct bookings
          </span>
        </div>
      </div>
    </section>
  );
}
