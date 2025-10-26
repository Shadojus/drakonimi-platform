import React from 'react';
import { SectionHeading, LatinNameDisplay, ElementBadge, DangerIndicator } from '../atoms';
import { ImageGallery } from '../molecules';

interface DragonHeroProps {
  dragon: {
    name: string;
    latinName: string;
    images?: string[];
    element?: string;
    dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
    shortDescription?: string;
  };
}

export const DragonHero: React.FC<DragonHeroProps> = ({ dragon }) => {
  return (
    <section className="bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 text-white py-12 px-4 rounded-2xl shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-4">
            <SectionHeading level={1} className="text-white">
              {dragon.name}
            </SectionHeading>
            <LatinNameDisplay 
              latinName={dragon.latinName} 
              size="lg" 
              className="text-purple-200" 
            />
            
            {dragon.shortDescription && (
              <p className="text-lg text-purple-100 leading-relaxed">
                {dragon.shortDescription}
              </p>
            )}
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              {dragon.element && <ElementBadge element={dragon.element} size="lg" />}
              {dragon.dangerLevel && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <DangerIndicator level={dragon.dangerLevel} />
                </div>
              )}
            </div>
          </div>
          
          {/* Images */}
          <div>
            <ImageGallery 
              images={dragon.images || ['/placeholder-dragon.jpg']} 
              alt={dragon.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
