import React from 'react';
import { Construction, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/organisms/Navigation';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-4 flex items-center justify-center">
            <Construction className="h-8 w-8 mr-3 text-pairup-cyan" />
            My Events
          </h1>
          
          {/* Create Event Button */}
          <button
            onClick={handleCreateEvent}
            className="inline-flex items-center rounded-lg border border-pairup-cyan bg-pairup-cyan px-6 py-3 text-base font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan shadow-sm"
            data-testid="create-event-button"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>

        {/* Under Construction Message */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-8 mb-8 text-center">
          <div className="mb-6">
            <Construction className="h-16 w-16 mx-auto text-pairup-cyan mb-4" />
            <h2 className="text-2xl font-semibold text-pairup-darkBlue mb-4">
              🚧 Under Construction! 🚧
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-pairup-darkBlue/80 mb-6 text-lg">
              We're working hard to bring you an amazing events management experience. 
              This page will allow you to manage your created and joined events.
            </p>
            
            <div className="bg-pairup-yellow/10 border border-pairup-yellow/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3">
                Coming Soon Features:
              </h3>
              <ul className="text-left text-pairup-darkBlue/80 space-y-2">
                <li>• View all your created events</li>
                <li>• Manage event details and settings</li>
                <li>• Track event participants</li>
                <li>• View your joined events</li>
                <li>• Event analytics and insights</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-pairup-darkBlue/60 text-sm">
                Stay tuned for updates! In the meantime, you can create your first event.
              </p>
              
              {/* Secondary Create Event Button */}
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center rounded-lg border border-pairup-cyan bg-white px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/20 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                data-testid="create-event-button-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  );
};

export default EventsPage;
