import React from 'react';
import { useCV } from '../context/CVContext';

interface SuperCVLogoProps {
  className?: string;
  size?: number | string;
  forceTheme?: 'light' | 'dark';
}

export const SuperCVLogo: React.FC<SuperCVLogoProps> = ({ className = 'w-10 h-10', size, forceTheme }) => {
  let contextTheme: 'light' | 'dark' = 'light';
  try {
    const cvContext = useCV();
    contextTheme = cvContext?.theme || 'light';
  } catch {
    // Fallback if rendered outside CVProvider
  }

  const isDark = (forceTheme || contextTheme) === 'dark';

  return (
    <svg
      viewBox="0 0 140 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible transition-all duration-300 ${
        isDark ? 'drop-shadow-[0_0_14px_rgba(52,211,153,0.4)]' : 'drop-shadow-md'
      } ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="سوبر CV لوجو"
    >
      <defs>
        {/* Cape main gradient: vibrant emerald like the bottom aura, luminous in dark mode */}
        <linearGradient id="capeGradEmerald" x1="45" y1="10" x2="135" y2="70" gradientUnits="userSpaceOnUse">
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="85%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#059669" />
              <stop offset="80%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </>
          )}
        </linearGradient>

        {/* Cape fold shadow in rich emerald */}
        <linearGradient id="capeShadowEmerald" x1="70" y1="30" x2="120" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#065f46' : '#047857'} />
          <stop offset="50%" stopColor={isDark ? '#064e3b' : '#065f46'} />
          <stop offset="100%" stopColor={isDark ? '#022c22' : '#022c22'} />
        </linearGradient>

        {/* Cape highlight */}
        <linearGradient id="capeHighlightEmerald" x1="50" y1="12" x2="110" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? '#a7f3d0' : '#6ee7b7'} stopOpacity={isDark ? '0.95' : '0.85'} />
          <stop offset="100%" stopColor={isDark ? '#34d399' : '#10b981'} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* ===================================================================== */}
      {/* 1. BACK CAPE (Flowing to the right with superhero folds in emerald)   */}
      {/* ===================================================================== */}
      <g id="cape-back">
        {/* Main billowing cape silhouette */}
        <path
          d="M 52 14 
             C 65 7, 85 10, 102 24
             C 114 34, 126 42, 137 49
             C 126 53, 116 57, 107 63
             C 118 69, 128 73, 136 78
             C 122 84, 106 88, 92 84
             C 80 81, 74 74, 69 66
             C 66 75, 62 82, 57 88
             L 52 82
             Z"
          fill="url(#capeGradEmerald)"
          stroke={isDark ? '#34d399' : '#064e3b'}
          strokeWidth={isDark ? '3' : '3.5'}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Internal cape creases & folds for dimension */}
        <path
          d="M 72 26 
             C 86 42, 102 54, 124 59"
          stroke={isDark ? '#064e3b' : '#022c22'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 76 35 
             C 89 54, 100 66, 116 73"
          stroke={isDark ? '#047857' : '#064e3b'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 68 48 
             C 76 63, 85 75, 96 82"
          stroke={isDark ? '#064e3b' : '#022c22'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Top fold highlight */}
        <path
          d="M 58 17 
             C 72 13, 94 22, 112 33
             C 123 40, 130 46, 134 48"
          stroke="url(#capeHighlightEmerald)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* ===================================================================== */}
      {/* 2. THE CV DOCUMENT SHEET                                              */}
      {/* ===================================================================== */}
      <g id="document-sheet">
        {/* Main resume paper body (white in dark mode as requested) */}
        <rect
          x="12"
          y="11"
          width="56"
          height="84"
          rx="7"
          ry="7"
          fill="#ffffff"
          stroke={isDark ? '#34d399' : '#0f172a'}
          strokeWidth="3.5"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />

        {/* User avatar circle */}
        <circle cx="31" cy="30" r="10" fill={isDark ? '#ecfdf5' : '#ecfdf5'} />
        {/* User head */}
        <circle cx="31" cy="27.5" r="4" fill="#0f172a" />
        {/* User shoulders / body */}
        <path
          d="M 23.5 37.5 
             C 24 33, 27 32, 31 32 
             C 35 32, 38 33, 38.5 37.5 
             Z"
          fill="#0f172a"
        />

        {/* Header lines next to avatar */}
        <rect x="46" y="25" width="16" height="3.5" rx="1.75" fill="#0f172a" />
        <rect x="46" y="32" width="16" height="3" rx="1.5" fill="#10b981" />

        {/* Thick divider bar */}
        <rect x="18" y="45" width="44" height="3.5" rx="1.75" fill="#0f172a" />

        {/* Body content bars */}
        <rect x="18" y="53" width="44" height="2.8" rx="1.4" fill="#64748b" />
        <rect x="18" y="59.5" width="44" height="2.8" rx="1.4" fill="#64748b" />

        {/* Bullet points & lines */}
        {/* Bullet 1 */}
        <circle cx="20.5" cy="69" r="2.2" fill="#0f172a" />
        <rect x="26.5" y="67.8" width="35.5" height="2.6" rx="1.3" fill="#94a3b8" />

        {/* Bullet 2 */}
        <circle cx="20.5" cy="75.5" r="2.2" fill="#0f172a" />
        <rect x="26.5" y="74.3" width="35.5" height="2.6" rx="1.3" fill="#94a3b8" />

        {/* Bullet 3 */}
        <circle cx="20.5" cy="82" r="2.2" fill="#0f172a" />
        <rect x="26.5" y="80.8" width="26" height="2.6" rx="1.3" fill="#94a3b8" />
      </g>

      {/* ===================================================================== */}
      {/* 3. CAPE COLLAR & SHOULDERS OVER THE DOCUMENT IN EMERALD               */}
      {/* ===================================================================== */}
      <g id="cape-front-collar">
        {/* Left shoulder flap wrapping over corner */}
        <path
          d="M 9 17
             C 8 9, 16 3, 26 8
             C 32 11, 35 16, 27 18
             C 19 20, 11 23, 9 17 
             Z"
          fill="url(#capeGradEmerald)"
          stroke={isDark ? '#34d399' : '#064e3b'}
          strokeWidth={isDark ? '3' : '3.5'}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Right shoulder flap wrapping over top-right */}
        <path
          d="M 33 17
             C 41 8, 59 3, 71 8
             C 77 11, 75 18, 64 19
             C 52 20, 42 22, 33 17 
             Z"
          fill="url(#capeGradEmerald)"
          stroke={isDark ? '#34d399' : '#064e3b'}
          strokeWidth={isDark ? '3' : '3.5'}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Collar creases */}
        <path
          d="M 13 14 C 18 10, 24 11, 28 14"
          stroke={isDark ? '#a7f3d0' : '#34d399'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 40 14 C 49 8, 60 8, 66 12"
          stroke={isDark ? '#a7f3d0' : '#34d399'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
