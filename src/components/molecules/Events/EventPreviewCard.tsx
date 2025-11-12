import React from 'react'

/**
 * Data structure for event preview display
 *
 * @typedef {Object} EventPreviewData
 * @property {string} title - Event title
 * @property {string} [description] - Event description
 * @property {string} activity - Activity type
 * @property {string} [date] - Event date
 * @property {string} [time] - Event time
 * @property {Object} [location] - Event location
 * @property {string} [location.address] - Street address
 * @property {string} [location.city] - City name
 * @property {Object} [preferences] - Event preferences
 * @property {string} [preferences.duoType] - Preferred duo type
 * @property {string[]} [preferences.desiredVibes] - Desired vibes
 * @property {Object} [preferences.ageRange] - Age range
 * @property {number} [preferences.ageRange.min] - Minimum age
 * @property {number} [preferences.ageRange.max] - Maximum age
 */
export interface EventPreviewData {
  title: string
  headline?: string
  description?: string
  activity: string
  date?: string
  time?: string
  location?: {
    address?: string
    city?: string
  }
  preferences?: {
    duoType?: string
    desiredVibes?: string[]
    ageRange?: {
      min?: number
      max?: number
    }
  }
}

/**
 * Props for EventPreviewCard component
 *
 * @typedef {Object} EventPreviewCardProps
 * @property {EventPreviewData} eventData - Event data to display
 * @property {Function} [onEdit] - Callback when edit button is clicked
 * @property {Function} [onConfirm] - Callback when confirm button is clicked
 */
interface EventPreviewCardProps {
  eventData: EventPreviewData
  onEdit?: () => void
  onConfirm?: () => void
}

/**
 * Event preview card component
 *
 * Displays a preview of event details before final submission.
 * Shows formatted event information with options to edit or confirm.
 *
 * @component
 * @param {EventPreviewCardProps} props - Component props
 *
 * @example
 * ```tsx
 * <EventPreviewCard
 *   eventData={eventData}
 *   onEdit={() => setStep('form')}
 *   onConfirm={handleSubmit}
 * />
 * ```
 */
const EventPreviewCard: React.FC<EventPreviewCardProps> = ({ eventData, onEdit, onConfirm }) => {
  const formatDateTime = () => {
    const parts: string[] = []
    if (eventData.date) parts.push(eventData.date)
    if (eventData.time) parts.push(`at ${eventData.time}`)
    return parts.join(' ') || 'Date/Time TBD'
  }

  const formatLocation = () => {
    const parts: string[] = []
    if (eventData.location?.address) parts.push(eventData.location.address)
    if (eventData.location?.city) parts.push(eventData.location.city)
    return parts.join(', ') || 'Location TBD'
  }

  return (
    <div className="bg-pairup-cream border-2 border-pairup-darkBlue rounded-lg p-3 md:p-4 my-2 md:my-4 w-full max-w-md">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl md:text-2xl">📅</span>
          <h3 className="text-base md:text-lg font-bold text-pairup-darkBlue">
            {eventData.title || eventData.activity}
          </h3>
        </div>
        {eventData.description && <p className="text-xs md:text-sm text-gray-700 italic">{eventData.description}</p>}
      </div>

      {/* Event Details */}
      <div className="space-y-2 text-xs md:text-sm">
        {/* Activity */}
        <div className="flex items-start gap-2">
          <span className="text-base md:text-lg">🎯</span>
          <div>
            <span className="font-semibold text-pairup-darkBlue">Activity:</span>
            <span className="ml-2 text-gray-800">{eventData.activity}</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-start gap-2">
          <span className="text-base md:text-lg">🕐</span>
          <div>
            <span className="font-semibold text-pairup-darkBlue">When:</span>
            <span className="ml-2 text-gray-800">{formatDateTime()}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2">
          <span className="text-base md:text-lg">📍</span>
          <div>
            <span className="font-semibold text-pairup-darkBlue">Where:</span>
            <span className="ml-2 text-gray-800">{formatLocation()}</span>
          </div>
        </div>

        {/* Preferences */}
        {eventData.preferences && (
          <div className="flex items-start gap-2">
            <span className="text-base md:text-lg">✨</span>
            <div className="flex-1">
              <span className="font-semibold text-pairup-darkBlue">Preferences:</span>
              <div className="ml-2 text-gray-800">
                {eventData.preferences.duoType && <div className="capitalize">{eventData.preferences.duoType}</div>}
                {eventData.preferences.desiredVibes && eventData.preferences.desiredVibes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {eventData.preferences.desiredVibes.map(vibe => (
                      <span
                        key={vibe}
                        className="bg-pairup-darkBlue text-white px-2 py-0.5 rounded-full text-xs capitalize"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}
                {eventData.preferences.ageRange && (
                  <div className="text-xs mt-1">
                    Age range: {eventData.preferences.ageRange.min || '18'}-{eventData.preferences.ageRange.max || '99'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(onEdit || onConfirm) && (
        <div className="flex gap-2 mt-3 md:mt-4 pt-3 border-t border-gray-300">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 md:px-4 py-3 md:py-2 text-xs md:text-sm font-medium text-pairup-darkBlue bg-white border-2 border-pairup-darkBlue rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] touch-manipulation"
              aria-label="Edit event details"
            >
              Edit
            </button>
          )}
          {onConfirm && (
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-2">Send this link to your pair to confirm the event</p>
              <button
                onClick={onConfirm}
                className="w-full px-3 md:px-4 py-3 md:py-2 text-xs md:text-sm font-medium text-white bg-pairup-darkBlue rounded-lg hover:bg-opacity-90 transition-colors min-h-[44px] touch-manipulation"
                aria-label="Copy invite link"
              >
                Copy invite link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EventPreviewCard
