import React, { useState } from 'react';
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
  CheckCircle2,
  Bell,
  AlertCircle,
  ShieldAlert,
  CheckCheck,
  X,
  Filter,
  Check
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

interface AdminNotificationItem {
  id: string;
  type: 'critical_moderation' | 'cac_verification' | 'urgent_job' | 'opportunity_review';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  timestamp: string;
  actionLabel: string;
  onAction: () => void;
  metadataBadge: string;
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
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'cac' | 'moderation'>('all');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  const pendingJobs = jobs.filter((j) => j.status === 'awaiting_review');
  const pendingEmployers = employers.filter((e) => e.verificationStatus === 'pending' || !e.cacVerified);
  const openReports = reports.filter((r) => r.status === 'open' || r.status === 'investigating');
  const pendingOpps = opportunities.filter((o) => o.status === 'submitted');
  const pendingInsights = insights.filter((i) => i.status === 'draft' || i.status === 'in_review');

  // Build live notification alerts from state
  const rawNotifications: AdminNotificationItem[] = [];

  // 1. High/Critical Moderation Incidents
  openReports.forEach((rep) => {
    const isCritical = rep.priority === 'P1' || rep.severity === 'critical';
    rawNotifications.push({
      id: `alert-rep-${rep.id}`,
      type: 'critical_moderation',
      severity: isCritical ? 'critical' : 'high',
      title: `Moderation Alert: ${rep.reason}`,
      description: `Target: "${rep.targetTitle}" (${rep.targetType}). Reported by ${rep.reportedBy}. Requires immediate moderation.`,
      timestamp: rep.reportedAt || 'Just now',
      actionLabel: 'Resolve Incident',
      onAction: () => onNavigateTab('reports'),
      metadataBadge: isCritical ? 'CRITICAL INCIDENT [P1]' : `HIGH PRIORITY [${rep.priority}]`
    });
  });

  // 2. Pending CAC Agribusiness Verifications
  pendingEmployers.forEach((emp) => {
    rawNotifications.push({
      id: `alert-emp-${emp.id}`,
      type: 'cac_verification',
      severity: 'high',
      title: `CAC Audit Pending: ${emp.companyName}`,
      description: `Registration: ${emp.registrationNumber} (${emp.businessType}) in ${emp.location.state}. Documents awaiting corporate validation.`,
      timestamp: 'Today',
      actionLabel: 'Verify CAC Audit',
      onAction: () => onNavigateTab('employers'),
      metadataBadge: 'CAC VERIFICATION'
    });
  });

  // 3. Urgent Jobs awaiting review
  pendingJobs.forEach((job) => {
    rawNotifications.push({
      id: `alert-job-${job.id}`,
      type: 'urgent_job',
      severity: 'medium',
      title: `Job Posting Review: ${job.title}`,
      description: `Submitted by ${job.organisation} (${job.location.state}). Remuneration ₦${job.compensation.amountMin?.toLocaleString()} / ${job.compensation.frequency}.`,
      timestamp: job.postedDate || 'Recent',
      actionLabel: 'Inspect & Approve',
      onAction: () => onReviewJob(job.id),
      metadataBadge: 'WAGE & SAFETY AUDIT'
    });
  });

  // 4. Opportunities awaiting review
  pendingOpps.forEach((opp) => {
    rawNotifications.push({
      id: `alert-opp-${opp.id}`,
      type: 'opportunity_review',
      severity: 'medium',
      title: `Opportunity Validation: ${opp.title}`,
      description: `Provider: ${opp.provider} (${opp.category}). Sourcing and eligibility check required before publication.`,
      timestamp: 'Pending',
      actionLabel: 'Review Opportunity',
      onAction: () => onNavigateTab('opportunities'),
      metadataBadge: 'FUNDING SOURCE CHECK'
    });
  });

  // Filter out dismissed alerts
  const activeNotifications = rawNotifications.filter((n) => !dismissedAlertIds.includes(n.id));

  // Apply category filter
  const filteredNotifications = activeNotifications.filter((n) => {
    if (filterType === 'critical') return n.severity === 'critical' || n.severity === 'high';
    if (filterType === 'cac') return n.type === 'cac_verification';
    if (filterType === 'moderation') return n.type === 'critical_moderation';
    return true;
  });

  const criticalCount = activeNotifications.filter((n) => n.severity === 'critical' || n.severity === 'high').length;
  const cacCount = activeNotifications.filter((n) => n.type === 'cac_verification').length;
  const modCount = activeNotifications.filter((n) => n.type === 'critical_moderation').length;

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  const handleDismissAll = () => {
    setDismissedAlertIds(rawNotifications.map((n) => n.id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl overflow-x-hidden min-w-0 break-words">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-[#C98A3A] tracking-wider uppercase mb-1">
            <span>TOURMS ADMINISTRATIVE CONSOLE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F1F1C] font-display break-words">
            Operational Priority Queues
          </h1>
          <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
            Core question: What needs Tourms&apos; attention right now?
          </p>
        </div>

        <div className="text-xs text-[#5A6E68] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E5A46] inline-block shrink-0 animate-pulse" />
          <span>Real-Time Operations Active</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* NEW: CRITICAL ADMIN NOTIFICATIONS & SYSTEM ALERTS PANEL             */}
      {/* ==================================================================== */}
      <section className="bg-white rounded border border-[#C4C8C5] shadow-sm overflow-hidden text-left">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 bg-[#0F1F1C] text-[#F7F7EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#C98A3A]/20 text-[#C98A3A] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-display tracking-tight text-white">
                  Admin System Notifications & Critical Alerts
                </h2>
                {activeNotifications.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C53030] text-white">
                    {activeNotifications.length} Action Needed
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A0B0AB] mt-0.5">
                Real-time operational triage: CAC employer verifications, safety incidents, and priority review alerts.
              </p>
            </div>
          </div>

          {activeNotifications.length > 0 && (
            <button
              onClick={handleDismissAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1F332F] hover:bg-[#2C4540] text-xs font-semibold text-[#A0B0AB] hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              title="Acknowledge and clear current alerts"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Acknowledge All</span>
            </button>
          )}
        </div>

        {/* Filter Strip */}
        <div className="bg-[#F7F7EE] px-4 py-2.5 border-b border-[#C4C8C5] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-[#5A6E68] uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#0E5A46] text-white'
                : 'bg-white text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            All Alerts ({activeNotifications.length})
          </button>

          <button
            onClick={() => setFilterType('critical')}
            className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'critical'
                ? 'bg-[#C53030] text-white'
                : 'bg-white text-[#C53030] hover:bg-[#FFF5F5] border border-[#C4C8C5]'
            }`}
          >
            Critical & High ({criticalCount})
          </button>

          <button
            onClick={() => setFilterType('cac')}
            className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'cac'
                ? 'bg-[#0E5A46] text-white'
                : 'bg-white text-[#0E5A46] hover:bg-[#E7F3EF] border border-[#C4C8C5]'
            }`}
          >
            CAC Verifications ({cacCount})
          </button>

          <button
            onClick={() => setFilterType('moderation')}
            className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'moderation'
                ? 'bg-[#8E5A18] text-white'
                : 'bg-white text-[#8E5A18] hover:bg-[#FEF4E8] border border-[#C4C8C5]'
            }`}
          >
            Moderation ({modCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-[#EBEBDD]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#E7F3EF] text-[#0E5A46] flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0F1F1C]">
                All critical operational alerts acknowledged
              </p>
              <p className="text-xs text-[#5A6E68] max-w-md mx-auto">
                No outstanding urgent moderation incidents or pending corporate CAC audits require immediate attention.
              </p>
            </div>
          ) : (
            filteredNotifications.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  alert.severity === 'critical'
                    ? 'bg-[#FFF5F5] border-l-4 border-l-[#C53030]'
                    : alert.severity === 'high'
                    ? 'bg-[#FEF4E8] border-l-4 border-l-[#C98A3A]'
                    : 'bg-white hover:bg-[#F7F7EE] border-l-4 border-l-[#0E5A46]'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'critical'
                          ? 'bg-[#C53030] text-white'
                          : alert.severity === 'high'
                          ? 'bg-[#C98A3A] text-white'
                          : 'bg-[#E7F3EF] text-[#0E5A46]'
                      }`}
                    >
                      {alert.metadataBadge}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0F1F1C] truncate">
                      {alert.title}
                    </h3>
                    <span className="text-[10px] text-[#7A8B86]">· {alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-[#3A4B47] leading-relaxed break-words">
                    {alert.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant={alert.severity === 'critical' ? 'destructive' : 'primary'}
                    onClick={alert.onAction}
                  >
                    {alert.actionLabel}
                  </Button>

                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="p-1.5 rounded text-[#5A6E68] hover:text-[#0F1F1C] hover:bg-black/5 transition-colors cursor-pointer"
                    title="Acknowledge alert"
                    aria-label="Acknowledge alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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
