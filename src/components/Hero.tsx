
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-bg">
      <div className="container-custom pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-pairup-yellow">You + Friend</span> 
              <br />
              <span className="text-pairup-cyan">Meet</span> 
              <br />
              <span className="text-pairup-cream">New Friends</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-pairup-cream/90 max-w-lg">
              Break your routine with spontaneous social adventures. 
              Experience a fresh 4-way dynamic while staying with someone you trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary flex items-center gap-2">
                Create an Event
                <ArrowRight size={18} />
              </Button>
              <Button className="btn-secondary flex items-center gap-2">
                Join an Event
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-pairup-cyan/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pairup-yellow/10 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pairup-cyan/20 rounded-2xl transform rotate-12 backdrop-blur-sm"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-pairup-yellow/20 rounded-2xl transform -rotate-12 backdrop-blur-sm"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pairup-cream/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <p className="text-center text-xl font-semibold text-pairup-cream">2 + 2</p>
                </div>
              </div>
            </div>
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
}

export default Hero;
