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
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                MYTRACKYO
              </span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              The connected property management workspace for independent hotels, boutique homestays, hostels, and multi-property hospitality operators.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational · Indian Rupee (₹) Ready
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Front Desk Dashboard
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Reservation Ledger
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Payment Tracking
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Occupancy Reports
                </a>
              </li>
              <li>
                <Link to="/app" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Live Demo PMS →
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
                  Hostels & Dormitories
                </a>
              </li>
              <li>
                <a href="#multi-property" className="hover:text-white transition-colors">
                  Multi-Property Groups
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
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
                <span className="text-slate-400">GST Compliance</span>
              </li>
              <li>
                <span className="text-slate-400">Data Privacy & Security</span>
              </li>
              <li>
                <span className="text-slate-400">Local Data Storage</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <a href="mailto:support@mytrackyo.com" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} MyTrackYo Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
            <span>Support: support@mytrackyo.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
