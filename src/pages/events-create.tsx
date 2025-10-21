import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Navigation from '@/components/organisms/Navigation';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation';
import { TabbedEventCreationForm } from '../components/organisms/TabbedEventCreationForm';
import { useAuth } from '@/hooks/useAuth';
import { useCreateEventFlow } from '@/hooks/useCreateEventFlow';

const EventsCreatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    isCreating,
    onCreateInitial,
    onFinalize,
  } = useCreateEventFlow(user?.uid, navigate, toast);

  if (!user) {
    return (
      <div className="min-h-screen bg-pairup-cream">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pairup-darkBlue mb-4">
              Please log in to create an event
            </h1>
            <p className="text-pairup-darkBlue/70">
              You need to be logged in to create events.
            </p>
          </div>
        </div>
        <MobileBottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">
            Create Event
          </h1>
          <p className="text-pairup-darkBlue/70">
            Share your activity idea and find the perfect duo to join you! You can save as draft and invite participants later.
          </p>
        </div>

        <TabbedEventCreationForm
          isCreating={isCreating}
          onCreateInitial={onCreateInitial}
          onFinalize={onFinalize}
        />
      </div>
      <MobileBottomNavigation />
    </div>
  );
};

export { EventsCreatePage };
