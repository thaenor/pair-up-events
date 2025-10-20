import React, { useState } from 'react';

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
  
  // Tab 2: Your Duo
  duoName: string;
  duoAge: number;
  duoGender: Gender;
  duoType: DuoType;
  comfortableLanguages: string[];
  duoVibes: Vibe[];
  connectionIntention: string;
  otherIntention: string;
  
  // Tab 3: Their Duo
  preferredDuoType: DuoType | '';
  preferredAgeRange: { min: number; max: number };
  preferredGender: Gender[];
  desiredVibes: Vibe[];
  parentPreference: string;
  additionalNotes: string;
}

export type TabbedEventCreationFormProps = {
  onSubmit: (formData: TabbedEventCreationFormData) => Promise<void>;
  isCreating: boolean;
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

// Language options
const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'italian', label: 'Italian' },
  { value: 'dutch', label: 'Dutch' }
];

// Connection intention options
const CONNECTION_INTENTIONS = [
  { value: 'friends', label: 'Just making new friends' },
  { value: 'experience', label: 'Sharing an experience' },
  { value: 'networking', label: 'Networking' },
  { value: 'romantic', label: 'Open to romantic sparks' },
  { value: 'curious', label: 'Just curious' }
];

// Parent preference options
const PARENT_PREFERENCES = [
  { value: 'yes-with-kids', label: 'Yes, with kids' },
  { value: 'yes-without-kids', label: 'Yes, without kids' },
  { value: 'no', label: 'No' },
  { value: 'other', label: 'Other' }
];

export const TabbedEventCreationForm: React.FC<TabbedEventCreationFormProps> = ({
  onSubmit,
  isCreating,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
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
    
    // Tab 2: Your Duo
    duoName: '',
    duoAge: 25,
    duoGender: 'prefer-not-to-say' as Gender,
    duoType: 'friends' as DuoType,
    comfortableLanguages: [],
    duoVibes: [],
    connectionIntention: '',
    otherIntention: '',
    
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
        const titleError = validateEventTitle(formData.title);
        if (titleError) newErrors.title = titleError;
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Activity description is required';
      } else {
        const descError = validateEventDescription(formData.description);
        if (descError) newErrors.description = descError;
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
    } else if (currentTab === 2) {
      // Validate Tab 2: Your Duo
      if (!formData.duoName.trim()) {
        newErrors.duoName = 'Duo name is required';
      }
      
      if (formData.duoAge < 13 || formData.duoAge > 120) {
        newErrors.duoAge = 'Age must be between 13 and 120';
      }
      
      if (!formData.duoType) {
        newErrors.duoType = 'Pair type is required';
      }
      
      if (formData.comfortableLanguages.length === 0) {
        newErrors.comfortableLanguages = 'At least one language is required';
      }
      
      if (formData.duoVibes.length === 0) {
        newErrors.duoVibes = 'At least one vibe is required';
      }
      
      if (!formData.connectionIntention) {
        newErrors.connectionIntention = 'Connection intention is required';
      }
    } else if (currentTab === 3) {
      // Validate Tab 3: Their Duo
      if (!formData.preferredDuoType) {
        newErrors.preferredDuoType = 'Preferred duo type is required';
      }
      
      const ageError = validateAgeRange(formData.preferredAgeRange);
      if (ageError) {
        newErrors.preferredAgeRange = ageError;
      }
      
      if (formData.desiredVibes.length === 0) {
        newErrors.desiredVibes = 'At least one desired vibe is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      setCurrentTab(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentTab(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentTab()) {
      await onSubmit(formData);
    }
  };

  const handleVibeChange = (vibe: Vibe, checked: boolean, field: 'duoVibes' | 'desiredVibes') => {
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

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      updateFormData('comfortableLanguages', [...formData.comfortableLanguages, language]);
    } else {
      updateFormData('comfortableLanguages', formData.comfortableLanguages.filter(l => l !== language));
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
      <div className="space-y-2">
        <label htmlFor="activity-title" className="text-sm font-medium text-pairup-darkBlue/80">
          What activity do you want to do? *
        </label>
        <input
          id="activity-title"
          type="text"
          value={formData.title}
          onChange={e => updateFormData('title', e.target.value)}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.title 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
          placeholder="e.g., Coffee and conversation, Hiking adventure, Board game night"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Activity Type */}
      <div className="space-y-2">
        <label htmlFor="activity-type" className="text-sm font-medium text-pairup-darkBlue/80">
          Activity type *
        </label>
        <select
          id="activity-type"
          value={formData.activityType}
          onChange={e => updateFormData('activityType', e.target.value)}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.activityType 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
        >
          <option value="">Select activity type</option>
          {ACTIVITY_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.activityType && (
          <p className="text-sm text-red-600">{errors.activityType}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="activity-description" className="text-sm font-medium text-pairup-darkBlue/80">
          Describe your activity *
        </label>
        <textarea
          id="activity-description"
          value={formData.description}
          onChange={e => updateFormData('description', e.target.value)}
          disabled={isDisabled}
          rows={4}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.description 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
          placeholder="Tell us more about what you'd like to do..."
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="time-start" className="text-sm font-medium text-pairup-darkBlue/80">
          When do you want to meet? (optional)
        </label>
        <input
          id="time-start"
          type="datetime-local"
          value={formData.timeStart ? formData.timeStart.toISOString().slice(0, 16) : ''}
          onChange={e => updateFormData('timeStart', e.target.value ? new Date(e.target.value) : null)}
          disabled={isDisabled}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-pairup-darkBlue/80">
            Country *
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={e => updateFormData('country', e.target.value)}
            disabled={isDisabled}
            className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.country 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            placeholder="e.g., Germany, Spain, France"
          />
          {errors.country && (
            <p className="text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-pairup-darkBlue/80">
            City *
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={e => updateFormData('city', e.target.value)}
            disabled={isDisabled}
            className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.city 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            placeholder="e.g., Berlin, Madrid, Paris"
          />
          {errors.city && (
            <p className="text-sm text-red-600">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Cost */}
      <div className="space-y-2">
        <label htmlFor="cost" className="text-sm font-medium text-pairup-darkBlue/80">
          Cost indicator (optional)
        </label>
        <input
          id="cost"
          type="text"
          value={formData.cost}
          onChange={e => updateFormData('cost', e.target.value)}
          disabled={isDisabled}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="e.g., Free, €10-15 per person, Pay your own way"
        />
      </div>
    </div>
  );

  const renderTab2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2">
          Your Duo
        </h3>
        <p className="text-sm text-pairup-darkBlue/70">
          Tell us about your pair
        </p>
      </div>

      {/* Duo Name */}
      <div className="space-y-2">
        <label htmlFor="duo-name" className="text-sm font-medium text-pairup-darkBlue/80">
          What is the first name of your duo? *
        </label>
        <input
          id="duo-name"
          type="text"
          value={formData.duoName}
          onChange={e => updateFormData('duoName', e.target.value)}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.duoName 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
          placeholder="e.g., Alex, Sarah & Mike"
        />
        {errors.duoName && (
          <p className="text-sm text-red-600">{errors.duoName}</p>
        )}
      </div>

      {/* Duo Age */}
      <div className="space-y-2">
        <label htmlFor="duo-age" className="text-sm font-medium text-pairup-darkBlue/80">
          What is the age of your duo? *
        </label>
        <input
          id="duo-age"
          type="number"
          min="13"
          max="120"
          value={formData.duoAge}
          onChange={e => updateFormData('duoAge', parseInt(e.target.value) || 25)}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.duoAge 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
        />
        {errors.duoAge && (
          <p className="text-sm text-red-600">{errors.duoAge}</p>
        )}
      </div>

      {/* Duo Gender */}
      <div className="space-y-2">
        <label htmlFor="duo-gender" className="text-sm font-medium text-pairup-darkBlue/80">
          What is the gender? *
        </label>
        <select
          id="duo-gender"
          value={formData.duoGender}
          onChange={e => updateFormData('duoGender', e.target.value as Gender)}
          disabled={isDisabled}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
        >
          {GENDER_OPTIONS.map(gender => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </select>
      </div>

      {/* Duo Type */}
      <div className="space-y-2">
        <label htmlFor="duo-type" className="text-sm font-medium text-pairup-darkBlue/80">
          What type of pair are you? *
        </label>
        <select
          id="duo-type"
          value={formData.duoType}
          onChange={e => updateFormData('duoType', e.target.value as DuoType)}
          disabled={isDisabled}
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.duoType 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
          }`}
        >
          {DUO_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.duoType && (
          <p className="text-sm text-red-600">{errors.duoType}</p>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          What languages do you both feel comfortable using? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGE_OPTIONS.map(language => (
            <label key={language.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.comfortableLanguages.includes(language.value)}
                onChange={e => handleLanguageChange(language.value, e.target.checked)}
                disabled={isDisabled}
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{language.label}</span>
            </label>
          ))}
        </div>
        {errors.comfortableLanguages && (
          <p className="text-sm text-red-600">{errors.comfortableLanguages}</p>
        )}
      </div>

      {/* Duo Vibe */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          How would you describe your vibe as a duo? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VIBE_OPTIONS.map(vibe => (
            <label key={vibe.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.duoVibes.includes(vibe.value as Vibe)}
                onChange={e => handleVibeChange(vibe.value as Vibe, e.target.checked, 'duoVibes')}
                disabled={isDisabled}
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{vibe.label}</span>
            </label>
          ))}
        </div>
        {errors.duoVibes && (
          <p className="text-sm text-red-600">{errors.duoVibes}</p>
        )}
      </div>

      {/* Connection Intention */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-pairup-darkBlue/80">
          What's your intention for connecting with another pair? *
        </label>
        <div className="space-y-2">
          {CONNECTION_INTENTIONS.map(intention => (
            <label key={intention.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="connectionIntention"
                value={intention.value}
                checked={formData.connectionIntention === intention.value}
                onChange={e => updateFormData('connectionIntention', e.target.value)}
                disabled={isDisabled}
                className="text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              />
              <span className="text-sm text-pairup-darkBlue">{intention.label}</span>
            </label>
          ))}
        </div>
        {formData.connectionIntention === 'other' && (
          <input
            type="text"
            value={formData.otherIntention}
            onChange={e => updateFormData('otherIntention', e.target.value)}
            disabled={isDisabled}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Please specify..."
          />
        )}
        {errors.connectionIntention && (
          <p className="text-sm text-red-600">{errors.connectionIntention}</p>
        )}
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
          className={`w-full rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            errors.preferredDuoType 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
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
            className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.preferredAgeRange 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
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
            className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.preferredAgeRange 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
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
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
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
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
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
                className="text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
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
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
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
      <div className="flex border-b border-gray-200 mb-6">
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
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              currentTab === tab.id
                ? 'border-pairup-cyan text-pairup-cyan'
                : 'border-transparent text-pairup-darkBlue/60 hover:text-pairup-darkBlue hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        {currentTab === 1 && renderTab1()}
        {currentTab === 2 && renderTab2()}
        {currentTab === 3 && renderTab3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentTab === 1 || isDisabled}
            className="px-4 py-2 text-sm font-medium text-pairup-darkBlue border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {currentTab < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isDisabled}
                className="px-4 py-2 text-sm font-medium text-white bg-pairup-cyan rounded-lg hover:bg-pairup-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isDisabled}
                className="px-6 py-2 text-sm font-medium text-white bg-pairup-cyan rounded-lg hover:bg-pairup-cyan/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDisabled ? 'Saving Draft...' : 'Save as Draft'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TabbedEventCreationForm;
