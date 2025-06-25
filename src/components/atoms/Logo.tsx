
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xlg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 object-contain',
    lg: 'w-12 h-12',
    xlg: "w-64 h-64 md:w-80 md:h-80 object-contain"
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className="flex items-center gap-2">
      <img
        src="/lovable-uploads/d708028b-2d35-41b1-996e-d0c30bbad73a.png"
        alt="Pair Up Events logo"
        className={sizeClasses[size]}
      />
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold`}>
          <span className="text-pairup-cyan">Pair</span>
          <span className="text-pairup-yellow">Up Events</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
