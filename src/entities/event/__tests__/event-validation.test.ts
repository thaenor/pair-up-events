import { describe, it, expect } from 'vitest'
import { validateEventData, parseDateTime, mapEventPreviewToDraft } from '../event-validation'
import type { EventPreviewData } from '../event'

describe('validateEventData', () => {
  it('should return true for valid event data with all fields', () => {
    const validData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '2024-12-25',
      time: '14:00',
    }
    expect(validateEventData(validData)).toBe(true)
  })

  it('should return true for valid event data with only required fields', () => {
    const minimalData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
    }
    expect(validateEventData(minimalData)).toBe(true)
  })

  it('should return false when title is missing', () => {
    const invalidData: EventPreviewData = {
      activity: 'Hiking',
    } as EventPreviewData
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return false when activity is missing', () => {
    const invalidData: EventPreviewData = {
      title: 'Test Event',
    } as EventPreviewData
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return false when title is empty string', () => {
    const invalidData: EventPreviewData = {
      title: '',
      activity: 'Hiking',
    }
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return false when activity is empty string', () => {
    const invalidData: EventPreviewData = {
      title: 'Test Event',
      activity: '',
    }
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return false for invalid date format', () => {
    const invalidData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '2024/12/25', // Wrong format (should be DD-MM-YYYY or YYYY-MM-DD)
    }
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return false for invalid time format', () => {
    const invalidData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      time: '2:00 PM', // Wrong format
    }
    expect(validateEventData(invalidData)).toBe(false)
  })

  it('should return true for valid date without time', () => {
    const validData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '2024-12-25',
    }
    expect(validateEventData(validData)).toBe(true)
  })

  it('should return true for valid time without date', () => {
    const validData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      time: '14:00',
    }
    expect(validateEventData(validData)).toBe(true)
  })
})

describe('parseDateTime', () => {
  it('should parse date and time correctly', () => {
    const result = parseDateTime('2024-12-25', '14:30')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
    expect(result?.getMonth()).toBe(11) // Month is 0-indexed
    expect(result?.getDate()).toBe(25)
    expect(result?.getHours()).toBe(14)
    expect(result?.getMinutes()).toBe(30)
  })

  it('should parse DD-MM-YYYY date format correctly', () => {
    const result = parseDateTime('25-12-2024', '14:30')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
    expect(result?.getMonth()).toBe(11) // Month is 0-indexed
    expect(result?.getDate()).toBe(25)
    expect(result?.getHours()).toBe(14)
    expect(result?.getMinutes()).toBe(30)
  })

  it('should parse date without time (defaults to 12:00)', () => {
    const result = parseDateTime('2024-12-25')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2024)
    expect(result?.getMonth()).toBe(11)
    expect(result?.getDate()).toBe(25)
    expect(result?.getHours()).toBe(12)
    expect(result?.getMinutes()).toBe(0)
  })

  it('should return undefined when date is not provided', () => {
    const result = parseDateTime()
    expect(result).toBeUndefined()
  })

  it('should return undefined when date is empty string', () => {
    const result = parseDateTime('')
    expect(result).toBeUndefined()
  })

  it('should handle time-only correctly', () => {
    const result = parseDateTime('2024-01-01', '23:59')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getHours()).toBe(23)
    expect(result?.getMinutes()).toBe(59)
  })
})

describe('mapEventPreviewToDraft', () => {
  it('should map complete event preview data to draft format', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      description: 'Test description',
      activity: 'Hiking',
      date: '2024-12-25',
      time: '14:00',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
      },
      preferences: {
        duoType: 'friends',
        desiredVibes: ['adventurous', 'outdoor'],
        ageRange: {
          min: 25,
          max: 35,
        },
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.title).toBe('Test Event')
    expect(result.description).toBe('Test description')
    expect(result.activity).toBe('Hiking')
    expect(result.timeStart).toBeInstanceOf(Date)
    expect(result.location).toEqual({
      address: '123 Main St',
      city: 'San Francisco',
    })
    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.desiredVibes).toEqual(['adventurous', 'outdoor'])
    expect(result.preferences?.ageRange).toEqual({ min: 25, max: 35 })
  })

  it('should map minimal event preview data', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.title).toBe('Test Event')
    expect(result.activity).toBe('Hiking')
    expect(result.timeStart).toBeUndefined()
    expect(result.location).toBeUndefined()
    expect(result.preferences).toBeUndefined()
  })

  it('should exclude ageRange when min is missing', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      preferences: {
        duoType: 'friends',
        ageRange: {
          max: 35,
        },
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.ageRange).toBeUndefined()
  })

  it('should exclude ageRange when max is missing', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      preferences: {
        duoType: 'friends',
        ageRange: {
          min: 25,
        },
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.ageRange).toBeUndefined()
  })

  it('should include ageRange when both min and max are present', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      preferences: {
        duoType: 'couples',
        ageRange: {
          min: 25,
          max: 35,
        },
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.preferences?.ageRange).toEqual({ min: 25, max: 35 })
  })

  it('should handle preferences without ageRange', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      preferences: {
        duoType: 'friends',
        desiredVibes: ['adventurous'],
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.desiredVibes).toEqual(['adventurous'])
    expect(result.preferences?.ageRange).toBeUndefined()
  })

  it('should handle location with only city', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      location: {
        city: 'San Francisco',
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.location).toEqual({ city: 'San Francisco' })
  })

  it('should handle location with only address', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      location: {
        address: '123 Main St',
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.location).toEqual({ address: '123 Main St' })
  })

  it('should handle empty location object', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      location: {},
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.location).toBeUndefined()
  })

  it('should parse date and time correctly', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '2024-12-25',
      time: '14:30',
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.timeStart).toBeInstanceOf(Date)
    expect(result.timeStart?.getFullYear()).toBe(2024)
    expect(result.timeStart?.getMonth()).toBe(11)
    expect(result.timeStart?.getDate()).toBe(25)
    expect(result.timeStart?.getHours()).toBe(14)
    expect(result.timeStart?.getMinutes()).toBe(30)
  })

  it('should handle date without time', () => {
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '2024-12-25',
    }

    const result = mapEventPreviewToDraft(previewData)

    expect(result.timeStart).toBeInstanceOf(Date)
    expect(result.timeStart?.getHours()).toBe(12) // Defaults to 12:00
  })

  it('should handle date/time parsing failures gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const previewData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
      date: '99-99-9999', // Invalid date that will fail parsing
      time: '25:99', // Invalid time
    }

    const result = mapEventPreviewToDraft(previewData)

    // The date might be parsed but will be invalid, so timeStart should be undefined
    // or if it's created, it should be an invalid date
    if (result.timeStart) {
      expect(isNaN(result.timeStart.getTime())).toBe(true)
    } else {
      expect(result.timeStart).toBeUndefined()
    }
    expect(consoleWarnSpy).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should save all fields when widget appears', () => {
    const previewData: EventPreviewData = {
      title: 'Complete Test Event',
      headline: 'Test headline',
      description: 'Test description',
      activity: 'Hiking',
      date: '25-12-2024',
      time: '14:30',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
      },
      preferences: {
        duoType: 'friends',
        desiredVibes: ['adventurous', 'outdoor'],
        ageRange: {
          min: 25,
          max: 35,
        },
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    // Verify all fields are present
    expect(result.title).toBe('Complete Test Event')
    expect(result.headline).toBe('Test headline')
    expect(result.description).toBe('Test description')
    expect(result.activity).toBe('Hiking')
    expect(result.timeStart).toBeInstanceOf(Date)
    expect(result.timeStart?.getFullYear()).toBe(2024)
    expect(result.timeStart?.getMonth()).toBe(11) // December (0-indexed)
    expect(result.timeStart?.getDate()).toBe(25)
    expect(result.timeStart?.getHours()).toBe(14)
    expect(result.timeStart?.getMinutes()).toBe(30)
    expect(result.location).toEqual({
      address: '123 Main St',
      city: 'San Francisco',
    })
    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.desiredVibes).toEqual(['adventurous', 'outdoor'])
    expect(result.preferences?.ageRange).toEqual({ min: 25, max: 35 })
  })

  it('should save partial data correctly', () => {
    const previewData: EventPreviewData = {
      title: 'Partial Event',
      activity: 'Hiking',
      date: '25-12-2024',
      location: {
        city: 'San Francisco',
      },
      preferences: {
        duoType: 'friends',
        desiredVibes: ['adventurous'],
      },
    }

    const result = mapEventPreviewToDraft(previewData)

    // Verify required fields
    expect(result.title).toBe('Partial Event')
    expect(result.activity).toBe('Hiking')
    // Verify optional fields that are present
    expect(result.timeStart).toBeInstanceOf(Date)
    expect(result.location).toEqual({ city: 'San Francisco' })
    expect(result.preferences?.duoType).toBe('friends')
    expect(result.preferences?.desiredVibes).toEqual(['adventurous'])
    // Verify optional fields that are missing
    expect(result.headline).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.preferences?.ageRange).toBeUndefined()
  })
})
