import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CalendarDays, 
  Users, 
  Building, 
  CreditCard, 
  Settings as SettingsIcon, 
  LogOut, 
  BarChart3, 
  Bell, 
  Search, 
  MapPin,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { repository } from '../../lib/repository';
import { useAuth } from '../../context/AuthContext';

export type AppContextType = {
  propertyFilter: string;
};

export default function AppShell() {
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyFilter, setPropertyFilter] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    repository.getProperties().then((res) => setProperties(res.filter((p) => p.active)));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/app', label: 'Dashboard', icon: Home, end: true },
    { to: '/app/bookings', label: 'Bookings', icon: CalendarDays },
    { to: '/app/payments', label: 'Payments', icon: CreditCard },
    { to: '/app/customers', label: 'Customers', icon: Users },
    { to: '/app/properties', label: 'Properties', icon: Building },
    { to: '/app/reports', label: 'Reports', icon: BarChart3 },
    { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col z-30 hidden md:flex shrink-0 border-r border-slate-800">
        {/* Logo and Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <div className="font-bold text-base text-white tracking-tight">MYTRACKYO</div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium -mt-0.5">
                Workspace
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-xs sm:text-sm font-medium">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Return to Marketing Site link & User profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-emerald-400" />
              <span>Back to Website</span>
            </span>
            <ChevronRight size={13} />
          </Link>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OW'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Rohan Sharma'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.propertyName || 'Owner'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Property Switcher */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={15} className="text-emerald-700" />
              </div>
              <select
                className="select pl-9 py-1.5 text-xs sm:text-sm font-medium w-52 sm:w-64 bg-slate-50 border-slate-200"
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
              >
                <option value="">All Properties ({properties.length || 3})</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative max-w-xs w-full hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings, guests, folios..."
                className="input pl-8 py-1.5 text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Marketing Site
            </Link>

            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'RS'}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-slate-950 text-white p-4 space-y-2 border-b border-slate-800 z-50">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <Link to="/" onClick={() => setMobileSidebarOpen(false)} className="text-xs text-emerald-400">
                Back to Marketing Site
              </Link>
              <button onClick={handleLogout} className="text-xs text-rose-400">
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet context={{ propertyFilter }} />
          </div>
        </main>
      </div>
    </div>
  );
}
