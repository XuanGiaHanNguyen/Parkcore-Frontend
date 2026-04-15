# 🅿️ Parking Allocation Simulator

> **Interactive parking lot allocation simulation with stop-sign intersection control, real-time visualization, and live occupancy analytics**

## 🚀 Overview

This repository contains the frontend of a real-time parking lot simulation system. The app renders the parking lot layout, displays vehicle movements, and provides interactive controls for lot allocation and intersection flow.

The frontend focuses on:

- Canvas-based real-time rendering of parked and moving vehicles
- Stop-sign managed road intersections instead of traffic lights
- Visualizing parking stall allocation and queue behavior
- Receiving high-frequency simulation updates through WebSockets
- Exposing control options for simulation speed, density, and allocation strategy

**Backend logic is handled separately and is not included in this repo.**

## 🎥 Demo
- Will be included soon!

## ⚡ Key Features

### 🅿️ Parking Infrastructure

- **Parking Lot Allocation**: Dynamic assignment of vehicles to available stall spaces.
- **Stop-Sign Intersection**: Intersection flow managed by stop signs and yielding rules rather than traffic lights.
- **Entry / Exit Lanes**: Visualized access points, queues, and waiting lines for lot entry and exit.
- **Allocation Zones**: Separate parking zones for compact, standard, and priority spaces.

### 🚗 Vehicle System

**Vehicle Categories:**

- **Normal Cars**: Standard passenger vehicles.
- **Delivery Vehicles**: Larger cars with slower allocation behavior.
- **Priority Vehicles**: Urgent units that receive faster allocation and intersection precedence.

**Intelligent Behavior:**

- Real-time position updates for each vehicle.
- Parking stall assignment and waiting behavior based on lot availability.
- Stop-sign crossing logic to prevent collisions at intersections.
- Priority handling for urgent vehicles during peak lot activity.
- Collision-free visualization using backend-provided safe state updates.

### 🎛️ Control Panel

**Real-Time Monitoring:**

- **Live Occupancy**: Current parked vehicles and free stall count.
- **Queue Analytics**: Average wait times and throughput for entry lanes.
- **Priority Alerts**: Notifications when priority vehicles are active.

**Simulation Controls:**

- **Start / Pause / Reset**: Full playback control for the parking lot simulation.
- **Speed Modes**: Adjustable simulation speeds for faster or slower replay.
- **Density Control**: Change incoming vehicle density and lot load.
- **Allocation Parameters**: Tweak how vehicles are assigned to available stalls.


## 🛠️ Tech Stack

| **Frontend** | **UI**               | **Communication**       |
| ------------ | -------------------- | ----------------------- |
| Next.js      | React                | WebSocket               |
| TypeScript   | Canvas API           | Real-time visualization |
| Tailwind CSS | Responsive dashboard | Interactive controls    |


## 🏆 Technical Highlights

- **🔄 Real-Time Rendering**: Canvas-based visualization of parking lot state.
- **📡 WebSocket Sync**: Instant reception of backend state updates.
- **🧠 Allocation Focus**: Live lot assignment and parking stall management.
- **⛔ Stop-Sign Control**: Intersection coordination without traffic lights.
- **📊 Live Analytics**: Tracking occupancy, wait times, and queue performance.


## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the frontend.


## 💡 Why This Repo?

This frontend repo showcases the interactive visualization layer of a parking lot simulation system. It demonstrates strong UI design for real-time system monitoring, responsive controls, and integration with a high-performance backend engine.

**Focused on frontend delivery only — the parking allocation and stop-sign intersection rules are driven by backend state updates.**
