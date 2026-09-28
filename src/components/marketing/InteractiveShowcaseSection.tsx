import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Table, 
  CreditCard, 
  Users, 
  ArrowRight,
  BedDouble,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ShowcaseTab = 'dashboard' | 'bookings' | 'calendar' | 'payments' | 'guests';

export default function InteractiveShowcaseSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('dashboard');

  const tabs: Array<{ id: ShowcaseTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Table },
    { id: 'calendar', label: 'Tape Chart', icon: CalendarDays },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'guests', label: 'Guest Records', icon: Users },
  ];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = tabs.length;
    let nextIndex = index;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % total;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + total) % total;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = total - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex].id;
    setActiveTab(nextTab);
    const nextButton = document.getElementById(`tab-${nextTab}`) as HTMLButtonElement | null;
    nextButton?.focus();
  };

  return (
    <section id="product" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            THE CONNECTED WORKSPACE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            Everything the property team needs. Together.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Explore how MyTrackYo organizes everyday front desk, folio, and reservation workflows.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div role="tablist" aria-label="Product preview sections" className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 flex-wrap justify-center">
            {tabs.map(({ id, label, icon: Icon }, index) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Window Frame */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-2 sm:p-4 text-white">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              <span className="text-[11px] font-mono text-slate-400 ml-2">
                mytrackyo.local / app / {activeTab}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                The Fern Residency
              </span>
            </div>
          </div>

          {/* TAB 1: DASHBOARD PREVIEW */}
          {activeTab === 'dashboard' && (
            <div id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard" className="space-y-4 p-2 sm:p-4 bg-slate-900/60 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Occupancy</span>
                    <BedDouble size={14} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold mt-1 text-white tabular-nums">78%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">31 of 40 units occupied</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Arrivals Today</span>
                    <ArrowDownRight size={14} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold mt-1 text-white tabular-nums">12</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">4 due before 2:00 PM</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Departures</span>
                    <ArrowUpRight size={14} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold mt-1 text-white tabular-nums">8</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">3 pending checkout</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Realized Revenue</span>
                    <TrendingUp size={14} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold mt-1 text-white tabular-nums">₹48,240</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+12.5% vs yesterday</div>
                </div>
              </div>

              {/* Attention strip */}
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-semibold text-amber-200">Pending Folio Balance:</span>
                  <span className="text-slate-300">Rahul Sharma (Room 302) departs today with ₹4,200 due.</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-400 underline cursor-pointer">Settle Folio</span>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS PREVIEW */}
          {activeTab === 'bookings' && (
            <div id="panel-bookings" role="tabpanel" aria-labelledby="tab-bookings" className="p-2 sm:p-4 bg-slate-900/60 rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 pb-2">
                      <th className="py-2 px-3 font-semibold">Guest</th>
                      <th className="py-2 px-3 font-semibold">Booking #</th>
                      <th className="py-2 px-3 font-semibold">Stay Dates</th>
                      <th className="py-2 px-3 font-semibold">Room Allocated</th>
                      <th className="py-2 px-3 font-semibold text-right">Total</th>
                      <th className="py-2 px-3 font-semibold text-center">Payment</th>
                      <th className="py-2 px-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">Ananya Desai</div>
                        <div className="text-[10px] text-slate-400">+91 91234 56703</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">BK-1048</td>
                      <td className="py-3 px-3 text-slate-300">18 Sep → 21 Sep (3N)</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">Room 101 · Deluxe</td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">₹16,800</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-900/40 text-amber-300 border border-amber-800">
                          Partially Paid
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/40 text-emerald-300">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">Vikram Singh</div>
                        <div className="text-[10px] text-slate-400">+91 91234 56704</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">BK-1049</td>
                      <td className="py-3 px-3 text-slate-300">18 Sep → 20 Sep (2N)</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">Room 102 · Deluxe</td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">₹12,320</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                          Fully Paid
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/40 text-emerald-300">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">Priya Patel</div>
                        <div className="text-[10px] text-slate-400">+91 91234 56702</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">BK-1045</td>
                      <td className="py-3 px-3 text-slate-300">17 Sep → 20 Sep (3N)</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">Room 103 · Suite</td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">₹31,860</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                          Fully Paid
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-700 text-white">
                          Checked In
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CALENDAR TAPE CHART PREVIEW */}
          {activeTab === 'calendar' && (
            <div id="panel-calendar" role="tabpanel" aria-labelledby="tab-calendar" className="p-2 sm:p-4 bg-slate-900/60 rounded-xl space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-white">Hospitality Tape Chart · Week View</span>
                <span className="text-[11px] text-emerald-400">● Live Room Availability</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse table-fixed">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="py-2 px-2 w-32 font-semibold">Room</th>
                      <th className="py-2 px-1 text-center font-medium">18 Sep</th>
                      <th className="py-2 px-1 text-center font-medium">19 Sep</th>
                      <th className="py-2 px-1 text-center font-medium">20 Sep</th>
                      <th className="py-2 px-1 text-center font-medium">21 Sep</th>
                      <th className="py-2 px-1 text-center font-medium">22 Sep</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-2 px-2 font-semibold text-slate-200">101 Deluxe</td>
                      <td colSpan={3} className="py-1 px-1">
                        <div className="bg-emerald-800 text-white text-[11px] font-semibold px-2 py-1.5 rounded-md truncate border-l-4 border-emerald-400">
                          Ananya Desai · 3N · Checked In
                        </div>
                      </td>
                      <td colSpan={2} className="py-1 px-1 text-slate-600 text-center text-[10px]">
                        Available
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-slate-200">102 Deluxe</td>
                      <td className="py-1 px-1 text-slate-600 text-center text-[10px]">Available</td>
                      <td colSpan={2} className="py-1 px-1">
                        <div className="bg-slate-800 text-white text-[11px] font-semibold px-2 py-1.5 rounded-md truncate border-l-4 border-blue-400">
                          Vikram Singh · 2N · Confirmed
                        </div>
                      </td>
                      <td colSpan={2} className="py-1 px-1 text-slate-600 text-center text-[10px]">Available</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-slate-200">103 Suite</td>
                      <td colSpan={2} className="py-1 px-1">
                        <div className="bg-emerald-800 text-white text-[11px] font-semibold px-2 py-1.5 rounded-md truncate border-l-4 border-emerald-400">
                          Priya Patel · In-House
                        </div>
                      </td>
                      <td colSpan={3} className="py-1 px-1 text-slate-600 text-center text-[10px]">Available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS PREVIEW */}
          {activeTab === 'payments' && (
            <div id="panel-payments" role="tabpanel" aria-labelledby="tab-payments" className="p-2 sm:p-4 bg-slate-900/60 rounded-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Total Collected</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">₹2,49,700</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">87.8% Collection Rate</div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Outstanding Balances</div>
                  <div className="text-xl font-bold text-amber-400 mt-1 tabular-nums">₹34,800</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Across 5 guest folios</div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 font-medium">Settlement Methods</div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">UPI (51%) · Card (31%) · Cash (18%)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Every receipt reconciled</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GUESTS PREVIEW */}
          {activeTab === 'guests' && (
            <div id="panel-guests" role="tabpanel" aria-labelledby="tab-guests" className="p-2 sm:p-4 bg-slate-900/60 rounded-xl space-y-3">
              <div className="text-xs text-slate-400 pb-1">
                Direct guest directory with phone, email, and historical stay folios.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="font-semibold text-white text-xs">Ananya Desai</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Phone size={11} /> +91 91234 56703
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-2">3 previous stays · ₹42,000 total</div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="font-semibold text-white text-xs">Rahul Sharma</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Phone size={11} /> +91 91234 56701
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">2 previous stays · ₹18,000 total</div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="font-semibold text-white text-xs">Priya Patel</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Mail size={11} /> priya.patel@outlook.com
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-2">Executive guest · Corporate folio</div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: Action */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 px-2 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">
              Ready to explore live data in the app?
            </span>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <span>Create your workspace</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
