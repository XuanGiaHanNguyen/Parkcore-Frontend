"use client";

import { useEffect, useRef } from "react";

export interface ParkingLotCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

// ─── Layout Constants ───────────────────────────────────────────────────────

const STORE_W = 60;
const SIDEWALK_W = 10;
const PEDROAD_W = 60;
const ROAD_W = 60;
const SPOT_W = 14;
const SPOT_H = 28;
const AISLE_W = 30; // space between back-to-back pairs
const CENTER_GAP = 5; // gap between the two rows of a pair
const HC_COUNT = 3; // handicapped spots per row (closest to store)
const NUM_PAIRS = 4; // 4 pairs = 8 rows total

// ─── Colors ─────────────────────────────────────────────────────────────────

const COL = {
  asphalt: "#374151",
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
  const swX = storeX + STORE_W; // sidewalk X
  const lotTopMargin = 0;
  const lotBottomMargin = 0;
  const lotY = lotTopMargin;
  const lotH = H + lotTopMargin + lotBottomMargin;
  const pedroadX = swX + SIDEWALK_W; // pedestrian road X
  const lotX = pedroadX + PEDROAD_W; // parking lot X
  const lotW = W - lotX - ROAD_W;
  const roadX = lotX + lotW; // entrance road X

  const pairH = SPOT_H * 2 + CENTER_GAP;
  const totalRowsH = NUM_PAIRS * pairH + (NUM_PAIRS - 1) * AISLE_W;
  const rowTop = lotY + Math.floor((lotH - totalRowsH) / 2);

  const rowStartX = lotX + 8;
  const rowEndX = lotX + lotW - 8;
  const numSpots = Math.floor((rowEndX - rowStartX) / SPOT_W);

  const entH = 36; // entrance corridor height (top and bottom)

  return {
    storeX,
    storeY,
    storeH,
    swX,
    pedroadX,
    lotX,
    lotY,
    lotW,
    lotH,
    roadX,
    pairH,
    totalRowsH,
    rowTop,
    rowStartX,
    rowEndX,
    numSpots,
    entH,
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
  ctx.font = "bold 7px sans-serif";
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
  ctx.strokeStyle = COL.yellow;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(pedroadX + PEDROAD_W / 2, lotY);
  ctx.lineTo(pedroadX + PEDROAD_W / 2, lotY + lotH);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label
  ctx.fillStyle = "#6b7280";
  ctx.font = "5px sans-serif";
  ctx.save();
  ctx.translate(pedroadX + PEDROAD_W / 2, lotY + lotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PEDESTRIAN ROAD", 0, 0);
  ctx.restore();

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
    ctx.font = "bold 6px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + 6);
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
  ctx.strokeStyle = COL.yellow;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
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
  ctx.lineWidth = 1.5;
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
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lotX, botEntY);
  ctx.lineTo(lotX, botEntY + entH);
  ctx.lineTo(roadX, botEntY + entH);
  ctx.lineTo(roadX, botEntY);
  ctx.closePath();
  ctx.stroke();

  // Junction vertical lines
  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(roadX, topEntY);
  ctx.lineTo(roadX, topEntY + entH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(roadX, botEntY);
  ctx.lineTo(roadX, lotY + lotH);
  ctx.stroke();

  // IN / OUT arrows and labels — top entrance
  drawArrow(ctx, roadX + ROAD_W * 0.25, topEntY + 18, 0);
  drawArrow(ctx, roadX + ROAD_W * 0.75, topEntY + 18, Math.PI);
  // IN / OUT arrows — bottom entrance
  drawArrow(ctx, roadX + ROAD_W * 0.25, botEntY + 18, 0);
  drawArrow(ctx, roadX + ROAD_W * 0.75, botEntY + 18, Math.PI);

  // Labels
  const labelEntrance = (y: number) => {
    ctx.font = "bold 6px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = COL.green;
    ctx.fillText("IN", roadX + ROAD_W * 0.25, y + 2);
    ctx.fillStyle = COL.red;
    ctx.fillText("OUT", roadX + ROAD_W * 0.75, y + 2);
  };
  labelEntrance(topEntY);
  labelEntrance(botEntY);

  // Road label
  ctx.fillStyle = COL.yellow;
  ctx.font = "bold 6px sans-serif";
  ctx.save();
  ctx.translate(roadX + ROAD_W / 2, lotY + lotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ENTRANCE / EXIT ROAD", 0, 0);
  ctx.restore();
}

function drawPedestrianAccess(
  ctx: CanvasRenderingContext2D,
  pedroadX: number,
  lotX: number,
  lotY: number,
  lotH: number,
  entH: number,
) {
  const accessWidth = 12;
  const x = lotX;
  const topEntY = lotY;
  const botEntY = lotY + lotH - entH;

  ctx.fillStyle = COL.green;
  ctx.fillRect(x, topEntY, accessWidth, entH);
  ctx.fillRect(x, botEntY, accessWidth, entH);

  ctx.strokeStyle = COL.green;
  ctx.lineWidth = 1.5;
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
    ctx.font = "bold 5px sans-serif";
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

function drawStopSign(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = COL.stopRed;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 8;
    const px = x + 6 * Math.cos(a);
    const py = y + 6 * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 3px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("STOP", x, y);
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
  ctx.moveTo(0, -7);
  ctx.lineTo(4, 0);
  ctx.lineTo(2, 0);
  ctx.lineTo(2, 6);
  ctx.lineTo(-2, 6);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawParkingRows(
  ctx: CanvasRenderingContext2D,
  layout: ReturnType<typeof buildLayout>,
) {
  const {
    rowTop,
    rowStartX,
    rowEndX,
    numSpots,
    pairH,
    lotX,
    lotY,
    lotH,
    entH,
  } = layout;

  for (let pair = 0; pair < NUM_PAIRS; pair++) {
    const topY = rowTop + pair * (pairH + AISLE_W);
    const aisleY = topY + SPOT_H + Math.floor(CENTER_GAP / 2);

    for (let i = 0; i < numSpots; i++) {
      const sx = rowStartX + i * SPOT_W;
      const isHC = i < HC_COUNT;

      // Top row of pair: opens downward toward aisle
      drawParkingSpot(ctx, sx, topY, true, isHC);
      // Bottom row of pair: opens upward toward aisle
      drawParkingSpot(ctx, sx, topY + pairH, false, isHC);
    }

    // Center aisle divider dash
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(rowStartX, aisleY);
    ctx.lineTo(rowEndX, aisleY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Traffic arrows and stop signs in the between-pair aisles
    if (pair < NUM_PAIRS - 1) {
      const betweenY = topY + pairH + AISLE_W / 2;
      const dir = pair % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;

      drawArrow(ctx, rowStartX + (rowEndX - rowStartX) * 0.25, betweenY, dir);
      drawArrow(ctx, rowStartX + (rowEndX - rowStartX) * 0.75, betweenY, -dir);
      drawStopSign(ctx, rowStartX - 8, betweenY);
      drawStopSign(ctx, rowEndX + 8, betweenY);
    }
  }

  // Stop signs at T-junctions
  const { lotX: lx, roadX } = layout;
  const topEntY = lotY;
  const botEntY = lotY + lotH - entH;
  drawStopSign(ctx, lx + 20, topEntY + entH - 10);
  drawStopSign(ctx, lx + 20, botEntY + 10);
  drawStopSign(ctx, roadX - 10, topEntY + entH - 10);
  drawStopSign(ctx, roadX - 10, botEntY + 10);
}

function drawExtraParkingRows(
  ctx: CanvasRenderingContext2D,
  layout: ReturnType<typeof buildLayout>,
) {
  const { rowStartX, numSpots, lotY, lotH, entH } = layout;
  const topExtraY = lotY + entH + 4;
  const botExtraY = lotY + lotH - entH - 4;

  for (let i = 0; i < numSpots; i++) {
    const sx = rowStartX + i * SPOT_W;
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
  ctx.fillRect(lotX, lotY + lotH, 10, 8);
  ctx.fillStyle = "#fff";
  ctx.font = "5px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "HC = Handicapped (closest to store)",
    lotX + 26,
    lotY + lotH - 10,
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ParkingLotCanvas({
  width = 550,
  height = 200,
  className,
}: ParkingLotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const layout = buildLayout(W, H);
    const {
      storeX,
      storeY,
      storeH,
      swX,
      pedroadX,
      lotX,
      lotY,
      lotW,
      lotH,
      roadX,
      entH,
    } = layout;

    // ── Base ──
    ctx.fillStyle = COL.road;
    ctx.fillRect(0, 0, W, H);

    // ── Sidewalk ──
    ctx.fillStyle = COL.sidewalk;
    ctx.fillRect(swX, lotY, SIDEWALK_W, lotH);

    // ── Pedestrian road ──
    drawPedestrianRoad(ctx, pedroadX, lotY, lotH, entH);

    // ── Store ──
    drawStore(ctx, storeX, storeY, storeH);

    // ── Entrance road + T-sections ──
    drawEntranceRoad(ctx, roadX, lotY, lotH, lotW, lotX, entH);

    // ── Pedestrian access from the store side ──
    drawPedestrianAccess(ctx, pedroadX, lotX, lotY, lotH, entH);

    // ── Parking rows (8 rows = 4 back-to-back pairs) ──
    drawParkingRows(ctx, layout);

    // ── Extra parking rows next to the green access areas ──
    drawExtraParkingRows(ctx, layout);

    // ── Legend ──
    drawLegend(ctx, lotX, lotY, lotH);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
      aria-label="Shopping center parking lot layout"
    />
  );
}
