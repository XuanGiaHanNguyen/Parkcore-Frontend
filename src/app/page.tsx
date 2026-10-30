"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  GithubIcon,
  Location01Icon,
  SecurityCheckIcon,
  Activity01Icon,
  SlidersHorizontalIcon,
  Login03Icon,
  CarParking02Icon,
  Logout03Icon,
} from "@hugeicons/core-free-icons";
import { Navigation, GITHUB_URL } from "@/components/navigation";
import { MovingCarBackground } from "./caranimated";
import { ParkingLotCanvas } from "./simulation/roadsystem/parkinglot";
import { useSimulationSocket } from "./simulation/roadsystem/hooks/useSimulationSocket";

const FEATURES = [
  {
    icon: Location01Icon,
    title: "Smart allocation",
    body: "Every arriving car is assigned the free stall closest to the store. Handicapped stalls are kept for permit holders.",
    tint: "bg-amber-100 text-amber-700",
  },
  {
    icon: SecurityCheckIcon,
    title: "Collision avoidance",
    body: "Drivers yield to traffic ahead, wait for a gap before backing out, and resolve crossings by right of way.",
    tint: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Activity01Icon,
    title: "Live monitoring",
    body: "The Spring Boot engine streams the whole lot over WebSocket 20 times a second, smoothed to 60fps in the browser.",
    tint: "bg-sky-100 text-sky-700",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Tune the traffic",
    body: "Pause, reset, change the simulation speed or the arrival density and watch occupancy respond.",
    tint: "bg-rose-100 text-rose-700",
  },
];

const STEPS = [
  { icon: Login03Icon, title: "Arrive", body: "Cars enter from the road and are routed down an aisle to their assigned stall." },
  { icon: CarParking02Icon, title: "Park", body: "They pull in nose-first and stay for a while, freeing the aisle for others." },
  { icon: Logout03Icon, title: "Leave", body: "When it's clear they back out, loop around and exit, and the stall opens up." },
];

function LivePreview() {
  const { state, status } = useSimulationSocket();
  const live = status === "CONNECTED";
  const occupancy = state.totalSpots
    ? Math.round(((state.totalSpots - state.spotsLeft) / state.totalSpots) * 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500" role="status">
          <span
            className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`}
            aria-hidden="true"
          />
          {live ? "Live preview" : "Waiting for simulator…"}
        </div>
      </div>
      <ParkingLotCanvas width={1000} height={710} className="w-full block" vehicles={state.vehicles} />
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
        {[
          { label: "Vehicles", value: state.vehicleCount },
          { label: "Parked", value: state.parkedCount },
          { label: "Occupancy", value: `${occupancy}%` },
        ].map((s) => (
          <div key={s.label} className="px-3 py-2.5">
            <p className="text-lg font-semibold tabular-nums text-slate-900">{live ? s.value : "–"}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 md:px-8">
        <Navigation />

        <main>
          {/* Hero */}
          <section className="grid items-center gap-10 pb-6 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Real-time · Spring Boot + Next.js
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-6xl">
                Watch a parking lot{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10">run itself.</span>
                  <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-amber-300/70" aria-hidden="true" />
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                A real-time parking simulator with intelligent vehicle behavior, collision avoidance and live
                monitoring. Cars arrive, find the best stall, park and leave.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/simulation"
                  className="group flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300"
                >
                  Start simulation
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <HugeiconsIcon icon={GithubIcon} className="h-4 w-4" aria-hidden="true" />
                  View on GitHub
                </Link>
              </div>
              <dl className="mt-10 flex gap-8">
                {[
                  { value: "144", label: "parking stalls" },
                  { value: "9", label: "vehicle types" },
                  { value: "20/s", label: "live updates" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl font-bold text-slate-900">{s.value}</dd>
                    <dd className="text-sm text-slate-500">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <LivePreview />
          </section>

          {/* Features */}
          <section className="py-12" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              What&apos;s under the hood
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)]"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.tint}`}>
                    <HugeiconsIcon icon={f.icon} className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      <footer>
        <MovingCarBackground />
      </footer>
    </div>
  );
}
