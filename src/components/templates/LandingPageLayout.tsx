
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleGetStarted = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-pairup-darkBlue">
      {showNavigation && (
        <Navigation onGetStarted={handleGetStarted} onLogin={handleLogin} />
      )}
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default LandingPageLayout;
