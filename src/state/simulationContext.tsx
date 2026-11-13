import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  JointAngles, 
  CartesianCoord, 
  ArmPosePreset, 
  GripperState, 
  IngredientType, 
  ProductionOrder, 
  TelemetryLog, 
  WorkflowPhase, 
  WorkflowStep, 
  MenuOSStatus, 
  RobotArmStatus, 
  DispensingStatus, 
  SafetyState, 
  FaultScenarioId,
  IdempotencyRecord
} from '../types';
import { 
  POSE_PRESETS, 
  INITIAL_ORDER, 
  WORKFLOW_STEPS, 
  FAULT_CATALOG,
  INGREDIENTS_CATALOG 
} from './simulationEngine';

interface SimulationContextType {
  // Global simulation controls
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentPhase: WorkflowPhase;
  currentPhaseIndex: number;
  workflowSteps: WorkflowStep[];
  progressPercent: number;

  // Subsystem statuses
  menuOSStatus: MenuOSStatus;
  robotStatus: RobotArmStatus;
  dispensingStatus: DispensingStatus;
  safetyState: SafetyState;

  // Robotic Arm Telemetry
  joints: JointAngles;
  cartesian: CartesianCoord;
  currentPose: ArmPosePreset;
  gripperState: GripperState;
  gripperDistance: number; // 0 to 45 mm
  motionProgress: number; // 0 to 100%

  // Dispensing Telemetry
  selectedIngredient: IngredientType;
  targetQuantity: number;
  measuredQuantity: number;
  dispenseRate: number;
  jarPresent: boolean;
  dispenseAuthorized: boolean;
  activeActuator: string;
  operationId: string;
  transactionId: string;
  idempotencyRecords: IdempotencyRecord[];
  duplicateAttemptMessage: string | null;

  // Order state (MenuOS)
  currentOrder: ProductionOrder;
  orderHistory: ProductionOrder[];

  // Event & Telemetry Logs
  logs: TelemetryLog[];
  activeFault: FaultScenarioId;

  // Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  emergencyStop: () => void;
  resetSimulation: () => void;
  setSpeed: (multiplier: number) => void;
  setArmPreset: (preset: ArmPosePreset) => void;
  setCustomJoints: (joints: Partial<JointAngles>) => void;
  setGripper: (state: GripperState) => void;
  setSelectedIngredient: (ingredient: IngredientType) => void;
  setTargetQuantity: (grams: number) => void;
  setJarPresent: (present: boolean) => void;
  requestAuthorization: () => void;
  runStandaloneDispense: () => void;
  testDuplicateRequest: () => void;
  triggerFault: (fault: FaultScenarioId) => void;
  resolveFault: () => void;
  clearDuplicateMessage: () => void;
  addLog: (source: TelemetryLog['source'], eventType: string, message: string, level?: TelemetryLog['level'], payload?: any) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master control state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeedState] = useState(1.0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(WORKFLOW_STEPS);
  const [progressPercent, setProgressPercent] = useState(0);

  // Subsystem states
  const [menuOSStatus, setMenuOSStatus] = useState<MenuOSStatus>('READY');
  const [robotStatus, setRobotStatus] = useState<RobotArmStatus>('IDLE');
  const [dispensingStatus, setDispensingStatus] = useState<DispensingStatus>('READY');
  const [safetyState, setSafetyState] = useState<SafetyState>('NOMINAL');

  // Robotic Arm state
  const [joints, setJoints] = useState<JointAngles>(POSE_PRESETS.HOME.joints);
  const [cartesian, setCartesian] = useState<CartesianCoord>(POSE_PRESETS.HOME.cartesian);
  const [currentPose, setCurrentPose] = useState<ArmPosePreset>('HOME');
  const [gripperState, setGripperState] = useState<GripperState>('OPEN');
  const [gripperDistance, setGripperDistance] = useState(45);
  const [motionProgress, setMotionProgress] = useState(0);

  // Dispensing state
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientType>('Tomato Sauce');
  const [targetQuantity, setTargetQuantity] = useState(50);
  const [measuredQuantity, setMeasuredQuantity] = useState(0);
  const [dispenseRate, setDispenseRate] = useState(0);
  const [jarPresent, setJarPresent] = useState(true);
  const [dispenseAuthorized, setDispenseAuthorized] = useState(false);
  const [activeActuator, setActiveActuator] = useState('Standby');
  const [operationId, setOperationId] = useState('OP-2026-00481');
  const [transactionId, setTransactionId] = useState('DSP-00481');
  const [idempotencyRecords, setIdempotencyRecords] = useState<IdempotencyRecord[]>([]);
  const [duplicateAttemptMessage, setDuplicateAttemptMessage] = useState<string | null>(null);

  // Order state
  const [currentOrder, setCurrentOrder] = useState<ProductionOrder>(INITIAL_ORDER);
  const [orderHistory, setOrderHistory] = useState<ProductionOrder[]>([]);

  // Telemetry & Safety
  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: 'init-1',
      timestamp: '10:42:00.100',
      source: 'Safety Core',
      eventType: 'SYSTEM_BOOT',
      message: 'All ROS 2 nodes and embedded hardware peripherals online. Readiness verified.',
      level: 'info'
    },
    {
      id: 'init-2',
      timestamp: '10:42:00.850',
      source: 'MenuOS',
      eventType: 'QUEUE_STANDBY',
      message: 'Orchestrator ready. Awaiting production batch dispatch.',
      level: 'info'
    }
  ]);
  const [activeFault, setActiveFault] = useState<FaultScenarioId>('NONE');

  // Helper to append logs
  const addLog = useCallback((
    source: TelemetryLog['source'], 
    eventType: string, 
    message: string, 
    level: TelemetryLog['level'] = 'info', 
    payload?: any
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timeStr,
      source,
      eventType,
      message,
      level,
      payload
    };
    setLogs(prev => [newLog, ...prev.slice(0, 199)]);
  }, []);

  // Update speed
  const setSpeed = (multiplier: number) => {
    setSpeedState(multiplier);
    addLog('MenuOS', 'EXECUTION_SPEED_CHANGED', `Simulation clock scaled to ${multiplier}x real-time.`, 'info');
  };

  // Interpolate joint angles over duration
  const animateToPose = useCallback((targetPreset: ArmPosePreset, durationMs: number = 1800) => {
    const target = POSE_PRESETS[targetPreset];
    setCurrentPose(targetPreset);
    setRobotStatus('TRAJECTORY_EXEC');
    
    const startTime = performance.now();
    const startJoints = { ...joints };
    const startCartesian = { ...cartesian };

    const actualDuration = durationMs / speed;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / actualDuration);
      // Smooth cubic bezier ease-in-out
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setJoints({
        j1: Math.round((startJoints.j1 + (target.joints.j1 - startJoints.j1) * ease) * 10) / 10,
        j2: Math.round((startJoints.j2 + (target.joints.j2 - startJoints.j2) * ease) * 10) / 10,
        j3: Math.round((startJoints.j3 + (target.joints.j3 - startJoints.j3) * ease) * 10) / 10,
        j4: Math.round((startJoints.j4 + (target.joints.j4 - startJoints.j4) * ease) * 10) / 10,
        j5: Math.round((startJoints.j5 + (target.joints.j5 - startJoints.j5) * ease) * 10) / 10,
        j6: Math.round((startJoints.j6 + (target.joints.j6 - startJoints.j6) * ease) * 10) / 10,
      });

      setCartesian({
        x: Math.round(startCartesian.x + (target.cartesian.x - startCartesian.x) * ease),
        y: Math.round(startCartesian.y + (target.cartesian.y - startCartesian.y) * ease),
        z: Math.round(startCartesian.z + (target.cartesian.z - startCartesian.z) * ease),
        roll: Math.round(startCartesian.roll + (target.cartesian.roll - startCartesian.roll) * ease),
        pitch: Math.round(startCartesian.pitch + (target.cartesian.pitch - startCartesian.pitch) * ease),
        yaw: Math.round(startCartesian.yaw + (target.cartesian.yaw - startCartesian.yaw) * ease),
      });

      setMotionProgress(Math.round(progress * 100));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setRobotStatus(targetPreset === 'HOME' ? 'IDLE' : 'IN_POSITION');
      }
    };

    requestAnimationFrame(step);
  }, [joints, cartesian, speed]);

  // Set Arm Preset manually
  const setArmPreset = (preset: ArmPosePreset) => {
    if (safetyState === 'EMERGENCY_STOP') {
      addLog('Safety Core', 'MOTION_INHIBITED', 'Action denied: Emergency Stop circuit engaged.', 'error');
      return;
    }
    animateToPose(preset, 1500);
    addLog('Robotic Arm', 'POSE_TARGET_ACQUIRED', `Moving to waypoint ${preset}. Trajectory generated via MoveIt 2.`, 'info');
  };

  // Set Custom Joint angles manually (for sliders)
  const setCustomJoints = (newJoints: Partial<JointAngles>) => {
    if (safetyState === 'EMERGENCY_STOP') return;
    setJoints(prev => {
      const updated = { ...prev, ...newJoints };
      // approximate cartesian forward kinematics
      setCartesian(curr => ({
        x: Math.round(400 + Math.cos(updated.j1 * Math.PI / 180) * 120 + Math.sin(updated.j2 * Math.PI / 180) * 80),
        y: Math.round(Math.sin(updated.j1 * Math.PI / 180) * 200),
        z: Math.round(350 + Math.cos(updated.j2 * Math.PI / 180) * 150 - Math.sin(updated.j3 * Math.PI / 180) * 100),
        roll: updated.j4,
        pitch: updated.j5,
        yaw: updated.j6
      }));
      return updated;
    });
  };

  // Set Gripper state
  const setGripper = (state: GripperState) => {
    if (safetyState === 'EMERGENCY_STOP') return;
    setGripperState(state);
    if (state === 'CLOSED' || state === 'HOLDING') {
      setGripperDistance(12);
      addLog('Robotic Arm', 'GRIPPER_CLOSED', 'Pneumatic clamp engaged (Force feedback: 24.5 N nominal).', 'info');
    } else {
      setGripperDistance(45);
      addLog('Robotic Arm', 'GRIPPER_OPENED', 'Pneumatic stroke retracted to 45mm.', 'info');
    }
  };

  // Standalone dispensing test
  const runStandaloneDispense = () => {
    if (safetyState === 'EMERGENCY_STOP') {
      addLog('Safety Core', 'DISPENSE_INHIBITED', 'E-Stop active: Actuator lines de-energized.', 'error');
      return;
    }
    if (!jarPresent) {
      addLog('Dispensing System', 'JAR_ABSENT_FAULT', 'Interlock fail: Optical retroreflective sensor detected NO jar.', 'error');
      setDispensingStatus('FAULT');
      return;
    }

    setDispensingStatus('DISPENSING');
    setActiveActuator(INGREDIENTS_CATALOG[selectedIngredient].actuatorType);
    setMeasuredQuantity(0);

    addLog('Dispensing System', 'ACTUATOR_ENERGIZED', `Dispensing ${targetQuantity}g of ${selectedIngredient} via ${INGREDIENTS_CATALOG[selectedIngredient].actuatorType}.`, 'info');

    const duration = (targetQuantity / INGREDIENTS_CATALOG[selectedIngredient].flowRate) * 1000 / speed;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentMass = Math.round(progress * targetQuantity * 10) / 10;
      setMeasuredQuantity(currentMass);
      setDispenseRate(Math.round(INGREDIENTS_CATALOG[selectedIngredient].flowRate * (0.95 + Math.random() * 0.1) * 10) / 10);

      if (progress >= 1) {
        clearInterval(interval);
        setDispenseRate(0);
        setDispensingStatus('COMPLETED');
        setActiveActuator('Standby');
        addLog('Dispensing System', 'QUANTITY_CONFIRMED', `Target ${targetQuantity}g verified (Load-cell reading: ${targetQuantity}.00g ±0.05g).`, 'success');
        
        // Record idempotency receipt
        const receipt: IdempotencyRecord = {
          transactionId: `DSP-${Date.now().toString().slice(-5)}`,
          operationId: `OP-STANDALONE-${Date.now().toString().slice(-4)}`,
          ingredient: selectedIngredient,
          quantityGrams: targetQuantity,
          timestamp: new Date().toLocaleTimeString(),
          status: 'COMPLETED'
        };
        setIdempotencyRecords(prev => [receipt, ...prev]);
      }
    }, 50);
  };

  // Request Dispensing Authorization
  const requestAuthorization = () => {
    if (!jarPresent) {
      addLog('Dispensing System', 'AUTH_REJECTED', 'Cannot authorize: Jar presence sensor not satisfied.', 'warning');
      return;
    }
    setDispenseAuthorized(true);
    addLog('MenuOS', 'DISPENSE_AUTHORIZED', `Authorization token issued for Operation ${operationId} / Transaction ${transactionId}.`, 'success');
  };

  // Duplicate Request Simulation (PRD Section 12 requirement!)
  const testDuplicateRequest = () => {
    // Generate a duplicate attempt
    const existing = idempotencyRecords.find(r => r.transactionId === transactionId) || {
      transactionId,
      operationId,
      ingredient: selectedIngredient,
      quantityGrams: targetQuantity,
      timestamp: '10:42:08.520',
      status: 'COMPLETED' as const
    };

    setDuplicateAttemptMessage(`[IDEMPOTENCY_REJECT] Duplicate transaction ${transactionId} received for ${existing.ingredient} (${existing.quantityGrams}g). Operation already signed at ${existing.timestamp}. Rejected to prevent double-pour.`);
    
    addLog(
      'Dispensing System', 
      'DUPLICATE_REQUEST_REJECTED', 
      `Idempotency Guard Active: Replaying transaction ${transactionId} rejected with HTTP 409 Conflict. Zero excess dispensed.`, 
      'warning',
      { transactionId, operationId, status: 'REJECTED_DUPLICATE' }
    );
  };

  const clearDuplicateMessage = () => setDuplicateAttemptMessage(null);

  // Fault injection
  const triggerFault = (faultId: FaultScenarioId) => {
    setActiveFault(faultId);
    if (faultId === 'NONE') {
      resolveFault();
      return;
    }
    const fault = FAULT_CATALOG[faultId];
    if (fault.severity === 'SAFETY_INTERLOCK') {
      setSafetyState('INTERLOCKED');
    } else {
      setSafetyState('WARNING');
    }

    if (fault.subsystem === 'Robotic Arm System') setRobotStatus('FAULT');
    if (fault.subsystem === 'Dispensing System (DS)') setDispensingStatus('FAULT');
    if (fault.subsystem === 'MenuOS') setMenuOSStatus('ERROR');

    addLog(
      fault.subsystem as any,
      `FAULT_${faultId}`,
      `[${fault.severity}] ${fault.name}: ${fault.description}`,
      'error',
      { faultId, mitigation: fault.mitigation }
    );
  };

  const resolveFault = () => {
    const prevFault = activeFault;
    setActiveFault('NONE');
    setSafetyState('NOMINAL');
    setRobotStatus('IDLE');
    setDispensingStatus('READY');
    setMenuOSStatus('READY');
    setJarPresent(true);
    addLog('Safety Core', 'FAULT_RESOLVED', `Fault ${prevFault} cleared. Subsystems reset to NOMINAL readiness.`, 'success');
  };

  // Emergency Stop (PRD Section 13)
  const emergencyStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSafetyState('EMERGENCY_STOP');
    setRobotStatus('FAULT');
    setDispensingStatus('FAULT');
    setMenuOSStatus('ERROR');
    setActiveActuator('DE-ENERGIZED (E-STOP)');
    setDispenseRate(0);

    setWorkflowSteps(prev => prev.map(s => s.status === 'ACTIVE' ? { ...s, status: 'HALTED' } : s));

    addLog('Safety Core', 'EMERGENCY_STOP_TRIPPED', 'HARDWARE SAFETY INTERRUPT: Category 0 E-Stop tripped! All dynamic actuators and kinematic motion halted immediately.', 'error');
  };

  // Reset Simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setProgressPercent(0);
    setMenuOSStatus('READY');
    setRobotStatus('IDLE');
    setDispensingStatus('READY');
    setSafetyState('NOMINAL');
    setActiveFault('NONE');
    setJoints(POSE_PRESETS.HOME.joints);
    setCartesian(POSE_PRESETS.HOME.cartesian);
    setCurrentPose('HOME');
    setGripperState('OPEN');
    setGripperDistance(45);
    setMotionProgress(0);
    setMeasuredQuantity(0);
    setDispenseRate(0);
    setJarPresent(true);
    setDispenseAuthorized(false);
    setActiveActuator('Standby');
    setDuplicateAttemptMessage(null);
    setCurrentOrder(INITIAL_ORDER);
    setWorkflowSteps(WORKFLOW_STEPS.map(s => ({ ...s, status: 'PENDING' })));

    addLog('MenuOS', 'SIMULATION_RESET', 'Master simulation context restored to initial calibrated states.', 'info');
  };

  // Master Simulation Workflow Engine (PRD Section 14: 9 Phases)
  const timerRef = useRef<any>(null);

  const startSimulation = () => {
    if (safetyState === 'EMERGENCY_STOP') {
      addLog('Safety Core', 'START_INHIBITED', 'Cannot start: Emergency Stop active. Perform system safety reset first.', 'error');
      return;
    }
    if (activeFault !== 'NONE') {
      addLog('Safety Core', 'START_INHIBITED', `Cannot start: Active fault condition ${activeFault} must be cleared.`, 'error');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setProgressPercent(5);
    setWorkflowSteps(WORKFLOW_STEPS.map((s, idx) => ({ ...s, status: idx === 0 ? 'ACTIVE' : 'PENDING' })));

    addLog('MenuOS', 'EXECUTION_INITIATED', `Master automated sequence dispatched for Order ${currentOrder.orderId}.`, 'info');
  };

  const pauseSimulation = () => {
    setIsPaused(true);
    setIsRunning(false);
    setMenuOSStatus('PAUSED');
    setRobotStatus('PAUSED');
    addLog('MenuOS', 'EXECUTION_PAUSED', 'Simulation paused by supervisory operator.', 'warning');
  };

  const resumeSimulation = () => {
    if (safetyState === 'EMERGENCY_STOP') return;
    setIsPaused(false);
    setIsRunning(true);
    setMenuOSStatus('MONITORING');
    setRobotStatus('TRAJECTORY_EXEC');
    addLog('MenuOS', 'EXECUTION_RESUMED', 'Resuming automated sequence from current waypoint.', 'info');
  };

  // Phase Execution Sequencer
  useEffect(() => {
    if (!isRunning || isPaused || safetyState === 'EMERGENCY_STOP') return;

    const basePhaseDurations = [
      1200, // Phase 1: Order ingestion
      1200, // Phase 2: Recipe validation
      2000, // Phase 3: Motion planning & arm moves to pick
      1400, // Phase 4: Object handling / gripping
      1500, // Phase 5: DS jar presence verification & auth
      3200, // Phase 6: Dispensing with scale feedback
      1400, // Phase 7: Closed-loop tolerance verification
      2200, // Phase 8: Arm moves to place position & releases
      1200  // Phase 9: Order reconciliation
    ];

    const currentDuration = basePhaseDurations[currentPhaseIndex] / speed;

    // Apply phase state changes upon entering phase
    switch (currentPhaseIndex) {
      case 0: // PHASE_1_ORDER_RECEIVED
        setMenuOSStatus('ORDER_RECEIVED');
        setRobotStatus('IDLE');
        setDispensingStatus('READY');
        setProgressPercent(11);
        addLog('MenuOS', 'ORDER_RECEIVED', `Ingested production ticket ${currentOrder.orderId} (${currentOrder.recipeName}). Target mass: 97g.`, 'info');
        break;

      case 1: // PHASE_2_RECIPE_VALIDATION
        setMenuOSStatus('RECIPE_VALIDATING');
        setProgressPercent(22);
        addLog('MenuOS', 'RECIPE_VALIDATED', 'Validated 5 ingredients against tolerance thresholds. Allocation locked.', 'success');
        break;

      case 2: // PHASE_3_MOTION_PLANNING
        setMenuOSStatus('DISPATCHING');
        setRobotStatus('PLANNING');
        setProgressPercent(33);
        addLog('Robotic Arm', 'MOTION_PLANNING', 'MoveIt 2 planner generated 6-DOF spline trajectory to PICK_POSITION (Target: X:380, Y:-260, Z:140).', 'info');
        animateToPose('PICK_POSITION', 1800);
        break;

      case 3: // PHASE_4_OBJECT_HANDLING
        setRobotStatus('HOLDING');
        setGripper('CLOSED');
        setProgressPercent(44);
        addLog('Robotic Arm', 'OBJECT_HANDLING', 'Parallel gripper pneumatic cylinders engaged. Vacuum seal verified.', 'success');
        break;

      case 4: // PHASE_5_DISPENSING_PREPARATION
        setRobotStatus('TRAJECTORY_EXEC');
        animateToPose('DISPENSE_POSITION', 1600);
        setDispensingStatus('CHECKING_JAR');
        setProgressPercent(55);
        addLog('Dispensing System', 'JAR_PRESENT_VERIFIED', 'Optical sensor registered vessel under Dispensing Head 1. Handshake token exchanged.', 'info');
        setDispenseAuthorized(true);
        break;

      case 5: // PHASE_6_DISPENSING
        setDispensingStatus('DISPENSING');
        setActiveActuator('Peristaltic Pump A-1 (Tomato Sauce)');
        setProgressPercent(66);
        addLog('Dispensing System', 'DISPENSE_AUTHORIZED', 'Actuator ignited. Metering ingredient mass with load-cell feedback.', 'info');
        
        // Dispense animation
        const dispStart = performance.now();
        const targetGrams = 50;
        const dispInterval = setInterval(() => {
          const el = performance.now() - dispStart;
          const prog = Math.min(1, el / (2600 / speed));
          setMeasuredQuantity(Math.round(prog * targetGrams * 10) / 10);
          setDispenseRate(Math.round(15.4 * (0.95 + Math.random() * 0.1) * 10) / 10);
          if (prog >= 1) {
            clearInterval(dispInterval);
            setDispenseRate(0);
          }
        }, 60);
        break;

      case 6: // PHASE_7_QUANTITY_VERIFICATION
        setDispensingStatus('VERIFYING');
        setActiveActuator('Standby');
        setProgressPercent(77);
        addLog('Dispensing System', 'QUANTITY_CONFIRMED', 'Measured: 50.0g ±0.05g. Within batch spec. Operation token OP-2026-00481 signed.', 'success');
        
        // Log idempotency record
        setIdempotencyRecords(prev => [
          {
            transactionId: 'DSP-00481',
            operationId: 'OP-2026-00481',
            ingredient: 'Tomato Sauce',
            quantityGrams: 50,
            timestamp: new Date().toLocaleTimeString(),
            status: 'COMPLETED'
          },
          ...prev
        ]);
        break;

      case 7: // PHASE_8_FINAL_PLACEMENT
        setDispensingStatus('COMPLETED');
        setRobotStatus('TRAJECTORY_EXEC');
        setProgressPercent(88);
        animateToPose('PLACE_POSITION', 1800);
        setTimeout(() => {
          setGripper('OPEN');
          addLog('Robotic Arm', 'OBJECT_PLACED', 'Container released at outbound staging conveyor. Zero residual torque.', 'success');
        }, 1600 / speed);
        break;

      case 8: // PHASE_9_ORDER_COMPLETION
        setMenuOSStatus('COMPLETED');
        setRobotStatus('IDLE');
        animateToPose('HOME', 1500);
        setProgressPercent(100);
        addLog('MenuOS', 'ORDER_COMPLETED', `Order ${currentOrder.orderId} marked COMPLETED. Orchestrator ready for next batch.`, 'success');
        
        // Archive order
        setCurrentOrder(prev => ({ ...prev, status: 'COMPLETED' }));
        break;
    }

    // Advance step status
    setWorkflowSteps(prev => prev.map((step, idx) => {
      if (idx < currentPhaseIndex) return { ...step, status: 'COMPLETED' };
      if (idx === currentPhaseIndex) return { ...step, status: 'ACTIVE' };
      return { ...step, status: 'PENDING' };
    }));

    // Schedule next phase
    timerRef.current = setTimeout(() => {
      if (currentPhaseIndex < 8) {
        setCurrentPhaseIndex(prev => prev + 1);
      } else {
        // Finished entire run
        setIsRunning(false);
      }
    }, currentDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, isPaused, currentPhaseIndex, speed, safetyState, activeFault, currentOrder.orderId, animateToPose, addLog]);

  const value: SimulationContextType = {
    isRunning,
    isPaused,
    speed,
    currentPhase: WORKFLOW_STEPS[currentPhaseIndex].id,
    currentPhaseIndex,
    workflowSteps,
    progressPercent,

    menuOSStatus,
    robotStatus,
    dispensingStatus,
    safetyState,

    joints,
    cartesian,
    currentPose,
    gripperState,
    gripperDistance,
    motionProgress,

    selectedIngredient,
    targetQuantity,
    measuredQuantity,
    dispenseRate,
    jarPresent,
    dispenseAuthorized,
    activeActuator,
    operationId,
    transactionId,
    idempotencyRecords,
    duplicateAttemptMessage,

    currentOrder,
    orderHistory,

    logs,
    activeFault,

    startSimulation,
    pauseSimulation,
    resumeSimulation,
    emergencyStop,
    resetSimulation,
    setSpeed,
    setArmPreset,
    setCustomJoints,
    setGripper,
    setSelectedIngredient,
    setTargetQuantity,
    setJarPresent,
    requestAuthorization,
    runStandaloneDispense,
    testDuplicateRequest,
    triggerFault,
    resolveFault,
    clearDuplicateMessage,
    addLog
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
