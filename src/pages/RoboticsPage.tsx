import React, { useState } from 'react';
import { RoboticArmCanvas } from '../components/visualizers/RoboticArmCanvas';
import { useSimulation } from '../state/simulationContext';
import { Sliders, RotateCcw, Play, CheckCircle2, Terminal, Cpu, Move, Zap } from 'lucide-react';
import { ArmPosePreset } from '../types';

export const RoboticsPage: React.FC = () => {
  const { 
    joints, 
    cartesian, 
    currentPose, 
    gripperState, 
    gripperDistance, 
    robotStatus, 
    motionProgress,
    setArmPreset, 
    setCustomJoints, 
    setGripper, 
    resetSimulation,
    addLog
  } = useSimulation();

  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  // Motion Sequence Playground Actions (PRD Section 9)
  const [activeStep, setActiveStep] = useState<string>('IDLE');

  const runSequenceStep = (stepName: string, preset: ArmPosePreset, gripAction?: 'OPEN' | 'CLOSED') => {
    setActiveStep(stepName);
    setArmPreset(preset);
    if (gripAction) {
      setTimeout(() => {
        setGripper(gripAction);
      }, 1200);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-industrial-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-warm/15 text-industrial-warm text-xs font-mono font-semibold uppercase">
            <span>ROS 2 HUMBLE // MOVEIT 2 KINEMATICS ENGINE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-industrial-text tracking-tight">
            Six-Axis Robotic Intelligence
          </h1>
          <p className="text-base sm:text-lg text-industrial-textMuted leading-relaxed">
            Precision 6-DOF trajectory generation, forward and inverse kinematics solving, and obstacle-aware tool-center-point (TCP) positioning for automated food preparation.
          </p>
        </div>

        {/* Visualizer Canvas & Theme Toggle */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-industrial-border">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-success animate-pulse" />
              <span className="font-bold text-industrial-text">INTERACTIVE 6-AXIS KINEMATIC SIMULATOR</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-industrial-textMuted">Visual Mode:</span>
              <button
                onClick={() => setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')}
                className="px-2.5 py-1 rounded bg-industrial-bgSecondary hover:bg-industrial-border text-industrial-text font-semibold transition-colors"
              >
                {activeTheme.toUpperCase()}
              </button>
            </div>
          </div>

          <RoboticArmCanvas theme={activeTheme} />
        </div>

        {/* Two-Column Workbench: Sliders & Presets vs ROS 2 Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Kinematics Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Motion Sequence Playground (PRD Section 9) */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-industrial-accent" />
                  <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                    Motion Sequence Playground
                  </h3>
                </div>
                <span className="text-xs font-mono text-industrial-accent font-semibold">
                  ACTIVE: {activeStep}
                </span>
              </div>
              <p className="text-xs text-industrial-textMuted">
                Trigger discrete multi-axis operations to evaluate joint polynomial transitions and gripper synchronization:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => runSequenceStep('Pick Object', 'PICK_POSITION', 'CLOSED')}
                  className="p-3 rounded-lg border border-industrial-border hover:border-industrial-accent bg-industrial-bgSecondary/50 hover:bg-industrial-bgSecondary text-xs font-mono font-semibold text-industrial-text text-left transition-all"
                >
                  <div className="text-industrial-accent font-bold">1. Pick Object</div>
                  <div className="text-[10px] text-industrial-textMuted">Move to Staging & Clamp Vessel</div>
                </button>

                <button
                  onClick={() => runSequenceStep('Move to Dispenser', 'DISPENSE_POSITION')}
                  className="p-3 rounded-lg border border-industrial-border hover:border-industrial-accent bg-industrial-bgSecondary/50 hover:bg-industrial-bgSecondary text-xs font-mono font-semibold text-industrial-text text-left transition-all"
                >
                  <div className="text-industrial-accent font-bold">2. Move to Dispenser</div>
                  <div className="text-[10px] text-industrial-textMuted">Align Under Nozzle Nest</div>
                </button>

                <button
                  onClick={() => runSequenceStep('Place Object', 'PLACE_POSITION', 'OPEN')}
                  className="p-3 rounded-lg border border-industrial-border hover:border-industrial-accent bg-industrial-bgSecondary/50 hover:bg-industrial-bgSecondary text-xs font-mono font-semibold text-industrial-text text-left transition-all"
                >
                  <div className="text-industrial-accent font-bold">3. Place Object</div>
                  <div className="text-[10px] text-industrial-textMuted">Transfer to Outbound Conveyor</div>
                </button>

                <button
                  onClick={() => runSequenceStep('Return to Home', 'HOME')}
                  className="p-3 rounded-lg border border-industrial-border hover:border-industrial-accent bg-industrial-bgSecondary/50 hover:bg-industrial-bgSecondary text-xs font-mono font-semibold text-industrial-text text-left transition-all"
                >
                  <div className="text-industrial-accent font-bold">4. Return Home</div>
                  <div className="text-[10px] text-industrial-textMuted">Standard Calibrated Stance</div>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={resetSimulation}
                  className="text-xs font-mono text-industrial-textMuted hover:text-industrial-text flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Joints to Calibrated 0°</span>
                </button>
              </div>
            </div>

            {/* Joint Angle Telemetry Table */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                Joint Limit & Velocity Calibration
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-industrial-bgSecondary text-industrial-textMuted border-b border-industrial-border">
                    <tr>
                      <th className="py-2 px-3">Joint</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Angle</th>
                      <th className="py-2 px-3">Soft Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-border">
                    {[
                      { j: 'J1', role: 'Base Turret Azimuth', val: joints.j1, lim: '-180° / +180°' },
                      { j: 'J2', role: 'Shoulder Pitch Link', val: joints.j2, lim: '-90° / +110°' },
                      { j: 'J3', role: 'Elbow Pitch Link', val: joints.j3, lim: '-110° / +90°' },
                      { j: 'J4', role: 'Forearm Roll (Wrist 1)', val: joints.j4, lim: '-180° / +180°' },
                      { j: 'J5', role: 'Wrist Pitch (Wrist 2)', val: joints.j5, lim: '-115° / +115°' },
                      { j: 'J6', role: 'Tool Flange Roll', val: joints.j6, lim: '-360° / +360°' },
                    ].map(item => (
                      <tr key={item.j}>
                        <td className="py-2 px-3 font-bold text-industrial-accent">{item.j}</td>
                        <td className="py-2 px-3 text-industrial-text">{item.role}</td>
                        <td className="py-2 px-3 font-bold text-industrial-text">{item.val}°</td>
                        <td className="py-2 px-3 text-industrial-textMuted">{item.lim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: ROS 2 Architecture & Trajectory Solver */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-industrial-accent" />
                <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  ROS 2 Technical Stack Integration
                </h3>
              </div>
              <p className="text-xs text-industrial-textMuted">
                Production-grade robotics software pipeline designed for modular industrial integration:
              </p>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-industrial-bgSecondary/60 border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted uppercase">Middleware Layer</div>
                  <div className="font-bold text-industrial-text">ROS 2 Humble / FastDDS Real-time Network</div>
                </div>

                <div className="p-3 rounded-lg bg-industrial-bgSecondary/60 border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted uppercase">Motion Planning Framework</div>
                  <div className="font-bold text-industrial-text">MoveIt 2 / OMPL RRTConnect Collision-Free Solver</div>
                </div>

                <div className="p-3 rounded-lg bg-industrial-bgSecondary/60 border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted uppercase">Hardware Control Abstraction</div>
                  <div className="font-bold text-industrial-text">ros2_control JointTrajectoryController (50Hz)</div>
                </div>

                <div className="p-3 rounded-lg bg-industrial-bgSecondary/60 border border-industrial-border">
                  <div className="text-[10px] text-industrial-textMuted uppercase">State Feedback Topics</div>
                  <div className="font-bold text-industrial-accent">/joint_states (sensor_msgs/JointState)</div>
                </div>
              </div>
            </div>

            {/* Live Cartesian TCP Card */}
            <div className="p-6 rounded-xl bg-industrial-dark text-gray-200 border border-[#39493f] shadow-sm space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#39493f]">
                <span className="font-bold text-gray-100 uppercase">Tool Center Point (TCP) Telemetry</span>
                <span className="px-2 py-0.5 rounded bg-industrial-accent/20 text-industrial-accentLight text-[10px]">
                  WORLD_FRAME
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded bg-black/30 border border-[#39493f]">
                  <div className="text-[10px] text-gray-400">Position X</div>
                  <div className="text-base font-bold text-industrial-accentLight">{cartesian.x} mm</div>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-[#39493f]">
                  <div className="text-[10px] text-gray-400">Position Y</div>
                  <div className="text-base font-bold text-industrial-accentLight">{cartesian.y} mm</div>
                </div>
                <div className="p-2.5 rounded bg-black/30 border border-[#39493f]">
                  <div className="text-[10px] text-gray-400">Position Z</div>
                  <div className="text-base font-bold text-industrial-accentLight">{cartesian.z} mm</div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Pneumatic Stroke: {gripperDistance} mm</span>
                <span>Pneumatic Pressure: 4.8 Bar (Nominal)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
