import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button, FormField, Input, Select, Textarea } from '@/components';
import { InviteShareRow } from '@/components/molecules/invite-share-row';

import type { DuoType, Gender, Vibe } from '@/types';
import { 
  validateEventTitle, 
  validateEventDescription, 
  validateAgeRange 
} from '@/types';

export interface TabbedEventCreationFormData {
  // Tab 1: Event Details
  title: string;
  description: string;
  activityType: string;
  country: string;
  city: string;
  timeStart: Date | null;
  cost: string;
  
  // Tab 2: Your Duo - removed all fields, only invite functionality
  // Tab 3: Their Duo
  preferredDuoType: DuoType | '';
  preferredAgeRange: { min: number; max: number };
  preferredGender: Gender[];
  desiredVibes: Vibe[];
  parentPreference: string;
  additionalNotes: string;
}

export type TabbedEventCreationFormProps = {
  isCreating: boolean;
  onCreateInitial: (formData: Pick<TabbedEventCreationFormData, 'title' | 'description' | 'activityType' | 'country' | 'city' | 'timeStart' | 'cost'>) => Promise<string>;
  onFinalize: (eventId: string, formData: TabbedEventCreationFormData) => Promise<void>;
};

// Activity type options
const ACTIVITY_TYPES = [
  { value: 'food', label: '🍽️ Food & Dining' },
  { value: 'games', label: '🎮 Games' },
  { value: 'culture', label: '🎭 Culture & Arts' },
  { value: 'outdoors', label: '🌲 Outdoors & Nature' },
  { value: 'sports', label: '🏋️‍♂️ Sports & Fitness' },
  { value: 'casual', label: '☕ Casual Meetup' }
];

// Duo type options
const DUO_TYPES = [
  { value: 'friends', label: 'Friends' },
  { value: 'couples', label: 'Partners' },
  { value: 'family', label: 'Parents' },
  { value: 'roommates', label: 'Siblings' },
  { value: 'colleagues', label: 'Other' }
];

// Gender options
const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Diverse' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

// Vibe options with display labels
const VIBE_OPTIONS = [
  { value: 'adventurous', label: 'Adventurous' },
  { value: 'chill', label: 'Chill & Relaxed' },
  { value: 'funny', label: 'Funny & Playful' },
  { value: 'curious', label: 'Curious & Open-Minded' },
  { value: 'outgoing', label: 'Outgoing & Social' },
  { value: 'creative', label: 'Creative' },
  { value: 'foodies', label: 'Foodies' },
  { value: 'active', label: 'Active & Sporty' },
  { value: 'culture', label: 'Culture Lovers' },
  { value: 'family-friendly', label: 'Family-Friendly' },
  { value: 'organizers', label: 'Organizers' },
  { value: 'nightlife', label: 'Nightlife Lovers' },
  { value: 'mindful', label: 'Mindful & Calm' }
];

// Parent preference options
const PARENT_PREFERENCES = [
  { value: 'yes-with-kids', label: 'Yes, with kids' },
  { value: 'yes-without-kids', label: 'Yes, without kids' },
  { value: 'no', label: 'No' },
  { value: 'other', label: 'Other' }
];

export const TabbedEventCreationForm: React.FC<TabbedEventCreationFormProps> = ({
  isCreating,
  onCreateInitial,
  onFinalize,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [eventId, setEventId] = useState<string | null>(null);
  const isDisabled = isCreating;
  
  // Form state
  const [formData, setFormData] = useState<TabbedEventCreationFormData>({
    // Tab 1: Event Details
    title: '',
    description: '',
    activityType: '',
    country: '',
    city: '',
    timeStart: null,
    cost: '',
    
    // Tab 3: Their Duo
    preferredDuoType: '' as DuoType | '',
    preferredAgeRange: { min: 18, max: 65 },
    preferredGender: [],
    desiredVibes: [],
    parentPreference: '',
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = <K extends keyof TabbedEventCreationFormData>(field: K, value: TabbedEventCreationFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const validateCurrentTab = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentTab === 1) {
      // Validate Tab 1: Event Details
      if (!formData.title.trim()) {
        newErrors.title = 'Activity title is required';
      } else {
        const titleResult = validateEventTitle(formData.title);
        if (!titleResult.isValid && titleResult.errors.length > 0) {
          newErrors.title = titleResult.errors[0];
        }
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Activity description is required';
      } else {
        const descResult = validateEventDescription(formData.description);
        if (!descResult.isValid && descResult.errors.length > 0) {
          newErrors.description = descResult.errors[0];
        }
      }
      
      if (!formData.activityType) {
        newErrors.activityType = 'Activity type is required';
      }
      
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
      
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    } else if (currentTab === 3) {
      // Validate Tab 3: Their Duo
      if (!formData.preferredDuoType) {
        newErrors.preferredDuoType = 'Preferred duo type is required';
      }
      
      const ageResult = validateAgeRange(formData.preferredAgeRange);
      if (!ageResult.isValid && ageResult.errors.length > 0) {
        newErrors.preferredAgeRange = ageResult.errors[0];
      }
      
      if (formData.desiredVibes.length === 0) {
        newErrors.desiredVibes = 'At least one desired vibe is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentTab()) return;
    if (currentTab === 1) {
      // Create initial event draft/pending
      const id = await onCreateInitial({
        title: formData.title,
        description: formData.description,
        activityType: formData.activityType,
        country: formData.country,
        city: formData.city,
        timeStart: formData.timeStart,
        cost: formData.cost,
      });
      setEventId(id);
      setCurrentTab(2);
      return;
    }
    setCurrentTab(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentTab(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentTab()) return;
    if (!eventId) return;
    await onFinalize(eventId, formData);
  };

  const handleVibeChange = (vibe: Vibe, checked: boolean, field: 'desiredVibes') => {
    if (checked) {
      updateFormData(field, [...formData[field], vibe]);
    } else {
      updateFormData(field, formData[field].filter(v => v !== vibe));
    }
  };

  const handleGenderChange = (gender: Gender, checked: boolean) => {
    if (checked) {
      updateFormData('preferredGender', [...formData.preferredGender, gender]);
    } else {
      updateFormData('preferredGender', formData.preferredGender.filter(g => g !== gender));
    }
  };

  const renderTab1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2">
          Event Details
        </h3>
        <p className="text-sm text-pairup-darkBlue/70">
          Tell us about the activity you want to do with another pair
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          Upload image (optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-400 mb-2">📷</div>
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
        </div>
      </div>

       {/* Activity Title */}
       <FormField
         label="What activity do you want to do?"
         id="activity-title"
         error={errors.title}
         helpText="Tell us about the activity you want to do with another pair"
         required
         theme="light"
       >
         <Input
           id="activity-title"
           type="text"
           value={formData.title}
           onChange={e => updateFormData('title', e.target.value)}
           disabled={isDisabled}
           placeholder="e.g., Coffee and conversation, Hiking adventure, Board game night"
           variant={errors.title ? "error" : "default"}
           theme="light"
         />
       </FormField>

       {/* Activity Type */}
       <FormField
         label="Activity type"
         id="activity-type"
         error={errors.activityType}
         helpText="What kind of activity is this?"
         required
         theme="light"
       >
         <Select
           id="activity-type"
           value={formData.activityType}
           onChange={e => updateFormData('activityType', e.target.value)}
           disabled={isDisabled}
           variant={errors.activityType ? "error" : "default"}
           theme="light"
         >
           <option value="">Select activity type</option>
           {ACTIVITY_TYPES.map(type => (
             <option key={type.value} value={type.value}>
               {type.label}
             </option>
           ))}
         </Select>
       </FormField>

       {/* Description */}
       <FormField
         label="Describe your activity"
         id="activity-description"
         error={errors.description}
         helpText="Tell us more about what you'd like to do"
         required
         theme="light"
       >
         <Textarea
           id="activity-description"
           value={formData.description}
           onChange={e => updateFormData('description', e.target.value)}
           disabled={isDisabled}
           rows={4}
           placeholder="Tell us more about what you'd like to do..."
           variant={errors.description ? "error" : "default"}
           theme="light"
         />
       </FormField>

       {/* Date */}
       <FormField
         label="When do you want to meet?"
         id="time-start"
         helpText="Optional - you can set this later"
         theme="light"
       >
         <Input
           id="time-start"
           type="datetime-local"
           value={formData.timeStart ? formData.timeStart.toISOString().slice(0, 16) : ''}
           onChange={e => updateFormData('timeStart', e.target.value ? new Date(e.target.value) : null)}
           disabled={isDisabled}
           theme="light"
         />
       </FormField>

       {/* Location */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <FormField
           label="Country"
           id="country"
           error={errors.country}
           helpText="Which country?"
           required
           theme="light"
         >
           <Input
             id="country"
             type="text"
             value={formData.country}
             onChange={e => updateFormData('country', e.target.value)}
             disabled={isDisabled}
             placeholder="e.g., Germany, Spain, France"
             variant={errors.country ? "error" : "default"}
             theme="light"
           />
         </FormField>

         <FormField
           label="City"
           id="city"
           error={errors.city}
           helpText="Which city?"
           required
           theme="light"
         >
           <Input
             id="city"
             type="text"
             value={formData.city}
             onChange={e => updateFormData('city', e.target.value)}
             disabled={isDisabled}
             placeholder="e.g., Berlin, Madrid, Paris"
             variant={errors.city ? "error" : "default"}
             theme="light"
           />
         </FormField>
       </div>

       {/* Cost */}
       <FormField
         label="Cost indicator"
         id="cost"
         helpText="Optional - rough estimate of cost per person"
         theme="light"
       >
         <Input
           id="cost"
           type="text"
           value={formData.cost}
           onChange={e => updateFormData('cost', e.target.value)}
           disabled={isDisabled}
           placeholder="e.g., Free, €10-15 per person, Pay your own way"
           theme="light"
         />
       </FormField>
    </div>
  );

  const renderTab2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2">
          Your Duo
        </h3>
        <p className="text-sm text-pairup-darkBlue/70">
          Invite your partner to join this event
        </p>
      </div>

      {/* Invite Your Duo */}
      <InviteShareRow
        eventId={eventId}
        isDisabled={isDisabled}
        inviteMessage="Join my event on PairUp!"
      />

      {/* Explanation text */}
      <div className="bg-pairup-cyan/10 border border-pairup-cyan/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-pairup-cyan/20 rounded-full flex items-center justify-center">
              <span className="text-pairup-cyan text-sm">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-pairup-darkBlue mb-1">
              How to invite your duo
            </h4>
            <p className="text-sm text-pairup-darkBlue/70 leading-relaxed">
              Use the share button above to send an invite link to your partner. They can click the link to join this event and confirm your duo. Once they join, you'll both be able to see potential matches and start connecting with other pairs!
            </p>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className="text-center">
        <p className="text-xs text-pairup-darkBlue/60">
          Don't worry if your partner isn't ready yet - you can always come back and invite them later from your event dashboard.
        </p>
      </div>
    </div>
  );

  const renderTab3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2">
          Their Duo
        </h3>
        <p className="text-sm text-pairup-darkBlue/70">
          What kind of pair are you hoping to meet?
        </p>
      </div>

      {/* Preferred Duo Type */}
      <div className="space-y-2">
        <label htmlFor="preferred-duo-type" className="text-sm font-medium text-pairup-darkBlue/80">
          Duo type *
        </label>
        <select
          id="preferred-duo-type"
          value={formData.preferredDuoType}
          onChange={e => updateFormData('preferredDuoType', e.target.value as DuoType | '')}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.preferredDuoType 
              ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500' 
              : 'border-gray-200 focus-visible:border-pairup-cyan focus-visible:ring-pairup-cyan'
          }`}
        >
          <option value="">Select preferred duo type</option>
          {DUO_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.preferredDuoType && (
          <p className="text-sm text-red-600">{errors.preferredDuoType}</p>
        )}
      </div>

      {/* Preferred Age Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          Preferred age range *
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="18"
            max="100"
            value={formData.preferredAgeRange.min}
            onChange={e => updateFormData('preferredAgeRange', { 
              ...formData.preferredAgeRange, 
              min: parseInt(e.target.value) || 18 
            })}
            disabled={isDisabled}
            className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.preferredAgeRange 
                ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500' 
                : 'border-gray-200 focus-visible:border-pairup-cyan focus-visible:ring-pairup-cyan'
            }`}
            placeholder="Min"
          />
          <span className="flex items-center text-pairup-darkBlue/60">to</span>
          <input
            type="number"
            min="18"
            max="100"
            value={formData.preferredAgeRange.max}
            onChange={e => updateFormData('preferredAgeRange', { 
              ...formData.preferredAgeRange, 
              max: parseInt(e.target.value) || 65 
            })}
            disabled={isDisabled}
            className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.preferredAgeRange 
                ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500' 
                : 'border-gray-200 focus-visible:border-pairup-cyan focus-visible:ring-pairup-cyan'
            }`}
            placeholder="Max"
          />
        </div>
        {errors.preferredAgeRange && (
          <p className="text-sm text-red-600">{errors.preferredAgeRange}</p>
        )}
      </div>

      {/* Preferred Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          Is there a gender mix you'd feel most comfortable meeting with?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_OPTIONS.map(gender => (
            <label key={gender.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredGender.includes(gender.value as Gender)}
                onChange={e => handleGenderChange(gender.value as Gender, e.target.checked)}
                disabled={isDisabled}
                className="rounded border-gray-300 text-pairup-cyan focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{gender.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-pairup-darkBlue/60">
          Leave all unchecked for "No preference"
        </p>
      </div>

      {/* Desired Vibes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          Desired vibe(s): *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VIBE_OPTIONS.map(vibe => (
            <label key={vibe.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.desiredVibes.includes(vibe.value as Vibe)}
                onChange={e => handleVibeChange(vibe.value as Vibe, e.target.checked, 'desiredVibes')}
                disabled={isDisabled}
                className="rounded border-gray-300 text-pairup-cyan focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{vibe.label}</span>
            </label>
          ))}
        </div>
        {errors.desiredVibes && (
          <p className="text-sm text-red-600">{errors.desiredVibes}</p>
        )}
      </div>

      {/* Parent Preference */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          Are you parents? If yes, are you also interested in meeting other parents?
        </label>
        <div className="space-y-2">
          {PARENT_PREFERENCES.map(pref => (
            <label key={pref.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="parentPreference"
                value={pref.value}
                checked={formData.parentPreference === pref.value}
                onChange={e => updateFormData('parentPreference', e.target.value)}
                disabled={isDisabled}
                className="text-pairup-cyan focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label htmlFor="additional-notes" className="text-sm font-medium text-pairup-darkBlue/80">
          Anything you'd like the other duo to know in advance? (optional)
        </label>
        <textarea
          id="additional-notes"
          value={formData.additionalNotes}
          onChange={e => updateFormData('additionalNotes', e.target.value)}
          disabled={isDisabled}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="e.g., How's your availability or would you like to bring a child or a pet"
        />
        <p className="text-xs text-pairup-darkBlue/60">
          This information is public
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      {/* Tab Navigation */}
      <div
        className="flex border-b border-gray-200 mb-6"
        role="tablist"
        aria-label="Create event steps"
        onKeyDown={event => {
          const key = event.key;
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
          event.preventDefault();
          const ids = [1,2,3];
          const currentIndex = ids.indexOf(currentTab);
          if (key === 'ArrowRight') setCurrentTab(ids[Math.min(currentIndex + 1, ids.length - 1)]);
          if (key === 'ArrowLeft') setCurrentTab(ids[Math.max(currentIndex - 1, 0)]);
          if (key === 'Home') setCurrentTab(1);
          if (key === 'End') setCurrentTab(3);
        }}
      >
        {[
          { id: 1, label: 'Event Details', icon: '🎉' },
          { id: 2, label: 'Your Duo', icon: '👥' },
          { id: 3, label: 'Their Duo', icon: '🔎' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCurrentTab(tab.id)}
            disabled={isDisabled}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={currentTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={twMerge(clsx(
              'flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60',
              currentTab === tab.id
                ? 'border-pairup-cyan text-pairup-cyan'
                : 'border-transparent text-pairup-darkBlue/60 hover:text-pairup-darkBlue hover:border-gray-300'
            ))}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        <div
          id="tabpanel-1"
          role="tabpanel"
          aria-labelledby="tab-1"
          aria-live="polite"
          hidden={currentTab !== 1}
        >
          <h3 className="sr-only">Event Details</h3>
          {currentTab === 1 && renderTab1()}
        </div>
        <div
          id="tabpanel-2"
          role="tabpanel"
          aria-labelledby="tab-2"
          aria-live="polite"
          hidden={currentTab !== 2}
        >
          <h3 className="sr-only">Your Duo</h3>
          {currentTab === 2 && renderTab2()}
        </div>
        <div
          id="tabpanel-3"
          role="tabpanel"
          aria-labelledby="tab-3"
          aria-live="polite"
          hidden={currentTab !== 3}
        >
          <h3 className="sr-only">Their Duo</h3>
          {currentTab === 3 && renderTab3()}
        </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePrevious}
              disabled={currentTab === 1 || isDisabled}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentTab < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={isDisabled}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isDisabled}
                  loadingText="Saving Draft..."
                  disabled={isDisabled}
                >
                  Save as Draft
                </Button>
              )}
            </div>
          </div>
      </form>
    </div>
  );
};

export default TabbedEventCreationForm;
