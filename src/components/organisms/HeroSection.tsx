
import React from 'react';
import Button from '../atoms/Button';
import Logo from '../atoms/Logo';
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onCreateEvent?: () => void;
  onBrowseEvents?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  onCreateEvent, 
  onBrowseEvents 
}) => {
  console.log('HeroSection rendered');

  return (
    <section className="relative min-h-screen flex items-center gradient-bg">
      <div className="container-custom pt-20 md:pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in mt-16 sm:mt-64 md:mt-0" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-pairup-cyan font-bold">Grab your friend</span> 
              <br />
              <span className="text-pairup-yellow font-normal">and meet another pair.</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-pairup-cream/90 max-w-lg">
              Break your routine with social adventures. 
              Experience a fresh 4-way dynamic while staying with someone you trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary"
                className="inline-flex w-fit items-center gap-2"
                onClick={onCreateEvent}
              >
                Create an Event
                <ArrowRight size={18} />
              </Button>
              <Button 
                variant="secondary"
                className="inline-flex w-fit items-center gap-2"
                onClick={onBrowseEvents}
              >
                Browse Events
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] -mt-40 sm:mt-32 md:mt-0 animate-fade-in flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
            <Logo size="lg" showText={false} />
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
