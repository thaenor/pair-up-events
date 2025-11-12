import type { EventPreviewData } from '@/entities/event/event'

/**
 * Parsed AI response containing all extracted structured data
 */
export interface ParsedAIResponse {
  titleHeadline?: { title: string; headline: string }
  eventData?: EventPreviewData
  cleanedText: string
}

/**
 * Unified parser for AI response text
 *
 * Extracts all structured data markers (TITLE_HEADLINE_START/END, EVENT_DATA_START/END)
 * and returns a structured object with all parsed data and cleaned text.
 *
 * @param text - AI response text to parse
 * @returns ParsedAIResponse with extracted data and cleaned text
 */
export function parseAIResponse(text: string): ParsedAIResponse {
  let cleanedText = text
  let titleHeadline: { title: string; headline: string } | undefined
  let eventData: EventPreviewData | undefined

  // Extract title and headline
  const titleHeadlineResult = extractTitleHeadline(text)
  if (titleHeadlineResult) {
    titleHeadline = titleHeadlineResult
  }
  // Always remove marker block, even if parsing failed
  cleanedText = removeMarkerBlock(cleanedText, 'TITLE_HEADLINE_START', 'TITLE_HEADLINE_END')

  // Extract event data
  const eventDataResult = extractEventData(cleanedText)
  if (eventDataResult) {
    eventData = eventDataResult
  }
  // Always remove marker block, even if parsing failed
  cleanedText = removeMarkerBlock(cleanedText, 'EVENT_DATA_START', 'EVENT_DATA_END')

  return {
    titleHeadline,
    eventData,
    cleanedText: cleanedText.trim(),
  }
}

/**
 * Extracts title and headline from AI response text
 */
function extractTitleHeadline(text: string): { title: string; headline: string } | null {
  try {
    const startMarker = 'TITLE_HEADLINE_START'
    const endMarker = 'TITLE_HEADLINE_END'
    const startIdx = text.indexOf(startMarker)
    const endIdx = text.indexOf(endMarker)

    if (startIdx === -1 || endIdx === -1) return null

    const jsonStr = text.substring(startIdx + startMarker.length, endIdx).trim()
    const parsed = JSON.parse(jsonStr)

    if (!parsed.title || !parsed.headline) {
      return null
    }

    return { title: parsed.title, headline: parsed.headline }
  } catch (error) {
    console.error('Failed to parse title/headline:', error)
    return null
  }
}

/**
 * Extracts event data from AI response text
 */
function extractEventData(text: string): EventPreviewData | null {
  try {
    const startMarker = 'EVENT_DATA_START'
    const endMarker = 'EVENT_DATA_END'
    const startIdx = text.indexOf(startMarker)
    const endIdx = text.indexOf(endMarker)

    if (startIdx === -1 || endIdx === -1) return null

    const jsonStr = text.substring(startIdx + startMarker.length, endIdx).trim()
    const parsed = JSON.parse(jsonStr)

    if (!parsed.title || !parsed.activity) {
      return null
    }

    return parsed as EventPreviewData
  } catch (error) {
    console.error('Failed to parse event data:', error)
    return null
  }
}

/**
 * Removes a marker block from text
 */
function removeMarkerBlock(text: string, startMarker: string, endMarker: string): string {
  const startIdx = text.indexOf(startMarker)
  const endIdx = text.indexOf(endMarker)

  if (startIdx === -1 || endIdx === -1) return text

  return text.substring(0, startIdx) + text.substring(endIdx + endMarker.length)
}
