
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types';

interface EventChatProps {
  eventId: string;
  userRole: 'host' | 'guest';
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const EventChat: React.FC<EventChatProps> = ({ eventId, userRole, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A2A33]">Event Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-[#1A2A33]/60 text-center py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderRole === userRole ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderRole === userRole
                      ? 'bg-[#27E9F3] text-[#1A2A33]'
                      : 'bg-[#FECC08] text-[#1A2A33]'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-[#1A2A33]/20"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventChat;
