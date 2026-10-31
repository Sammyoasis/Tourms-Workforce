import React from 'react';
import {
  JobListing,
  EmployerProfile,
  ModerationReport,
  OpportunityListing,
  InsightArticle
} from '../../types';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import {
  Clock,
  Building2,
  AlertTriangle,
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface AdminDashboardViewProps {
  jobs: JobListing[];
  employers: EmployerProfile[];
  reports: ModerationReport[];
  opportunities: OpportunityListing[];
  insights: InsightArticle[];
  onNavigateTab: (tab: string) => void;
  onReviewJob: (jobId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  jobs,
  employers,
  reports,
  opportunities,
  insights,
  onNavigateTab,
  onReviewJob
}) => {
  const pendingJobs = jobs.filter((j) => j.status === 'awaiting_review');
  const pendingEmployers = employers.filter((e) => e.verificationStatus === 'pending' || !e.cacVerified);
  const openReports = reports.filter((r) => r.status === 'open' || r.status === 'investigating');
  const pendingOpps = opportunities.filter((o) => o.status === 'submitted');
  const pendingInsights = insights.filter((i) => i.status === 'draft' || i.status === 'in_review');

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C98A3A] tracking-wider uppercase mb-1">
            <span>TOURMS ADMINISTRATIVE CONSOLE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F1F1C] font-display">
            Operational Priority Queues
          </h1>
          <p className="text-xs text-[#5A6E68] mt-0.5">
            Core question: What needs Tourms&apos; attention right now?
          </p>
        </div>

        <div className="text-xs text-[#5A6E68] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E5A46] inline-block" />
          <span>Operations Engine Active</span>
        </div>
      </div>

      {/* Priority Action Metrics (Task-First, not fake marketing analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('jobs-queue')}
          className="p-5 bg-white rounded border border-[#C4C8C5] hover:border-[#0E5A46] transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#5A6E68]">
            <span className="font-bold">Jobs Awaiting Review</span>
            <Clock className="w-4 h-4 text-[#8E5A18]" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F1F1C] tabular-nums">
            {pendingJobs.length}
          </p>
          <p className="text-[11px] text-[#5A6E68] flex items-center justify-between pt-1">
            <span>Employment demands pending verification</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0E5A46] group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('employers')}
          className="p-5 bg-white rounded border border-[#C4C8C5] hover:border-[#0E5A46] transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#5A6E68]">
            <span className="font-bold">Employer CAC Verifications</span>
            <Building2 className="w-4 h-4 text-[#0E5A46]" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F1F1C] tabular-nums">
            {pendingEmployers.length}
          </p>
          <p className="text-[11px] text-[#5A6E68] flex items-center justify-between pt-1">
            <span>Corporate incorporation audits</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0E5A46] group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-5 bg-white rounded border border-[#C4C8C5] hover:border-[#C53030] transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#5A6E68]">
            <span className="font-bold">Open Reports & Moderation</span>
            <AlertTriangle className="w-4 h-4 text-[#C53030]" />
          </div>
          <p className="text-3xl font-extrabold text-[#C53030] tabular-nums">
            {openReports.length}
          </p>
          <p className="text-[11px] text-[#5A6E68] flex items-center justify-between pt-1">
            <span>Integrity alerts requiring resolution</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C53030] group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('opportunities')}
          className="p-5 bg-white rounded border border-[#C4C8C5] hover:border-[#C98A3A] transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs text-[#5A6E68]">
            <span className="font-bold">Opportunity Submissions</span>
            <Award className="w-4 h-4 text-[#C98A3A]" />
          </div>
          <p className="text-3xl font-extrabold text-[#0F1F1C] tabular-nums">
            {pendingOpps.length}
          </p>
          <p className="text-[11px] text-[#5A6E68] flex items-center justify-between pt-1">
            <span>Grants & funding source checks</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C98A3A] group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* Primary Queue 1: Urgent Jobs Awaiting Approval */}
      <section className="bg-white rounded border border-[#C4C8C5] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
          <div>
            <h2 className="text-base font-bold text-[#0F1F1C]">
              Employment Postings Requiring Review
            </h2>
            <p className="text-xs text-[#5A6E68]">
              Verify wage compliance, work safety descriptions, and employer authorization.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('jobs-queue')}
          >
            Open Full Queue
          </Button>
        </div>

        {pendingJobs.length === 0 ? (
          <p className="text-xs text-[#5A6E68] py-4">No jobs currently pending review.</p>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F1F1C] text-sm">{job.title}</span>
                    <span className="px-2 py-0.5 bg-[#C98A3A]/20 text-[#8E5A18] font-bold rounded">
                      Needs Review
                    </span>
                  </div>
                  <p className="text-[#5A6E68]">
                    {job.organisation} · {job.location.state}, {job.location.lga} · Submitted {job.postedDate}
                  </p>
                  <p className="text-[#08382B] font-semibold tabular-nums">
                    Offered Remuneration: ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onReviewJob(job.id)}
                  >
                    Inspect & Decide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Primary Queue 2: Urgent Moderation Reports */}
      <section className="bg-white rounded border border-[#C4C8C5] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
          <div>
            <h2 className="text-base font-bold text-[#0F1F1C]">
              Platform Integrity & Moderation Incidents
            </h2>
            <p className="text-xs text-[#5A6E68]">
              Flagged listings, policy violations, and scam prevention alerts.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('reports')}
          >
            Manage Reports
          </Button>
        </div>

        <div className="space-y-3">
          {openReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 bg-white rounded border border-[#C53030]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#C53030] font-bold uppercase">
                    [{rep.priority}] {rep.severity}
                  </span>
                  <span className="font-bold text-[#0F1F1C]">{rep.targetTitle}</span>
                  <span className="text-[#5A6E68]">({rep.targetType})</span>
                </div>
                <p className="text-[#3A4B47]">{rep.reason}</p>
                <p className="text-[11px] text-[#5A6E68]">
                  Reported by {rep.reportedBy} at {rep.reportedAt} · Assigned: {rep.assignedTo || 'Unassigned'}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab('reports')}
              >
                Resolve Incident
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
