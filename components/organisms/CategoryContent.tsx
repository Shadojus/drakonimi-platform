'use client';

import React, { useState } from 'react';
import { CategoryTag } from '../atoms';

interface CategoryContentProps {
  categories: Array<{
    name: string;
    content: string;
  }>;
}

export const CategoryContent: React.FC<CategoryContentProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <CategoryTag
            key={index}
            category={category.name}
            active={activeCategory === index}
            onClick={() => setActiveCategory(index)}
          />
        ))}
      </div>
      
      {/* Active Category Content */}
      <div className="prose max-w-none">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {categories[activeCategory].name}
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {categories[activeCategory].content}
        </div>
      </div>
    </div>
  );
};
