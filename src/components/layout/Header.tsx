import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Shield, User, Briefcase } from 'lucide-react';
import { UserRole } from '../../types';
import { TourmsLogo, TourmsFrequencyRhythm } from '../ui/TourmsLogo';

export interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  userRole: UserRole;
  onOpenGetStarted: () => void;
  onOpenAuth?: (tab?: 'worker_reg' | 'employer_reg' | 'signin') => void;
  onSignOut?: () => void;
  isMobilePreview?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  userRole,
  onOpenGetStarted,
  onOpenAuth,
  onSignOut,
  isMobilePreview = false
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
      <div className={`${isMobilePreview ? 'px-3' : 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8'}`}>
        {/* Top Bar 3-Zone Contract: Brand — Nav Links — 1 Primary Action */}
        <div className={`flex items-center justify-between ${isMobilePreview ? 'h-14 gap-2' : 'h-16 gap-3 sm:gap-8'}`}>
          {/* Zone 1: Official Brand Logo with Symbol */}
          <button
            onClick={() => handleNavClick('/')}
            onDoubleClick={() => handleNavClick('/admin')}
            className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0E5A46] rounded shrink-0 cursor-pointer py-1"
            aria-label="Tourms Agro-Solutions Homepage"
          >
            <TourmsLogo variant="agro-solutions" size={isMobilePreview ? 'sm' : 'md'} />
          </button>

          {/* Zone 2: 4-5 Nav links, single line text with subtle hover underlines (hidden in mobile preview) */}
          {!isMobilePreview && (
            <nav
              className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3A4B47]"
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
          )}

          {/* Zone 3: Primary Actions / Auth / Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {!isMobilePreview && roleAction && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick(roleAction.path)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1F1C] bg-[#EBEBDD] hover:bg-[#DDDDCB] border border-[#C4C8C5] rounded transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer"
                >
                  {roleAction.icon}
                  <span>{roleAction.label}</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="inline-flex items-center px-2.5 py-2 text-xs text-[#5A6E68] hover:text-[#0F1F1C] transition-colors whitespace-nowrap cursor-pointer"
                    title="Switch Session / Sign Out"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            )}

            {!isMobilePreview && !roleAction && (
              <div className="hidden sm:flex items-center gap-2.5">
                <button
                  onClick={() => (onOpenAuth ? onOpenAuth('signin') : onOpenGetStarted())}
                  className="inline-flex items-center px-3 py-2 text-xs font-semibold text-[#0F1F1C] hover:text-[#0E5A46] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (onOpenAuth ? onOpenAuth('worker_reg') : onOpenGetStarted())}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0E5A46] hover:bg-[#0A4535] rounded transition-colors whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer shadow-xs"
                >
                  <span>Register / Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle - Accessible >= 44px */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${
                isMobilePreview ? 'flex' : 'md:hidden flex'
              } p-2 text-[#0F1F1C] hover:bg-[#EBEBDD] rounded min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer transition-colors`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Fitted precisely for mobile viewport) */}
      {mobileMenuOpen && (
        <div className={`${isMobilePreview ? 'block' : 'md:hidden'} border-t border-[#C4C8C5] bg-[#F7F7EE] px-4 pt-3 pb-6 space-y-3.5 shadow-xl animate-in slide-in-from-top-2 duration-150`}>
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
                  className={`text-left px-3.5 py-3 rounded text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-between ${
                    isActive
                      ? 'bg-[#0E5A46] text-white'
                      : 'text-[#0F1F1C] hover:bg-[#EBEBDD]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#C4C8C5] flex flex-col gap-2.5">
            {roleAction ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick(roleAction.path)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#0F1F1C] bg-[#EBEBDD] border border-[#C4C8C5] rounded min-h-[44px] cursor-pointer"
                >
                  {roleAction.icon}
                  <span>{roleAction.label}</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-center py-2 text-xs text-[#5A6E68] hover:text-[#0F1F1C]"
                  >
                    Sign Out / Switch Session
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('signin');
                    else onOpenGetStarted();
                  }}
                  className="w-full flex items-center justify-center py-3 px-3 text-xs font-semibold text-[#0F1F1C] bg-[#EBEBDD] border border-[#C4C8C5] rounded min-h-[44px] cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('worker_reg');
                    else onOpenGetStarted();
                  }}
                  className="w-full flex items-center justify-center gap-1 py-3 px-3 text-xs font-semibold text-white bg-[#0E5A46] rounded min-h-[44px] cursor-pointer"
                >
                  <span>Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile Brand Tagline & Frequency Rhythm */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#5A6E68]">
              <span>Same sound, different frequency.</span>
              <TourmsFrequencyRhythm bars={7} height={16} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
