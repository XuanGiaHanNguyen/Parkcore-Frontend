"use client";

import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Car03Icon } from "@hugeicons/core-free-icons";
import { MovingCarBackground } from "./caranimated";

function HomeContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <main>
            {/* Header — relative + overflow-hidden to contain the animation */}
            <header className="mb-8 mt-6">
              {/* Yellow card below it */}
              <div className="bg-yellow-300 text-primary-foreground border-3 border-b-10 border-r-10 border-black shadow-brutal-xl p-4 sm:p-6">
                <div className="mb-2 flex items-center gap-3">
                  <HugeiconsIcon
                    icon={Car03Icon}
                    className="h-8 w-8"
                    aria-hidden="true"
                  />
                  <h1 className="text-2xl font-bold text-balance sm:text-4xl">
                    Parking Allocation Simulator
                  </h1>
                </div>
                <p className="text-base font-medium sm:text-lg">
                  A real-time parking simulation system featuring intelligent
                  vehicle behavior, collision avoidance, and interactive
                  monitoring.
                </p>
              </div>
            </header>
          </main>
          <Navigation />
        </div>
        <div className="fixed left-0 inset-0 -z-10 pointer-events-none overflow-hidden">
          <MovingCarBackground />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Navigation />
            <div className="border-3 border-black bg-primary p-6 text-primary-foreground shadow-brutal-xl">
              <p className="text-lg font-bold">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
