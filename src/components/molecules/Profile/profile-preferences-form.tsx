import React, { useState } from 'react'

export type ProfilePreferencesFormProps = {
  profile: unknown
  onSubmit: (updates: unknown) => Promise<void>
  isSaving: boolean
}

export const ProfilePreferencesForm: React.FC<ProfilePreferencesFormProps> = ({ profile, isSaving }) => {
  const [funFact, setFunFact] = useState(profile?.funFact || '')
  const [hobbies, setHobbies] = useState(profile?.hobbies || [])
  const [preferredVibes, setPreferredVibes] = useState(profile?.preferredVibes || [])
  const [ageRangePreference, setAgeRangePreference] = useState({
    min: profile?.ageRangePreference?.min || 18,
    max: profile?.ageRangePreference?.max || 65,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission removed
  }

  const hobbyOptions = [
    'Sports',
    'Music',
    'Art',
    'Reading',
    'Cooking',
    'Travel',
    'Gaming',
    'Photography',
    'Dancing',
    'Hiking',
  ]

  const vibeOptions = [
    'Adventurous',
    'Chill',
    'Funny',
    'Curious',
    'Outgoing',
    'Creative',
    'Foodies',
    'Active',
    'Culture',
    'Mindful',
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Preferences</h3>

      {/* Fun Fact */}
      <div className="mb-6">
        <label htmlFor="funFact" className="block text-sm font-medium text-pairup-darkBlue mb-2">
          Fun Fact About You
        </label>
        <textarea
          id="funFact"
          value={funFact}
          onChange={e => setFunFact(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          rows={3}
          placeholder="Share something interesting about yourself..."
        />
      </div>

      {/* Hobbies */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-pairup-darkBlue mb-2">Hobbies & Interests</label>
        <div className="grid grid-cols-2 gap-2">
          {hobbyOptions.map(hobby => (
            <label key={hobby} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hobbies.includes(hobby)}
                onChange={e => {
                  if (e.target.checked) {
                    setHobbies([...hobbies, hobby])
                  } else {
                    setHobbies(hobbies.filter(h => h !== hobby))
                  }
                }}
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan"
              />
              <span className="text-sm text-pairup-darkBlue">{hobby}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Vibes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-pairup-darkBlue mb-2">Preferred Vibes</label>
        <div className="grid grid-cols-2 gap-2">
          {vibeOptions.map(vibe => (
            <label key={vibe} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferredVibes.includes(vibe)}
                onChange={e => {
                  if (e.target.checked) {
                    setPreferredVibes([...preferredVibes, vibe])
                  } else {
                    setPreferredVibes(preferredVibes.filter(v => v !== vibe))
                  }
                }}
                className="rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan"
              />
              <span className="text-sm text-pairup-darkBlue">{vibe}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range Preference */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-pairup-darkBlue mb-2">Preferred Age Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="18"
            max="100"
            value={ageRangePreference.min}
            onChange={e => setAgeRangePreference(prev => ({ ...prev, min: parseInt(e.target.value) || 18 }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
            placeholder="Min"
          />
          <span className="flex items-center text-pairup-darkBlue/60">to</span>
          <input
            type="number"
            min="18"
            max="100"
            value={ageRangePreference.max}
            onChange={e => setAgeRangePreference(prev => ({ ...prev, max: parseInt(e.target.value) || 65 }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
            placeholder="Max"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-4 py-2 bg-pairup-cyan text-pairup-darkBlue rounded-md hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  )
}

export default ProfilePreferencesForm
