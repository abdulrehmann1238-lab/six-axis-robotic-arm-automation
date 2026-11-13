import React from 'react';
import { ArchitectureDiagram } from '../components/visualizers/ArchitectureDiagram';
import { EngineeringSection } from '../components/sections/EngineeringSection';
import { Layers, Cpu, Droplet, ArrowRight, ShieldCheck, Database, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-industrial-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-accent/10 border border-industrial-accent/20 text-industrial-accent text-xs font-mono font-semibold uppercase">
            <span>SYSTEM TOPOLOGY & DATA INTERFACES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-industrial-text tracking-tight">
            Integrated Automation Architecture
          </h1>
          <p className="text-base sm:text-lg text-industrial-textMuted leading-relaxed">
            An in-depth technical analysis of the three coordinated subsystems: MenuOS workflow orchestration, ROS 2 six-axis motion control, and high-precision ingredient dispensing.
          </p>
        </div>

        {/* Interactive 3-System Diagram */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-industrial-text">
              Subsystem Interconnect Matrix
            </h2>
            <span className="text-xs font-mono text-industrial-textMuted">
              Hover systems to trace packet flows
            </span>
          </div>
          <ArchitectureDiagram />
        </div>

        {/* Comparative Responsibility Matrix */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-industrial-border shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
              TECHNICAL COMPARISON
            </span>
            <h3 className="text-2xl font-bold font-heading text-industrial-text">
              Subsystem Specification Matrix
            </h3>
            <p className="text-xs text-industrial-textMuted">
              Clear separation of concerns allows each system to operate with optimal execution guarantees.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-industrial-border rounded-lg overflow-hidden">
              <thead className="bg-industrial-bgSecondary text-industrial-text">
                <tr>
                  <th className="py-3 px-4 font-bold border-b border-industrial-border">Attribute</th>
                  <th className="py-3 px-4 font-bold border-b border-industrial-border text-industrial-accent">1. MenuOS</th>
                  <th className="py-3 px-4 font-bold border-b border-industrial-border text-industrial-warm">2. Robotic Arm System</th>
                  <th className="py-3 px-4 font-bold border-b border-industrial-border text-industrial-success">3. Dispensing System (DS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-border">
                <tr>
                  <td className="py-3 px-4 font-semibold text-industrial-text">Runtime Domain</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Cloud / Edge Gateway (Linux)</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Real-Time Linux (PREEMPT_RT / ROS 2)</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Bare-Metal / FreeRTOS Embedded MCU</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-industrial-text">Primary Protocol</td>
                  <td className="py-3 px-4 text-industrial-textMuted">gRPC & REST / JSON over TLS</td>
                  <td className="py-3 px-4 text-industrial-textMuted">DDS (FastDDS / CycloneDDS)</td>
                  <td className="py-3 px-4 text-industrial-textMuted">CAN 2.0B & UART Micro-ROS</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-industrial-text">Execution Guarantee</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Transaction Idempotency (At-least-once)</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Deterministic 50Hz Spline Interpolation</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Hard Real-time Microsecond Closed Loop</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-industrial-text">Safety Role</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Orchestrator Heartbeat Monitor</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Collision Avoidance & Cartesian Limits</td>
                  <td className="py-3 px-4 text-industrial-textMuted">Optical Jar Interlock & Scale Cutoff</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6-Layer Modular Engineering Architecture */}
        <EngineeringSection />
      </div>
    </div>
  );
};

