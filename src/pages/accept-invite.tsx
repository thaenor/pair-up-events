import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, MapPin, Target } from 'lucide-react'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { Button } from '@/components/atoms/button'
import useAuth from '@/hooks/useAuth'
import { validateInviteCode, getPublicEventPreview } from '@/entities/invite/invite-service'
import { acceptEventInvite } from '@/entities/event/event-service'
import type { InviteCodeData } from '@/entities/invite/invite'
import type { PublicEventPreview } from '@/entities/invite/invite'

/**
 * Accept Invite Page
 *
 * Allows users to view and accept event invitations via invite links.
 * URL format: /accept-invite?eventId=ABC123&inviteCode=XYZ789
 *
 * Flow:
 * 1. Extract invite parameters from URL
 * 2. Validate invite code and fetch event preview (no auth required)
 * 3. Display event details
 * 4. If user is not authenticated, prompt to login/signup
 * 5. If authenticated, allow user to accept invite
 * 6. After acceptance, redirect to events page
 */
const AcceptInvitePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const eventId = searchParams.get('eventId')
  const inviteCode = searchParams.get('inviteCode')

  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [inviteData, setInviteData] = useState<InviteCodeData | null>(null)
  const [eventPreview, setEventPreview] = useState<PublicEventPreview | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load invite data and event preview on mount
  useEffect(() => {
    const loadInviteData = async () => {
      if (!eventId || !inviteCode) {
        setError('Invalid invite link. Missing event ID or invite code.')
        setIsLoading(false)
        return
      }

      try {
        // Validate invite code
        const validatedInvite = await validateInviteCode(inviteCode)
        if (!validatedInvite) {
          setError('This invite link is invalid or has expired.')
          setIsLoading(false)
          return
        }

        // Check if eventId matches
        if (validatedInvite.eventId !== eventId) {
          setError('Invite code does not match the event.')
          setIsLoading(false)
          return
        }

        setInviteData(validatedInvite)

        // Fetch public event preview
        const preview = await getPublicEventPreview(eventId, validatedInvite.creatorId)
        if (!preview) {
          setError('Event not found.')
          setIsLoading(false)
          return
        }

        setEventPreview(preview)
      } catch (err) {
        console.error('Error loading invite data:', err)
        setError('Failed to load invite details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadInviteData()
  }, [eventId, inviteCode])

  // Handle accept invite
  const handleAcceptInvite = async () => {
    if (!user) {
      // Store invite info in session storage for post-login redirect
      sessionStorage.setItem('pendingInvite', JSON.stringify({ eventId, inviteCode }))
      navigate('/auth')
      return
    }

    if (!inviteCode) {
      setError('Invalid invite code.')
      return
    }

    setIsAccepting(true)
    setError(null)

    try {
      const result = await acceptEventInvite(inviteCode, user.uid)

      if (result.success) {
        // Redirect to events page
        navigate('/events', {
          state: { message: 'Event invitation accepted!' },
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Error accepting invite:', err)
      setError('Failed to accept invite. Please try again.')
    } finally {
      setIsAccepting(false)
    }
  }

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Format location for display
  const formatLocation = () => {
    if (!eventPreview?.location) return 'TBD'
    const parts: string[] = []
    if (eventPreview.location.address) parts.push(eventPreview.location.address)
    if (eventPreview.location.city) parts.push(eventPreview.location.city)
    return parts.join(', ') || 'TBD'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pairup-cream flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !eventPreview || !inviteData) {
    return (
      <div className="min-h-screen bg-pairup-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-red-500 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-700 mb-6">{error || 'Something went wrong.'}</p>
          <Button onClick={() => navigate('/events')} className="w-full">
            Go to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pairup-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-pairup-darkBlue mb-2">You&apos;re Invited!</h1>
          <p className="text-gray-700">Someone wants to pair up with you for an event</p>
        </div>

        {/* Event Preview Card */}
        <div className="bg-white border-2 border-pairup-darkBlue rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-pairup-darkBlue mb-4">
            {eventPreview.title || eventPreview.activity || 'Event Details'}
          </h2>

          {eventPreview.description && (
            <p className="text-gray-700 mb-6 italic">&quot;{eventPreview.description}&quot;</p>
          )}

          <div className="space-y-4">
            {/* Activity */}
            {eventPreview.activity && (
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-pairup-darkBlue mt-0.5" />
                <div>
                  <p className="font-semibold text-pairup-darkBlue">Activity</p>
                  <p className="text-gray-700">{eventPreview.activity}</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-pairup-darkBlue mt-0.5" />
              <div>
                <p className="font-semibold text-pairup-darkBlue">Date</p>
                <p className="text-gray-700">{formatDate(eventPreview.timeStart)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-pairup-darkBlue mt-0.5" />
              <div>
                <p className="font-semibold text-pairup-darkBlue">Time</p>
                <p className="text-gray-700">{formatTime(eventPreview.timeStart)}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pairup-darkBlue mt-0.5" />
              <div>
                <p className="font-semibold text-pairup-darkBlue">Location</p>
                <p className="text-gray-700">{formatLocation()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white border-2 border-pairup-darkBlue rounded-lg p-6">
          {!user ? (
            <>
              <p className="text-gray-700 mb-4 text-center">Sign in or create an account to accept this invitation</p>
              <Button onClick={handleAcceptInvite} className="w-full" size="lg" disabled={isAccepting}>
                {isAccepting ? 'Processing...' : 'Continue'}
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4 text-center">Ready to join this event?</p>
              <Button onClick={handleAcceptInvite} className="w-full" size="lg" disabled={isAccepting}>
                {isAccepting ? 'Accepting...' : 'Accept Invitation'}
              </Button>
            </>
          )}

          {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default AcceptInvitePage
