import { describe, it, expect } from 'vitest'
import { parseAIResponse } from '@/lib/ai/response-parser'

describe('parseAIResponse', () => {
  it('should parse title and headline from response', () => {
    const response = `
      Hello! Let me help you create an event.
      TITLE_HEADLINE_START
      {
        "title": "Coffee Meetup",
        "headline": "A casual coffee gathering"
      }
      TITLE_HEADLINE_END
      What date would you like?
    `

    const result = parseAIResponse(response)

    expect(result.titleHeadline).toEqual({
      title: 'Coffee Meetup',
      headline: 'A casual coffee gathering',
    })
    expect(result.cleanedText).not.toContain('TITLE_HEADLINE_START')
    expect(result.cleanedText).not.toContain('TITLE_HEADLINE_END')
  })

  it('should parse event data from response', () => {
    const response = `
      Perfect! Here's your event:
      EVENT_DATA_START
      {
        "title": "Coffee Meetup",
        "activity": "Coffee",
        "date": "2025-01-20",
        "time": "14:00",
        "location": {
          "city": "San Francisco"
        }
      }
      EVENT_DATA_END
      Does this look good?
    `

    const result = parseAIResponse(response)

    expect(result.eventData).toEqual({
      title: 'Coffee Meetup',
      activity: 'Coffee',
      date: '2025-01-20',
      time: '14:00',
      location: {
        city: 'San Francisco',
      },
    })
    expect(result.cleanedText).not.toContain('EVENT_DATA_START')
    expect(result.cleanedText).not.toContain('EVENT_DATA_END')
  })

  it('should parse both title/headline and event data', () => {
    const response = `
      TITLE_HEADLINE_START
      {
        "title": "Coffee Meetup",
        "headline": "A casual coffee gathering"
      }
      TITLE_HEADLINE_END
      EVENT_DATA_START
      {
        "title": "Coffee Meetup",
        "activity": "Coffee",
        "date": "2025-01-20"
      }
      EVENT_DATA_END
    `

    const result = parseAIResponse(response)

    expect(result.titleHeadline).toBeDefined()
    expect(result.eventData).toBeDefined()
    expect(result.cleanedText).toBe('')
  })

  it('should return empty cleanedText when no markers found', () => {
    const response = 'Just a regular message without any markers.'

    const result = parseAIResponse(response)

    expect(result.titleHeadline).toBeUndefined()
    expect(result.eventData).toBeUndefined()
    expect(result.cleanedText).toBe(response)
  })

  it('should handle invalid JSON gracefully', () => {
    const response = `
      TITLE_HEADLINE_START
      { invalid json }
      TITLE_HEADLINE_END
    `

    const result = parseAIResponse(response)

    expect(result.titleHeadline).toBeUndefined()
    expect(result.cleanedText).not.toContain('TITLE_HEADLINE_START')
  })

  it('should handle missing required fields', () => {
    const response = `
      TITLE_HEADLINE_START
      {
        "title": "Coffee Meetup"
      }
      TITLE_HEADLINE_END
    `

    const result = parseAIResponse(response)

    expect(result.titleHeadline).toBeUndefined()
  })

  it('should clean text by removing all marker blocks', () => {
    const response = `
      Hello!
      TITLE_HEADLINE_START
      {
        "title": "Test",
        "headline": "Test"
      }
      TITLE_HEADLINE_END
      Middle text
      EVENT_DATA_START
      {
        "title": "Test",
        "activity": "Test"
      }
      EVENT_DATA_END
      Goodbye!
    `

    const result = parseAIResponse(response)

    expect(result.cleanedText).toContain('Hello!')
    expect(result.cleanedText).toContain('Middle text')
    expect(result.cleanedText).toContain('Goodbye!')
    expect(result.cleanedText).not.toContain('TITLE_HEADLINE_START')
    expect(result.cleanedText).not.toContain('EVENT_DATA_START')
  })
})
