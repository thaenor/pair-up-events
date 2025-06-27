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

  return (
    <nav className="py-4 w-full absolute top-0 left-0 z-10" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo size='md' />

        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-pairup-cream hover:text-pairup-yellow duration-300" aria-label="Learn how Pair Up Events works">
            How It Works
          </a>
          <a href="#benefits" className="text-pairup-cream hover:text-pairup-yellow duration-300" aria-label="View the benefits of Pair Up Events">
            Benefits
          </a>
          <a href="#early-access" className="text-pairup-cream hover:text-pairup-yellow duration-300" aria-label="Sign up for early access to Pair Up Events">
            Early Access
          </a>
        </div>

        <div className="flex items-center justify-center gap-4">
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
