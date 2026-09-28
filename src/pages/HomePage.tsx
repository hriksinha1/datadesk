import React from 'react';
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <MarketingHeader />
      <main className="flex-1">
        {/* 1. Hero with live desktop PMS snapshot */}
        <HeroSection />

        {/* 2. Human Hospitality Reality with Authentic Photography */}
        <HospitalityStorySection />

        {/* 3. Scattered Systems -> One Connected Workspace */}
        <ProblemScatteredSection />

        {/* 4. Interactive Product Showcase (Dashboard, Bookings, Tape Chart, Payments, Guests) */}
        <InteractiveShowcaseSection />

        {/* 5. Start the Day Knowing: 08:30 AM Morning Briefing */}
        <TodayOperationsSection />

        {/* 6. Hospitality Tape Chart Calendar (Rooms 101-104 + Dates) */}
        <CalendarShowcaseSection />

        {/* 7. Payments & Financial Clarity (Collected vs Due, UPI, Cards, Cash) */}
        <PaymentsShowcaseSection />

        {/* 8. Multi-Property Portfolio Switcher */}
        <MultiPropertySection />

        {/* 9. Tailored Property Types (Hotels, Homestays, Hostels, Lodges) */}
        <PropertyTypesSection />

        {/* 10. Our Philosophy: Free Forever for Independent Hospitality */}
        <FreeProductSection />

        {/* 11. Truthful Trust & Security Architecture */}
        <TrustSecuritySection />

        {/* 12. Final Confident Call to Action */}
        <FinalCtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
