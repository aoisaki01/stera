'use client';

import React from 'react';

interface StarShapeProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function StarShape({ size = 40, className = '', animated = false }: StarShapeProps) {
  return (
    <span 
      className={`star-shape ${animated ? 'animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6AAF7B" />
            <stop offset="50%" stopColor="#4A8B5C" />
            <stop offset="100%" stopColor="#2D5A3D" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 C55 40 60 45 100 50 C60 55 55 60 50 100 C45 60 40 55 0 50 C40 45 45 40 50 0Z"
          fill="url(#starGradient)"
        />
      </svg>
    </span>
  );
}

interface SmallStarProps {
  size?: number;
  className?: string;
}

export function SmallStar({ size = 16, className = '' }: SmallStarProps) {
  return (
    <span className={`star-shape ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="smallStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6AAF7B" />
            <stop offset="100%" stopColor="#2D5A3D" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 C55 40 60 45 100 50 C60 55 55 60 50 100 C45 60 40 55 0 50 C40 45 45 40 50 0Z"
          fill="url(#smallStarGradient)"
        />
      </svg>
    </span>
  );
}
