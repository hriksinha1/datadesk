import React from 'react';
import { BedDouble, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface OccupancyCardProps {
  occupancyPct: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  trendData: Array<{ day: string; occupancy: number; occupied: number }>;
}

export default function OccupancyCard({
  occupancyPct,
  totalRooms,
  occupiedRooms,
  availableRooms,
  reservedRooms,
  maintenanceRooms,
  trendData,
}: OccupancyCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Unit Occupancy & Room Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current inventory allocation & 7-day occupancy trend
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {occupancyPct}%
            </span>
            <span className="text-xs text-slate-500 ml-1">occupied</span>
          </div>
        </div>

        {/* Status Distribution Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
            <div className="text-[11px] font-medium text-emerald-800">Occupied</div>
            <div className="text-lg font-bold text-emerald-950 mt-0.5 tabular-nums">
              {occupiedRooms}
            </div>
            <div className="text-[10px] text-emerald-700">In-house guests</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-medium text-slate-600">Available</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
              {availableRooms}
            </div>
            <div className="text-[10px] text-slate-500">Ready for walk-ins</div>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
            <div className="text-[11px] font-medium text-blue-800">Reserved</div>
            <div className="text-lg font-bold text-blue-950 mt-0.5 tabular-nums">
              {reservedRooms}
            </div>
            <div className="text-[10px] text-blue-700">Due today/tomorrow</div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80">
            <div className="text-[11px] font-medium text-amber-800">Maintenance</div>
            <div className="text-lg font-bold text-amber-950 mt-0.5 tabular-nums">
              {maintenanceRooms}
            </div>
            <div className="text-[10px] text-amber-700">Blocked / Service</div>
          </div>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex mb-4">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }}
            title={`Occupied: ${occupiedRooms}`}
          />
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(reservedRooms / totalRooms) * 100}%` }}
            title={`Reserved: ${reservedRooms}`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${(maintenanceRooms / totalRooms) * 100}%` }}
            title={`Maintenance: ${maintenanceRooms}`}
          />
          <div
            className="bg-slate-200 h-full transition-all duration-300"
            style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
            title={`Available: ${availableRooms}`}
          />
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 mb-2">
          7-Day Occupancy Trend (%)
        </div>
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg">
                        <div className="font-semibold">{data.day}</div>
                        <div className="text-emerald-400 mt-0.5">{data.occupancy}% Occupancy</div>
                        <div className="text-slate-300 text-[10px]">{data.occupied} of {totalRooms} rooms</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="occupancy" fill="#0D5C4D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
