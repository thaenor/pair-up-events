
import React from 'react';
import { Calendar, Users, MapPin, Map } from "lucide-react";
import { tokens } from '@/lib/tokens';

const benefits = [
  {
    icon: <Users className={`${tokens.size.xl} ${tokens.colors.secondary}`} />,
    title: "Experience a Fresh 4-Way Dynamic",
    description: "Meet two new people together with your friend, creating balanced and comfortable social energy"
  },
  {
    icon: <Calendar className={`${tokens.size.xl} ${tokens.colors.secondary}`} />,
    title: "Break Your Routine",
    description: "Step out of your comfort zone with spontaneous social adventures and new experiences"
  },
  {
    icon: <MapPin className={`${tokens.size.xl} ${tokens.colors.secondary}`} />,
    title: "Feel Safe and Open",
    description: "Explore new energies and connections while staying with someone you trust"
  },
  {
    icon: <Map className={`${tokens.size.xl} ${tokens.colors.secondary}`} />,
    title: "Grow Your Social Circle",
    description: "Expand your network through curated, shared experiences in your city"
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className={`${tokens.layout.section} ${tokens.bg.gradient}`}>
      <div className={tokens.layout.container}>
        <div className="text-center mb-16">
          <h2 className={`${tokens.text.xxxl} font-bold mb-4`}>Why Pair Up?</h2>
          <p className={`${tokens.text.lg} text-pairup-cream/80 max-w-2xl mx-auto`}>
            We're reimagining how people meet and connect, making it more comfortable and meaningful
          </p>
        </div>
        
        <div className={tokens.layout.grid2}>
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`${tokens.bg.cardLight} ${tokens.spacing.lg} ${tokens.radius.xxl} backdrop-blur-sm ${tokens.effects.cardHover}`}
            >
              <div className="mb-6">{benefit.icon}</div>
              <h3 className={`${tokens.text.xl} font-semibold mb-3`}>{benefit.title}</h3>
              <p className="text-pairup-cream/80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
