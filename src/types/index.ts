export type SystemType = 'MenuOS' | 'Robotic Arm System' | 'Dispensing System (DS)';

export type MenuOSStatus = 'READY' | 'ORDER_RECEIVED' | 'RECIPE_VALIDATING' | 'DISPATCHING' | 'MONITORING' | 'COMPLETED' | 'PAUSED' | 'ERROR';

export type RobotArmStatus = 'IDLE' | 'PLANNING' | 'TRAJECTORY_EXEC' | 'IN_POSITION' | 'HOLDING' | 'PAUSED' | 'FAULT';

export type DispensingStatus = 'READY' | 'CHECKING_JAR' | 'REQUESTING_AUTH' | 'AUTHORIZED' | 'DISPENSING' | 'VERIFYING' | 'COMPLETED' | 'FAULT';

export type SafetyState = 'NOMINAL' | 'WARNING' | 'EMERGENCY_STOP' | 'INTERLOCKED' | 'FAULT';

export type ArmPosePreset = 'HOME' | 'PICK_POSITION' | 'DISPENSE_POSITION' | 'PLACE_POSITION';

export interface JointAngles {
  j1: number; // Base azimuth (-180 to 180)
  j2: number; // Shoulder pitch (-90 to 110)
  j3: number; // Elbow pitch (-110 to 90)
  j4: number; // Wrist roll 1 (-180 to 180)
  j5: number; // Wrist pitch (-115 to 115)
  j6: number; // Wrist roll 2 / Tool flange (-360 to 360)
}

export interface CartesianCoord {
  x: number; // mm
  y: number; // mm
  z: number; // mm
  roll: number;  // deg
  pitch: number; // deg
  yaw: number;   // deg
}

export type GripperState = 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING' | 'HOLDING';

export type IngredientType = 
  | 'Tomato Sauce'
  | 'Cheese'
  | 'Olive Oil'
  | 'Herb Mix'
  | 'Seasoning';

export interface IngredientMeta {
  id: IngredientType;
  density: string; // e.g. "1.15 g/ml"
  type: 'Viscous Liquid' | 'Particulate / Solid' | 'Low Viscosity' | 'Dry Herb' | 'Fine Powder';
  defaultAmount: number; // grams
  unit: string;
  actuatorType: 'Peristaltic Pump A-1' | 'Auger Feeder M-2' | 'Precision Micro-Pump P-3' | 'Vibratory Dispenser V-4' | 'Rotary Doser R-5';
  flowRate: number; // g/sec
}

export interface OrderItem {
  ingredient: IngredientType;
  requestedGrams: number;
  measuredGrams: number;
  status: 'QUEUED' | 'ACTIVE' | 'VERIFIED' | 'FAILED';
}

export interface ProductionOrder {
  orderId: string;
  recipeName: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
  totalGrams: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  source: 'MenuOS' | 'Robotic Arm' | 'Dispensing System' | 'Safety Core';
  eventType: string;
  message: string;
  payload?: Record<string, any>;
  level: 'info' | 'success' | 'warning' | 'error';
}

export type WorkflowPhase = 
  | 'PHASE_1_ORDER_RECEIVED'
  | 'PHASE_2_RECIPE_VALIDATION'
  | 'PHASE_3_MOTION_PLANNING'
  | 'PHASE_4_OBJECT_HANDLING'
  | 'PHASE_5_DISPENSING_PREPARATION'
  | 'PHASE_6_DISPENSING'
  | 'PHASE_7_QUANTITY_VERIFICATION'
  | 'PHASE_8_FINAL_PLACEMENT'
  | 'PHASE_9_ORDER_COMPLETION';

export interface WorkflowStep {
  id: WorkflowPhase;
  phaseNumber: number;
  title: string;
  description: string;
  subsystem: SystemType;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'HALTED';
}

export type FaultScenarioId = 
  | 'NONE'
  | 'COLLISION_RISK'
  | 'GRIPPER_FAILURE'
  | 'COMM_TIMEOUT'
  | 'MISSING_JAR'
  | 'QUANTITY_DEVIATION'
  | 'CONTROLLER_UNRESPONSIVE';

export interface FaultDetails {
  id: FaultScenarioId;
  name: string;
  subsystem: SystemType;
  severity: 'WARNING' | 'CRITICAL' | 'SAFETY_INTERLOCK';
  description: string;
  mitigation: string;
}

export interface IdempotencyRecord {
  transactionId: string;
  operationId: string;
  ingredient: IngredientType;
  quantityGrams: number;
  timestamp: string;
  status: 'AUTHORIZED' | 'COMPLETED' | 'REJECTED_DUPLICATE';
}

