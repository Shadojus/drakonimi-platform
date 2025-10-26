import React from 'react';

interface HabitatChipProps {
  habitat: string;
  icon?: string;
}

export const HabitatChip: React.FC<HabitatChipProps> = ({ habitat, icon }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
      {icon && <span className="text-base">{icon}</span>}
      <span className="text-sm font-medium">{habitat}</span>
    </div>
  );
};
