import React, { useState } from 'react';
import { useSimulation } from '../../state/simulationContext';
import { Terminal, Filter, Shield, Download } from 'lucide-react';
import { TelemetryLog } from '../../types';

export const EventFeed: React.FC = () => {
  const { logs } = useSimulation();
  const [filter, setFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'MENUOS' && log.source === 'MenuOS') return true;
    if (filter === 'ROBOT' && log.source === 'Robotic Arm') return true;
    if (filter === 'DS' && log.source === 'Dispensing System') return true;
    if (filter === 'SAFETY' && log.source === 'Safety Core') return true;
    return false;
  });

  return (
    <div className="rounded-xl bg-[#232d26] border border-[#36463c] text-gray-200 flex flex-col h-full max-h-[380px] overflow-hidden">
      {/* Top Header & Filter Bar */}
      <div className="p-3 border-b border-[#36463c] bg-[#1d2520] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-industrial-accentLight" />
          <span className="font-bold uppercase tracking-wider text-gray-100">
            Real-Time Telemetry & Event Feed
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-gray-400">
            {filteredLogs.length} events
          </span>
        </div>

        {/* Subsystem Filters */}
        <div className="flex items-center gap-1 text-[11px]">
          {['ALL', 'MENUOS', 'ROBOT', 'DS', 'SAFETY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded transition-colors ${
                filter === f
                  ? 'bg-industrial-accent text-white font-bold'
                  : 'bg-black/25 text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling Log Stream */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2 divide-y divide-[#2c3830]/60">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No events match current filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="pt-2 first:pt-0 flex items-start gap-2.5">
              <span className="text-gray-500 text-[10px] whitespace-nowrap mt-0.5">
                {log.timestamp}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap ${
                log.source === 'MenuOS' ? 'bg-[#2f4236] text-industrial-accentLight' :
                log.source === 'Robotic Arm' ? 'bg-[#40362c] text-industrial-warm' :
                log.source === 'Dispensing System' ? 'bg-[#273a2f] text-industrial-success' :
                'bg-[#402927] text-industrial-fault'
              }`}>
                {log.source.split(' ')[0]}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-gray-200 mr-2 text-[11px]">
                  {log.eventType}
                </span>
                <span className="text-gray-300 text-[11px] break-words">
                  {log.message}
                </span>
                {log.payload && (
                  <pre className="mt-1 p-1.5 rounded bg-black/40 text-gray-400 text-[10px] overflow-x-auto">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

