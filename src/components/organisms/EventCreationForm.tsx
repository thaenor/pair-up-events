import React, { FormEventHandler, useState } from 'react';

import type { DuoType, Gender, Vibe } from '@/types';
import { 
  validateEventTitle, 
  validateEventDescription, 
  validateDuoType, 
  validateVibes, 
  validateAgeRange 
} from '@/types';

export interface EventCreationFormData {
  title: string;
  description: string;
  activityType: string;
  country: string;
  city: string;
  timeStart: Date | null;
  availabilityNotes: string;
  ageRange: { min: number; max: number };
  duoType: DuoType;
  genderMix: Gender[];
  vibes: Vibe[];
  otherNotes: string;
  parentPreference: string;
}

export type EventCreationFormProps = {
  onSubmit: (formData: EventCreationFormData) => Promise<void>;
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

export const EventCreationForm: React.FC<EventCreationFormProps> = ({
  onSubmit,
  isCreating,
}) => {
  const isDisabled = isCreating;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [availabilityNotes, setAvailabilityNotes] = useState('');
  
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 });
  const [duoType, setDuoType] = useState<DuoType | ''>('');
  const [genderMix, setGenderMix] = useState<Gender[]>([]);
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [otherNotes, setOtherNotes] = useState('');
  const [parentPreference, setParentPreference] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate activity section
    if (!title.trim()) {
      newErrors.title = 'Activity title is required';
    } else {
      const titleResult = validateEventTitle(title.trim());
      if (!titleResult.isValid) {
        newErrors.title = titleResult.errors[0];
      }
    }

    if (!description.trim()) {
      newErrors.description = 'Activity description is required';
    } else {
      const descriptionResult = validateEventDescription(description.trim());
      if (!descriptionResult.isValid) {
        newErrors.description = descriptionResult.errors[0];
      }
    }

    if (!activityType) {
      newErrors.activityType = 'Activity type is required';
    }

    if (!country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    // Validate preferences section
    if (!duoType) {
      newErrors.duoType = 'Preferred pair type is required';
    } else {
      const duoTypeResult = validateDuoType(duoType);
      if (!duoTypeResult.isValid) {
        newErrors.duoType = duoTypeResult.errors[0];
      }
    }

    const ageRangeResult = validateAgeRange(ageRange);
    if (!ageRangeResult.isValid) {
      newErrors.ageRange = ageRangeResult.errors[0];
    }

    if (vibes.length === 0) {
      newErrors.vibes = 'Please select at least one vibe';
    } else {
      const vibesResult = validateVibes(vibes);
      if (!vibesResult.isValid) {
        newErrors.vibes = vibesResult.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim(),
      activityType,
      country: country.trim(),
      city: city.trim(),
      timeStart: timeStart ? new Date(timeStart) : null,
      availabilityNotes: availabilityNotes.trim(),
      ageRange,
      duoType,
      genderMix,
      vibes,
      otherNotes: otherNotes.trim(),
      parentPreference
    };

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleVibeChange = (vibe: Vibe, checked: boolean) => {
    if (checked) {
      setVibes(prev => [...prev, vibe]);
    } else {
      setVibes(prev => prev.filter(v => v !== vibe));
    }
  };

  const handleGenderChange = (gender: Gender, checked: boolean) => {
    if (checked) {
      setGenderMix(prev => [...prev, gender]);
    } else {
      setGenderMix(prev => prev.filter(g => g !== gender));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="event-creation-form"
    >
      {/* Section 1: About Your Activity */}
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-pairup-darkBlue flex items-center">
            🎉 About Your Activity
          </h3>
          <p className="text-sm text-pairup-darkBlue/70">
            What would you like to do with another pair? Share your idea or plan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label htmlFor="activity-title" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
            What activity do you want to do? *
            <input
              id="activity-title"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isDisabled}
              className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.title 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              placeholder="e.g., Coffee and conversation, Hiking adventure, Board game night"
              data-testid="activity-title"
              aria-label="Activity title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            )}
          </label>

          <label htmlFor="activity-type" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            Activity type *
            <select
              id="activity-type"
              value={activityType}
              onChange={event => setActivityType(event.target.value)}
              disabled={isDisabled}
              className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.activityType 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              data-testid="activity-type"
              aria-label="Activity type"
              aria-invalid={!!errors.activityType}
              aria-describedby={errors.activityType ? 'activity-type-error' : undefined}
            >
              <option value="">Select activity type</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.activityType && (
              <p id="activity-type-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.activityType}
              </p>
            )}
          </label>

          <label htmlFor="activity-description" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            Describe your activity *
            <textarea
              id="activity-description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              disabled={isDisabled}
              className={`mt-2 h-24 resize-none rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              placeholder="Tell us more about what you'd like to do..."
              data-testid="activity-description"
              aria-label="Activity description"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.description}
              </p>
            )}
          </label>

          <label htmlFor="country" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            Country *
            <input
              id="country"
              type="text"
              value={country}
              onChange={event => setCountry(event.target.value)}
              disabled={isDisabled}
              className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.country 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              placeholder="e.g., Germany, Spain, France"
              data-testid="country"
              aria-label="Country"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? 'country-error' : undefined}
            />
            {errors.country && (
              <p id="country-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.country}
              </p>
            )}
          </label>

          <label htmlFor="city" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            City *
            <input
              id="city"
              type="text"
              value={city}
              onChange={event => setCity(event.target.value)}
              disabled={isDisabled}
              className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.city 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              placeholder="e.g., Berlin, Madrid, Paris"
              data-testid="city"
              aria-label="City"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && (
              <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.city}
              </p>
            )}
          </label>

          <label htmlFor="time-start" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            When do you want to meet? (optional)
            <input
              id="time-start"
              type="datetime-local"
              value={timeStart}
              onChange={event => setTimeStart(event.target.value)}
              disabled={isDisabled}
              className="mt-2 rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="time-start"
              aria-label="Event date and time"
            />
          </label>

          <label htmlFor="availability-notes" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
            What days or times usually work best for your duo? (optional)
            <textarea
              id="availability-notes"
              value={availabilityNotes}
              onChange={event => setAvailabilityNotes(event.target.value)}
              disabled={isDisabled}
              className="mt-2 h-20 resize-none rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="e.g., Weekends, evenings after 7pm, flexible schedule..."
              data-testid="availability-notes"
            />
          </label>
        </div>
      </div>

      {/* Section 2: About the Other Duo */}
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-pairup-darkBlue flex items-center">
            🔎 About the Other Duo
          </h3>
          <p className="text-sm text-pairup-darkBlue/70">
            What kind of pair are you hoping to meet? Let us know your preferences.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label htmlFor="duo-type" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            What type of pair are you hoping to meet? *
            <select
              id="duo-type"
              value={duoType}
              onChange={event => setDuoType(event.target.value as DuoType | '')}
              disabled={isDisabled}
              className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                errors.duoType 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
              }`}
              data-testid="duo-type"
              aria-label="Preferred pair type"
              aria-invalid={!!errors.duoType}
              aria-describedby={errors.duoType ? 'duo-type-error' : undefined}
            >
              <option value="">Select pair type</option>
              {DUO_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.duoType && (
              <p id="duo-type-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.duoType}
              </p>
            )}
          </label>

          <div className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            <label htmlFor="age-range-min" className="mb-2">
              Preferred age range *
            </label>
            <div className="flex gap-2">
              <input
                id="age-range-min"
                type="number"
                min="18"
                max="100"
                value={ageRange.min}
                onChange={event => setAgeRange(prev => ({ ...prev, min: parseInt(event.target.value) || 18 }))}
                disabled={isDisabled}
                className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.ageRange 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
                }`}
                placeholder="Min"
                data-testid="age-range-min"
                aria-label="Minimum age"
              />
              <span className="flex items-center text-pairup-darkBlue/60">to</span>
              <input
                id="age-range-max"
                type="number"
                min="18"
                max="100"
                value={ageRange.max}
                onChange={event => setAgeRange(prev => ({ ...prev, max: parseInt(event.target.value) || 65 }))}
                disabled={isDisabled}
                className={`flex-1 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.ageRange 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
                }`}
                placeholder="Max"
                data-testid="age-range-max"
                aria-label="Maximum age"
              />
            </div>
            {errors.ageRange && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.ageRange}
              </p>
            )}
          </div>

          <div className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
            <span className="mb-2">Is there a gender mix you'd feel most comfortable meeting with?</span>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map(gender => (
                <label key={gender.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={genderMix.includes(gender.value as Gender)}
                    onChange={event => handleGenderChange(gender.value as Gender, event.target.checked)}
                    disabled={isDisabled}
                    className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
                    data-testid={`gender-${gender.value}`}
                  />
                  <span className="text-sm text-pairup-darkBlue">{gender.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-pairup-darkBlue/60">
              Leave all unchecked for "No preference"
            </p>
          </div>

          <div className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
            <span className="mb-2">What vibe do you imagine would match best with yours? *</span>
            <div className="grid grid-cols-2 gap-2">
              {VIBE_OPTIONS.map(vibe => (
                <label key={vibe.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={vibes.includes(vibe.value as Vibe)}
                    onChange={event => handleVibeChange(vibe.value as Vibe, event.target.checked)}
                    disabled={isDisabled}
                    className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
                    data-testid={`vibe-${vibe.value}`}
                  />
                  <span className="text-sm text-pairup-darkBlue">{vibe.label}</span>
                </label>
              ))}
            </div>
            {errors.vibes && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.vibes}
              </p>
            )}
          </div>

          <div className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            <span className="mb-2">Are you parents? If yes, are you also interested in meeting other parents?</span>
            <div className="space-y-2">
              {PARENT_PREFERENCES.map(pref => (
                <label key={pref.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="parentPreference"
                    value={pref.value}
                    checked={parentPreference === pref.value}
                    onChange={event => setParentPreference(event.target.value)}
                    disabled={isDisabled}
                    className="text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
                    data-testid={`parent-${pref.value}`}
                  />
                  <span className="text-sm text-pairup-darkBlue">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label htmlFor="other-notes" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
            Is there anything else that matters to you about the other duo? (optional)
            <textarea
              id="other-notes"
              value={otherNotes}
              onChange={event => setOtherNotes(event.target.value)}
              disabled={isDisabled}
              className="mt-2 h-20 resize-none rounded-lg border border-gray-200 px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Any additional preferences or notes..."
              data-testid="other-notes"
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center rounded-lg border border-pairup-cyan bg-pairup-cyan px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="event-creation-submit"
        >
          {isCreating ? 'Saving Draft...' : 'Save as Draft'}
        </button>
      </div>
    </form>
  );
};

export default EventCreationForm;
