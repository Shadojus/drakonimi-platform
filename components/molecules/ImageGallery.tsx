'use client';

import React, { useState } from 'react';
import { DragonImage } from '../atoms';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[16/9] w-full">
        <DragonImage 
          src={images[selectedIndex]} 
          alt={`${alt} - Image ${selectedIndex + 1}`}
          priority={selectedIndex === 0}
        />
      </div>
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                selectedIndex === index 
                  ? 'ring-2 ring-purple-500 ring-offset-2' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <DragonImage src={image} alt={`${alt} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
