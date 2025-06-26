
import React from 'react';
import { Users, Calendar, MapPin } from "lucide-react";
import Logo from '../atoms/Logo';
import { tokens } from '@/lib/tokens';

const steps = [
  {
    icon: <Calendar className={`${tokens.size.xl} ${tokens.colors.tertiary}`} />,
    title: <span>
             <span className={tokens.colors.primary}>Create</span> or <span className={tokens.colors.secondary}>Join</span>
           </span>,
    description: "Create your own event or browse existing ones in your area"
  },
  {
    icon: <Users className={`${tokens.size.xl} ${tokens.colors.tertiary}`} />,
    title: "Find a Friend",
    description: "Start by selecting one friend to join your pair-up adventure"
  },
  {
    icon: <MapPin className={`${tokens.size.xl} ${tokens.colors.tertiary}`} />,
    title: <div className={`${tokens.layout.flexCenter} ${tokens.gap.sm}`}>
            Meet Up
            <Logo size="sm" showText={false} />
          </div>,
    description: "Connect with another pair at the agreed location and enjoy!"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className={`${tokens.layout.section} ${tokens.bg.darkAlt}`}>
      <div className={tokens.layout.container}>
        <div className={`text-center ${tokens.gap.xxl}`}>
          <h2 className={`${tokens.text.xxxl} font-bold ${tokens.gap.lg}`}>How Pair Up Works</h2>
          <p className={`${tokens.text.lg} text-pairup-cream/80 max-w-2xl mx-auto`}>
            Our platform makes it easy to expand your social circle in a comfortable, low-pressure way
          </p>
        </div>
        
        <div className={tokens.layout.grid3}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${tokens.bg.cardDark} ${tokens.spacing.lg} ${tokens.radius.xxl} ${tokens.effects.cardHover}`}
            >
              <div className={tokens.gap.xl}>
                {step.icon}
              </div>
              <h3 className={`${tokens.text.xl} font-semibold mb-3`}>{step.title}</h3>
              <p className="text-pairup-cream/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
