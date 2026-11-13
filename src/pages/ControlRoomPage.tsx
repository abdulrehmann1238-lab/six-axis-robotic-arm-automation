import React, { useState } from 'react';
import { ControlRoomHeader } from '../components/controlRoom/ControlRoomHeader';
import { SubsystemCard } from '../components/controlRoom/SubsystemCard';
import { WorkflowTimeline } from '../components/controlRoom/WorkflowTimeline';
import { EventFeed } from '../components/controlRoom/EventFeed';
import { RoboticArmCanvas } from '../components/visualizers/RoboticArmCanvas';
import { DispensingVisualizer } from '../components/visualizers/DispensingVisualizer';
import { useSimulation } from '../state/simulationContext';
import { 
  Layers, 
  Cpu, 
  Droplet, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  RotateCcw,
  Sliders,
  Play,
  Pause,
  AlertOctagon,
  Copy
} from 'lucide-react';

export const ControlRoomPage: React.FC = () => {
  const { 
    isRunning, 
    isPaused, 
    safetyState, 
    joints, 
    cartesian, 
    currentPose, 
    measuredQuantity, 
    targetQuantity, 
    selectedIngredient,
    setArmPreset,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    emergencyStop,
    resetSimulation,
    testDuplicateRequest
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROBOT' | 'DISPENSING' | 'SAFETY'>('OVERVIEW');

  const isEStop = safetyState === 'EMERGENCY_STOP';

  return (
    <div className="pt-24 pb-20 min-h-screen bg-industrial-dark text-gray-100 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Demonstration Environment Watermark / Badge */}
        <div className="flex items-center justify-between text-xs font-mono px-4 py-2 rounded-xl bg-[#29342E] border border-[#3A4840]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-industrial-accentLight animate-pulse" />
            <span className="text-gray-300">
              SIMULATED SUPERVISORY CONTROL ROOM // ACTIVE KINEMATICS & LOAD-CELL SENSING
            </span>
          </div>
          <span className="text-gray-400 hidden sm:inline-block">
            Demonstration Mode: Pure deterministic frontend simulation engine.
          </span>
        </div>

        {/* Master Control Room Header & Speed Multiplier */}
        <ControlRoomHeader />

        {/* Three Large Subsystem Status Modules */}
        <SubsystemCard />

        {/* 9-Phase Horizontal Workflow Progress Timeline */}
        <WorkflowTimeline />

        {/* Main Central Viewport: Visualizers & Live Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Central Column: Visualizers */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visualizer Mode Tabs */}
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#232d26] border border-[#36463c] text-xs font-mono">
              <div className="flex items-center gap-1">
                {[
                  { id: 'OVERVIEW', label: 'Coordinated Twin (Both)' },
                  { id: 'ROBOT', label: '6-Axis Arm Only' },
                  { id: 'DISPENSING', label: 'Dispensing Unit Only' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-industrial-accent text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Waypoint Shortcut Triggers */}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
                <span className="text-gray-400">Arm Pose:</span>
                {(['HOME', 'PICK_POSITION', 'DISPENSE_POSITION', 'PLACE_POSITION'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setArmPreset(p)}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      currentPose === p
                        ? 'bg-industrial-accentLight/20 border-industrial-accentLight text-industrial-accentLight font-bold'
                        : 'bg-black/20 border-[#36463c] text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {p.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualizer Display Area */}
            {activeTab === 'OVERVIEW' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-mono font-semibold text-gray-400 uppercase mb-2 flex items-center justify-between">
                    <span>Kinematic 6-Axis Visualizer</span>
                    <span className="text-industrial-accentLight">ROS 2 Humble</span>
                  </div>
                  <RoboticArmCanvas theme="dark" className="h-[360px]" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-gray-400 uppercase mb-2 flex items-center justify-between">
                    <span>Dispensing Fluidics & Scale</span>
                    <span className="text-industrial-success">Load Cell ±0.05g</span>
                  </div>
                  <DispensingVisualizer theme="dark" className="h-[360px]" />
                </div>
              </div>
            )}

            {activeTab === 'ROBOT' && (
              <RoboticArmCanvas theme="dark" className="h-[460px]" />
            )}

            {activeTab === 'DISPENSING' && (
              <DispensingVisualizer theme="dark" className="h-[460px]" />
            )}

            {/* Live Telemetry Matrix */}
            <div className="p-4 rounded-xl bg-[#232d26] border border-[#36463c] font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#36463c] mb-3">
                <span className="font-bold text-gray-200 uppercase tracking-wider">
                  Real-Time Joint Coordinates & Actuator Telemetry
                </span>
                <span className="text-industrial-success text-[11px]">DDS FEED: 50.0 Hz</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J1 (Base)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j1}°</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J2 (Shoulder)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j2}°</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J3 (Elbow)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j3}°</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J4 (Wrist 1)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j4}°</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J5 (Wrist 2)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j5}°</div>
                </div>
                <div className="p-2 rounded bg-black/30 border border-[#36463c]">
                  <div className="text-gray-400">J6 (Flange)</div>
                  <div className="font-bold text-industrial-accentLight">{joints.j6}°</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Event Stream & Quick Commands */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Scrolling Event Feed Component */}
            <EventFeed />

            {/* Idempotency Test Shortcut */}
            <div className="p-4 rounded-xl bg-[#232d26] border border-[#36463c] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between font-bold text-gray-200">
                <span>Idempotency Guard Injection</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-industrial-warm/20 text-industrial-warm">
                  SAFEGUARD
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Test defensive duplicate-pour protection while simulation is active or in standby:
              </p>
              <button
                onClick={testDuplicateRequest}
                className="w-full py-2 rounded-lg bg-industrial-warm text-white font-semibold hover:bg-industrial-warm/90 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Simulate Duplicate Pour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
