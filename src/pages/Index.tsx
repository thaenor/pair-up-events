
import React from 'react';
import { 
  LandingPageLayout, 
  HeroSection, 
  HowItWorksSection, 
  BenefitsSection, 
  EarlyAccessSection 
} from '@/components';

const Index = () => {
  const handleCreateEvent = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrowseEvents = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LandingPageLayout>
      <HeroSection
        onCreateEvent={handleCreateEvent}
        onBrowseEvents={handleBrowseEvents}
      />
      <HowItWorksSection />
      <BenefitsSection />
      <EarlyAccessSection />
    </LandingPageLayout>
  );
};

export default Index;
