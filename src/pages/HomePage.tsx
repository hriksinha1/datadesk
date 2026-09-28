import React from 'react';
import MarketingHeader from '../components/marketing/MarketingHeader';
import HeroSection from '../components/marketing/HeroSection';
import TrustStrip from '../components/marketing/TrustStrip';
import ProblemSolution from '../components/marketing/ProblemSolution';
import WorkflowTimeline from '../components/marketing/WorkflowTimeline';
import FeatureDeepDive from '../components/marketing/FeatureDeepDive';
import PropertyTypesSection from '../components/marketing/PropertyTypesSection';
import PricingSection from '../components/marketing/PricingSection';
import OperatorQuoteSection from '../components/marketing/OperatorQuoteSection';
import CtaBanner from '../components/marketing/CtaBanner';
import MarketingFooter from '../components/marketing/MarketingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <MarketingHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        <ProblemSolution />
        <WorkflowTimeline />
        <FeatureDeepDive />
        <PropertyTypesSection />
        <PricingSection />
        <OperatorQuoteSection />
        <CtaBanner />
      </main>
      <MarketingFooter />
    </div>
  );
}
