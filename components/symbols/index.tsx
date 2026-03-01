import React from 'react';

export interface SymbolIconProps {
  size?: number;
  className?: string;
}

export const GemIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Top facet */}
    <polygon points="32,6 52,22 12,22" fill="#a78bfa" />
    {/* Left facet */}
    <polygon points="12,22 32,58 32,28" fill="#7c3aed" />
    {/* Right facet */}
    <polygon points="52,22 32,58 32,28" fill="#8b5cf6" />
    {/* Top-left small facet */}
    <polygon points="12,22 32,28 22,22" fill="#9f7aea" />
    {/* Top-right small facet */}
    <polygon points="52,22 32,28 42,22" fill="#6d28d9" />
    {/* Highlight line */}
    <line x1="22" y1="22" x2="32" y2="6" stroke="#c4b5fd" strokeWidth="1" opacity="0.6" />
  </svg>
);

export const ShieldIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shield body */}
    <path
      d="M32 6L54 16V34C54 46 44 54 32 60C20 54 10 46 10 34V16L32 6Z"
      fill="#f59e0b"
    />
    {/* Inner shield */}
    <path
      d="M32 12L48 20V34C48 43 40 49 32 54C24 49 16 43 16 34V20L32 12Z"
      fill="#fbbf24"
    />
    {/* Shield emblem - star */}
    <polygon
      points="32,22 35,30 43,30 37,35 39,43 32,38 25,43 27,35 21,30 29,30"
      fill="#f59e0b"
    />
  </svg>
);

export const CompassIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer ring */}
    <circle cx="32" cy="32" r="26" fill="#0e7490" stroke="#06b6d4" strokeWidth="3" />
    {/* Inner ring */}
    <circle cx="32" cy="32" r="20" fill="#155e75" />
    {/* Direction ticks */}
    <line x1="32" y1="8" x2="32" y2="14" stroke="#67e8f9" strokeWidth="2" />
    <line x1="32" y1="50" x2="32" y2="56" stroke="#67e8f9" strokeWidth="2" />
    <line x1="8" y1="32" x2="14" y2="32" stroke="#67e8f9" strokeWidth="2" />
    <line x1="50" y1="32" x2="56" y2="32" stroke="#67e8f9" strokeWidth="2" />
    {/* North needle */}
    <polygon points="32,14 36,32 28,32" fill="#06b6d4" />
    {/* South needle */}
    <polygon points="32,50 36,32 28,32" fill="#164e63" />
    {/* Center dot */}
    <circle cx="32" cy="32" r="3" fill="#67e8f9" />
  </svg>
);

export const MapIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Map body - folded parchment */}
    <path
      d="M10 12L24 8L40 14L54 10V52L40 56L24 50L10 54V12Z"
      fill="#fbbf24"
    />
    {/* Fold line left */}
    <line x1="24" y1="8" x2="24" y2="50" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* Fold line right */}
    <line x1="40" y1="14" x2="40" y2="56" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* X marks the spot */}
    <line x1="28" y1="26" x2="36" y2="38" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
    <line x1="36" y1="26" x2="28" y2="38" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
    {/* Path line */}
    <path
      d="M16 18Q20 24 22 22Q24 20 30 24"
      stroke="#b45309"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="2 2"
    />
  </svg>
);

export const BirdIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Body */}
    <ellipse cx="30" cy="36" rx="14" ry="10" fill="#ec4899" />
    {/* Head */}
    <circle cx="44" cy="26" r="8" fill="#f472b6" />
    {/* Eye */}
    <circle cx="47" cy="24" r="2" fill="#1e1e2e" />
    <circle cx="47.5" cy="23.5" r="0.8" fill="white" />
    {/* Beak */}
    <polygon points="52,26 58,24 52,28" fill="#fb923c" />
    {/* Wing */}
    <path
      d="M22 30Q10 18 8 26Q10 28 18 34Q14 22 22 30Z"
      fill="#db2777"
    />
    {/* Tail feathers */}
    <path
      d="M16 38Q8 34 6 40Q10 40 16 42Z"
      fill="#be185d"
    />
    <path
      d="M16 40Q6 38 6 44Q10 43 16 44Z"
      fill="#db2777"
    />
    {/* Crest */}
    <path
      d="M42 18Q40 10 44 12Q46 14 44 18Z"
      fill="#f472b6"
    />
  </svg>
);

export const PotionIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Flask neck */}
    <rect x="26" y="6" width="12" height="14" rx="2" fill="#6b7280" />
    {/* Cork */}
    <rect x="27" y="4" width="10" height="6" rx="2" fill="#a16207" />
    {/* Flask body */}
    <path
      d="M26 20L16 36Q12 44 16 50Q20 56 32 56Q44 56 48 50Q52 44 48 36L38 20Z"
      fill="#166534"
    />
    {/* Liquid */}
    <path
      d="M18 38Q16 44 18 48Q22 54 32 54Q42 54 46 48Q48 44 46 38Q40 42 32 40Q24 38 18 38Z"
      fill="#22c55e"
    />
    {/* Glass highlight */}
    <path
      d="M22 24L18 34Q20 30 24 28Z"
      fill="white"
      opacity="0.2"
    />
    {/* Bubbles */}
    <circle cx="28" cy="44" r="2" fill="#4ade80" opacity="0.7" />
    <circle cx="35" cy="48" r="1.5" fill="#4ade80" opacity="0.5" />
    <circle cx="32" cy="42" r="1" fill="#86efac" opacity="0.6" />
  </svg>
);

export const CoinIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow / edge */}
    <ellipse cx="33" cy="34" rx="25" ry="25" fill="#a16207" />
    {/* Coin body */}
    <circle cx="32" cy="32" r="25" fill="#eab308" />
    {/* Inner ring */}
    <circle cx="32" cy="32" r="20" fill="none" stroke="#ca8a04" strokeWidth="2" />
    {/* Star emblem */}
    <polygon
      points="32,16 36,26 46,26 38,32 40,42 32,36 24,42 26,32 18,26 28,26"
      fill="#ca8a04"
    />
    {/* Highlight */}
    <path
      d="M18 18Q24 10 36 12"
      stroke="#fde68a"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

export const LeafIcon: React.FC<SymbolIconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Leaf shape */}
    <path
      d="M32 8Q54 14 56 36Q54 56 32 58Q16 52 10 36Q14 14 32 8Z"
      fill="#16a34a"
    />
    {/* Lighter side */}
    <path
      d="M32 8Q54 14 56 36Q54 56 32 58V8Z"
      fill="#22c55e"
      opacity="0.4"
    />
    {/* Center vein */}
    <line x1="32" y1="12" x2="32" y2="54" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    {/* Side veins */}
    <line x1="32" y1="22" x2="22" y2="28" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="22" x2="42" y2="28" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="32" x2="18" y2="38" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="32" x2="46" y2="38" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="42" x2="24" y2="46" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="32" y1="42" x2="40" y2="46" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    {/* Stem */}
    <path
      d="M32 54Q28 58 24 58"
      stroke="#15803d"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
