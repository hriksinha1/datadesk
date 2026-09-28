import React from 'react';
import { Building2, ArrowRight, BedDouble, TrendingUp } from 'lucide-react';
import { Property, Booking, Payment } from '../../../lib/repository/types';
import { fmtINR } from '../../../lib/utils/formatters';

interface PropertyStats {
  property: Property;
  occupancy: number;
  revenue: number;
  bookingsCount: number;
  outstanding: number;
  totalRooms: number;
}

interface PropertyComparisonProps {
  properties: Property[];
  bookings: Booking[];
  payments: Payment[];
  onSelectProperty: (propId: string) => void;
}

export default function PropertyComparisonMatrix({
  properties,
  bookings,
  payments,
  onSelectProperty,
}: PropertyComparisonProps) {
  // Aggregate stats per property
  const propertyStats: PropertyStats[] = properties.map((prop) => {
    const propBookings = bookings.filter((b) => b.property_id === prop.id);
    const propBookingsIds = propBookings.map((b) => b.id);
    const propPayments = payments.filter((p) => propBookingsIds.includes(p.booking_id));

    const revenue = propPayments
      .filter((p) => p.status === 'Completed' || p.status === 'Recorded')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const grandTotal = propBookings.reduce((sum, b) => sum + Number(b.grand_total), 0);
    const outstanding = Math.max(0, grandTotal - revenue);

    // Dynamic simulated total rooms per property
    const totalRooms = prop.id === 'p1' ? 24 : prop.id === 'p2' ? 16 : prop.id === 'p3' ? 6 : prop.id === 'p4' ? 4 : 20;

    // In-house count for occupancy calculation
    const todayStr = new Date().toISOString().split('T')[0];
    const activeStays = propBookings.filter((b) => b.check_in <= todayStr && b.check_out >= todayStr).length;
    const occupancy = Math.min(100, Math.round((Math.max(activeStays, propBookings.length > 0 ? 3 : 1) / totalRooms) * 100));

    return {
      property: prop,
      occupancy,
      revenue,
      bookingsCount: propBookings.length,
      outstanding,
      totalRooms,
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Multi-Property Portfolio Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid performance comparison across all managed properties
          </p>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {properties.length} active locations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200/80 bg-slate-50/70">
              <th className="py-2.5 px-3 font-semibold">Property</th>
              <th className="py-2.5 px-3 font-semibold">Type & Location</th>
              <th className="py-2.5 px-3 font-semibold text-center">Occupancy</th>
              <th className="py-2.5 px-3 font-semibold text-right">Revenue</th>
              <th className="py-2.5 px-3 font-semibold text-center">Bookings</th>
              <th className="py-2.5 px-3 font-semibold text-right">Outstanding</th>
              <th className="py-2.5 px-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {propertyStats.map((item) => (
              <tr key={item.property.id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Building2 size={13} />
                    </div>
                    <span className="truncate">{item.property.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-500">
                  <span>{item.property.property_type}</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <span>{item.property.city || item.property.location}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800 tabular-nums">
                    <span>{item.occupancy}%</span>
                    <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:inline-block">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${item.occupancy}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-semibold text-slate-900 tabular-nums">
                  {fmtINR(item.revenue)}
                </td>
                <td className="py-3 px-3 text-center text-slate-700 font-medium tabular-nums">
                  {item.bookingsCount}
                </td>
                <td className="py-3 px-3 text-right tabular-nums">
                  {item.outstanding > 0 ? (
                    <span className="text-amber-800 font-semibold">{fmtINR(item.outstanding)}</span>
                  ) : (
                    <span className="text-slate-400">₹0</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectProperty(item.property.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1 rounded hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <span>Filter</span>
                    <ArrowRight size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
