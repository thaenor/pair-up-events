
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PairProfile } from '@/types';

interface PairProfileFormProps {
  onSave: (profile: Omit<PairProfile, 'id' | 'userId' | 'createdAt'>) => void;
  initialProfile?: PairProfile;
}

const PairProfileForm: React.FC<PairProfileFormProps> = ({ onSave, initialProfile }) => {
  const [pairName, setPairName] = useState(initialProfile?.pairName || '');
  const [description, setDescription] = useState(initialProfile?.description || '');
  const [pairType, setPairType] = useState<'couple' | 'friends' | 'siblings' | 'other'>(
    initialProfile?.pairType || 'couple'
  );
  const [interests, setInterests] = useState(initialProfile?.interests?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      pairName,
      description,
      pairType,
      interests: interests.split(',').map(i => i.trim()).filter(i => i),
    };

    onSave(profile);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[#1A2A33]">
          {initialProfile ? 'Edit Pair Profile' : 'Create Your Pair Profile'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="pairName" className="text-[#1A2A33]">Pair Name</Label>
            <Input
              id="pairName"
              value={pairName}
              onChange={(e) => setPairName(e.target.value)}
              placeholder="e.g., Sarah & Tom"
              required
              className="border-[#1A2A33]/20"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1A2A33]">Pair Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell other pairs about yourselves..."
              className="border-[#1A2A33]/20"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-[#1A2A33]">Pair Type</Label>
            <RadioGroup value={pairType} onValueChange={(value) => setPairType(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="couple" id="couple" />
                <Label htmlFor="couple" className="text-[#1A2A33]">Couple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends" className="text-[#1A2A33]">Best Friends</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="siblings" id="siblings" />
                <Label htmlFor="siblings" className="text-[#1A2A33]">Siblings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="text-[#1A2A33]">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="interests" className="text-[#1A2A33]">Interests</Label>
            <Input
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., hiking, cooking, movies, gaming"
              className="border-[#1A2A33]/20"
            />
            <p className="text-sm text-[#1A2A33]/60 mt-1">Separate interests with commas</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#27E9F3] hover:bg-[#27E9F3]/90 text-[#1A2A33] font-semibold"
          >
            {initialProfile ? 'Update Profile' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PairProfileForm;
