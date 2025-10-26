import React from 'react';
import { DragonHero, DragonDetailsSection, RelatedDragonsGrid, CategoryContent } from '../organisms';

interface Dragon {
  _id: string;
  name: string;
  latinName: string;
  images?: string[];
  element?: string;
  dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
  shortDescription?: string;
  description?: string;
  habitat?: string[];
  powerLevel?: number;
  wingspan?: number;
  intelligence?: number;
  speed?: number;
  fireBreath?: number;
  family?: string;
  order?: string;
  origin?: string;
  diet?: string;
  lifespan?: string;
  abilities?: string[];
}

interface DragonDetailTemplateProps {
  dragon: Dragon;
  categories?: Array<{
    name: string;
    content: string;
  }>;
  relatedDragons?: Dragon[];
}

export const DragonDetailTemplate: React.FC<DragonDetailTemplateProps> = ({
  dragon,
  categories,
  relatedDragons,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <DragonHero dragon={dragon} />
        
        {/* Details Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <DragonDetailsSection dragon={dragon} />
        </div>
        
        {/* Category Content */}
        {categories && categories.length > 0 && (
          <CategoryContent categories={categories} />
        )}
        
        {/* Related Dragons */}
        {relatedDragons && relatedDragons.length > 0 && (
          <RelatedDragonsGrid dragons={relatedDragons} />
        )}
      </div>
    </div>
  );
};
