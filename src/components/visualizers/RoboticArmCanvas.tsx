import React, { useMemo } from 'react';
import { useSimulation } from '../../state/simulationContext';

interface RoboticArmCanvasProps {
  interactive?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const RoboticArmCanvas: React.FC<RoboticArmCanvasProps> = ({ 
  theme = 'light',
  className = ''
}) => {
  const { 
    joints, 
    cartesian, 
    gripperState, 
    gripperDistance, 
    robotStatus, 
    currentPose 
  } = useSimulation();

  const isDark = theme === 'dark';

  // Forward Kinematics 2D projection calculation for 6-axis visualization
  // Base origin: (250, 360)
  const armGeometry = useMemo(() => {
    const baseOrigin = { x: 250, y: 350 };
    
    // Base height
    const baseHeight = 50;
    const shoulderPivot = { x: baseOrigin.x, y: baseOrigin.y - baseHeight };

    // Joint 1: Base rotation affects perspective horizontal shift
    const j1Rad = (joints.j1 * Math.PI) / 180;
    const perspectiveShiftX = Math.sin(j1Rad) * 20;

    // Joint 2: Shoulder angle (relative to vertical)
    const j2Rad = ((joints.j2 - 90) * Math.PI) / 180;
    const upperArmLength = 120;
    const elbowPivot = {
      x: shoulderPivot.x + perspectiveShiftX + Math.cos(j2Rad) * upperArmLength,
      y: shoulderPivot.y + Math.sin(j2Rad) * upperArmLength
    };

    // Joint 3: Elbow angle
    const j3Relative = ((joints.j2 + joints.j3 - 90) * Math.PI) / 180;
    const forearmLength = 110;
    const wristPivot1 = {
      x: elbowPivot.x + Math.cos(j3Relative) * forearmLength,
      y: elbowPivot.y + Math.sin(j3Relative) * forearmLength
    };

    // Joint 4 & 5: Wrist pitch
    const wristAngle = ((joints.j2 + joints.j3 + joints.j5 - 90) * Math.PI) / 180;
    const wristLength = 45;
    const wristPivot2 = {
      x: wristPivot1.x + Math.cos(wristAngle) * wristLength,
      y: wristPivot1.y + Math.sin(wristAngle) * wristLength
    };

    // Tool Flange / End Effector
    const toolLength = 32;
    const endEffector = {
      x: wristPivot2.x + Math.cos(wristAngle) * toolLength,
      y: wristPivot2.y + Math.sin(wristAngle) * toolLength
    };

    // Gripper finger positions
    const normalAngle = wristAngle + Math.PI / 2;
    const spread = (gripperDistance / 45) * 16;
    const finger1 = {
      x: endEffector.x + Math.cos(normalAngle) * spread,
      y: endEffector.y + Math.sin(normalAngle) * spread
    };
    const finger2 = {
      x: endEffector.x - Math.cos(normalAngle) * spread,
      y: endEffector.y - Math.sin(normalAngle) * spread
    };

    return {
      baseOrigin,
      shoulderPivot,
      elbowPivot,
      wristPivot1,
      wristPivot2,
      endEffector,
      finger1,
      finger2,
      wristAngle
    };
  }, [joints, gripperDistance]);

  const hasContainer = gripperState === 'CLOSED' || gripperState === 'HOLDING';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none overflow-hidden rounded-xl border ${
      isDark 
        ? 'bg-[#1a221d] border-[#324037] text-gray-200' 
        : 'bg-[#F9FAF8] border-industrial-border text-industrial-text'
    } ${className}`}>
      {/* Top telemetry HUD overlay */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            robotStatus === 'TRAJECTORY_EXEC' ? 'bg-industrial-warning animate-ping' :
            robotStatus === 'FAULT' ? 'bg-industrial-fault' :
            'bg-industrial-success'
          }`} />
          <span className="font-semibold tracking-wider">
            ROBOT_6AXIS // {robotStatus}
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
            isDark ? 'bg-black/40 text-industrial-accentLight' : 'bg-industrial-bgSecondary text-industrial-text'
          }`}>
            POSE: {currentPose}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-80">
          <span>X: {cartesian.x}mm</span>
          <span>Y: {cartesian.y}mm</span>
          <span>Z: {cartesian.z}mm</span>
          <span>GRIP: {gripperState}</span>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <svg
        viewBox="0 0 520 420"
        className="w-full h-auto max-h-[460px] drop-shadow-sm transition-all duration-300"
      >
        <defs>
          {/* Subtle industrial gradients */}
          <linearGradient id="linkArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#4A5B51' : '#E5E8E2'} />
            <stop offset="100%" stopColor={isDark ? '#2D3832' : '#C5CCC1'} />
          </linearGradient>

          <linearGradient id="jointGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#6E8A7B' : '#7D9688'} />
            <stop offset="100%" stopColor={isDark ? '#3D4F45' : '#4E685B'} />
          </linearGradient>

          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#3A4840' : '#D1D6CD'} />
            <stop offset="100%" stopColor={isDark ? '#212924' : '#A4ACA0'} />
          </linearGradient>

          <pattern id="workTableGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke={isDark ? 'rgba(74, 91, 81, 0.25)' : 'rgba(180, 190, 175, 0.35)'}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Work Surface Table Grid */}
        <rect x="20" y="350" width="480" height="50" fill="url(#workTableGrid)" />
        <line
          x1="20"
          y1="350"
          x2="500"
          y2="350"
          stroke={isDark ? '#46554B' : '#C8D0C4'}
          strokeWidth="2"
        />

        {/* Staging / Pick Station on Left */}
        <g opacity="0.85">
          <rect
            x="70"
            y="335"
            width="55"
            height="15"
            rx="2"
            fill={isDark ? '#2F3C34' : '#E2E6DF'}
            stroke={isDark ? '#46554B' : '#B8C0B4'}
            strokeWidth="1.5"
          />
          <text
            x="97"
            y="346"
            textAnchor="middle"
            fontSize="8"
            fill={isDark ? '#8FA799' : '#657268'}
            fontFamily="JetBrains Mono"
          >
            PICK STN
          </text>
        </g>

        {/* Dispensing Station in Center-Right */}
        <g opacity="0.85">
          <rect
            x="395"
            y="335"
            width="65"
            height="15"
            rx="2"
            fill={isDark ? '#2F3C34' : '#E2E6DF'}
            stroke={isDark ? '#46554B' : '#B8C0B4'}
            strokeWidth="1.5"
          />
          <text
            x="427"
            y="346"
            textAnchor="middle"
            fontSize="8"
            fill={isDark ? '#8FA799' : '#657268'}
            fontFamily="JetBrains Mono"
          >
            DS NEST
          </text>
        </g>

        {/* Robot Pedestal / Base Turret (J1) */}
        <g>
          {/* Base mounting flange bolts */}
          <rect
            x={armGeometry.baseOrigin.x - 45}
            y={armGeometry.baseOrigin.y - 12}
            width="90"
            height="12"
            rx="3"
            fill="url(#baseGrad)"
            stroke={isDark ? '#4F6156' : '#949E90'}
            strokeWidth="1.5"
          />
          {/* Base riser cylinder */}
          <path
            d={`M ${armGeometry.baseOrigin.x - 32} ${armGeometry.baseOrigin.y - 12} 
               L ${armGeometry.baseOrigin.x - 26} ${armGeometry.shoulderPivot.y + 10} 
               L ${armGeometry.baseOrigin.x + 26} ${armGeometry.shoulderPivot.y + 10} 
               L ${armGeometry.baseOrigin.x + 32} ${armGeometry.baseOrigin.y - 12} Z`}
            fill="url(#baseGrad)"
            stroke={isDark ? '#4F6156' : '#949E90'}
            strokeWidth="1.5"
          />
          {/* J1 Turret Rotation Arc indicator */}
          <path
            d={`M ${armGeometry.baseOrigin.x - 22} ${armGeometry.baseOrigin.y - 2} 
               A 22 8 0 0 1 ${armGeometry.baseOrigin.x + 22} ${armGeometry.baseOrigin.y - 2}`}
            fill="none"
            stroke="#B18A62"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
        </g>

        {/* Upper Arm Link (Shoulder to Elbow, J2 -> J3) */}
        <line
          x1={armGeometry.shoulderPivot.x}
          y1={armGeometry.shoulderPivot.y}
          x2={armGeometry.elbowPivot.x}
          y2={armGeometry.elbowPivot.y}
          stroke="url(#linkArmGrad)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <line
          x1={armGeometry.shoulderPivot.x}
          y1={armGeometry.shoulderPivot.y}
          x2={armGeometry.elbowPivot.x}
          y2={armGeometry.elbowPivot.y}
          stroke={isDark ? '#677D70' : '#8A9685'}
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Forearm Link (Elbow to Wrist 1, J3 -> J4/J5) */}
        <line
          x1={armGeometry.elbowPivot.x}
          y1={armGeometry.elbowPivot.y}
          x2={armGeometry.wristPivot1.x}
          y2={armGeometry.wristPivot1.y}
          stroke="url(#linkArmGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Wrist Link (J5 to Tool Flange J6) */}
        <line
          x1={armGeometry.wristPivot1.x}
          y1={armGeometry.wristPivot1.y}
          x2={armGeometry.wristPivot2.x}
          y2={armGeometry.wristPivot2.y}
          stroke="url(#jointGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Joint 2 Housing (Shoulder) */}
        <circle
          cx={armGeometry.shoulderPivot.x}
          cy={armGeometry.shoulderPivot.y}
          r="16"
          fill="url(#jointGrad)"
          stroke={isDark ? '#8FA799' : '#334D3F'}
          strokeWidth="2"
        />
        <circle
          cx={armGeometry.shoulderPivot.x}
          cy={armGeometry.shoulderPivot.y}
          r="5"
          fill={isDark ? '#202923' : '#F5F5F1'}
        />

        {/* Joint 3 Housing (Elbow) */}
        <circle
          cx={armGeometry.elbowPivot.x}
          cy={armGeometry.elbowPivot.y}
          r="13"
          fill="url(#jointGrad)"
          stroke={isDark ? '#8FA799' : '#334D3F'}
          strokeWidth="2"
        />
        <circle
          cx={armGeometry.elbowPivot.x}
          cy={armGeometry.elbowPivot.y}
          r="4"
          fill={isDark ? '#202923' : '#F5F5F1'}
        />

        {/* Joint 4/5 Housing (Wrist) */}
        <circle
          cx={armGeometry.wristPivot1.x}
          cy={armGeometry.wristPivot1.y}
          r="9"
          fill="url(#jointGrad)"
          stroke={isDark ? '#8FA799' : '#334D3F'}
          strokeWidth="1.5"
        />

        {/* End Effector Flange (J6) */}
        <circle
          cx={armGeometry.wristPivot2.x}
          cy={armGeometry.wristPivot2.y}
          r="7"
          fill="#426B5B"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />

        {/* Parallel Gripper Body */}
        <line
          x1={armGeometry.wristPivot2.x}
          y1={armGeometry.wristPivot2.y}
          x2={armGeometry.endEffector.x}
          y2={armGeometry.endEffector.y}
          stroke={isDark ? '#7E9789' : '#33483D'}
          strokeWidth="8"
        />

        {/* Gripper Fingers (Pneumatic Stroke) */}
        <g stroke={isDark ? '#A9C4B4' : '#202724'} strokeWidth="3" strokeLinecap="square">
          <line
            x1={armGeometry.endEffector.x}
            y1={armGeometry.endEffector.y}
            x2={armGeometry.finger1.x}
            y2={armGeometry.finger1.y}
          />
          <line
            x1={armGeometry.finger1.x}
            y1={armGeometry.finger1.y}
            x2={armGeometry.finger1.x + Math.cos(armGeometry.wristAngle) * 14}
            y2={armGeometry.finger1.y + Math.sin(armGeometry.wristAngle) * 14}
          />
          <line
            x1={armGeometry.endEffector.x}
            y1={armGeometry.endEffector.y}
            x2={armGeometry.finger2.x}
            y2={armGeometry.finger2.y}
          />
          <line
            x1={armGeometry.finger2.x}
            y1={armGeometry.finger2.y}
            x2={armGeometry.finger2.x + Math.cos(armGeometry.wristAngle) * 14}
            y2={armGeometry.finger2.y + Math.sin(armGeometry.wristAngle) * 14}
          />
        </g>

        {/* Workpiece / Container held by gripper */}
        {hasContainer && (
          <g>
            <rect
              x={armGeometry.endEffector.x - 12 + Math.cos(armGeometry.wristAngle) * 8}
              y={armGeometry.endEffector.y - 12 + Math.sin(armGeometry.wristAngle) * 8}
              width="24"
              height="28"
              rx="4"
              fill={isDark ? '#B18A62' : '#C7A279'}
              stroke="#202724"
              strokeWidth="1.5"
              opacity="0.95"
            />
            {/* Liquid level inside container */}
            <rect
              x={armGeometry.endEffector.x - 10 + Math.cos(armGeometry.wristAngle) * 8}
              y={armGeometry.endEffector.y + 2 + Math.sin(armGeometry.wristAngle) * 8}
              width="20"
              height="12"
              rx="2"
              fill="#B45F57"
              opacity="0.8"
            />
          </g>
        )}

        {/* Coordinate Tool Center Point (TCP) Crosshair */}
        <g transform={`translate(${armGeometry.endEffector.x}, ${armGeometry.endEffector.y})`}>
          <line x1="0" y1="0" x2="16" y2="0" stroke="#B45F57" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2="-16" stroke="#56866A" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2" fill="#B18A62" />
        </g>
      </svg>

      {/* Joint angle mini-badges at bottom */}
      <div className={`w-full grid grid-cols-6 border-t text-[11px] font-mono py-2 text-center ${
        isDark ? 'bg-black/20 border-[#324037] text-gray-300' : 'bg-industrial-bgSecondary/60 border-industrial-border text-industrial-textMuted'
      }`}>
        <div>J1: <span className="font-semibold text-industrial-accent">{joints.j1}°</span></div>
        <div>J2: <span className="font-semibold text-industrial-accent">{joints.j2}°</span></div>
        <div>J3: <span className="font-semibold text-industrial-accent">{joints.j3}°</span></div>
        <div>J4: <span className="font-semibold text-industrial-accent">{joints.j4}°</span></div>
        <div>J5: <span className="font-semibold text-industrial-accent">{joints.j5}°</span></div>
        <div>J6: <span className="font-semibold text-industrial-accent">{joints.j6}°</span></div>
      </div>
    </div>
  );
};

