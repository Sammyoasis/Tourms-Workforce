import React, { useState, useMemo } from 'react';
import { JobListing, JobApplication, EmployerProfile, WorkerProfile } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Building2,
  ArrowRight,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Award,
  Wrench,
  Check,
  Mail,
  Phone,
  Send,
  Eye,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Wheat
} from 'lucide-react';
import {
  calculateCandidateFarmMatch,
  calculateCandidateCompatibility,
  getRecommendedCandidatesForJob,
  CandidateCompatibilityResult
} from '../../services/aiAgriService';
import { SAMPLE_WORKER, SAMPLE_WORKERS } from '../../data/mockData';

export interface EmployerDashboardProps {
  employer: EmployerProfile;
  jobs: JobListing[];
  applications: JobApplication[];
  workers?: WorkerProfile[];
  onNavigatePostJob: () => void;
  onNavigatePayments?: () => void;
  onNavigateOnboarding?: () => void;
  onSelectApplication: (appId: string) => void;
  onSelectJob: (jobId: string) => void;
  onUpdateAppStatus: (appId: string, status: any) => void;
  isMobilePreview?: boolean;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  employer,
  jobs,
  applications,
  workers = SAMPLE_WORKERS,
  onNavigatePostJob,
  onNavigatePayments,
  onNavigateOnboarding,
  onSelectApplication,
  onSelectJob,
  onUpdateAppStatus,
  isMobilePreview = false
}) => {
  const { addToast } = useToast();
  const activeJobs = jobs.filter((j) => j.employerId === employer.id || j.status === 'approved' || j.status === 'awaiting_review');
  const pendingApps = applications.filter((a) => a.status === 'under_review' || a.status === 'submitted');

  // Candidate Matcher State
  const defaultJobId = activeJobs[0]?.id || jobs[0]?.id || '';
  const [selectedMatcherJobId, setSelectedMatcherJobId] = useState<string>(defaultJobId);
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [stateOnlyFilter, setStateOnlyFilter] = useState<boolean>(false);
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<string[]>([]);
  const [inspectingCandidate, setInspectingCandidate] = useState<CandidateCompatibilityResult | null>(null);

  // Active Job for Matching
  const currentMatcherJob = useMemo(() => {
    return (
      activeJobs.find((j) => j.id === selectedMatcherJobId) ||
      jobs.find((j) => j.id === selectedMatcherJobId) ||
      activeJobs[0] ||
      jobs[0]
    );
  }, [activeJobs, jobs, selectedMatcherJobId]);

  // Run the Candidate Matcher Algorithm on all available worker profiles
  const rawRecommendations = useMemo(() => {
    if (!currentMatcherJob) return [];
    return getRecommendedCandidatesForJob(currentMatcherJob, workers);
  }, [currentMatcherJob, workers]);

  // Filter recommendations based on user controls
  const filteredRecommendations = useMemo(() => {
    return rawRecommendations.filter((rec) => {
      if (rec.overallScore < minScoreFilter) return false;
      if (stateOnlyFilter && rec.worker.location.state.toLowerCase() !== currentMatcherJob?.location.state.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [rawRecommendations, minScoreFilter, stateOnlyFilter, currentMatcherJob]);

  const handleInviteCandidate = (worker: WorkerProfile) => {
    if (invitedCandidateIds.includes(worker.id)) return;
    setInvitedCandidateIds((prev) => [...prev, worker.id]);
    addToast({
      type: 'success',
      title: 'Invitation Sent',
      message: `Direct recruitment invitation sent to ${worker.fullName} for ${currentMatcherJob?.title || 'the role'}.`
    });
  };

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'py-5 px-4 space-y-5 max-w-md mx-auto'
          : 'py-6 sm:py-8 md:py-12 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8'
      }`}
    >
      {/* Top Header Card */}
      <section className={`bg-white border border-[#C4C8C5] rounded shadow-2xs ${isMobilePreview ? 'p-4 space-y-4' : 'p-5 sm:p-6 md:p-8 space-y-6'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBEBDD]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`${isMobilePreview ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display break-words`}>
                {employer.companyName}
              </h1>
              <StatusIndicator
                status={employer.cacVerified ? 'verified' : 'pending'}
                customLabel={
                  employer.cacVerified
                    ? 'CAC Verified Business'
                    : 'Awaiting CAC Registry Audit'
                }
              />
              {(employer.isVerified || employer.phoneVerified) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E7F3EF] text-[#0E5A46] border border-[#0E5A46]/20">
                  <CheckCircle2 className="w-3 h-3 text-[#0E5A46]" />
                  <span>Phone Verified</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#5A6E68] mt-1 break-words">
              Registration: <span className="font-mono text-[#0F1F1C]">{employer.registrationNumber}</span> · {employer.location.state}, {employer.location.lga}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {onNavigateOnboarding && (
              <Button
                variant="outline"
                size="md"
                className="justify-center border-[#0E5A46] text-[#0E5A46] bg-[#F2F7F4] hover:bg-[#E2EFE9]"
                leftIcon={<Building2 className="w-4 h-4 text-[#0E5A46]" />}
                onClick={onNavigateOnboarding}
              >
                Employer Onboarding
              </Button>
            )}
            {onNavigatePayments && (
              <Button
                variant="outline"
                size="md"
                className="justify-center"
                leftIcon={<CreditCard className="w-4 h-4 text-[#0E5A46]" />}
                onClick={onNavigatePayments}
              >
                Payments & Engagements
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              className="justify-center"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={onNavigatePostJob}
            >
              Post a Job Demand
            </Button>
          </div>
        </div>

        {/* Enterprise Crop/Livestock & Location Metadata Banner */}
        {(employer.primaryFocus || employer.crops || employer.farmScale) && (
          <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-bold text-[#0E5A46] flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5" />
                Focus: {employer.primaryFocus || employer.crops?.join(', ') || 'Commercial Agriculture'}
              </span>
              {employer.crops && employer.crops.length > 0 && (
                <span className="text-[#3A4B47]">
                  Crops: <strong className="text-[#0F1F1C]">{employer.crops.slice(0, 3).join(', ')}</strong>
                </span>
              )}
              {employer.farmScale && (
                <span className="text-[#3A4B47]">
                  Scale: <strong className="text-[#0F1F1C]">{employer.farmScale.split('(')[0]}</strong>
                </span>
              )}
            </div>
            {onNavigateOnboarding && (
              <button
                type="button"
                onClick={onNavigateOnboarding}
                className="text-[11px] text-[#0E5A46] font-semibold hover:underline cursor-pointer"
              >
                Update Enterprise Specs →
              </button>
            )}
          </div>
        )}

        {/* Task-First Action Bar: "WHAT NEEDS MY ATTENTION?" */}
        <div className="space-y-3">
          <h2 className="text-[10px] sm:text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
            Operational Focus: What Needs Attention Today
          </h2>

          <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'sm:grid-cols-3'} gap-3 sm:gap-4`}>
            {/* Attention item 1 */}
            <div className="p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1 overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="semibold text-[#5A6E68]">Pending Applications</span>
                <span className="w-2 h-2 rounded-full bg-[#8E5A18]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F1F1C] tabular-nums">
                {pendingApps.length}
              </p>
              <p className="text-[11px] text-[#5A6E68] break-words">Worker capability profiles awaiting review</p>
            </div>

            {/* Attention item 2 */}
            <div className="p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1 overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5A6E68]">Active Listings</span>
                <span className="w-2 h-2 rounded-full bg-[#0E5A46]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F1F1C] tabular-nums">
                {activeJobs.length}
              </p>
              <p className="text-[11px] text-[#5A6E68] break-words">Approved and published in Tourms registry</p>
            </div>

            {/* Attention item 3 */}
            <div className="p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1 overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5A6E68]">Candidate Matcher</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C98A3A]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0E5A46] tabular-nums">
                {rawRecommendations.filter((r) => r.overallScore >= 80).length} High Fits
              </p>
              <p className="text-[11px] text-[#5A6E68] break-words">Verified candidates scored for your jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CANDIDATE MATCHER ALGORITHM: RECOMMENDED CANDIDATES SECTION                */}
      {/* ========================================================================= */}
      <section className={`bg-white border border-[#C4C8C5] rounded ${isMobilePreview ? 'p-4 space-y-4' : 'p-5 sm:p-6 md:p-8 space-y-6'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#F2F7F4] text-[#0E5A46] rounded border border-[#C2DDD3]">
                <Sparkles className="w-4 h-4 text-[#C98A3A]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C]">
                  Candidate Matcher: Recommended Candidates
                </h2>
                <p className="text-xs text-[#5A6E68] mt-0.5">
                  Semantic compatibility algorithm scoring crop/livestock category, geopolitical proximity (LGA/State), and equipment certifications.
                </p>
              </div>
            </div>
          </div>

          <span className="text-[11px] bg-[#F2F7F4] text-[#0E5A46] font-semibold px-2.5 py-1 rounded border border-[#C2DDD3] shrink-0 self-start md:self-auto">
            {filteredRecommendations.length} Recommended Profile{filteredRecommendations.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Job Selector & Algorithm Parameter Controls */}
        <div className="p-3.5 sm:p-4 bg-[#F8FAF9] rounded border border-[#C2DDD3] space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#0F1F1C] block mb-1">
                Select Active Job Posting to Match Against:
              </label>
              <select
                value={selectedMatcherJobId}
                onChange={(e) => setSelectedMatcherJobId(e.target.value)}
                className="w-full bg-white border border-[#C4C8C5] rounded px-3 py-1.5 text-xs text-[#0F1F1C] font-medium focus:ring-1 focus:ring-[#0E5A46]"
              >
                {activeJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.location.lga}, {j.location.state} ({j.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-4">
              <div className="flex items-center gap-1.5 bg-white border border-[#C4C8C5] rounded px-2.5 py-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5A6E68]" />
                <span className="text-[11px] text-[#5A6E68]">Min Score:</span>
                <select
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                  className="bg-transparent text-xs font-semibold text-[#0F1F1C] focus:outline-none"
                >
                  <option value={0}>All Scores</option>
                  <option value={70}>70%+ (Viable)</option>
                  <option value={80}>80%+ (Strong)</option>
                  <option value={90}>90%+ (Exceptional)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStateOnlyFilter(!stateOnlyFilter)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${
                  stateOnlyFilter
                    ? 'bg-[#0E5A46] text-white border-[#0E5A46]'
                    : 'bg-white text-[#5A6E68] border-[#C4C8C5] hover:border-[#0E5A46]'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Same State Only</span>
              </button>
            </div>
          </div>

          {/* Active Job Parameter Badge */}
          {currentMatcherJob && (
            <div className="pt-2 border-t border-[#E2EFE9] flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#5A6E68]">
              <span>
                Target Sector: <strong className="text-[#0E5A46]">{currentMatcherJob.category}</strong>
              </span>
              <span>·</span>
              <span>
                Location: <strong className="text-[#0F1F1C]">{currentMatcherJob.location.lga} LGA, {currentMatcherJob.location.state} State</strong>
              </span>
              <span>·</span>
              <span>
                Required Skills: <strong className="text-[#0F1F1C]">{currentMatcherJob.skills.slice(0, 3).join(', ')}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Recommended Candidate Cards List */}
        {filteredRecommendations.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5A6E68] bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-2">
            <Users className="w-8 h-8 text-[#C2DDD3] mx-auto" />
            <p className="font-semibold text-[#0F1F1C]">No candidates match the selected filters.</p>
            <p>Try lowering the minimum compatibility score or disabling the Same State filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.map((rec, index) => {
              const isInvited = invitedCandidateIds.includes(rec.worker.id);
              const isTopPick = index === 0 && rec.overallScore >= 90;

              return (
                <div
                  key={rec.worker.id}
                  className={`p-4 sm:p-5 rounded border transition-all text-xs text-left space-y-3.5 ${
                    isTopPick
                      ? 'bg-gradient-to-br from-[#F2F7F4] via-white to-white border-[#0E5A46] shadow-xs'
                      : 'bg-white border-[#C4C8C5] hover:border-[#0E5A46]/60'
                  }`}
                >
                  {/* Top Candidate Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                          {rec.worker.fullName}
                        </h3>

                        {isTopPick && (
                          <span className="text-[10px] bg-[#C98A3A] text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            #1 Top Match
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#E2EFE9] text-[#0E5A46] font-bold px-2 py-0.5 rounded border border-[#C2DDD3]">
                          <ShieldCheck className="w-3 h-3 text-[#0E5A46]" />
                          TOURMS Verified
                        </span>

                        <span className="text-[10px] text-[#5A6E68] font-medium bg-[#F7F7EE] px-2 py-0.5 rounded border border-[#EBEBDD]">
                          {rec.worker.availability}
                        </span>
                      </div>

                      <p className="text-xs text-[#0E5A46] font-medium">
                        {rec.worker.headline}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-[#5A6E68]">
                        <MapPin className="w-3 h-3 text-[#5A6E68]" />
                        <span>
                          {rec.worker.location.lga} LGA, {rec.worker.location.state} State
                        </span>
                        {rec.worker.preferences.willingToRelocate && (
                          <span className="text-[#8E5A18]">· Willing to relocate</span>
                        )}
                      </div>
                    </div>

                    {/* Overall Compatibility Score Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                      <div
                        className={`px-3 py-1.5 rounded text-center border font-bold ${
                          rec.overallScore >= 90
                            ? 'bg-[#0E5A46] text-white border-[#0E5A46]'
                            : rec.overallScore >= 80
                            ? 'bg-[#164E40] text-white border-[#164E40]'
                            : 'bg-[#F2F7F4] text-[#0E5A46] border-[#C2DDD3]'
                        }`}
                      >
                        <span className="text-base sm:text-lg tabular-nums block font-mono">
                          {rec.overallScore}%
                        </span>
                        <span className="text-[9px] uppercase tracking-wider block opacity-90">
                          {rec.tier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* The 3 Core Algorithm Breakdown Pillars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    {/* 1. Crop/Livestock Category Alignment */}
                    <div className="p-2.5 bg-[#F8FAF9] rounded border border-[#C2DDD3] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0E5A46] flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#0E5A46]" />
                          1. Category Alignment
                        </span>
                        <span className="font-mono font-bold text-[#0E5A46]">
                          {rec.categoryScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-[#3A4B47] leading-tight">
                        {rec.categoryAnalysis}
                      </p>
                    </div>

                    {/* 2. Geopolitical Proximity (LGA & State) */}
                    <div className="p-2.5 bg-[#F8FAF9] rounded border border-[#C2DDD3] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0E5A46] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0E5A46]" />
                          2. Geopolitical Proximity
                        </span>
                        <span className="font-mono font-bold text-[#0E5A46]">
                          {rec.proximityScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-[#3A4B47] leading-tight">
                        {rec.proximityAnalysis}
                      </p>
                    </div>

                    {/* 3. Equipment Certifications */}
                    <div className="p-2.5 bg-[#F8FAF9] rounded border border-[#C2DDD3] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#0E5A46] flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#C98A3A]" />
                          3. Equipment Certifications
                        </span>
                        <span className="font-mono font-bold text-[#0E5A46]">
                          {rec.certificationsScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-[#3A4B47] leading-tight">
                        {rec.certificationsAnalysis}
                      </p>
                    </div>
                  </div>

                  {/* Match Summary Quote */}
                  <div className="p-2.5 bg-[#F2F7F4] rounded border border-[#C2DDD3] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C98A3A] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#0F1F1C] font-semibold leading-relaxed">
                      {rec.matchSummary}
                    </p>
                  </div>

                  {/* Equipment Certification Badges */}
                  {rec.matchedCertifications.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] text-[#5A6E68] font-semibold flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-[#5A6E68]" />
                        Equipment Credentials:
                      </span>
                      {rec.matchedCertifications.map((cert) => (
                        <span
                          key={cert.id}
                          className="inline-flex items-center gap-1 text-[10px] bg-white text-[#0E5A46] border border-[#C2DDD3] px-2 py-0.5 rounded font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#0E5A46]" />
                          <span>{cert.name}</span>
                          <span className="text-[9px] text-[#5A6E68]">({cert.issuer})</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Candidate Actions */}
                  <div className="pt-2 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingCandidate(rec)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#0E5A46] font-semibold hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Capability Profile & Credentials</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isInvited ? 'outline' : 'primary'}
                        disabled={isInvited}
                        leftIcon={isInvited ? <Check className="w-3.5 h-3.5 text-[#0E5A46]" /> : <Send className="w-3.5 h-3.5" />}
                        onClick={() => handleInviteCandidate(rec.worker)}
                        className="cursor-pointer"
                      >
                        {isInvited ? 'Invitation Sent' : 'Invite to Apply'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: RECEIVED APPLICATIONS & CAPABILITY PROFILES                    */}
      {/* ========================================================================= */}
      <section className={`bg-white border border-[#C4C8C5] rounded ${isMobilePreview ? 'p-4 space-y-4' : 'p-5 sm:p-6 md:p-8 space-y-6'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#EBEBDD]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C]">
              Received Applications & Capability Profiles
            </h2>
            <p className="text-xs text-[#5A6E68] mt-0.5">
              Review applicant capabilities, verified evidence, and shortlisted candidates.
            </p>
          </div>
          <span className="text-xs text-[#5A6E68] font-semibold tabular-nums">
            {applications.length} Total Submissions
          </span>
        </div>

        {applications.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#5A6E68]">
            No applications received yet for your active listings.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded border border-[#C4C8C5] bg-[#F7F7EE] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F1F1C]">
                      {app.applicantName}
                    </h3>
                    <p className="text-xs text-[#0E5A46] font-medium">
                      {app.applicantHeadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5A6E68]">Status:</span>
                    <span className="text-xs font-bold text-[#0F1F1C] uppercase">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#5A6E68] flex items-center gap-3">
                  <span>Role applied: <strong className="text-[#0F1F1C]">{app.jobTitle}</strong></span>
                  <span>·</span>
                  <span>Location: {app.applicantLocation}</span>
                  <span>·</span>
                  <span>Submitted {app.appliedAt}</span>
                </div>

                {/* AI Smart Farm Match & Seasonal Availability Engine */}
                {(() => {
                  const applicantWorker: WorkerProfile = {
                    ...SAMPLE_WORKER,
                    fullName: app.applicantName,
                    headline: app.applicantHeadline,
                    location: {
                      state: app.applicantLocation.split(',')[0]?.trim() || 'Kaduna',
                      lga: app.applicantLocation.split(',')[1]?.trim() || 'Ikara'
                    }
                  };
                  const matchedJob = jobs.find((j) => j.id === app.jobId || j.title === app.jobTitle) || jobs[0];
                  const matchScore = calculateCandidateFarmMatch(applicantWorker, matchedJob);

                  return (
                    <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-1.5 text-xs text-left">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                          <Sparkles className="w-3.5 h-3.5 text-[#C98A3A]" />
                          <span>AI Smart Farm Match: {matchScore.overallMatchPercent}% Compatibility</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#0E5A46] bg-white px-2 py-0.5 rounded border border-[#C2DDD3]">
                          Peak Seasonal Alignment
                        </span>
                      </div>
                      <p className="text-[11px] text-[#0F1F1C] font-semibold">
                        {matchScore.matchSummary}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#5A6E68] pt-0.5">
                        <span>Category: <strong className="text-[#0F1F1C]">{matchScore.categoryScore}%</strong></span>
                        <span>·</span>
                        <span>Location Radius: <strong className="text-[#0F1F1C]">{matchScore.locationScore}%</strong></span>
                        <span>·</span>
                        <span>Equipment & Skills: <strong className="text-[#0F1F1C]">{matchScore.skillsScore}%</strong></span>
                        <span>·</span>
                        <span>Seasonal Readiness: <strong className="text-[#0F1F1C]">{matchScore.seasonalityScore}%</strong></span>
                      </div>
                    </div>
                  );
                })()}

                <div className="p-3 bg-white rounded border border-[#EBEBDD] text-xs text-[#3A4B47] leading-relaxed">
                  <p className="font-semibold text-[#0F1F1C] mb-1">Cover Summary:</p>
                  <p>{app.coverNote}</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  {app.status !== 'shortlisted' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onUpdateAppStatus(app.id, 'shortlisted')}
                    >
                      Shortlist for Interview
                    </Button>
                  )}
                  {app.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateAppStatus(app.id, 'rejected')}
                    >
                      Decline
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ACTIVE EMPLOYMENT LISTINGS                                     */}
      {/* ========================================================================= */}
      <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
          <div>
            <h2 className="text-lg font-bold text-[#0F1F1C]">
              Your Published Job Requirements
            </h2>
            <p className="text-xs text-[#5A6E68] mt-0.5">
              Manage live vacancies, review applications count, and status.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigatePostJob}
          >
            + Post New Role
          </Button>
        </div>

        <div className="space-y-4">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded border border-[#C4C8C5] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0F1F1C]">{job.title}</h3>
                  <StatusIndicator status={job.status as any} />
                </div>
                <p className="text-xs text-[#5A6E68]">
                  {job.location.state}, {job.location.lga} · {job.employmentType} · ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                </p>
                <p className="text-xs text-[#0E5A46] font-semibold">
                  {job.totalApplicationsCount || 0} applications received
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectJob(job.id)}
                >
                  Inspect Public Post
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CANDIDATE PROFILE INSPECTOR MODAL                                         */}
      {/* ========================================================================= */}
      {inspectingCandidate && (
        <Modal
          isOpen={Boolean(inspectingCandidate)}
          onClose={() => setInspectingCandidate(null)}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-left text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EBEBDD] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F1F1C]">
                    {inspectingCandidate.worker.fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#E2EFE9] text-[#0E5A46] font-bold px-2 py-0.5 rounded border border-[#C2DDD3]">
                    <ShieldCheck className="w-3 h-3 text-[#0E5A46]" />
                    TOURMS Verified
                  </span>
                </div>
                <p className="text-xs text-[#0E5A46] font-medium">
                  {inspectingCandidate.worker.headline}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#5A6E68] mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{inspectingCandidate.worker.location.lga} LGA, {inspectingCandidate.worker.location.state} State</span>
                  <span>·</span>
                  <span>{inspectingCandidate.worker.availability}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[#0E5A46] block font-mono">
                  {inspectingCandidate.overallScore}% Match
                </span>
                <span className="text-[10px] text-[#5A6E68] block">
                  {inspectingCandidate.tier}
                </span>
              </div>
            </div>

            {/* Match Rationale Card */}
            <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E5A46] block">
                Algorithmic Matcher Rationale for: {inspectingCandidate.job.title}
              </span>
              <p className="text-xs font-semibold text-[#0F1F1C]">
                {inspectingCandidate.matchSummary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-white p-2 rounded border border-[#C2DDD3]">
                  <span className="text-[10px] text-[#5A6E68] block">Category ({inspectingCandidate.categoryScore}%)</span>
                  <span className="text-[#0E5A46] font-semibold">{inspectingCandidate.categoryAnalysis}</span>
                </div>
                <div className="bg-white p-2 rounded border border-[#C2DDD3]">
                  <span className="text-[10px] text-[#5A6E68] block">Proximity ({inspectingCandidate.proximityScore}%)</span>
                  <span className="text-[#0E5A46] font-semibold">{inspectingCandidate.proximityAnalysis}</span>
                </div>
                <div className="bg-white p-2 rounded border border-[#C2DDD3]">
                  <span className="text-[10px] text-[#5A6E68] block">Certifications ({inspectingCandidate.certificationsScore}%)</span>
                  <span className="text-[#0E5A46] font-semibold">{inspectingCandidate.certificationsAnalysis}</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <span className="font-bold text-[#0F1F1C] block">Professional Summary:</span>
              <p className="text-[#3A4B47] leading-relaxed">
                {inspectingCandidate.worker.summary}
              </p>
            </div>

            {/* Equipment Certifications */}
            <div className="space-y-2">
              <span className="font-bold text-[#0F1F1C] block">Accredited Equipment Certifications:</span>
              <div className="space-y-1.5">
                {inspectingCandidate.worker.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-2.5 bg-white rounded border border-[#C4C8C5] flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-[#0F1F1C]">{cert.name}</p>
                      <p className="text-[11px] text-[#5A6E68]">Issued by {cert.issuer} ({cert.year})</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-[#E2EFE9] text-[#0E5A46] font-semibold px-2 py-0.5 rounded border border-[#C2DDD3]">
                      <CheckCircle2 className="w-3 h-3 text-[#0E5A46]" />
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="space-y-2">
              <span className="font-bold text-[#0F1F1C] block">Commercial Agricultural Experience:</span>
              <div className="space-y-2">
                {inspectingCandidate.worker.workExperience.map((exp) => (
                  <div key={exp.id} className="p-2.5 bg-[#F8FAF9] rounded border border-[#E2EFE9] space-y-1">
                    <div className="flex justify-between font-bold text-[#0F1F1C]">
                      <span>{exp.role}</span>
                      <span className="text-[11px] text-[#5A6E68]">{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-[11px] text-[#0E5A46]">{exp.organisation} · {exp.location}</p>
                    <ul className="space-y-0.5 pt-1 text-[11px] text-[#3A4B47]">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#0E5A46]">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#EBEBDD] flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px] text-[#5A6E68]">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {inspectingCandidate.worker.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {inspectingCandidate.worker.phone}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInspectingCandidate(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => {
                    handleInviteCandidate(inspectingCandidate.worker);
                    setInspectingCandidate(null);
                  }}
                  disabled={invitedCandidateIds.includes(inspectingCandidate.worker.id)}
                >
                  {invitedCandidateIds.includes(inspectingCandidate.worker.id) ? 'Invited' : 'Invite to Apply'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
