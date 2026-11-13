import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Terminal, Cpu, Droplet, Shield, Database, Code2 } from 'lucide-react';

export const EngineeringSection: React.FC = () => {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(0);

  const layers = [
    {
      num: 1,
      title: 'Layer 1 — Central Orchestration',
      subtitle: 'MenuOS Integration Layer',
      icon: Layers,
      color: '#426B5B',
      description: 'Ingests external customer orders, translates digital recipes into deterministic batch instructions, checks ingredient inventories, and schedules operations.',
      technologies: 'Node.js / Go / PostgreSQL / REST API / WebSockets',
      payloadExample: `{
  "orderId": "MNU-2048",
  "recipeId": "ARTISAN_04",
  "steps": [
    { "type": "ROBOT_PICK", "target": "CONTAINER_01" },
    { "type": "DISPENSE", "ingredient": "Tomato Sauce", "grams": 50 },
    { "type": "ROBOT_PLACE", "destination": "OUTBOUND_CONVEYOR" }
  ]
}`,
      advantages: [
        'Centralized business rule orchestration completely decoupled from low-level robotics.',
        'High-availability ordering interface without real-time Linux latency dependencies.'
      ]
    },
    {
      num: 2,
      title: 'Layer 2 — Communication & Messaging',
      subtitle: 'Structured Payload Interface & Event Bus',
      icon: Database,
      color: '#B18A62',
      description: 'Provides standardized, versioned JSON/Protobuf schemas across high-level orchestration, ROS 2 middleware, and embedded microcontrollers.',
      technologies: 'gRPC / FastDDS / Micro-ROS / ZeroMQ / Idempotency Tokens',
      payloadExample: `{
  "transactionId": "DSP-00481",
  "operationId": "OP-2026-00481",
  "nonce": "a7f4e91c",
  "timestamp": 1731548520,
  "signature": "hmac_sha256_verified"
}`,
      advantages: [
        'Strict idempotency protection guarantees no duplicate pour even on network retransmissions.',
        'Structured payload versioning allows independent upgrading of subsystems.'
      ]
    },
    {
      num: 3,
      title: 'Layer 3 — Robotic Intelligence',
      subtitle: 'ROS 2 / Python / C++ / Manufacturer SDK',
      icon: Cpu,
      color: '#56866A',
      description: 'Runs real-time ROS 2 Humble nodes responsible for kinematic state estimation, inverse kinematics calculation, and dynamic collision avoidance.',
      technologies: 'ROS 2 Humble / MoveIt 2 / OMPL / tf2 / URDF Kinematic Trees',
      payloadExample: `# ROS 2 JointTrajectoryPoint sample
positions: [-0.785, 0.261, 1.431, -0.261, 0.436, -0.785]
velocities: [0.12, 0.08, 0.15, 0.05, 0.09, 0.0]
accelerations: [0.02, 0.01, 0.03, 0.01, 0.02, 0.0]
time_from_start: { sec: 1, nanosec: 800000000 }`,
      advantages: [
        'Hardware-agnostic motion planning adaptable to Universal Robots, KUKA, ABB, or Fanuc.',
        'Standardized ROS 2 interfaces enable rapid simulation validation in Gazebo / Isaac Sim.'
      ]
    },
    {
      num: 4,
      title: 'Layer 4 — Motion Execution',
      subtitle: 'Trajectory Control & End-Effector Gripper',
      icon: Code2,
      color: '#8EA99A',
      description: 'Interprets high-level trajectory splines into motor servo commands, monitors position errors, and manages pneumatic gripper pressure feedback.',
      technologies: 'ros2_control / JointTrajectoryController / Fast CAN-Open',
      payloadExample: `# Gripper Command Action Goal
uint8 PNEUMATIC_COMMAND_ENGAGE = 1
float32 target_force_newtons = 24.5
float32 max_travel_mm = 35.0
bool verify_vacuum_seal = true`,
      advantages: [
        'Microsecond servo synchronization with closed-loop torque feedback.',
        'Dynamic compliance protects delicate vessels during rapid transitions.'
      ]
    },
    {
      num: 5,
      title: 'Layer 5 — Dispensing Controller',
      subtitle: 'Embedded Controller / Sensors / Actuators',
      icon: Droplet,
      color: '#B58A4C',
      description: 'Embedded real-time microcontroller (ARM Cortex-M4/M7) driving stepper motor peristaltic pumps, solenoid valves, and reading high-precision strain-gauge scales.',
      technologies: 'STM32 / FreeRTOS / 24-bit HX711 ADC / Stepper PWM / Optical Retroreflective',
      payloadExample: `# CAN Frame: Actuator Activation
CAN_ID: 0x140 [DLC 8]
BYTE[0]: 0x01 (Pump A-1: Tomato Sauce)
BYTE[1-2]: 0x01F4 (Target: 50.00g)
BYTE[3-4]: 0x03E8 (Pulse rate: 1000 Hz)
BYTE[5]: 0x01 (Optical Beam Check Required)
BYTE[6-7]: CRC16`,
      advantages: [
        'Deterministic hardware timing down to 10 microseconds for exact volume repeatability.',
        'Direct load-cell closed loop stops pump at exact target weight without host lag.'
      ]
    },
    {
      num: 6,
      title: 'Layer 6 — Monitoring & Safety',
      subtitle: 'Fault Handling / Interlocks / Recovery',
      icon: Shield,
      color: '#B45F57',
      description: 'Supervisory watchdog monitoring heartbeat timeouts, Cartesian boundaries, pneumatic drops, and providing immediate fail-safe Category 0 emergency stop cutoffs.',
      technologies: 'ISO 13849 PLd Architecture / Hardware Relay Cutoffs / Watchdog Timer',
      payloadExample: `# Safety Watchdog Log Record
{
  "safetyRelay": "HEALTHY",
  "estopCircuit": "CLOSED",
  "heartbeatJitterMs": 1.2,
  "lastInterlockCheck": "PASS",
  "zoneEnvelope": "CLEARED"
}`,
      advantages: [
        'Independent safety loop operational even if high-level operating system freezes.',
        'Stateful fault recovery protocols eliminate accidental equipment re-triggering.'
      ]
    }
  ];

  return (
    <section id="engineering-preview" className="py-20 sm:py-24 bg-industrial-bg border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            06 // MODULAR ENGINEERING ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Designed for modularity. Built for expansion.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            A cohesive 6-layer software and hardware architecture engineered to separate concerns, facilitate independent subsystem development, and support industrial scale.
          </p>
        </div>

        {/* Accordion / Expandable Layers */}
        <div className="space-y-4">
          {layers.map((layer, index) => {
            const isExpanded = expandedLayer === index;
            const Icon = layer.icon;

            return (
              <div
                key={layer.num}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-white border-industrial-accent shadow-md'
                    : 'bg-white/80 border-industrial-border hover:border-industrial-border/80'
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpandedLayer(isExpanded ? null : index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: layer.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-semibold text-industrial-textMuted uppercase">
                        {layer.subtitle}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-heading text-industrial-text">
                        {layer.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-xs font-mono text-industrial-textMuted px-2.5 py-1 rounded-full bg-industrial-bgSecondary">
                      {layer.technologies.split('/')[0].trim()}
                    </span>
                    <div className="p-1 rounded-lg text-industrial-textMuted">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-industrial-border/60 space-y-6 text-xs sm:text-sm animate-in fade-in duration-200">
                    <p className="text-industrial-text leading-relaxed">
                      {layer.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Code / Payload snippet */}
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-[11px] text-industrial-textMuted uppercase font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-industrial-accent" />
                            <span>Structured Interface Schema</span>
                          </span>
                          <span>JSON / Payload / Topic</span>
                        </div>
                        <pre className="p-4 rounded-xl bg-industrial-dark text-gray-200 overflow-x-auto text-[11px] leading-relaxed border border-[#37473d]">
                          <code>{layer.payloadExample}</code>
                        </pre>
                      </div>

                      {/* Technical Advantages */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-mono uppercase font-semibold text-industrial-textMuted">
                          Architectural Advantages
                        </div>
                        <ul className="space-y-2.5 text-xs text-industrial-text">
                          {layer.advantages.map((adv, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-industrial-accent flex-shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{adv}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-industrial-textMuted uppercase block">
                            Integrated Technology Stack:
                          </span>
                          <span className="text-xs font-mono font-semibold text-industrial-accent">
                            {layer.technologies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

