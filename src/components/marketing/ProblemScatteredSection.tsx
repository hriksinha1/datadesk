import React from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  FileSpreadsheet, 
  Receipt, 
  Calendar, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';

export default function ProblemScatteredSection() {
  const scatteredTools = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Chats',
      note: 'Advance payment screenshot sent at 11:42 PM',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: BookOpen,
      title: 'Physical Register',
      note: 'Guest ID number scribbled on page 48',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: FileSpreadsheet,
      title: 'Desktop Spreadsheet',
      note: 'Room tariff formula overwritten by accident',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      icon: Receipt,
      title: 'Loose UPI Receipts',
      note: '₹8,500 unlinked transaction reference',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      icon: Calendar,
      title: 'Wall Calendar',
      note: 'Double booking cross-out on Room 102',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      icon: Phone,
      title: 'Phone Notes',
      note: 'Caller requesting high floor with extra bed',
      color: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
            THE OPERATIONAL SHIFT
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            From scattered pieces to one connected rhythm.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            When reservations, receipts, and guest notes live in separate places, small mistakes turn into awkward front-desk moments.
          </p>
        </div>

        {/* Visual Converging Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Scattered Fragments (6 small realistic fragments) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scatteredTools.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${t.color} shadow-2xs transition-all hover:scale-[1.02] flex items-start gap-3`}
                >
                  <div className="p-2 rounded-lg bg-white shrink-0 shadow-2xs">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {t.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Connector Indicator */}
          <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-400">
            <div className="p-2.5 rounded-full bg-white border border-slate-200 shadow-2xs">
              <ArrowRight size={18} className="text-slate-700" />
            </div>
          </div>

          {/* Right: The Unified MyTrackYo System Card */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">MyTrackYo Workspace</div>
                  <div className="text-[10px] text-slate-500">Live operational sync</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                All Linked
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Guest Folio</span>
                <span className="font-semibold text-slate-900">Ananya Desai · Room 204</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Dates Locked</span>
                <span className="font-semibold text-slate-900">18 Sep → 21 Sep (3N)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Advance Recorded</span>
                <span className="font-semibold text-emerald-800">₹8,300 (UPI Ref #98234)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <span className="text-amber-900 font-medium">Checkout Due</span>
                <span className="font-bold text-amber-900">₹8,500 pending</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
              <span>Everything linked to one reservation number: <strong>BK-1048</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
