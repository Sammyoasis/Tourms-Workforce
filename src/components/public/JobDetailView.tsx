import React, { useState } from 'react';
import { JobListing, WorkerProfile } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { TourmsSymbol } from '../ui/TourmsLogo';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  Building2,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { calculateCandidateFarmMatch } from '../../services/aiAgriService';

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
      className={`w-full text-left pb-28 md:pb-16 overflow-x-hidden ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Top Back Navigation Bar */}
      <div className="bg-white border-b border-[#C4C8C5] py-3 sm:py-4 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E5A46] hover:text-[#0A4535] cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Search</span>
          </button>
          <div className="text-[11px] text-[#5A6E68]">
            Job ID: <span className="font-mono text-[#0F1F1C]">{job.id}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`max-w-5xl mx-auto ${isMobilePreview ? 'px-4 py-5 space-y-4' : 'px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8'}`}>
        {/* Core Question 1 & 3: What is the role? What will I receive? */}
        <section className={`bg-white border border-[#C4C8C5] rounded shadow-2xs ${isMobilePreview ? 'p-4 space-y-4' : 'p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <span className="text-[10px] sm:text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">
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
            <h1 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl'} font-extrabold text-[#0F1F1C] font-display leading-tight break-words`}>
              {job.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm font-semibold text-[#08382B]">
              <Building2 className="w-4 h-4 text-[#0E5A46]" />
              <span>{job.organisation}</span>
            </div>
          </div>

          {/* Key Facts Strip (Optimized for 2-col on mobile screens) */}
          <div className={`grid grid-cols-2 ${isMobilePreview ? '' : 'sm:grid-cols-4'} gap-2.5 sm:gap-4 p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs`}>
            <div>
              <span className="text-[#5A6E68] text-[11px] block">Location</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
                <span className="truncate">{job.location.state}, {job.location.lga}</span>
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] text-[11px] block">Employment</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5 truncate">
                <Briefcase className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
                <span className="truncate">{job.employmentType}</span>
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] text-[11px] block">Compensation</span>
              <span className="font-bold text-[#8E5A18] text-xs sm:text-sm tabular-nums mt-0.5 block truncate">
                ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
              </span>
            </div>

            <div>
              <span className="text-[#5A6E68] text-[11px] block">Deadline</span>
              <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-[#5A6E68] shrink-0" />
                <span>{job.deadline}</span>
              </span>
            </div>
          </div>

          {job.compensation.notes && (
            <p className="text-xs text-[#5A6E68] italic border-l-2 border-[#C98A3A] pl-3 py-0.5">
              Note on compensation: {job.compensation.notes}
            </p>
          )}

          {/* AI Smart Farm Match & Seasonal Availability Assessment */}
          {(() => {
            const match = calculateCandidateFarmMatch(workerProfile, job);
            return (
              <div className="p-4 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-2.5 text-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#C2DDD3]">
                  <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                    <Sparkles className="w-4 h-4 text-[#C98A3A]" />
                    <span>AI Candidate Compatibility & Seasonal Availability Match</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0E5A46] bg-white px-2.5 py-0.5 rounded border border-[#C2DDD3]">
                    {match.overallMatchPercent}% Profile Fit
                  </span>
                </div>

                <p className="text-[#0F1F1C] font-semibold text-xs leading-relaxed">
                  {match.matchSummary}
                </p>

                {/* Sub-Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-[#5A6E68]">
                  <div className="p-2 bg-white rounded border border-[#C2DDD3]">
                    <span className="block text-[10px]">Crop / Category</span>
                    <strong className="text-[#0F1F1C]">{match.categoryScore}% Match</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#C2DDD3]">
                    <span className="block text-[10px]">Geopolitical Proximity</span>
                    <strong className="text-[#0F1F1C]">{match.locationScore}% Match</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#C2DDD3]">
                    <span className="block text-[10px]">Equipment & Skills</span>
                    <strong className="text-[#0F1F1C]">{match.skillsScore}% Match</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#C2DDD3]">
                    <span className="block text-[10px]">Seasonal Readiness</span>
                    <strong className="text-[#0E5A46]">{match.seasonalityScore}% Match</strong>
                  </div>
                </div>

                {match.strengths.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Top Compatibility Factors:</span>
                    <ul className="space-y-0.5 text-[11px] text-[#3A4B47]">
                      {match.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

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
        <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-2.5">
            Primary Field Responsibilities
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#3A4B47] leading-relaxed">
            {job.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-2 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Core Question 2: Is it suitable for me? (Requirements & Qualifications) */}
        <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-2.5">
            Eligibility & Required Capabilities
          </h2>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Essential Requirements
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#3A4B47]">
              {job.essentialRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E5A46] mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {job.desirableQualifications.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#EBEBDD]">
              <h3 className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
                Desirable / Advantageous Qualifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5A6E68]">
                {job.desirableQualifications.map((des, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4C8C5] mt-1.5 shrink-0" />
                    <span>{des}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Capabilities & Skills Tag List */}
          <div className="pt-3 border-t border-[#EBEBDD] space-y-1.5">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Relevant Technical Skills
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
              {job.skills.map((skill, i) => (
                <React.Fragment key={skill}>
                  <span className="text-[#08382B] font-semibold">{skill}</span>
                  {i < job.skills.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Core Question 5: How do I apply? */}
        <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-2.5">
            Application Instructions
          </h2>
          <p className="text-xs sm:text-sm text-[#3A4B47] leading-relaxed">
            {job.applicationInstructions}
          </p>

          <div className="p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs text-[#5A6E68] space-y-1">
            <p className="font-semibold text-[#0F1F1C]">Tourms Capability Guarantee:</p>
            <p className="text-[11px] leading-relaxed">
              Applying through Tourms automatically attaches your verified credentials and work history.
              Employers on Tourms are prohibited from charging application or interview fees.
            </p>
          </div>
        </section>
      </div>

      {/* SCREEN 06 HIGH-PRIORITY USABILITY SOLUTION: Persistent Mobile Bottom Action Bar */}
      {/* Respects safe areas and 15% viewport height cap */}
      <div
        className={`${
          isMobilePreview
            ? 'sticky bottom-0 z-30 bg-white border-t border-[#C4C8C5] shadow-2xl p-2.5 sm:p-3'
            : 'fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#C4C8C5] shadow-2xl p-2.5 sm:p-3 md:hidden'
        }`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
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
        <form onSubmit={handleApplySubmit} className="space-y-4 text-left">
          {/* Worker identity preview */}
          <div className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
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
