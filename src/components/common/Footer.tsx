import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Layers, Droplet, Shield, Terminal } from 'lucide-react';
import { ContactModal } from './ContactModal';

export const Footer: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer className="bg-industrial-dark text-gray-200 border-t border-[#313f36]">
        {/* Top Callout Section (PRD Section 17) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-[#313f36]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accentLight uppercase">
                ENGINEERING COLLABORATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                Let's bring intelligent automation into operation.
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
                From robotic motion intelligence to synchronized dispensing and industrial control, let's engineer a reliable automation architecture built around your operational requirements.
              </p>

              {/* Engineering Focus Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Robotics Software Engineering',
                  'Six-Axis Motion Intelligence',
                  'ROS 2 Integration',
                  'Dispensing System Control',
                  'Industrial Automation'
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full px-6 py-3.5 rounded-xl bg-industrial-accent text-white font-semibold hover:bg-industrial-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Discuss the Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <Link
                to="/control-room"
                className="w-full px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Explore the Control Room</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Links & Technical Disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-4">
                <Layers className="w-4 h-4 text-industrial-accentLight" />
                <span>Architecture</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/architecture" className="hover:text-white transition-colors">MenuOS Orchestration</Link></li>
                <li><Link to="/architecture" className="hover:text-white transition-colors">Robotic Arm System</Link></li>
                <li><Link to="/architecture" className="hover:text-white transition-colors">Dispensing System (DS)</Link></li>
                <li><Link to="/architecture" className="hover:text-white transition-colors">6-Layer Software Stack</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-4">
                <Cpu className="w-4 h-4 text-industrial-warm" />
                <span>Motion & Robotics</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/robotics" className="hover:text-white transition-colors">6-Axis Kinematics</Link></li>
                <li><Link to="/robotics" className="hover:text-white transition-colors">Joint Telemetry (J1-J6)</Link></li>
                <li><Link to="/robotics" className="hover:text-white transition-colors">ROS 2 Trajectory Pipeline</Link></li>
                <li><Link to="/robotics" className="hover:text-white transition-colors">Motion Sequence Testbench</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-4">
                <Droplet className="w-4 h-4 text-industrial-success" />
                <span>Dispensing & Sync</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/dispensing" className="hover:text-white transition-colors">Load Cell Verification</Link></li>
                <li><Link to="/dispensing" className="hover:text-white transition-colors">Optical Jar Sensing</Link></li>
                <li><Link to="/dispensing" className="hover:text-white transition-colors">Idempotency Guard</Link></li>
                <li><Link to="/dispensing" className="hover:text-white transition-colors">Actuator Calibration</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-heading font-bold text-sm mb-4">
                <Terminal className="w-4 h-4 text-industrial-accent" />
                <span>Platform Live</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/control-room" className="hover:text-white transition-colors">Supervisory Control Room</Link></li>
                <li><Link to="/simulation" className="hover:text-white transition-colors">Automated Test Scenarios</Link></li>
                <li><button onClick={() => setIsContactOpen(true)} className="hover:text-white transition-colors">Consultation Inquiry</button></li>
              </ul>
            </div>
          </div>

          {/* Legal / Engineering Disclosure */}
          <div className="pt-8 border-t border-[#313f36] flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-industrial-success" />
              <span>Intelligent Robotic Preparation System © 2026. Demonstration Environment.</span>
            </div>
            <p className="max-w-md text-center md:text-right text-[11px] leading-relaxed">
              Illustrative software simulation for architectural validation and engineering workflow evaluation. Not connected to physical high-voltage actuators.
            </p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

