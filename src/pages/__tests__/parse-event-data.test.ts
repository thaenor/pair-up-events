import { describe, it, expect } from 'vitest'
import type { EventPreviewData } from '@/entities/event/event'

/**
 * Parses event data from AI response text (same as in events-create.tsx)
 * This is a copy of the function for testing purposes
 */
function parseEventDataFromResponse(text: string): EventPreviewData | null {
  try {
    const startMarker = 'EVENT_DATA_START'
    const endMarker = 'EVENT_DATA_END'
    const startIdx = text.indexOf(startMarker)
    const endIdx = text.indexOf(endMarker)

    if (startIdx === -1 || endIdx === -1) return null

    const jsonStr = text.substring(startIdx + startMarker.length, endIdx).trim()
    const parsed = JSON.parse(jsonStr)

    // Validate structure matches EventPreviewData
    if (!parsed.title || !parsed.activity) {
      return null
    }

    return parsed as EventPreviewData
  } catch (error) {
    console.error('Failed to parse event data:', error)
    return null
  }
}

describe('parseEventDataFromResponse', () => {
  it('should parse valid event data from response', () => {
    const response = `
      Here's your event!
      EVENT_DATA_START
      {
        "title": "Test Event",
        "activity": "Hiking",
        "description": "A fun hiking event",
        "date": "2024-12-25",
        "time": "14:00"
      }
      EVENT_DATA_END
      Hope you enjoy it!
    `

    const result = parseEventDataFromResponse(response)

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Test Event')
    expect(result?.activity).toBe('Hiking')
    expect(result?.description).toBe('A fun hiking event')
    expect(result?.date).toBe('2024-12-25')
    expect(result?.time).toBe('14:00')
  })

  it('should return null when markers are missing', () => {
    const response = 'Here is your event data: {"title": "Test", "activity": "Hiking"}'

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should return null when only start marker is present', () => {
    const response = 'EVENT_DATA_START {"title": "Test", "activity": "Hiking"}'

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should return null when only end marker is present', () => {
    const response = '{"title": "Test", "activity": "Hiking"} EVENT_DATA_END'

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should parse event data with all optional fields', () => {
    const response = `
      EVENT_DATA_START
      {
        "title": "Complete Event",
        "activity": "Running",
        "description": "A complete event description",
        "date": "2024-12-25",
        "time": "14:00",
        "location": {
          "address": "123 Main St",
          "city": "San Francisco"
        },
        "preferences": {
          "userDuoType": "friends",
          "preferredDuoType": "couples",
          "desiredVibes": ["adventurous", "outdoor"],
          "ageRange": {
            "min": 25,
            "max": 35
          }
        }
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Complete Event')
    expect(result?.activity).toBe('Running')
    expect(result?.description).toBe('A complete event description')
    expect(result?.location?.address).toBe('123 Main St')
    expect(result?.location?.city).toBe('San Francisco')
    expect(result?.preferences?.userDuoType).toBe('friends')
    expect(result?.preferences?.preferredDuoType).toBe('couples')
    expect(result?.preferences?.desiredVibes).toEqual(['adventurous', 'outdoor'])
    expect(result?.preferences?.ageRange?.min).toBe(25)
    expect(result?.preferences?.ageRange?.max).toBe(35)
  })

  it('should return null when title is missing', () => {
    const response = `
      EVENT_DATA_START
      {
        "activity": "Hiking"
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should return null when activity is missing', () => {
    const response = `
      EVENT_DATA_START
      {
        "title": "Test Event"
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should handle invalid JSON', () => {
    const response = `
      EVENT_DATA_START
      { invalid json }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should handle malformed JSON', () => {
    const response = `
      EVENT_DATA_START
      {
        "title": "Test",
        "activity": "Hiking",
        invalid
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull()
  })

  it('should extract JSON even with extra text before and after', () => {
    const response = `
      Some text before
      EVENT_DATA_START
      {
        "title": "Test Event",
        "activity": "Hiking"
      }
      EVENT_DATA_END
      Some text after
    `

    const result = parseEventDataFromResponse(response)

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Test Event')
    expect(result?.activity).toBe('Hiking')
  })

  it('should handle whitespace around markers', () => {
    const response = `
      EVENT_DATA_START
      {
        "title": "Test Event",
        "activity": "Hiking"
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Test Event')
  })

  it('should handle empty JSON object', () => {
    const response = `
      EVENT_DATA_START
      {}
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).toBeNull() // Missing required fields
  })

  it('should handle event data with only required fields', () => {
    const response = `
      EVENT_DATA_START
      {
        "title": "Minimal Event",
        "activity": "Running"
      }
      EVENT_DATA_END
    `

    const result = parseEventDataFromResponse(response)

    expect(result).not.toBeNull()
    expect(result?.title).toBe('Minimal Event')
    expect(result?.activity).toBe('Running')
    expect(result?.description).toBeUndefined()
    expect(result?.date).toBeUndefined()
    expect(result?.time).toBeUndefined()
  })
})
