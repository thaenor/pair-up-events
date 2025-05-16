
import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="py-4 w-full absolute top-0 left-0 z-10">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-pairup-cyan">Pair<span className="text-pairup-yellow">Up</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-pairup-cream hover:text-pairup-yellow transition-colors">How It Works</a>
          <a href="#benefits" className="text-pairup-cream hover:text-pairup-yellow transition-colors">Benefits</a>
          <a href="#early-access" className="text-pairup-cream hover:text-pairup-yellow transition-colors">Early Access</a>
        </div>
        <div>
          <Button className="btn-primary">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
