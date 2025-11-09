import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateDoc, getDocs } from 'firebase/firestore'
import type { DraftEventData } from '../event'

// Mock Firebase Firestore functions
vi.mock('firebase/firestore', () => {
  const MockTimestamp = {
    fromDate: (date: Date) => ({ toDate: () => date }),
  }

  return {
    doc: vi.fn(),
    updateDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(),
    Timestamp: MockTimestamp,
  }
})

// Mock Firebase db - use a factory function that returns a mutable object
vi.mock('@/lib/firebase', () => ({
  db: {},
}))

import { updateDraftEvent, loadAllEvents } from '../event-service'
import * as firebaseModule from '@/lib/firebase'

describe('updateDraftEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return error when db is not initialized', async () => {
    // Spy on db and make it return null
    vi.spyOn(firebaseModule, 'db', 'get').mockReturnValue(null as any)

    const result = await updateDraftEvent('user1', 'event1', { title: 'Test Event' })

    expect(result.success).toBe(false)
    if (!result.success && 'error' in result) {
      expect(result.error).toBe('Firestore database is not initialized')
      expect(result.errorType).toBe('network')
    }

    vi.restoreAllMocks()
  })

  it('should update draft event successfully', async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined)

    const updates: Partial<DraftEventData> = {
      title: 'Updated Event',
      description: 'Updated description',
    }

    const result = await updateDraftEvent('user1', 'event1', updates)

    expect(result.success).toBe(true)
    expect(updateDoc).toHaveBeenCalled()
  })

  it('should convert Date fields to Timestamps', async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined)

    const testDate = new Date('2024-12-25T14:00:00')
    const updates: Partial<DraftEventData> = {
      title: 'Event with Date',
      timeStart: testDate,
    }

    await updateDraftEvent('user1', 'event1', updates)

    expect(updateDoc).toHaveBeenCalled()
    const callArgs = vi.mocked(updateDoc).mock.calls[0]
    expect(callArgs[1]).toHaveProperty('timeStart')
    expect(callArgs[1]).toHaveProperty('updatedAt')
  })

  it('should include updatedAt timestamp', async () => {
    vi.mocked(updateDoc).mockResolvedValue(undefined)

    const updates: Partial<DraftEventData> = {
      title: 'Test',
    }

    await updateDraftEvent('user1', 'event1', updates)

    expect(updateDoc).toHaveBeenCalled()
    const callArgs = vi.mocked(updateDoc).mock.calls[0]
    expect(callArgs[1]).toHaveProperty('updatedAt')
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Network error')
    vi.mocked(updateDoc).mockRejectedValue(error)

    const result = await updateDraftEvent('user1', 'event1', { title: 'Test' })

    expect(result.success).toBe(false)
    if (!result.success && 'error' in result) {
      expect(result.error).toBe('Network error')
      expect(result.errorType).toBe('network')
    }
  })
})

describe('loadAllEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error when db is not initialized', async () => {
    // Spy on db and make it return null
    vi.spyOn(firebaseModule, 'db', 'get').mockReturnValue(null as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(false)
    if (!result.success && 'error' in result) {
      expect(result.error).toBe('Firestore database is not initialized')
      expect(result.errorType).toBe('network')
    }

    vi.restoreAllMocks()
  })

  it('should load all events successfully', async () => {
    const mockEvents = [
      {
        id: 'event1',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-01') },
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
          title: 'Event 1',
          activity: 'Hiking',
        }),
      },
      {
        id: 'event2',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-02') },
          createdAt: { toDate: () => new Date('2024-01-02') },
          updatedAt: { toDate: () => new Date('2024-01-02') },
          title: 'Event 2',
          activity: 'Running',
        }),
      },
    ]

    const mockQuerySnapshot = {
      docs: mockEvents as any,
      empty: false,
      metadata: {} as any,
      query: {} as any,
      size: 2,
    }

    vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(2)
      expect(result.data[0].eventId).toBe('event1')
      expect(result.data[0].title).toBe('Event 1')
      expect(result.data[1].eventId).toBe('event2')
      expect(result.data[1].title).toBe('Event 2')
    }
  })

  it('should filter out deleted events', async () => {
    const mockEvents = [
      {
        id: 'event1',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-01') },
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
          title: 'Event 1',
        }),
      },
    ]

    const mockQuerySnapshot = {
      docs: mockEvents as any,
      empty: false,
      metadata: {} as any,
      query: {} as any,
      size: 1,
    }
    vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(1)
      expect(result.data[0].isDeleted).toBe(false)
    }
  })

  it('should return empty array when no events found', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [],
      empty: true,
      metadata: {} as any,
      query: {} as any,
      size: 0,
    } as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(0)
    }
  })

  it('should convert Firestore Timestamps to Dates', async () => {
    const testDate = new Date('2024-12-25')
    const mockEvents = [
      {
        id: 'event1',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => testDate },
          createdAt: { toDate: () => testDate },
          updatedAt: { toDate: () => testDate },
          timeStart: { toDate: () => testDate },
        }),
      },
    ]

    const mockQuerySnapshot = {
      docs: mockEvents as any,
      empty: false,
      metadata: {} as any,
      query: {} as any,
      size: 1,
    }
    vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data[0].createdAt).toBeInstanceOf(Date)
      expect(result.data[0].updatedAt).toBeInstanceOf(Date)
      expect(result.data[0].timeStart).toBeInstanceOf(Date)
    }
  })

  it('should handle missing optional fields', async () => {
    const mockEvents = [
      {
        id: 'event1',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-01') },
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
        }),
      },
    ]

    const mockQuerySnapshot = {
      docs: mockEvents as any,
      empty: false,
      metadata: {} as any,
      query: {} as any,
      size: 1,
    }
    vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data[0].title).toBeUndefined()
      expect(result.data[0].description).toBeUndefined()
      expect(result.data[0].activity).toBeUndefined()
      expect(result.data[0].timeStart).toBeUndefined()
    }
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Network error')
    vi.mocked(getDocs).mockRejectedValue(error)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(false)
    if (!result.success && 'error' in result) {
      expect(result.error).toBe('Network error')
      expect(result.errorType).toBe('network')
    }
  })

  it('should order events by createdAt descending', async () => {
    const mockEvents = [
      {
        id: 'event2',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-02') },
          createdAt: { toDate: () => new Date('2024-01-02') },
          updatedAt: { toDate: () => new Date('2024-01-02') },
          title: 'Event 2',
        }),
      },
      {
        id: 'event1',
        data: () => ({
          role: 'creator',
          status: 'draft',
          pairRole: 'userA',
          isDeleted: false,
          joinedAt: { toDate: () => new Date('2024-01-01') },
          createdAt: { toDate: () => new Date('2024-01-01') },
          updatedAt: { toDate: () => new Date('2024-01-01') },
          title: 'Event 1',
        }),
      },
    ]

    vi.mocked(getDocs).mockResolvedValue({
      docs: mockEvents as any,
      empty: false,
      metadata: {} as any,
      query: {} as any,
      size: 2,
    } as any)

    const result = await loadAllEvents('user1')

    expect(result.success).toBe(true)
    if (result.success) {
      // Events should be ordered by createdAt desc (most recent first)
      expect(result.data[0].eventId).toBe('event2')
      expect(result.data[1].eventId).toBe('event1')
    }
  })
})
