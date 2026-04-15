"use client";

export function MovingCarBackground() {
  return (
    <div
      className="w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 600"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="scene-clip">
            <rect x="0" y="0" width="680" height="600" />
          </clipPath>
        </defs>

        <g clipPath="url(#scene-clip)">

          {/* Grass strip above road */}
          <rect x="0" y="480" width="680" height="35" fill="#7ec850" />

          {/* Road */}
          <rect x="0" y="500" width="680" height="60" fill="#555" />

          {/* Road stripes */}
          <g style={{ animation: "dashes  linear infinite" }}>
            {[0, 100, 200, 300, 400, 500, 600, 700].map((x) => (
              <rect
                key={x}
                x={x}
                y="525"
                width="60"
                height="5"
                fill="white"
                opacity={0.7}
              />
            ))}
          </g>

          {/* Grass below road — fills to bottom */}
          <rect x="0" y="560" width="680" height="40" fill="#7ec850" />
        </g>

        <style>{`
          @keyframes dashes {
            from { transform: translateX(0); }
            to   { transform: translateX(-100px); }
          }
        `}</style>
      </svg>
    </div>
  );
}