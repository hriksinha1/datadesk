import { ArrowRight, CalendarDays, CreditCard, UserRound, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PreviewBookings, PreviewCalendar, PreviewPayments, PreviewPortfolio } from './preview/HomepagePreviews';
import PreviewToday from './preview/PreviewToday';
import SampleWorkspaceAction from './SampleWorkspaceAction';
import Reveal from './Reveal';

export function MorningMoment() {
  const moments = [
    ['08:30', 'Three guests arrive today. One still owes an advance.'],
    ['11:00', 'Someone asks if a room is free this weekend.'],
    ['14:00', 'A late checkout overlaps with the next arrival.'],
    ['18:00', 'The UPI advance is in. The balance is still open.'],
  ];
  return <section className="mk-morning" id="morning" aria-labelledby="morning-title"><div className="mk-shell mk-morning-layout">
    <div className="mk-morning-intro"><span className="mk-section-marker">A day at the front desk · illustrative</span><h2 id="morning-title">08:30. The phone is already ringing.</h2><p>Four small decisions. One busy morning. And the details are scattered across messages, a notebook, and yesterday’s memory.</p><div className="mk-audience-line">For independent hotels, homestays, hostels, lodges, and owners of several properties.</div></div>
    <ol className="mk-day-timeline">{moments.map(([time, text]) => <li key={time}><time>{time}</time><p>{text}</p></li>)}</ol>
    <p className="mk-pull-line">You shouldn’t need five notebooks, sticky notes, and a WhatsApp thread to keep up.</p>
  </div></section>;
}

export function TodayScene() {
  return <section className="mk-section mk-today-section" id="today" aria-labelledby="today-title"><div className="mk-shell mk-scene-layout">
    <div className="mk-scene-copy"><span className="mk-section-marker">01 — The day</span><h2 id="today-title">Start with what needs you.</h2><p>Arrivals, departures, who’s in house, and balances still open, together on the Today view.</p><ul className="mk-plain-list"><li>See today’s arrivals and departures</li><li>Keep an eye on in-house bookings</li><li>Spot balances that still need attention</li></ul><a className="mk-text-link" href="#bookings">Next: find any stay <ArrowRight size={16} aria-hidden="true" /></a></div>
    <Reveal className="mk-scene-visual"><PreviewToday /></Reveal>
  </div></section>;
}

export function BookingsScene() {
  return <section className="mk-section mk-bookings-section" id="bookings" aria-labelledby="bookings-title"><div className="mk-shell mk-scene-layout mk-scene-reverse">
    <Reveal className="mk-scene-visual"><PreviewBookings /></Reveal>
    <div className="mk-scene-copy"><span className="mk-section-marker">02 — The stay</span><h2 id="bookings-title">Type a name. See the whole stay.</h2><p>Dates, room, guest details and payment balance stay together on one booking.</p><p className="mk-scene-aside"><UserRound size={18} aria-hidden="true" /> Search the sample list by guest, room, or booking number.</p></div>
  </div></section>;
}

export function CalendarScene() {
  return <section className="mk-section mk-calendar-section" id="calendar" aria-labelledby="calendar-title"><div className="mk-shell">
    <div className="mk-calendar-intro"><span className="mk-section-marker">03 — The room board</span><h2 id="calendar-title">See which room is free before you answer.</h2><p>One row per room, one column per night. The booking bar tells you who is staying and when they leave.</p></div>
    <Reveal><PreviewCalendar /></Reveal>
  </div></section>;
}

export function PaymentsScene() {
  return <section className="mk-section mk-payments-section" id="payments" aria-labelledby="payments-title"><div className="mk-shell mk-scene-layout">
    <div className="mk-scene-copy"><span className="mk-section-marker">04 — The folio</span><h2 id="payments-title">Know what’s paid. Know what’s owed.</h2><p>Record advances and payments against a stay. The remaining balance is calculated from the booking total.</p><p className="mk-scene-aside"><CreditCard size={18} aria-hidden="true" /> A receipt-like view, with the arithmetic visible.</p></div>
    <Reveal className="mk-scene-visual"><PreviewPayments /></Reveal>
  </div></section>;
}

export function PortfolioScene() {
  return <section className="mk-section mk-portfolio-section" id="portfolio" aria-labelledby="portfolio-title"><div className="mk-shell mk-portfolio-layout">
    <div className="mk-scene-copy"><span className="mk-section-marker">05 — The portfolio</span><h2 id="portfolio-title">Every property, one login.</h2><p>Switch property scope in the workspace. Each property keeps its own bookings, rooms and balances.</p><p className="mk-portfolio-note">The figures shown are sample data, combined from one consistent set of stays.</p></div>
    <Reveal><PreviewPortfolio /></Reveal>
  </div></section>;
}

const useCases = [
  { title: 'Hotels', icon: Building2, content: 'Keep room assignments, guest stays and folio balances in view at the front desk.' },
  { title: 'Homestays & lodges', icon: UserRound, content: 'Record direct bookings, guest details, room allocation and advances in one workspace.' },
  { title: 'Hostels & dorms', icon: CalendarDays, content: 'Track bookings, units, guest records and payment status across your property.' },
  { title: 'Small resorts', icon: CreditCard, content: 'See property-level bookings and payments without needing an enterprise-sized system.' },
];

export function UseCases() {
  return <section className="mk-section mk-use-cases" id="use-cases" aria-labelledby="use-cases-title"><div className="mk-shell mk-use-layout">
    <div className="mk-use-intro"><span className="mk-section-marker">Made for the person on the ground</span><h2 id="use-cases-title">Built for the way your place actually runs.</h2><p>Different properties. The same need to see the next arrival, open room, and unpaid balance.</p></div>
    <div className="mk-use-list">{useCases.map(({ title, icon: Icon, content }) => <details key={title} className="mk-use-item"><summary><span className="mk-use-icon"><Icon size={19} aria-hidden="true" /></span><span>{title}</span><span className="mk-use-plus" aria-hidden="true">+</span></summary><p>{content}</p></details>)}</div>
  </div></section>;
}

export function WhyItExists() {
  return <section className="mk-section mk-why" id="why" aria-labelledby="why-title"><div className="mk-shell mk-why-layout"><span className="mk-section-marker">Why MyTrackYo exists</span><h2 id="why-title">The screen you look at when the phone rings.</h2><div className="mk-why-copy"><p>Property software should help you answer the next practical question, not add another system to manage.</p><div className="mk-why-points"><p><b>See the day.</b> Arrivals, departures, and in-house stays.</p><p><b>Follow the money.</b> Payments and remaining balances.</p><p><b>Keep it together.</b> Guests, rooms, and bookings in one place.</p></div></div></div></section>;
}

export function TrustLedger() {
  return <section className="mk-section mk-trust" id="trust" aria-labelledby="trust-title"><div className="mk-shell"><div className="mk-trust-heading"><span className="mk-section-marker">Plain about the boundaries</span><h2 id="trust-title">What it does. What it doesn’t do yet.</h2></div><div className="mk-trust-ledger"><div><h3>In the workspace</h3><ul><li>Bookings, guest records, rooms and properties</li><li>Payments, balances, CSV exports and PDF invoices/receipts</li><li>Optional Appwrite-backed data repository when configured</li><li>Sample workspace data persists in this browser</li></ul></div><div><h3>Not connected here</h3><ul><li>Booking.com or Airbnb channel sync</li><li>Online payment gateway or bank sync</li><li>Automated WhatsApp or SMS messages</li><li>Housekeeping workflows or AI automation</li></ul></div></div><p className="mk-trust-footnote">Appwrite setup is configuration-dependent. The sample workspace uses local browser storage; production storage depends on the configured repository.</p></div></section>;
}

const faqs = [
  ['Can I connect Booking.com or Airbnb?', 'Not currently. Bookings are entered and managed in the workspace; channel-manager integrations are not present in the current app.'],
  ['Where is my data stored?', 'The sample workspace stores its data in your browser. When Appwrite is configured, signed-in accounts use the Appwrite repository for workspace data.'],
  ['Can I export bookings?', 'Yes. The bookings view includes a CSV export. Booking invoices and payment receipts can also be downloaded as PDFs.'],
  ['Can staff have separate logins?', 'The current interface supports sign-in, but staff roles and permission controls are not implemented as a team-management feature.'],
  ['Can I try the sample workspace?', 'Yes. Use “Open the sample workspace” to enter the demo. If you already have a real authenticated session, it is preserved.'],
];

export function FaqSection() {
  return <section className="mk-section mk-faq" id="faq" aria-labelledby="faq-title"><div className="mk-shell mk-faq-layout"><div><span className="mk-section-marker">Questions from the desk</span><h2 id="faq-title">Before you move a booking over.</h2></div><div className="mk-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>;
}

export function FinalCta() {
  return <section className="mk-final-cta" aria-labelledby="final-cta-title"><div className="mk-tape-rule mk-tape-rule-light" aria-hidden="true"><i /><i /><b /><i /><i /></div><div className="mk-shell mk-final-inner"><span className="mk-section-marker">Tomorrow starts here</span><h2 id="final-cta-title">Tomorrow’s arrivals, already in front of you.</h2><div className="mk-final-actions"><Link className="mk-button-light" to="/signup">Create your workspace<ArrowRight size={17} aria-hidden="true" /></Link><SampleWorkspaceAction className="mk-final-secondary" /></div></div></section>;
}
