import React, { useState } from 'react';
import { X, Layers, AlertCircle, CheckCircle2, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState, LoadingSkeletonCard, LoadingSkeletonTable } from '../ui/EmptyState';
import { Input, Textarea } from '../ui/Input';

export interface StateSpecimenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StateSpecimenDrawer: React.FC<StateSpecimenDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<
    'loading' | 'empty' | 'validation' | 'error' | 'permission' | 'confirmation'
  >('loading');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specimen-drawer-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl h-full bg-[#F7F7EE] shadow-2xl border-l border-[#C4C8C5] flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#0F1F1C] text-white">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C98A3A]" />
            <div>
              <h2 id="specimen-drawer-title" className="text-base font-bold">
                Interaction & State Architecture Specimens
              </h2>
              <p className="text-xs text-[#A0B0AB]">
                Isolated inspection environment (§10 Interaction Architecture)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close specimens drawer"
            className="p-1.5 text-[#A0B0AB] hover:text-white rounded min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 p-2 bg-[#EBEBDD] border-b border-[#C4C8C5] overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('loading')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'loading'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Loading States
          </button>
          <button
            onClick={() => setActiveTab('empty')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'empty'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Empty States
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'validation'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Form Validation
          </button>
          <button
            onClick={() => setActiveTab('error')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'error'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Error & Network
          </button>
          <button
            onClick={() => setActiveTab('permission')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'permission'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Permission Denied
          </button>
          <button
            onClick={() => setActiveTab('confirmation')}
            className={`px-3 py-2 rounded min-h-[36px] whitespace-nowrap cursor-pointer ${
              activeTab === 'confirmation'
                ? 'bg-white text-[#0F1F1C] shadow-xs'
                : 'text-[#5A6E68] hover:text-[#0F1F1C]'
            }`}
          >
            Confirmation
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
          {activeTab === 'loading' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0F1F1C] mb-1">
                  1. Job Listings Loading Skeleton
                </h3>
                <p className="text-xs text-[#5A6E68] mb-3">
                  Shown during asynchronous query dispatch across states and categories.
                </p>
                <LoadingSkeletonCard count={2} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F1F1C] mb-1">
                  2. Admin Review Queue Table Skeleton
                </h3>
                <p className="text-xs text-[#5A6E68] mb-3">
                  Shown while retrieving pending employer CAC and job review records.
                </p>
                <LoadingSkeletonTable rows={3} />
              </div>
            </div>
          )}

          {activeTab === 'empty' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0F1F1C] mb-2">
                  1. Filter Mismatch Empty State
                </h3>
                <EmptyState
                  title="No Jobs Found Matching Your Criteria"
                  description="We could not find any active employment listings in the selected state and category. Try expanding your search radius or resetting filters."
                  actionLabel="Reset Search Filters"
                  onAction={() => alert('Specimen Action: Filters reset')}
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F1F1C] mb-2">
                  2. Employer Zero-Jobs Workspace
                </h3>
                <EmptyState
                  title="No Jobs Published Yet"
                  description="Your organisation has not submitted any agricultural employment requirements. Start the 7-stage posting flow to find qualified talent."
                  actionLabel="Create First Job Requirement"
                  onAction={() => alert('Specimen Action: Navigating to post job')}
                />
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-4 bg-white p-5 rounded border border-[#C4C8C5]">
              <h3 className="text-sm font-bold text-[#0F1F1C]">
                Form Validation Error Specimens
              </h3>
              <p className="text-xs text-[#5A6E68] mb-4">
                Field errors communicate required inputs, format mismatches, and boundary constraints.
              </p>

              <Input
                label="Role Title"
                required
                value=""
                onChange={() => {}}
                error="Role title is required and must describe actual agricultural work."
              />

              <Input
                label="Monthly Gross Compensation (NGN)"
                required
                value="25000"
                onChange={() => {}}
                error="Specified compensation is below minimum agricultural threshold for full-time technical roles."
                helperText="Enter a realistic amount in Nigerian Naira."
              />

              <Textarea
                label="Core Field Responsibilities"
                required
                rows={3}
                value="Work on farm."
                onChange={() => {}}
                error="Please provide at least 3 detailed responsibility items (minimum 50 characters)."
              />
            </div>
          )}

          {activeTab === 'error' && (
            <div className="space-y-4">
              <div className="p-6 bg-white rounded border border-[#C53030]/30 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#C53030]">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="text-sm font-bold">Network Connection Interrupted</h3>
                </div>
                <p className="text-xs text-[#5A6E68] leading-relaxed">
                  The request timed out while communicating with the Tourms workforce registry.
                  In accordance with Nigerian mobile constraints (§14), your unsaved form data has been cached locally in memory.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Retry Connection
                  </Button>
                  <Button variant="outline" size="sm">
                    Inspect Local Cache
                  </Button>
                </div>
              </div>

              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-2">
                <div className="flex items-center gap-2 text-[#8E5A18]">
                  <Clock className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wide">
                    Job Listing Expired
                  </h4>
                </div>
                <p className="text-xs text-[#5A6E68]">
                  This position closed on 24 October 2026. The employer is no longer accepting new applications through Tourms.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'permission' && (
            <div className="p-6 bg-white rounded border border-[#C4C8C5] space-y-4">
              <div className="flex items-center gap-2.5 text-[#C53030]">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-base font-bold text-[#0F1F1C]">
                  Administrative Permission Required
                </h3>
              </div>
              <p className="text-xs text-[#5A6E68] leading-relaxed">
                Your current administrative role (<strong className="text-[#0F1F1C]">Editorial</strong>) does not have access to the CAC Employer Verification or Banking Clearance vault.
                This action requires <strong className="text-[#0F1F1C]">Verification Lead</strong> or <strong className="text-[#0F1F1C]">Super Admin</strong> credentials.
              </p>
              <div className="p-3 bg-[#F7F7EE] rounded text-xs text-[#3A4B47] space-y-1">
                <p className="font-semibold">Audit Event Logged:</p>
                <p className="font-mono text-[11px]">EVENT_CODE: ACCESS_RESTRICTED_AUTH_403</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert('Specimen Action: Escalation request routed')}
              >
                Request Role Escalation
              </Button>
            </div>
          )}

          {activeTab === 'confirmation' && (
            <div className="p-6 bg-white rounded border border-[#C4C8C5] space-y-4">
              <div className="flex items-center gap-2 text-[#0E5A46]">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-base font-bold text-[#0F1F1C]">
                  Application Successfully Submitted
                </h3>
              </div>
              <p className="text-xs text-[#5A6E68] leading-relaxed">
                Your Tourms capability profile and verified credentials have been transmitted to{' '}
                <strong className="text-[#0F1F1C]">Flourish Agri-Enterprises Ltd</strong>.
                You can track review progress in your worker workspace.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="sm" onClick={onClose}>
                  Return to Discovery
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EBEBDD] border-t border-[#C4C8C5] flex justify-between items-center text-xs text-[#5A6E68]">
          <span>Tourms Agro-Solutions Specification Library</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Drawer
          </Button>
        </div>
      </div>
    </div>
  );
};
