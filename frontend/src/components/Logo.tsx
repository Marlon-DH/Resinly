import React from "react";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Resinly"
    >
      <defs>
        <linearGradient id="moonGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="starGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff9a2a" />
          <stop offset="100%" stopColor="#ffd54d" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="12" fill="transparent" />

      <g transform="translate(8,8)">
        <circle cx="24" cy="24" r="18" fill="url(#moonGrad)" />
        <path
          d="M34 20c-6 0-10 6-8 11 5-1 11-5 11-11 0-1 0-0 0-0z"
          fill="#ffffff"
          opacity="0.9"
        />

        <g fill="url(#starGrad)">
          <circle cx="6" cy="6" r="1.8" />
          <circle cx="40" cy="8" r="1.2" />
          <circle cx="10" cy="36" r="1.4" />
          <circle cx="36" cy="32" r="1.6" />
        </g>
      </g>
    </svg>
  );
}
