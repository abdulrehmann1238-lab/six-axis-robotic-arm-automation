import React, { useState } from 'react';
import { DispensingVisualizer } from '../components/visualizers/DispensingVisualizer';
import { useSimulation } from '../state/simulationContext';
import { INGREDIENTS_CATALOG } from '../state/simulationEngine';
import { IngredientType, FaultScenarioId } from '../types';
import { Droplet, Play, RotateCcw, AlertTriangle, ShieldCheck, Copy, CheckCircle2, XCircle } from 'lucide-react';

export const DispensingPage: React.FC = () => {
  const { 
    selectedIngredient, 
    targetQuantity, 
    measuredQuantity, 
    dispenseRate,
    jarPresent, 
    dispenseAuthorized, 
    dispensingStatus,
    activeFault,
    operationId,
    transactionId,
    duplicateAttemptMessage,
    setSelectedIngredient, 
    setTargetQuantity, 
    setJarPresent, 
    requestAuthorization, 
    runStandaloneDispense, 
    testDuplicateRequest,
    clearDuplicateMessage,
    triggerFault, 
    resolveFault, 
    resetSimulation 
  } = useSimulation();

  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  const ingredients: IngredientType[] = [
    'Tomato Sauce',
    'Cheese',
    'Olive Oil',
    'Herb Mix',
    'Seasoning'
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-industrial-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-success/15 text-industrial-success text-xs font-mono font-semibold uppercase">
            <span>DISPENSING SYSTEM (DS) // ACTUATION & SCALE TELEMETRY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-industrial-text tracking-tight">
            Precision Dispensing Subsystem
          </h1>
          <p className="text-base sm:text-lg text-industrial-textMuted leading-relaxed">
            Closed-loop ingredient metering, load-cell mass feedback within ±0.05g, optical jar presence interlocks, and strict idempotent transaction protection.
          </p>
        </div>

        {/* Visualizer Canvas & Mode Switch */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-industrial-border">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-success animate-pulse" />
              <span className="font-bold text-industrial-text">PRECISION DISPENSING HARDWARE VISUALIZER</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-industrial-textMuted">Theme:</span>
              <button
                onClick={() => setActiveTheme(activeTheme === 'light' ? 'dark' : 'light')}
                className="px-2.5 py-1 rounded bg-industrial-bgSecondary hover:bg-industrial-border text-industrial-text font-semibold transition-colors"
              >
                {activeTheme.toUpperCase()}
              </button>
            </div>
          </div>

          <DispensingVisualizer theme={activeTheme} />
        </div>

        {/* Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Dispensing Workbench */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-5">
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                Actuator Calibration & Batch Recipe Tester
              </h3>

              {/* Ingredient Picker */}
              <div>
                <label className="block text-xs font-semibold text-industrial-text mb-2">
                  Target Ingredient Selection
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ingredients.map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setSelectedIngredient(ing)}
                      className={`p-2.5 rounded-lg text-xs font-mono border text-left transition-all ${
                        selectedIngredient === ing
                          ? 'bg-industrial-accent text-white border-industrial-accent shadow-sm'
                          : 'bg-industrial-bgSecondary/60 border-industrial-border hover:bg-industrial-bgSecondary text-industrial-text'
                      }`}
                    >
                      <div className="font-bold truncate">{ing}</div>
                      <div className="text-[10px] opacity-75">{INGREDIENTS_CATALOG[ing].density}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Grams Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="font-semibold text-industrial-text">Set Mass Target</span>
                  <span className="font-bold text-industrial-accent text-base">{targetQuantity} grams</span>
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
              </div>

              {/* Jar Alignment Interlock Toggle */}
              <div className="p-4 rounded-xl bg-industrial-bgSecondary/50 border border-industrial-border flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="font-bold text-industrial-text">Optical Retroreflective Beam Sensor</div>
                  <div className="text-[11px] text-industrial-textMuted">Checks container presence prior to pump energization</div>
                </div>
                <button
                  onClick={() => setJarPresent(!jarPresent)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    jarPresent
                      ? 'bg-industrial-success/15 border-industrial-success text-industrial-success'
                      : 'bg-industrial-fault/15 border-industrial-fault text-industrial-fault'
                  }`}
                >
                  {jarPresent ? 'JAR SEATED [OK]' : 'JAR MISSING [TRIPPED]'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={requestAuthorization}
                  disabled={dispensingStatus === 'DISPENSING'}
                  className="px-4 py-2.5 rounded-lg border border-industrial-accent text-industrial-accent hover:bg-industrial-accent/10 font-semibold text-xs font-mono transition-colors"
                >
                  Request Auth Handshake
                </button>
                <button
                  onClick={runStandaloneDispense}
                  disabled={dispensingStatus === 'DISPENSING'}
                  className="px-4 py-2.5 rounded-lg bg-industrial-accent text-white hover:bg-industrial-accent/90 font-semibold text-xs font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Dispense</span>
                </button>
              </div>
            </div>

            {/* Actuator Specifications Table */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                Actuator Specifications & Fluidic Characteristics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-industrial-bgSecondary text-industrial-textMuted border-b border-industrial-border">
                    <tr>
                      <th className="py-2 px-3">Ingredient</th>
                      <th className="py-2 px-3">Actuator Hardware</th>
                      <th className="py-2 px-3">Nominal Flow Rate</th>
                      <th className="py-2 px-3">Fluidic Class</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-border">
                    {ingredients.map(ing => {
                      const item = INGREDIENTS_CATALOG[ing];
                      return (
                        <tr key={ing}>
                          <td className="py-2 px-3 font-bold text-industrial-text">{ing}</td>
                          <td className="py-2 px-3 text-industrial-accent font-semibold">{item.actuatorType}</td>
                          <td className="py-2 px-3 text-industrial-text">{item.flowRate} g/s</td>
                          <td className="py-2 px-3 text-industrial-textMuted">{item.type}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Idempotency Protection Showcase & Fault Injection */}
          <div className="lg:col-span-5 space-y-6">
            {/* Duplicate Dispensing Prevention Card */}
            <div className="p-6 rounded-xl bg-white border-2 border-industrial-warm/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-industrial-warm" />
                <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  Duplicate Dispense Prevention
                </h3>
              </div>
              <p className="text-xs text-industrial-textMuted leading-relaxed">
                Client-critical idempotency verification. Simulates an orchestrated replay to demonstrate rejection at the DS controller level:
              </p>

              <div className="p-3 rounded-lg bg-industrial-bgSecondary/60 font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">Transaction UUID:</span>
                  <span className="font-bold text-industrial-accent">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">Operation Token:</span>
                  <span className="font-bold text-industrial-text">{operationId}</span>
                </div>
              </div>

              <button
                onClick={testDuplicateRequest}
                className="w-full py-2.5 rounded-lg bg-industrial-warm text-white hover:bg-industrial-warm/90 font-semibold text-xs font-mono transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Simulate Duplicate Request</span>
              </button>

              {duplicateAttemptMessage && (
                <div className="p-3.5 rounded-lg bg-industrial-fault/10 border border-industrial-fault/30 text-xs font-mono space-y-2 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between font-bold text-industrial-fault">
                    <span>409 CONFLICT: IDEMPOTENT REJECT</span>
                    <button onClick={clearDuplicateMessage} className="hover:underline">✕</button>
                  </div>
                  <p className="text-[11px] text-industrial-text">
                    {duplicateAttemptMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Fault Recovery Simulator */}
            <div className="p-6 rounded-xl bg-white border border-industrial-border shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-industrial-warning" />
                <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-industrial-text">
                  Dispensing Fault Recovery
                </h3>
              </div>
              <p className="text-xs text-industrial-textMuted">
                Test defensive interlocks. The controller halts pumping, preserves transaction state, and logs the incident:
              </p>

              <select
                value={activeFault}
                onChange={(e) => triggerFault(e.target.value as FaultScenarioId)}
                className="w-full px-3 py-2 rounded-lg border border-industrial-border bg-industrial-bg font-mono text-xs focus:ring-2 focus:ring-industrial-accent"
              >
                <option value="NONE">NOMINAL (Sensors & Actuators Healthy)</option>
                <option value="MISSING_JAR">Missing Jar (Beam Interrupted)</option>
                <option value="QUANTITY_DEVIATION">Mass Flow Deviation (+14.8% surge)</option>
                <option value="COMM_TIMEOUT">Controller Bus Timeout (&gt; 250ms)</option>
                <option value="CONTROLLER_UNRESPONSIVE">MCU Peripheral Unresponsive</option>
              </select>

              {activeFault !== 'NONE' && (
                <div className="p-3 rounded-lg bg-industrial-fault/10 border border-industrial-fault/30 text-xs font-mono space-y-2">
                  <div className="font-bold text-industrial-fault">
                    FAULT DETECTED: {activeFault}
                  </div>
                  <button
                    onClick={resolveFault}
                    className="w-full py-1.5 rounded bg-industrial-accent text-white font-semibold text-xs hover:bg-industrial-accent/90 transition-colors"
                  >
                    Clear Fault & Reset Interlock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
