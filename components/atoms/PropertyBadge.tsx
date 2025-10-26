import React from 'react';

interface PropertyBadgeProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'accent' | 'warning' | 'success';
  icon?: React.ReactNode;
}

export const PropertyBadge: React.FC<PropertyBadgeProps> = ({ 
  label, 
  value, 
  variant = 'default',
  icon 
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    accent: 'bg-purple-100 text-purple-800 border-purple-300',
    warning: 'bg-orange-100 text-orange-800 border-orange-300',
    success: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border ${variantStyles[variant]}`}>
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-70">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
};
