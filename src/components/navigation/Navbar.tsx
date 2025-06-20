
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-[#1A2A33] border-b border-[#27E9F3]/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">
            <span className="text-[#27E9F3]">Pair</span>
            <span className="text-[#FECC08]">Up Events</span>
          </h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-[#27E9F3] text-[#1A2A33]'
                  : 'text-[#F5E6C8] hover:text-[#27E9F3]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('create-event')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentView === 'create-event'
                  ? 'bg-[#27E9F3] text-[#1A2A33]'
                  : 'text-[#F5E6C8] hover:text-[#27E9F3]'
              }`}
            >
              Create Event
            </button>
            <button
              onClick={() => onViewChange('browse-events')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentView === 'browse-events'
                  ? 'bg-[#FECC08] text-[#1A2A33]'
                  : 'text-[#F5E6C8] hover:text-[#FECC08]'
              }`}
            >
              Browse Events
            </button>
            <button
              onClick={() => onViewChange('profile')}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentView === 'profile'
                  ? 'bg-[#27E9F3] text-[#1A2A33]'
                  : 'text-[#F5E6C8] hover:text-[#27E9F3]'
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#F5E6C8] text-sm">{user?.email}</span>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#F5E6C8]/20 text-[#F5E6C8] hover:bg-[#F5E6C8]/10"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
