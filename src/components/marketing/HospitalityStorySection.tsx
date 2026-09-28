import React from 'react';
import receptionPhoto from '../../assets/images/hotel_reception_editorial_1790573399379.jpg';
import { Clock, PhoneCall, Bed, CreditCard, CheckCircle } from 'lucide-react';

export default function HospitalityStorySection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Editorial Image with authentic front-desk atmosphere */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 lg:aspect-auto lg:h-[460px]">
              <img
                src={receptionPhoto}
                alt="Front desk receptionist checking in a guest at a boutique hotel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                    Front Desk Reality
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    The guest experience happens in person. The software should quietly support it.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Human Story & Empathy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                DAILY REALITY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2 leading-tight">
                Behind every booking is a busy day.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Running a property means keeping up with a dozen moving pieces every single hour:
            </p>

            {/* Quick operational realities list */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                  <Clock size={15} />
                </div>
                <span>Someone is checking in while someone else is requesting a late checkout.</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-700">
                  <CreditCard size={15} />
                </div>
                <span>An advance was paid via UPI, but the remaining folio balance is still due.</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-700">
                  <Bed size={15} />
                </div>
                <span>Room 204 is marked for turnover before 2:00 PM arrivals arrive.</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
                  <PhoneCall size={15} />
                </div>
                <span>A new inquiry is calling to check if a suite is open for the upcoming weekend.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-base font-semibold text-slate-900 leading-relaxed">
                You shouldn’t need five notebooks, sticky notes, and a WhatsApp thread to keep up.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                MyTrackYo brings the whole picture into one clean screen so you can focus on your guests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
