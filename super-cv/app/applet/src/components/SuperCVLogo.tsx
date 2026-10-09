import React from 'react';

interface SuperCVLogoProps {
  className?: string;
  size?: number | string;
}

export const SuperCVLogo: React.FC<SuperCVLogoProps> = ({ className = 'w-10 h-10', size }) => {
  return (
    <svg
      viewBox="0 0 140 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none overflow-visible ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="سوبر CV لوجو"
    >
      <defs>
        {/* Cape main gradient in sleek black */}
        <linearGradient id="capeGrad" x1="45" y1="10" x2="135" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#262626" />
          <stop offset="45%" stopColor="#181818" />
          <stop offset="85%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Cape fold shadow in deep black */}
        <linearGradient id="capeShadow" x1="70" y1="30" x2="120" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#171717" />
          <stop offset="50%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Cape highlight */}
        <linearGradient id="capeHighlight" x1="50" y1="12" x2="110" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4a4a4a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1f1f1f" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ===================================================================== */}
      {/* 1. BACK CAPE (Flowing to the right with superhero cape folds in black) */}
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
          fill="url(#capeGrad)"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Internal cape creases & folds for dimension */}
        <path
          d="M 72 26 
             C 86 42, 102 54, 124 59"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 76 35 
             C 89 54, 100 66, 116 73"
          stroke="#111111"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 68 48 
             C 76 63, 85 75, 96 82"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Top fold highlight */}
        <path
          d="M 58 17 
             C 72 13, 94 22, 112 33
             C 123 40, 130 46, 134 48"
          stroke="url(#capeHighlight)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* ===================================================================== */}
      {/* 2. THE CV DOCUMENT SHEET                                              */}
      {/* ===================================================================== */}
      <g id="document-sheet">
        {/* Main resume paper body */}
        <rect
          x="12"
          y="11"
          width="56"
          height="84"
          rx="7"
          ry="7"
          fill="#d5dbe5"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* User avatar circle */}
        <circle cx="31" cy="30" r="10" fill="#ffffff" />
        {/* User head */}
        <circle cx="31" cy="27.5" r="4" fill="#000000" />
        {/* User shoulders / body */}
        <path
          d="M 23.5 37.5 
             C 24 33, 27 32, 31 32 
             C 35 32, 38 33, 38.5 37.5 
             Z"
          fill="#000000"
        />

        {/* Header lines next to avatar */}
        <rect x="46" y="25" width="16" height="3.5" rx="1.75" fill="#000000" />
        <rect x="46" y="32" width="16" height="3" rx="1.5" fill="#ffffff" />

        {/* Thick divider bar */}
        <rect x="18" y="45" width="44" height="3.5" rx="1.75" fill="#000000" />

        {/* Body content bars (white) */}
        <rect x="18" y="53" width="44" height="2.8" rx="1.4" fill="#ffffff" />
        <rect x="18" y="59.5" width="44" height="2.8" rx="1.4" fill="#ffffff" />

        {/* Bullet points & lines */}
        {/* Bullet 1 */}
        <circle cx="20.5" cy="69" r="2.2" fill="#000000" />
        <rect x="26.5" y="67.8" width="35.5" height="2.6" rx="1.3" fill="#ffffff" />

        {/* Bullet 2 */}
        <circle cx="20.5" cy="75.5" r="2.2" fill="#000000" />
        <rect x="26.5" y="74.3" width="35.5" height="2.6" rx="1.3" fill="#ffffff" />

        {/* Bullet 3 */}
        <circle cx="20.5" cy="82" r="2.2" fill="#000000" />
        <rect x="26.5" y="80.8" width="26" height="2.6" rx="1.3" fill="#ffffff" />
      </g>

      {/* ===================================================================== */}
      {/* 3. CAPE COLLAR & SHOULDERS OVER THE DOCUMENT IN SLEEK BLACK           */}
      {/* ===================================================================== */}
      <g id="cape-front-collar">
        {/* Left shoulder flap wrapping over corner */}
        <path
          d="M 9 17
             C 8 9, 16 3, 26 8
             C 32 11, 35 16, 27 18
             C 19 20, 11 23, 9 17 
             Z"
          fill="url(#capeGrad)"
          stroke="#000000"
          strokeWidth="3.5"
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
          fill="url(#capeGrad)"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Collar creases */}
        <path
          d="M 13 14 C 18 10, 24 11, 28 14"
          stroke="#404040"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 40 14 C 49 8, 60 8, 66 12"
          stroke="#404040"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
