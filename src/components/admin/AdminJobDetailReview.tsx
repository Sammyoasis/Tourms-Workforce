import React, { useState } from 'react';
import { JobListing, JobStatus } from '../../types';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { StatusIndicator } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  FileText
} from 'lucide-react';

export interface AdminJobDetailReviewProps {
  job: JobListing;
  onBack: () => void;
  onUpdateStatus: (jobId: string, status: JobStatus, reviewNotes: string) => void;
}

export const AdminJobDetailReview: React.FC<AdminJobDetailReviewProps> = ({
  job,
  onBack,
  onUpdateStatus
}) => {
  const { addToast } = useToast();
  const [reviewNotes, setReviewNotes] = useState(job.reviewNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDecision = (status: JobStatus, actionLabel: string) => {
    if ((status === 'rejected' || status === 'changes_requested') && !reviewNotes.trim()) {
      addToast({
        type: 'error',
        title: 'Review notes required',
        message: 'Please document the justification for changes or rejection in the audit trail.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateStatus(job.id, status, reviewNotes);
      addToast({
        type: status === 'approved' ? 'success' : 'info',
        title: `Job ${actionLabel}`,
        message: `Status updated for ${job.title}. Audit record preserved.`
      });
      onBack();
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl text-left overflow-x-hidden min-w-0 break-words">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#C4C8C5]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E5A46] hover:text-[#0A4535] cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs Review Queue</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#5A6E68]">Current Status:</span>
          <StatusIndicator status={job.status as any} />
        </div>
      </div>

      {/* Main Review Card */}
      <div className="bg-white rounded border border-[#C4C8C5] p-6 md:p-8 space-y-6 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C98A3A] tracking-wider uppercase mb-1">
            <span>SCREEN 18: OPERATIONAL COMPLIANCE INSPECTION</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0F1F1C]">
            {job.title}
          </h1>
          <p className="text-xs text-[#0E5A46] font-semibold mt-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{job.organisation} (Employer ID: {job.employerId})</span>
          </p>
        </div>

        {/* Audit Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
          <div>
            <span className="text-[#5A6E68] block">Sector</span>
            <span className="font-bold text-[#0F1F1C]">{job.category}</span>
          </div>
          <div>
            <span className="text-[#5A6E68] block">Location</span>
            <span className="font-bold text-[#0F1F1C]">{job.location.state}, {job.location.lga}</span>
          </div>
          <div>
            <span className="text-[#5A6E68] block">Offered Wage</span>
            <span className="font-bold text-[#8E5A18] tabular-nums">
              ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
            </span>
          </div>
          <div>
            <span className="text-[#5A6E68] block">CAC Standing</span>
            <span className="font-bold text-[#0E5A46] flex items-center gap-1">
              {job.employerVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : null}
              <span>{job.employerVerified ? 'Verified' : 'Unverified'}</span>
            </span>
          </div>
        </div>

        {/* Content Review Sections */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1">
              Role Summary
            </h3>
            <p className="text-xs text-[#3A4B47] leading-relaxed p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {job.summary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1">
              Reported Responsibilities
            </h3>
            <ul className="text-xs text-[#3A4B47] space-y-1 p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1">
              Essential Qualifications & Skills
            </h3>
            <ul className="text-xs text-[#3A4B47] space-y-1 p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {job.essentialRequirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3A] mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="p-4 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 space-y-2 text-xs text-[#08382B]">
          <p className="font-bold uppercase tracking-wider">
            Tourms Operational Verification Checklist
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>Compensation exceeds minimum agricultural baseline</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>No requests for upfront application fees</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>Valid farm site location in {job.location.state}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>Work duties adhere to agricultural safety standards</span>
            </p>
          </div>
        </div>

        {/* Audit Notes & Reviewer Decision Form */}
        <div className="space-y-3 pt-4 border-t border-[#EBEBDD]">
          <Textarea
            label="Administrative Review Notes & Justification (Required for changes or rejection)"
            rows={3}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Document audit remarks, verification reference, or policy citations..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<XCircle className="w-4 h-4" />}
                onClick={() => handleDecision('rejected', 'Rejected')}
              >
                Reject Posting
              </Button>

              <Button
                variant="outline"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<AlertTriangle className="w-4 h-4" />}
                onClick={() => handleDecision('changes_requested', 'Returned for Changes')}
              >
                Request Changes
              </Button>
            </div>

            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleDecision('approved', 'Approved & Published')}
            >
              Approve & Publish to Registry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
