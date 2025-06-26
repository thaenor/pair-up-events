
import React from 'react';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  type?: 'page' | 'section' | 'component' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  type = 'component',
  size = 'md',
  className 
}) => {
  const containerClasses = {
    page: 'min-h-screen bg-pairup-darkBlue',
    section: 'min-h-[200px] rounded-lg border border-border bg-card',
    component: 'min-h-[100px] rounded border border-border/50 bg-muted/50',
    inline: 'py-4'
  };

  const textClasses = {
    page: 'text-lg',
    section: 'text-base',
    component: 'text-sm',
    inline: 'text-sm'
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      containerClasses[type],
      className
    )}>
      <LoadingSpinner size={size} />
      <p className={cn(
        'text-muted-foreground font-medium',
        textClasses[type]
      )}>
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
