import React from 'react';
import { LatinNameDisplay, ElementBadge, DangerIndicator } from '../atoms';

interface ClassificationInfoProps {
  latinName: string;
  family?: string;
  order?: string;
  element?: string;
  dangerLevel?: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
  origin?: string;
}

export const ClassificationInfo: React.FC<ClassificationInfoProps> = ({
  latinName,
  family,
  order,
  element,
  dangerLevel,
  origin,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Classification</h3>
      
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-600 block mb-1">Scientific Name</span>
          <LatinNameDisplay latinName={latinName} size="lg" />
        </div>
        
        {family && (
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-1">Family</span>
            <span className="text-base text-gray-900">{family}</span>
          </div>
        )}
        
        {order && (
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-1">Order</span>
            <span className="text-base text-gray-900">{order}</span>
          </div>
        )}
        
        {element && (
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-1">Element</span>
            <ElementBadge element={element} />
          </div>
        )}
        
        {dangerLevel && (
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-1">Danger Level</span>
            <DangerIndicator level={dangerLevel} />
          </div>
        )}
        
        {origin && (
          <div>
            <span className="text-sm font-medium text-gray-600 block mb-1">Origin</span>
            <span className="text-base text-gray-900">{origin}</span>
          </div>
        )}
      </div>
    </div>
  );
};
