import React from 'react';

interface ElementBadgeProps {
  element: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ElementBadge: React.FC<ElementBadgeProps> = ({ element, size = 'md' }) => {
  const elementColors: Record<string, string> = {
    fire: 'bg-red-100 text-red-800 border-red-300',
    water: 'bg-blue-100 text-blue-800 border-blue-300',
    earth: 'bg-green-100 text-green-800 border-green-300',
    air: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    lightning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    ice: 'bg-teal-100 text-teal-800 border-teal-300',
    shadow: 'bg-purple-100 text-purple-800 border-purple-300',
    light: 'bg-amber-100 text-amber-800 border-amber-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const colorClass = elementColors[element.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium capitalize ${sizeClasses[size]} ${colorClass}`}>
      {element}
    </span>
  );
};
