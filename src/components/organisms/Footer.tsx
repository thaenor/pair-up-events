
import React from 'react';
import Logo from '../atoms/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-pairup-darkBlue">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo size="md" />
            <p className="text-sm text-pairup-cream/70 mt-2">You and your friend meet another pair for a shared activity</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">How it Works</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Create an Event</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Join an Event</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">About Us</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Contact</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Privacy Policy</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Terms of Service</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-pairup-darkBlueAlt/30 mt-12 pt-8 text-center text-sm text-pairup-cream/50">
          &copy; {currentYear} Pair Up Events. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
