import React, { useState } from 'react';
import { useSimulation } from '../state/simulationContext';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Terminal, Activity, RotateCcw } from 'lucide-react';
import { RoboticArmCanvas } from '../components/visualizers/RoboticArmCanvas';
import { DispensingVisualizer } from '../components/visualizers/DispensingVisualizer';

interface TestScenario {
  id: string;
  name: string;
  category: 'Kinematics' | 'Sensor Interlock' | 'Communication' | 'Idempotency' | 'Quality';
  description: string;
  expectedBehavior: string;
  simulatedExecution: string;
  verdict: 'PASS' | 'INTERLOCKED_SAFE' | 'IDEMPOTENT_REJECT';
  durationMs: number;
}

export const SimulationPage: React.FC = () => {
  const { 
    startSimulation, 
    triggerFault, 
    resolveFault, 
    testDuplicateRequest,
    resetSimulation,
    addLog
  } = useSimulation();

  const scenarios: TestScenario[] = [
    {
      id: 'SCENARIO_1',
      name: '1. Standard Nominal Sequence',
      category: 'Kinematics',
      description: 'End-to-end automated 9-phase sequence with full trajectory execution and target mass verification.',
      expectedBehavior: 'All 6 joints interpolate smoothly; load-cell records 50.0g within ±0.05g tolerance; order finishes COMPLETED.',
      simulatedExecution: 'MenuOS dispatched ticket MNU-2048 -> ROS 2 MoveIt 2 executed spline -> DS metered 50.0g -> Outbound placement.',
      verdict: 'PASS',
      durationMs: 8200
    },
    {
      id: 'SCENARIO_2',
      name: '2. Optical Missing Jar Interlock',
      category: 'Sensor Interlock',
      description: 'Jar removed from dispensing nest right before actuation.',
      expectedBehavior: 'Optical beam sensor detects absence. Solenoid valve remains closed; zero ingredient dispensed.',
      simulatedExecution: 'Sensor retroreflective beam tripped -> DS status set to FAULT -> MenuOS workflow halted with JAR_ABSENT alarm.',
      verdict: 'INTERLOCKED_SAFE',
      durationMs: 2400
    },
    {
      id: 'SCENARIO_3',
      name: '3. Communication Heartbeat Watchdog',
      category: 'Communication',
      description: 'Simulates DDS packet loss on /joint_states > 250ms.',
      expectedBehavior: 'Safety watchdog triggers controlled deceleration ramp to zero velocity.',
      simulatedExecution: 'Heartbeat dropped -> Watchdog tripped -> Soft stop engaged -> Preserved order state without joint droop.',
      verdict: 'INTERLOCKED_SAFE',
      durationMs: 3100
    },
    {
      id: 'SCENARIO_4',
      name: '4. Dynamic Collision Envelope Check',
      category: 'Kinematics',
      description: 'Trajectory projected within 40mm of DS chassis frame.',
      expectedBehavior: 'MoveIt 2 collision checker detects violation prior to execution; recalculates obstacle-free trajectory.',
      simulatedExecution: 'Kinematic boundary check flagged proximity -> OMPL re-routed joint waypoints through safe envelope.',
      verdict: 'PASS',
      durationMs: 4500
    },
    {
      id: 'SCENARIO_5',
      name: '5. Mass Flow Deviation Recovery',
      category: 'Quality',
      description: 'Sudden flow rate surge (+14.8%) caused by fluidic aeration.',
      expectedBehavior: 'High-frequency load cell detects surge; PWM pulse rate throttled down to micro-step dosing.',
      simulatedExecution: 'Flow surge detected at 38g -> Pump pulsed at 25% duty cycle -> Reached target 50.0g with zero overfill.',
      verdict: 'PASS',
      durationMs: 5200
    },
    {
      id: 'SCENARIO_6',
      name: '6. Duplicate Dispensing Request (Idempotency)',
      category: 'Idempotency',
      description: 'Orchestrator network re-try issues duplicate transaction DSP-00481.',
      expectedBehavior: 'Hardware transaction ledger checks token; rejects replay with 409 Conflict.',
      simulatedExecution: 'DSP-00481 replayed -> DS memory cache matched timestamp -> Rejection logged -> Actuator remained de-energized.',
      verdict: 'IDEMPOTENT_REJECT',
      durationMs: 1800
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState<TestScenario>(scenarios[0]);
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);

  const runTest = (scenario: TestScenario) => {
    setSelectedScenario(scenario);
    setIsRunningScenario(true);
    setTestLog([`[T+0.00s] Initializing test harness for ${scenario.name}...`]);

    setTimeout(() => {
      setTestLog(prev => [...prev, `[T+0.80s] Injecting preconditions: ${scenario.category} scenario parameters.`]);
    }, 800);

    setTimeout(() => {
      setTestLog(prev => [...prev, `[T+1.50s] Verification: ${scenario.simulatedExecution}`]);
    }, 1500);

    setTimeout(() => {
      setTestLog(prev => [...prev, `[T+2.20s] TEST RESULT: ${scenario.verdict} (All defensive interlocks satisfied).`]);
      setIsRunningScenario(false);
      addLog('Safety Core', 'TEST_SCENARIO_COMPLETE', `Scenario ${scenario.name} finished with verdict ${scenario.verdict}.`, 'success');
    }, 2200);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-industrial-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-accent/10 border border-industrial-accent/20 text-industrial-accent text-xs font-mono font-semibold uppercase">
            <span>AUTOMATED COMMISSIONING & VALIDATION HARNESS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-industrial-text tracking-tight">
            Simulation & Operational Testing
          </h1>
          <p className="text-base sm:text-lg text-industrial-textMuted leading-relaxed">
            Validate robotic trajectories, fluidic tolerances, defensive interlocks, and communication idempotency in a deterministic simulated sandbox before deploying to physical hardware.
          </p>
        </div>

        {/* Performance Benchmark Summary Cards (PRD Section 15) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white border border-industrial-border shadow-sm">
            <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Simulated Cycles</span>
            <div className="text-2xl font-bold font-heading text-industrial-text mt-1">148</div>
            <span className="text-[10px] text-industrial-success font-semibold">100% Deterministic</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-industrial-border shadow-sm">
            <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Sequence Success Rate</span>
            <div className="text-2xl font-bold font-heading text-industrial-success mt-1">99.3%</div>
            <span className="text-[10px] text-industrial-textMuted">Zero Catastrophic Fails</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-industrial-border shadow-sm">
            <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Faults Isolated</span>
            <div className="text-2xl font-bold font-heading text-industrial-warm mt-1">12</div>
            <span className="text-[10px] text-industrial-textMuted">All Safely Recovered</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-industrial-border shadow-sm">
            <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Average Comm Latency</span>
            <div className="text-2xl font-bold font-heading text-industrial-accent mt-1">3.8 ms</div>
            <span className="text-[10px] text-industrial-textMuted">FastDDS Jitter: ±0.4ms</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-industrial-border shadow-sm">
            <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Duplicate Rejections</span>
            <div className="text-2xl font-bold font-heading text-industrial-text mt-1">18 / 18</div>
            <span className="text-[10px] text-industrial-success font-semibold">100% Idempotent</span>
          </div>
        </div>

        {/* Test Scenario Runner Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Selectable Scenarios List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-border">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-industrial-text">
                Selectable Test Scenarios
              </h3>
              <span className="text-xs font-mono text-industrial-textMuted">6 Verified Suites</span>
            </div>

            {scenarios.map((scen) => (
              <div
                key={scen.id}
                onClick={() => setSelectedScenario(scen)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedScenario.id === scen.id
                    ? 'bg-white border-industrial-accent ring-2 ring-industrial-accent/30 shadow-md'
                    : 'bg-white/80 border-industrial-border hover:bg-white text-industrial-text'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-bgSecondary text-industrial-accent font-semibold">
                    {scen.category}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${
                    scen.verdict === 'PASS' ? 'text-industrial-success' :
                    scen.verdict === 'IDEMPOTENT_REJECT' ? 'text-industrial-warm' :
                    'text-industrial-fault'
                  }`}>
                    {scen.verdict}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-industrial-text">
                  {scen.name}
                </h4>
                <p className="text-xs text-industrial-textMuted mt-1 line-clamp-2">
                  {scen.description}
                </p>
              </div>
            ))}
          </div>

          {/* Test Execution & Detailed Inspector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-industrial-border gap-3">
                <div>
                  <span className="text-xs font-mono font-semibold text-industrial-accent uppercase">
                    SCENARIO DETAILS // {selectedScenario.category}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-industrial-text mt-0.5">
                    {selectedScenario.name}
                  </h3>
                </div>

                <button
                  onClick={() => runTest(selectedScenario)}
                  disabled={isRunningScenario}
                  className="px-5 py-2.5 rounded-xl bg-industrial-accent text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 hover:bg-industrial-accent/90 transition-all shadow-sm disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningScenario ? 'Executing Test...' : 'Run Test Scenario'}</span>
                </button>
              </div>

              {/* Expected vs Simulated Breakdown */}
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-industrial-textMuted uppercase font-bold">
                    Test Scenario Scope:
                  </span>
                  <p className="text-industrial-text mt-1 font-sans">
                    {selectedScenario.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-industrial-bgSecondary/60 border border-industrial-border">
                  <span className="text-[10px] text-industrial-textMuted uppercase font-bold">
                    Expected System Behavior:
                  </span>
                  <p className="text-industrial-text mt-1 font-sans">
                    {selectedScenario.expectedBehavior}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-industrial-bgSecondary/60 border border-industrial-border">
                  <span className="text-[10px] text-industrial-textMuted uppercase font-bold">
                    Simulated Execution Observation:
                  </span>
                  <p className="text-industrial-text mt-1 font-sans">
                    {selectedScenario.simulatedExecution}
                  </p>
                </div>
              </div>

              {/* Execution Console Output */}
              <div className="p-4 rounded-xl bg-industrial-dark text-gray-200 border border-[#39493f] font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#39493f] text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-industrial-accentLight" />
                    <span>Harness Telemetry Log</span>
                  </span>
                  <span>VERDICT: {selectedScenario.verdict}</span>
                </div>

                <div className="space-y-1 pt-1 text-[11px]">
                  {testLog.length === 0 ? (
                    <div className="text-gray-500 py-2">Click &apos;Run Test Scenario&apos; to execute validation script.</div>
                  ) : (
                    testLog.map((line, i) => (
                      <div key={i} className="text-gray-300">{line}</div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Visualizer Preview in Simulation View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RoboticArmCanvas className="h-[280px]" />
              <DispensingVisualizer className="h-[280px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
