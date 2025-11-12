import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar, MapPin, Clock, Trash2 } from 'lucide-react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { Button } from '@/components/atoms/button'
import useRequireAuth from '@/hooks/useRequireAuth'
import useAuth from '@/hooks/useAuth'
import { loadAllEvents, deleteEvent } from '@/entities/event/event-service'
import type { DraftEventData } from '@/entities/event/event'
import { toast } from 'sonner'

const EventsPage: React.FC = () => {
  const { loading } = useRequireAuth()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState<(DraftEventData & { eventId: string })[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) {
        setIsLoadingEvents(false)
        return
      }

      setIsLoadingEvents(true)
      const result = await loadAllEvents(user.uid)

      if (result.success) {
        setEvents(result.data)
      } else {
        console.error('Failed to load events:', 'error' in result ? result.error : 'Unknown error')
        toast.error('Failed to load events. Please refresh the page.')
      }
      setIsLoadingEvents(false)
    }

    fetchEvents()
  }, [user?.uid])

  const handleCreateEvent = () => {
    navigate('/events/create')
  }

  const handleEventClick = (eventId: string) => {
    navigate('/events/create', { state: { eventId } })
  }

  const handleDeleteEvent = async (eventId: string, eventTitle: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation() // Prevent event card click from firing

    if (!user?.uid) {
      toast.error('You must be logged in to delete events')
      return
    }

    // Confirm deletion
    const confirmed = window.confirm(`Are you sure you want to delete "${eventTitle || 'this event'}"?`)
    if (!confirmed) {
      return
    }

    const result = await deleteEvent(user.uid, eventId)
    if (result.success) {
      toast.success('Event deleted successfully')
      // Remove the event from the local state
      setEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId))
    } else {
      toast.error('Failed to delete event. Please try again.')
      console.error('Failed to delete event:', 'error' in result ? result.error : 'Unknown error')
    }
  }

  const formatDate = (date?: Date): string => {
    if (!date) return 'Date TBD'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (date?: Date): string => {
    if (!date) return 'Time TBD'
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatLocation = (location?: { address?: string; city?: string }): string => {
    if (!location) return 'Location TBD'
    const parts: string[] = []
    if (location.address) parts.push(location.address)
    if (location.city) parts.push(location.city)
    return parts.join(', ') || 'Location TBD'
  }

  const getEventDisplayName = (event: DraftEventData & { eventId: string }, fallback: string = 'Untitled'): string => {
    return event.title || event.activity || fallback
  }

  if (loading || isLoadingEvents) {
    return (
      <div className="min-h-screen bg-pairup-cream flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-4 flex items-center justify-center">My Events</h1>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleCreateEvent}
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              className="min-h-[44px]"
              aria-label="Create new event"
            >
              Create New Event
            </Button>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-pairup-darkBlue/70 text-lg mb-4">No events yet</p>
            <p className="text-pairup-darkBlue/50 text-sm">Create your first event to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <button
                key={event.eventId}
                onClick={() => handleEventClick(event.eventId)}
                className="w-full text-left bg-white border-2 border-pairup-darkBlue rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue focus:ring-offset-2 cursor-pointer"
                aria-label={`View event: ${getEventDisplayName(event)}`}
              >
                {/* Status Badge and Delete Button */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.status === 'draft' ? 'Draft' : 'Published'}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={e => handleDeleteEvent(event.eventId, getEventDisplayName(event), e)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteEvent(event.eventId, getEventDisplayName(event), e)
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                    aria-label={`Delete event: ${getEventDisplayName(event)}`}
                    title="Delete event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-xl md:text-2xl font-bold text-pairup-darkBlue mb-2">
                  {getEventDisplayName(event, 'Untitled Event')}
                </h3>

                {/* Event Headline */}
                {event.headline && <p className="text-gray-600 text-sm md:text-base mb-2 italic">{event.headline}</p>}

                {/* Event Description */}
                {event.description && (
                  <p className="text-gray-700 text-sm md:text-base mb-4 line-clamp-2">{event.description}</p>
                )}

                {/* Event Details */}
                <div className="space-y-2 text-sm md:text-base">
                  {/* Activity */}
                  {event.activity && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-base md:text-lg">🎯</span>
                      <span>{event.activity}</span>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{formatDate(event.timeStart)}</span>
                    {event.timeStart && (
                      <>
                        <Clock className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        <span>{formatTime(event.timeStart)}</span>
                      </>
                    )}
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{formatLocation(event.location)}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default EventsPage
