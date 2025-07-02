"use client";

export default function LogoAnimated() {
  return (
    <svg
      viewBox="0 0 400 120"
      width="180"
      height="60"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <defs>
        <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec38bc" />
          <stop offset="100%" stopColor="#00c9ff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Órbitas */}
      <g>
        {[0, 60, 120].map((angle, i) => (
          <ellipse
            key={i}
            cx="60"
            cy="60"
            rx="40"
            ry="15"
            stroke="#6ee7ff"
            strokeWidth="1"
            fill="none"
            transform={`rotate(${angle} 60 60)`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${angle} 60 60`}
              to={`${angle + 360} 60 60`}
              dur="8s"
              repeatCount="indefinite"
            />
          </ellipse>
        ))}

        {/* Partículas en las órbitas */}
        {[0, 60, 120].map((angle, i) => (
          <circle
            key={`dot-${i}`}
            r="3"
            fill="#93c5fd"
            transform={`rotate(${angle} 60 60) translate(40 0)`}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${angle} 60 60`}
              to={`${angle + 360} 60 60`}
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* X central con glow */}
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontSize="48"
        fontWeight="bold"
        fill="url(#xGradient)"
        filter="url(#glow)"
      >
        X
      </text>

      {/* Texto marca */}
      <text
        x="130"
        y="72"
        fontSize="32"
        fontFamily="Orbitron, sans-serif"
        fill="#ffffff"
      >
        HIGGZ
      </text>
    </svg>
  );
}
