"use client";

// Decorative two-lane road with the simulator's car sprites driving across.
// Sprites face right, so westbound cars are flipped.

const EASTBOUND = [
  { src: "/vehicles/blueCar.png", duration: 11, delay: 0 },
  { src: "/vehicles/taxiCar.png", duration: 11, delay: -4 },
  { src: "/vehicles/van.png", duration: 13, delay: -8 },
];

const WESTBOUND = [
  { src: "/vehicles/redCar.png", duration: 10, delay: -2 },
  { src: "/vehicles/police.png", duration: 9, delay: -6 },
  { src: "/vehicles/greenCar.png", duration: 12, delay: -9 },
];

export function MovingCarBackground() {
  return (
    <div className="road-scene relative w-full overflow-hidden" aria-hidden="true">
      {/* Grass verge */}
      <div className="h-5 bg-[#6fa043]" />
      <div className="relative h-28 bg-[#383b40]">
        {/* Curbs */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#c9cdd3]" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#c9cdd3]" />
        {/* Dashed center line, scrolling */}
        <div className="road-dashes absolute inset-x-0 top-1/2 h-1 -translate-y-1/2" />

        {EASTBOUND.map((car) => (
          <img
            key={car.src}
            src={car.src}
            alt=""
            className="road-car road-car-east absolute top-[60%] h-8 w-16"
            style={{ animationDuration: `${car.duration}s`, animationDelay: `${car.delay}s` }}
          />
        ))}
        {WESTBOUND.map((car) => (
          <img
            key={car.src}
            src={car.src}
            alt=""
            className="road-car road-car-west absolute top-[10%] h-8 w-16"
            style={{ animationDuration: `${car.duration}s`, animationDelay: `${car.delay}s` }}
          />
        ))}
      </div>
      <div className="h-10 bg-[#6fa043]" />

      <style>{`
        .road-dashes {
          background-image: linear-gradient(90deg, rgba(255,255,255,0.8) 0 50%, transparent 50% 100%);
          background-size: 80px 100%;
          animation: road-dash 1.2s linear infinite;
        }
        .road-car {
          filter: drop-shadow(2px 3px 0 rgba(0,0,0,0.35));
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .road-car-east { animation-name: drive-east; }
        .road-car-west { animation-name: drive-west; }
        @keyframes road-dash {
          from { background-position-x: 0; }
          to   { background-position-x: -80px; }
        }
        @keyframes drive-east {
          from { left: -80px; }
          to   { left: calc(100% + 80px); }
        }
        @keyframes drive-west {
          from { left: calc(100% + 80px); transform: scaleX(-1); }
          to   { left: -80px; transform: scaleX(-1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .road-dashes, .road-car { animation: none; }
          .road-car { display: none; }
        }
      `}</style>
    </div>
  );
}
