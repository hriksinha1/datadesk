import React from 'react';
import { useDocumentMeta } from '../lib/hooks/useDocumentMeta';
import MarketingHeader from '../components/marketing/MarketingHeader';
import HeroSection from '../components/marketing/HeroSection';
import MarketingFooter from '../components/marketing/MarketingFooter';
import DeferredHomepageSections from '../components/marketing/DeferredHomepageSections';
import { BRAND } from '../components/marketing/siteConfig';

export default function HomePage() {
  useDocumentMeta({
    title: 'Zentrack | Property management for independent stays',
    description: 'See arrivals, room availability, bookings and guest balances in one clear property-management workspace.',
    robots: 'index,follow',
    canonical: BRAND.homeUrl,
  });

  return (
    <div className="mk min-h-screen">
      <a className="mk-skip-link" href="#content">Skip to content</a>
      <MarketingHeader />
      <main id="content" className="flex-1">
        <HeroSection />
        <DeferredHomepageSections />
      </main>
      <MarketingFooter />
    </div>
  );
}
