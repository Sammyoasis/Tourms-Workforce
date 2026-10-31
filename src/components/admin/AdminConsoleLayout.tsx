import React from 'react';
import { AdminSubRole } from '../../types';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  Award,
  BookOpen,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Shield
} from 'lucide-react';

export interface AdminConsoleLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminSubRole: AdminSubRole;
  pendingJobsCount: number;
  pendingEmployersCount: number;
  openReportsCount: number;
  children: React.ReactNode;
}

export const AdminConsoleLayout: React.FC<AdminConsoleLayoutProps> = ({
  currentTab,
  onSelectTab,
  adminSubRole,
  pendingJobsCount,
  pendingEmployersCount,
  openReportsCount,
  children
}) => {
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

  return (
    <div className="w-full min-h-[85vh] bg-[#F7F7EE] text-left flex flex-col md:flex-row border-t border-[#C4C8C5]">
      {/* Admin Operational Sidebar (240px-280px) */}
      <aside className="w-full md:w-64 bg-[#0F1F1C] text-[#F7F7EE] border-r border-[#243B36] flex flex-col justify-between shrink-0">
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

        {/* Footer info */}
        <div className="p-4 border-t border-[#243B36] text-[11px] text-[#7A8B86] space-y-1">
          <p className="font-semibold text-[#A0B0AB]">Tourms Operations Core</p>
          <p>Audited Session ID: #TRM-OPS-2026</p>
        </div>
      </aside>

      {/* Main Operational Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
