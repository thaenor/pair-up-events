import type { EventPreviewData } from './event'

/**
 * Validates event data structure from AI response
 *
 * Checks that required fields (title, activity) are present
 * and validates date/time format if provided.
 *
 * @param data - Event data to validate
 * @returns true if valid, false otherwise
 */
export function validateEventData(data: EventPreviewData): boolean {
  // Required fields
  if (!data.title || !data.activity) {
    return false
  }

  // Validate date format if present (YYYY-MM-DD)
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    return false
  }

  // Validate time format if present (HH:MM)
  if (data.time && !/^\d{2}:\d{2}$/.test(data.time)) {
    return false
  }

  return true
}

/**
 * Parses date and time strings into a Date object
 *
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:MM format (optional)
 * @returns Date object or undefined if parsing fails
 */
export function parseDateTime(date?: string, time?: string): Date | undefined {
  if (!date) return undefined

  try {
    const dateStr = time ? `${date}T${time}:00` : `${date}T12:00:00`
    return new Date(dateStr)
  } catch {
    return undefined
  }
}

/**
 * Maps EventPreviewData to DraftEventData partial updates
 *
 * Converts AI response format to Firestore draft event format,
 * including date/time parsing and preferences mapping.
 *
 * @param eventData - Event preview data from AI
 * @returns Partial DraftEventData object for Firestore update
 */
export function mapEventPreviewToDraft(eventData: EventPreviewData) {
  // Only include ageRange if both min and max are present (required by EventPreferences)
  const preferences = eventData.preferences
    ? {
        duoType: eventData.preferences.duoType as 'friends' | 'couples' | 'family' | 'roommates' | 'colleagues',
        desiredVibes: eventData.preferences.desiredVibes,
        ...(eventData.preferences.ageRange?.min !== undefined && eventData.preferences.ageRange?.max !== undefined
          ? {
              ageRange: {
                min: eventData.preferences.ageRange.min,
                max: eventData.preferences.ageRange.max,
              },
            }
          : {}),
      }
    : undefined

  return {
    title: eventData.title,
    description: eventData.description,
    activity: eventData.activity,
    timeStart: parseDateTime(eventData.date, eventData.time),
    location: eventData.location,
    preferences,
  }
}
