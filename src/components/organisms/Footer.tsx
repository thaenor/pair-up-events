
import Logo from '../atoms/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-pairup-darkBlue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo size="md" />
            <p className="text-sm text-pairup-cream/70 mt-2">You and your friend meet another pair for a shared activity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">How it Works</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Create an Event</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Join an Event</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">About Us</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Contact</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-pairup-yellow">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Terms of Service</a></li>
                <li><a href="#" className="text-pairup-cream/70 hover:text-pairup-cream duration-300">Cookie Policy</a></li>
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
