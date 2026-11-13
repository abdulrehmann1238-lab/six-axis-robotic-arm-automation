import React, { useState } from 'react';
import { Layers, Cpu, Droplet, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SystemType } from '../../types';

interface ArchitectureDiagramProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ 
  theme = 'light',
  className = ''
}) => {
  const [activeSystem, setActiveSystem] = useState<SystemType | null>(null);
  const [modalSystem, setModalSystem] = useState<SystemType | null>(null);
  const isDark = theme === 'dark';

  const systemsData: Record<SystemType, {
    title: string;
    tagline: string;
    protocol: string;
    responsibilities: string[];
    interfaces: string[];
    accentColor: string;
  }> = {
    'MenuOS': {
      title: 'MenuOS',
      tagline: 'Centralized Orchestration & Production Intelligence',
      protocol: 'RESTful API / gRPC & WebSocket Event Streaming',
      responsibilities: [
        'Customer order ingestion & validation',
        'Recipe parameter orchestration & BOM compilation',
        'Dynamic ingredient quantity dispatching',
        'Workflow phase management & step synchronization',
        'Operation authorization token generation',
        'Central operational status & audit collection'
      ],
      interfaces: [
        'POST /api/v1/orders/dispatch',
        'WS /events/workflow_telemetry',
        'GET /api/v1/dispense/authorize'
      ],
      accentColor: '#426B5B'
    },
    'Robotic Arm System': {
      title: 'Robotic Arm System',
      tagline: 'Six-Axis Motion Control & Kinematic Intelligence',
      protocol: 'ROS 2 Humble / DDS / FastDDS Middleware',
      responsibilities: [
        'ROS 2-based 6-DOF motion planning (MoveIt 2 & OMPL)',
        'Collision-aware trajectory execution in real-time',
        'Pneumatic parallel gripper force-sensing control',
        'Precision object pickup, transfer & staging',
        'Dynamic workspace coordinate transformation (/tf2)',
        'Hardware state feedback telemetry (/joint_states)'
      ],
      interfaces: [
        'Topic: /arm_controller/follow_joint_trajectory',
        'Topic: /gripper_controller/command',
        'Topic: /joint_states (50Hz)'
      ],
      accentColor: '#B18A62'
    },
    'Dispensing System (DS)': {
      title: 'Dispensing System (DS)',
      tagline: 'Precision Ingredient Actuation & Flow Verification',
      protocol: 'Embedded CAN-Bus / Modbus-RTU / UART Micro-ROS',
      responsibilities: [
        'Optical retroreflective jar-presence verification',
        'High-precision peristaltic pump & micro-auger actuation',
        'Solenoid valve timing & micro-stepping flow control',
        'Dynamic strain-gauge load cell quantity measurement',
        'Closed-loop dispensing authorization & idempotency check',
        'Real-time fault reporting & completion acknowledgment'
      ],
      interfaces: [
        'CAN ID: 0x140 - DISPENSE_ACTIVATE',
        'CAN ID: 0x142 - SENSOR_BEAM_STATE',
        'CAN ID: 0x145 - LOADCELL_MASS_FEEDBACK'
      ],
      accentColor: '#56866A'
    }
  };

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
      isDark 
        ? 'bg-[#1e2621] border-[#344439] text-gray-100' 
        : 'bg-white border-industrial-border text-industrial-text shadow-sm'
    } ${className}`}>
      {/* Header explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-inherit gap-3">
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            Interactive Architecture Topology
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading mt-1">
            Three Connected Systems. One Coordinated Intelligence.
          </h3>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full bg-industrial-bgSecondary text-industrial-textMuted border border-industrial-border w-fit">
          Click any block to inspect defined interfaces
        </div>
      </div>

      {/* Diagram Canvas Area */}
      <div className="py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* 1. MenuOS Block */}
          <div 
            onMouseEnter={() => setActiveSystem('MenuOS')}
            onMouseLeave={() => setActiveSystem(null)}
            onClick={() => setModalSystem('MenuOS')}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
              activeSystem === 'MenuOS' || activeSystem === null 
                ? 'opacity-100 ring-2 ring-industrial-accent/50' 
                : 'opacity-60'
            } ${isDark ? 'bg-[#253029] border-[#3d4f43]' : 'bg-[#F9FAF8] border-industrial-border hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-accent/15 text-industrial-accent font-semibold">
                SYSTEM_01
              </span>
              <Layers className="w-5 h-5 text-industrial-accent" />
            </div>
            <h4 className="text-lg font-bold font-heading mb-1">MenuOS</h4>
            <p className="text-xs text-industrial-textMuted mb-4">
              Centralized Orchestration & Workflow
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-industrial-text">Core Responsibilities:</div>
              <ul className="list-disc list-inside text-industrial-textMuted space-y-1 pl-1">
                <li>Order ingestion & recipe rules</li>
                <li>Ingredient quantity dispatching</li>
                <li>Operation authorization tokens</li>
                <li>Batch completion status audit</li>
              </ul>
            </div>
          </div>

          {/* 2. Robotic Arm System Block */}
          <div 
            onMouseEnter={() => setActiveSystem('Robotic Arm System')}
            onMouseLeave={() => setActiveSystem(null)}
            onClick={() => setModalSystem('Robotic Arm System')}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
              activeSystem === 'Robotic Arm System' || activeSystem === null 
                ? 'opacity-100 ring-2 ring-industrial-warm/50' 
                : 'opacity-60'
            } ${isDark ? 'bg-[#253029] border-[#3d4f43]' : 'bg-[#F9FAF8] border-industrial-border hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-warm/15 text-industrial-warm font-semibold">
                SYSTEM_02
              </span>
              <Cpu className="w-5 h-5 text-industrial-warm" />
            </div>
            <h4 className="text-lg font-bold font-heading mb-1">Robotic Arm System</h4>
            <p className="text-xs text-industrial-textMuted mb-4">
              ROS 2 & Six-Axis Motion Intelligence
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-industrial-text">Core Responsibilities:</div>
              <ul className="list-disc list-inside text-industrial-textMuted space-y-1 pl-1">
                <li>ROS 2 joint trajectory planning</li>
                <li>Obstacle-aware 6-DOF execution</li>
                <li>Pneumatic parallel gripper control</li>
                <li>Live kinematic pose telemetry</li>
              </ul>
            </div>
          </div>

          {/* 3. Dispensing System Block */}
          <div 
            onMouseEnter={() => setActiveSystem('Dispensing System (DS)')}
            onMouseLeave={() => setActiveSystem(null)}
            onClick={() => setModalSystem('Dispensing System (DS)')}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
              activeSystem === 'Dispensing System (DS)' || activeSystem === null 
                ? 'opacity-100 ring-2 ring-industrial-success/50' 
                : 'opacity-60'
            } ${isDark ? 'bg-[#253029] border-[#3d4f43]' : 'bg-[#F9FAF8] border-industrial-border hover:shadow-md'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-success/15 text-industrial-success font-semibold">
                SYSTEM_03
              </span>
              <Droplet className="w-5 h-5 text-industrial-success" />
            </div>
            <h4 className="text-lg font-bold font-heading mb-1">Dispensing System (DS)</h4>
            <p className="text-xs text-industrial-textMuted mb-4">
              Actuators, Sensors & Mass Metering
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-industrial-text">Core Responsibilities:</div>
              <ul className="list-disc list-inside text-industrial-textMuted space-y-1 pl-1">
                <li>Optical jar presence verification</li>
                <li>Precision pump & valve metering</li>
                <li>Digital load-cell mass verification</li>
                <li>Idempotent duplicate prevention</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Animated Connection Channels with Travelling Data Packets */}
        <div className="mt-8 p-4 rounded-xl border border-dashed border-industrial-border bg-industrial-bgSecondary/40">
          <div className="text-xs font-mono font-semibold text-industrial-textMuted uppercase mb-3 flex items-center justify-between">
            <span>Bidirectional Communication Bus & Event Flow</span>
            <span className="text-[11px] text-industrial-accent">Real-Time Packet Stream</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {/* Packet 1: MenuOS -> Robot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-white/70 dark:bg-black/20 border border-industrial-border/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-industrial-accent text-white text-[10px] font-semibold">
                  MenuOS → Robot
                </span>
                <span className="font-bold text-industrial-text">EXECUTION_REQUEST</span>
              </div>
              <div className="text-industrial-textMuted text-[11px] truncate">
                Payload: &#123; orderId: &quot;MNU-2048&quot;, targetPose: &quot;PICK_STATION&quot; &#125;
              </div>
              <span className="text-industrial-success font-semibold text-[11px]">DISPATCHED</span>
            </div>

            {/* Packet 2: MenuOS -> DS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-white/70 dark:bg-black/20 border border-industrial-border/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-industrial-accent text-white text-[10px] font-semibold">
                  MenuOS → DS
                </span>
                <span className="font-bold text-industrial-text">DISPENSE_AUTHORIZED</span>
              </div>
              <div className="text-industrial-textMuted text-[11px] truncate">
                Payload: &#123; opId: &quot;OP-2026-00481&quot;, ingredient: &quot;Tomato Sauce&quot;, grams: 50 &#125;
              </div>
              <span className="text-industrial-success font-semibold text-[11px]">AUTHORIZED</span>
            </div>

            {/* Packet 3: Robot <-> DS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-white/70 dark:bg-black/20 border border-industrial-border/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-industrial-warm text-white text-[10px] font-semibold">
                  Robot ↔ DS
                </span>
                <span className="font-bold text-industrial-text">JAR_PRESENT_VERIFIED</span>
              </div>
              <div className="text-industrial-textMuted text-[11px] truncate">
                Sensor: Optical Beam #1 Intercepted (Jar in alignment)
              </div>
              <span className="text-industrial-success font-semibold text-[11px]">INTERLOCK_OK</span>
            </div>

            {/* Packet 4: DS -> MenuOS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-white/70 dark:bg-black/20 border border-industrial-border/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-industrial-success text-white text-[10px] font-semibold">
                  DS → MenuOS
                </span>
                <span className="font-bold text-industrial-text">QUANTITY_CONFIRMED</span>
              </div>
              <div className="text-industrial-textMuted text-[11px] truncate">
                Receipt: 50.00g ±0.05g (Tx: DSP-00481)
              </div>
              <span className="text-industrial-success font-semibold text-[11px]">SIGNED_ACK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal when system is clicked */}
      {modalSystem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#202923] text-industrial-text dark:text-gray-100 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-industrial-border dark:border-[#38483d] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-inherit">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-industrial-bgSecondary dark:bg-black/40">
                  {modalSystem === 'MenuOS' && <Layers className="w-5 h-5 text-industrial-accent" />}
                  {modalSystem === 'Robotic Arm System' && <Cpu className="w-5 h-5 text-industrial-warm" />}
                  {modalSystem === 'Dispensing System (DS)' && <Droplet className="w-5 h-5 text-industrial-success" />}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">{systemsData[modalSystem].title}</h3>
                  <p className="text-xs text-industrial-textMuted">{systemsData[modalSystem].tagline}</p>
                </div>
              </div>
              <button 
                onClick={() => setModalSystem(null)}
                className="p-1 rounded-lg hover:bg-industrial-bgSecondary dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <span className="font-mono font-semibold uppercase text-industrial-textMuted">Communication Protocol:</span>
                <div className="font-mono mt-1 p-2 rounded bg-industrial-bgSecondary dark:bg-black/30 text-industrial-accent">
                  {systemsData[modalSystem].protocol}
                </div>
              </div>

              <div>
                <span className="font-mono font-semibold uppercase text-industrial-textMuted">Engineered Responsibilities:</span>
                <ul className="mt-2 space-y-1.5 list-disc list-inside text-industrial-text dark:text-gray-200">
                  {systemsData[modalSystem].responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono font-semibold uppercase text-industrial-textMuted">Active Payload Endpoints & Topics:</span>
                <div className="mt-2 space-y-1 font-mono">
                  {systemsData[modalSystem].interfaces.map((intf, i) => (
                    <div key={i} className="p-1.5 rounded bg-industrial-bgSecondary/60 dark:bg-white/5 border border-industrial-border/60">
                      {intf}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-inherit flex justify-end">
              <button
                onClick={() => setModalSystem(null)}
                className="px-4 py-2 rounded-lg bg-industrial-accent text-white font-medium hover:bg-industrial-accent/90 transition-colors text-xs"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

