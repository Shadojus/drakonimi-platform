import React from 'react';

interface LatinNameDisplayProps {
  latinName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LatinNameDisplay: React.FC<LatinNameDisplayProps> = ({ 
  latinName, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span className={`italic text-gray-600 font-serif ${sizeClasses[size]} ${className}`}>
      {latinName}
    </span>
  );
};
