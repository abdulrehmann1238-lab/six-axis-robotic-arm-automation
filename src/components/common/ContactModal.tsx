import React, { useState } from 'react';
import { X, CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name or organization.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid technical contact email.');
      return;
    }
    if (!requirements.trim()) {
      setError('Please briefly describe your robotics or automation requirements.');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setRequirements('');
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#202923] text-industrial-text dark:text-gray-100 max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-industrial-border dark:border-[#3b4c40] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-industrial-textMuted hover:text-industrial-text hover:bg-industrial-bgSecondary dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-industrial-success/15 text-industrial-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading">
              Engineering Inquiry Dispatched
            </h3>
            <p className="text-xs sm:text-sm text-industrial-textMuted max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>. Your project specifications have been securely queued for architecture evaluation.
            </p>
            <div className="p-3 rounded-lg bg-industrial-bgSecondary dark:bg-black/30 font-mono text-[11px] text-industrial-accent">
              DISPATCH_TICKET: #AUT-2026-{Math.floor(1000 + Math.random() * 9000)} [ACKNOWLEDGED]
            </div>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg bg-industrial-accent text-white text-xs font-semibold hover:bg-industrial-accent/90 transition-all"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono font-semibold tracking-wider text-industrial-accent uppercase">
                Direct Engineering Consultation
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mt-1">
                Discuss Your Automation Project
              </h3>
              <p className="text-xs text-industrial-textMuted mt-1">
                Collaborate on ROS 2 integration, six-axis trajectory execution, and precision dispensing architectures.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-industrial-fault/10 border border-industrial-fault/20 text-industrial-fault text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold mb-1">
                  Full Name / Technical Lead <span className="text-industrial-fault">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full px-3 py-2 rounded-lg border border-industrial-border dark:border-[#3e4f43] bg-industrial-bg/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-industrial-accent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Corporate Email <span className="text-industrial-fault">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus.vance@automation-lab.com"
                  className="w-full px-3 py-2 rounded-lg border border-industrial-border dark:border-[#3e4f43] bg-industrial-bg/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-industrial-accent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Project Scope & Operational Requirements <span className="text-industrial-fault">*</span>
                </label>
                <textarea
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Specify payload, cycle time requirements, ROS 2 distribution, dispensing tolerances, or integration with existing ERP/MenuOS systems..."
                  className="w-full px-3 py-2 rounded-lg border border-industrial-border dark:border-[#3e4f43] bg-industrial-bg/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-industrial-accent resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-industrial-textMuted pt-1">
                <ShieldCheck className="w-4 h-4 text-industrial-accent flex-shrink-0" />
                <span>Confidential engineering briefing. Demonstrator preview only.</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-industrial-border dark:border-[#3e4f43] text-industrial-textMuted hover:bg-industrial-bgSecondary dark:hover:bg-white/5 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-industrial-accent text-white font-semibold hover:bg-industrial-accent/90 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Submit Requirements</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

