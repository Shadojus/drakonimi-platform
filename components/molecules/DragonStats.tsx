import React from 'react';
import { PowerLevelDisplay, WingspanDisplay } from '../atoms';

interface DragonStatsProps {
  powerLevel?: number;
  wingspan?: number;
  intelligence?: number;
  speed?: number;
  fireBreath?: number;
}

export const DragonStats: React.FC<DragonStatsProps> = ({
  powerLevel,
  wingspan,
  intelligence,
  speed,
  fireBreath,
}) => {
  return (
    <div className="space-y-4 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Dragon Statistics</h3>
      
      <div className="space-y-4">
        {powerLevel !== undefined && (
          <PowerLevelDisplay level={powerLevel} label="Overall Power" />
        )}
        
        {wingspan !== undefined && (
          <WingspanDisplay wingspan={wingspan} />
        )}
        
        {intelligence !== undefined && (
          <PowerLevelDisplay level={intelligence} label="Intelligence" />
        )}
        
        {speed !== undefined && (
          <PowerLevelDisplay level={speed} label="Flight Speed" />
        )}
        
        {fireBreath !== undefined && (
          <PowerLevelDisplay level={fireBreath} label="Fire Breath" />
        )}
      </div>
    </div>
  );
};
