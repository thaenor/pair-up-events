import { ChangeEvent, useState } from 'react';

import { Input } from '@/components/ui/input';

export function ImagePicker({ onImageChange }: { onImageChange: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreview(null);
      onImageChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-[280px]">
      <Input type="file" onChange={handleImageChange} />
      {preview && (
        <img src={preview} alt="Preview" className="w-full h-auto" />
      )}
    </div>
  );
}
