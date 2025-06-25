
import React from 'react';
import Button from './atoms/Button';
import Logo from './atoms/Logo';

const Navbar = () => {
  console.log('Legacy Navbar rendered - consider using Navigation organism instead');

  return (
    <nav className="py-4 w-full absolute top-0 left-0 z-10">
      <div className="container-custom flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-pairup-cream hover:text-pairup-yellow transition-colors">How It Works</a>
          <a href="#benefits" className="text-pairup-cream hover:text-pairup-yellow transition-colors">Benefits</a>
          <a href="#early-access" className="text-pairup-cream hover:text-pairup-yellow transition-colors">Early Access</a>
        </div>
        <div>
          <Button 
            variant="primary" 
            onClick={() => document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
