
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/navigation/Navbar';
import Dashboard from '@/components/dashboard/Dashboard';
import EventForm from '@/components/events/EventForm';
import BrowseEvents from '@/components/events/BrowseEvents';
import PairProfileForm from '@/components/profile/PairProfileForm';
import { PairProfile } from '@/types';
import { toast } from '@/hooks/use-toast';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [userPair, setUserPair] = useState<PairProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, fetch user's pair profile from Firebase
      // For now, create a mock profile or check if one exists
      const mockProfile: PairProfile = {
        id: 'pair_' + user.uid,
        userId: user.uid,
        pairName: 'Your Pair Name',
        description: 'Your pair description',
        pairType: 'couple',
        interests: [],
        createdAt: new Date(),
      };
      
      setUserPair(mockProfile);
      setLoading(false);
    }
  }, [user]);

  const handleCreateEvent = async (eventData: any) => {
    try {
      // In a real app, create event in Firebase and generate confirmation token
      console.log('Creating event:', eventData);
      
      toast({
        title: "Event Created!",
        description: "Please share the confirmation link with your partner.",
      });
      
      setCurrentView('dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestJoin = async (eventId: string) => {
    try {
      // In a real app, create join request and generate confirmation token
      console.log('Requesting to join event:', eventId);
      
      toast({
        title: "Request Initiated!",
        description: "Please share the confirmation link with your partner.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async (profileData: any) => {
    try {
      // In a real app, save to Firebase
      console.log('Saving profile:', profileData);
      
      setUserPair({
        ...userPair!,
        ...profileData,
      });
      
      toast({
        title: "Profile Updated!",
        description: "Your pair profile has been saved.",
      });
      
      setCurrentView('dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center">
        <p className="text-[#F5E6C8]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A2A33]">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && userPair && (
          <Dashboard userPair={userPair} onViewChange={setCurrentView} />
        )}
        
        {currentView === 'create-event' && (
          <EventForm onCreateEvent={handleCreateEvent} />
        )}
        
        {currentView === 'browse-events' && userPair && (
          <BrowseEvents userPair={userPair} onRequestJoin={handleRequestJoin} />
        )}
        
        {currentView === 'profile' && (
          <PairProfileForm
            onSave={handleSaveProfile}
            initialProfile={userPair || undefined}
          />
        )}
      </main>
    </div>
  );
};

export default MainApp;
