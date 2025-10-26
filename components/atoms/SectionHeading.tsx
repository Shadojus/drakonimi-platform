import React from 'react';

interface SectionHeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  level = 2, 
  children, 
  className = '',
  icon 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
  };

  return (
    <Tag className={`font-bold text-gray-900 flex items-center gap-3 ${sizeClasses[level]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </Tag>
  );
};
