import React from 'react';

interface DangerIndicatorProps {
  level: 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary';
  showLabel?: boolean;
}

export const DangerIndicator: React.FC<DangerIndicatorProps> = ({ 
  level, 
  showLabel = true 
}) => {
  const dangerConfig = {
    harmless: { color: 'bg-green-500', label: 'Harmless', icon: '🕊️' },
    cautious: { color: 'bg-yellow-500', label: 'Cautious', icon: '⚠️' },
    dangerous: { color: 'bg-orange-500', label: 'Dangerous', icon: '🔥' },
    deadly: { color: 'bg-red-500', label: 'Deadly', icon: '💀' },
    legendary: { color: 'bg-purple-500', label: 'Legendary', icon: '⚡' },
  };

  const config = dangerConfig[level];

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${config.color}`} />
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          {config.icon} {config.label}
        </span>
      )}
    </div>
  );
};
