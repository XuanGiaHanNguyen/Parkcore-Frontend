"use client";

import { useEffect, useRef } from "react";
import { preloadAllVehicleImages } from "@/app/simulation/roadsystem/lib/vehicleAssets";
import { updateVehicles, drawAllVehicles } from "@/app/simulation/roadsystem/lib/vehicleRenderer";
import { useSimulationSocket } from "@/app/simulation/roadsystem/hooks/useSimulationSocket";

export interface ParkingLotCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

// ─── Layout Constants ───────────────────────────────────────────────────────

const STORE_W = 100;
const SIDEWALK_W = 18;
const PEDROAD_W = 100;
const ROAD_W = 100;
const SPOT_W = 28;
const SPOT_H = 52;
const AISLE_W = 52;
const CENTER_GAP = 8;
const HC_COUNT = 3;
const NUM_PAIRS = 2;

// ─── Colors ─────────────────────────────────────────────────────────────────

const COL = {
  asphalt: "#3b3e42",
  road: "#3b3e42",
  line: "#ffffff",
  yellow: "#fbbf24",
  building: "#d1d5db",
  buildingD: "#9ca3af",
  hcBlue: "#3b82f6",
  hcLight: "#bfdbfe",
  sidewalk: "#e5e7eb",
  crosswalk: "#ffffff",
  stopRed: "#dc2626",
  textDark: "#111827",
  green: "#82ad58",
  red: "#fca5a5",
};

// ─── Derived Geometry ────────────────────────────────────────────────────────

function buildLayout(W: number, H: number) {
  const storeX = 0;
  const storeY = 0;
  const storeH = H;
  const swX = storeX + STORE_W;
  const lotTopMargin = 0;
  const lotBottomMargin = 0;
  const lotY = lotTopMargin;
  const lotH = H + lotTopMargin + lotBottomMargin;
  const pedroadX = swX + SIDEWALK_W;
  const lotX = pedroadX + PEDROAD_W;
  const lotW = W - lotX - ROAD_W;
  const roadX = lotX + lotW;

  const pairH = SPOT_H * 2 + CENTER_GAP;
  const totalRowsH = NUM_PAIRS * pairH + (NUM_PAIRS - 1) * AISLE_W;
  const rowTop = lotY + Math.floor((lotH - totalRowsH) / 2);

  const rowStartX = lotX + 14;
  const rowEndX = lotX + lotW - 14;
  const numSpots = Math.floor((rowEndX - rowStartX) / SPOT_W);

  const entH = 65;

  return {
    storeX, storeY, storeH, swX, pedroadX, lotX, lotY, lotW, lotH,
    roadX, pairH, totalRowsH, rowTop, rowStartX, rowEndX, numSpots, entH,
  };
}

// ─── Draw Helpers ────────────────────────────────────────────────────────────

function drawStore(
  ctx: CanvasRenderingContext2D,
  storeX: number,
  storeY: number,
  storeH: number,
) {
  // Body
  ctx.fillStyle = COL.building;
  ctx.fillRect(storeX, storeY, STORE_W, storeH);

  // Label
  ctx.fillStyle = COL.textDark;
  ctx.font = "bold 12px sans-serif";
  ctx.save();
  ctx.translate(storeX + STORE_W / 2, storeY + storeH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SHOPPING CENTER", 0, 0);
  ctx.restore();
}

function drawPedestrianRoad(
  ctx: CanvasRenderingContext2D,
  pedroadX: number,
  lotY: number,
  lotH: number,
  entH: number,
) {
  // Road surface
  ctx.fillStyle = COL.road;
  ctx.fillRect(pedroadX, lotY, PEDROAD_W, lotH);

  // Dashed center line
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(pedroadX + PEDROAD_W / 2, lotY);
  ctx.lineTo(pedroadX + PEDROAD_W / 2, lotY + lotH);
  ctx.stroke();
  ctx.setLineDash([]);

  drawPedestrianRoadPointers(ctx, pedroadX, lotY, lotH, entH);
}

function drawPedestrianRoadPointers(
  ctx: CanvasRenderingContext2D,
  pedroadX: number,
  lotY: number,
  lotH: number,
  entH: number,
) {
  const topY = lotY + entH / 2;
  const botY = lotY + lotH - entH / 2;
  const leftX = pedroadX + PEDROAD_W * 0.25;
  const rightX = pedroadX + PEDROAD_W * 0.75;

  drawArrow(ctx, leftX, topY, 0);
  drawArrow(ctx, rightX, topY, Math.PI);
  drawArrow(ctx, leftX, botY, 0);
  drawArrow(ctx, rightX, botY, Math.PI);

  const drawLabel = (x: number, y: number, text: string, color: string) => {
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 16);
  };

  drawLabel(leftX, topY, "IN", COL.green);
  drawLabel(rightX, topY, "OUT", COL.red);
  drawLabel(leftX, botY, "IN", COL.green);
  drawLabel(rightX, botY, "OUT", COL.red);
}

function drawEntranceRoad(
  ctx: CanvasRenderingContext2D,
  roadX: number,
  lotY: number,
  lotH: number,
  lotW: number,
  lotX: number,
  entH: number,
) {
  // Road surface
  ctx.fillStyle = COL.road;
  ctx.fillRect(roadX, lotY, ROAD_W, lotH);

  // Center dashed line
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(roadX + ROAD_W / 2, lotY);
  ctx.lineTo(roadX + ROAD_W / 2, lotY + lotH);
  ctx.stroke();
  ctx.setLineDash([]);

  // T-section corridors into lot (top and bottom)
  const topEntY = lotY;
  const botEntY = lotY + lotH - entH;

  // Top green closed rectangle
  ctx.fillStyle = COL.green;
  ctx.fillRect(lotX, topEntY, lotW, entH);
  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lotX, topEntY);
  ctx.lineTo(lotX, topEntY + entH);
  ctx.lineTo(roadX, topEntY + entH);
  ctx.lineTo(roadX, topEntY);
  ctx.closePath();
  ctx.stroke();

  // Bottom green closed rectangle
  ctx.fillStyle = COL.green;
  ctx.fillRect(lotX, botEntY, lotW, entH);
  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(lotX, botEntY);
  ctx.lineTo(lotX, botEntY + entH);
  ctx.lineTo(roadX, botEntY + entH);
  ctx.lineTo(roadX, botEntY);
  ctx.closePath();
  ctx.stroke();

  // Junction vertical lines
  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(roadX, topEntY);
  ctx.lineTo(roadX, topEntY + entH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(roadX, botEntY);
  ctx.lineTo(roadX, lotY + lotH);
  ctx.stroke();

  // IN / OUT arrows and labels — top entrance
  drawArrow(ctx, roadX + ROAD_W * 0.25, topEntY + 30, 0);
  drawArrow(ctx, roadX + ROAD_W * 0.75, topEntY + 30, Math.PI);
  // IN / OUT arrows — bottom entrance
  drawArrow(ctx, roadX + ROAD_W * 0.25, botEntY + 30, 0);
  drawArrow(ctx, roadX + ROAD_W * 0.75, botEntY + 30, Math.PI);

  // Labels
  const labelEntrance = (y: number) => {
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = COL.green;
    ctx.fillText("IN", roadX + ROAD_W * 0.25, y + 4);
    ctx.fillStyle = COL.red;
    ctx.fillText("OUT", roadX + ROAD_W * 0.75, y + 4);
  };
  labelEntrance(topEntY);
  labelEntrance(botEntY);

}

function drawPedestrianAccess(
  ctx: CanvasRenderingContext2D,
  pedroadX: number,
  lotX: number,
  lotY: number,
  lotH: number,
  entH: number,
) {
  const accessWidth = 20;
  const x = lotX;
  const topEntY = lotY;
  const botEntY = lotY + lotH - entH;

  ctx.fillStyle = COL.green;
  ctx.fillRect(x, topEntY, accessWidth, entH);
  ctx.fillRect(x, botEntY, accessWidth, entH);

  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, topEntY);
  ctx.lineTo(x, topEntY + entH);
  ctx.lineTo(x + accessWidth, topEntY + entH);
  ctx.lineTo(x + accessWidth, topEntY);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, botEntY);
  ctx.lineTo(x, botEntY + entH);
  ctx.lineTo(x + accessWidth, botEntY + entH);
  ctx.lineTo(x + accessWidth, botEntY);
  ctx.closePath();
  ctx.stroke();
  
}

function drawParkingSpot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facingDown: boolean,
  isHC: boolean,
) {
  const sy = facingDown ? y : y - SPOT_H;

  if (isHC) {
    ctx.fillStyle = COL.hcBlue;
    ctx.fillRect(x + 1, sy + 1, SPOT_W - 2, SPOT_H - 2);
    ctx.fillStyle = COL.hcLight;
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HC", x + SPOT_W / 2, sy + SPOT_H / 2);
  }

  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, sy);
  ctx.lineTo(x, sy + SPOT_H);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + SPOT_W, sy);
  ctx.lineTo(x + SPOT_W, sy + SPOT_H);
  ctx.stroke();

  if (facingDown) {
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x + SPOT_W, sy);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x, sy + SPOT_H);
    ctx.lineTo(x + SPOT_W, sy + SPOT_H);
    ctx.stroke();
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = COL.yellow;
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(7, 0);
  ctx.lineTo(4, 0);
  ctx.lineTo(4, 11);
  ctx.lineTo(-4, 11);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Solid filled green entrance corridors at top and bottom of the lot.
// Called every rAF frame so they survive the asphalt clear.
function drawEntranceCorridors(
  ctx: CanvasRenderingContext2D,
  layout: ReturnType<typeof buildLayout>,
) {
  const { lotX, lotY, lotW, lotH, entH } = layout;
  const topEntY = lotY;
  const botEntY = lotY + lotH - entH;

  // solid fill — full lot width, full entH height
  ctx.fillStyle = COL.green;
  ctx.fillRect(lotX, topEntY, lotW, entH);
  ctx.fillRect(lotX, botEntY, lotW, entH);
}

function drawParkingRows(
  ctx: CanvasRenderingContext2D,
  layout: ReturnType<typeof buildLayout>,
) {
  const {
    rowTop, rowStartX, rowEndX, numSpots, pairH, lotX, lotY, lotH, entH,
  } = layout;

  for (let pair = 0; pair < NUM_PAIRS; pair++) {
    const topY = rowTop + pair * (pairH + AISLE_W+26)-15;
    const aisleY = topY + SPOT_H + Math.floor(CENTER_GAP / 2);

    for (let i = 0; i < numSpots+1; i++) {
      const sx = rowStartX-5 + i * SPOT_W;
      const isHC = i < HC_COUNT;
      drawParkingSpot(ctx, sx, topY, true, isHC);
      drawParkingSpot(ctx, sx, topY + pairH, false, isHC);
    }

    // Center aisle divider dash
    ctx.strokeStyle = "#9ca3af";
    ctx.strokeStyle = COL.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rowStartX-8, aisleY);
    ctx.lineTo(rowEndX+16, aisleY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
}

function drawExtraParkingRows(
  ctx: CanvasRenderingContext2D,
  layout: ReturnType<typeof buildLayout>,
) {
  const { rowStartX, numSpots, lotY, lotH, entH } = layout;
  const topExtraY = lotY + entH + 4;
  const botExtraY = lotY + lotH - entH - 4;

  for (let i = 0; i < numSpots+1; i++) {
    const sx = rowStartX-5 + i * SPOT_W;
    drawParkingSpot(ctx, sx, topExtraY, true, false);
    drawParkingSpot(ctx, sx, botExtraY, false, false);
  }
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  lotX: number,
  lotY: number,
  lotH: number,
) {
  ctx.fillStyle = COL.hcBlue;
  ctx.fillRect(lotX, lotY + lotH, 16, 12);
  ctx.fillStyle = "#fff";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "HC = Handicapped (closest to store)",
    lotX + 22,
    lotY + lotH - 14,
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ParkingLotCanvas({
  width = 550,
  height = 200,
  className,
}: ParkingLotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number | null>(null);

  // ── WebSocket connection ──────────────────────────────────────────────────
  const { state, status } = useSimulationSocket();

  // ── Preload vehicle images once ───────────────────────────────────────────
  useEffect(() => {
    preloadAllVehicleImages();
  }, []);

  // ── Draw static lot once on mount (original — not modified) ──────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const layout = buildLayout(W, H);
    const {
      storeX, storeY, storeH, swX, pedroadX,
      lotX, lotY, lotW, lotH, roadX, entH,
    } = layout;

    ctx.fillStyle = COL.road;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = COL.sidewalk;
    ctx.fillRect(swX, lotY, SIDEWALK_W, lotH);
    drawPedestrianRoad(ctx, pedroadX, lotY, lotH, entH);
    drawStore(ctx, storeX, storeY, storeH);
    drawEntranceRoad(ctx, roadX, lotY, lotH, lotW, lotX, entH);
    drawPedestrianAccess(ctx, pedroadX, lotX, lotY, lotH, entH);
    drawParkingRows(ctx, layout);
    drawExtraParkingRows(ctx, layout);
    drawLegend(ctx, lotX, lotY, lotH);
  }, [width, height]);

  // ── Feed WS vehicle data into interpolation system ────────────────────────
  useEffect(() => {
    updateVehicles(state.vehicles);
  }, [state.vehicles]);

  // ── rAF loop: clears only the lot interior, redraws markings + vehicles ───
  // Store / sidewalk / pedestrian road / entrance road are never touched.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const layout = buildLayout(canvas.width, canvas.height);
    const { lotX, lotY, lotW, lotH } = layout;

    const loop = () => {
      ctx.clearRect(lotX, lotY, lotW, lotH);          // clear lot area only
      ctx.fillStyle = COL.asphalt;
      ctx.fillRect(lotX, lotY, lotW, lotH);            // restore asphalt
      drawEntranceCorridors(ctx, layout);              // solid green top + bottom corridors
      drawParkingRows(ctx, layout);                    // restore spot markings
      drawExtraParkingRows(ctx, layout);
      drawAllVehicles(ctx);                            // draw live vehicles

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [width, height]);

  // ── JSX: identical to your original, + connection badge only ─────────────
  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        style={{ display: "block", width: "100%", height: "auto" }}
        aria-label="Shopping center parking lot layout"
      />
    </div>
  );
}