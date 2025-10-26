import React from 'react';
import { PropertyBadge } from '../atoms';

interface Property {
  label: string;
  value: string | number;
  icon?: string;
  variant?: 'default' | 'accent' | 'warning' | 'success';
}

interface PropertyGridProps {
  properties: Property[];
  columns?: 2 | 3 | 4;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  columns = 3 
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {properties.map((prop, index) => (
        <PropertyBadge
          key={index}
          label={prop.label}
          value={prop.value}
          variant={prop.variant}
          icon={prop.icon}
        />
      ))}
    </div>
  );
};
