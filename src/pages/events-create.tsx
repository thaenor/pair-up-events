import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Navigation from '@/components/organisms/Navigation';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation';
import EventCreationForm, { type EventCreationFormData } from '../components/organisms/EventCreationForm';
import { useAuth } from '@/hooks/useAuth';
import { createEvent } from '@/lib/firebase/events';
import { trackFormEvent } from '@/lib/analytics';
import type { Event, EventStatus, EventVisibility } from '@/types';
import { nowTimestamp } from '@/types';

const EventsCreatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (formData: EventCreationFormData) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }

    setIsCreating(true);
    trackFormEvent('event_creation', 'start');

    try {
      // Generate tags from activity type and title
      const generateTags = (activityType: string, title: string): string[] => {
        const tags = [activityType.toLowerCase()];
        const words = title.toLowerCase().split(/\s+/)
          .filter(w => w.length > 3)
          .slice(0, 3);
        return [...tags, ...words].slice(0, 5);
      };

      const eventData: Omit<Event, 'createdAt' | 'updatedAt' | 'lastActivityAt'> = {
        title: formData.title,
        description: formData.description + (formData.otherNotes ? `\n\nAdditional notes: ${formData.otherNotes}` : ''),
        creatorId: user.uid,
        status: 'draft' as EventStatus,
        visibility: 'public' as EventVisibility,
        timeStart: formData.timeStart || nowTimestamp(),
        location: {
          country: formData.country,
          city: formData.city,
          address: '',
          geoPoint: { latitude: 0, longitude: 0 },
          geohash: ''
        },
        tags: generateTags(formData.activityType, formData.title),
        capacity: 4,
        pairs: {
          pair1: { userA: '', userB: '' },
          pair2: { userC: '', userD: '' }
        },
        preferences: {
          duoType: formData.duoType,
          preferredAgeRange: formData.ageRange,
          preferredGender: formData.genderMix,
          desiredVibes: formData.vibes,
          relationshipType: '',
          comfortableLanguages: [],
          duoVibe: [],
          connectionIntention: 'friends',
          parentPreference: formData.parentPreference,
          availabilityNotes: formData.availabilityNotes
        },
        counts: { confirmed: 0, applicants: 0, messages: 0 },
        chatCreated: false,
        chatArchived: false
      };

      await createEvent(eventData);
      
      trackFormEvent('event_creation', 'submit');
      toast.success('Event saved as draft! You can invite participants later.');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      trackFormEvent('event_creation', 'error');
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

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

        <EventCreationForm onSubmit={handleSubmit} isCreating={isCreating} />
      </div>
      <MobileBottomNavigation />
    </div>
  );
};

export default EventsCreatePage;
