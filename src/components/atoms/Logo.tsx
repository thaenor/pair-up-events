
import React from 'react';
import { tokens, type SizeToken, type TextToken } from '@/lib/tokens';

interface LogoProps {
  size?: SizeToken;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  // Map logo sizes to appropriate text sizes
  const textSizeMap: Record<SizeToken, TextToken> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    xxl: 'xxl',
    xxxl: 'xxxl',
    hero: 'hero'
  };

  return (
    <div className="flex items-center gap-2">
      <img
        src="/lovable-uploads/d708028b-2d35-41b1-996e-d0c30bbad73a.png"
        alt="Pair Up Events logo"
        className={`${tokens.size[size]} object-contain`}
      />
      {showText && (
        <span className={`${tokens.text[textSizeMap[size]]} font-bold`}>
          <span className="text-pairup-cyan">Pair</span>
          <span className="text-pairup-yellow">Up Events</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
