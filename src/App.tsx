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
  SAMPLE_WORKERS,
  SAMPLE_EMPLOYER,
  SAMPLE_EMPLOYERS,
  SAMPLE_APPLICATIONS,
  SAMPLE_MODERATION_REPORTS,
  SAMPLE_ADMIN_USERS
} from './data/mockData';
import { ToastProvider, useToast } from './components/ui/Toast';
import { CANONICAL_SCREENS } from './components/layout/RoleBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StateSpecimenDrawer } from './components/dev/StateSpecimenDrawer';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { AuthModal } from './components/auth/AuthModal';
import { testConnection } from './lib/firebase';
import {
  subscribeFirestoreJobs,
  saveFirestoreJob,
  updateFirestoreJobStatus,
  subscribeFirestoreApplications,
  saveFirestoreApplication,
  updateFirestoreApplicationStatus,
  saveFirestoreWorker,
  saveFirestoreEmployer,
  subscribeFirestoreOpportunities,
  saveFirestoreOpportunity,
  deleteFirestoreOpportunity,
  subscribeFirestoreInsights,
  saveFirestoreInsight,
  deleteFirestoreInsight,
  seedInitialFirestoreData
} from './services/firestoreService';

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
import { EmployerOnboarding } from './components/employer/EmployerOnboarding';

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
import { AdminLoginView } from './components/admin/AdminLoginView';

// Payment & Engagement views (Screens 25 - 39)
import { WorkerPaymentHub } from './components/worker/WorkerPaymentHub';
import { EmployerPaymentHub } from './components/employer/EmployerPaymentHub';
import { AdminPaymentsHub } from './components/admin/AdminPaymentsHub';
import {
  EngagementOffer,
  PaymentTransaction,
  EngagementDispute,
  RefundRequest
} from './types/payment';
import {
  SAMPLE_ENGAGEMENTS,
  SAMPLE_PAYMENT_TRANSACTIONS,
  SAMPLE_DISPUTES,
  SAMPLE_REFUNDS
} from './data/samplePayments';

import { UserCheck, Building2, Briefcase, User, Sparkles, Smartphone, Monitor, Wifi, Battery, Signal, ArrowLeftRight } from 'lucide-react';

const getInitialPath = (): string => {
  try {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    const hash = window.location.hash.replace(/^#\/?/, '/');
    const search = new URLSearchParams(window.location.search);

    // 1. Direct query parameter fallback (?admin or ?portal=admin)
    if (search.has('admin') || search.get('portal') === 'admin') {
      return '/admin';
    }

    // 2. Hash routing fallback (/#/admin or /#admin)
    if (hash && hash !== '/' && hash !== '') {
      return hash.startsWith('/') ? hash : `/${hash}`;
    }

    // 3. Pathname routing (/admin, /jobs, etc.)
    if (path && path !== '') {
      return path;
    }
  } catch {}
  return '/';
};

function AppContent() {
  const { addToast } = useToast();
  // Navigation & State
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('tourms_user_role');
      if (saved && ['public', 'worker', 'employer', 'admin'].includes(saved)) {
        return saved as UserRole;
      }
    } catch {}
    return 'public';
  });
  const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>('super_admin');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [mobileDeviceWidth, setMobileDeviceWidth] = useState<'390' | '360' | 'full'>('390');
  const [currentScreenId, setCurrentScreenId] = useState<string>('screen-01');

  // Interactive Specimen Drawer & Modals
  const [specimensDrawerOpen, setSpecimensDrawerOpen] = useState(false);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'worker_reg' | 'employer_reg' | 'signin'>('worker_reg');

  // Core Data Store with safe localStorage persistence
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_jobs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_JOBS;
  });
  const [opportunities, setOpportunities] = useState<OpportunityListing[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_opportunities');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_OPPORTUNITIES;
  });
  const [insights, setInsights] = useState<InsightArticle[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_insights');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_INSIGHTS;
  });
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile>(() => {
    try {
      const saved = localStorage.getItem('tourms_worker_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_WORKER;
  });
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(() => {
    try {
      const saved = localStorage.getItem('tourms_employer_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_EMPLOYER;
  });
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_applications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_APPLICATIONS;
  });
  const [reports, setReports] = useState<ModerationReport[]>(SAMPLE_MODERATION_REPORTS);
  const [users, setUsers] = useState<SystemUser[]>(SAMPLE_ADMIN_USERS);

  // Payment & Engagement Module State (Screens 25 - 39)
  const [engagements, setEngagements] = useState<EngagementOffer[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_engagements');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_ENGAGEMENTS;
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_payment_transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_PAYMENT_TRANSACTIONS;
  });

  const [disputes, setDisputes] = useState<EngagementDispute[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_disputes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_DISPUTES;
  });

  const [refunds, setRefunds] = useState<RefundRequest[]>(() => {
    try {
      const saved = localStorage.getItem('tourms_refunds');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_REFUNDS;
  });

  const [workerPaymentScreen, setWorkerPaymentScreen] = useState<'screen-25' | 'screen-26' | 'screen-27' | 'screen-28'>('screen-25');
  const [employerPaymentScreen, setEmployerPaymentScreen] = useState<'screen-29' | 'screen-30' | 'screen-31' | 'screen-32' | 'screen-33'>('screen-31');
  const [adminPaymentScreen, setAdminPaymentScreen] = useState<'screen-34' | 'screen-35' | 'screen-36' | 'screen-37' | 'screen-38' | 'screen-39'>('screen-34');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tourms_engagements', JSON.stringify(engagements));
    } catch {}
  }, [engagements]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_payment_transactions', JSON.stringify(paymentTransactions));
    } catch {}
  }, [paymentTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_disputes', JSON.stringify(disputes));
    } catch {}
  }, [disputes]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_refunds', JSON.stringify(refunds));
    } catch {}
  }, [refunds]);

  // Cloud Firestore Initial Connection & Seeding
  useEffect(() => {
    testConnection().then(() => {
      seedInitialFirestoreData(
        SAMPLE_JOBS,
        SAMPLE_WORKERS,
        SAMPLE_EMPLOYERS,
        SAMPLE_OPPORTUNITIES,
        SAMPLE_INSIGHTS
      );
    });
  }, []);

  // Real-time synchronization for Jobs with Cloud Firestore
  useEffect(() => {
    const unsub = subscribeFirestoreJobs((remoteJobs) => {
      if (remoteJobs && remoteJobs.length > 0) {
        setJobs(remoteJobs);
      }
    });
    return () => unsub();
  }, []);

  // Real-time synchronization for Applications with Cloud Firestore
  useEffect(() => {
    const unsub = subscribeFirestoreApplications((remoteApps) => {
      if (remoteApps && remoteApps.length > 0) {
        setApplications(remoteApps);
      }
    });
    return () => unsub();
  }, []);

  // Real-time synchronization for Opportunities with Cloud Firestore
  useEffect(() => {
    const unsub = subscribeFirestoreOpportunities((remoteOpps) => {
      if (remoteOpps && remoteOpps.length > 0) {
        setOpportunities(remoteOpps);
      }
    });
    return () => unsub();
  }, []);

  // Real-time synchronization for Insights with Cloud Firestore
  useEffect(() => {
    const unsub = subscribeFirestoreInsights((remoteInsights) => {
      if (remoteInsights && remoteInsights.length > 0) {
        setInsights(remoteInsights);
      }
    });
    return () => unsub();
  }, []);

  // Sync state to localStorage as fast client-side offline cache
  useEffect(() => {
    try {
      localStorage.setItem('tourms_jobs', JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_worker_profile', JSON.stringify(workerProfile));
    } catch {}
  }, [workerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_employer_profile', JSON.stringify(employerProfile));
    } catch {}
  }, [employerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_applications', JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_opportunities', JSON.stringify(opportunities));
    } catch {}
  }, [opportunities]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_insights', JSON.stringify(insights));
    } catch {}
  }, [insights]);

  useEffect(() => {
    try {
      localStorage.setItem('tourms_user_role', userRole);
    } catch {}
  }, [userRole]);

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
    } else if (screenId === 'screen-10b') {
      setCurrentPath('/employer/onboarding');
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
    } else if (['screen-25', 'screen-26', 'screen-27', 'screen-28'].includes(screenId)) {
      setCurrentPath('/worker/payments');
      setUserRole('worker');
      setWorkerPaymentScreen(screenId as any);
    } else if (['screen-29', 'screen-30', 'screen-31', 'screen-32', 'screen-33'].includes(screenId)) {
      setCurrentPath('/employer/payments');
      setUserRole('employer');
      setEmployerPaymentScreen(screenId as any);
    } else if (['screen-34', 'screen-35', 'screen-36', 'screen-37', 'screen-38', 'screen-39'].includes(screenId)) {
      setCurrentPath('/admin/payments');
      setUserRole('admin');
      setAdminTab('payments');
      setAdminPaymentScreen(screenId as any);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Payment Operation Handlers
  const handleUpdateEngagement = (updated: EngagementOffer) => {
    setEngagements((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleAddTransaction = (newTx: PaymentTransaction) => {
    setPaymentTransactions((prev) => [newTx, ...prev]);
  };

  const handleRaiseDispute = (newDsp: EngagementDispute) => {
    setDisputes((prev) => [newDsp, ...prev]);
  };

  const handleUpdateDispute = (updatedDsp: EngagementDispute) => {
    setDisputes((prev) => prev.map((d) => (d.id === updatedDsp.id ? updatedDsp : d)));
  };

  const handleUpdateRefund = (updatedRfd: RefundRequest) => {
    setRefunds((prev) => prev.map((r) => (r.id === updatedRfd.id ? updatedRfd : r)));
  };

  const handleAuthorizeSettlement = (engId: string) => {
    setEngagements((prev) =>
      prev.map((e) =>
        e.id === engId
          ? {
              ...e,
              engagementStatus: 'completed',
              settlementStatus: 'settled',
              settledAt: new Date().toISOString().split('T')[0]
            }
          : e
      )
    );
    const targetEng = engagements.find((e) => e.id === engId);
    if (targetEng) {
      const payoutTx: PaymentTransaction = {
        id: `trx-${Date.now()}`,
        transactionReference: `TRX-${Date.now().toString().slice(-6)}`,
        engagementId: targetEng.id,
        engagementReference: targetEng.referenceNumber,
        jobTitle: targetEng.jobTitle,
        type: 'worker_payout',
        senderParty: 'TOURMS Settlement Escrow Holding (Provider-Neutral)',
        recipientParty: targetEng.workerName,
        grossAmountNaira: targetEng.grossCompensationNaira,
        feeAmountNaira: targetEng.workerFeeNaira,
        netAmountNaira: targetEng.expectedWorkerNetNaira,
        paymentStatus: 'confirmed',
        settlementStatus: 'settled',
        providerName: 'NIBSS Instant Transfer',
        providerReference: `NIP-${Date.now().toString().slice(-8)}`,
        narration: `TOURMS Settlement: ${targetEng.referenceNumber}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setPaymentTransactions((prev) => [payoutTx, ...prev]);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    } catch {}
    setIsMobilePreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL synchronization and keyboard shortcut listener
  useEffect(() => {
    const handleLocationChange = () => {
      const active = getInitialPath();
      setCurrentPath(active);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin hotkey: Alt + A or Ctrl + Shift + A
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        handleNavigate('/admin');
        addToast({
          type: 'info',
          title: 'Admin Gateway Triggered',
          message: 'Opening Staff & Admin Console authentication portal.'
        });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        applicantEmail: workerProfile.email || undefined,
        applicantPhone: workerProfile.phone,
        applicantHeadline: workerProfile.headline,
        applicantLocation: `${workerProfile.location.state}, ${workerProfile.location.lga}`,
        coverNote: 'Direct application submitted through Tourms verified capability profile.',
        status: 'submitted',
        appliedAt: new Date().toISOString().split('T')[0]
      };
      // Persist to Cloud Firestore & local state
      saveFirestoreApplication(newApp);
      setApplications((prev) => [newApp, ...prev]);
    }
  };

  const handlePostJobComplete = (newJob: Partial<JobListing>) => {
    const completedJob = newJob as JobListing;
    // Persist to Cloud Firestore & local state
    saveFirestoreJob(completedJob);
    setJobs((prev) => [completedJob, ...prev]);
    setCurrentPath('/employer');
  };

  const handleUpdateJobStatus = (jobId: string, status: any, notes: string) => {
    // Persist status change to Cloud Firestore
    updateFirestoreJobStatus(jobId, status, notes);
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
    setEmployerProfile((prev) => {
      const updated = prev.id === empId ? { ...prev, verificationStatus: status, cacVerified: status === 'verified' } : prev;
      saveFirestoreEmployer(updated);
      return updated;
    });
  };

  // Opportunity CRUD Handlers (Synchronized with Cloud Firestore)
  const handleAddOpportunity = (newOpp: OpportunityListing) => {
    saveFirestoreOpportunity(newOpp);
    setOpportunities((prev) => [newOpp, ...prev]);
  };

  const handleEditOpportunity = (updatedOpp: OpportunityListing) => {
    saveFirestoreOpportunity(updatedOpp);
    setOpportunities((prev) =>
      prev.map((o) => (o.id === updatedOpp.id ? updatedOpp : o))
    );
  };

  const handleDeleteOpportunity = (id: string) => {
    deleteFirestoreOpportunity(id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateOpportunityStatus = (id: string, status: any) => {
    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, status };
          saveFirestoreOpportunity(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // Insight Article CRUD Handlers (Synchronized with Cloud Firestore)
  const handleAddInsight = (newInsight: InsightArticle) => {
    saveFirestoreInsight(newInsight);
    setInsights((prev) => [newInsight, ...prev]);
  };

  const handleEditInsight = (updatedInsight: InsightArticle) => {
    saveFirestoreInsight(updatedInsight);
    setInsights((prev) =>
      prev.map((i) => (i.id === updatedInsight.id ? updatedInsight : i))
    );
  };

  const handleDeleteInsight = (id: string) => {
    deleteFirestoreInsight(id);
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateInsightStatus = (id: string, status: any) => {
    setInsights((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const updated = { ...i, status };
          saveFirestoreInsight(updated);
          return updated;
        }
        return i;
      })
    );
  };

  const handleOpenAuth = (tab: 'worker_reg' | 'employer_reg' | 'signin' = 'worker_reg') => {
    setAuthModalDefaultTab(tab);
    setAuthModalOpen(true);
  };

  const handleWorkerRegister = (newWorker: WorkerProfile) => {
    // Persist to Cloud Firestore
    saveFirestoreWorker(newWorker);
    setWorkerProfile(newWorker);
    setUserRole('worker');
    setCurrentPath('/worker/profile');
  };

  const handleEmployerRegister = (newEmployer: EmployerProfile) => {
    // Persist to Cloud Firestore
    saveFirestoreEmployer(newEmployer);
    setEmployerProfile(newEmployer);
    setUserRole('employer');
    setCurrentPath('/employer/onboarding');
  };

  const handleSignIn = (role: UserRole, _email: string) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentPath('/admin');
      setAdminTab('dashboard');
    } else if (role === 'employer') {
      setCurrentPath('/employer');
    } else if (role === 'worker') {
      setCurrentPath('/worker/profile');
    } else {
      setCurrentPath('/');
    }
  };

  const handleSignOut = () => {
    setUserRole('public');
    setCurrentPath('/');
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
            saveFirestoreWorker(updated);
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
          onNavigatePayments={() => handleNavigate('/worker/payments')}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 7b. Worker Payment Hub (Screens 25 to 28)
    if (currentPath === '/worker/payments') {
      return (
        <WorkerPaymentHub
          initialScreen={workerPaymentScreen}
          engagements={engagements}
          transactions={paymentTransactions}
          onUpdateEngagement={handleUpdateEngagement}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 8. Employer Onboarding Flow
    if (currentPath === '/employer/onboarding') {
      return (
        <EmployerOnboarding
          initialProfile={employerProfile}
          onComplete={(completedProfile) => {
            saveFirestoreEmployer(completedProfile);
            setEmployerProfile(completedProfile);
            setUserRole('employer');
            setCurrentPath('/employer');
          }}
          onCancel={() => handleNavigate('/employer')}
        />
      );
    }

    // 8b. Employer Dashboard (Screen 10)
    if (currentPath === '/employer') {
      return (
        <EmployerDashboard
          employer={employerProfile}
          jobs={jobs}
          applications={applications}
          workers={SAMPLE_WORKERS}
          onNavigatePostJob={() => handleNavigate('/employer/post-job')}
          onNavigatePayments={() => handleNavigate('/employer/payments')}
          onNavigateOnboarding={() => handleNavigate('/employer/onboarding')}
          onSelectApplication={() => {}}
          onSelectJob={(id) => handleNavigate(`/jobs/${id}`)}
          onUpdateAppStatus={(appId, newStatus) => {
            updateFirestoreApplicationStatus(appId, newStatus);
            setApplications((prev) =>
              prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
            );
          }}
          isMobilePreview={isMobilePreview}
        />
      );
    }

    // 8b. Employer Payment Hub (Screens 29 to 33)
    if (currentPath === '/employer/payments') {
      return (
        <EmployerPaymentHub
          initialScreen={employerPaymentScreen}
          engagements={engagements}
          transactions={paymentTransactions}
          disputes={disputes}
          onUpdateEngagement={handleUpdateEngagement}
          onAddTransaction={handleAddTransaction}
          onRaiseDispute={handleRaiseDispute}
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
      if (userRole !== 'admin') {
        return (
          <AdminLoginView
            onSignInSuccess={(role, subRole, _email) => {
              setUserRole(role);
              setAdminSubRole(subRole);
              setCurrentPath('/admin');
              setAdminTab('dashboard');
              addToast({
                type: 'success',
                title: 'Admin Session Authenticated',
                message: `Welcome to TOURMS Operations Console (${subRole.replace('_', ' ').toUpperCase()}).`
              });
            }}
            onCancel={() => handleNavigate('/')}
          />
        );
      }

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
            onSignOut={handleSignOut}
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
          onSignOut={handleSignOut}
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
              employers={SAMPLE_EMPLOYERS}
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
              onUpdateOpportunityStatus={handleUpdateOpportunityStatus}
              onAddOpportunity={handleAddOpportunity}
              onEditOpportunity={handleEditOpportunity}
              onDeleteOpportunity={handleDeleteOpportunity}
            />
          )}

          {adminTab === 'payments' && (
            <AdminPaymentsHub
              initialScreen={adminPaymentScreen}
              engagements={engagements}
              transactions={paymentTransactions}
              disputes={disputes}
              refunds={refunds}
              onUpdateDispute={handleUpdateDispute}
              onUpdateRefund={handleUpdateRefund}
              onAuthorizeSettlement={handleAuthorizeSettlement}
              isMobilePreview={isMobilePreview}
            />
          )}

          {adminTab === 'content' && (
            <AdminContentManagementView
              insights={insights}
              onUpdateStatus={handleUpdateInsightStatus}
              onAddInsight={handleAddInsight}
              onEditInsight={handleEditInsight}
              onDeleteInsight={handleDeleteInsight}
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
      {isMobilePreview ? (
        /* ====================================================================== */
        /* AUTHENTIC MOBILE DEVICE SIMULATOR (Screen 02, 04, 06, 09)             */
        /* Enforces strict phone frame bounds and realistic viewport typography    */
        /* ====================================================================== */
        <div className="flex-1 bg-[#EBEBDD]/60 py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
          {/* Top Device Control Bar */}
          <div className="w-full max-w-lg mb-3 flex items-center justify-between text-xs bg-[#0F1F1C] text-white px-3.5 py-2 rounded-lg shadow-sm border border-[#243B36]">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <Smartphone className="w-3.5 h-3.5 text-[#C98A3A] shrink-0" />
              <span className="truncate">
                Mobile Viewport Preview
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Device Width Selector */}
              <div className="flex items-center bg-[#1A312D] rounded p-0.5 border border-[#3A4B47]">
                <button
                  onClick={() => setMobileDeviceWidth('390')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    mobileDeviceWidth === '390' ? 'bg-[#0E5A46] text-white' : 'text-[#A0B0AB] hover:text-white'
                  }`}
                  title="390px (iPhone 14/15/16 standard)"
                >
                  390px
                </button>
                <button
                  onClick={() => setMobileDeviceWidth('360')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    mobileDeviceWidth === '360' ? 'bg-[#0E5A46] text-white' : 'text-[#A0B0AB] hover:text-white'
                  }`}
                  title="360px (Android compact)"
                >
                  360px
                </button>
                <button
                  onClick={() => setMobileDeviceWidth('full')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    mobileDeviceWidth === 'full' ? 'bg-[#0E5A46] text-white' : 'text-[#A0B0AB] hover:text-white'
                  }`}
                  title="Full fluid width"
                >
                  Fluid
                </button>
              </div>

              {/* Exit Mobile Simulation */}
              <button
                onClick={() => {
                  setIsMobilePreview(false);
                  if (currentScreenId === 'screen-02') handleJumpToScreen('screen-01');
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#243B36] hover:bg-[#344F49] text-[11px] font-semibold text-[#F7F7EE] transition-colors cursor-pointer"
                title="Switch back to desktop view"
              >
                <Monitor className="w-3 h-3 text-[#C98A3A]" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>
          </div>

          {/* Realistic Mobile Phone Shell Container */}
          <div
            className={`transition-all duration-200 mx-auto bg-[#F7F7EE] shadow-2xl overflow-hidden flex flex-col relative ${
              mobileDeviceWidth === '390'
                ? 'w-full max-w-[390px] rounded-[44px] border-[10px] border-[#0F1F1C] ring-1 ring-black/20'
                : mobileDeviceWidth === '360'
                ? 'w-full max-w-[360px] rounded-[36px] border-[9px] border-[#0F1F1C] ring-1 ring-black/20'
                : 'w-full max-w-md rounded-2xl border-2 border-[#C4C8C5]'
            }`}
            style={{ maxHeight: '88vh' }}
          >
            {/* Phone Top Notch / Dynamic Island & Status Bar (for framed widths) */}
            {mobileDeviceWidth !== 'full' && (
              <div className="bg-[#F7F7EE] pt-2 pb-1 px-5 border-b border-[#EBEBDD] select-none shrink-0">
                {/* Dynamic Island Pill */}
                <div className="w-24 h-4 bg-[#0F1F1C] rounded-full mx-auto mb-1 flex items-center justify-end pr-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#1A312D]" />
                </div>

                {/* Mobile System Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#0F1F1C] tracking-tight">
                  <span>09:41</span>
                  <div className="flex items-center gap-1.5 text-[#0F1F1C]">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5 text-[#0E5A46]" />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Header Inside Phone Viewport */}
            <Header
              currentPath={currentPath}
              onNavigate={handleNavigate}
              userRole={userRole}
              onOpenGetStarted={() => setGetStartedModalOpen(true)}
              onOpenAuth={handleOpenAuth}
              onSignOut={handleSignOut}
              isMobilePreview={true}
            />

            {/* Scrollable Mobile Body Viewport */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-[#F7F7EE] select-text">
              {renderCurrentView()}
              {/* Mobile Footer inside phone scroll area */}
              <Footer
                onNavigate={handleNavigate}
                onOpenSpecs={() => setSpecimensDrawerOpen(true)}
                userRole={userRole}
                isMobilePreview={true}
              />
            </div>

            {/* Phone Bottom Home Indicator */}
            {mobileDeviceWidth !== 'full' && (
              <div className="bg-[#F7F7EE] py-2 shrink-0 border-t border-[#EBEBDD]/60 select-none">
                <div className="w-32 h-1 bg-[#0F1F1C]/40 rounded-full mx-auto" />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ====================================================================== */
        /* STANDARD DESKTOP VIEWPORT LAYOUT                                       */
        /* ====================================================================== */
        <>
          <Header
            currentPath={currentPath}
            onNavigate={handleNavigate}
            userRole={userRole}
            onOpenGetStarted={() => setGetStartedModalOpen(true)}
            onOpenAuth={handleOpenAuth}
            onSignOut={handleSignOut}
            isMobilePreview={false}
          />

          <div className="flex-1 w-full">
            {renderCurrentView()}
          </div>

          <Footer
            onNavigate={handleNavigate}
            onOpenSpecs={() => setSpecimensDrawerOpen(true)}
            userRole={userRole}
            isMobilePreview={false}
          />
        </>
      )}

      {/* State Specimen Drawer (Isolated interaction testing) */}
      <StateSpecimenDrawer
        isOpen={specimensDrawerOpen}
        onClose={() => setSpecimensDrawerOpen(false)}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalDefaultTab}
        onWorkerRegister={handleWorkerRegister}
        onEmployerRegister={handleEmployerRegister}
        onSignIn={handleSignIn}
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
              handleOpenAuth('worker_reg');
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
              Register your verified capability profile, document machinery competencies, and discover genuine job demand across Nigeria.
            </p>
          </div>

          <div
            onClick={() => {
              setGetStartedModalOpen(false);
              handleOpenAuth('employer_reg');
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
              Register your enterprise with CAC details, publish jobs through our 7-stage posting flow, and review applicant capabilities.
            </p>
          </div>

          <div className="pt-2 border-t border-[#C4C8C5] text-center">
            <button
              onClick={() => {
                setGetStartedModalOpen(false);
                handleOpenAuth('signin');
              }}
              className="text-xs text-[#0E5A46] hover:underline font-semibold cursor-pointer"
            >
              Already registered on Tourms? Sign In here
            </button>
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
