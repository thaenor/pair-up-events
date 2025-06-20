
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/events/EventCard';
import { Event, PairProfile, JoinRequest } from '@/types';
import { Calendar, Users, MessageCircle } from 'lucide-react';

interface DashboardProps {
  userPair: PairProfile;
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userPair, onViewChange }) => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [confirmedEvents, setConfirmedEvents] = useState<Event[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, fetch from Firebase
    setMyEvents([
      {
        id: '1',
        hostPairId: userPair.id,
        title: 'Double Date Dinner',
        activityType: 'Dinner',
        dateTime: new Date('2024-01-15T19:00:00'),
        location: 'Downtown Restaurant District',
        description: 'Looking for another couple to join us for dinner and conversation!',
        status: 'live',
        createdAt: new Date(),
        expiresAt: new Date('2024-01-15T17:00:00'),
      }
    ]);
  }, [userPair.id]);

  const getStatusBadge = (status: string) => {
    const colors = {
      'pending_host_confirmation': 'bg-yellow-100 text-yellow-800',
      'live': 'bg-green-100 text-green-800',
      'matched': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-purple-100 text-purple-800',
    };
    
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-[#27E9F3]/10 to-[#27E9F3]/5 border-[#27E9F3]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#27E9F3]" />
              <div>
                <p className="text-2xl font-bold text-[#1A2A33]">{myEvents.length}</p>
                <p className="text-[#1A2A33]/70 text-sm">My Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#FECC08]/10 to-[#FECC08]/5 border-[#FECC08]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-[#FECC08]" />
              <div>
                <p className="text-2xl font-bold text-[#1A2A33]">{joinRequests.length}</p>
                <p className="text-[#1A2A33]/70 text-sm">Join Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-[#1A2A33]">{confirmedEvents.length}</p>
                <p className="text-[#1A2A33]/70 text-sm">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Events */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-[#1A2A33]">My Events</CardTitle>
            <Button
              onClick={() => onViewChange('create-event')}
              className="bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33]"
            >
              Create New Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#1A2A33]/60 mb-4">You haven't created any events yet.</p>
              <Button
                onClick={() => onViewChange('create-event')}
                className="bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33]"
              >
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  hostPair={userPair}
                  showStatus={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Join Requests */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-[#1A2A33]">Pending Join Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {joinRequests.length === 0 ? (
            <p className="text-[#1A2A33]/60 text-center py-4">
              No pending join requests.
            </p>
          ) : (
            <div className="space-y-4">
              {joinRequests.map((request) => (
                <div key={request.id} className="border border-[#1A2A33]/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[#1A2A33]">Join Request</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(request.status)}`}>
                      {request.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[#1A2A33]/70 text-sm mb-3">
                    A pair wants to join your event.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33]">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
