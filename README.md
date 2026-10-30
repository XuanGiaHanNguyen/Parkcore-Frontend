# ParkCore: Parking Allocation Simulator

> **A real-time parking lot simulation: cars arrive, get allocated the best stall, park, and leave, rendered live in the browser.**

This repository is the **frontend** (Next.js). The simulation itself runs in the Spring Boot backend: [Parkcore-Backend](https://github.com/XuanGiaHanNguyen/Parkcore-Backend). The backend streams the state of the lot over a WebSocket and this app draws it.

## ⚡ Features

### 🅿️ The lot
- 144 stalls in six rows around three two-lane aisles, next to a shopping center.
- 12 handicapped stalls closest to the store, used only by permit holders.
- Entrance road with IN/OUT lanes, a pedestrian road with crosswalks, planters and medians.

### 🚗 Vehicles
- 9 vehicle types (cars, taxi, van, semi truck, police), each with its own size and speed.
- **Smart allocation**: each arriving car is assigned the free stall closest to the store.
- **Collision avoidance**: drivers yield to traffic ahead, wait for a gap before backing out, and resolve crossings by right of way.
- Full visit cycle: arrive → pull into the stall nose-first → park → back out → loop around → exit.
- Police cars patrol the aisles without parking.

### 🎛️ Controls & monitoring
- Play / pause and reset.
- Simulation speed: slow, normal, fast.
- Traffic density: sparse, normal, heavy.
- Live stats: vehicles in the lot, parked count, vehicles served, spots left.
- Live preview of the lot on the landing page.

## 🛠️ Tech stack

| Frontend | Rendering | Communication |
| --- | --- | --- |
| Next.js 16 (App Router) | Canvas 2D, pre-rendered background + 60fps vehicle layer | Raw WebSocket (`/ws/simulation`) |
| React 19, TypeScript | Per-frame interpolation of ~20 updates/sec | JSON `STATE_UPDATE` / `CONTROL` messages |
| Tailwind CSS 4 | Hugeicons | Auto-reconnect |

## 🚀 Running locally

Start the [backend](https://github.com/XuanGiaHanNguyen/Parkcore-Backend) first (it listens on port `8085`), then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The simulator is at [/simulation](http://localhost:3000/simulation).

### Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8085/ws/simulation` | WebSocket address of the backend. Use `wss://…` when the site is served over HTTPS. |

Put it in `.env.local` for development, or in your hosting provider's environment settings.

## 📁 Project structure

```
src/
├── app/
│   ├── page.tsx                      Landing page (with live preview)
│   ├── caranimated.tsx               Animated road footer
│   └── simulation/
│       ├── page.tsx                  Simulator: map, controls, stats
│       └── roadsystem/
│           ├── parkinglot.tsx        Canvas: lot drawing + render loop
│           ├── hooks/useSimulationSocket.ts   WebSocket state + controls
│           └── lib/
│               ├── vehicleAssets.ts  Sprite paths and sizes
│               └── vehicleRenderer.ts  Interpolation and vehicle drawing
└── components/navigation.tsx         Top navigation bar
public/vehicles/                      Vehicle sprites
```

The lot geometry in `parkinglot.tsx` (`buildLayout`) must stay in sync with `ParkingLot.java` in the backend, so cars land exactly on the painted stalls.

## 📡 WebSocket protocol

Backend → client, about 20 times per second:

```json
{ "type": "STATE_UPDATE",
  "payload": { "vehicles": [{ "id": "vehicle-12", "type": "TAXI", "x": 512.4, "y": 161.5,
                              "angle": 180, "speed": 90, "state": "MOVING", "spotId": "R1-4" }],
               "vehicleCount": 61, "parkedCount": 44, "totalSpots": 144, "spotsLeft": 89,
               "servedCount": 120, "running": true, "speed": "normal", "density": "normal",
               "avgSpeed": 71.2, "timestamp": 1761789012345 } }
```

Client → backend (any field is optional):

```json
{ "type": "CONTROL", "action": "play | pause | reset", "speed": "slow | normal | fast", "density": "sparse | normal | heavy" }
```

## ☁️ Deploying

- **Frontend**: deploy this repo to [Vercel](https://vercel.com) (or any Next.js host) and set `NEXT_PUBLIC_WS_URL` to `wss://<your-backend-host>/ws/simulation`.
- **Backend**: needs a host that keeps a long-running process with WebSockets open (Render, Railway, Fly.io…). See the backend README.
