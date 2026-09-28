import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Building2, 
  User, 
  Bed, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Booking } from '../../../lib/repository/types';
import { fmtINR } from '../../../lib/utils/formatters';

interface FrontDeskMovementsProps {
  arrivals: Booking[];
  departures: Booking[];
  inHouse: Booking[];
  onCheckIn?: (bookingId: string) => void;
}

export default function FrontDeskMovements({
  arrivals,
  departures,
  inHouse,
}: FrontDeskMovementsProps) {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures' | 'inhouse'>('arrivals');

  const list = activeTab === 'arrivals' ? arrivals : activeTab === 'departures' ? departures : inHouse;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
      {/* Top Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Front Desk Daily Movements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational schedule for front office staff and receptionists
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'arrivals'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Arrivals ({arrivals.length})
          </button>
          <button
            onClick={() => setActiveTab('departures')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'departures'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Departures ({departures.length})
          </button>
          <button
            onClick={() => setActiveTab('inhouse')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'inhouse'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In-House ({inHouse.length})
          </button>
        </div>
      </div>

      {/* Movement List */}
      <div className="divide-y divide-slate-100">
        {list.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-1.5 opacity-80" />
            No {activeTab} scheduled for today in this view.
          </div>
        ) : (
          list.map((item, idx) => {
            const guestName = item.customer?.name || 'Walk-in Guest';
            const roomLabel = item.room_number ? `Room ${item.room_number}` : item.room_type;
            const timeLabel = activeTab === 'arrivals' ? '14:00 IST' : activeTab === 'departures' ? '11:00 IST' : 'Stay Active';

            return (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/60 rounded-lg px-2 -mx-2 transition-colors"
              >
                {/* Left: Time & Guest */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-14 shrink-0 text-[11px] font-mono font-medium text-slate-500 flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>{timeLabel}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {guestName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.booking_no}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="text-slate-700 font-medium">{roomLabel}</span>
                      <span>·</span>
                      <span>{item.nights} {item.nights === 1 ? 'night' : 'nights'}</span>
                      <span>·</span>
                      <span>{item.guests} {item.guests === 1 ? 'guest' : 'guests'}</span>
                      {item.property?.name && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400">{item.property.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Payment Status & 1-Click Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-900 tabular-nums">
                      {fmtINR(item.grand_total)}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.payment_status === 'Fully Paid' || item.payment_status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : item.payment_status === 'Partially Paid'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {item.payment_status}
                    </span>
                  </div>

                  <Link
                    to={`/app/bookings/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
                  >
                    <span>{activeTab === 'arrivals' ? 'Check In' : 'Folio'}</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
