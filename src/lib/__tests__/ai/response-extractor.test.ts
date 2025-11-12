import { describe, it, expect, vi } from 'vitest'
import { extractResponseText } from '@/lib/ai/response-extractor'

describe('extractResponseText', () => {
  it('should extract text from function call format', () => {
    const mockText = 'Hello, this is a response'
    const result = {
      response: {
        text: vi.fn(() => mockText),
      },
    }

    const extracted = extractResponseText(result)

    expect(extracted).toBe(mockText)
    expect(result.response.text).toHaveBeenCalled()
  })

  it('should extract text from string format', () => {
    const mockText = 'Hello, this is a response'
    const result = {
      response: {
        text: mockText,
      },
    }

    const extracted = extractResponseText(result)

    expect(extracted).toBe(mockText)
  })

  it('should extract text from candidates array format', () => {
    const mockText = 'Hello, this is a response'
    const result = {
      response: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: mockText,
                },
              ],
            },
          },
        ],
      },
    }

    const extracted = extractResponseText(result)

    expect(extracted).toBe(mockText)
  })

  it('should return empty string when response is missing', () => {
    const result = {}

    const extracted = extractResponseText(result)

    expect(extracted).toBe('')
  })

  it('should return empty string when no text found', () => {
    const result = {
      response: {
        candidates: [],
      },
    }

    const extracted = extractResponseText(result)

    expect(extracted).toBe('')
  })

  it('should handle function call errors gracefully', () => {
    const result = {
      response: {
        text: vi.fn(() => {
          throw new Error('Function error')
        }),
      },
    }

    const extracted = extractResponseText(result)

    expect(extracted).toBe('')
  })

  it('should prefer function call over string format', () => {
    const functionText = 'Function text'
    const result = {
      response: {
        text: vi.fn(() => functionText) as unknown as string,
      },
    }
    // TypeScript workaround - in reality text would be either function or string
    ;(result.response as any).text = vi.fn(() => functionText)

    const extracted = extractResponseText(result)

    expect(extracted).toBe(functionText)
  })
})
