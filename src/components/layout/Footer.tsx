import React from 'react';
import { TourmsLogo, TourmsFrequencyRhythm } from '../ui/TourmsLogo';
import { UserRole } from '../../types';

export interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenSpecs: () => void;
  userRole?: UserRole;
  isMobilePreview?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSpecs,
  userRole = 'public',
  isMobilePreview = false
}) => {
  if (isMobilePreview) {
    return (
      <footer className="w-full bg-[#0F1F1C] text-[#F7F7EE] border-t border-[#1F332F] py-8 px-4 text-left">
        <div className="space-y-4">
          <TourmsLogo variant="agro-solutions" size="sm" theme="dark" />
          <p className="text-[11px] text-[#A0B0AB] leading-relaxed">
            Work, opportunity and knowledge for the people and businesses shaping agriculture across Nigeria.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <TourmsFrequencyRhythm bars={7} height={16} />
            <span className="text-[10px] text-[#7A8B86]">Same sound, different frequency.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1F332F] text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Destinations</span>
              <button onClick={() => onNavigate('/jobs')} className="text-[#A0B0AB] hover:text-white block text-left">
                Jobs
              </button>
              <button onClick={() => onNavigate('/opportunities')} className="text-[#A0B0AB] hover:text-white block text-left">
                Opportunities
              </button>
              <button onClick={() => onNavigate('/insights')} className="text-[#A0B0AB] hover:text-white block text-left">
                Insights
              </button>
              <button onClick={() => onNavigate('/about')} className="text-[#A0B0AB] hover:text-white block text-left">
                About & Brand
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Portals</span>
              <button onClick={() => onNavigate('/worker/profile')} className="text-[#A0B0AB] hover:text-white block text-left">
                Worker Profile
              </button>
              <button onClick={() => onNavigate('/employer')} className="text-[#A0B0AB] hover:text-white block text-left">
                Employer Hub
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F332F] text-[10px] text-[#7A8B86] space-y-1">
            <p onClick={() => onNavigate('/admin')} className="cursor-default select-none">© {new Date().getFullYear()} TOURMS AGRO-SOLUTIONS</p>
            <p>Nigeria-First Agricultural Architecture · WCAG 2.2 AA</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#0F1F1C] text-[#F7F7EE] border-t border-[#1F332F] pt-12 md:pt-16 pb-12 mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10 md:pb-12 border-b border-[#1F332F]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <TourmsLogo variant="agro-solutions" size="lg" theme="dark" />

            <div className="pt-1">
              <p className="text-xs text-[#C98A3A] font-semibold tracking-wider uppercase">
                AGRICULTURE, CONNECTED BETTER.
              </p>
              <p className="text-xs sm:text-sm text-[#A0B0AB] max-w-md leading-relaxed mt-1">
                Work, opportunity and knowledge for the people and businesses shaping agriculture.
                Connecting agricultural professionals, vetted commercial agribusinesses, and verified funding pathways across Nigeria.
              </p>
            </div>

            {/* Frequency Graphic System Rhythmic Accent */}
            <div className="pt-2 flex items-center gap-3">
              <TourmsFrequencyRhythm bars={11} height={20} />
              <span className="text-[11px] text-[#7A8B86] font-medium tracking-wide">
                One sound. Many expressions.
              </span>
            </div>
          </div>

          {/* Column 2: Public Destinations */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Destinations</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/jobs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Jobs (Tourms Workforce)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Opportunities (Grants & Funds)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Insights & Research Briefs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Tourms & Brand Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ecosystem & Workflows */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Ecosystem</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/worker/onboarding')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Worker Onboarding (8 Steps)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/worker/profile')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Capability Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/employer')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Employer Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/employer/post-job')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Post a Job (7 Stages)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Verification */}
          <div className="text-left space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Standards & Trust</p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#A0B0AB]">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  CAC Identity Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/jobs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Agri-Wage Benchmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Verified Funding Pathways
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Platform Data Protection
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A8B86] text-center sm:text-left">
          <p><span onClick={() => onNavigate('/admin')} className="cursor-default select-none hover:text-[#A0B0AB] transition-colors" title="Operations">© {new Date().getFullYear()}</span> TOURMS AGRO-SOLUTIONS. Nigeria-first agricultural architecture.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <span>WCAG 2.2 AA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>36 States & FCT</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C98A3A]">Same Sound, Different Frequency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
