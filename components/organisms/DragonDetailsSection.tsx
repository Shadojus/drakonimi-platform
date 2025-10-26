import React from 'react';
import { SectionHeading, HabitatChip } from '../atoms';
import { PropertyGrid, DragonStats, ClassificationInfo } from '../molecules';

interface DragonDetailsSectionProps {
  dragon: {
    name: string;
    latinName: string;
    description?: string;
    habitat?: string[];
    element?: string;
    dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
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
  };
}

export const DragonDetailsSection: React.FC<DragonDetailsSectionProps> = ({ dragon }) => {
  return (
    <section className="space-y-8">
      {/* Description */}
      {dragon.description && (
        <div>
          <SectionHeading level={2} icon="📖">Description</SectionHeading>
          <p className="text-gray-700 leading-relaxed mt-4">{dragon.description}</p>
        </div>
      )}
      
      {/* Properties Grid */}
      <div>
        <SectionHeading level={2} icon="⚡">Key Properties</SectionHeading>
        <div className="mt-4">
          <PropertyGrid 
            properties={[
              ...(dragon.diet ? [{ label: 'Diet', value: dragon.diet, icon: '🍖' }] : []),
              ...(dragon.lifespan ? [{ label: 'Lifespan', value: dragon.lifespan, icon: '⏳' }] : []),
              ...(dragon.origin ? [{ label: 'Origin', value: dragon.origin, icon: '🌍' }] : []),
            ]}
          />
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Dragon Stats */}
        <DragonStats 
          powerLevel={dragon.powerLevel}
          wingspan={dragon.wingspan}
          intelligence={dragon.intelligence}
          speed={dragon.speed}
          fireBreath={dragon.fireBreath}
        />
        
        {/* Classification */}
        <ClassificationInfo 
          latinName={dragon.latinName}
          family={dragon.family}
          order={dragon.order}
          element={dragon.element}
          dangerLevel={dragon.dangerLevel}
          origin={dragon.origin}
        />
      </div>
      
      {/* Habitat */}
      {dragon.habitat && dragon.habitat.length > 0 && (
        <div>
          <SectionHeading level={2} icon="🏔️">Habitat</SectionHeading>
          <div className="flex flex-wrap gap-2 mt-4">
            {dragon.habitat.map((hab, index) => (
              <HabitatChip key={index} habitat={hab} />
            ))}
          </div>
        </div>
      )}
      
      {/* Abilities */}
      {dragon.abilities && dragon.abilities.length > 0 && (
        <div>
          <SectionHeading level={2} icon="✨">Special Abilities</SectionHeading>
          <ul className="mt-4 space-y-2">
            {dragon.abilities.map((ability, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-gray-700">{ability}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
