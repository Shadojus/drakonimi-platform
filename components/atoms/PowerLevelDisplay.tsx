import React from 'react';

interface PowerLevelDisplayProps {
  level: number;
  maxLevel?: number;
  label?: string;
  showNumeric?: boolean;
}

export const PowerLevelDisplay: React.FC<PowerLevelDisplayProps> = ({ 
  level, 
  maxLevel = 10,
  label = 'Power Level',
  showNumeric = true 
}) => {
  const percentage = (level / maxLevel) * 100;
  
  const getColor = () => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    if (level <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showNumeric && (
          <span className="text-sm font-bold text-gray-900">{level}/{maxLevel}</span>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
