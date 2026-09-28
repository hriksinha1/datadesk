import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Users,
  Building2,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WorkspaceDataProvider, usePropertyScope } from '../../context/WorkspaceDataContext';
import { ToastProvider } from '../ui/Toast';
import { DemoBanner } from '../ui/DemoBanner';
import { PropertyContextSelector } from '../ui/PropertyContext';
import { CommandSearchModal } from '../ui/CommandSearch';

function AppShellContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { propertyFilter } = usePropertyScope();
  const navigate = useNavigate();
  const location = useLocation();

  const isCalendarView = location.pathname === '/app/bookings' && location.search.includes('view=calendar');

  // Shortcut for Cmd/Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'Operations',
      links: [
        { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/app/bookings', label: 'Bookings', icon: CalendarDays },
        { to: '/app/payments', label: 'Payments', icon: CreditCard },
        { to: '/app/customers', label: 'Guests', icon: Users },
      ],
    },
    {
      group: 'Setup',
      links: [
        { to: '/app/properties', label: 'Properties', icon: Building2 },
        { to: '/app/reports', label: 'Reports', icon: BarChart3 },
        { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F7F8FA] overflow-hidden text-[#0E1726]">
      {/* Demo Banner */}
      <DemoBanner />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (240px desktop, collapsed 64px on tablet 768-1023) */}
        <aside
          className="hidden md:flex flex-col w-[240px] lg:w-[240px] md:w-16 bg-[#0B1220] text-[#94A3B8] shrink-0 border-r border-[#1E293B] select-none z-30 transition-all duration-150"
          aria-label="Primary"
        >
          {/* Logo */}
          <div className="h-14 flex items-center px-4 md:px-3 lg:px-4 border-b border-[#1E293B]">
            <Link to="/app" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-[6px] bg-[#0D5C4D] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-tight">
                MY
              </div>
              <div className="md:hidden lg:block truncate">
                <span className="font-semibold text-sm text-white tracking-tight">MyTrackYo</span>
                <span className="ml-1.5 text-[10px] text-[#64748B] font-mono">PMS</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 md:px-1.5 lg:px-2 space-y-5">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B] md:hidden lg:block">
                  {group.group}
                </div>
                {group.links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={item.label}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-2.5 h-9 rounded-[6px] text-xs sm:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-[2px] bg-[#0D5C4D]" />
                          )}
                          <Icon className="w-4 h-4 shrink-0 text-current" strokeWidth={1.75} />
                          <span className="md:hidden lg:inline truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom user / account block */}
          <div className="p-2 border-t border-[#1E293B] space-y-1 bg-[#0B1220]">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-2.5 h-8 rounded-[6px] text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
              title="Back to website"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="md:hidden lg:inline truncate">Back to website</span>
            </Link>

            <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between px-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-[#1E293B] text-[#D1E8E2] border border-[#334155] flex items-center justify-center font-medium text-xs shrink-0 select-none">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OW'}
                </div>
                <div className="md:hidden lg:block truncate">
                  <div className="text-xs font-medium text-white truncate">
                    {user?.name || 'Property Manager'}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    {user?.propertyName || 'MyTrackYo Workspace'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-1 text-[#94A3B8] hover:text-[#FDA29B] rounded-[4px] cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar (56px sticky) */}
          <header className="h-14 bg-white border-b border-[#E4E7EC] flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#334155] hover:bg-[#F7F8FA] rounded-[6px] cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Property Scope Context */}
              <PropertyContextSelector />

              {/* Global Command Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center justify-between gap-3 h-9 px-3 w-64 text-xs text-[#64748B] bg-[#F7F8FA] hover:bg-white border border-[#E4E7EC] hover:border-[#CBD2DC] rounded-[6px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#0D5C4D]"
              >
                <span className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span className="truncate">Search bookings, guests, rooms...</span>
                </span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-white border border-[#CBD2DC] rounded-[4px]">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Top Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-[#64748B] hover:text-[#0E1726] rounded-[6px] cursor-pointer"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              <div
                className="w-7 h-7 rounded-full bg-[#0D5C4D] text-white flex items-center justify-center font-medium text-xs select-none"
                title={user?.email || 'Logged in'}
              >
                {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            </div>
          </header>

          {/* Mobile Drawer Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0B1220] text-white p-4 space-y-4 border-b border-[#1E293B] z-40">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {group.group}
                  </div>
                  {group.links.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm ${
                            isActive ? 'bg-white/10 text-white font-medium' : 'text-[#94A3B8] hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              ))}
              <div className="pt-2 border-t border-[#1E293B] flex justify-between items-center text-xs">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-[#94A3B8] hover:text-white">
                  Back to website
                </Link>
                <button type="button" onClick={handleLogout} className="text-[#FDA29B]">
                  Sign out
                </button>
              </div>
            </div>
          )}

          {/* Routed Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div
              className={`w-full ${
                isCalendarView
                  ? 'p-3 sm:p-4'
                  : 'max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8'
              }`}
            >
              <Outlet context={{ propertyFilter }} />
            </div>
          </main>
        </div>
      </div>

      {/* Global Command Search Modal */}
      <CommandSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default function AppShell() {
  return (
    <ToastProvider>
      <WorkspaceDataProvider>
        <AppShellContent />
      </WorkspaceDataProvider>
    </ToastProvider>
  );
}
