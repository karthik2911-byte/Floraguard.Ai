import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface ImageInputProps {
  onImageSelected: (base64: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelected(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 gap-4">
        {/* Camera Action - Primary on Mobile */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-6 text-lg shadow-emerald-200/50"
          icon={<Camera size={24} />}
        >
          Take Photo
        </Button>

        {/* Upload Action */}
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-dashed"
          icon={<Upload size={20} />}
        >
          Upload from Gallery
        </Button>
      </div>

      <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 text-center">
        <div className="flex justify-center mb-3 text-emerald-600/60">
           <ImageIcon size={32} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-gray-500">
          Supported formats: JPEG, PNG, WEBP.
          <br />
          Ensure good lighting for best accuracy.
        </p>
      </div>
    </div>
  );
};
