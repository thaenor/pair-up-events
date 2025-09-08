
import { useNavigate } from 'react-router-dom';
import { 
  LandingPageLayout, 
  HeroSection, 
  HowItWorksSection, 
  BenefitsSection, 
  EarlyAccessSection,
  PageWrapper
} from '@/components';

const Index = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create');
  };

  const handleBrowseEvents = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <LandingPageLayout>
        <HeroSection
          onCreateEvent={handleCreateEvent}
          onBrowseEvents={handleBrowseEvents}
        />
        <HowItWorksSection />
        <BenefitsSection />
        <EarlyAccessSection />
      </LandingPageLayout>
    </PageWrapper>
  );
};

export default Index;
