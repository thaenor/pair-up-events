import LandingPageLayout from '@/components/templates/LandingPageLayout';
import HeroSection from '@/components/organisms/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import EarlyAccess from '@/components/EarlyAccess';

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
      <HowItWorks />
      <Benefits />
      <EarlyAccess />
    </LandingPageLayout>
  );
};

export default Index;
