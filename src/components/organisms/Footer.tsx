
import React from 'react';
import Logo from '../atoms/Logo';
import { tokens } from '@/lib/tokens';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-12 ${tokens.bg.dark}`}>
      <div className={tokens.layout.container}>
        <div className={`flex flex-col md:flex-row justify-between items-center`}>
          <div className="mb-6 md:mb-0">
            <Logo size="md" />
            <p className={`${tokens.text.sm} text-pairup-cream/70 mt-2`}>You and your friend meet another pair for a shared activity</p>
          </div>
          
          <div className={`${tokens.layout.grid3} ${tokens.gap.xxl} text-center md:text-left`}>
            <div>
              <h3 className={`${tokens.text.sm} font-semibold mb-3 ${tokens.colors.secondary}`}>Platform</h3>
              <ul className={`space-y-2 ${tokens.text.sm}`}>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>How it Works</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Create an Event</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Join an Event</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`${tokens.text.sm} font-semibold mb-3 ${tokens.colors.secondary}`}>Company</h3>
              <ul className={`space-y-2 ${tokens.text.sm}`}>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>About Us</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Contact</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`${tokens.text.sm} font-semibold mb-3 ${tokens.colors.secondary}`}>Legal</h3>
              <ul className={`space-y-2 ${tokens.text.sm}`}>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Privacy Policy</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Terms of Service</a></li>
                <li><a href="#" className={`text-pairup-cream/70 hover:text-pairup-cream ${tokens.duration.normal}`}>Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={`border-t border-pairup-darkBlueAlt/30 mt-12 pt-8 text-center ${tokens.text.sm} text-pairup-cream/50`}>
          &copy; {currentYear} Pair Up Events. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
