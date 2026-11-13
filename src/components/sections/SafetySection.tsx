import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { Shield, ShieldAlert, AlertOctagon, RotateCcw, CheckCircle2, Lock, Activity, Eye, Zap } from 'lucide-react';
import { FaultScenarioId } from '../../types';
import { FAULT_CATALOG } from '../../state/simulationEngine';

export const SafetySection: React.FC = () => {
  const { 
    safetyState, 
    activeFault, 
    emergencyStop, 
    resetSimulation, 
    triggerFault, 
    resolveFault,
    jarPresent,
    gripperState
  } = useSimulation();

  const isEStop = safetyState === 'EMERGENCY_STOP';

  const faultScenarios: { id: FaultScenarioId; name: string }[] = [
    { id: 'COLLISION_RISK', name: '1. Collision Risk Detected' },
    { id: 'GRIPPER_FAILURE', name: '2. Gripper Pneumatics Failure' },
    { id: 'COMM_TIMEOUT', name: '3. Communication Heartbeat Timeout' },
    { id: 'MISSING_JAR', name: '4. Optical Missing Jar Interlock' },
    { id: 'QUANTITY_DEVIATION', name: '5. Dispense Quantity Deviation' },
    { id: 'CONTROLLER_UNRESPONSIVE', name: '6. Embedded Controller Unresponsive' }
  ];

  return (
    <section id="safety-preview" className="py-20 sm:py-24 bg-industrial-bgSecondary/40 border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-fault uppercase">
            05 // SAFETY, COLLISION AWARENESS & RECOVERY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Built around controlled and recoverable operations.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            Industrial robotics demands fail-safe operational integrity. Every trajectory is verified against dynamic collision envelopes, actuator lines feature hardware interlocks, and state recovery is strictly deterministic.
          </p>
        </div>

        {/* Master Safety Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 8 Safety Telemetry Interlocks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-industrial-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-industrial-accent" />
                  <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                    Continuous Interlock Matrix (ISO 10218-1)
                  </h4>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  isEStop ? 'bg-industrial-fault text-white animate-pulse' :
                  safetyState === 'INTERLOCKED' ? 'bg-industrial-warning text-white' :
                  'bg-industrial-success/15 text-industrial-success'
                }`}>
                  {safetyState}
                </span>
              </div>

              {/* 8 Interlock Monitors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs font-mono">
                {[
                  { name: 'Collision Envelope Monitor', state: activeFault === 'COLLISION_RISK' ? 'WARN' : 'NOMINAL', icon: Activity },
                  { name: 'Category 0 Emergency Stop', state: isEStop ? 'TRIPPED' : 'CLEAR', icon: AlertOctagon },
                  { name: 'Motion Spatial Limits', state: 'WITHIN_BOUNDS', icon: Lock },
                  { name: 'Pneumatic Gripper Pressure', state: activeFault === 'GRIPPER_FAILURE' ? 'LOW_PRESSURE' : '4.8 BAR [OK]', icon: Zap },
                  { name: 'Optical Jar Beam Sensor', state: jarPresent ? 'ALIGNED' : 'TRIPPED', icon: Eye },
                  { name: 'Dispensing Actuator Interlock', state: isEStop ? 'DE_ENERGIZED' : 'SECURE', icon: Shield },
                  { name: 'ROS 2 Heartbeat Watchdog', state: activeFault === 'COMM_TIMEOUT' ? 'TIMEOUT_250MS' : 'HEALTHY (50Hz)', icon: CheckCircle2 },
                  { name: 'MenuOS Operational Auth', state: 'HMAC_VERIFIED', icon: CheckCircle2 },
                ].map(({ name, state, icon: Icon }) => (
                  <div
                    key={name}
                    className="p-3 rounded-lg bg-industrial-bgSecondary/50 border border-industrial-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-4 h-4 text-industrial-accent flex-shrink-0" />
                      <span className="truncate text-industrial-text font-medium">{name}</span>
                    </div>
                    <span className={`text-[11px] font-bold ${
                      state === 'TRIPPED' || state === 'LOW_PRESSURE' || state === 'TIMEOUT_250MS'
                        ? 'text-industrial-fault'
                        : state === 'WARN' ? 'text-industrial-warning'
                        : 'text-industrial-success'
                    }`}>
                      {state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Fault Scenarios (PRD Section 13) */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm">
              <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text mb-3">
                Interactive Fault & Interlock Injection
              </h4>
              <p className="text-xs text-industrial-textMuted mb-4">
                Select an engineering fault to evaluate how the system isolates the subsystem, halts motion, preserves batch data, and mitigates risks:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {faultScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => triggerFault(scenario.id)}
                    className={`p-3 rounded-lg text-left text-xs font-mono border transition-all ${
                      activeFault === scenario.id
                        ? 'bg-industrial-fault/10 border-industrial-fault text-industrial-fault font-bold'
                        : 'bg-industrial-bgSecondary/60 border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                    }`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>

              {activeFault !== 'NONE' && (
                <div className="mt-4 p-4 rounded-xl bg-industrial-fault/10 border border-industrial-fault/30 space-y-2">
                  <div className="text-xs font-mono font-bold text-industrial-fault flex items-center justify-between">
                    <span>ACTIVE FAULT: {FAULT_CATALOG[activeFault].name}</span>
                    <span className="px-2 py-0.5 rounded bg-industrial-fault text-white text-[10px]">
                      {FAULT_CATALOG[activeFault].severity}
                    </span>
                  </div>
                  <p className="text-xs text-industrial-text">
                    {FAULT_CATALOG[activeFault].description}
                  </p>
                  <div className="p-2.5 rounded bg-white border border-industrial-fault/30 text-[11px] font-mono text-industrial-text">
                    <strong className="text-industrial-accent">AUTOMATED MITIGATION:</strong>{' '}
                    {FAULT_CATALOG[activeFault].mitigation}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={resolveFault}
                      className="px-4 py-2 rounded-lg bg-industrial-accent text-white text-xs font-semibold hover:bg-industrial-accent/90 transition-all"
                    >
                      Clear & Recover Subsystem
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Emergency Stop Demonstration Control */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 sm:p-8 rounded-2xl border-2 text-center transition-all ${
              isEStop
                ? 'bg-industrial-fault/10 border-industrial-fault shadow-xl'
                : 'bg-white border-industrial-border shadow-sm'
            }`}>
              <div className="w-16 h-16 rounded-full bg-industrial-fault/15 text-industrial-fault flex items-center justify-center mx-auto mb-4">
                <AlertOctagon className={`w-10 h-10 ${isEStop ? 'animate-bounce' : ''}`} />
              </div>

              <h4 className="text-lg font-bold font-heading text-industrial-text mb-2">
                Emergency Stop Circuit
              </h4>
              <p className="text-xs text-industrial-textMuted max-w-sm mx-auto mb-6">
                Category 0 immediate de-energization. Simulates instantaneous pneumatic and actuator dump valves.
              </p>

              {/* Physical E-Stop Button Simulation */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={emergencyStop}
                  className={`w-36 h-36 rounded-full border-8 border-gray-300 shadow-2xl transition-transform active:scale-95 flex flex-col items-center justify-center font-heading font-black text-white text-base uppercase tracking-wider ${
                    isEStop 
                      ? 'bg-industrial-fault ring-8 ring-industrial-fault/30' 
                      : 'bg-industrial-fault hover:brightness-110 ring-4 ring-black/10'
                  }`}
                >
                  <AlertOctagon className="w-8 h-8 mb-1" />
                  <span>E-STOP</span>
                </button>

                <div className="text-xs font-mono font-semibold">
                  {isEStop ? (
                    <span className="text-industrial-fault animate-pulse">
                      CIRCUIT TRIPPED — ACTUATORS DE-ENERGIZED
                    </span>
                  ) : (
                    <span className="text-industrial-success">
                      SAFETY RELAY HEALTHY — READY
                    </span>
                  )}
                </div>

                {/* Reset button */}
                <button
                  onClick={resetSimulation}
                  className="px-5 py-2.5 rounded-xl border border-industrial-border bg-industrial-bgSecondary hover:bg-industrial-border text-industrial-text text-xs font-mono font-semibold flex items-center gap-2 transition-all mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Perform Safety Relay Reset</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-industrial-border text-[11px] font-mono text-industrial-textMuted">
                Software simulation of safety interlocking. Not a replacement for a certified physical SIL-3 / ISO 13849 safety PLC.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

