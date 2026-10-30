import { useEffect, useRef, useState, useCallback } from "react";
import { Vehicle } from "../lib/vehicleRenderer";
import type { SpeedType, DensityType } from "@/lib/types/color";

// ─── Simulation state shape ───────────────────────────────────────────────────

export interface SimulationState {
  vehicles: Vehicle[];
  timestamp: number;
  vehicleCount: number;
  avgSpeed: number;     // average speed across moving vehicles
  parkedCount: number;
  totalSpots: number;
  spotsLeft: number;    // stalls neither occupied nor reserved
  servedCount: number;  // vehicles that parked and left
  running: boolean;
  speed: SpeedType;
  density: DensityType;
}

export type ConnectionStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

export interface SimulationControl {
  action?: "play" | "pause" | "reset";
  speed?: SpeedType;
  density?: DensityType;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8085/ws/simulation";

const RETRY_BASE_MS = 1000; // doubles each attempt: 1s, 2s, 4s, capped below
const RETRY_MAX_MS  = 5000;

const INITIAL_STATE: SimulationState = {
  vehicles:     [],
  timestamp:    0,
  vehicleCount: 0,
  avgSpeed:     0,
  parkedCount:  0,
  totalSpots:   0,
  spotsLeft:    0,
  servedCount:  0,
  running:      false,
  speed:        "normal",
  density:      "normal",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSimulationSocket() {
  const wsRef           = useRef<WebSocket | null>(null);
  const retryCountRef   = useRef(0);
  const retryTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef      = useRef(true);

  const [status, setStatus] = useState<ConnectionStatus>("CONNECTING");
  const [state, setState]   = useState<SimulationState>(INITIAL_STATE);

  useEffect(() => {
    mountedRef.current = true;

    function connect() {
      if (!mountedRef.current) return;
      setStatus("CONNECTING");
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      // Ignore events from sockets that have been replaced (e.g. StrictMode remount)
      const isCurrent = () => mountedRef.current && wsRef.current === ws;

      ws.onopen = () => {
        if (!isCurrent()) return;
        retryCountRef.current = 0;
        setStatus("CONNECTED");
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!isCurrent()) return;
        try {
          // Backend sends: { type: "STATE_UPDATE", payload: SimulationState }
          const msg = JSON.parse(event.data as string);
          if (msg.type === "STATE_UPDATE") {
            setState(msg.payload as SimulationState);
          }
        } catch (e) {
          console.error("[WS] Parse error:", e);
        }
      };

      ws.onerror = () => {
        if (!isCurrent()) return;
        setStatus("ERROR");
      };

      ws.onclose = () => {
        if (!isCurrent()) return;
        setStatus("DISCONNECTED");

        // Keep retrying so starting the backend later still connects
        const delay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** retryCountRef.current);
        retryCountRef.current++;
        retryTimerRef.current = setTimeout(connect, delay);
      };
    }

    connect();
    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const sendControl = useCallback((control: SimulationControl) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "CONTROL", ...control }));
    }
  }, []);

  return { state, status, sendControl };
}
