import React from 'react';
import { RoboticArmCanvas } from '../visualizers/RoboticArmCanvas';
import { useSimulation } from '../../state/simulationContext';
import { ArmPosePreset, GripperState } from '../../types';
import { Sliders, RotateCcw, CheckCircle2, ChevronRight, Activity, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoboticsSection: React.FC = () => {
  const { 
    joints, 
    cartesian, 
    currentPose, 
    gripperState, 
    robotStatus, 
    motionProgress,
    setArmPreset, 
    setCustomJoints, 
    setGripper, 
    resetSimulation 
  } = useSimulation();

  const presets: { id: ArmPosePreset; label: string }[] = [
    { id: 'HOME', label: 'Home Position' },
    { id: 'PICK_POSITION', label: 'Pick Position' },
    { id: 'DISPENSE_POSITION', label: 'Dispense Nest' },
    { id: 'PLACE_POSITION', label: 'Place Position' }
  ];

  const pipelineSteps = [
    { label: 'Command Received', active: true },
    { label: 'Motion Planning', active: robotStatus === 'PLANNING' || robotStatus === 'TRAJECTORY_EXEC' || robotStatus === 'IN_POSITION' },
    { label: 'Collision Check', active: robotStatus === 'TRAJECTORY_EXEC' || robotStatus === 'IN_POSITION' },
    { label: 'Trajectory Exec', active: robotStatus === 'TRAJECTORY_EXEC' || robotStatus === 'IN_POSITION' },
    { label: 'Position Verify', active: robotStatus === 'IN_POSITION' },
    { label: 'Completion Ack', active: robotStatus === 'IN_POSITION' }
  ];

  return (
    <section id="robotics-preview" className="py-20 sm:py-24 bg-industrial-bg border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            02 // ROBOTIC INTELLIGENCE & KINEMATICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Intelligence behind every movement.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            A modular robotic control environment designed to coordinate motion planning, object handling, positioning, and execution across six axes.
          </p>
        </div>

        {/* Visualizer & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 6-Axis Visualizer Canvas */}
          <div className="lg:col-span-7">
            <RoboticArmCanvas />

            {/* Illustrative Execution Pipeline */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-industrial-border">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-industrial-textMuted uppercase mb-3">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-industrial-accent" />
                  <span>ROS 2 Trajectory Execution Pipeline</span>
                </span>
                <span className="text-[10px] text-industrial-accent">Deterministic Spline</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {pipelineSteps.map((step, idx) => (
                  <div
                    key={step.label}
                    className={`p-2 rounded text-center text-[10px] font-mono border transition-all ${
                      step.active
                        ? 'bg-industrial-accent/10 border-industrial-accent text-industrial-accent font-semibold'
                        : 'bg-industrial-bgSecondary/40 border-industrial-border text-industrial-textMuted'
                    }`}
                  >
                    <div className="opacity-60 mb-0.5">0{idx + 1}</div>
                    <div className="truncate">{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Controls & Telemetry Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pose Presets & Gripper Controls */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  Kinematic Waypoint Presets
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-bgSecondary text-industrial-textMuted">
                  STATUS: {robotStatus}
                </span>
              </div>

              {/* Waypoint Preset Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setArmPreset(preset.id)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-semibold font-mono text-left border transition-all ${
                      currentPose === preset.id
                        ? 'bg-industrial-accent text-white border-industrial-accent shadow-sm'
                        : 'bg-industrial-bgSecondary/50 border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Gripper Direct Controls */}
              <div className="pt-4 border-t border-industrial-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-industrial-text">End-Effector Parallel Gripper</span>
                  <span className="text-xs font-mono font-bold text-industrial-accent">{gripperState}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setGripper('CLOSED')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      gripperState === 'CLOSED' || gripperState === 'HOLDING'
                        ? 'bg-industrial-warm text-white border-industrial-warm'
                        : 'bg-white border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                    }`}
                  >
                    Pneumatic Clamp (Grip)
                  </button>
                  <button
                    onClick={() => setGripper('OPEN')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      gripperState === 'OPEN'
                        ? 'bg-industrial-accent text-white border-industrial-accent'
                        : 'bg-white border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                    }`}
                  >
                    Release Stroke
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Joint Sliders */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-industrial-accent" />
                  <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                    Manual Joint Sliders
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-industrial-textMuted">Simulated 6-DOF</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { key: 'j1' as const, label: 'J1 (Base Azimuth)', min: -180, max: 180, val: joints.j1 },
                  { key: 'j2' as const, label: 'J2 (Shoulder Pitch)', min: -90, max: 110, val: joints.j2 },
                  { key: 'j3' as const, label: 'J3 (Elbow Pitch)', min: -110, max: 90, val: joints.j3 },
                  { key: 'j4' as const, label: 'J4 (Wrist Roll)', min: -180, max: 180, val: joints.j4 },
                  { key: 'j5' as const, label: 'J5 (Wrist Pitch)', min: -115, max: 115, val: joints.j5 },
                  { key: 'j6' as const, label: 'J6 (Tool Flange)', min: -360, max: 360, val: joints.j6 },
                ].map(({ key, label, min, max, val }) => (
                  <div key={key}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-industrial-textMuted">{label}</span>
                      <span className="font-bold text-industrial-accent">{val}°</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      value={val}
                      onChange={(e) => setCustomJoints({ [key]: Number(e.target.value) })}
                      className="w-full h-1.5 bg-industrial-border rounded-lg appearance-none cursor-pointer accent-industrial-accent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* End Effector Cartesian Coordinates Card */}
            <div className="p-4 rounded-xl bg-industrial-bgSecondary/60 border border-industrial-border text-xs font-mono">
              <div className="flex justify-between items-center mb-2 font-semibold text-industrial-text">
                <span>TCP CARTESIAN COORDINATES (mm)</span>
                <span className="text-[10px] text-industrial-accent">BASE_LINK REF</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-white border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted">X</div>
                  <div className="font-bold text-industrial-text">{cartesian.x} mm</div>
                </div>
                <div className="p-2 rounded bg-white border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted">Y</div>
                  <div className="font-bold text-industrial-text">{cartesian.y} mm</div>
                </div>
                <div className="p-2 rounded bg-white border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted">Z</div>
                  <div className="font-bold text-industrial-text">{cartesian.z} mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

