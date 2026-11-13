import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const initLabels = [
    'Loading system architecture',
    'Preparing robotic simulation',
    'Initializing communication modules',
    'Loading operational environment',
    'Establishing simulation readiness'
  ];

  useEffect(() => {
    const startTime = performance.now();
    const totalDuration = 2000; // 2 seconds

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(currentProgress);

      const nextLabelIndex = Math.min(
        initLabels.length - 1,
        Math.floor((currentProgress / 100) * initLabels.length)
      );
      setLabelIndex(nextLabelIndex);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-industrial-bg text-industrial-text transition-opacity duration-500 ${
      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Brand mark & Geometric Line Drawing */}
      <div className="flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated SVG 6-Axis Robotic Arm Line Illustration */}
        <div className="w-28 h-28 mb-8 relative">
          <svg viewBox="0 0 120 120" className="w-full h-full text-industrial-accent">
            {/* Base platform */}
            <line
              x1="20"
              y1="100"
              x2="100"
              y2="100"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <rect
              x="42"
              y="88"
              width="36"
              height="12"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Shoulder */}
            <circle cx="60" cy="80" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Link 1 (Lower Arm) */}
            <line
              x1="60"
              y1="80"
              x2="78"
              y2="48"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Elbow */}
            <circle cx="78" cy="48" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
            
            {/* Link 2 (Upper Arm) */}
            <line
              x1="78"
              y1="48"
              x2="48"
              y2="28"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Wrist */}
            <circle cx="48" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            
            {/* End Effector Gripper */}
            <line x1="48" y1="28" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
            <path
              d="M 34 16 L 38 20 L 34 24"
              fill="none"
              stroke="#B18A62"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Minimal Typography */}
        <div className="text-xs font-mono tracking-[0.25em] font-semibold text-industrial-accent uppercase mb-2">
          INTELLIGENT ROBOTIC SYSTEMS
        </div>
        <div className="text-sm font-heading font-medium text-industrial-textMuted mb-6">
          Initializing environment...
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-industrial-border h-1 rounded-full overflow-hidden mb-3">
          <div
            className="bg-industrial-accent h-full transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Rotating technical initialization label */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-industrial-textMuted">
          <span className="truncate">{initLabels[labelIndex]}</span>
          <span className="font-semibold text-industrial-accent ml-2">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

