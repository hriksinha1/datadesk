import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Building2, ChevronDown, Check } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base tracking-wider group-hover:bg-slate-800 transition-colors shadow-xs">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-slate-800">
                  MYTRACKYO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-semibold -mt-1">
                  Property PMS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <a
                href="#features"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Features
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
                        className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900">Boutique & Independent Hotels</div>
                        <div className="text-xs text-slate-500 mt-0.5">Room folios, reception check-in, GST invoicing</div>
                      </a>
                      <a
                        href="#property-types"
                        className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900">Homestays & Heritage Lodges</div>
                        <div className="text-xs text-slate-500 mt-0.5">Simple guest records and advance tracking</div>
                      </a>
                      <a
                        href="#property-types"
                        className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900">Hostels & Dormitories</div>
                        <div className="text-xs text-slate-500 mt-0.5">Bed-level management and fast turnover</div>
                      </a>
                      <a
                        href="#multi-property"
                        className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900">Multi-Property Groups</div>
                        <div className="text-xs text-slate-500 mt-0.5">Aggregated metrics and instant property switching</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#workflows"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Workflows
              </a>
              <a
                href="#pricing"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
              >
                Pricing
              </a>
            </nav>
          </div>

          {/* Right Header CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Building2 size={16} /> Open Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign in
                </Link>
                <button
                  onClick={handleDemoAccess}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Explore Live Demo
                </button>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Get started <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#property-types"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Solutions
            </a>
            <a
              href="#workflows"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Workflows
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Pricing
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleDemoAccess();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-900 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Explore Live Demo
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
