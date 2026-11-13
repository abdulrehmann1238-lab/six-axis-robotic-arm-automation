import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { Play, Pause, RotateCcw, AlertOctagon, Activity, Clock, ShieldCheck, Gauge } from 'lucide-react';

export const ControlRoomHeader: React.FC = () => {
  const { 
    isRunning, 
    isPaused, 
    speed, 
    safetyState, 
    startSimulation, 
    pauseSimulation, 
    resumeSimulation, 
    emergencyStop, 
    resetSimulation, 
    setSpeed 
  } = useSimulation();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isEStop = safetyState === 'EMERGENCY_STOP';

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#232d26] border border-[#36463c] text-gray-200 shadow-md space-y-4">
      {/* Top telemetry status bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#36463c] gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              isEStop ? 'bg-industrial-fault animate-ping' :
              isRunning ? 'bg-industrial-warning animate-pulse' :
              'bg-industrial-success'
            }`} />
            <span className="font-heading font-bold text-sm text-gray-100">
              INDUSTRIAL SUPERVISORY CONSOLE // MENUOS ↔ ROBOT ↔ DS
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/40 text-industrial-accentLight text-[10px]">
            NODE: CLUSTER_PRIMARY_01
          </span>
        </div>

        <div className="flex items-center gap-4 text-gray-300 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-industrial-accentLight" />
            <span>UTC {timeStr}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-industrial-success" />
            <span>LATENCY: 3.8 ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-industrial-accentLight" />
            <span className={isEStop ? 'text-industrial-fault font-bold' : 'text-industrial-success'}>
              {safetyState}
            </span>
          </div>
        </div>
      </div>

      {/* Main Control Actions & Simulation Speed Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Master Execution Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isRunning && !isPaused ? (
            <button
              onClick={startSimulation}
              disabled={isEStop}
              className="px-5 py-2.5 rounded-xl bg-industrial-accent text-white font-semibold text-xs flex items-center gap-2 hover:bg-industrial-accent/90 transition-all shadow-md disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 9-Phase Sequence</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeSimulation}
              disabled={isEStop}
              className="px-5 py-2.5 rounded-xl bg-industrial-accent text-white font-semibold text-xs flex items-center gap-2 hover:bg-industrial-accent/90 transition-all shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Sequence</span>
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="px-5 py-2.5 rounded-xl bg-industrial-warning text-white font-semibold text-xs flex items-center gap-2 hover:bg-industrial-warning/90 transition-all shadow-md"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Execution</span>
            </button>
          )}

          {/* Reset button */}
          <button
            onClick={resetSimulation}
            className="px-4 py-2.5 rounded-xl bg-black/30 border border-[#36463c] hover:bg-black/40 text-gray-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Context</span>
          </button>

          {/* Emergency Stop Button */}
          <button
            onClick={emergencyStop}
            className={`px-5 py-2.5 rounded-xl text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
              isEStop
                ? 'bg-industrial-fault ring-4 ring-industrial-fault/30'
                : 'bg-industrial-fault hover:brightness-110'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>EMERGENCY STOP</span>
          </button>
        </div>

        {/* Speed Selector (0.5x, 1x, 2x) */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#1b231e] p-1.5 rounded-xl border border-[#36463c]">
          <div className="flex items-center gap-1 px-2 text-gray-400">
            <Gauge className="w-3.5 h-3.5" />
            <span>Clock Speed:</span>
          </div>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                speed === s
                  ? 'bg-industrial-accent text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

