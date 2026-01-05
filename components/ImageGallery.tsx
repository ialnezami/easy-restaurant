'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
}

export default function ImageGallery({
  images,
  onChange,
  label = 'Additional Images',
  maxImages = 10,
}: ImageGalleryProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddImage = (url: string) => {
    if (images.length < maxImages) {
      onChange([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleUpdateImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({images.length}/{maxImages})
      </label>

      {/* Existing Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;

                    if (!file.type.startsWith('image/')) {
                      alert('Please select an image file');
                      return;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                      alert('Image size must be less than 10MB');
                      return;
                    }

                    setUploadingIndex(index);
                    try {
                      const formData = new FormData();
                      formData.append('file', file);

                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || 'Upload failed');
                      }

                      handleUpdateImage(index, data.url);
                    } catch (error: any) {
                      alert(error.message || 'Failed to upload image');
                    } finally {
                      setUploadingIndex(null);
                    }
                  };
                  input.click();
                }}
                disabled={uploadingIndex === index}
                className="mt-1 w-full text-xs px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingIndex === index ? 'Uploading...' : 'Replace'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <ImageUpload
            value=""
            onChange={handleAddImage}
            label={`Add Image ${images.length + 1}`}
          />
        </div>
      )}

      {images.length >= maxImages && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum {maxImages} images reached. Remove an image to add a new one.
        </p>
      )}
    </div>
  );
}

