import React from 'react';

interface WingspanDisplayProps {
  wingspan: number;
  unit?: string;
  label?: string;
}

export const WingspanDisplay: React.FC<WingspanDisplayProps> = ({ 
  wingspan, 
  unit = 'm',
  label = 'Wingspan' 
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-800 rounded-md border border-sky-200">
      <span className="text-xl">🦅</span>
      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-70">{label}</span>
        <span className="text-sm font-semibold">{wingspan} {unit}</span>
      </div>
    </div>
  );
};
