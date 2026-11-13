import { 
  JointAngles, 
  CartesianCoord, 
  ArmPosePreset, 
  IngredientMeta, 
  IngredientType, 
  ProductionOrder, 
  WorkflowPhase, 
  WorkflowStep,
  FaultScenarioId,
  FaultDetails
} from '../types';

export const POSE_PRESETS: Record<ArmPosePreset, { joints: JointAngles; cartesian: CartesianCoord }> = {
  HOME: {
    joints: { j1: 0, j2: -35, j3: 65, j4: 0, j5: 45, j6: 0 },
    cartesian: { x: 420.0, y: 0.0, z: 580.0, roll: 0.0, pitch: 90.0, yaw: 0.0 }
  },
  PICK_POSITION: {
    joints: { j1: -45, j2: 15, j3: 82, j4: -15, j5: 25, j6: -45 },
    cartesian: { x: 380.0, y: -260.0, z: 140.0, roll: 0.0, pitch: 180.0, yaw: -45.0 }
  },
  DISPENSE_POSITION: {
    joints: { j1: 25, j2: -12, j3: 48, j4: 0, j5: 58, j6: 25 },
    cartesian: { x: 490.0, y: 210.0, z: 280.0, roll: 0.0, pitch: 90.0, yaw: 25.0 }
  },
  PLACE_POSITION: {
    joints: { j1: 65, j2: 18, j3: 75, j4: 20, j5: 22, j6: 65 },
    cartesian: { x: 260.0, y: 440.0, z: 125.0, roll: 0.0, pitch: 180.0, yaw: 65.0 }
  }
};

export const INGREDIENTS_CATALOG: Record<IngredientType, IngredientMeta> = {
  'Tomato Sauce': {
    id: 'Tomato Sauce',
    density: '1.15 g/ml',
    type: 'Viscous Liquid',
    defaultAmount: 50,
    unit: 'g',
    actuatorType: 'Peristaltic Pump A-1',
    flowRate: 15 // g/sec
  },
  'Cheese': {
    id: 'Cheese',
    density: '0.95 g/ml',
    type: 'Particulate / Solid',
    defaultAmount: 30,
    unit: 'g',
    actuatorType: 'Auger Feeder M-2',
    flowRate: 10
  },
  'Olive Oil': {
    id: 'Olive Oil',
    density: '0.92 g/ml',
    type: 'Low Viscosity',
    defaultAmount: 10,
    unit: 'g',
    actuatorType: 'Precision Micro-Pump P-3',
    flowRate: 5
  },
  'Herb Mix': {
    id: 'Herb Mix',
    density: '0.45 g/ml',
    type: 'Dry Herb',
    defaultAmount: 5,
    unit: 'g',
    actuatorType: 'Vibratory Dispenser V-4',
    flowRate: 2.5
  },
  'Seasoning': {
    id: 'Seasoning',
    density: '0.65 g/ml',
    type: 'Fine Powder',
    defaultAmount: 2,
    unit: 'g',
    actuatorType: 'Rotary Doser R-5',
    flowRate: 1.2
  }
};

export const INITIAL_ORDER: ProductionOrder = {
  orderId: 'MNU-2048',
  recipeName: 'Precision Artisan Blend',
  status: 'QUEUED',
  createdAt: '10:42:01.240',
  totalGrams: 97,
  items: [
    { ingredient: 'Tomato Sauce', requestedGrams: 50, measuredGrams: 0, status: 'QUEUED' },
    { ingredient: 'Cheese', requestedGrams: 30, measuredGrams: 0, status: 'QUEUED' },
    { ingredient: 'Olive Oil', requestedGrams: 10, measuredGrams: 0, status: 'QUEUED' },
    { ingredient: 'Herb Mix', requestedGrams: 5, measuredGrams: 0, status: 'QUEUED' },
    { ingredient: 'Seasoning', requestedGrams: 2, measuredGrams: 0, status: 'QUEUED' }
  ]
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'PHASE_1_ORDER_RECEIVED',
    phaseNumber: 1,
    title: 'Order Ingestion',
    description: 'MenuOS receives customer order & deserializes JSON payload.',
    subsystem: 'MenuOS',
    status: 'PENDING'
  },
  {
    id: 'PHASE_2_RECIPE_VALIDATION',
    phaseNumber: 2,
    title: 'Recipe Validation',
    description: 'Validates target ingredient thresholds and batch constraints.',
    subsystem: 'MenuOS',
    status: 'PENDING'
  },
  {
    id: 'PHASE_3_MOTION_PLANNING',
    phaseNumber: 3,
    title: 'Trajectory Planning',
    description: 'ROS 2 MoveIt generates obstacle-free 6-DOF joint polynomial path.',
    subsystem: 'Robotic Arm System',
    status: 'PENDING'
  },
  {
    id: 'PHASE_4_OBJECT_HANDLING',
    phaseNumber: 4,
    title: 'Object Handling',
    description: 'Pneumatic parallel gripper engages vessel with force feedback confirmation.',
    subsystem: 'Robotic Arm System',
    status: 'PENDING'
  },
  {
    id: 'PHASE_5_DISPENSING_PREPARATION',
    phaseNumber: 5,
    title: 'Jar Verification & Auth',
    description: 'DS optical beam verifies jar seating; tokenized authorization handshaked.',
    subsystem: 'Dispensing System (DS)',
    status: 'PENDING'
  },
  {
    id: 'PHASE_6_DISPENSING',
    phaseNumber: 6,
    title: 'Actuation & Metering',
    description: 'Dynamic pump activation with high-precision load-cell mass feedback.',
    subsystem: 'Dispensing System (DS)',
    status: 'PENDING'
  },
  {
    id: 'PHASE_7_QUANTITY_VERIFICATION',
    phaseNumber: 7,
    title: 'Quantity Verification',
    description: 'Closed-loop check within ±0.2g tolerance; idempotency receipt issued.',
    subsystem: 'Dispensing System (DS)',
    status: 'PENDING'
  },
  {
    id: 'PHASE_8_FINAL_PLACEMENT',
    phaseNumber: 8,
    title: 'Outbound Transfer',
    description: 'Robotic arm moves prepared vessel to outbound staging conveyor.',
    subsystem: 'Robotic Arm System',
    status: 'PENDING'
  },
  {
    id: 'PHASE_9_ORDER_COMPLETION',
    phaseNumber: 9,
    title: 'Order Reconciliation',
    description: 'MenuOS audits batch telemetry, marks order COMPLETED, ready for next job.',
    subsystem: 'MenuOS',
    status: 'PENDING'
  }
];

export const FAULT_CATALOG: Record<FaultScenarioId, FaultDetails> = {
  NONE: {
    id: 'NONE',
    name: 'Normal Operation',
    subsystem: 'Safety & Supervisory' as any,
    severity: 'WARNING',
    description: 'All nodes operating within calibrated ISO safety envelopes.',
    mitigation: 'Standard operational protocol.'
  },
  COLLISION_RISK: {
    id: 'COLLISION_RISK',
    name: 'Collision Envelope Violation',
    subsystem: 'Robotic Arm System',
    severity: 'SAFETY_INTERLOCK',
    description: 'Joint trajectory predicted proximity threshold breach (< 45mm) to DS chassis.',
    mitigation: 'Emergency deceleration ramp engaged; recalculate spline path via ROS 2 OMPL.'
  },
  GRIPPER_FAILURE: {
    id: 'GRIPPER_FAILURE',
    name: 'Gripper Pneumatic Pressure Drop',
    subsystem: 'Robotic Arm System',
    severity: 'CRITICAL',
    description: 'Pneumatic line pressure fell below 4.2 bar during container retention.',
    mitigation: 'Secondary mechanical detent engaged; arm locked in position until line recharge.'
  },
  COMM_TIMEOUT: {
    id: 'COMM_TIMEOUT',
    name: 'DDS / ROS 2 Heartbeat Timeout',
    subsystem: 'MenuOS',
    severity: 'CRITICAL',
    description: 'Robotic state topic /joint_states dropped keep-alive packet > 250ms.',
    mitigation: 'Watchdog timer interrupted sequence; fallback to zero-torque soft stop.'
  },
  MISSING_JAR: {
    id: 'MISSING_JAR',
    name: 'Jar Absence at Dispensing Head',
    subsystem: 'Dispensing System (DS)',
    severity: 'SAFETY_INTERLOCK',
    description: 'Optical retroreflective beam sensor failed to register container at nozzle.',
    mitigation: 'Dispensing pump ignition interlocked; hold arm in alignment.'
  },
  QUANTITY_DEVIATION: {
    id: 'QUANTITY_DEVIATION',
    name: 'Mass Flow Surge / Deviation',
    subsystem: 'Dispensing System (DS)',
    severity: 'WARNING',
    description: 'Measured flow rate exceeded calibrated target by +14.8% due to air pocket.',
    mitigation: 'Actuator pulse width modulation modulated down to micro-step dosing.'
  },
  CONTROLLER_UNRESPONSIVE: {
    id: 'CONTROLLER_UNRESPONSIVE',
    name: 'Embedded DS Controller Unresponsive',
    subsystem: 'Dispensing System (DS)',
    severity: 'CRITICAL',
    description: 'UART/CAN bus framing error on Dispensing Microcontroller MCU-02.',
    mitigation: 'Power-cycle MCU peripheral interface, soft reset communication register.'
  }
};

