import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { ShieldCheck, Copy, AlertCircle, CheckCircle2, Clock, Terminal, RefreshCw, XCircle } from 'lucide-react';

export const CommunicationSection: React.FC = () => {
  const { 
    logs, 
    operationId, 
    transactionId, 
    dispenseAuthorized, 
    idempotencyRecords, 
    duplicateAttemptMessage, 
    testDuplicateRequest, 
    clearDuplicateMessage 
  } = useSimulation();

  return (
    <section id="communication-preview" className="py-20 sm:py-24 bg-industrial-bg border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            04 // BIDIRECTIONAL COMMUNICATION & SYNCHRONIZATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Communication that keeps every operation in sync.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            Synchronized messaging between MenuOS, the Robotic Arm System, and the Dispensing System ensures operational integrity, state verification, and strict idempotency protection.
          </p>
        </div>

        {/* Featured Showcase: Client Requirement — Duplicate Dispensing Prevention (Idempotency Guard) */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white to-industrial-bgSecondary/60 border-2 border-industrial-accent/30 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-industrial-border gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-industrial-accent/15 text-industrial-accent text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ARCHITECTURAL SAFEGUARD // IDEMPOTENCY GUARD</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-industrial-text">
                Duplicate Dispensing Prevention
              </h3>
              <p className="text-xs sm:text-sm text-industrial-textMuted max-w-2xl">
                Every ingredient dispense is issued with an immutable, cryptographically hashed transaction token. If network re-transmissions or orchestrator retries occur, duplicates are detected and blocked instantly at the hardware interlock level.
              </p>
            </div>

            {/* Interactive Simulation Button */}
            <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <button
                onClick={testDuplicateRequest}
                className="px-5 py-3 rounded-xl bg-industrial-warm text-white hover:bg-industrial-warm/90 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Simulate Duplicate Request</span>
              </button>
            </div>
          </div>

          {/* Idempotency Token Inspector Badges */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white border border-industrial-border shadow-sm">
              <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Active Operation ID</span>
              <div className="text-sm font-bold text-industrial-text mt-0.5">{operationId}</div>
              <div className="text-[10px] text-industrial-accent mt-1">MenuOS Global Batch UUID</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-industrial-border shadow-sm">
              <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Dispensing Transaction ID</span>
              <div className="text-sm font-bold text-industrial-accent mt-0.5">{transactionId}</div>
              <div className="text-[10px] text-industrial-accent mt-1">Single-Use Hardware Token</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-industrial-border shadow-sm">
              <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Authorization State</span>
              <div className="text-sm font-bold text-industrial-success mt-0.5">
                {dispenseAuthorized ? 'AUTHORIZED_TOKEN_ACTIVE' : 'READY_STANDBY'}
              </div>
              <div className="text-[10px] text-industrial-textMuted mt-1">HMAC Verified Handshake</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-industrial-border shadow-sm">
              <span className="text-[10px] text-industrial-textMuted uppercase font-semibold">Duplicate Interlock</span>
              <div className="text-sm font-bold text-industrial-text mt-0.5">ACTIVE (ZERO OVERFILL)</div>
              <div className="text-[10px] text-industrial-success mt-1">Strict Replay Rejection</div>
            </div>
          </div>

          {/* Duplicate Rejection Banner (When triggered) */}
          {duplicateAttemptMessage && (
            <div className="p-4 rounded-xl bg-industrial-fault/10 border-2 border-industrial-fault/40 text-xs font-mono space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-industrial-fault text-sm">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <span>IDEMPOTENCY CONFLICT INTERCEPTED (HTTP 409 CONFLICT)</span>
                </div>
                <button
                  onClick={clearDuplicateMessage}
                  className="px-2 py-1 rounded hover:bg-industrial-fault/20 text-industrial-fault font-semibold"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-industrial-text leading-relaxed">
                {duplicateAttemptMessage}
              </p>
              <div className="text-[11px] text-industrial-textMuted font-mono pt-1">
                Proposed simulation of intended transaction safeguards. Hardware state and ingredient scale were protected with zero excess volume dispensed.
              </div>
            </div>
          )}
        </div>

        {/* Real-time-looking Communication Timeline Table */}
        <div className="rounded-xl border border-industrial-border bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-industrial-border bg-industrial-bgSecondary/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-industrial-accent" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-industrial-text">
                Live Subsystem Event Feed & Acknowledgment Stream
              </h4>
            </div>
            <span className="text-[11px] font-mono text-industrial-textMuted">
              Showing Latest {Math.min(8, logs.length)} Packets
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-industrial-bgSecondary/70 border-b border-industrial-border text-industrial-textMuted">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Source Subsystem</th>
                  <th className="py-2.5 px-4 font-semibold">Event Type</th>
                  <th className="py-2.5 px-4 font-semibold">Payload Summary</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border">
                {logs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-industrial-bgSecondary/30 transition-colors">
                    <td className="py-2.5 px-4 text-industrial-textMuted whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        log.source === 'MenuOS' ? 'bg-industrial-accent/15 text-industrial-accent' :
                        log.source === 'Robotic Arm' ? 'bg-industrial-warm/15 text-industrial-warm' :
                        log.source === 'Dispensing System' ? 'bg-industrial-success/15 text-industrial-success' :
                        'bg-industrial-fault/15 text-industrial-fault'
                      }`}>
                        {log.source}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-industrial-text whitespace-nowrap">
                      {log.eventType}
                    </td>
                    <td className="py-2.5 px-4 text-industrial-text max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className={`font-semibold ${
                        log.level === 'success' ? 'text-industrial-success' :
                        log.level === 'error' ? 'text-industrial-fault' :
                        log.level === 'warning' ? 'text-industrial-warning' :
                        'text-industrial-accent'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

