import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, isFirebaseConfigured } from '../lib/firebase';
import {
  JobListing,
  WorkerProfile,
  EmployerProfile,
  JobApplication,
  OpportunityListing,
  InsightArticle
} from '../types';

const JOBS_COLLECTION = 'jobs';
const WORKERS_COLLECTION = 'workers';
const EMPLOYERS_COLLECTION = 'employers';
const APPLICATIONS_COLLECTION = 'applications';
const OPPORTUNITIES_COLLECTION = 'opportunities';
const INSIGHTS_COLLECTION = 'insights';

/**
 * Fetch all jobs from Cloud Firestore (Public read)
 */
export async function getFirestoreJobs(): Promise<JobListing[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await getDocs(collection(db, JOBS_COLLECTION));
    return snap.docs.map((d) => d.data() as JobListing);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, JOBS_COLLECTION);
    return [];
  }
}

/**
 * Real-time listener for public jobs
 */
export function subscribeFirestoreJobs(onUpdate: (jobs: JobListing[]) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  const q = collection(db, JOBS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = snapshot.docs.map((d) => d.data() as JobListing);
      onUpdate(jobs);
    },
    (error) => {
      console.warn('Jobs subscription notice:', error.message);
    }
  );
}

/**
 * Create or update a job in Cloud Firestore
 */
export async function saveFirestoreJob(job: JobListing): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${JOBS_COLLECTION}/${job.id}`;
  try {
    await setDoc(doc(db, JOBS_COLLECTION, job.id), job);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update job review status (Admin or Employer)
 */
export async function updateFirestoreJobStatus(
  jobId: string,
  status: JobListing['status'],
  notes?: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${JOBS_COLLECTION}/${jobId}`;
  try {
    const updatePayload: Record<string, any> = { status };
    if (notes) updatePayload.reviewNotes = notes;
    await updateDoc(doc(db, JOBS_COLLECTION, jobId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Fetch a worker profile by ID (Public capability view)
 */
export async function getFirestoreWorker(workerId: string): Promise<WorkerProfile | null> {
  if (!isFirebaseConfigured()) return null;
  const path = `${WORKERS_COLLECTION}/${workerId}`;
  try {
    const snap = await getDoc(doc(db, WORKERS_COLLECTION, workerId));
    if (snap.exists()) {
      return snap.data() as WorkerProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save or update a worker profile in Firestore (Owner or Admin)
 */
export async function saveFirestoreWorker(worker: WorkerProfile): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${WORKERS_COLLECTION}/${worker.id}`;
  try {
    await setDoc(doc(db, WORKERS_COLLECTION, worker.id), worker);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all workers (Admin management queue only)
 */
export async function getFirestoreAllWorkers(): Promise<WorkerProfile[]> {
  if (!isFirebaseConfigured() || !auth.currentUser) return [];
  try {
    const snap = await getDocs(collection(db, WORKERS_COLLECTION));
    return snap.docs.map((d) => d.data() as WorkerProfile);
  } catch (error) {
    console.warn('Admin workers list query notice:', error);
    return [];
  }
}

/**
 * Fetch an employer profile by ID
 */
export async function getFirestoreEmployer(employerId: string): Promise<EmployerProfile | null> {
  if (!isFirebaseConfigured()) return null;
  const path = `${EMPLOYERS_COLLECTION}/${employerId}`;
  try {
    const snap = await getDoc(doc(db, EMPLOYERS_COLLECTION, employerId));
    if (snap.exists()) {
      return snap.data() as EmployerProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save or update an employer profile in Firestore (Owner or Admin)
 */
export async function saveFirestoreEmployer(employer: EmployerProfile): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${EMPLOYERS_COLLECTION}/${employer.id}`;
  try {
    await setDoc(doc(db, EMPLOYERS_COLLECTION, employer.id), employer);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all employers (Admin CAC verification queue only)
 */
export async function getFirestoreAllEmployers(): Promise<EmployerProfile[]> {
  if (!isFirebaseConfigured() || !auth.currentUser) return [];
  try {
    const snap = await getDocs(collection(db, EMPLOYERS_COLLECTION));
    return snap.docs.map((d) => d.data() as EmployerProfile);
  } catch (error) {
    console.warn('Admin employers list query notice:', error);
    return [];
  }
}

/**
 * Fetch applications for a specific applicant (Owner scoped query)
 */
export async function getFirestoreWorkerApplications(applicantId: string): Promise<JobApplication[]> {
  if (!isFirebaseConfigured() || !applicantId) return [];
  try {
    const q = query(collection(db, APPLICATIONS_COLLECTION), where('applicantId', '==', applicantId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as JobApplication);
  } catch (error) {
    console.warn('Worker applications query notice:', error);
    return [];
  }
}

/**
export async function getFirestoreApplications(
  filter?: { applicantId?: string; employerId?: string }
): Promise<JobApplication[]> {
  if (!isFirebaseConfigured() || !auth.currentUser) return [];
  try {
    let q;
    if (filter?.applicantId) {
      q = query(collection(db, APPLICATIONS_COLLECTION), where('applicantId', '==', filter.applicantId));
    } else if (filter?.employerId) {
      q = query(collection(db, APPLICATIONS_COLLECTION), where('employerId', '==', filter.employerId));
    } else {
      q = collection(db, APPLICATIONS_COLLECTION);
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as JobApplication);
  } catch (error) {
    console.warn('Applications list query notice (unauthenticated or unprivileged):', error);
    return [];
  }
}

/**
 * Real-time listener for job applications
 * Guards against unauthenticated calls and supports employer/applicant scoped queries.
 */
export function subscribeFirestoreApplications(
  onUpdate: (apps: JobApplication[]) => void,
  filter?: { applicantId?: string; employerId?: string } | string
): () => void {
  if (!isFirebaseConfigured() || !auth.currentUser) {
    return () => {};
  }

  let q;
  if (typeof filter === 'string') {
    q = query(collection(db, APPLICATIONS_COLLECTION), where('applicantId', '==', filter));
  } else if (filter?.applicantId) {
    q = query(collection(db, APPLICATIONS_COLLECTION), where('applicantId', '==', filter.applicantId));
  } else if (filter?.employerId) {
    q = query(collection(db, APPLICATIONS_COLLECTION), where('employerId', '==', filter.employerId));
  } else {
    q = collection(db, APPLICATIONS_COLLECTION);
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const apps = snapshot.docs.map((d) => d.data() as JobApplication);
      onUpdate(apps);
    },
    (error) => {
      console.warn('Applications subscription notice:', error.message);
    }
  );
}

/**
 * Save a job application to Firestore (Applicant owner)
 */
export async function saveFirestoreApplication(application: JobApplication): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${APPLICATIONS_COLLECTION}/${application.id}`;
  try {
    await setDoc(doc(db, APPLICATIONS_COLLECTION, application.id), application);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update application status (Employer or Admin)
 */
export async function updateFirestoreApplicationStatus(
  appId: string,
  status: JobApplication['status']
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${APPLICATIONS_COLLECTION}/${appId}`;
  try {
    await updateDoc(doc(db, APPLICATIONS_COLLECTION, appId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Fetch all opportunities from Cloud Firestore (Public read)
 */
export async function getFirestoreOpportunities(): Promise<OpportunityListing[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await getDocs(collection(db, OPPORTUNITIES_COLLECTION));
    return snap.docs.map((d) => d.data() as OpportunityListing);
  } catch (error) {
    console.warn('Opportunities list query notice:', error);
    return [];
  }
}

/**
 * Real-time listener for public opportunities
 */
export function subscribeFirestoreOpportunities(onUpdate: (opps: OpportunityListing[]) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  const q = collection(db, OPPORTUNITIES_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const opps = snapshot.docs.map((d) => d.data() as OpportunityListing);
      onUpdate(opps);
    },
    (error) => {
      console.warn('Opportunities subscription notice:', error.message);
    }
  );
}

/**
 * Create or update an opportunity in Cloud Firestore (Admin only)
 */
export async function saveFirestoreOpportunity(opportunity: OpportunityListing): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${OPPORTUNITIES_COLLECTION}/${opportunity.id}`;
  try {
    await setDoc(doc(db, OPPORTUNITIES_COLLECTION, opportunity.id), opportunity);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an opportunity from Cloud Firestore (Admin only)
 */
export async function deleteFirestoreOpportunity(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${OPPORTUNITIES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, OPPORTUNITIES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetch all insights/articles from Cloud Firestore (Public read)
 */
export async function getFirestoreInsights(): Promise<InsightArticle[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await getDocs(collection(db, INSIGHTS_COLLECTION));
    return snap.docs.map((d) => d.data() as InsightArticle);
  } catch (error) {
    console.warn('Insights list query notice:', error);
    return [];
  }
}

/**
 * Real-time listener for public insights/articles
 */
export function subscribeFirestoreInsights(onUpdate: (articles: InsightArticle[]) => void): () => void {
  if (!isFirebaseConfigured()) return () => {};
  const q = collection(db, INSIGHTS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const articles = snapshot.docs.map((d) => d.data() as InsightArticle);
      onUpdate(articles);
    },
    (error) => {
      console.warn('Insights subscription notice:', error.message);
    }
  );
}

/**
 * Create or update an insight article in Cloud Firestore (Admin only)
 */
export async function saveFirestoreInsight(article: InsightArticle): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${INSIGHTS_COLLECTION}/${article.id}`;
  try {
    await setDoc(doc(db, INSIGHTS_COLLECTION, article.id), article);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an insight article from Cloud Firestore (Admin only)
 */
export async function deleteFirestoreInsight(id: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const path = `${INSIGHTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, INSIGHTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Controlled initial Firestore data seeding.
 * Only attempts writes when authenticated with administrative authority.
 */
export async function seedInitialFirestoreData(
  initialJobs: JobListing[],
  initialWorkers: WorkerProfile[],
  initialEmployers: EmployerProfile[],
  initialOpportunities?: OpportunityListing[],
  initialInsights?: InsightArticle[]
): Promise<void> {
  if (!isFirebaseConfigured() || !auth.currentUser) {
    // Unauthenticated visitors do not attempt database mutations
    return;
  }

  try {
    const jobsSnap = await getDocs(collection(db, JOBS_COLLECTION));
    if (jobsSnap.empty && initialJobs.length > 0) {
      for (const j of initialJobs) {
        await setDoc(doc(db, JOBS_COLLECTION, j.id), j);
      }
    }
  } catch {
    // Non-fatal notice during boot
  }
}
