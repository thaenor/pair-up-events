import {
  BenefitsSection,
  EarlyAccessSection,
  HeroSection,
  HowItWorksSection,
  LandingPageLayout,
  PageWrapper
} from '@/components';

const Index = () => {
  const handleCreateEvent = () => {
    window.location.href = 'https://forms.google.com';
  };

  return (
    <PageWrapper>
      <LandingPageLayout>
        <HeroSection
          onCreateEvent={handleCreateEvent}
        />
        <HowItWorksSection />
        <BenefitsSection />
        <EarlyAccessSection />
      </LandingPageLayout>
    </PageWrapper>
  );
};

export default Index;
