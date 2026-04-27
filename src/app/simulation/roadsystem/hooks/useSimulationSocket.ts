import { useEffect, useRef, useState, useCallback } from "react";
import { Vehicle } from "../lib/vehicleRenderer";

// ─── Simulation state shape ───────────────────────────────────────────────────

export interface SimulationState {
  vehicles: Vehicle[];
  timestamp: number;
  vehicleCount: number;
  avgSpeed: number;     // average speed across all vehicles
}

export type ConnectionStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

// ─── Config ───────────────────────────────────────────────────────────────────

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws/simulation";

const MAX_RETRIES       = 5;
const RETRY_BASE_MS     = 1000; // doubles each attempt: 1s, 2s, 4s, 8s, 16s

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSimulationSocket() {
  const wsRef           = useRef<WebSocket | null>(null);
  const retryCountRef   = useRef(0);
  const retryTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef      = useRef(true);

  const [status, setStatus] = useState<ConnectionStatus>("CONNECTING");
  const [state, setState]   = useState<SimulationState>({
    vehicles:     [],
    timestamp:    0,
    vehicleCount: 0,
    avgSpeed:     0,
  });

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("CONNECTING");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      retryCountRef.current = 0;
      setStatus("CONNECTED");
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return;
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
      if (!mountedRef.current) return;
      setStatus("ERROR");
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setStatus("DISCONNECTED");

      if (retryCountRef.current < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * Math.pow(2, retryCountRef.current);
        retryCountRef.current++;
        retryTimerRef.current = setTimeout(connect, delay);
      }
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { state, status };
}