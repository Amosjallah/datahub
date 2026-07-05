'use client';

import React from 'react';

interface ProviderIconProps {
  provider: string;
  size?: number;
  className?: string;
}

export default function ProviderIcon({ provider, size = 20, className = '' }: ProviderIconProps) {
  const norm = provider.toLowerCase().trim();

  // MTN SVG Logo
  if (norm.includes('mtn') || norm.includes('momo')) {
    const isMomo = norm.includes('momo');
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#FFCC00" />
        <ellipse cx="12" cy="12" rx="8" ry="4.5" fill="none" stroke="#00081D" strokeWidth="1.5" />
        <text 
          x="12" 
          y="14.5" 
          fontSize="6" 
          fontWeight="900" 
          fill="#00081D" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          {isMomo ? 'MoMo' : 'MTN'}
        </text>
      </svg>
    );
  }

  // Telecel SVG Logo
  if (norm.includes('telecel') || norm.includes('vodafone')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#E60000" />
        <path d="M12 7C9.5 7 8 8.5 8 11C8 14 10 16 12 17C14 17 16 15 16 12C16 9.5 14.5 7 12 7ZM12 15C10.5 15 9.5 14 9.5 12C9.5 10 10.5 9 12 9C13.5 9 14.5 10 14.5 12C14.5 14 13.5 15 12 15Z" fill="#FFF" />
      </svg>
    );
  }

  // AirtelTigo / AT SVG Logo
  if (norm.includes('airtel') || norm.includes('at') || norm.includes('tigo')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#0052B4" />
        <text 
          x="12" 
          y="15" 
          fontSize="10" 
          fontWeight="900" 
          fill="#FFF" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          at
        </text>
      </svg>
    );
  }

  // Glo SVG Logo
  if (norm.includes('glo')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#5CB85C" />
        <text 
          x="12" 
          y="15.5" 
          fontSize="11" 
          fontWeight="900" 
          fill="#FFF" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          g
        </text>
      </svg>
    );
  }

  // 9mobile SVG Logo
  if (norm.includes('9mobile')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#0A3622" />
        <text 
          x="12" 
          y="16" 
          fontSize="11" 
          fontWeight="900" 
          fill="#A3E635" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          9
        </text>
      </svg>
    );
  }

  // Flutterwave SVG Logo
  if (norm.includes('flutterwave') || norm.includes('fw')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
      >
        <circle cx="12" cy="12" r="11" fill="#FF9900" />
        <text 
          x="12" 
          y="15" 
          fontSize="8" 
          fontWeight="900" 
          fill="#00081D" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          flw
        </text>
      </svg>
    );
  }

  // DStv / GOtv / TV Subscription SVG Logo
  if (norm.includes('dstv') || norm.includes('gotv') || norm.includes('tv')) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '4px' }}
      >
        <rect x="1" y="1" width="22" height="22" rx="4" fill="#0D9488" />
        <text 
          x="12" 
          y="14" 
          fontSize="7" 
          fontWeight="800" 
          fill="#FFF" 
          textAnchor="middle" 
          fontFamily="sans-serif"
        >
          {norm.includes('dstv') ? 'DStv' : norm.includes('gotv') ? 'GOtv' : 'TV'}
        </text>
      </svg>
    );
  }

  // Default Fallback circular badge
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '50%' }}
    >
      <circle cx="12" cy="12" r="11" fill="#3B82F6" />
      <text 
        x="12" 
        y="15" 
        fontSize="10" 
        fontWeight="800" 
        fill="#FFF" 
        textAnchor="middle" 
        fontFamily="sans-serif"
      >
        {norm.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}
