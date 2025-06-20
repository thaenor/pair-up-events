
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventCard from './EventCard';
import { Event, PairProfile } from '@/types';
import { Search } from 'lucide-react';

interface BrowseEventsProps {
  userPair: PairProfile;
  onRequestJoin: (eventId: string) => void;
}

const BrowseEvents: React.FC<BrowseEventsProps> = ({ userPair, onRequestJoin }) => {
  const [events, setEvents] = useState<Array<{ event: Event; hostPair: PairProfile }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents = [
      {
        event: {
          id: '1',
          hostPairId: 'pair1',
          title: 'Wine Tasting & Dinner',
          activityType: 'Dining & Drinks',
          dateTime: new Date('2024-01-20T18:00:00'),
          location: 'Napa Valley Wine Country',
          description: 'Join us for an evening of wine tasting followed by dinner at a local vineyard restaurant.',
          status: 'live' as const,
          createdAt: new Date(),
          expiresAt: new Date('2024-01-20T16:00:00'),
        },
        hostPair: {
          id: 'pair1',
          userId: 'user1',
          pairName: 'Alex & Jordan',
          description: 'Food lovers and wine enthusiasts',
          pairType: 'couple' as const,
          interests: ['wine', 'cooking', 'travel'],
          createdAt: new Date(),
        }
      },
      {
        event: {
          id: '2',
          hostPairId: 'pair2',
          title: 'Hiking & Picnic Adventure',
          activityType: 'Outdoor Activities',
          dateTime: new Date('2024-01-22T10:00:00'),
          location: 'Golden Gate Park',
          description: 'Early morning hike followed by a picnic lunch. Bring your appetite for adventure!',
          status: 'live' as const,
          createdAt: new Date(),
          expiresAt: new Date('2024-01-22T08:00:00'),
        },
        hostPair: {
          id: 'pair2',
          userId: 'user2',
          pairName: 'Sam & Casey',
          description: 'Outdoor enthusiasts and nature lovers',
          pairType: 'friends' as const,
          interests: ['hiking', 'photography', 'nature'],
          createdAt: new Date(),
        }
      },
      {
        event: {
          id: '3',
          hostPairId: 'pair3',
          title: 'Game Night & Pizza',
          activityType: 'Indoor Entertainment',
          dateTime: new Date('2024-01-25T19:00:00'),
          location: 'Downtown Board Game Cafe',
          description: 'Board games, pizza, and good company. Perfect for a fun evening!',
          status: 'live' as const,
          createdAt: new Date(),
          expiresAt: new Date('2024-01-25T17:00:00'),
        },
        hostPair: {
          id: 'pair3',
          userId: 'user3',
          pairName: 'Riley & Morgan',
          description: 'Board game enthusiasts and pizza connoisseurs',
          pairType: 'couple' as const,
          interests: ['board games', 'pizza', 'movies'],
          createdAt: new Date(),
        }
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(({ event, hostPair }) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostPair.pairName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-[#F5E6C8]">Loading available events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-[#1A2A33]">Browse Available Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A2A33]/40 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by title, activity, location, or host pair..."
                className="pl-10 border-[#1A2A33]/20"
              />
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#1A2A33]/60">
                {searchTerm ? 'No events match your search.' : 'No events available right now.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(({ event, hostPair }) => (
                <EventCard
                  key={event.id}
                  event={event}
                  hostPair={hostPair}
                  onRequestJoin={onRequestJoin}
                  showRequestButton={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseEvents;
