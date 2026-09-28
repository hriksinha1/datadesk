import React from 'react';
import { useDocumentMeta } from '../lib/hooks/useDocumentMeta';
import MarketingHeader from '../components/marketing/MarketingHeader';
import HeroSection from '../components/marketing/HeroSection';
import HospitalityStorySection from '../components/marketing/HospitalityStorySection';
import ProblemScatteredSection from '../components/marketing/ProblemScatteredSection';
import InteractiveShowcaseSection from '../components/marketing/InteractiveShowcaseSection';
import TodayOperationsSection from '../components/marketing/TodayOperationsSection';
import CalendarShowcaseSection from '../components/marketing/CalendarShowcaseSection';
import PaymentsShowcaseSection from '../components/marketing/PaymentsShowcaseSection';
import MultiPropertySection from '../components/marketing/MultiPropertySection';
import PropertyTypesSection from '../components/marketing/PropertyTypesSection';
import FreeProductSection from '../components/marketing/FreeProductSection';
import TrustSecuritySection from '../components/marketing/TrustSecuritySection';
import FinalCtaSection from '../components/marketing/FinalCtaSection';
import MarketingFooter from '../components/marketing/MarketingFooter';
import AudienceStrip from '../components/marketing/AudienceStrip';
import FaqSection from '../components/marketing/FaqSection';

export default function HomePage() {
  useDocumentMeta({
    title: 'MyTrackYo | Free property management for hotels and homestays',
    description: 'Free property management workspace for hotels, homestays, hostels and lodges in India.',
    robots: 'index,follow',
    canonical: `${import.meta.env.VITE_SITE_URL || 'https://zentrack-gamma.vercel.app'}`,
  });

  return (
    <div className="mk min-h-screen bg-[#f5f4f0] text-[#0E1726] selection:bg-[#dff1ea] selection:text-[#0E1726]">
      <MarketingHeader />
      <main id="content" className="flex-1">
        <HeroSection />
        <AudienceStrip />
        <HospitalityStorySection />
        <ProblemScatteredSection />
        <InteractiveShowcaseSection />
        <TodayOperationsSection />
        <CalendarShowcaseSection />
        <PaymentsShowcaseSection />
        <MultiPropertySection />
        <PropertyTypesSection />
        <FreeProductSection />
        <TrustSecuritySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
