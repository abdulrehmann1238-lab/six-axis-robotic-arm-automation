import React from 'react';
import { Layers, Cpu, Droplet, ArrowRight } from 'lucide-react';
import { useSimulation } from '../../state/simulationContext';

export const SubsystemCard: React.FC = () => {
  const { 
    menuOSStatus, 
    robotStatus, 
    dispensingStatus, 
    currentOrder, 
    currentPose, 
    cartesian, 
    selectedIngredient, 
    measuredQuantity, 
    targetQuantity,
    logs 
  } = useSimulation();

  const lastMenuOSLog = logs.find(l => l.source === 'MenuOS')?.timestamp || '10:42:00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. MenuOS Module */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#232d26] border border-[#36463c] text-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#36463c] mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-industrial-accentLight" />
            <h4 className="font-heading font-bold text-sm text-gray-100">MenuOS Orchestrator</h4>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            menuOSStatus === 'ERROR' ? 'bg-industrial-fault text-white' :
            menuOSStatus === 'COMPLETED' ? 'bg-industrial-success text-white' :
            menuOSStatus === 'ORDER_RECEIVED' || menuOSStatus === 'RECIPE_VALIDATING' || menuOSStatus === 'DISPATCHING' ? 'bg-industrial-warning text-white' :
            'bg-[#2d3a31] text-industrial-accentLight'
          }`}>
            {menuOSStatus}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-gray-400">Production Ticket:</span>
            <span className="font-bold text-gray-100">{currentOrder.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Recipe Target:</span>
            <span className="text-gray-200 truncate max-w-[150px]">{currentOrder.recipeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Batch Target:</span>
            <span className="font-bold text-industrial-accentLight">{currentOrder.totalGrams} g (5 Items)</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#36463c]/50 text-[11px]">
            <span className="text-gray-400">Last Comm Sync:</span>
            <span className="text-gray-400">{lastMenuOSLog}</span>
          </div>
        </div>
      </div>

      {/* 2. Robotic Arm Module */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#232d26] border border-[#36463c] text-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#36463c] mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-industrial-warm" />
            <h4 className="font-heading font-bold text-sm text-gray-100">Robotic Arm System</h4>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            robotStatus === 'FAULT' ? 'bg-industrial-fault text-white' :
            robotStatus === 'TRAJECTORY_EXEC' ? 'bg-industrial-warning text-white animate-pulse' :
            robotStatus === 'IN_POSITION' || robotStatus === 'HOLDING' ? 'bg-industrial-success text-white' :
            'bg-[#2d3a31] text-industrial-accentLight'
          }`}>
            {robotStatus}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Pose:</span>
            <span className="font-bold text-industrial-warm">{currentPose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cartesian TCP:</span>
            <span className="text-gray-200">X:{cartesian.x} Y:{cartesian.y} Z:{cartesian.z}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kinematic Pipeline:</span>
            <span className="font-bold text-gray-100">ROS 2 / MoveIt 2</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#36463c]/50 text-[11px]">
            <span className="text-gray-400">Joint Feedback:</span>
            <span className="text-industrial-success font-semibold">6-DOF NOMINAL (50Hz)</span>
          </div>
        </div>
      </div>

      {/* 3. Dispensing System Module */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#232d26] border border-[#36463c] text-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#36463c] mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-industrial-success" />
            <h4 className="font-heading font-bold text-sm text-gray-100">Dispensing System (DS)</h4>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            dispensingStatus === 'FAULT' ? 'bg-industrial-fault text-white' :
            dispensingStatus === 'DISPENSING' ? 'bg-industrial-warning text-white animate-pulse' :
            dispensingStatus === 'COMPLETED' ? 'bg-industrial-success text-white' :
            'bg-[#2d3a31] text-industrial-accentLight'
          }`}>
            {dispensingStatus}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Ingredient:</span>
            <span className="font-bold text-gray-100">{selectedIngredient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Closed-Loop Mass:</span>
            <span className="font-bold text-industrial-success">
              {measuredQuantity.toFixed(1)} / {targetQuantity}.0 g
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mass Tolerance:</span>
            <span className="text-gray-200">±0.05 g (Load-Cell)</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#36463c]/50 text-[11px]">
            <span className="text-gray-400">Idempotency Guard:</span>
            <span className="text-industrial-success font-semibold">ENFORCED (DSP-00481)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

