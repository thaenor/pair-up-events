
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import EarlyAccess from '@/components/EarlyAccess';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-pairup-darkBlue">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <EarlyAccess />
      <Footer />
    </div>
  );
};

export default Index;
