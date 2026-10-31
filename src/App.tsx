import React, { useState, useEffect } from 'react';
import {
  UserRole,
  AdminSubRole,
  JobListing,
  OpportunityListing,
  InsightArticle,
  WorkerProfile,
  EmployerProfile,
  JobApplication,
  ModerationReport,
  SystemUser
} from './types';
import {
  SAMPLE_JOBS,
  SAMPLE_OPPORTUNITIES,
  SAMPLE_INSIGHTS,
  SAMPLE_WORKER,
  SAMPLE_EMPLOYER,
  SAMPLE_APPLICATIONS,
  SAMPLE_MODERATION_REPORTS,
  SAMPLE_ADMIN_USERS
} from './data/mockData';
import { ToastProvider, useToast } from './components/ui/Toast';
import { RoleBar, CANONICAL_SCREENS } from './components/layout/RoleBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StateSpecimenDrawer } from './components/dev/StateSpecimenDrawer';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

// Public views
import { HomeView } from './components/public/HomeView';
import { JobsView } from './components/public/JobsView';
import { JobDetailView } from './components/public/JobDetailView';
import { OpportunitiesView } from './components/public/OpportunitiesView';
import { InsightsView } from './components/public/InsightsView';
import { AboutView } from './components/public/AboutView';

// Worker views
import { WorkerOnboarding } from './components/worker/WorkerOnboarding';
import { WorkerProfileView } from './components/worker/WorkerProfileView';

// Employer views
import { EmployerDashboard } from './components/employer/EmployerDashboard';
import { PostJobWizard } from './components/employer/PostJobWizard';

// Admin views
import { AdminConsoleLayout } from './components/admin/AdminConsoleLayout';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminJobsQueueView } from './components/admin/AdminJobsQueueView';
import { AdminJobDetailReview } from './components/admin/AdminJobDetailReview';
import { AdminEmployerVerificationView } from './components/admin/AdminEmployerVerificationView';
import { AdminWorkerManagementView } from './components/admin/AdminWorkerManagementView';
import { AdminOpportunitiesReviewView } from './components/admin/AdminOpportunitiesReviewView';
import { AdminContentManagementView } from './components/admin/AdminContentManagementView';
import { AdminReportsModerationView } from './components/admin/AdminReportsModerationView';
import { AdminUsersRolesView } from './components/admin/AdminUsersRolesView';

import { UserCheck, Building2, Briefcase, User, Sparkles } from 'lucide-react';

function AppContent() {
  // Navigation & State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>('super_admin');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [currentScreenId, setCurrentScreenId] = useState<string>('screen-01');

  // Interactive Specimen Drawer
  const [specimensDrawerOpen, setSpecimensDrawerOpen] = useState(false);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);

  // Core Data Store
  const [jobs, setJobs] = useState<JobListing[]>(SAMPLE_JOBS);
  const [opportunities, setOpportunities] = useState<OpportunityListing[]>(SAMPLE_OPPORTUNITIES);
  const [insights, setInsights] = useState<InsightArticle[]>(SAMPLE_INSIGHTS);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile>(SAMPLE_WORKER);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(SAMPLE_EMPLOYER);
  const [applications, setApplications] = useState<JobApplication[]>(SAMPLE_APPLICATIONS);
  const [reports, setReports] = useState<ModerationReport[]>(SAMPLE_MODERATION_REPORTS);
  const [users, setUsers] = useState<SystemUser[]>(SAMPLE_ADMIN_USERS);

  // Applied Job tracking
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(['job-001']);

  // Admin Tab selection
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [reviewingJobId, setReviewingJobId] = useState<string | null>(null);

  // Post a Job step
  const [postJobStep, setPostJobStep] = useState<number>(1);

  // Jump to canonical screen handler
  const handleJumpToScreen = (screenId: string) => {
    setCurrentScreenId(screenId);
    const screen = CANONICAL_SCREENS.find((s) => s.id === screenId);
    if (!screen) return;

    if (screen.path.includes('mobile=1')) {
      setIsMobilePreview(true);
    } else {
      setIsMobilePreview(false);
    }

    if (screenId === 'screen-01') {
      setCurrentPath('/');
      setUserRole('public');
    } else if (screenId === 'screen-02') {
      setCurrentPath('/');
      setIsMobilePreview(true);
    } else if (screenId === 'screen-03') {
      setCurrentPath('/jobs');
      setIsMobilePreview(false);
    } else if (screenId === 'screen-04') {
      setCurrentPath('/jobs');
      setIsMobilePreview(true);
    } else if (screenId === 'screen-05') {
      setCurrentPath('/jobs/job-001');
      setIsMobilePreview(false);
    } else if (screenId === 'screen-06') {
      setCurrentPath('/jobs/job-001');
      setIsMobilePreview(true);
    } else if (screenId === 'screen-07') {
      setCurrentPath('/worker/onboarding');
      setUserRole('worker');
    } else if (screenId === 'screen-08') {
      setCurrentPath('/worker/profile');
      setUserRole('worker');
      setIsMobilePreview(false);
    } else if (screenId === 'screen-09') {
      setCurrentPath('/worker/profile');
      setUserRole('worker');
      setIsMobilePreview(true);
    } else if (screenId === 'screen-10') {
      setCurrentPath('/employer');
      setUserRole('employer');
      setIsMobilePreview(false);
    } else if (screenId.startsWith('screen-11') || screenId.startsWith('screen-12') || screenId.startsWith('screen-13') || screenId.startsWith('screen-14') || screenId.startsWith('screen-15')) {
      setCurrentPath('/employer/post-job');
      setUserRole('employer');
      const stepMatch = screen.path.match(/step=(\d+)/);
      if (stepMatch) {
        setPostJobStep(parseInt(stepMatch[1], 10));
      }
    } else if (screenId.startsWith('screen-16')) {
      setCurrentPath('/admin');
      setUserRole('admin');
      setAdminTab('dashboard');
    } else if (screenId.startsWith('screen-17')) {
      setCurrentPath('/admin/jobs-queue');
      setUserRole('admin');
      setAdminTab('jobs-queue');
    } else if (screenId.startsWith('screen-18')) {
      setCurrentPath('/admin/job-review/job-008');
      setUserRole('admin');
      setAdminTab('jobs-queue');
      setReviewingJobId('job-008');
    } else if (screenId.startsWith('screen-19')) {
      setCurrentPath('/admin/employers');
      setUserRole('admin');
      setAdminTab('employers');
    } else if (screenId.startsWith('screen-20')) {
      setCurrentPath('/admin/workers');
      setUserRole('admin');
      setAdminTab('workers');
    } else if (screenId.startsWith('screen-21')) {
      setCurrentPath('/admin/opportunities-review');
      setUserRole('admin');
      setAdminTab('opportunities');
    } else if (screenId.startsWith('screen-22')) {
      setCurrentPath('/admin/content');
      setUserRole('admin');
      setAdminTab('content');
    } else if (screenId.startsWith('screen-23')) {
      setCurrentPath('/admin/reports');
      setUserRole('admin');
      setAdminTab('reports');
    } else if (screenId.startsWith('screen-24')) {
      setCurrentPath('/admin/users');
      setUserRole('admin');
      setAdminTab('users');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setIsMobilePreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplySuccess = (jobId: string) => {
    setAppliedJobIds((prev) => [...prev, jobId]);
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        organisation: job.organisation,
        applicantId: workerProfile.id,
        applicantName: workerProfile.fullName,
        applicantEmail: workerProfile.email,
        applicantHeadline: workerProfile.headline,
        applicantLocation: `${workerProfile.location.state}, ${workerProfile.location.lga}`,
        coverNote: 'Direct application submitted through Tourms verified capability profile.',
        status: 'submitted',
        appliedAt: new Date().toISOString().split('T')[0]
      };
      setApplications((prev) => [newApp, ...prev]);
    }
  };

  const handlePostJobComplete = (newJob: Partial<JobListing>) => {
    setJobs((prev) => [newJob as JobListing, ...prev]);
    setCurrentPath('/employer');
  };

  const handleUpdateJobStatus = (jobId: string, status: any, notes: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status,
              reviewNotes: notes,
              reviewedAt: new Date().toISOString().split('T')[0]
            }
          : j
      )
    );
  };

  const handleVerifyEmployer = (empId: string, status: any) => {
    setEmployerProfile((prev) =>
      prev.id === empId ? { ...prev, verificationStatus: status, cacVerified: status === 'verified' } : prev
    );
  };

  // Render view router based on currentPath
  const renderCurrentView = () => {
    // 1. Job Detail Page
    if (currentPath.startsWith('/jobs/')) {
      const jobId = currentPath.replace('/jobs/', '');
      const job = jobs.find((j) => j.id === jobId) || jobs[0];
      return (
        <JobDetailView
          job={job}
          onBack={() => handleNavigate('/jobs')}
          workerProfile={workerProfile}
          onApplySuccess={handleApplySuccess}
          hasApplied={appliedJobIds.includes(job.id)}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 2. Jobs List Page
    if (currentPath === '/jobs') {
      return (
        <JobsView
          jobs={jobs}
          onSelectJob={(id) => handleNavigate(`/jobs/${id}`)}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 3. Opportunities
    if (currentPath === '/opportunities') {
      return (
        <OpportunitiesView
          opportunities={opportunities}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 4. Insights
    if (currentPath === '/insights') {
      return (
        <InsightsView
          insights={insights}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 5. About
    if (currentPath === '/about') {
      return (
        <AboutView
          onNavigate={handleNavigate}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 6. Worker Onboarding (Screen 07)
    if (currentPath === '/worker/onboarding') {
      return (
        <WorkerOnboarding
          initialProfile={workerProfile}
          onComplete={(updated) => {
            setWorkerProfile(updated);
            setUserRole('worker');
            handleNavigate('/worker/profile');
          }}
          onCancel={() => handleNavigate('/')}
        />
      );
    }

    // 7. Worker Profile (Screens 08 & 09)
    if (currentPath === '/worker/profile') {
      return (
        <WorkerProfileView
          profile={workerProfile}
          onEditProfile={() => handleNavigate('/worker/onboarding')}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 8. Employer Dashboard (Screen 10)
    if (currentPath === '/employer') {
      return (
        <EmployerDashboard
          employer={employerProfile}
          jobs={jobs}
          applications={applications}
          onNavigatePostJob={() => handleNavigate('/employer/post-job')}
          onSelectApplication={() => {}}
          onSelectJob={(id) => handleNavigate(`/jobs/${id}`)}
          onUpdateAppStatus={(appId, newStatus) => {
            setApplications((prev) =>
              prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
            );
          }}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 9. Post a Job (Screens 11 to 15)
    if (currentPath === '/employer/post-job') {
      return (
        <PostJobWizard
          initialStep={postJobStep}
          employerName={employerProfile.companyName}
          employerId={employerProfile.id}
          onComplete={handlePostJobComplete}
          onCancel={() => handleNavigate('/employer')}
        />
      );
    }

    // 10. Admin Console (Screens 16 to 24)
    if (currentPath.startsWith('/admin')) {
      const pendingJobsCount = jobs.filter((j) => j.status === 'awaiting_review').length;
      const pendingEmployersCount = employerProfile.cacVerified ? 0 : 1;
      const openReportsCount = reports.filter((r) => r.status === 'open').length;

      // Handle specific job review screen 18
      if (reviewingJobId) {
        const jobToReview = jobs.find((j) => j.id === reviewingJobId) || jobs[jobs.length - 1];
        return (
          <AdminConsoleLayout
            currentTab={adminTab}
            onSelectTab={(tab) => {
              setReviewingJobId(null);
              setAdminTab(tab);
            }}
            adminSubRole={adminSubRole}
            pendingJobsCount={pendingJobsCount}
            pendingEmployersCount={pendingEmployersCount}
            openReportsCount={openReportsCount}
          >
            <AdminJobDetailReview
              job={jobToReview}
              onBack={() => setReviewingJobId(null)}
              onUpdateStatus={handleUpdateJobStatus}
            />
          </AdminConsoleLayout>
        );
      }

      return (
        <AdminConsoleLayout
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          adminSubRole={adminSubRole}
          pendingJobsCount={pendingJobsCount}
          pendingEmployersCount={pendingEmployersCount}
          openReportsCount={openReportsCount}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboardView
              jobs={jobs}
              employers={[employerProfile]}
              reports={reports}
              opportunities={opportunities}
              insights={insights}
              onNavigateTab={setAdminTab}
              onReviewJob={(id) => setReviewingJobId(id)}
            />
          )}

          {adminTab === 'jobs-queue' && (
            <AdminJobsQueueView
              jobs={jobs}
              onSelectJobForReview={(id) => setReviewingJobId(id)}
            />
          )}

          {adminTab === 'employers' && (
            <AdminEmployerVerificationView
              employers={[employerProfile]}
              onVerifyEmployer={handleVerifyEmployer}
            />
          )}

          {adminTab === 'workers' && (
            <AdminWorkerManagementView
              workers={[workerProfile]}
              onVerifyWorker={(wId, status) => {
                setWorkerProfile((prev) => ({ ...prev, verifiedStatus: status }));
              }}
            />
          )}

          {adminTab === 'opportunities' && (
            <AdminOpportunitiesReviewView
              opportunities={opportunities}
              onUpdateOpportunityStatus={(id, status) => {
                setOpportunities((prev) =>
                  prev.map((o) => (o.id === id ? { ...o, status } : o))
                );
              }}
            />
          )}

          {adminTab === 'content' && (
            <AdminContentManagementView
              insights={insights}
              onUpdateStatus={(id, status) => {
                setInsights((prev) =>
                  prev.map((i) => (i.id === id ? { ...i, status } : i))
                );
              }}
            />
          )}

          {adminTab === 'reports' && (
            <AdminReportsModerationView
              reports={reports}
              onResolveReport={(repId, status, notes) => {
                setReports((prev) =>
                  prev.map((r) =>
                    r.id === repId ? { ...r, status, resolutionNotes: notes } : r
                  )
                );
              }}
            />
          )}

          {adminTab === 'users' && (
            <AdminUsersRolesView
              users={users}
              onUpdateUserRole={(uId, newRole) => {
                setUsers((prev) =>
                  prev.map((u) => (u.id === uId ? { ...u, role: newRole } : u))
                );
              }}
            />
          )}
        </AdminConsoleLayout>
      );
    }

    // Default: Public Home (Screens 01 & 02)
    return (
      <HomeView
        onNavigate={handleNavigate}
        featuredJobs={jobs}
        featuredOpportunities={opportunities}
        featuredInsights={insights}
        isMobilePreview={isMobilePreview}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7EE] text-[#0F1F1C]">
      {/* Top Review & Persona Switcher */}
      <RoleBar
        currentRole={userRole}
        adminSubRole={adminSubRole}
        onRoleChange={(newRole) => {
          setUserRole(newRole);
          if (newRole === 'public') setCurrentPath('/');
          if (newRole === 'worker') setCurrentPath('/worker/profile');
          if (newRole === 'employer') setCurrentPath('/employer');
          if (newRole === 'admin') setCurrentPath('/admin');
        }}
        onAdminSubRoleChange={setAdminSubRole}
        onJumpToScreen={handleJumpToScreen}
        onOpenStateSpecimens={() => setSpecimensDrawerOpen(true)}
        currentScreenId={currentScreenId}
      />

      {/* Main Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        userRole={userRole}
        onOpenGetStarted={() => setGetStartedModalOpen(true)}
      />

      {/* Viewport */}
      <div className="flex-1 w-full">
        {renderCurrentView()}
      </div>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSpecs={() => setSpecimensDrawerOpen(true)}
      />

      {/* State Specimen Drawer (Isolated interaction testing) */}
      <StateSpecimenDrawer
        isOpen={specimensDrawerOpen}
        onClose={() => setSpecimensDrawerOpen(false)}
      />

      {/* Get Started Pathway Selection Modal */}
      <Modal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
        title="Welcome to Tourms Agro-Solutions"
        description="Select your pathway into the agricultural workforce ecosystem."
        maxWidth="md"
      >
        <div className="space-y-4 text-left pt-2">
          <div
            onClick={() => {
              setGetStartedModalOpen(false);
              setUserRole('worker');
              handleNavigate('/worker/onboarding');
            }}
            className="p-4 bg-[#F7F7EE] hover:bg-[#E7F3EF] border border-[#C4C8C5] hover:border-[#0E5A46] rounded transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] text-sm">
                I am an Agricultural Worker or Professional
              </span>
              <User className="w-4 h-4 text-[#0E5A46]" />
            </div>
            <p className="text-xs text-[#5A6E68]">
              Build your verified capability profile, document machinery competencies, and discover genuine job demand across Nigeria.
            </p>
          </div>

          <div
            onClick={() => {
              setGetStartedModalOpen(false);
              setUserRole('employer');
              handleNavigate('/employer/post-job');
            }}
            className="p-4 bg-[#F7F7EE] hover:bg-[#E7F3EF] border border-[#C4C8C5] hover:border-[#0E5A46] rounded transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] text-sm">
                I am an Agribusiness or Employer
              </span>
              <Briefcase className="w-4 h-4 text-[#0E5A46]" />
            </div>
            <p className="text-xs text-[#5A6E68]">
              Publish employment requirements through our 7-stage posting flow, verify CAC standing, and review applicant field capabilities.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
