
import React from 'react';
import Button from '../atoms/Button';
import Logo from '../atoms/Logo';
import { ArrowRight } from "lucide-react";
import { tokens } from '@/lib/tokens';

interface HeroSectionProps {
  onCreateEvent?: () => void;
  onBrowseEvents?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateEvent,
  onBrowseEvents
}) => {

  return (
    <section className={`relative min-h-screen ${tokens.layout.flexCenter} ${tokens.bg.gradient}`}>
      <div className={`${tokens.layout.container} pt-20 md:pt-20`}>
        <div className={`${tokens.layout.grid2} ${tokens.gap.xl} items-center`}>
          <div className={`${tokens.effects.fadeIn} mt-16 sm:mt-64 md:mt-0`} style={{ animationDelay: '0.2s' }}>
            <h1 className={`${tokens.text.hero} font-bold leading-tight mb-6`}>
              <span className={`${tokens.colors.primary} font-bold`}>Grab your friend</span>
              <br />
              <span className={`${tokens.colors.secondary} font-normal`}>and meet another pair.</span>
            </h1>
            <p className={`${tokens.text.lg} mb-8 text-pairup-cream/90 max-w-lg`}>
              Break your routine with social adventures.
              Experience a fresh 4-way dynamic while staying with someone you trust.
            </p>
            <div className={`flex flex-col sm:flex-row ${tokens.gap.lg}`}>
              <Button
                variant="primary"
                className={`inline-flex w-fit items-center ${tokens.gap.sm}`}
                onClick={onCreateEvent}
              >
                Create an Event
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                className={`inline-flex w-fit items-center ${tokens.gap.sm}`}
                onClick={onBrowseEvents}
              >
                Browse Events
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className={`relative h-[400px] md:h-[500px] -mt-40 sm:mt-32 md:mt-0 ${tokens.effects.fadeIn} ${tokens.layout.flexCenter}`} style={{ animationDelay: '0.5s' }}>
            <Logo size="hero" showText={false} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center">
        <a href="#how-it-works" className="animate-bounce">
          <div className="w-8 h-12 border-2 border-pairup-cream/50 rounded-full flex justify-center">
            <div className="w-2 h-2 bg-pairup-cream/50 rounded-full mt-2"></div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
