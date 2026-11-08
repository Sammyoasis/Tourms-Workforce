import React, { useState } from 'react';
import { AdminSubRole } from '../../types';
import { TourmsSymbol } from '../ui/TourmsLogo';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  Award,
  BookOpen,
  AlertTriangle,
  UserCheck,
  Shield,
  ChevronDown,
  ChevronUp,
  Receipt,
  LogOut
} from 'lucide-react';

export interface AdminConsoleLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminSubRole: AdminSubRole;
  pendingJobsCount: number;
  pendingEmployersCount: number;
  openReportsCount: number;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const AdminConsoleLayout: React.FC<AdminConsoleLayoutProps> = ({
  currentTab,
  onSelectTab,
  adminSubRole,
  pendingJobsCount,
  pendingEmployersCount,
  openReportsCount,
  onSignOut,
  children
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Console Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'jobs-queue',
      label: 'Jobs Review Queue',
      icon: <Briefcase className="w-4 h-4" />,
      badge: pendingJobsCount > 0 ? pendingJobsCount : undefined
    },
    {
      id: 'employers',
      label: 'Employer CAC Verification',
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingEmployersCount > 0 ? pendingEmployersCount : undefined
    },
    { id: 'workers', label: 'Worker Capability Registry', icon: <Users className="w-4 h-4" /> },
    {
      id: 'payments',
      label: 'Payments & Settlement Desk',
      icon: <Receipt className="w-4 h-4" />
    },
    { id: 'opportunities', label: 'Opportunities Review', icon: <Award className="w-4 h-4" /> },
    { id: 'content', label: 'Insights & Editorial', icon: <BookOpen className="w-4 h-4" /> },
    {
      id: 'reports',
      label: 'Reports & Moderation',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: openReportsCount > 0 ? openReportsCount : undefined,
      destructiveBadge: true
    },
    { id: 'users', label: 'Users & Roles', icon: <UserCheck className="w-4 h-4" /> }
  ];

  const subRoleTitles: Record<AdminSubRole, string> = {
    super_admin: 'Super Administrator',
    operations: 'Operations Officer',
    verification: 'Verification Desk Lead',
    editorial: 'Senior Editorial Desk',
    support: 'Platform Support Lead',
    analyst: 'Data & Telemetry Analyst'
  };

  const activeItem = navItems.find((item) => item.id === currentTab) || navItems[0];

  return (
    <div className="w-full min-h-[85vh] bg-[#F7F7EE] text-left flex flex-col md:flex-row border-t border-[#C4C8C5]">
      {/* Mobile Top Console Bar (< md) */}
      <div className="md:hidden bg-[#0F1F1C] text-[#F7F7EE] border-b border-[#243B36] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TourmsSymbol size={18} />
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{activeItem.label}</span>
                {activeItem.badge && (
                  <span className="text-[10px] bg-[#C98A3A] text-[#0F1F1C] font-bold px-1.5 py-0.2 rounded">
                    {activeItem.badge}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-[#A0B0AB]">{subRoleTitles[adminSubRole]}</p>
            </div>
          </div>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="px-2.5 py-1 text-xs bg-[#1A312D] text-[#C98A3A] border border-[#2B4741] rounded flex items-center gap-1 min-h-[36px]"
          >
            <span>Sections</span>
            {mobileNavOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="pt-3 border-t border-[#243B36] mt-3 space-y-1 animate-in fade-in">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium min-h-[40px] ${
                    isActive
                      ? 'bg-[#0E5A46] text-white font-bold'
                      : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.destructiveBadge
                          ? 'bg-[#C53030] text-white'
                          : 'bg-[#C98A3A] text-[#0F1F1C]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onSignOut && (
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-semibold text-[#FF8585] hover:bg-[#331414] transition-colors border border-[#8C2E2E]/40 mt-2"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Exit Admin Console (Sign Out)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Admin Operational Sidebar (240px-260px) */}
      <aside className="hidden md:flex w-64 bg-[#0F1F1C] text-[#F7F7EE] border-r border-[#243B36] flex-col justify-between shrink-0">
        <div className="p-4 space-y-4">
          {/* Operator Badge */}
          <div className="p-3 bg-[#1A312D] rounded border border-[#2B4741] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#C98A3A] uppercase tracking-wider">
                Console Security
              </span>
              <Shield className="w-3.5 h-3.5 text-[#C98A3A]" />
            </div>
            <p className="text-xs font-bold text-white truncate">
              {subRoleTitles[adminSubRole]}
            </p>
            <p className="text-[10px] text-[#A0B0AB]">Clearance: Authenticated</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-[#0E5A46] text-white font-bold'
                      : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                        item.destructiveBadge
                          ? 'bg-[#C53030] text-white'
                          : 'bg-[#C98A3A] text-[#0F1F1C]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Exit Button */}
        <div className="p-4 border-t border-[#243B36] space-y-3">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold text-[#F7F7EE] bg-[#243B36] hover:bg-[#331414] hover:text-[#FF8585] hover:border-[#8C2E2E] border border-[#2B4741] transition-colors cursor-pointer"
              title="Sign out of Admin Console"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Sign Out / Exit Admin</span>
            </button>
          )}

          <div className="text-[11px] text-[#7A8B86] space-y-0.5">
            <p className="font-semibold text-[#A0B0AB]">Tourms Operations Core</p>
            <p>Audited Session ID: #TRM-OPS-2026</p>
          </div>
        </div>
      </aside>

      {/* Main Operational Viewport */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
};
