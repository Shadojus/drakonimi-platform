import React from 'react';
import Link from 'next/link';
import { DragonImage, LatinNameDisplay, ElementBadge, DangerIndicator } from '../atoms';

interface DragonCardProps {
  dragon: {
    _id: string;
    name: string;
    latinName: string;
    images?: string[];
    element?: string;
    dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
    shortDescription?: string;
  };
}

export const DragonCard: React.FC<DragonCardProps> = ({ dragon }) => {
  const imageUrl = dragon.images?.[0] || '/placeholder-dragon.jpg';
  const linkUrl = `/${dragon.latinName.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Link href={linkUrl}>
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <DragonImage 
            src={imageUrl} 
            alt={dragon.name}
            className="group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
            {dragon.name}
          </h3>
          <LatinNameDisplay latinName={dragon.latinName} size="sm" className="mb-3" />
          
          {dragon.shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
              {dragon.shortDescription}
            </p>
          )}
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            {dragon.element && <ElementBadge element={dragon.element} size="sm" />}
            {dragon.dangerLevel && <DangerIndicator level={dragon.dangerLevel} showLabel={false} />}
          </div>
        </div>
      </div>
    </Link>
  );
};
