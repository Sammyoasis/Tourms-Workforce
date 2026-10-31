import React from 'react';

export interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSpecs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSpecs }) => {
  return (
    <footer className="w-full bg-[#0F1F1C] text-[#F7F7EE] border-t border-[#1F332F] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1F332F]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#0E5A46] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 12h2M8 8v8M12 4v16M16 9v6M20 12h-2" />
                </svg>
              </div>
              <span className="font-extrabold tracking-tight text-white text-lg font-display">
                TOURMS AGRO-SOLUTIONS
              </span>
            </div>

            <p className="text-xs text-[#C98A3A] font-semibold tracking-wider uppercase">
              AGRICULTURE, CONNECTED BETTER.
            </p>

            <p className="text-sm text-[#A0B0AB] max-w-md leading-relaxed">
              Work, opportunity and knowledge for the people and businesses shaping agriculture.
              Agricultural workforce infrastructure and verified opportunity pathways across Nigeria.
            </p>

            <div className="pt-2">
              <p className="text-xs text-[#7A8B86]">
                <strong className="text-[#C4C8C5]">Master Brand:</strong> Same sound, different frequency.
              </p>
            </div>
          </div>

          {/* Column 2: Public Destinations */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Destinations</p>
            <ul className="space-y-2.5 text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/jobs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jobs (Workforce)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Opportunities (Grants & Funds)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Insights & Research Briefs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Tourms
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platforms & Workflows */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Ecosystem</p>
            <ul className="space-y-2.5 text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/worker/onboarding')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Worker Onboarding
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/worker/profile')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Capability Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/employer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Employer Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/employer/post-job')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Post a Job (7 Stages)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Operational Console & Specs */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Administration</p>
            <ul className="space-y-2.5 text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Operations Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/jobs-queue')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jobs Review Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/employers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Employer CAC Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/reports')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Reports & Moderation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSpecs}
                  className="text-[#C98A3A] hover:underline font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Design & State Specimens</span>
                  <span>→</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8B86]">
          <p>© {new Date().getFullYear()} TOURMS AGRO-SOLUTIONS. All rights reserved. Nigeria-first agricultural architecture.</p>
          <div className="flex items-center gap-6">
            <span>WCAG 2.2 AA Compliant</span>
            <span>·</span>
            <span>36 States & FCT Coverage</span>
            <span>·</span>
            <span className="text-[#C98A3A]">Same Sound, Different Frequency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
