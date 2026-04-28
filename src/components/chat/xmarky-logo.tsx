'use client';

import { ACCENT } from '@/lib/chat';

export function XmarkyLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke={ACCENT} strokeWidth="2" />
      
      {/* Cat ears */}
      <path d="M25 35L32 12L42 30Z" fill={ACCENT} opacity="0.3" />
      <path d="M75 35L68 12L58 30Z" fill={ACCENT} opacity="0.3" />
      <path d="M28 33L33 16L40 30Z" fill={ACCENT} opacity="0.6" />
      <path d="M72 33L67 16L60 30Z" fill={ACCENT} opacity="0.6" />
      
      {/* Cat face */}
      <ellipse cx="50" cy="52" rx="22" ry="18" fill={ACCENT} opacity="0.15" />
      
      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="4" ry="5" fill={ACCENT} />
      <ellipse cx="60" cy="48" rx="4" ry="5" fill={ACCENT} />
      <ellipse cx="40" cy="48" rx="2" ry="3" fill="#1a1a2e" />
      <ellipse cx="60" cy="48" rx="2" ry="3" fill="#1a1a2e" />
      
      {/* Nose */}
      <path d="M48 55L50 57L52 55Z" fill={ACCENT} opacity="0.8" />
      
      {/* Mouth */}
      <path
        d="M46 59Q50 63 54 59"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      
      {/* Whiskers */}
      <line x1="20" y1="50" x2="36" y2="53" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="56" x2="36" y2="56" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
      <line x1="64" y1="53" x2="80" y2="50" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
      <line x1="64" y1="56" x2="80" y2="56" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
      
      {/* Tail (curving up — the "long" cat) */}
      <path
        d="M72 68Q82 60 80 45Q78 32 72 28"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
