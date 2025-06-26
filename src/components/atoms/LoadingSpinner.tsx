
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tokens, type SizeToken } from '@/lib/tokens';

interface LoadingSpinnerProps {
  size?: SizeToken;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  return (
    <Loader2 
      className={cn(
        'animate-spin text-pairup-cyan',
        tokens.size[size],
        className
      )} 
    />
  );
};

export default LoadingSpinner;
