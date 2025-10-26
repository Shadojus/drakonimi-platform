import React from 'react';

interface CategoryTagProps {
  category: string;
  onClick?: () => void;
  active?: boolean;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ 
  category, 
  onClick,
  active = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {category}
    </button>
  );
};
