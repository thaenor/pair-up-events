/**
 * Extracts text content from Firebase AI SDK response
 *
 * Handles different response formats that may be returned by the Firebase AI SDK:
 * - Function call: result.response.text()
 * - String: result.response.text
 * - Candidates array: result.response.candidates[0]?.content?.parts?.[0]?.text
 *
 * @param result - Firebase AI SDK GenerateContentResult
 * @returns Extracted text content or empty string if not found
 */
export function extractResponseText(result: {
  response?: {
    text?: string | (() => string)
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string
        }>
      }
    }>
  }
}): string {
  if (!result.response) {
    console.warn('AI response missing response object')
    return ''
  }

  // Handle function call: result.response.text()
  if (typeof result.response.text === 'function') {
    try {
      return result.response.text()
    } catch (error) {
      console.error('Error calling response.text():', error)
      return ''
    }
  }

  // Handle string: result.response.text
  if (typeof result.response.text === 'string') {
    return result.response.text
  }

  // Handle candidates array: result.response.candidates[0]?.content?.parts?.[0]?.text
  if (result.response.candidates && result.response.candidates.length > 0) {
    const firstCandidate = result.response.candidates[0]
    const text = firstCandidate?.content?.parts?.[0]?.text
    if (text) {
      return text
    }
  }

  console.warn('Could not extract text from AI response')
  return ''
}
