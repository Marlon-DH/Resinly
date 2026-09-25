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

        {/* Máscara da lua */}
        <mask id="crescentMask">
          <rect width="64" height="64" fill="white" />

          <circle
            cx="40"
            cy="26"
            r="18"
            fill="black"
          />
        </mask>

        {/* Brilho em formato de estrela */}
        <g id="sparkle">
          <path
            d="
              M 0 -1
              C 0.12 -0.35 0.35 -0.12 1 0
              C 0.35 0.12 0.12 0.35 0 1
              C -0.12 0.35 -0.35 0.12 -1 0
              C -0.35 -0.12 -0.12 -0.35 0 -1
              Z
            "
          />
        </g>
      </defs>

      <g transform="translate(4,4)">
        {/* LUA MINGUANTE */}
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="url(#moonGrad)"
          mask="url(#crescentMask)"
        />

        {/* ESTRELAS / BRILHOS */}
        <g fill="url(#starGrad)">
          {/* Brilho 1 */}
          <use
            href="#sparkle"
            transform="translate(6,6) scale(4)"
          />

          {/* Brilho 2 */}
          <use
            href="#sparkle"
            transform="translate(50,10) scale(3.4)"
          />

          {/* Brilho 3 */}
          <use
            href="#sparkle"
            transform="translate(12,50) scale(3.7)"
          />

          {/* Brilho 4 */}
          <use
            href="#sparkle"
            transform="translate(44,42) scale(3.9)"
          />
        </g>
      </g>
    </svg>
  );
}