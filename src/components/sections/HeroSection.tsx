import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown, CheckCircle2, Shield, Activity, Cpu } from 'lucide-react';
import { RoboticArmCanvas } from '../visualizers/RoboticArmCanvas';
import { useSimulation } from '../../state/simulationContext';

export const HeroSection: React.FC = () => {
  const { startSimulation, isRunning } = useSimulation();

  const scrollToNext = () => {
    const el = document.getElementById('architecture-preview');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden bg-industrial-bg border-b border-industrial-border">
      {/* Background ambient elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-industrial-accentLight/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-industrial-warm/15 blur-3xl" />
      </div>

      {/* Main Hero Viewport Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Positioning */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-accent/10 border border-industrial-accent/20 text-industrial-accent text-xs font-mono font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-accent animate-pulse" />
              <span>Next-Generation Industrial Automation</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-industrial-text tracking-tight leading-[1.08]">
              Where robotic intelligence meets{' '}
              <span className="text-industrial-accent underline decoration-industrial-accent/30 decoration-wavy underline-offset-8">
                precision automation.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-industrial-textMuted max-w-xl leading-relaxed font-sans font-normal">
              A coordinated automation architecture integrating centralized workflow intelligence, six-axis robotic motion control, and precision dispensing into one reliable operational system.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#architecture-preview"
                className="px-6 py-3.5 rounded-xl bg-industrial-text text-white text-sm font-semibold hover:bg-industrial-accent transition-all flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/control-room"
                className="px-6 py-3.5 rounded-xl bg-white border border-industrial-border text-industrial-text text-sm font-semibold hover:bg-industrial-bgSecondary transition-all flex items-center justify-center gap-2 shadow-sm text-center"
              >
                <Play className="w-4 h-4 text-industrial-accent fill-current" />
                <span>Launch Live Simulation</span>
              </Link>
            </div>

            {/* Three Understated Technical Indicators */}
            <div className="pt-8 border-t border-industrial-border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-industrial-accent/10 text-industrial-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading text-industrial-text">
                    6-Axis Motion Intelligence
                  </div>
                  <div className="text-[11px] text-industrial-textMuted font-mono">
                    ROS 2 MoveIt Kinematics
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-industrial-warm/15 text-industrial-warm flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading text-industrial-text">
                    Bidirectional System Comm
                  </div>
                  <div className="text-[11px] text-industrial-textMuted font-mono">
                    Idempotent Trans. Guard
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-industrial-success/15 text-industrial-success flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold font-heading text-industrial-text">
                    Coordinated Dispensing
                  </div>
                  <div className="text-[11px] text-industrial-textMuted font-mono">
                    ±0.05g Closed-Loop Scale
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visualizer Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl p-1 bg-gradient-to-b from-industrial-border to-transparent shadow-lg">
              <RoboticArmCanvas className="shadow-inner" />
            </div>

            {/* Interactive hint tag */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-industrial-textMuted px-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-industrial-accent" />
                <span>Live 6-DOF Kinematic Forward Solver</span>
              </span>
              <Link to="/robotics" className="text-industrial-accent font-semibold hover:underline">
                Full Kinematics →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Small Scroll Indicator */}
      <div className="flex flex-col items-center justify-center pt-4">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center gap-1 text-xs font-mono text-industrial-textMuted hover:text-industrial-text transition-colors group"
          aria-label="Scroll to architecture"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

