"use client";

import { Suspense, useState } from "react";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  BrutalCard,
  BrutalCardContent,
  BrutalCardHeader,
  BrutalCardTitle,
} from "@/components/ui/brutal-card";
import { Navigation } from "@/components/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Palette,
  ArrowReloadHorizontalIcon,
  Copy,
  PlayIcon,
  Link as LinkIcon,
  Car03Icon,
  CarParking02Icon,
  ParkingAreaSquareIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import type { SpeedType, DensityType } from "@/lib/types/color";
import { MovingCarBackground } from "./background";
import { ParkingLotCanvas } from "./roadsystem/parkinglot"; // ← new import
import { useSimulationSocket } from "./roadsystem/hooks/useSimulationSocket";

type SimulationInfo = {
  totalVehicles: number;
  parkedVehicles: number;
  spotsLeft: number;
  avgWaitTime: number;
};

function HomeContent() {
  const [speedType, setSpeedType] = useState<SpeedType>("normal");
  const [densityType, setDensityType] = useState<DensityType>("normal");
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const [paletteName, setPaletteName] = useState("");
  const [simulationInfo, setSimulationInfo] = useState<SimulationInfo>({
    totalVehicles: 0,
    parkedVehicles: 0,
    spotsLeft: 0,
    avgWaitTime: 0,
  });
  // ── WebSocket connection ──────────────────────────────────────────────────
  const { state, status } = useSimulationSocket();

  const SpeedOptions: { value: SpeedType; label: string }[] = [
    { value: "slow", label: "Slow" },
    { value: "normal", label: "Normal" },
    { value: "fast", label: "Fast" },
  ];
  const DensityOptions: { value: DensityType; label: string }[] = [
    { value: "sparse", label: "Sparse" },
    { value: "normal", label: "Normal" },
    { value: "heavy", label: "Heavy" },
  ];

  const handleGenerate = () => {
    // TODO: wire up color harmony logic
    setGeneratedColors(["#3b82f6", "#f59e0b", "#22c55e", "#ef4444", "#8b5cf6"]);
  };

  const handleSavePalette = () => {
    // TODO: wire up save logic
  };

  return (
    <div className="bg-background p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        <main>
          <div className="grid lg:grid-cols-7 gap-6 items-start">
            {/* Generated Palette Display */}
            <div className="lg:col-span-5 border-r-5 border-b-5 flex w-full">
              <BrutalCard className="flex-1">
                <BrutalCardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <BrutalCardTitle>
                      Parking Allocation Simulator
                    </BrutalCardTitle>
                    <div className="flex gap-2">
                      <BrutalButton
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                        className={`flex items-center border-b-4 border-r-4 
                          ${status === "CONNECTED"
                            ? "bg-lime-500"
                            : status === "CONNECTING"
                            ? "bg-yellow-500" 
                            : "bg-orange-500 text-white"
                          }`}
                      >
                        
                        <span className="hidden sm:inline">{status}</span>
                      </BrutalButton>
                    </div>
                  </div>
                </BrutalCardHeader>

                {/* ── Parking Lot Canvas ── */}
                <BrutalCardContent className="p-0 overflow-hidden h-[675px]">
                  <ParkingLotCanvas
                    width={1000}
                    height={710}
                    className="w-full h-[700px] block"
                  />
                </BrutalCardContent>
              </BrutalCard>
            </div>
            {/* Generator Controls */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Card 1 */}
              <BrutalCard className="border-r-5 border-b-5">
                <BrutalCardHeader>
                  <BrutalCardTitle>Simulation</BrutalCardTitle>
                </BrutalCardHeader>
                <BrutalCardContent className="space-y-4">
                  {/* Base Color Picker */}
                  <div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <BrutalButton
                        variant="primary"
                        size="md"
                        onClick={handleGenerate}
                        className="bg-yellow-500 w-full col-span-3 border-r-5 border-b-5 hover:border-r-3 hover:border-b-3"
                      >
                        <HugeiconsIcon
                          icon={PlayIcon}
                          strokeWidth={2.5}
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </BrutalButton>
                      <BrutalButton
                        variant="primary"
                        size="md"
                        onClick={handleGenerate}
                        className="w-full bg-orange-500 col-span-1 border-r-5 border-b-5 hover:border-r-3 hover:border-b-3"
                      >
                        <HugeiconsIcon
                          icon={ArrowReloadHorizontalIcon}
                          strokeWidth={2.5}
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </BrutalButton>
                    </div>
                  </div>
                  {/* Speed Buttons */}
                  <div className="space-y-2 pt-1">
                    <label
                      htmlFor="base-color"
                      className="block text-sm font-bold mb-2"
                    >
                      Speed Options
                    </label>
                    <BrutalCardContent>
                      <fieldset className="-m-4">
                        <div
                          className="grid grid-cols-3 gap-2"
                          role="radiogroup"
                          aria-label="Color harmony type"
                        >
                          {SpeedOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              role="radio"
                              aria-checked={speedType === option.value}
                              onClick={() => setSpeedType(option.value)}
                              className={`w-full text-center px-3 py-2 border-3 border-black border-r-5 border-b-5 font-bold ${
                                speedType === option.value
                                  ? `${option.value === "fast" ? "bg-red-400" : option.value === "normal" ? "bg-cyan-500" : "bg-lime-500"} text-accent-foreground shadow-brutal-sm translate-x-0.5 translate-y-0.5`
                                  : "bg-white hover:bg-gray-50 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
                              }`}
                            >
                              <div className="font-bold">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </BrutalCardContent>
                  </div>

                  {/* Density Buttons */}
                  <div className="space-y-2 pt-1">
                    <label
                      htmlFor="base-color"
                      className="block text-sm font-bold mb-2"
                    >
                      Density Options
                    </label>
                    <BrutalCardContent>
                      <fieldset className="-m-4">
                        <div
                          className="grid grid-cols-3 gap-2"
                          role="radiogroup"
                          aria-label="Color harmony type"
                        >
                          {DensityOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              role="radio"
                              aria-checked={densityType === option.value}
                              onClick={() => setDensityType(option.value)}
                              className={`w-full text-center px-3 py-2 border-3 border-black border-r-5 border-b-5 font-bold ${
                                densityType === option.value
                                  ? `${option.value === "heavy" ? "bg-red-400" : option.value === "normal" ? "bg-cyan-500" : "bg-lime-500"} text-accent-foreground shadow-brutal-sm translate-x-0.5 translate-y-0.5`
                                  : "bg-white hover:bg-gray-50 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
                              }`}
                            >
                              <div className="font-bold">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </BrutalCardContent>
                  </div>
                </BrutalCardContent>
              </BrutalCard>

              {/* Card 2 */}
              <BrutalCard className="border-r-5 border-b-5">
                <BrutalCardHeader>
                  <BrutalCardTitle>Information</BrutalCardTitle>
                </BrutalCardHeader>
                <BrutalCardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="w-full rounded border-3 border-black bg-white p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                            <HugeiconsIcon
                              icon={Car03Icon}
                              className="h-5 w-5"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <p className="font-bold">
                              Total vehicle:{" "}
                              {simulationInfo.totalVehicles.toLocaleString()}
                            </p>
                            <p className="text-xs opacity-70">
                              Total number of vehicles
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full rounded border-3 border-black bg-white p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                            <HugeiconsIcon
                              icon={CarParking02Icon}
                              className="h-5 w-5"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <p className="font-bold">
                              Parked vehicle:{" "}
                              {simulationInfo.parkedVehicles.toLocaleString()}
                            </p>
                            <p className="text-xs opacity-70">
                              Number of vehicles parked
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full rounded border-3 border-black bg-white p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                            <HugeiconsIcon
                              icon={ParkingAreaSquareIcon}
                              className="h-5 w-5"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <p className="font-bold">
                              Spot left:{" "}
                              {simulationInfo.spotsLeft.toLocaleString()}
                            </p>
                            <p className="text-xs opacity-70">
                              Remaining spots available
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </BrutalCardContent>
              </BrutalCard>
            </div>
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
