
import React from 'react';
import { Users, Calendar, MapPin, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <Users className="w-12 h-12 text-pairup-cyan" />,
    title: "Find a Friend",
    description: "Start by selecting one friend to join your pair-up adventure"
  },
  {
    icon: <Calendar className="w-12 h-12 text-pairup-cyan" />,
    title: "Create or Join",
    description: "Create your own event or browse existing ones in your area"
  },
  {
    icon: <MapPin className="w-12 h-12 text-pairup-cyan" />,
    title: "Meet Up",
    description: "Connect with another pair at the agreed location and enjoy!"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-pairup-darkBlueAlt">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Pair Up Works</h2>
          <p className="text-lg text-pairup-cream/80 max-w-2xl mx-auto">
            Our platform makes it easy to expand your social circle in a comfortable, low-pressure way
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-pairup-darkBlue/50 p-8 rounded-2xl card-hover"
            >
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-pairup-cream/80">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex justify-end mt-6">
                  <ArrowRight className="w-6 h-6 text-pairup-yellow" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
