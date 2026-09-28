import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CalendarShowcaseSection() {
  return (
    <section id="calendar" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            HOSPITALITY TAPE CHART
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Know what is occupied before the phone starts ringing.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A visual room-by-room tape chart designed for hospitality. Instant availability checks, zero double bookings, and effortless check-in tracking.
          </p>
        </div>

        {/* The Live Tape Chart Visual Component */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Calendar Header Controls */}
          <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">The Fern Residency · Tape Chart</span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-slate-700">18 Sep – 24 Sep 2026</span>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700"></span> Checked In
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-800"></span> Confirmed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Balance Due
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span> Open Slot
              </span>
            </div>
          </div>

          {/* Grid Representation */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse table-fixed min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 w-40">Room / Unit</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">18 Sep</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">19 Sep</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">20 Sep</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">21 Sep</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">22 Sep</th>
                  <th className="py-2 px-1 text-center font-semibold w-24">23 Sep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Room 101 */}
                <tr className="h-14">
                  <td className="py-2 px-3 font-semibold text-slate-900 bg-slate-50/50">
                    <div>101 Deluxe King</div>
                    <div className="text-[10px] text-slate-400 font-normal">1st Floor · ₹5,000/night</div>
                  </td>
                  <td colSpan={3} className="py-1 px-1">
                    <div className="bg-emerald-800 text-white rounded-md p-2 h-full flex flex-col justify-center border-l-4 border-emerald-400 shadow-2xs">
                      <div className="font-semibold truncate">Ananya Desai (BK-1048)</div>
                      <div className="text-[10px] text-emerald-200 truncate">3 Nights · Checked In</div>
                    </div>
                  </td>
                  <td colSpan={3} className="py-1 px-1 text-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="border border-dashed border-slate-200 rounded-md h-full flex items-center justify-center text-[11px] text-slate-400 gap-1 hover:text-slate-900">
                      <Plus size={12} /> Open Available
                    </div>
                  </td>
                </tr>

                {/* Room 102 */}
                <tr className="h-14">
                  <td className="py-2 px-3 font-semibold text-slate-900 bg-slate-50/50">
                    <div>102 Deluxe Twin</div>
                    <div className="text-[10px] text-slate-400 font-normal">1st Floor · ₹5,500/night</div>
                  </td>
                  <td className="py-1 px-1 text-center text-slate-400">
                    <div className="border border-dashed border-slate-200 rounded-md h-full flex items-center justify-center text-[10px] text-slate-400">
                      Open
                    </div>
                  </td>
                  <td colSpan={2} className="py-1 px-1">
                    <div className="bg-slate-900 text-white rounded-md p-2 h-full flex flex-col justify-center border-l-4 border-blue-400 shadow-2xs">
                      <div className="font-semibold truncate">Vikram Singh (BK-1049)</div>
                      <div className="text-[10px] text-slate-300 truncate">2 Nights · Confirmed</div>
                    </div>
                  </td>
                  <td colSpan={3} className="py-1 px-1 text-center text-slate-400">
                    <div className="border border-dashed border-slate-200 rounded-md h-full flex items-center justify-center text-[10px] text-slate-400">
                      Open
                    </div>
                  </td>
                </tr>

                {/* Room 103 */}
                <tr className="h-14">
                  <td className="py-2 px-3 font-semibold text-slate-900 bg-slate-50/50">
                    <div>103 Exec Suite</div>
                    <div className="text-[10px] text-slate-400 font-normal">1st Floor · ₹9,000/night</div>
                  </td>
                  <td colSpan={3} className="py-1 px-1">
                    <div className="bg-emerald-800 text-white rounded-md p-2 h-full flex flex-col justify-center border-l-4 border-emerald-400 shadow-2xs">
                      <div className="font-semibold truncate">Priya Patel (BK-1045)</div>
                      <div className="text-[10px] text-emerald-200 truncate">In-House · Folio Cleared</div>
                    </div>
                  </td>
                  <td colSpan={3} className="py-1 px-1 text-center text-slate-400">
                    <div className="border border-dashed border-slate-200 rounded-md h-full flex items-center justify-center text-[10px] text-slate-400">
                      Open
                    </div>
                  </td>
                </tr>

                {/* Room 104 */}
                <tr className="h-14">
                  <td className="py-2 px-3 font-semibold text-slate-900 bg-slate-50/50">
                    <div>104 Standard</div>
                    <div className="text-[10px] text-slate-400 font-normal">1st Floor · ₹3,500/night</div>
                  </td>
                  <td className="py-1 px-1">
                    <div className="bg-amber-900/90 text-white rounded-md p-2 h-full flex flex-col justify-center border-l-4 border-amber-400 shadow-2xs">
                      <div className="font-semibold truncate text-[11px]">Rahul Sharma</div>
                      <div className="text-[10px] text-amber-200">Checkout Due</div>
                    </div>
                  </td>
                  <td colSpan={3} className="py-1 px-1">
                    <div className="bg-slate-900 text-white rounded-md p-2 h-full flex flex-col justify-center border-l-4 border-slate-400 shadow-2xs">
                      <div className="font-semibold truncate">Sonal Iyer (BK-1050)</div>
                      <div className="text-[10px] text-slate-300 truncate">3 Nights · Arriving 19 Sep</div>
                    </div>
                  </td>
                  <td colSpan={2} className="py-1 px-1 text-center text-slate-400">
                    <div className="border border-dashed border-slate-200 rounded-md h-full flex items-center justify-center text-[10px] text-slate-400">
                      Open
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Click any open slot in the workspace to create a new reservation pre-filled with that room and date.</span>
            <Link to="/app/bookings?view=calendar" className="font-semibold text-slate-900 hover:text-emerald-800 flex items-center gap-1">
              Try the live calendar <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
