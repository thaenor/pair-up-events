
import React from 'react';
import Logo from '../atoms/Logo';
import Button from '../atoms/Button';

interface NavigationProps {
  isLoggedIn?: boolean;
  onGetStarted?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isLoggedIn = false,
  onGetStarted,
  onLogin,
  onLogout
}) => {
  console.log('Navigation rendered with isLoggedIn:', isLoggedIn);

  return (
    <nav className="py-4 w-full absolute top-0 left-0 z-10">
      <div className="container-custom flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-pairup-cream hover:text-pairup-yellow transition-colors">
            How It Works
          </a>
          <a href="#benefits" className="text-pairup-cream hover:text-pairup-yellow transition-colors">
            Benefits
          </a>
          <a href="#early-access" className="text-pairup-cream hover:text-pairup-yellow transition-colors">
            Early Access
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onLogin}>
                Login
              </Button>
              <Button variant="primary" onClick={onGetStarted}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
