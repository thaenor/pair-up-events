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
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY_MS = 2000

interface QueuedBatch {
  messages: Omit<ChatMessageData, 'messageId'>[]
  eventId: string
  retryCount: number
}

export function useChatMessageBatching({ userId, eventId, onSaveError }: UseChatMessageBatchingOptions) {
  const messageQueueRef = useRef<Omit<ChatMessageData, 'messageId'>[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFlushingRef = useRef(false)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const failedBatchRef = useRef<QueuedBatch | null>(null)
  // Track event ID at queue time to prevent saving to wrong event if ID changes before flush
  const queuedEventIdRef = useRef<string | null>(null)

  const flushQueue = useCallback(async () => {
    // Use the event ID from queue time or current event ID
    const targetEventId = queuedEventIdRef.current || eventId

    if (!targetEventId || (messageQueueRef.current.length === 0 && !failedBatchRef.current) || isFlushingRef.current) {
      return
    }

    isFlushingRef.current = true

    // Prioritize retrying failed batch, otherwise use queued messages
    let messagesToSave: Omit<ChatMessageData, 'messageId'>[]
    let batchEventId: string
    let retryCount: number

    if (failedBatchRef.current) {
      messagesToSave = failedBatchRef.current.messages
      batchEventId = failedBatchRef.current.eventId
      retryCount = failedBatchRef.current.retryCount
      failedBatchRef.current = null
    } else {
      messagesToSave = [...messageQueueRef.current]
      messageQueueRef.current = []
      batchEventId = targetEventId
      retryCount = 0
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    try {
      const result = await saveChatMessagesBatch(userId, batchEventId, messagesToSave)
      if (!result.success) {
        const errorType = 'errorType' in result ? result.errorType : 'network'
        const errorMsg = result.error || 'Failed to save messages'

        // Don't retry permanent errors (permission, not-found)
        const isPermanentError = errorType === 'permission' || errorType === 'not-found'

        if (isPermanentError || retryCount >= MAX_RETRIES) {
          console.error('Failed to save chat messages batch (permanent failure or max retries):', {
            error: errorMsg,
            errorType,
            retryCount,
            messageCount: messagesToSave.length,
          })
          onSaveError?.(errorMsg)
          toast.error('Failed to save messages. Please refresh the page.')
          failedBatchRef.current = null
        } else {
          // Retry with exponential backoff
          const retryDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount)
          failedBatchRef.current = {
            messages: messagesToSave,
            eventId: batchEventId,
            retryCount: retryCount + 1,
          }
          console.warn('Failed to save chat messages batch, will retry:', {
            error: errorMsg,
            errorType,
            retryCount: retryCount + 1,
            retryDelayMs: retryDelay,
          })
          onSaveError?.(errorMsg)
          toast.error('Failed to save some messages. Retrying...')

          retryTimeoutRef.current = setTimeout(() => {
            flushQueue()
          }, retryDelay)
        }
      } else {
        // Reset queued event ID after successful flush
        queuedEventIdRef.current = null
        failedBatchRef.current = null
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'

      // Don't retry if we've exceeded max retries
      if (retryCount >= MAX_RETRIES) {
        console.error('Error saving chat messages batch (max retries exceeded):', {
          error: errorMsg,
          retryCount,
          messageCount: messagesToSave.length,
        })
        onSaveError?.(errorMsg)
        toast.error('Failed to save messages. Please refresh the page.')
        failedBatchRef.current = null
      } else {
        // Retry with exponential backoff
        const retryDelay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount)
        failedBatchRef.current = {
          messages: messagesToSave,
          eventId: batchEventId,
          retryCount: retryCount + 1,
        }
        console.warn('Error saving chat messages batch, will retry:', {
          error: errorMsg,
          retryCount: retryCount + 1,
          retryDelayMs: retryDelay,
        })
        onSaveError?.(errorMsg)
        toast.error('Failed to save some messages. Retrying...')

        retryTimeoutRef.current = setTimeout(() => {
          flushQueue()
        }, retryDelay)
      }
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
      if (!queuedEventIdRef.current) {
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
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      // Attempt to flush remaining messages
      // Use .catch() to handle errors silently during cleanup
      if ((messageQueueRef.current.length > 0 || failedBatchRef.current) && eventId) {
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
