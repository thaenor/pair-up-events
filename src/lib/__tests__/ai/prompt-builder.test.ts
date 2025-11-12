import { describe, it, expect } from 'vitest'
import { buildAIPrompt } from '@/lib/ai/prompt-builder'
import type { ChatMessageData } from '@/entities/event/event'
import type { UserProfileData } from '@/entities/user'

describe('buildAIPrompt', () => {
  const mockMessages: ChatMessageData[] = [
    {
      messageId: '1',
      text: 'Hello',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      messageId: '2',
      text: 'Hi there!',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]

  it('should build prompt with conversation history', () => {
    const prompt = buildAIPrompt(null, mockMessages, 'What activity?')

    expect(prompt).toContain('User: Hello')
    expect(prompt).toContain('Assistant: Hi there!')
    expect(prompt).toContain('User: What activity?')
    expect(prompt).toContain('Assistant:')
  })

  it('should include user profile information when available', () => {
    const userProfile: UserProfileData = {
      public: {
        firstName: 'John',
        age: 30,
        gender: 'male',
      },
      private: {
        email: 'john@example.com',
        firstName: 'John',
        birthDate: new Date('1990-01-01'),
        gender: 'male',
        createdAt: new Date(),
        hobbies: 'Hiking',
        preferences: {
          ageRange: { min: 18, max: 99 },
          preferredGenders: ['male', 'female'],
          preferredVibes: ['adventurous', 'chill'],
        },
      },
    }

    const prompt = buildAIPrompt(userProfile, [], 'Hello')

    expect(prompt).toContain('John')
    expect(prompt).toContain('30')
    expect(prompt).toContain('Hiking')
    expect(prompt).toContain('adventurous, chill')
  })

  it('should include current date context', () => {
    const prompt = buildAIPrompt(null, [], 'Hello')
    const today = new Date().toISOString().split('T')[0]

    expect(prompt).toContain(`Today is ${today}`)
  })

  it('should handle missing user profile gracefully', () => {
    const prompt = buildAIPrompt(null, mockMessages, 'Hello')

    expect(prompt).not.toContain('User Information:')
    expect(prompt).toContain('User: Hello')
  })

  it('should handle partial user profile', () => {
    const userProfile: UserProfileData = {
      public: {
        firstName: 'John',
        age: 30,
        gender: 'male',
      },
      private: null,
    }

    const prompt = buildAIPrompt(userProfile, [], 'Hello')

    expect(prompt).toContain('John')
    expect(prompt).toContain('30')
    expect(prompt).not.toContain('Hobbies:')
  })
})
