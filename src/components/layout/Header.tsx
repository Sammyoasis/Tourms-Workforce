import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Shield, User, Briefcase } from 'lucide-react';
import { UserRole } from '../../types';

export interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  userRole: UserRole;
  onOpenGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  userRole,
  onOpenGetStarted
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Jobs', path: '/jobs' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Insights', path: '/insights' },
    { label: 'About', path: '/about' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const getDashboardAction = () => {
    if (userRole === 'admin') {
      return {
        label: 'Admin Console',
        icon: <Shield className="w-3.5 h-3.5 text-[#C98A3A]" />,
        path: '/admin'
      };
    }
    if (userRole === 'employer') {
      return {
        label: 'Employer Workspace',
        icon: <Briefcase className="w-3.5 h-3.5 text-[#0E5A46]" />,
        path: '/employer'
      };
    }
    if (userRole === 'worker') {
      return {
        label: 'Worker Profile',
        icon: <User className="w-3.5 h-3.5 text-[#0E5A46]" />,
        path: '/worker/profile'
      };
    }
    return null;
  };

  const roleAction = getDashboardAction();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F7EE] border-b border-[#C4C8C5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar 3-Zone Contract: Brand — Nav Links — 1 Primary Action */}
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand title, single line */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#0E5A46] rounded shrink-0 cursor-pointer"
            aria-label="Tourms Agro-Solutions Homepage"
          >
            {/* Restrained Frequency Mark Motif */}
            <div className="w-8 h-8 rounded bg-[#0F1F1C] flex items-center justify-center shrink-0 shadow-xs">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#F7F7EE]"
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
            <div className="whitespace-nowrap">
              <span className="font-extrabold tracking-tight text-[#0F1F1C] text-base md:text-lg font-display">
                TOURMS
              </span>
              <span className="font-medium tracking-wider text-[#0E5A46] text-xs uppercase ml-1.5 hidden sm:inline">
                AGRO-SOLUTIONS
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Nav links, single line text with subtle hover underlines */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#3A4B47]"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-[#0F1F1C] cursor-pointer ${
                    isActive ? 'text-[#0E5A46] font-bold' : 'text-[#3A4B47]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E5A46] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {roleAction ? (
              <button
                onClick={() => handleNavClick(roleAction.path)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0F1F1C] bg-[#EBEBDD] hover:bg-[#DDDDCB] border border-[#C4C8C5] rounded transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
              >
                {roleAction.icon}
                <span>{roleAction.label}</span>
              </button>
            ) : (
              <button
                onClick={onOpenGetStarted}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0E5A46] hover:bg-[#0A4535] rounded transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0F1F1C] hover:bg-[#EBEBDD] rounded min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C4C8C5] bg-[#F7F7EE] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-left px-3 py-2.5 rounded text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
                    isActive
                      ? 'bg-[#0E5A46] text-white'
                      : 'text-[#0F1F1C] hover:bg-[#EBEBDD]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#C4C8C5] flex flex-col gap-2">
            {roleAction ? (
              <button
                onClick={() => handleNavClick(roleAction.path)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#0F1F1C] bg-[#EBEBDD] border border-[#C4C8C5] rounded min-h-[44px]"
              >
                {roleAction.icon}
                <span>{roleAction.label}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGetStarted();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#0E5A46] rounded min-h-[44px]"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
