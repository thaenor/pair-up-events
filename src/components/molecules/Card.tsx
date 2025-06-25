
import React from 'react';
import { Card as ShadcnCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'host' | 'guest';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className,
  variant = 'default',
  hover = false
}) => {
  const variantClasses = {
    default: 'bg-pairup-darkBlue/30 border-pairup-darkBlueAlt',
    host: 'bg-pairup-darkBlue/30 border-pairup-cyan/30',
    guest: 'bg-pairup-darkBlue/30 border-pairup-yellow/30'
  };

  return (
    <ShadcnCard 
      className={cn(
        variantClasses[variant],
        'backdrop-blur-sm',
        hover && 'card-hover',
        className
      )}
    >
      {title && (
        <CardHeader>
          <CardTitle className="text-pairup-cream">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={!title ? 'p-6' : ''}>
        {children}
      </CardContent>
    </ShadcnCard>
  );
};

export default Card;
