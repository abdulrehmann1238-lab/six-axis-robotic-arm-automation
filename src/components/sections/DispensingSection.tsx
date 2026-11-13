import React, { useState } from 'react';
import { DispensingVisualizer } from '../visualizers/DispensingVisualizer';
import { useSimulation } from '../../state/simulationContext';
import { INGREDIENTS_CATALOG } from '../../state/simulationEngine';
import { IngredientType, FaultScenarioId } from '../../types';
import { Droplet, Play, Square, RotateCcw, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DispensingSection: React.FC = () => {
  const { 
    selectedIngredient, 
    targetQuantity, 
    measuredQuantity, 
    jarPresent, 
    dispenseAuthorized, 
    dispensingStatus,
    activeFault,
    setSelectedIngredient, 
    setTargetQuantity, 
    setJarPresent, 
    requestAuthorization, 
    runStandaloneDispense, 
    triggerFault, 
    resolveFault, 
    resetSimulation 
  } = useSimulation();

  const ingredients: IngredientType[] = [
    'Tomato Sauce',
    'Cheese',
    'Olive Oil',
    'Herb Mix',
    'Seasoning'
  ];

  const [selectedFault, setSelectedFault] = useState<FaultScenarioId>('NONE');

  const handleFaultChange = (f: FaultScenarioId) => {
    setSelectedFault(f);
    triggerFault(f);
  };

  return (
    <section id="dispensing-preview" className="py-20 sm:py-24 bg-industrial-bgSecondary/30 border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            03 // DISPENSING SUBSYSTEM (DS)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Precision dispensing, verified at every stage.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            An independently controlled dispensing subsystem that coordinates ingredient authorization, actuator operations, quantity measurement, and fault feedback.
          </p>
        </div>

        {/* Grid: Dispensing Equipment Visualizer & Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visualizer */}
          <div className="lg:col-span-7">
            <DispensingVisualizer />

            {/* Operational Sequence Indicator */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-industrial-border">
              <div className="text-xs font-mono font-semibold text-industrial-textMuted uppercase mb-3 flex items-center justify-between">
                <span>Closed-Loop Verification Sequence</span>
                <span className="text-industrial-accent font-bold">DS Controller MCU-02</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded border ${
                  jarPresent ? 'bg-industrial-success/10 border-industrial-success text-industrial-success' : 'bg-industrial-bgSecondary border-industrial-border text-industrial-textMuted'
                }`}>
                  <div className="font-bold">1. Beam Check</div>
                  <div className="text-[10px]">{jarPresent ? 'Jar Aligned' : 'Absent'}</div>
                </div>
                <div className={`p-2.5 rounded border ${
                  dispenseAuthorized ? 'bg-industrial-accent/10 border-industrial-accent text-industrial-accent' : 'bg-industrial-bgSecondary border-industrial-border text-industrial-textMuted'
                }`}>
                  <div className="font-bold">2. Auth Handshake</div>
                  <div className="text-[10px]">{dispenseAuthorized ? 'Token Verified' : 'Standby'}</div>
                </div>
                <div className={`p-2.5 rounded border ${
                  dispensingStatus === 'DISPENSING' ? 'bg-industrial-warning/15 border-industrial-warning text-industrial-warning' : 'bg-industrial-bgSecondary border-industrial-border text-industrial-textMuted'
                }`}>
                  <div className="font-bold">3. Pump Active</div>
                  <div className="text-[10px]">{dispensingStatus === 'DISPENSING' ? 'Pulsing' : 'Idle'}</div>
                </div>
                <div className={`p-2.5 rounded border ${
                  dispensingStatus === 'COMPLETED' ? 'bg-industrial-success/15 border-industrial-success text-industrial-success font-bold' : 'bg-industrial-bgSecondary border-industrial-border text-industrial-textMuted'
                }`}>
                  <div className="font-bold">4. Mass Receipt</div>
                  <div className="text-[10px]">{dispensingStatus === 'COMPLETED' ? '±0.05g Signed' : 'Pending'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispensing Control Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-industrial-border">
                <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  Dispense Configuration
                </h4>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-industrial-bgSecondary text-industrial-text">
                  STATUS: {dispensingStatus}
                </span>
              </div>

              {/* Ingredient Selection */}
              <div>
                <label className="block text-xs font-semibold text-industrial-text mb-2">
                  Select Target Ingredient
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ingredients.map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setSelectedIngredient(ing)}
                      className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        selectedIngredient === ing
                          ? 'bg-industrial-accent text-white border-industrial-accent shadow-sm'
                          : 'bg-industrial-bgSecondary/60 border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                      }`}
                    >
                      <div className="truncate font-semibold">{ing}</div>
                      <div className="text-[10px] opacity-75">{INGREDIENTS_CATALOG[ing].actuatorType.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Target Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="font-semibold text-industrial-text">Target Mass (Grams)</span>
                  <span className="font-bold text-industrial-accent text-sm">{targetQuantity} g</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-industrial-border rounded-lg appearance-none cursor-pointer accent-industrial-accent"
                />
                <div className="flex justify-between text-[10px] font-mono text-industrial-textMuted mt-1">
                  <span>5 g (Micro-dose)</span>
                  <span>50 g (Standard)</span>
                  <span>120 g (Bulk)</span>
                </div>
              </div>

              {/* Sensor & Interlock Verification */}
              <div className="p-3.5 rounded-lg bg-industrial-bgSecondary/50 border border-industrial-border flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-industrial-text">Optical Jar Sensor</div>
                  <div className="text-[11px] text-industrial-textMuted">Retroreflective Beam Alignment</div>
                </div>
                <button
                  onClick={() => setJarPresent(!jarPresent)}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold border transition-all ${
                    jarPresent
                      ? 'bg-industrial-success/15 border-industrial-success text-industrial-success'
                      : 'bg-industrial-fault/15 border-industrial-fault text-industrial-fault'
                  }`}
                >
                  {jarPresent ? 'JAR PRESENT [OK]' : 'JAR ABSENT [WARN]'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={requestAuthorization}
                  disabled={dispensingStatus === 'DISPENSING'}
                  className="px-4 py-2.5 rounded-lg border border-industrial-accent text-industrial-accent hover:bg-industrial-accent/10 font-semibold text-xs transition-colors"
                >
                  Request Authorization
                </button>
                <button
                  onClick={runStandaloneDispense}
                  disabled={dispensingStatus === 'DISPENSING'}
                  className="px-4 py-2.5 rounded-lg bg-industrial-accent text-white hover:bg-industrial-accent/90 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Dispense</span>
                </button>
              </div>
            </div>

            {/* Fault Injection Dropdown & Mitigation (PRD Section 10) */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-industrial-warning" />
                <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  Simulate Actuator / Sensor Fault
                </h4>
              </div>
              <p className="text-xs text-industrial-textMuted">
                Test defensive interlocks. The controller halts pumping, preserves transaction state, and logs the incident.
              </p>

              <select
                value={activeFault}
                onChange={(e) => handleFaultChange(e.target.value as FaultScenarioId)}
                className="w-full px-3 py-2 rounded-lg border border-industrial-border bg-industrial-bg font-mono text-xs focus:ring-2 focus:ring-industrial-accent"
              >
                <option value="NONE">NOMINAL (No Active Faults)</option>
                <option value="MISSING_JAR">Missing Jar (Optical Beam Broken)</option>
                <option value="QUANTITY_DEVIATION">Mass Flow Deviation (+14.8% surge)</option>
                <option value="COMM_TIMEOUT">Controller Bus Timeout (&gt; 250ms)</option>
                <option value="CONTROLLER_UNRESPONSIVE">MCU Peripheral Unresponsive</option>
              </select>

              {activeFault !== 'NONE' && (
                <div className="p-3 rounded-lg bg-industrial-fault/10 border border-industrial-fault/30 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 font-bold text-industrial-fault">
                    <ShieldAlert className="w-4 h-4" />
                    <span>FAULT ACTIVE: {activeFault}</span>
                  </div>
                  <div className="text-[11px] text-industrial-text">
                    Dispensing interlocked. Mass measurement halted to prevent overflow.
                  </div>
                  <button
                    onClick={resolveFault}
                    className="w-full mt-2 py-1.5 rounded bg-industrial-fault text-white font-semibold hover:bg-industrial-fault/90 text-[11px] transition-colors"
                  >
                    Execute Recovery Protocol & Clear Fault
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

