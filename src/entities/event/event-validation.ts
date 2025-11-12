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

  // Validate date format if present (DD-MM-YYYY or YYYY-MM-DD)
  if (data.date && !/^(\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2})$/.test(data.date)) {
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
 * Supports both DD-MM-YYYY (from AI) and YYYY-MM-DD (ISO) formats
 *
 * @param date - Date string in DD-MM-YYYY or YYYY-MM-DD format
 * @param time - Time string in HH:MM format (optional)
 * @returns Date object or undefined if parsing fails
 */
export function parseDateTime(date?: string, time?: string): Date | undefined {
  if (!date) return undefined

  try {
    // Check if date is in DD-MM-YYYY format (from AI)
    const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})$/
    const ddmmyyyyMatch = date.match(ddmmyyyyPattern)

    let isoDate: string
    if (ddmmyyyyMatch) {
      // Convert DD-MM-YYYY to YYYY-MM-DD
      const [, day, month, year] = ddmmyyyyMatch
      isoDate = `${year}-${month}-${day}`
    } else {
      // Assume YYYY-MM-DD format (ISO)
      isoDate = date
    }

    const dateStr = time ? `${isoDate}T${time}:00` : `${isoDate}T12:00:00`
    const parsedDate = new Date(dateStr)

    // Validate the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      console.warn(`Failed to parse date/time: date="${date}", time="${time}"`)
      return undefined
    }

    return parsedDate
  } catch (error) {
    console.warn(`Error parsing date/time: date="${date}", time="${time}"`, error)
    return undefined
  }
}

/**
 * Maps EventPreviewData to DraftEventData partial updates
 *
 * Converts AI response format to Firestore draft event format,
 * including date/time parsing and preferences mapping.
 * Handles the new event preferences schema with separate userDuoType
 * and preferredDuoType fields, and optional ageRange from user profile.
 * Ensures all fields are explicitly included and handles edge cases.
 *
 * @param eventData - Event preview data from AI with updated schema
 * @returns Partial DraftEventData object for Firestore update
 *
 * @example
 * ```ts
 * const previewData: EventPreviewData = {
 *   title: "Coffee Meetup",
 *   activity: "Coffee",
 *   preferences: {
 *     userDuoType: "friends",
 *     preferredDuoType: "couples",
 *     desiredVibes: ["chill", "foodies"],
 *     ageRange: { min: 25, max: 35 } // Optional
 *   }
 * }
 * const draft = mapEventPreviewToDraft(previewData)
 * ```
 *
 * @notes
 * - Maps both userDuoType and preferredDuoType from preferences
 * - Only includes ageRange if both min and max are present
 * - Handles missing optional fields gracefully
 *
 * @since 2025-01-XX - Updated for new event preferences schema
 */
export function mapEventPreviewToDraft(eventData: EventPreviewData) {
  // Parse date/time - log if parsing fails
  const timeStart = parseDateTime(eventData.date, eventData.time)
  if (eventData.date && !timeStart) {
    console.warn(
      `Failed to parse date/time for event "${eventData.title}": date="${eventData.date}", time="${eventData.time}"`
    )
  }

  // Handle location - save even if only address or only city is present
  let location: { address?: string; city?: string } | undefined = undefined
  if (eventData.location) {
    // Only create location object if at least one field is present
    if (eventData.location.address || eventData.location.city) {
      location = {}
      if (eventData.location.address) {
        location.address = eventData.location.address
      }
      if (eventData.location.city) {
        location.city = eventData.location.city
      }
    }
  }

  // Handle preferences - map new duo type fields and optional ageRange
  const preferences = eventData.preferences
    ? {
        ...(eventData.preferences.userDuoType && {
          userDuoType: eventData.preferences.userDuoType as
            | 'friends'
            | 'couples'
            | 'family'
            | 'roommates'
            | 'colleagues',
        }),
        ...(eventData.preferences.preferredDuoType && {
          preferredDuoType: eventData.preferences.preferredDuoType as
            | 'friends'
            | 'couples'
            | 'family'
            | 'roommates'
            | 'colleagues',
        }),
        ...(eventData.preferences.desiredVibes && {
          desiredVibes: eventData.preferences.desiredVibes,
        }),
        ...(eventData.preferences.ageRange?.min !== undefined &&
          eventData.preferences.ageRange?.max !== undefined && {
            ageRange: {
              min: eventData.preferences.ageRange.min,
              max: eventData.preferences.ageRange.max,
            },
          }),
      }
    : undefined

  // Build result object - explicitly include all fields that are present
  const result: Partial<{
    title: string
    headline: string
    description: string
    activity: string
    timeStart: Date
    location: { address?: string; city?: string }
    preferences: Partial<{
      userDuoType: 'friends' | 'couples' | 'family' | 'roommates' | 'colleagues'
      preferredDuoType: 'friends' | 'couples' | 'family' | 'roommates' | 'colleagues'
      desiredVibes: string[]
      ageRange: { min: number; max: number }
    }>
  }> = {
    title: eventData.title,
    activity: eventData.activity,
  }

  // Add optional fields only if they are present
  if (eventData.headline !== undefined) {
    result.headline = eventData.headline
  }
  if (eventData.description !== undefined) {
    result.description = eventData.description
  }
  if (timeStart !== undefined) {
    result.timeStart = timeStart
  }
  if (location !== undefined) {
    result.location = location
  }
  if (preferences !== undefined && Object.keys(preferences).length > 0) {
    result.preferences = preferences
  }

  return result
}
