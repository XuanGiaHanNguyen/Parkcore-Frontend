"use client";

import { Suspense, type ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowReloadHorizontalIcon,
  PlayIcon,
  PauseIcon,
  Car03Icon,
  CarParking02Icon,
  ParkingAreaSquareIcon,
} from "@hugeicons/core-free-icons";
import type { SpeedType, DensityType } from "@/lib/types/color";
import { MovingCarBackground } from "./background";
import { ParkingLotCanvas } from "./roadsystem/parkinglot";
import { useSimulationSocket } from "./roadsystem/hooks/useSimulationSocket";

// ─── Small UI pieces (clean panel style to sit alongside the realistic map) ──

function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {aside}
      </header>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-600">{label}</legend>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  tint,
}: {
  icon: typeof Car03Icon;
  label: string;
  value: ReactNode;
  hint: string;
  tint: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tint}`}>
        <HugeiconsIcon icon={icon} className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-lg font-semibold leading-tight text-slate-900 tabular-nums">{value}</p>
        <p className="truncate text-xs text-slate-400">{hint}</p>
      </div>
    </div>
  );
}

const SPEED_OPTIONS: { value: SpeedType; label: string }[] = [
  { value: "slow", label: "Slow" },
  { value: "normal", label: "Normal" },
  { value: "fast", label: "Fast" },
];
const DENSITY_OPTIONS: { value: DensityType; label: string }[] = [
  { value: "sparse", label: "Sparse" },
  { value: "normal", label: "Normal" },
  { value: "heavy", label: "Heavy" },
];

function HomeContent() {
  // ── WebSocket connection (single socket for the whole page) ──────────────
  const { state, status, sendControl } = useSimulationSocket();
  const connected = status === "CONNECTED";

  const statusLabel = connected
    ? state.running ? "Live" : "Paused"
    : status === "CONNECTING" ? "Connecting…" : "Offline";
  const statusDot = connected
    ? state.running ? "bg-emerald-500" : "bg-slate-400"
    : status === "CONNECTING" ? "bg-amber-400 animate-pulse" : "bg-rose-500";

  return (
    <div className="bg-background p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        <main className="grid items-stretch gap-6 lg:grid-cols-7">
          {/* Parking lot map */}
          <Panel
            title="Parking Allocation Simulator"
            className="lg:col-span-5"
            aside={
              <div
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                role="status"
              >
                <span className={`h-2 w-2 rounded-full ${statusDot}`} aria-hidden="true" />
                {statusLabel}
              </div>
            }
          >
            <ParkingLotCanvas
              width={1000}
              height={710}
              className="w-full block"
              vehicles={state.vehicles}
            />
          </Panel>

          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Controls */}
            <Panel title="Simulation">
              <div className="space-y-5 p-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => sendControl({ action: state.running ? "pause" : "play" })}
                    disabled={!connected}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HugeiconsIcon
                      icon={state.running ? PauseIcon : PlayIcon}
                      strokeWidth={2.5}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {state.running ? "Pause" : "Play"}
                  </button>
                  <button
                    type="button"
                    onClick={() => sendControl({ action: "reset" })}
                    disabled={!connected}
                    aria-label="Reset simulation"
                    title="Reset"
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HugeiconsIcon
                      icon={ArrowReloadHorizontalIcon}
                      strokeWidth={2.5}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <Segmented
                  label="Speed"
                  value={state.speed}
                  options={SPEED_OPTIONS}
                  onChange={(speed) => sendControl({ speed })}
                />
                <Segmented
                  label="Traffic density"
                  value={state.density}
                  options={DENSITY_OPTIONS}
                  onChange={(density) => sendControl({ density })}
                />
              </div>
            </Panel>

            {/* Stats — grows so the column matches the map's height */}
            <Panel title="Information" className="flex-1">
              <div className="flex flex-1 flex-col justify-between gap-2 p-5 [&>*]:flex-1">
                <Stat
                  icon={Car03Icon}
                  label="Total vehicles"
                  value={state.vehicleCount.toLocaleString()}
                  hint="In the lot right now"
                  tint="bg-sky-100 text-sky-700"
                />
                <Stat
                  icon={CarParking02Icon}
                  label="Parked"
                  value={state.parkedCount.toLocaleString()}
                  hint={`${state.servedCount.toLocaleString()} parked and left so far`}
                  tint="bg-emerald-100 text-emerald-700"
                />
                <Stat
                  icon={ParkingAreaSquareIcon}
                  label="Spots left"
                  value={
                    <>
                      {state.spotsLeft.toLocaleString()}
                      {state.totalSpots > 0 && (
                        <span className="text-sm font-normal text-slate-400"> / {state.totalSpots}</span>
                      )}
                    </>
                  }
                  hint="Remaining spots available"
                  tint="bg-amber-100 text-amber-700"
                />
              </div>
            </Panel>
          </div>
        </main>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-700">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
