import React from 'react';
import { SectionHeading } from '../atoms';
import { DragonCard } from '../molecules';

interface Dragon {
  _id: string;
  name: string;
  latinName: string;
  images?: string[];
  element?: string;
  dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
  shortDescription?: string;
}

interface RelatedDragonsGridProps {
  dragons: Dragon[];
  title?: string;
}

export const RelatedDragonsGrid: React.FC<RelatedDragonsGridProps> = ({ 
  dragons, 
  title = 'Related Dragons' 
}) => {
  if (!dragons || dragons.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <SectionHeading level={2} icon="🐉">
        {title}
      </SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {dragons.map((dragon) => (
          <DragonCard key={dragon._id} dragon={dragon} />
        ))}
      </div>
    </section>
  );
};
