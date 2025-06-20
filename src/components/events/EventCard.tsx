
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event, PairProfile } from '@/types';

interface EventCardProps {
  event: Event;
  hostPair: PairProfile;
  onRequestJoin?: (eventId: string) => void;
  showRequestButton?: boolean;
  showStatus?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  hostPair, 
  onRequestJoin, 
  showRequestButton = false,
  showStatus = false 
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_host_confirmation':
        return 'text-yellow-600';
      case 'live':
        return 'text-green-600';
      case 'matched':
        return 'text-blue-600';
      case 'confirmed':
        return 'text-[#27E9F3]';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_host_confirmation':
        return 'Pending Partner Confirmation';
      case 'live':
        return 'Available to Join';
      case 'matched':
        return 'Pending Mutual Confirmation';
      case 'confirmed':
        return 'Fully Confirmed';
      default:
        return status;
    }
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-[#1A2A33]">{event.title}</CardTitle>
          {showStatus && (
            <span className={`text-sm font-medium ${getStatusColor(event.status)}`}>
              {getStatusText(event.status)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-[#1A2A33]/70">
          <Users className="w-4 h-4" />
          <span>Hosted by {hostPair.pairName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#1A2A33]/70">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.dateTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-[#1A2A33]/70">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        <div className="bg-[#FECC08]/10 p-3 rounded-lg">
          <p className="text-[#1A2A33] text-sm font-medium mb-1">Activity: {event.activityType}</p>
        </div>

        {event.description && (
          <p className="text-[#1A2A33]/80 text-sm">{event.description}</p>
        )}

        {showRequestButton && onRequestJoin && (
          <Button
            onClick={() => onRequestJoin(event.id)}
            className="w-full bg-[#FECC08] hover:bg-[#FECC08]/90 text-[#1A2A33] font-semibold"
          >
            Request to Join
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
