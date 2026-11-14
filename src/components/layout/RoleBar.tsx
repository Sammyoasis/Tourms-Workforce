import React, { useState } from 'react';
import { UserRole, AdminSubRole } from '../../types';
import { Shield, User, Briefcase, Globe, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { TourmsSymbol } from '../ui/TourmsLogo';

export interface RoleBarProps {
  currentRole: UserRole;
  adminSubRole: AdminSubRole;
  onRoleChange: (role: UserRole) => void;
  onAdminSubRoleChange: (subRole: AdminSubRole) => void;
  onJumpToScreen: (screenId: string) => void;
  onOpenStateSpecimens: () => void;
  currentScreenId?: string;
}

export const CANONICAL_SCREENS = [
  // GROUP A: PUBLIC EXPERIENCE
  { id: 'screen-01', label: 'Screen 01: Home Desktop', path: '/' },
  { id: 'screen-02', label: 'Screen 02: Home Mobile Preview', path: '/?mobile=1' },
  { id: 'screen-03', label: 'Screen 03: Jobs Desktop (Tourms Workforce)', path: '/jobs' },
  { id: 'screen-04', label: 'Screen 04: Jobs Mobile View', path: '/jobs?mobile=1' },
  { id: 'screen-05', label: 'Screen 05: Job Detail Desktop', path: '/jobs/job-001' },
  { id: 'screen-06', label: 'Screen 06: Job Detail Mobile (Sticky Apply)', path: '/jobs/job-001?mobile=1' },

  // GROUP B: WORKER EXPERIENCE
  { id: 'screen-07', label: 'Screen 07: Worker Onboarding (8 Steps)', path: '/worker/onboarding' },
  { id: 'screen-08', label: 'Screen 08: Worker Profile Desktop (Capability-First)', path: '/worker/profile' },
  { id: 'screen-09', label: 'Screen 09: Worker Profile Mobile', path: '/worker/profile?mobile=1' },

  // GROUP C: EMPLOYER EXPERIENCE
  { id: 'screen-10', label: 'Screen 10: Employer Dashboard Desktop', path: '/employer' },
  { id: 'screen-10b', label: 'Screen 10b: Employer Enterprise Onboarding', path: '/employer/onboarding' },
  { id: 'screen-11', label: 'Screen 11: Post a Job — Step 1 (Role Identity)', path: '/employer/post-job?step=1' },
  { id: 'screen-12', label: 'Screen 12: Post a Job — Step 2 (Responsibilities)', path: '/employer/post-job?step=2' },
  { id: 'screen-13', label: 'Screen 13: Post a Job — Step 3 (Skills & Capabilities)', path: '/employer/post-job?step=3' },
  { id: 'screen-14', label: 'Screen 14: Post a Job — Step 4 (Qualifications)', path: '/employer/post-job?step=4' },
  { id: 'screen-14b', label: 'Screen 14b: Post a Job — Step 5 (Location & Schedule)', path: '/employer/post-job?step=5' },
  { id: 'screen-14c', label: 'Screen 14c: Post a Job — Step 6 (Compensation)', path: '/employer/post-job?step=6' },
  { id: 'screen-15', label: 'Screen 15: Post a Job — Step 7 (Review & Submit)', path: '/employer/post-job?step=7' },

  // GROUP D: ADMINISTRATION
  { id: 'screen-16', label: 'Screen 16: Admin Dashboard Console', path: '/admin' },
  { id: 'screen-17', label: 'Screen 17: Admin Jobs Review Queue', path: '/admin/jobs-queue' },
  { id: 'screen-18', label: 'Screen 18: Admin Job Review & Approval', path: '/admin/job-review/job-008' },
  { id: 'screen-19', label: 'Screen 19: Admin Employer Verification (CAC)', path: '/admin/employers' },
  { id: 'screen-20', label: 'Screen 20: Admin Worker Management', path: '/admin/workers' },
  { id: 'screen-21', label: 'Screen 21: Admin Opportunities Review', path: '/admin/opportunities-review' },
  { id: 'screen-22', label: 'Screen 22: Admin Insights & Editorial Flow', path: '/admin/content' },
  { id: 'screen-23', label: 'Screen 23: Admin Reports & Moderation Queue', path: '/admin/reports' },
  { id: 'screen-24', label: 'Screen 24: Admin Users & Role Permissions', path: '/admin/users' },

  // GROUP E: WORKER PAYMENT EXPERIENCE (SCREENS 25–28)
  { id: 'screen-25', label: 'Screen 25: Engagement Offer & Payment Breakdown', path: '/worker/payments?screen=25' },
  { id: 'screen-26', label: 'Screen 26: Worker Engagement Payment Status', path: '/worker/payments?screen=26' },
  { id: 'screen-27', label: 'Screen 27: Submit Work Completion', path: '/worker/payments?screen=27' },
  { id: 'screen-28', label: 'Screen 28: Worker Payment History & Receipts', path: '/worker/payments?screen=28' },

  // GROUP F: EMPLOYER PAYMENT EXPERIENCE (SCREENS 29–33)
  { id: 'screen-29', label: 'Screen 29: Employer Engagement Cost Summary', path: '/employer/payments?screen=29' },
  { id: 'screen-30', label: 'Screen 30: Fund an Engagement', path: '/employer/payments?screen=30' },
  { id: 'screen-31', label: 'Screen 31: Employer Payment Dashboard', path: '/employer/payments?screen=31' },
  { id: 'screen-32', label: 'Screen 32: Review Work Completion', path: '/employer/payments?screen=32' },
  { id: 'screen-33', label: 'Screen 33: Employer Payment History & Details', path: '/employer/payments?screen=33' },

  // GROUP G: ADMIN PAYMENT OPERATIONS (SCREENS 34–39)
  { id: 'screen-34', label: 'Screen 34: Admin Payment Overview', path: '/admin/payments?screen=34' },
  { id: 'screen-35', label: 'Screen 35: Admin Transaction Management', path: '/admin/payments?screen=35' },
  { id: 'screen-36', label: 'Screen 36: Admin Settlement Review Queue', path: '/admin/payments?screen=36' },
  { id: 'screen-37', label: 'Screen 37: Admin Dispute Management', path: '/admin/payments?screen=37' },
  { id: 'screen-38', label: 'Screen 38: Admin Refunds & Cancellations', path: '/admin/payments?screen=38' },
  { id: 'screen-39', label: 'Screen 39: Admin Payment Reports & Reconciliation', path: '/admin/payments?screen=39' }
];

export const RoleBar: React.FC<RoleBarProps> = ({
  currentRole,
  adminSubRole,
  onRoleChange,
  onAdminSubRoleChange,
  onJumpToScreen,
  onOpenStateSpecimens,
  currentScreenId
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const roleLabels: Record<UserRole, string> = {
    public: 'Public',
    worker: 'Worker',
    employer: 'Employer',
    admin: 'Admin'
  };

  return (
    <aside
      aria-label="Product Architecture & Screen Reviewer"
      className="bg-[#0F1F1C] text-[#F7F7EE] border-b border-[#243B36] text-xs py-1.5 px-3 z-50 sticky top-0"
    >
      {/* Mobile Compact 1-Row Bar (< sm) */}
      <div className="sm:hidden flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <TourmsSymbol size={16} />
          <span className="text-[11px] text-[#A0B0AB] font-semibold whitespace-nowrap">
            View: <span className="text-white capitalize">{roleLabels[currentRole]}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <select
            value={currentScreenId || ''}
            onChange={(e) => {
              if (e.target.value) onJumpToScreen(e.target.value);
            }}
            className="bg-[#1A312D] text-white border border-[#3A4B47] rounded px-1.5 py-1 text-[11px] max-w-[130px] truncate"
            aria-label="Jump to screen"
          >
            <option value="">Screens 1–39...</option>
            {CANONICAL_SCREENS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label.split(':')[0]}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="p-1 text-[#C98A3A] hover:text-white rounded flex items-center justify-center min-h-[32px] min-w-[32px] cursor-pointer"
            aria-label="Toggle full reviewer toolbar"
          >
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded controls on mobile or standard desktop view */}
      <div
        className={`${
          mobileExpanded ? 'flex flex-col gap-2 pt-2' : 'hidden'
        } sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-2 max-w-7xl mx-auto`}
      >
        {/* Left: Persona Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#8A9C96] font-medium mr-1 hidden md:inline">Active View:</span>

          <button
            onClick={() => onRoleChange('public')}
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer ${
              currentRole === 'public'
                ? 'bg-[#0E5A46] text-white font-semibold'
                : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Public</span>
          </button>

          <button
            onClick={() => onRoleChange('worker')}
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer ${
              currentRole === 'worker'
                ? 'bg-[#0E5A46] text-white font-semibold'
                : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Worker</span>
          </button>

          <button
            onClick={() => onRoleChange('employer')}
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer ${
              currentRole === 'employer'
                ? 'bg-[#0E5A46] text-white font-semibold'
                : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span>Employer</span>
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors min-h-[32px] cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-[#C98A3A] text-[#0F1F1C] font-bold'
                : 'text-[#A0B0AB] hover:text-white hover:bg-[#1A312D]'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>

          {/* Admin Role Selector if admin */}
          {currentRole === 'admin' && (
            <select
              value={adminSubRole}
              onChange={(e) => onAdminSubRoleChange(e.target.value as AdminSubRole)}
              className="bg-[#1A312D] text-[#F7F7EE] border border-[#3A4B47] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#C98A3A] min-h-[32px]"
              aria-label="Admin sub-role permission filter"
            >
              <option value="super_admin">Role: Super Admin</option>
              <option value="verifier">Role: Verifier</option>
              <option value="moderator">Role: Moderator</option>
              <option value="support_lead">Role: Support Lead</option>
            </select>
          )}
        </div>

        {/* Right: Screen Direct Jump & States Specimen Viewer */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Quick Screen Select Dropdown */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <span className="text-[#8A9C96] hidden md:inline">39 Screens:</span>
            <select
              value={currentScreenId || ''}
              onChange={(e) => {
                if (e.target.value) onJumpToScreen(e.target.value);
              }}
              className="bg-[#1A312D] text-white border border-[#3A4B47] rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0E5A46] min-h-[32px] max-w-[200px] sm:max-w-[260px] truncate"
              aria-label="Jump to specific screen 1 through 39"
            >
              <option value="">Jump to Screen (1 – 39)...</option>
              {CANONICAL_SCREENS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* State Specimens Drawer Button */}
          <button
            onClick={onOpenStateSpecimens}
            className="px-2.5 py-1 text-xs bg-[#243B36] hover:bg-[#344F49] text-[#C98A3A] font-semibold border border-[#3A4B47] rounded inline-flex items-center gap-1 min-h-[32px] transition-colors cursor-pointer"
            title="Inspect loading, empty, error, and validation states"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interaction States</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
