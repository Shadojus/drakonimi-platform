import Image from 'next/image';
import React from 'react';

interface DragonImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export const DragonImage: React.FC<DragonImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  className = '' 
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
