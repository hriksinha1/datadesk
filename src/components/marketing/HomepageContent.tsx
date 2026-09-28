import { BookingsScene, CalendarScene, FaqSection, FinalCta, MorningMoment, PaymentsScene, PortfolioScene, TodayScene, TrustLedger, UseCases, WhyItExists } from './HomepageSections';

export default function HomepageContent() {
  return <>
    <MorningMoment />
    <TodayScene />
    <BookingsScene />
    <CalendarScene />
    <PaymentsScene />
    <PortfolioScene />
    <UseCases />
    <WhyItExists />
    <TrustLedger />
    <FaqSection />
    <FinalCta />
  </>;
}
