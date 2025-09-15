import { ArrowRight } from "lucide-react";
import React from 'react';

import Logo from '../atoms/Logo';

interface HeroSectionProps {
  onCreateEvent?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateEvent,
}) => {

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pairup-darkBlue to-pairup-darkBlueAlt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-20">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="animate-fade-in mt-16 sm:mt-64 md:mt-0" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-pairup-cyan font-bold">Grab your friend</span>
              <br />
              <span className="text-pairup-yellow font-normal">and meet another pair.</span>
            </h1>
            <p className="text-lg mb-8 text-pairup-cream/90 max-w-lg">
              Break your routine with social adventures.
              Experience a fresh 4-way dynamic while staying with someone you trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-cyan text-pairup-darkBlue hover:opacity-90 inline-flex w-fit items-center gap-2"
                onClick={onCreateEvent}
              >
                Create an Event
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] -mt-40 sm:mt-32 md:mt-0 animate-fade-in flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
            <Logo size="hero" showText={false} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center">
        <a href="#how-it-works" className="animate-bounce" tabIndex={-1} aria-hidden="true">
          <div className="w-8 h-12 border-2 border-pairup-cream/50 rounded-full flex justify-center">
            <div className="w-2 h-2 bg-pairup-cream/50 rounded-full mt-2"></div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
