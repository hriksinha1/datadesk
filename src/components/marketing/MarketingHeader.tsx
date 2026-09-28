import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Building2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const { user, quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    await quickDemoAccess();
    navigate('/app');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base tracking-wider group-hover:bg-slate-800 transition-colors shadow-xs">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-slate-800">
                  MYTRACKYO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold -mt-1">
                  Hospitality PMS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <a
                href="#product"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Product
              </a>

              {/* Solutions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setSolutionsDropdown(true)}
                onMouseLeave={() => setSolutionsDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSolutionsDropdown(!solutionsDropdown)}
                >
                  Solutions <ChevronDown size={14} className={`transition-transform duration-150 ${solutionsDropdown ? 'rotate-180' : ''}`} />
                </button>

                {solutionsDropdown && (
                  <div className="absolute top-full left-0 w-64 pt-2 z-50">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-1">
                      <a
                        href="#property-types"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-900">Boutique & Independent Hotels</div>
                        <div className="text-[11px] text-slate-500">Room folios, check-ins, advance receipts</div>
                      </a>
                      <a
                        href="#property-types"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-900">Homestays & Heritage Lodges</div>
                        <div className="text-[11px] text-slate-500">Simple guest records and tariff tracking</div>
                      </a>
                      <a
                        href="#property-types"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-900">Hostels & Dormitories</div>
                        <div className="text-[11px] text-slate-500">Bed turnover and flexible stays</div>
                      </a>
                      <a
                        href="#multi-property"
                        className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-900">Multi-Property Operators</div>
                        <div className="text-[11px] text-slate-500">Instant switching between locations</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#calendar"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Tape Chart
              </a>
              <a
                href="#payments"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Payments
              </a>
              <a
                href="#why-free"
                className="px-3 py-2 text-sm font-medium text-emerald-800 hover:text-emerald-950 rounded-md hover:bg-emerald-50/60 transition-colors"
              >
                Why Free?
              </a>
            </nav>
          </div>

          {/* Right Header CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Building2 size={15} /> Open Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign in
                </Link>
                <button
                  onClick={handleDemoAccess}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explore workspace</span>
                </button>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs"
                >
                  <span>Create workspace</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/signup"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg"
            >
              Get started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="space-y-1">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Product Overview
            </a>
            <a
              href="#calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Reservation Calendar
            </a>
            <a
              href="#payments"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Payments & Folios
            </a>
            <a
              href="#property-types"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Property Types
            </a>
            <a
              href="#why-free"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-emerald-800 rounded-lg hover:bg-emerald-50"
            >
              Why Free Forever?
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemoAccess();
              }}
              className="w-full text-center py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg"
            >
              Explore sample workspace
            </button>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
