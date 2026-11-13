# Intelligent Robotic Preparation System — Industrial Automation Platform

> **Precision intelligence. Coordinated motion. Automated execution.**

An integrated industrial automation architecture connecting centralized workflow orchestration (**MenuOS**), six-axis robotic motion control (**Robotic Arm System**), and precision ingredient dispensing (**Dispensing System [DS]**) into one coordinated operational environment.

---

## 🌟 Architectural Overview

```
                                  ┌──────────────────────────┐
                                  │          MenuOS          │
                                  │ Centralized Orchestrator │
                                  └─────────────┬────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     │                                                     │
          EXECUTION_REQUEST (gRPC / ROS 2)                        DISPENSE_AUTHORIZED (Tokenized)
                     ▼                                                     ▼
     ┌───────────────────────────────┐                     ┌───────────────────────────────┐
     │      Robotic Arm System       │◄──── JAR_ALIGNED ──►│    Dispensing System (DS)     │
     │ ROS 2 6-DOF MoveIt Kinematics │     (CAN-Bus/Optic) │ Load-Cell Closed-Loop Scale   │
     └───────────────────────────────┘                     └───────────────────────────────┘
```

The platform coordinates three distinct engineering systems:

1. **MenuOS:** Customer order ingestion, digital BOM compilation, dynamic ingredient quantity dispatching, and atomic transaction authorization.
2. **Robotic Arm System:** ROS 2 Humble kinematic planning (MoveIt 2 / OMPL), 6-DOF forward and inverse kinematics, parallel pneumatic gripper force control, and collision envelope monitoring.
3. **Dispensing System (DS):** Optical retroreflective jar-presence verification, multi-pump fluidic actuators, dynamic load-cell mass feedback ($\pm 0.05\,\text{g}$), and idempotent duplicate prevention.

---

## 🚀 Features

- **Cinematic Industrial UI:** Light-first industrial editorial design system with deep muted forest-charcoal supervisory control modes.
- **Interactive 6-Axis Visualizer:** Multi-joint forward kinematics solver displaying $J_1-J_6$ angles, Tool Center Point (TCP) coordinates ($X, Y, Z$), and parallel pneumatic clamp animation.
- **Precision Dispensing Laboratory:** Actuator calibration across 5 ingredients (*Tomato Sauce*, *Cheese*, *Olive Oil*, *Herb Mix*, *Seasoning*) with digital load-cell scale.
- **Duplicate Dispensing Prevention (Idempotency Guard):** Hardware-level transaction UUID check (`DSP-00481`) with automatic HTTP 409 conflict rejection on duplicate pour attempts.
- **Supervisory Control Room (`/control-room`):** Flagship dark control interface featuring a 9-phase automated sequence engine, live telemetry feed, and Category 0 Emergency Stop circuit.
- **Simulation & Test Harness (`/simulation`):** 6 test suites validating normal workflows, optical jar absences, communication watchdog timeouts, collision envelopes, and flow surge deviations.
- **6-Layer Modular Software Architecture:** Detailed breakdown of central orchestration, messaging schemas, ROS 2 nodes, trajectory controllers, embedded CAN peripherals, and safety watchdogs.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router DOM (with SPA fallback configuration for Netlify)
- **Styling:** Tailwind CSS + Custom Industrial Editorial Design System
- **Icons:** Lucide React
- **Typography:** Manrope (Headings), Inter (Body), JetBrains Mono (Telemetry)

---

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/abdulrehmann1238-lab/six-axis-robotic-arm-automation.git
cd six-axis-robotic-arm-automation

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌐 Netlify Deployment

This repository is pre-configured for one-click deployment on **Netlify**:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Redirects:** Configured via `netlify.toml` and `_redirects` for smooth client-side routing.

---

## 📄 License

MIT © 2026. Demonstration platform for architectural validation and industrial software commissioning.
