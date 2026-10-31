import React from 'react';
import { JobListing, JobApplication, EmployerProfile } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
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
  ArrowRight
} from 'lucide-react';

export interface EmployerDashboardProps {
  employer: EmployerProfile;
  jobs: JobListing[];
  applications: JobApplication[];
  onNavigatePostJob: () => void;
  onSelectApplication: (appId: string) => void;
  onSelectJob: (jobId: string) => void;
  onUpdateAppStatus: (appId: string, status: any) => void;
  isMobilePreview?: boolean;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({
  employer,
  jobs,
  applications,
  onNavigatePostJob,
  onSelectApplication,
  onSelectJob,
  onUpdateAppStatus,
  isMobilePreview = false
}) => {
  const activeJobs = jobs.filter((j) => j.employerId === employer.id);
  const pendingApps = applications.filter((a) => a.status === 'under_review' || a.status === 'submitted');

  return (
    <div
      className={`w-full text-left py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Top Header Card */}
      <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EBEBDD]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#0F1F1C] font-display">
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
            </div>
            <p className="text-xs text-[#5A6E68] mt-1">
              Registration: <span className="font-mono text-[#0F1F1C]">{employer.registrationNumber}</span> · {employer.location.state}, {employer.location.lga}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={onNavigatePostJob}
            >
              Post a Job Demand
            </Button>
          </div>
        </div>

        {/* Task-First Action Bar: "WHAT NEEDS MY ATTENTION?" */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
            Operational Focus: What Needs Attention Today
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Attention item 1 */}
            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5A6E68]">Pending Applications</span>
                <span className="w-2 h-2 rounded-full bg-[#8E5A18]" />
              </div>
              <p className="text-2xl font-bold text-[#0F1F1C] tabular-nums">
                {pendingApps.length}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Worker capability profiles awaiting review</p>
            </div>

            {/* Attention item 2 */}
            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5A6E68]">Active Listings</span>
                <span className="w-2 h-2 rounded-full bg-[#0E5A46]" />
              </div>
              <p className="text-2xl font-bold text-[#0F1F1C] tabular-nums">
                {activeJobs.length}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Approved and published in Tourms registry</p>
            </div>

            {/* Attention item 3 */}
            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#5A6E68]">CAC Audit Status</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
              </div>
              <p className="text-sm font-bold text-[#0E5A46] mt-1">
                Verified & Compliant
              </p>
              <p className="text-[11px] text-[#5A6E68]">C of O and Incorporation active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Candidate Applications Queue */}
      <section className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
          <div>
            <h2 className="text-lg font-bold text-[#0F1F1C]">
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

      {/* Section 2: Active Employment Listings */}
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
    </div>
  );
};
