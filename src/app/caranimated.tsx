"use client";

export function MovingCarBackground() {
  return (
    <div
      className="w-full overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ height: "425px" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 300"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="scene-clip">
            <rect x="0" y="0" width="680" height="280" />
          </clipPath>
        </defs>

        <g clipPath="url(#scene-clip)">
          <rect x="0" y="140" width="680" height="180" fill="#7ec850" />
          <rect x="0" y="158" width="680" height="78" fill="#555" />
          <rect x="0" y="158" width="680" height="5" fill="#555" />
          <rect x="0" y="207" width="680" height="50" fill="#555" />
          <rect x="0" y="215" width="680" height="180" fill="#7ec850" />

          <g style={{ animation: "dashes  linear infinite" }}>
            {[0, 100, 200, 300, 400, 500, 600, 700].map((x) => (
              <rect
                key={x}
                x={x}
                y="182"
                width="60"
                height="5"
                fill="white"
                opacity={0.7}
              />
            ))}
          </g>
        </g>

        <style>{`
          @keyframes drive {
            from { transform: translateX(-140px); }
            to   { transform: translateX(820px); }
          }
          @keyframes dashes {
            from { transform: translateX(0); }
            to   { transform: translateX(-100px); }
          }
          @keyframes cloudmove1 {
            from { transform: translateX(0); }
            to   { transform: translateX(-800px); }
          }
          @keyframes cloudmove2 {
            from { transform: translateX(0); }
            to   { transform: translateX(-900px); }
          }
        `}</style>
      </svg>
    </div>
  );
}
