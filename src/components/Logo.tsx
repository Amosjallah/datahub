'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number; // base height in pixels
  colorMode?: 'light' | 'dark' | 'brand';
}

export default function Logo({ className, size = 32, colorMode = 'brand' }: LogoProps) {
  // Brand color variables
  const primaryText = colorMode === 'light' ? '#0A2540' : '#FFFFFF';
  const accentBlue = '#3B82F6'; // Bright blue matching FA logo

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      
      {/* Stylized FA Icon SVG */}
      <svg
        width={size * 1.3}
        height={size}
        viewBox="0 0 45 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Stylized letter F */}
        <text 
          x="2" 
          y="23" 
          fill={primaryText} 
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            fontWeight: 900, 
            fontSize: '22px', 
            fontStyle: 'italic',
            letterSpacing: '-0.05em'
          }}
        >
          F
        </text>

        {/* Stylized letter A */}
        <text 
          x="13" 
          y="23" 
          fill={accentBlue} 
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            fontWeight: 900, 
            fontSize: '22px', 
            fontStyle: 'italic',
            letterSpacing: '-0.05em'
          }}
        >
          A
        </text>

        {/* Swoosh curve underneath */}
        <path 
          d="M 2 26 C 10 29, 20 29, 28 24.5" 
          stroke={accentBlue} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />

        {/* Sparkle spark dot nodes on top right of A */}
        <circle cx="28" cy="10" r="1.8" fill={accentBlue} />
        <circle cx="25" cy="5" r="1" fill={accentBlue} />
        <path d="M 27 4 L 28.5 6 L 30 4 L 28.5 2 Z" fill={accentBlue} />
      </svg>
      
      {/* Brand Text Columns */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1, textAlign: 'left' }}>
        <span 
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            fontWeight: 800, 
            fontSize: `${size * 0.46}px`, 
            color: primaryText,
            letterSpacing: '-0.015em'
          }}
        >
          FA Digital
        </span>
        <span 
          style={{ 
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
            fontWeight: 600, 
            fontSize: `${size * 0.22}px`, 
            color: '#9CA3AF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '1px'
          }}
        >
          Utility Gateway
        </span>
      </div>

    </div>
  );
}
