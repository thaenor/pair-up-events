import React, { useState } from 'react'

type ProfileDetails = {
  firstName?: string
  lastName?: string
  email?: string
  birthDate?: string
  gender?: string
  bio?: string
}

export type ProfileDetailsFormProps = {
  profile: ProfileDetails
  onSubmit: (updates: ProfileDetails) => Promise<void>
  isSaving: boolean
}

export const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({ profile, onSubmit, isSaving }) => {
  const [firstName, setFirstName] = useState(profile?.firstName || '')
  const [lastName, setLastName] = useState(profile?.lastName || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [birthDate, setBirthDate] = useState(profile?.birthDate || '')
  const [gender, setGender] = useState(profile?.gender || '')
  const [bio, setBio] = useState(profile?.bio || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      firstName,
      lastName,
      email,
      birthDate,
      gender,
      bio,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Personal Details</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-pairup-darkBlue mb-2">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-pairup-darkBlue mb-2">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-pairup-darkBlue mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          placeholder="Enter your email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-pairup-darkBlue mb-2">
            Birth Date
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-pairup-darkBlue mb-2">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="bio" className="block text-sm font-medium text-pairup-darkBlue mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          rows={3}
          placeholder="Tell us about yourself..."
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-4 py-2 bg-pairup-cyan text-pairup-darkBlue rounded-md hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Details'}
      </button>
    </form>
  )
}

export default ProfileDetailsForm
