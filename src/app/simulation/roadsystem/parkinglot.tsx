"use client";

import { useEffect, useRef } from "react";
import { preloadAllVehicleImages } from "@/app/simulation/roadsystem/lib/vehicleAssets";
import {
  updateVehicles,
  drawAllVehicles,
  type Vehicle,
} from "@/app/simulation/roadsystem/lib/vehicleRenderer";

export interface ParkingLotCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  vehicles: Vehicle[];
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
// Realistic textures with the app's accent colors and hard (unblurred) shadows.

const COL = {
  ink: "#000000",
  cream: "#fffdf0",      // --background
  asphalt: "#383b40",
  asphaltLight: "#45494f",
  asphaltDark: "#2c2f33",
  line: "#f3f4f6",
  lineFaint: "rgba(243,244,246,0.35)",
  yellow: "#facc15",     // yellow-400
  orange: "#f97316",     // orange-500
  cyan: "#06b6d4",       // cyan-500
  blue: "#2f6fec",       // --primary
  roof: "#c4c9d0",
  roofDark: "#a7adb6",
  sidewalk: "#dcdfe3",
  sidewalkJoint: "#c3c7cc",
  curb: "#c9cdd3",
  curbShadow: "#8e949c",
  grass: "#6fa043",
  grassDark: "#5c8a36",
  treeDark: "#2f6b2a",
  treeMid: "#3f8a36",
  treeLight: "#5fae4d",
  shrub: "#4c8f3c",
  flower: "#f9a8d4",
  mulch: "#7c5a3c",
  lime: "#84cc16",       // lime-500
  red: "#f87171",        // red-400
  white: "#ffffff",
};

const SHADOW = 3; // hard shadow offset, like shadow-brutal
const SHADOW_COL = "rgba(0,0,0,0.45)";

// ─── Derived Geometry ────────────────────────────────────────────────────────
// Must stay in sync with backend model/ParkingLot.java

function buildLayout(W: number, H: number) {
  const storeX = 0;
  const storeY = 0;
  const storeH = H;
  const swX = storeX + STORE_W;
  const lotY = 0;
  const lotH = H;
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

  // Stall rows, top to bottom. opensDown = the open end faces the aisle below.
  const rows: { top: number; opensDown: boolean; hc: boolean }[] = [
    { top: lotY + entH + 4, opensDown: true, hc: false },
  ];
  for (let pair = 0; pair < NUM_PAIRS; pair++) {
    const topY = rowTop + pair * (pairH + AISLE_W + 26) - 15;
    rows.push({ top: topY, opensDown: false, hc: true });
    rows.push({ top: topY + pairH - SPOT_H, opensDown: true, hc: true });
  }
  rows.push({ top: lotY + lotH - entH - 4 - SPOT_H, opensDown: false, hc: false });

  // Aisles sit between rows 0-1, 2-3, 4-5
  const aisles: { top: number; bottom: number; center: number }[] = [];
  for (let r = 0; r < rows.length; r += 2) {
    const top = rows[r].top + SPOT_H;
    const bottom = rows[r + 1].top;
    aisles.push({ top, bottom, center: (top + bottom) / 2 });
  }

  // Back-to-back row pairs share a narrow median
  const medians = [1, 3].map((r) => ({
    top: rows[r].top + SPOT_H,
    bottom: rows[r + 1].top,
  }));

  return {
    storeX, storeY, storeH, swX, pedroadX, lotX, lotY, lotW, lotH,
    roadX, pairH, totalRowsH, rowTop, rowStartX, rowEndX, numSpots, entH,
    rows, aisles, medians,
  };
}

type Layout = ReturnType<typeof buildLayout>;

// Deterministic randomness so the scenery looks the same on every render
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Draw Helpers ────────────────────────────────────────────────────────────

// Box with a hard offset shadow and flat fill (optional outline)
function outlinedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  { shadow = SHADOW, outline = 0, radius = 0 } = {},
) {
  if (shadow > 0) {
    ctx.fillStyle = SHADOW_COL;
    ctx.beginPath();
    ctx.roundRect(x + shadow, y + shadow, w, h, radius);
    ctx.fill();
  }
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  if (outline > 0) {
    ctx.strokeStyle = COL.ink;
    ctx.lineWidth = outline;
    ctx.stroke();
  }
}

function drawAsphalt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
) {
  ctx.fillStyle = COL.asphalt;
  ctx.fillRect(x, y, w, h);

  // Fine aggregate speckle
  const rand = seededRandom(seed);
  const count = Math.floor((w * h) / 90);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = rand() > 0.5 ? COL.asphaltLight : COL.asphaltDark;
    ctx.globalAlpha = 0.35 + rand() * 0.4;
    ctx.fillRect(x + rand() * w, y + rand() * h, 1.2, 1.2);
  }
  ctx.globalAlpha = 1;
}

function drawStore(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { storeX, storeY, storeH, aisles } = layout;
  const roofW = STORE_W - 12; // leave room for the awning

  // Roof with panel seams
  ctx.fillStyle = COL.roof;
  ctx.fillRect(storeX, storeY, roofW, storeH);
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  for (let y = storeY + 24; y < storeY + storeH; y += 24) {
    ctx.beginPath();
    ctx.moveTo(storeX, y);
    ctx.lineTo(storeX + roofW, y);
    ctx.stroke();
  }

  // Rooftop units
  for (const uy of [70, 140, 560, 630]) {
    outlinedRect(ctx, storeX + 14, uy, 26, 20, "#e5e7eb");
    ctx.strokeStyle = COL.roofDark;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(storeX + 27, uy + 10, 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Striped awning along the storefront
  const awningX = storeX + roofW;
  for (let y = storeY, i = 0; y < storeY + storeH; y += 10, i++) {
    ctx.fillStyle = i % 2 === 0 ? COL.orange : COL.cream;
    ctx.fillRect(awningX, y, 12, 10);
  }

  // Awning shade line
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(awningX, storeY, 2, storeH);

  // Doors facing each aisle
  for (const a of aisles) {
    ctx.fillStyle = "#374151";
    ctx.fillRect(awningX, a.center - 20, 12, 40);
    ctx.fillStyle = COL.cyan;
    ctx.fillRect(awningX + 3, a.center - 18, 7, 17);
    ctx.fillRect(awningX + 3, a.center + 1, 7, 17);
  }

  // Rooftop lettering, painted on like real roof signage
  ctx.save();
  ctx.translate(storeX + roofW / 2, storeY + storeH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = "bold 15px sans-serif";
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("SHOPPING CENTER", 1, 1);
  ctx.fillStyle = "#4b5563";
  ctx.fillText("SHOPPING CENTER", 0, 0);
  ctx.restore();
}

function drawSidewalk(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { swX, lotY, lotH } = layout;
  ctx.fillStyle = COL.sidewalk;
  ctx.fillRect(swX, lotY, SIDEWALK_W, lotH);

  // Expansion joints
  ctx.strokeStyle = COL.sidewalkJoint;
  ctx.lineWidth = 1;
  for (let y = lotY + SIDEWALK_W; y < lotY + lotH; y += SIDEWALK_W) {
    ctx.beginPath();
    ctx.moveTo(swX, y + 0.5);
    ctx.lineTo(swX + SIDEWALK_W, y + 0.5);
    ctx.stroke();
  }

  // Curb on the road side
  ctx.fillStyle = COL.curbShadow;
  ctx.fillRect(swX + SIDEWALK_W - 3, lotY, 3, lotH);
}

function drawCrosswalk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
) {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let sx = x + 4; sx < x + w - 4; sx += 10) {
    ctx.fillRect(sx, y - 9, 5, 18);
  }
}

function drawPedestrianRoad(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { pedroadX, lotY, lotH, entH, medians } = layout;
  drawAsphalt(ctx, pedroadX, lotY, PEDROAD_W, lotH, 11);

  // Dashed center line
  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(pedroadX + PEDROAD_W / 2, lotY);
  ctx.lineTo(pedroadX + PEDROAD_W / 2, lotY + lotH);
  ctx.stroke();
  ctx.setLineDash([]);

  // Crosswalks from the store to the lot (at the medians and the planters)
  const walkYs = [
    lotY + entH / 2,
    ...medians.map((m) => (m.top + m.bottom) / 2),
    lotY + lotH - entH / 2,
  ];
  for (const y of walkYs) drawCrosswalk(ctx, pedroadX, y, PEDROAD_W);

  // IN / OUT pointers
  const topY = lotY + entH + 30;
  const botY = lotY + lotH - entH - 30;
  const leftX = pedroadX + PEDROAD_W * 0.25;
  const rightX = pedroadX + PEDROAD_W * 0.75;
  for (const y of [topY, botY]) {
    drawArrow(ctx, leftX, y, 0);
    drawArrow(ctx, rightX, y, Math.PI);
    drawLaneLabel(ctx, leftX, y + 16, "IN", COL.lime);
    drawLaneLabel(ctx, rightX, y + 16, "OUT", COL.red);
  }
}

function drawEntranceRoad(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { roadX, lotY, lotH, entH } = layout;
  drawAsphalt(ctx, roadX, lotY, ROAD_W, lotH, 23);

  // Double yellow center line
  ctx.strokeStyle = COL.yellow;
  ctx.lineWidth = 2;
  for (const dx of [-2.5, 2.5]) {
    ctx.beginPath();
    ctx.moveTo(roadX + ROAD_W / 2 + dx, lotY);
    ctx.lineTo(roadX + ROAD_W / 2 + dx, lotY + lotH);
    ctx.stroke();
  }

  // Edge line on the far side
  ctx.strokeStyle = COL.lineFaint;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(roadX + ROAD_W - 5, lotY);
  ctx.lineTo(roadX + ROAD_W - 5, lotY + lotH);
  ctx.stroke();

  // IN / OUT arrows and labels
  for (const y of [lotY + 6, lotY + lotH - entH + 4]) {
    drawLaneLabel(ctx, roadX + ROAD_W * 0.25, y, "IN", COL.lime);
    drawLaneLabel(ctx, roadX + ROAD_W * 0.75, y, "OUT", COL.red);
    drawArrow(ctx, roadX + ROAD_W * 0.25, y + 30, 0);
    drawArrow(ctx, roadX + ROAD_W * 0.75, y + 30, Math.PI);
  }
}

function drawLaneLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
) {
  ctx.font = "bold 10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number,
  color: string = COL.yellow,
  scale = 1,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(7, 0);
  ctx.lineTo(4, 0);
  ctx.lineTo(4, 11);
  ctx.lineTo(-4, 11);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-7, 0);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Hard shadow
  ctx.fillStyle = SHADOW_COL;
  ctx.beginPath();
  ctx.arc(x + SHADOW, y + SHADOW, r, 0, Math.PI * 2);
  ctx.fill();

  // Shaded canopy
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, COL.treeLight);
  g.addColorStop(0.6, COL.treeMid);
  g.addColorStop(1, COL.treeDark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Leaf clusters
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShrub(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  flowers: boolean,
) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.arc(x + 1.5, y + 1.5, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COL.shrub;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (flowers) {
    ctx.fillStyle = COL.flower;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.6;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Landscaped planter strips along the top and bottom of the lot
function drawPlanter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
) {
  const gx = x + 2;
  const gy = y + 4;
  const gw = w - 6;
  const gh = h - 10;
  outlinedRect(ctx, gx - 3, gy - 3, gw + 6, gh + 6, COL.curb, { radius: 6 });
  outlinedRect(ctx, gx, gy, gw, gh, COL.grass, { shadow: 0, radius: 4 });

  // Grass texture
  const rand = seededRandom(seed);
  ctx.strokeStyle = COL.grassDark;
  ctx.lineWidth = 1;
  for (let i = 0; i < (gw * gh) / 40; i++) {
    const px = gx + 3 + rand() * (gw - 6);
    const py = gy + 4 + rand() * (gh - 7);
    ctx.globalAlpha = 0.3 + rand() * 0.3;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + (rand() - 0.5) * 2, py - 2.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Mulch bed with shrubs, trees spaced evenly
  const midY = gy + gh / 2;
  ctx.fillStyle = COL.mulch;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.roundRect(gx + 14, midY - 7, gw - 28, 14, 7);
  ctx.fill();
  ctx.globalAlpha = 1;

  for (let sx = gx + 30; sx < gx + gw - 20; sx += 22) {
    drawShrub(ctx, sx + (rand() - 0.5) * 4, midY + (rand() - 0.5) * 3, 5 + rand() * 2, rand() > 0.6);
  }
  for (let tx = gx + 45; tx < gx + gw - 20; tx += 110) {
    drawTree(ctx, tx + (rand() - 0.5) * 16, midY + (rand() - 0.5) * 6, 16 + rand() * 4);
  }
}

function drawHandicapSymbol(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = COL.white;
  ctx.fillStyle = COL.white;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.arc(-1, -6.5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-1, -3.5);
  ctx.lineTo(-1, 1.5);
  ctx.lineTo(3.5, 1.5);
  ctx.lineTo(5.5, 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-2, 3.5, 4.5, Math.PI * 0.15, Math.PI * 1.35);
  ctx.stroke();
  ctx.restore();
}

function drawParkingSpot(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  opensDown: boolean,
  isHC: boolean,
) {
  if (isHC) {
    ctx.fillStyle = COL.blue;
    ctx.fillRect(x, top, SPOT_W, SPOT_H);
    drawHandicapSymbol(ctx, x + SPOT_W / 2, top + SPOT_H / 2);
  }

  ctx.strokeStyle = COL.line;
  ctx.lineWidth = 2;
  ctx.lineCap = "butt";
  const backY = opensDown ? top : top + SPOT_H;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x, top + SPOT_H);
  ctx.moveTo(x + SPOT_W, top);
  ctx.lineTo(x + SPOT_W, top + SPOT_H);
  ctx.moveTo(x, backY);
  ctx.lineTo(x + SPOT_W, backY);
  ctx.stroke();

  // Wheel stop near the back
  ctx.fillStyle = "#a1a1aa";
  const stopY = opensDown ? top + 5 : top + SPOT_H - 8;
  ctx.fillRect(x + 6, stopY, SPOT_W - 12, 3);
}

function drawParkingRows(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { rows, rowStartX, numSpots } = layout;
  for (const row of rows) {
    for (let i = 0; i < numSpots + 1; i++) {
      const sx = rowStartX - 5 + i * SPOT_W;
      drawParkingSpot(ctx, sx, row.top, row.opensDown, row.hc && i < HC_COUNT);
    }
  }
}

// Concrete medians between back-to-back rows
function drawMedians(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { medians, rowStartX, rowEndX } = layout;
  for (const m of medians) {
    const x = rowStartX - 8;
    const w = rowEndX - rowStartX + 22;
    outlinedRect(ctx, x, m.top + 1, w, m.bottom - m.top - 2, COL.curb, { shadow: 0, radius: 3 });
    ctx.fillStyle = COL.curbShadow;
    ctx.fillRect(x, m.bottom - 2, w, 1);
  }
}

// Faint center line, direction arrows and stop bar in each aisle
function drawAisleMarkings(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { aisles, lotX, roadX } = layout;
  for (const a of aisles) {
    ctx.strokeStyle = COL.lineFaint;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(lotX + 20, a.center);
    ctx.lineTo(roadX - 20, a.center);
    ctx.stroke();
    ctx.setLineDash([]);

    // Westbound lane (south half), eastbound lane (north half)
    for (let x = lotX + 150; x < roadX - 80; x += 200) {
      drawArrow(ctx, x, a.center + 13, -Math.PI / 2, "rgba(255,255,255,0.45)", 0.8);
      drawArrow(ctx, x + 100, a.center - 13, Math.PI / 2, "rgba(255,255,255,0.45)", 0.8);
    }

    // Stop bar where the exit lane meets the road
    ctx.fillStyle = COL.line;
    ctx.fillRect(roadX - 7, a.top + 4, 4, a.center - a.top - 6);
  }
}

// Concrete lot boundary curbs, with openings at each aisle
function drawLotCurbs(ctx: CanvasRenderingContext2D, layout: Layout) {
  const { lotX, roadX, lotY, lotH, aisles } = layout;
  ctx.fillStyle = COL.curb;
  for (const edgeX of [lotX, roadX - 3]) {
    let y = lotY;
    for (const a of aisles) {
      ctx.fillRect(edgeX, y, 3, a.top - y);
      y = a.bottom;
    }
    ctx.fillRect(edgeX, y, 3, lotY + lotH - y);
  }
}

// Static scene (store, roads, stalls) drawn once to an offscreen canvas.
function renderBackground(W: number, H: number): HTMLCanvasElement {
  const bg = document.createElement("canvas");
  bg.width = W;
  bg.height = H;
  const ctx = bg.getContext("2d")!;

  const layout = buildLayout(W, H);
  const { lotX, lotY, lotW, lotH, entH } = layout;

  drawPedestrianRoad(ctx, layout);
  drawEntranceRoad(ctx, layout);
  drawSidewalk(ctx, layout);
  drawStore(ctx, layout);

  // Lot interior
  drawAsphalt(ctx, lotX, lotY, lotW, lotH, 7);
  drawPlanter(ctx, lotX + 3, lotY, lotW - 6, entH, 101);
  drawPlanter(ctx, lotX + 3, lotY + lotH - entH, lotW - 6, entH, 202);
  drawMedians(ctx, layout);
  drawParkingRows(ctx, layout);
  drawAisleMarkings(ctx, layout);
  drawLotCurbs(ctx, layout);
  return bg;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ParkingLotCanvas({
  width = 1000,
  height = 710,
  className,
  vehicles,
}: ParkingLotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number | null>(null);

  // ── Preload vehicle images once ───────────────────────────────────────────
  useEffect(() => {
    preloadAllVehicleImages();
  }, []);

  // ── Feed WS vehicle data into interpolation system ────────────────────────
  useEffect(() => {
    updateVehicles(vehicles);
  }, [vehicles]);

  // ── rAF loop: blit the static lot, then draw vehicles on top ──────────────
  // Vehicles also drive on the pedestrian and entrance roads, so the whole
  // canvas is repainted each frame from a pre-rendered background.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const background = renderBackground(canvas.width, canvas.height);

    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      ctx.drawImage(background, 0, 0);
      drawAllVehicles(ctx, dt);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [width, height]);

  return (
    <div className="relative w-full">
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