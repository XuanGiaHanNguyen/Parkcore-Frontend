import {
  VehicleType,
  VEHICLE_SIZE,
  VEHICLE_FALLBACK_COLOR,
  getVehicleImage,
} from "./vehicleAssets";

// ─── Polyfill for roundRect ──────────────────────────────────────────────────
// Guarded so the module can be evaluated during server rendering
if (
  typeof CanvasRenderingContext2D !== "undefined" &&
  !CanvasRenderingContext2D.prototype.roundRect
) {
  CanvasRenderingContext2D.prototype.roundRect = function (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number | number[],
  ) {
    const radius = Array.isArray(r) ? r : [r, r, r, r];
    this.beginPath();
    this.moveTo(x + radius[0], y);
    this.lineTo(x + w - radius[1], y);
    this.arcTo(x + w, y, x + w, y + radius[1], radius[1]);
    this.lineTo(x + w, y + h - radius[2]);
    this.arcTo(x + w, y + h, x + w - radius[2], y + h, radius[2]);
    this.lineTo(x + radius[3], y + h);
    this.arcTo(x, y + h, x, y + h - radius[3], radius[3]);
    this.lineTo(x, y + radius[0]);
    this.arcTo(x, y, x + radius[0], y, radius[0]);
    this.closePath();
  };
}

// ─── Vehicle data shape ───────────────────────────────────────────────────────
// Mirror of what Spring Boot will send per vehicle + interpolation + drawAllVehicles()

export interface Vehicle {
  id: string;
  type: VehicleType;
  x: number; // canvas pixel x (center)
  y: number; // canvas pixel y (center)
  angle: number; // degrees — 0 = facing right, 90 = facing down
  speed: number; // units/sec (from backend)
  state: "MOVING" | "STOPPED" | "PARKING" | "PARKED" | "EXITING";
  spotId?: string; // set when state === "PARKED"
}

// ─── Interpolation ────────────────────────────────────────────────────────────
// The backend sends ~20 updates/sec; every animation frame each vehicle eases
// toward its latest server position so movement looks smooth at 60fps.

interface RenderVehicle extends Vehicle {
  renderX: number;
  renderY: number;
  renderAngle: number;
}

const SMOOTHING = 18; // higher = follows the server more tightly (per second)
const SNAP_DISTANCE = 80; // jumps larger than this (e.g. after reset) snap instantly

const renderMap = new Map<string, RenderVehicle>();

function lerpAngle(a: number, b: number, t: number): number {
  const diff = ((((b - a) % 360) + 540) % 360) - 180;
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
      Object.assign(existing, v); // new target; render position catches up per frame
    } else {
      // First sighting — place directly, no lerp
      renderMap.set(v.id, {
        ...v,
        renderX: v.x,
        renderY: v.y,
        renderAngle: v.angle,
      });
    }
  }
}

function stepInterpolation(dtSeconds: number): void {
  const t = 1 - Math.exp(-SMOOTHING * dtSeconds);
  for (const v of renderMap.values()) {
    if (Math.hypot(v.x - v.renderX, v.y - v.renderY) > SNAP_DISTANCE) {
      v.renderX = v.x;
      v.renderY = v.y;
      v.renderAngle = v.angle;
      continue;
    }
    v.renderX += (v.x - v.renderX) * t;
    v.renderY += (v.y - v.renderY) * t;
    v.renderAngle = lerpAngle(v.renderAngle, v.angle, t);
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

  // Hard offset shadow to match the app's brutalist style
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 0;
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

  // Police light bar across the roof, alternating red / blue
  if (v.type === "POLICE" && v.state !== "PARKED") {
    ctx.shadowColor = "transparent";
    const flash = Math.sin(Date.now() / 150) > 0;
    ctx.fillStyle = flash ? "rgba(255,0,0,0.8)" : "rgba(0,80,255,0.8)";
    ctx.beginPath();
    ctx.roundRect(-3, -h / 2 + 2, 5, h / 2 - 2, 1);
    ctx.fill();
    ctx.fillStyle = flash ? "rgba(0,80,255,0.8)" : "rgba(255,0,0,0.8)";
    ctx.beginPath();
    ctx.roundRect(-3, 0, 5, h / 2 - 2, 1);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowColor = "transparent";
  ctx.restore();
}

export function drawAllVehicles(
  ctx: CanvasRenderingContext2D,
  dtSeconds: number,
): void {
  stepInterpolation(dtSeconds);

  // Draw parked first (bottom layer), then moving on top
  const vehicles = Array.from(renderMap.values());
  for (const v of vehicles) if (v.state === "PARKED") drawVehicle(ctx, v);
  for (const v of vehicles) if (v.state !== "PARKED") drawVehicle(ctx, v);
}
