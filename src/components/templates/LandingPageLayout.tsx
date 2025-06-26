
import React from 'react';
import Navigation from '../organisms/Navigation';
import Footer from '../organisms/Footer';

interface LandingPageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}) => {

  const handleGetStarted = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-pairup-darkBlue">
      {showNavigation && (
        <Navigation onGetStarted={handleGetStarted} />
      )}
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default LandingPageLayout;
