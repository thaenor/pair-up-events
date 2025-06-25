
import React from 'react';
import LandingPageLayout from '@/components/templates/LandingPageLayout';
import HeroSection from '@/components/organisms/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import EarlyAccess from '@/components/EarlyAccess';

const Index = () => {
  console.log('Index page rendered');

  const handleCreateEvent = () => {
    console.log('Create event clicked');
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrowseEvents = () => {
    console.log('Browse events clicked');
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LandingPageLayout>
      <HeroSection 
        onCreateEvent={handleCreateEvent}
        onBrowseEvents={handleBrowseEvents}
      />
      <HowItWorks />
      <Benefits />
      <EarlyAccess />
    </LandingPageLayout>
  );
};

export default Index;
