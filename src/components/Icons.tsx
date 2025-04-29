
import React from 'react';

// Define a type for our custom icons
export type IconProps = {
  className?: string;
  size?: number;
};

// Wheelchair icon as a custom SVG component
export const WheelchairIcon: React.FC<IconProps> = ({ 
  className = "",
  size = 16
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="14" cy="6" r="2" />
      <path d="M9 9h7" />
      <path d="M9 9v8a1 1 0 0 0 1 1h1" />
      <path d="M9 9 4 6" />
      <path d="m17 16-2-6" />
      <circle cx="17" cy="19" r="2" />
      <circle cx="8" cy="19" r="2" />
    </svg>
  );
};

// Export any other icons needed by the application here
