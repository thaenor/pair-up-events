
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EventFormProps {
  onCreateEvent: (eventData: {
    title: string;
    activityType: string;
    dateTime: Date;
    location: string;
    description: string;
  }) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onCreateEvent({
        title,
        activityType,
        dateTime: new Date(dateTime),
        location,
        description,
      });

      // Reset form
      setTitle('');
      setActivityType('');
      setDateTime('');
      setLocation('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[#1A2A33]">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-[#1A2A33]">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Double Date Dinner & Movies"
              required
              className="border-[#1A2A33]/20"
            />
          </div>

          <div>
            <Label htmlFor="activityType" className="text-[#1A2A33]">Activity Type</Label>
            <Input
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              placeholder="e.g., Dinner, Hiking, Game Night"
              required
              className="border-[#1A2A33]/20"
            />
          </div>

          <div>
            <Label htmlFor="dateTime" className="text-[#1A2A33]">Date & Time</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="border-[#1A2A33]/20"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-[#1A2A33]">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Downtown Restaurant District"
              required
              className="border-[#1A2A33]/20"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1A2A33]">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'd like to do together..."
              className="border-[#1A2A33]/20"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33] font-semibold"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
