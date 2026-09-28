export const BRAND = {
  name: 'MyTrackYo',
  tagline: 'Property management for people who run real properties.',
  domain: 'mytrackyo.in',
  homeUrl: (import.meta.env.VITE_SITE_URL as string) || 'https://zentrack-gamma.vercel.app',
  contactEmail: (import.meta.env.VITE_CONTACT_EMAIL as string) || '',
  socialLinks: {
    linkedin: (import.meta.env.VITE_SOCIAL_LINKEDIN as string) || '',
    instagram: (import.meta.env.VITE_SOCIAL_INSTAGRAM as string) || '',
    x: (import.meta.env.VITE_SOCIAL_X as string) || '',
  },
};

export const SITE_NAV_ITEMS = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#use-cases' },
  { label: 'How it works', href: '#story' },
  { label: 'Why free', href: '#why-free' },
];

export const FAQ_ITEMS = [
  {
    question: 'Is it really free?',
    answer: 'There is no subscription and no trial period. MyTrackYo is free to use.'
  },
  {
    question: 'Does it connect to Booking.com or Airbnb?',
    answer: 'Not today. You enter bookings yourself in the workspace.'
  },
  {
    question: 'Can I manage more than one property?',
    answer: 'Yes. The workspace supports a property switcher and an all-properties view for owners with more than one property.'
  },
  {
    question: 'Does it handle GST?',
    answer: 'A booking can have GST enabled at a chosen rate, and the invoice PDF includes the GST line and the property GSTIN when set. It does not file GST returns.'
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No. It runs in your browser.'
  },
  {
    question: 'Where is my data stored?',
    answer: 'The sample workspace keeps everything in your own browser; nothing you enter is sent to a server. Accounts are handled by Appwrite authentication when configured.'
  },
  {
    question: 'Can my staff log in?',
    answer: 'Team accounts are not available yet.'
  }
];
