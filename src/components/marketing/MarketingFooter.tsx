import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import { BRAND } from './siteConfig';

export default function MarketingFooter() {
  return (
    <footer className="bg-[#0E1726] py-14 text-[11px] text-slate-300">
      <div className="mk-content">
        <div className="grid gap-8 border-b border-slate-800 pb-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5" aria-label="MyTrackYo home">
              <BrandMark size={26} />
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-[-0.04em] text-white">{BRAND.name}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6FD3B0]">Property OS</span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Free property management for hotels, homestays, lodges and hostels that need a calm, practical way to track occupancy, payments and guest flow.
            </p>
          </div>

          <div>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Product</div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#product" className="hover:text-white">Overview</a></li>
              <li><a href="#story" className="hover:text-white">How it works</a></li>
              <li><a href="#payments" className="hover:text-white">Payments</a></li>
              <li><a href="#why-free" className="hover:text-white">Why free</a></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Use cases</div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#use-cases" className="hover:text-white">Hotels</a></li>
              <li><a href="#use-cases" className="hover:text-white">Homestays</a></li>
              <li><a href="#use-cases" className="hover:text-white">Hostels</a></li>
              <li><a href="#use-cases" className="hover:text-white">Multi-property</a></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Account</div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/login" className="hover:text-white">Log in</Link></li>
              <li><Link to="/signup" className="hover:text-white">Create workspace</Link></li>
              <li><Link to="/app" className="hover:text-white">Open demo</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. Built for independent hospitality operators.</p>
          <div className="flex items-center gap-4">
            <span>INR (₹) standard</span>
            <span>Browser-based</span>
            <span>Free to use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
