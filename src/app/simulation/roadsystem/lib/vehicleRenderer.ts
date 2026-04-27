import {
  VehicleType,
  VEHICLE_SIZE,
  VEHICLE_FALLBACK_COLOR,
  getVehicleImage,
} from "./vehicleAssets";

// ─── Vehicle data shape ───────────────────────────────────────────────────────
// Mirror of what Spring Boot will send per vehicle + interpolation + drawAllVehicles()

export interface Vehicle {
  id: string;
  type: VehicleType;
  x: number;       // canvas pixel x (center)
  y: number;       // canvas pixel y (center)
  angle: number;   // degrees — 0 = facing right, 90 = facing down
  speed: number;   // units/sec (from backend)
  state: "MOVING" | "STOPPED" | "PARKING" | "PARKED" | "EXITING";
  spotId?: string; // set when state === "PARKED"
}

// ─── Interpolation ────────────────────────────────────────────────────────────
// Smooths movement between WebSocket state updates so vehicles glide, not jump

interface RenderVehicle extends Vehicle {
  renderX: number;
  renderY: number;
  renderAngle: number;
}

const LERP = 0.18; // 0 = never moves, 1 = instant snap

const renderMap = new Map<string, RenderVehicle>();

function lerpAngle(a: number, b: number, t: number): number {
  const diff = ((b - a + 540) % 360) - 180;
  return a + diff * t;
}

export function updateVehicles(incoming: Vehicle[]): void {
  const activeIds = new Set(incoming.map((v) => v.id));

  // Remove vehicles no longer in simulation
  for (const id of renderMap.keys()) {
    if (!activeIds.has(id)) renderMap.delete(id);
  }

  for (const v of incoming) {
    const existing = renderMap.get(v.id);
    if (existing) {
      existing.renderX     += (v.x - existing.renderX) * LERP;
      existing.renderY     += (v.y - existing.renderY) * LERP;
      existing.renderAngle  = lerpAngle(existing.renderAngle, v.angle, LERP);
      Object.assign(existing, v); // update all other fields
    } else {
      // First frame — place directly, no lerp
      renderMap.set(v.id, { ...v, renderX: v.x, renderY: v.y, renderAngle: v.angle });
    }
  }
}

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawVehicle(ctx: CanvasRenderingContext2D, v: RenderVehicle): void {
  const { w, h } = VEHICLE_SIZE[v.type];

  ctx.save();
  ctx.translate(v.renderX, v.renderY);
  ctx.rotate((v.renderAngle * Math.PI) / 180);

  // Dim parked vehicles slightly
  if (v.state === "PARKED") ctx.globalAlpha = 0.75;

  // Shadow
  ctx.shadowColor   = "rgba(0,0,0,0.3)";
  ctx.shadowBlur    = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const img = getVehicleImage(v.type);
  if (img) {
    // Draw image centered
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    // Fallback colored rectangle until image loads
    ctx.shadowColor = "transparent";
    ctx.fillStyle = VEHICLE_FALLBACK_COLOR[v.type];
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 2);
    ctx.fill();
  }

  // Police flash overlay
  if (v.type === "POLICE" && v.state !== "PARKED") {
    ctx.shadowColor = "transparent";
    const flash = Math.sin(Date.now() / 150) > 0;
    ctx.fillStyle = flash ? "rgba(255,0,0,0.35)" : "rgba(0,0,255,0.35)";
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w / 2, h / 2, 1);
    ctx.fill();
  }

  ctx.globalAlpha   = 1;
  ctx.shadowColor   = "transparent";
  ctx.restore();
}

export function drawAllVehicles(ctx: CanvasRenderingContext2D): void {
  const vehicles = Array.from(renderMap.values());

  // Draw parked first (bottom layer), then moving on top
  const parked  = vehicles.filter((v) => v.state === "PARKED");
  const moving  = vehicles.filter((v) => v.state !== "PARKED");

  for (const v of [...parked, ...moving]) {
    drawVehicle(ctx, v);
  }
}