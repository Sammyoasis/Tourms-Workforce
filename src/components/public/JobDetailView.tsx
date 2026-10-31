import React, { useState } from 'react';
import { JobListing, WorkerProfile } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea, Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck2
} from 'lucide-react';

export interface JobDetailViewProps {
  job: JobListing;
  onBack: () => void;
  workerProfile: WorkerProfile;
  onApplySuccess: (jobId: string) => void;
  hasApplied: boolean;
  isMobilePreview?: boolean;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onBack,
  workerProfile,
  onApplySuccess,
  hasApplied,
  isMobilePreview = false
}) => {
  const { addToast } = useToast();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isClosedOrExpired = job.status === 'closed' || job.status === 'expired';

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverNote.trim()) {
      addToast({
        type: 'error',
        title: 'Cover note required',
        message: 'Please provide a brief summary of your relevant field capabilities.'
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setApplyModalOpen(false);
      onApplySuccess(job.id);
      addToast({
        type: 'success',
        title: 'Application Transmitted',
        message: `Your verified capabilities profile has been submitted to ${job.organisation}.`
      });
    }, 700);
  };

  return (
    <div
      className={`w-full text-left pb-28 md:pb-16 ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Top Back Navigation Bar */}
      <div className="bg-white border-b border-[#C4C8C5] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E5A46] hover:text-[#0A4535] cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Search</span>
          </button>
          <div className="text-xs text-[#5A6E68]">
            Job ID: <span className="font-mono">{job.id}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Question 1 & 3: What is the role? What will I receive? */}
        <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <span className="text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">
              {job.category}
            </span>
            <StatusIndicator
              status={job.employerVerified ? 'verified' : 'unverified'}
              customLabel={
                job.employerVerified
                  ? 'Verified Employer (CAC Audited)'
                  : 'Unverified Employer Record'
              }
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1F1C] font-display leading-tight">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-[#08382B]">
              <Building2 className="w-4 h-4 text-[#0E5A46]" />
              <span>{job.organisation}</span>
            </div>
          </div>

          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
            <div>
              <span className="text-[#5A6E68] block">Location</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                <span>{job.location.state}, {job.location.lga}</span>
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] block">Employment Type</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0E5A46]" />
                <span>{job.employmentType}</span>
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] block">Compensation</span>
              <span className="font-bold text-[#8E5A18] text-sm tabular-nums mt-0.5 block">
                ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] block">Application Deadline</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#5A6E68]" />
                <span>{job.deadline}</span>
              </span>
            </div>
          </div>

          {job.compensation.notes && (
            <p className="text-xs text-[#5A6E68] italic border-l-2 border-[#C98A3A] pl-3 py-0.5">
              Note on compensation: {job.compensation.notes}
            </p>
          )}

          {/* Desktop Direct Apply Action Header Trigger */}
          <div className="hidden md:flex items-center justify-between pt-4 border-t border-[#EBEBDD]">
            <div>
              <p className="text-xs text-[#5A6E68]">
                Applications reviewed on rolling basis by employer recruitment team.
              </p>
            </div>
            {hasApplied ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0E5A46] bg-[#E7F3EF] px-4 py-2.5 rounded">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </span>
            ) : isClosedOrExpired ? (
              <span className="text-xs text-[#7A8B86] font-semibold">
                Applications closed for this posting
              </span>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setApplyModalOpen(true)}
              >
                Apply for this Position
              </Button>
            )}
          </div>
        </section>

        {/* Core Question 4: What do I need to do? (Responsibilities) */}
        <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-3">
            Primary Field Responsibilities
          </h2>
          <ul className="space-y-2.5 text-sm text-[#3A4B47] leading-relaxed">
            {job.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-2 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Core Question 2: Is it suitable for me? (Requirements & Qualifications) */}
        <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-3">
            Eligibility & Required Capabilities
          </h2>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Essential Requirements
            </h3>
            <ul className="space-y-2 text-sm text-[#3A4B47]">
              {job.essentialRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E5A46] mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {job.desirableQualifications.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#EBEBDD]">
              <h3 className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
                Desirable / Advantageous Qualifications
              </h3>
              <ul className="space-y-2 text-sm text-[#5A6E68]">
                {job.desirableQualifications.map((des, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4C8C5] mt-2 shrink-0" />
                    <span>{des}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Capabilities & Skills Tag List */}
          <div className="pt-4 border-t border-[#EBEBDD] space-y-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Relevant Technical Skills
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
              {job.skills.map((skill, i) => (
                <React.Fragment key={skill}>
                  <span className="text-[#08382B] font-medium">{skill}</span>
                  {i < job.skills.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Core Question 5: How do I apply? */}
        <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-3">
            Application Instructions
          </h2>
          <p className="text-sm text-[#3A4B47] leading-relaxed">
            {job.applicationInstructions}
          </p>

          <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs text-[#5A6E68] space-y-1">
            <p className="font-semibold text-[#0F1F1C]">Tourms Capability Guarantee:</p>
            <p>
              Applying through Tourms automatically attaches your verified credentials, institutional diplomas, and work history.
              Employers do not charge any application or interview fees on this platform.
            </p>
          </div>
        </section>
      </div>

      {/* SCREEN 06 USABILITY SOLUTION: Persistent Mobile Bottom Action Bar */}
      {/* Solves the previous 2,420px mobile scroll distance issue with a sticky safe-area bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#C4C8C5] shadow-2xl p-3 md:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-[#0F1F1C] truncate">{job.title}</p>
            <p className="text-[11px] font-bold text-[#8E5A18] tabular-nums truncate">
              ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
            </p>
          </div>

          <div className="shrink-0">
            {hasApplied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A46] bg-[#E7F3EF] px-3.5 py-2.5 rounded min-h-[44px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Applied</span>
              </span>
            ) : isClosedOrExpired ? (
              <span className="text-xs text-[#7A8B86] font-medium px-2 py-2 block">
                Closed
              </span>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setApplyModalOpen(true)}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Submit Tourms Application"
        description={`Direct submission to ${job.organisation}`}
        maxWidth="lg"
      >
        <form onSubmit={handleApplySubmit} className="space-y-5 text-left">
          {/* Worker identity preview */}
          <div className="p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F1F1C]">{workerProfile.fullName}</span>
              <span className="text-[11px] text-[#0E5A46] font-semibold">Verified Profile</span>
            </div>
            <p className="text-xs text-[#5A6E68]">{workerProfile.headline}</p>
            <p className="text-[11px] text-[#5A6E68]">
              Location: {workerProfile.location.state}, {workerProfile.location.lga}
            </p>
          </div>

          <Textarea
            label="Capability Summary & Cover Note"
            required
            rows={4}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Explain your relevant field experience and equipment capabilities for this position..."
            helperText="Include tractor models, chemical handling history, or flock size managed."
          />

          <div className="p-3 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs text-[#08382B] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <FileCheck2 className="w-4 h-4 text-[#0E5A46]" />
              <span>Supporting Credentials Attached:</span>
            </div>
            <p className="text-[11px] text-[#3A4B47]">
              • {workerProfile.education[0]?.qualification} — {workerProfile.education[0]?.institution}
            </p>
            <p className="text-[11px] text-[#3A4B47]">
              • {workerProfile.certifications[0]?.name} ({workerProfile.certifications[0]?.issuer})
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
