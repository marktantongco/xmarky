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
      <circle cx="50" cy="50" r="48" fill="#1a1a2e" stroke={ACCENT} strokeWidth="2" />
      <path
        d="M30 30L70 70M70 30L30 70"
        stroke={ACCENT}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="38" cy="42" r="4" fill={ACCENT} />
      <circle cx="62" cy="42" r="4" fill={ACCENT} />
      <path
        d="M38 56Q50 66 62 56"
        stroke={ACCENT}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
