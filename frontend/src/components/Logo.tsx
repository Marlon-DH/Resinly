import React from "react";

export default function Logo({ size = 64 }: { size?: number }) {
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

      <defs>
        <mask id="crescentMask">
          <rect width="64" height="64" fill="white" />
          {/* círculo que vai "cortar" parte da lua */}
          <circle cx="40" cy="26" r="18" fill="black" />
        </mask>

        {/* Forma de estrela (unitária) usada por <use/> e escalada */}
        <polygon
          id="starShape"
          points="0,-1 0.2351,-0.3236 0.9511,-0.3090 0.3804,0.1236 0.5878,0.8090 0,0.4 -0.5878,0.8090 -0.3804,0.1236 -0.9511,-0.3090 -0.2351,-0.3236"
        />
      </defs>

      <g transform="translate(4,4)">
        {/* Lua minguante: desenhada como círculo com máscara para formar crescente */}
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="url(#moonGrad)"
          mask="url(#crescentMask)"
        />

        {/* Estrelas maiores em volta (usar shape unit e escalar) */}
        <g fill="url(#starGrad)">
          <use href="#starShape" transform="translate(6,6) scale(3.6)" />
          <use href="#starShape" transform="translate(50,10) scale(3.0)" />
          <use href="#starShape" transform="translate(12,50) scale(3.2)" />
          <use href="#starShape" transform="translate(44,42) scale(3.4)" />
        </g>
      </g>
    </svg>
  );
}
