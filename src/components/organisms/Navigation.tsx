
import React from 'react';
import Logo from '../atoms/Logo';
import Button from '../atoms/Button';
import { tokens } from '@/lib/tokens';

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
    <nav className="py-4 w-full absolute top-0 left-0 z-10">
      <div className={`${tokens.layout.container} ${tokens.layout.flexBetween}`}>
        <Logo size='md' />

        <div className={`hidden md:flex items-center ${tokens.gap.xl}`}>
          <a href="#how-it-works" className={`text-pairup-cream hover:text-pairup-yellow ${tokens.duration.normal}`}>
            How It Works
          </a>
          <a href="#benefits" className={`text-pairup-cream hover:text-pairup-yellow ${tokens.duration.normal}`}>
            Benefits
          </a>
          <a href="#early-access" className={`text-pairup-cream hover:text-pairup-yellow ${tokens.duration.normal}`}>
            Early Access
          </a>
        </div>

        <div className={`${tokens.layout.flexCenter} ${tokens.gap.lg}`}>
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
