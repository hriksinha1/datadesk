import React from 'react';
import { Link } from 'react-router-dom';

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                MYTRACKYO
              </span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              The connected property management workspace for independent hotels, boutique homestays, hostels, and multi-property operators.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational · Free for Independent Hospitality
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#product" className="hover:text-white transition-colors">
                  Front Desk Dashboard
                </a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-white transition-colors">
                  Tape Chart Calendar
                </a>
              </li>
              <li>
                <a href="#payments" className="hover:text-white transition-colors">
                  Payment Folios
                </a>
              </li>
              <li>
                <a href="#multi-property" className="hover:text-white transition-colors">
                  Multi-Property Control
                </a>
              </li>
              <li>
                <Link to="/app" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Open Workspace →
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Solutions
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#property-types" className="hover:text-white transition-colors">
                  Boutique Hotels
                </a>
              </li>
              <li>
                <a href="#property-types" className="hover:text-white transition-colors">
                  Homestays & Lodges
                </a>
              </li>
              <li>
                <a href="#property-types" className="hover:text-white transition-colors">
                  Hostels & Dorms
                </a>
              </li>
              <li>
                <a href="#multi-property" className="hover:text-white transition-colors">
                  Multi-Property Groups
                </a>
              </li>
              <li>
                <a href="#why-free" className="hover:text-white transition-colors">
                  Why Free Forever?
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Platform & Trust
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300">Data Ownership</span>
              </li>
              <li>
                <span className="text-slate-300">Cloud Persistence</span>
              </li>
              <li>
                <span className="text-slate-300">GST Compliance</span>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Create Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} MyTrackYo PMS. Built for independent hospitality operators.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
            <span>INR (₹) Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
