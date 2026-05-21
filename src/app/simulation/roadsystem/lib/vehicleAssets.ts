// ─── Vehicle Types ────────────────────────────────────────────────────────────
// These must match exactly what your Spring Boot backend sends as `type`
// image paths, sizes, fallback colors, preloader
export type VehicleType =
  | "BLUE_CAR"
  | "GREEN_CAR"
  | "RED_CAR"
  | "WHITE_CAR"
  | "YELLOW_CAR"
  | "TAXI"
  | "VAN"
  | "SEMI_TRUCK"
  | "POLICE";

// ─── Image Paths ──────────────────────────────────────────────────────────────
// Maps each VehicleType to its file in /public/vehicles/

export const VEHICLE_IMAGE_PATHS: Record<VehicleType, string> = {
  BLUE_CAR: "/vehicles/blueCar.png",
  GREEN_CAR: "/vehicles/greenCar.png",
  RED_CAR: "/vehicles/redCar.png",
  WHITE_CAR: "/vehicles/whiteCar.png",
  YELLOW_CAR: "/vehicles/yellowCar.png",
  TAXI: "/vehicles/taxiCar.png",
  VAN: "/vehicles/van.png",
  SEMI_TRUCK: "/vehicles/semiTruck.png",
  POLICE: "/vehicles/police.png",
};

// ─── Vehicle Dimensions ───────────────────────────────────────────────────────
// Width x Height in canvas pixels. Adjust to match your spot size (SPOT_W=14, SPOT_H=28)

export const VEHICLE_SIZE: Record<VehicleType, { w: number; h: number }> = {
  BLUE_CAR: { w: 20, h: 40 },
  GREEN_CAR: { w: 20, h: 40 },
  RED_CAR: { w: 20, h: 40 },
  WHITE_CAR: { w: 20, h: 40 },
  YELLOW_CAR: { w: 20, h: 40 },
  TAXI: { w: 20, h: 40 },
  VAN: { w: 22, h: 46 },
  SEMI_TRUCK: { w: 26, h: 54 },
  POLICE: { w: 20, h: 40 },
};

// ─── Fallback Colors ──────────────────────────────────────────────────────────
// Used when image hasn't loaded yet

export const VEHICLE_FALLBACK_COLOR: Record<VehicleType, string> = {
  BLUE_CAR: "#3b82f6",
  GREEN_CAR: "#22c55e",
  RED_CAR: "#ef4444",
  WHITE_CAR: "#f9fafb",
  YELLOW_CAR: "#eab308",
  TAXI: "#f59e0b",
  VAN: "#8b5cf6",
  SEMI_TRUCK: "#6b7280",
  POLICE: "#1e3a5f",
};

// ─── Image Cache + Preloader ──────────────────────────────────────────────────

const imageCache = new Map<VehicleType, HTMLImageElement>();

export function preloadAllVehicleImages(): void {
  for (const [type, path] of Object.entries(VEHICLE_IMAGE_PATHS) as [
    VehicleType,
    string,
  ][]) {
    if (imageCache.has(type)) continue;
    const img = new Image();
    img.src = path;
    imageCache.set(type, img);
  }
}

export function getVehicleImage(type: VehicleType): HTMLImageElement | null {
  const img = imageCache.get(type);
  if (img?.complete && img.naturalWidth > 0) return img;
  return null;
}
