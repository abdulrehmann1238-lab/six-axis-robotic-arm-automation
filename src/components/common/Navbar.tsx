import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Radio, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import { useSimulation } from '../../state/simulationContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { safetyState, isRunning } = useSimulation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Overview', to: '/' },
    { label: 'Architecture', to: '/architecture' },
    { label: 'Robotics', to: '/robotics' },
    { label: 'Dispensing', to: '/dispensing' },
    { label: 'Control Room', to: '/control-room' },
    { label: 'Simulation', to: '/simulation' },
  ];

  const isCurrent = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isControlRoom = location.pathname === '/control-room';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isControlRoom 
        ? 'bg-[#1b231e]/95 border-b border-[#313f36] text-gray-100 backdrop-blur-md'
        : isScrolled
          ? 'bg-industrial-bg/95 border-b border-industrial-border shadow-sm backdrop-blur-md text-industrial-text'
          : 'bg-transparent text-industrial-text'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-industrial-accent flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm sm:text-base tracking-tight leading-none text-current">
              Robotic Automation Systems
            </span>
            <span className="text-[10px] font-mono tracking-wider text-industrial-textMuted uppercase mt-1">
              Industrial Platform
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 font-sans text-xs sm:text-sm">
          {navLinks.map((link) => {
            const active = isCurrent(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  active
                    ? isControlRoom
                      ? 'bg-white/10 text-white font-semibold'
                      : 'bg-industrial-accent/10 text-industrial-accent font-semibold'
                    : isControlRoom
                      ? 'text-gray-300 hover:text-white hover:bg-white/5'
                      : 'text-industrial-textMuted hover:text-industrial-text hover:bg-industrial-bgSecondary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Status & Launch CTA */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-industrial-bgSecondary/80 dark:bg-black/30 border border-industrial-border/60 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${
              safetyState === 'EMERGENCY_STOP' ? 'bg-industrial-fault animate-pulse' :
              isRunning ? 'bg-industrial-warning animate-ping' :
              'bg-industrial-success'
            }`} />
            <span className="font-medium text-current">
              {safetyState === 'EMERGENCY_STOP' ? 'SAFETY_STOP' :
               isRunning ? 'RUNNING_OP' : 'SYSTEMS_READY'}
            </span>
          </div>

          {/* Launch Control Room button */}
          <Link
            to="/control-room"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-industrial-accent text-white text-xs font-semibold hover:bg-industrial-accent/90 transition-all shadow-sm group"
          >
            <span>Control Room</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex items-center sm:hidden gap-2">
          <Link
            to="/control-room"
            className="px-2.5 py-1.5 rounded bg-industrial-accent text-white text-xs font-semibold"
          >
            Control Room
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-industrial-bgSecondary text-current transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-inherit bg-industrial-bg dark:bg-[#1b231e] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isCurrent(link.to)
                  ? 'bg-industrial-accent/15 text-industrial-accent font-semibold'
                  : 'text-industrial-text hover:bg-industrial-bgSecondary'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono">
            <span className="text-industrial-textMuted">Operational State:</span>
            <span className="font-semibold text-industrial-success">NOMINAL</span>
          </div>
        </div>
      )}
    </header>
  );
};

