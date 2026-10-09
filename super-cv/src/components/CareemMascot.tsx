import React from 'react';

/**
 * CareemAvatar: Mini robot avatar with headphones and green C logo for chat bubbles & headers
 */
export const CareemAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'text-[18px]' : size === 'lg' ? 'text-[32px]' : 'text-[22px]';
  const badgeDim = size === 'sm' ? 'w-3.5 h-3.5 text-[8px]' : size === 'lg' ? 'w-5 h-5 text-[10px]' : 'w-4 h-4 text-[9px]';

  return (
    <div
      className={`relative ${dim} rounded-2xl bg-gradient-to-b from-[#00d285] to-[#00a86b] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0 ${className}`}
    >
      {/* Robot Face Graphic */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[85%] h-[85%]"
      >
        {/* Antenna */}
        <circle cx="32" cy="7" r="4" fill="#00e599" />
        <rect x="30.5" y="9" width="3" height="6" rx="1.5" fill="#e2e8f0" />

        {/* Headphones band */}
        <path
          d="M12 28 C12 16, 52 16, 52 28"
          stroke="#00e599"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Head Base */}
        <rect x="14" y="16" width="36" height="30" rx="15" fill="#ffffff" />

        {/* Screen / Visor */}
        <rect x="18" y="21" width="28" height="20" rx="9" fill="#0d1b2a" />

        {/* Cheerful Cyan Digital Eyes ^ ^ */}
        <path
          d="M23 31 C24 28, 27 28, 28 31"
          stroke="#00f5d4"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M36 31 C37 28, 40 28, 41 31"
          stroke="#00f5d4"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Headphones Earcups */}
        <rect x="9" y="24" width="7" height="15" rx="3.5" fill="#00b875" />
        <circle cx="12.5" cy="31.5" r="2" fill="#00f5d4" />
        <rect x="48" y="24" width="7" height="15" rx="3.5" fill="#00b875" />
        <circle cx="51.5" cy="31.5" r="2" fill="#00f5d4" />

        {/* Body Peek */}
        <path
          d="M22 47 C22 45, 42 45, 42 47 L46 58 C46 60, 18 60, 18 58 Z"
          fill="#f1f5f9"
        />
        {/* Green C badge */}
        <circle cx="32" cy="53" r="5" fill="#00c875" />
        <text
          x="32"
          y="56"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="7"
          fontWeight="900"
          fontFamily="system-ui"
        >
          C
        </text>
      </svg>

      {/* Online indicator dot */}
      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
    </div>
  );
};

/**
 * CareemMascotCard: Hero 3D-styled Mascot Illustration matching uploaded mockups
 */
export const CareemMascotCard: React.FC<{
  onSelectPrompt?: (prompt: string) => void;
  className?: string;
}> = ({ onSelectPrompt, className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble: "أنا Careem جاهز أساعدك!" */}
      <div className="relative mb-3 animate-bounce shadow-md">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
          <span>أنا Careem جاهز أساعدك!</span>
          <span className="text-base">👋</span>
        </div>
      </div>

      {/* Vector 3D-Style Robot Mascot Scene */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Soft glowing ambient circle */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/70 to-teal-100/40 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-full blur-xl transform scale-90"></div>

        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-xl"
        >
          {/* Desk surface */}
          <ellipse cx="120" cy="210" rx="95" ry="18" fill="#e2e8f0" opacity="0.6" />

          {/* Plant on left */}
          <rect x="30" y="180" width="16" height="18" rx="4" fill="#cbd5e1" />
          <path d="M38 180 C30 165, 20 160, 22 150 C30 155, 36 165, 38 180 Z" fill="#22c55e" />
          <path d="M38 180 C44 162, 54 158, 52 148 C44 154, 40 166, 38 180 Z" fill="#16a34a" />
          <path d="M38 180 C36 155, 38 140, 38 135 C42 145, 42 165, 38 180 Z" fill="#4ade80" />

          {/* Books Stack (Learn, Grow, Achieve) */}
          {/* Blue Book - Learn */}
          <rect x="25" y="196" width="38" height="9" rx="3" fill="#2563eb" />
          <text x="44" y="202.5" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
            Learn
          </text>
          {/* Green Book - Grow */}
          <rect x="23" y="187" width="40" height="9" rx="3" fill="#16a34a" />
          <text x="43" y="193.5" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
            Grow
          </text>
          {/* Purple Book - Achieve */}
          <rect x="21" y="178" width="42" height="9" rx="3" fill="#8b5cf6" />
          <text x="42" y="184.5" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
            Achieve
          </text>

          {/* Coffee Mug with C */}
          <rect x="180" y="182" width="22" height="22" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M202 187 C208 187, 208 197, 202 197" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
          <circle cx="191" cy="193" r="4.5" fill="#00b875" />
          <text x="191" y="195.5" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
            C
          </text>
          {/* Steam */}
          <path d="M188 176 C186 172, 189 170, 187 166" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <path d="M194 175 C192 171, 195 168, 193 164" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

          {/* Robot Body */}
          <rect x="88" y="132" width="64" height="60" rx="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          {/* Robot Green Chest Badge with "C" */}
          <circle cx="120" cy="155" r="14" fill="#00d285" />
          <circle cx="120" cy="155" r="10" fill="#00b875" />
          <text x="120" y="162" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            C
          </text>

          {/* Robot Arms & Hands */}
          {/* Left arm resting on laptop */}
          <path d="M88 148 C75 160, 85 185, 105 188" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
          {/* Right waving arm */}
          <path d="M152 148 C168 140, 182 120, 178 105" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
          {/* Right hand waving */}
          <circle cx="178" cy="102" r="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

          {/* Laptop */}
          <polygon points="98,185 146,185 154,206 90,206" fill="#94a3b8" />
          <polygon points="102,187 142,187 148,204 96,204" fill="#334155" />
          {/* Laptop Screen back tilted */}
          <rect x="105" y="145" width="46" height="40" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(-6 105 145)" />
          <circle cx="128" cy="165" r="6" fill="#00d285" transform="rotate(-6 128 165)" />
          <text x="128" y="168" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(-6 128 168)">
            C
          </text>

          {/* Robot Head */}
          <g>
            {/* Headphones band */}
            <path d="M72 75 C72 40, 168 40, 168 75" stroke="#00e599" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M76 75 C76 44, 164 44, 164 75" stroke="#00b875" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Top antenna */}
            <circle cx="120" cy="32" r="7" fill="#00f5d4" stroke="#00b875" strokeWidth="2" />
            <rect x="117.5" y="37" width="5" height="12" rx="2" fill="#cbd5e1" />

            {/* Head outer shell */}
            <rect x="76" y="48" width="88" height="74" rx="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" />

            {/* Screen / Visor */}
            <rect x="85" y="60" width="70" height="48" rx="22" fill="#0a192f" />

            {/* Glowing Digital Cyan Eyes ^ ^ */}
            <path d="M96 82 C99 74, 107 74, 110 82" stroke="#00f5d4" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M130 82 C133 74, 141 74, 144 82" stroke="#00f5d4" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Cute blushes */}
            <ellipse cx="94" cy="95" rx="5" ry="2.5" fill="#00e599" opacity="0.4" />
            <ellipse cx="146" cy="95" rx="5" ry="2.5" fill="#00e599" opacity="0.4" />

            {/* Headphones Earcups */}
            <rect x="64" y="66" width="16" height="36" rx="8" fill="#00b875" />
            <rect x="68" y="72" width="8" height="24" rx="4" fill="#00f5d4" />
            <rect x="160" y="66" width="16" height="36" rx="8" fill="#00b875" />
            <rect x="164" y="72" width="8" height="24" rx="4" fill="#00f5d4" />
          </g>
        </svg>
      </div>

      {/* "Your Career Partner" handwritten doodle underline */}
      <div className="flex flex-col items-center mt-2">
        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-wide font-mono">
          Your Career Partner
        </span>
        <svg className="w-28 h-2 text-emerald-500" viewBox="0 0 100 8" fill="none">
          <path d="M2 5 C 25 1, 75 7, 98 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
