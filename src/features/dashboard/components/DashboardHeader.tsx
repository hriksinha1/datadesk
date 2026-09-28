import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Calendar, CreditCard, ChevronDown } from 'lucide-react';
import { Property } from '../../../lib/repository/types';

interface DashboardHeaderProps {
  userName: string;
  propertyFilter: string;
  onPropertyChange: (propId: string) => void;
  properties: Property[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function DashboardHeader({
  userName,
  propertyFilter,
  onPropertyChange,
  properties,
  dateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const activeProperty = properties.find((p) => p.id === propertyFilter);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      {/* Title & Operational Context */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, {userName}
          </h1>
          {activeProperty ? (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {activeProperty.name}
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              All Properties ({properties.length || 5})
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
          {activeProperty
            ? `Here’s what needs your attention today at ${activeProperty.name}.`
            : 'Here’s what needs your attention across your property portfolio today.'}
        </p>
      </div>

      {/* Operational Controls & Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="select pl-3 pr-8 py-2 text-xs font-medium bg-white border-slate-200 text-slate-700 shadow-2xs hover:border-slate-300"
          >
            <option value="today">Today · {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</option>
            <option value="7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh live data"
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
        </button>

        {/* Secondary Action: Calendar shortcut */}
        <Link
          to="/app/bookings?view=calendar"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
        >
          <Calendar size={14} className="text-slate-500" />
          <span className="hidden sm:inline">Reservation Calendar</span>
        </Link>

        {/* Primary Action: New Booking */}
        <Link
          to="/app/bookings/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs"
        >
          <Plus size={15} />
          <span>New Booking</span>
        </Link>
      </div>
    </div>
  );
}
