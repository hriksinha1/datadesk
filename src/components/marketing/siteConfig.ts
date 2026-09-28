export const BRAND = {
  name: 'MyTrackYo',
  tagline: 'Clarity for people who run real properties.',
  homeUrl: (import.meta.env.VITE_SITE_URL as string) || 'https://zentrack-gamma.vercel.app',
};

export const SITE_NAV_ITEMS = [
  { label: 'Today', href: '#today' },
  { label: 'Bookings', href: '#bookings' },
  { label: 'Calendar', href: '#calendar' },
  { label: 'Payments', href: '#payments' },
  { label: 'Portfolio', href: '#portfolio' },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'Does it connect to Booking.com or Airbnb?',
    answer: 'Not currently. Bookings are entered and managed in the workspace.',
  },
  {
    question: 'Where is my data stored?',
    answer: 'The sample workspace persists in this browser. When Appwrite is configured, signed-in workspace data uses the Appwrite repository.',
  },
  {
    question: 'Can I export bookings?',
    answer: 'Yes. The bookings view supports CSV export; booking invoices and payment receipts can be downloaded as PDFs.',
  },
  {
    question: 'Can staff have separate logins?',
    answer: 'Sign-in exists, but staff account management and permission controls are not implemented.',
  },
] as const;
