
import React from 'react';
import HeroSection from './organisms/HeroSection';

const Hero = () => {
  console.log('Legacy Hero rendered - consider using HeroSection organism instead');

  const handleCreateEvent = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBrowseEvents = () => {
    document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HeroSection 
      onCreateEvent={handleCreateEvent}
      onBrowseEvents={handleBrowseEvents}
    />
  );
};

export default Hero;
