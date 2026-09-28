import React from 'react';
import { BRAND } from './siteConfig';

const items = [
  { q: 'Is it really free?', a: 'There is no subscription and no trial period.' },
  { q: 'Does it connect to Booking.com or Airbnb?', a: 'Not today. You enter bookings yourself in the workspace.' },
  { q: 'Can I manage more than one property?', a: 'Yes. The workspace supports a property switcher and an all-properties view.' },
  { q: 'Does it handle GST?', a: 'A booking can have GST enabled at a chosen rate, and the invoice PDF includes the GST line and the property GSTIN when set. It does not file GST returns.' },
  { q: 'Do I need to install anything?', a: 'No. It runs in your browser.' },
  { q: 'Where is my data stored?', a: 'The sample workspace keeps everything in your own browser; nothing you enter is sent to a server. Accounts are handled by Appwrite authentication when configured.' },
  { q: 'Can my staff log in?', a: 'Team accounts are not available yet.' },
];

export default function FaqSection() {
  return (
    <section id="faq" className="mk-section bg-[#F6F4EF]">
      <div className="mk-content">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mk-time justify-center text-[0.72rem] font-semibold tracking-[0.12em] text-[#4B5567]">FAQ</div>
          <h2 className="mt-5 text-[#0E1726] mk-h2">Questions people usually ask.</h2>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-[#E4E1D8] bg-white p-4 text-left md:p-5">
              <summary className="cursor-pointer list-none text-base font-semibold text-[#0E1726] marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 max-w-[62ch] text-base text-[#4B5567]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
