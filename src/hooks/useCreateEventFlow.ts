import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';

import { createEvent, updateEvent } from '@/lib/firebase/events';
import { trackFormEvent } from '@/lib/analytics';
import type { Event, EventStatus, EventVisibility, DuoType } from '@/types';
import { nowTimestamp } from '@/types';
import {
  UNPUBLISHED_STATUS,
} from '@/types/services';
import type { TabbedEventCreationFormData } from '@/components/organisms/TabbedEventCreationForm';

export const useCreateEventFlow = (
  userId: string | undefined,
  navigate: ReturnType<typeof useNavigate>,
  toast: typeof sonnerToast,
) => {
  const [isCreating, setIsCreating] = useState(false);

  const generateTags = (activityType: string, title: string): string[] => {
    const tags = [activityType.toLowerCase()];
    const words = title.toLowerCase().split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 3);
    return [...tags, ...words].slice(0, 5);
  };

  const onCreateInitial = async (formData: Pick<TabbedEventCreationFormData, 'title' | 'description' | 'activityType' | 'country' | 'city' | 'timeStart' | 'cost'>): Promise<string> => {
    if (!userId) {
      toast.error('You must be logged in to create an event');
      return '';
    }

    setIsCreating(true);
    trackFormEvent('event_creation_step1', 'start');

    try {
      const eventData: Omit<Event, 'createdAt' | 'updatedAt' | 'lastActivityAt'> = {
        title: formData.title,
        description: formData.description,
        creatorId: userId,
        status: UNPUBLISHED_STATUS,
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
          pair1: { userA: userId, userB: '' }, // Creator is User A
          pair2: { userC: '', userD: '' }
        },
        preferences: {
          duoType: 'friends' as DuoType, // Default, will be updated in step 2
          preferredAgeRange: { min: 18, max: 65 }, // Default, will be updated in step 3
          preferredGender: [], // Default, will be updated in step 3
          desiredVibes: [], // Default, will be updated in step 3
          relationshipType: '',
          comfortableLanguages: [], // Default, will be updated in step 2
          duoVibe: [], // Default, will be updated in step 2
          connectionIntention: 'friends', // Default, will be updated in step 2
          parentPreference: '', // Default, will be updated in step 3
          availabilityNotes: ''
        },
        counts: { confirmed: 0, applicants: 0, messages: 0 },
        coverThumbUrl: '', // Placeholder
        chatCreated: false,
        chatArchived: false
      };

      const eventId = await createEvent(eventData);
      trackFormEvent('event_creation_step1', 'submit');
      toast.success('Event details saved! Now tell us about your duo.');
      return eventId;
    } catch (error) {
      console.error('Error creating initial event:', error);
      trackFormEvent('event_creation_step1', 'error');
      toast.error('Failed to save event details. Please try again.');
      return '';
    } finally {
      setIsCreating(false);
    }
  };


  const onFinalize = async (eventId: string, formData: TabbedEventCreationFormData): Promise<void> => {
    if (!userId) {
      toast.error('You must be logged in to create an event');
      return;
    }

    setIsCreating(true);
    trackFormEvent('event_creation_finalize', 'start');

    try {
      const updates: Partial<Event> = {
        preferences: {
          preferredDuoType: formData.preferredDuoType,
          preferredAgeRange: formData.preferredAgeRange,
          preferredGender: formData.preferredGender,
          desiredVibes: formData.desiredVibes,
          parentPreference: formData.parentPreference,
          availabilityNotes: formData.additionalNotes,
          // Preserve other preferences from previous updates
          duoType: 'friends' as DuoType, // Placeholder, should be from step 2
          comfortableLanguages: [], // Placeholder, should be from step 2
          duoVibe: [], // Placeholder, should be from step 2
          connectionIntention: 'friends', // Placeholder, should be from step 2
          relationshipType: '',
        },
        description: formData.additionalNotes ? `${formData.description}\n\nAdditional notes: ${formData.additionalNotes}` : formData.description,
        status: 'draft' as EventStatus, // Final status after all tabs are filled
      };
      await updateEvent(eventId, updates);
      trackFormEvent('event_creation_finalize', 'submit');
      toast.success('Event saved as draft! You can invite participants later.');
      navigate('/events');
    } catch (error) {
      console.error('Error finalizing event:', error);
      trackFormEvent('event_creation_finalize', 'error');
      toast.error('Failed to finalize event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    onCreateInitial,
    onFinalize,
  };
};

export type UseCreateEventFlow = ReturnType<typeof useCreateEventFlow>;

