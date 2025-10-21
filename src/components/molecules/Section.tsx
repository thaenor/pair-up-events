import React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  id?: string;
  title?: string;
  description?: string;
  background?: 'transparent' | 'cream' | 'white';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  description,
  background = 'transparent',
  padding = 'lg',
  children,
  className
}) => {
  const backgroundClasses = {
    transparent: 'bg-transparent',
    cream: 'bg-pairup-cream',
    white: 'bg-white'
  };

  const paddingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32'
  };

  return (
    <section
      id={id}
      className={cn(
        "px-4 md:px-8",
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-pairup-darkBlue/80 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
