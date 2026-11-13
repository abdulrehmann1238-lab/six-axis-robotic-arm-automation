import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const WorkflowTimeline: React.FC = () => {
  const { workflowSteps, currentPhaseIndex, progressPercent } = useSimulation();

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#232d26] border border-[#36463c] text-gray-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#36463c] mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-industrial-accentLight" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-100">
            9-Phase Automated Preparation Lifecycle
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-gray-400">Sequence Progress:</span>
          <span className="font-bold text-industrial-accentLight">{progressPercent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1b231e] h-2 rounded-full overflow-hidden mb-5 border border-[#36463c]">
        <div
          className="bg-gradient-to-r from-industrial-accent to-industrial-success h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 9 Horizontal Steps */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {workflowSteps.map((step, idx) => {
          const isDone = step.status === 'COMPLETED';
          const isActive = step.status === 'ACTIVE';
          const isHalted = step.status === 'HALTED';

          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-lg border text-left transition-all relative ${
                isActive
                  ? 'bg-industrial-accent/20 border-industrial-accent text-white ring-1 ring-industrial-accent/50'
                  : isDone
                  ? 'bg-[#1e2722] border-[#3a4c40] text-gray-300'
                  : isHalted
                  ? 'bg-industrial-fault/20 border-industrial-fault text-industrial-fault'
                  : 'bg-[#1b221d] border-[#2c3830] text-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold">
                  P0{step.phaseNumber}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-industrial-success" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-industrial-warning animate-ping" />
                ) : isHalted ? (
                  <AlertCircle className="w-3.5 h-3.5 text-industrial-fault" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-600" />
                )}
              </div>
              <div className="font-heading font-semibold text-xs truncate text-gray-100">
                {step.title}
              </div>
              <div className="text-[9px] font-mono opacity-70 truncate mt-0.5">
                {step.subsystem.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

