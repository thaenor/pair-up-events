
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface ConfirmationPageProps {
  type: 'host-event' | 'guest-request' | 'host-acceptance' | 'guest-final';
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ type }) => {
  const [searchParams] = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = searchParams.get('token');

  const getTitle = () => {
    switch (type) {
      case 'host-event':
        return 'Confirm Event Creation';
      case 'guest-request':
        return 'Confirm Join Request';
      case 'host-acceptance':
        return 'Confirm Guest Acceptance';
      case 'guest-final':
        return 'Confirm Participation';
      default:
        return 'Confirmation Required';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'host-event':
        return 'Your partner has created an event. Click confirm to make it visible to other pairs.';
      case 'guest-request':
        return 'Your partner wants to join an event. Click confirm to send the request to the host pair.';
      case 'host-acceptance':
        return 'Your partner has accepted a guest pair. Click confirm to proceed with the connection.';
      case 'guest-final':
        return 'The host pair has accepted your request. Click confirm to finalize your participation.';
      default:
        return 'Please confirm this action.';
    }
  };

  const handleConfirm = async () => {
    if (!token) {
      setError('Invalid confirmation link');
      return;
    }

    setLoading(true);
    try {
      // Here you would implement the Firebase function to handle the confirmation
      console.log(`Confirming ${type} with token:`, token);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConfirmed(true);
    } catch (err) {
      setError('Failed to confirm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="text-center p-6">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#1A2A33] mb-2">Invalid Link</h2>
            <p className="text-[#1A2A33]/70">This confirmation link is not valid.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="text-center p-6">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#1A2A33] mb-2">Confirmed!</h2>
            <p className="text-[#1A2A33]/70">Your confirmation has been processed successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A2A33] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-center text-[#1A2A33]">{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-[#1A2A33]/70 mb-6">{getDescription()}</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33] font-semibold"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
