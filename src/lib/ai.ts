import { getAI, getGenerativeModel } from 'firebase/ai'
import type { AI, GenerativeModel } from 'firebase/ai'
import { app } from './firebase'

// AI initialization and management
let aiInstance: AI | null = null
let modelInstance: GenerativeModel | null = null

/**
 * Initialize the Gemini Developer API backend service
 *
 * Creates and returns a singleton instance of the Firebase AI service.
 * Returns null if Firebase app is not initialized or if initialization fails.
 *
 * @returns {AI | null} Firebase AI instance or null if initialization fails
 *
 * @example
 * ```ts
 * const ai = initializeGeminiAI();
 * if (ai) {
 *   // AI backend is ready
 * }
 * ```
 */
export const initializeGeminiAI = (): AI | null => {
  if (!app) {
    console.error('Firebase app not initialized. Cannot initialize Gemini AI.')
    return null
  }

  try {
    if (!aiInstance) {
      aiInstance = getAI(app)
    }
    return aiInstance
  } catch (error) {
    console.error('Failed to initialize Gemini AI backend', error)
    return null
  }
}

/**
 * Get or create a GenerativeModel instance with Gemini 2.0 Flash
 *
 * Returns a cached GenerativeModel instance or creates a new one if it doesn't exist.
 * Uses the Gemini 2.0 Flash experimental model for AI-powered event creation assistance.
 *
 * @returns {GenerativeModel | null} Gemini model instance or null if AI backend is unavailable
 *
 * @example
 * ```ts
 * const model = getGeminiModel();
 * if (model) {
 *   const result = await model.generateContent('Create an event description');
 * }
 * ```
 */
export const getGeminiModel = (): GenerativeModel | null => {
  if (modelInstance) {
    return modelInstance
  }

  const ai = aiInstance || initializeGeminiAI()

  if (!ai) {
    console.error('Cannot create Gemini model: AI backend not initialized')
    return null
  }

  try {
    modelInstance = getGenerativeModel(ai, { model: 'gemini-2.0-flash-exp' })
    return modelInstance
  } catch (error) {
    console.error('Failed to create Gemini model', error)
    return null
  }
}

/**
 * Reset the AI instances (useful for testing or reinitialization)
 *
 * Clears the cached AI and model instances, forcing a fresh initialization
 * on the next request. Primarily used in testing scenarios or when
 * reconfiguration is needed.
 *
 * @returns {void}
 *
 * @example
 * ```ts
 * resetAIInstances(); // Clear cache
 * const freshModel = getGeminiModel(); // Create new instance
 * ```
 */
export const resetAIInstances = (): void => {
  aiInstance = null
  modelInstance = null
}

/**
 * Initial greeting message for the AI event organizer
 *
 * First message displayed when a user starts an event creation conversation.
 * Designed to be friendly and immediately direct the conversation toward
 * event creation.
 *
 * @type {string}
 * @constant
 *
 * @example
 * ```tsx
 * <ChatMessage role="assistant">{INITIAL_GREETING}</ChatMessage>
 * ```
 */
export const INITIAL_GREETING = "Hi! I'm here to help you create an event. What activity would you like to organize?"
