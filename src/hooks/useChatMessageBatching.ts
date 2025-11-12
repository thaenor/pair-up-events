import { useRef, useCallback, useEffect } from 'react'
import { saveChatMessagesBatch } from '@/entities/event/event-service'
import type { ChatMessageData } from '@/entities/event/event'
import { toast } from 'sonner'

interface UseChatMessageBatchingOptions {
  userId: string
  eventId: string | null
  onSaveError?: (error: string) => void
}

const BATCH_DELAY_MS = 2000
const BATCH_SIZE_THRESHOLD = 5

export function useChatMessageBatching({ userId, eventId, onSaveError }: UseChatMessageBatchingOptions) {
  const messageQueueRef = useRef<Omit<ChatMessageData, 'messageId'>[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFlushingRef = useRef(false)
  // Track event ID at queue time to prevent saving to wrong event if ID changes before flush
  const queuedEventIdRef = useRef<string | null>(null)

  const flushQueue = useCallback(async () => {
    // Use the event ID from queue time or current event ID
    const targetEventId = queuedEventIdRef.current || eventId

    if (!targetEventId || messageQueueRef.current.length === 0 || isFlushingRef.current) {
      return
    }

    isFlushingRef.current = true
    const messagesToSave = [...messageQueueRef.current]
    messageQueueRef.current = []

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    try {
      const result = await saveChatMessagesBatch(userId, targetEventId, messagesToSave)
      if (!result.success) {
        // Re-queue messages on failure
        messageQueueRef.current = [...messagesToSave, ...messageQueueRef.current]
        const errorMsg = result.error || 'Failed to save messages'
        console.error('Failed to save chat messages batch:', errorMsg)
        onSaveError?.(errorMsg)
        toast.error('Failed to save some messages. They will be retried.')
      } else {
        // Reset queued event ID after successful flush
        queuedEventIdRef.current = null
      }
    } catch (error) {
      // Re-queue messages on error
      messageQueueRef.current = [...messagesToSave, ...messageQueueRef.current]
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error saving chat messages batch:', errorMsg)
      onSaveError?.(errorMsg)
      toast.error('Failed to save some messages. They will be retried.')
    } finally {
      isFlushingRef.current = false
    }
  }, [userId, eventId, onSaveError])

  const queueMessage = useCallback(
    (message: Omit<ChatMessageData, 'messageId'>) => {
      if (!eventId) {
        console.warn('Cannot queue message: eventId is null')
        return
      }

      // Track event ID at queue time (first message sets it)
      if (!queuedEventIdRef.current && eventId) {
        queuedEventIdRef.current = eventId
      }

      messageQueueRef.current.push(message)

      // Immediate flush if threshold reached
      if (messageQueueRef.current.length >= BATCH_SIZE_THRESHOLD) {
        flushQueue()
        return
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        flushQueue()
      }, BATCH_DELAY_MS)
    },
    [eventId, flushQueue]
  )

  // Flush old messages when event ID changes (prevents cross-contamination)
  useEffect(() => {
    if (queuedEventIdRef.current && queuedEventIdRef.current !== eventId) {
      flushQueue()
    }
  }, [eventId, flushQueue])

  // Flush queue on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Attempt to flush remaining messages
      // Use .catch() to handle errors silently during cleanup
      if (messageQueueRef.current.length > 0 && eventId) {
        flushQueue().catch(error => {
          console.error('Error flushing messages during cleanup:', error)
        })
      }
    }
  }, [eventId, flushQueue])

  return {
    queueMessage,
    flushQueue,
  }
}
