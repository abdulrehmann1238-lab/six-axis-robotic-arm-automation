import React from 'react';
import { ArchitectureDiagram } from '../visualizers/ArchitectureDiagram';
import { Layers, Cpu, Droplet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture-preview" className="py-20 sm:py-24 bg-industrial-bgSecondary/40 border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
            01 // SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-industrial-text tracking-tight">
            Three systems. One coordinated intelligence.
          </h2>
          <p className="text-base text-industrial-textMuted leading-relaxed">
            A modular architecture where centralized orchestration, robotic execution, and precision dispensing operate independently while communicating through defined interfaces.
          </p>
        </div>

        {/* Embedded Interactive Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Bottom deep-dive callout */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white border border-industrial-border shadow-sm text-xs gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-industrial-accent animate-pulse" />
            <span className="font-mono text-industrial-textMuted">
              Architecture fully decoupled via ROS 2 topics, gRPC streams, and hardware CAN-bus.
            </span>
          </div>
          <Link
            to="/architecture"
            className="flex items-center gap-1.5 font-semibold text-industrial-accent hover:underline flex-shrink-0"
          >
            <span>Explore 6-Layer Engineering Stack</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

