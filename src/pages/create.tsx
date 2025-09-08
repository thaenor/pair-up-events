import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/molecules/date-picker';
import { ImagePicker } from '@/components/molecules/image-picker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/molecules/alert-dialog';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    expectedAttendees: '',
    image: null as File | null,
  });
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const isFormDirty = () => {
    return (
      formData.title !== '' ||
      formData.description !== '' ||
      formData.location !== '' ||
      formData.expectedAttendees !== '' ||
      formData.image !== null
    );
  };

  const handleCancel = () => {
    if (isFormDirty()) {
      setShowCancelWarning(true);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Create Event</h1>
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Event Description" value={formData.description} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Event Location" value={formData.location} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                <Input
                  id="expectedAttendees"
                  type="number"
                  placeholder="Number of Attendees"
                  value={formData.expectedAttendees}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
              <div>
                <Label>Image</Label>
                <ImagePicker onImageChange={handleImageChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Submit for approval</Button>
          </div>
        </form>
      </div>
      <AlertDialog open={showCancelWarning} onOpenChange={setShowCancelWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/')}>Yes, cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
};

export default CreateEventPage;
