'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number; // base height in pixels
  colorMode?: 'light' | 'dark' | 'brand';
}

export default function Logo({ className, size = 32, colorMode = 'brand' }: LogoProps) {
  // Brand color palette:
  // Primary (electric blue): #0066FF
  // Accent/Light (cyan): #00B4DB
  // Dark text (navy): #0D1B2A
  
  const darkColor = colorMode === 'light' ? '#0D1B2A' : '#FFFFFF';
  const primaryColor = '#0066FF';
  const accentColor = '#00B4DB';

  // We scale the SVG width to maintain a ~3:1 aspect ratio
  const width = size * 3;

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Group with skew transform to match the fast/italicized aesthetic in the image logo */}
      <g transform="skewX(-14) translate(10, 0)">
        {/* Stylized 'F' */}
        <path
          d="M 12 8 H 27 V 13 H 17.5 V 19 H 25 V 24 H 17.5 V 32 H 12 Z"
          fill={darkColor}
        />
        
        {/* Stylized 'A' */}
        <path
          d="M 29.5 32 L 37.5 8 H 43 L 51 32 H 45.2 L 43.7 26.5 H 35 L 33.5 32 Z M 36.2 21.8 H 42.5 L 39.3 12 Z"
          fill={primaryColor}
        />
        
        {/* Pixel cluster flying off the top right of 'A' */}
        <rect x="49" y="8" width="3" height="3" fill={accentColor} />
        <rect x="53" y="8" width="3" height="3" fill={primaryColor} />
        <rect x="51" y="4.5" width="3" height="3" fill={primaryColor} />
        <rect x="47" y="11.5" width="2.5" height="2.5" fill={accentColor} />
      </g>
      
      {/* Swoosh arc wrapping around the bottom (not skewed for a smoother orbital look) */}
      <path
        d="M 12 28 C 22 35.5, 52 35.5, 60 21.5 C 55 27, 28 29.5, 15 27"
        fill={primaryColor}
      />
    </svg>
  );
}
