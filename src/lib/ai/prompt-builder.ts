import { EVENT_ORGANIZER_SYSTEM_PROMPT } from '@/lib/system-prompt'
import type { ChatMessageData } from '@/entities/event/event'
import type { UserProfileData } from '@/entities/user'

/**
 * Builds complete AI prompt with system prompt, user context, date context, and conversation history
 *
 * @param userProfile - User profile data (optional)
 * @param messages - Existing chat messages
 * @param userMessageText - Current user message text
 * @returns Complete prompt string for AI model
 */
export function buildAIPrompt(
  userProfile: UserProfileData | null,
  messages: ChatMessageData[],
  userMessageText: string
): string {
  let systemPrompt = EVENT_ORGANIZER_SYSTEM_PROMPT

  // Add user context if available
  if (userProfile?.public) {
    const userInfo = [
      `User Information:`,
      `- Name: ${userProfile.public.firstName}`,
      userProfile.public.age ? `- Age: ${userProfile.public.age}` : '',
      userProfile.private?.hobbies ? `- Hobbies: ${userProfile.private.hobbies}` : '',
      userProfile.private?.preferences?.preferredVibes
        ? `- Preferred vibes: ${userProfile.private.preferences.preferredVibes.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')

    systemPrompt = `${userInfo}\n\n${systemPrompt}`
  }

  // Add current date context
  const today = new Date().toISOString().split('T')[0]
  systemPrompt = `${systemPrompt}\n\nCurrent Date Context: Today is ${today}`

  // Build conversation history for AI context
  // Format: "User: message\nAssistant: response\nUser: next message..."
  let conversationContext = ''
  messages.forEach(msg => {
    const roleLabel = msg.sender === 'user' ? 'User' : 'Assistant'
    conversationContext += `${roleLabel}: ${msg.text}\n`
  })
  // Add current user message
  conversationContext += `User: ${userMessageText}\n`

  // Build full prompt with conversation history
  return `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nAssistant:`
}
