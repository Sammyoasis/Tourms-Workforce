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
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
 * Fetch all jobs from Cloud Firestore
 */
export async function getFirestoreJobs(): Promise<JobListing[]> {
  try {
    const snap = await getDocs(collection(db, JOBS_COLLECTION));
    return snap.docs.map((d) => d.data() as JobListing);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, JOBS_COLLECTION);
    return [];
  }
}

/**
 * Real-time listener for jobs
 */
export function subscribeFirestoreJobs(onUpdate: (jobs: JobListing[]) => void): () => void {
  const q = collection(db, JOBS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = snapshot.docs.map((d) => d.data() as JobListing);
      onUpdate(jobs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, JOBS_COLLECTION);
    }
  );
}

/**
 * Create or update a job in Cloud Firestore
 */
export async function saveFirestoreJob(job: JobListing): Promise<void> {
  const path = `${JOBS_COLLECTION}/${job.id}`;
  try {
    await setDoc(doc(db, JOBS_COLLECTION, job.id), job);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update job review status
 */
export async function updateFirestoreJobStatus(jobId: string, status: JobListing['status'], notes?: string): Promise<void> {
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
 * Fetch a worker profile by ID
 */
export async function getFirestoreWorker(workerId: string): Promise<WorkerProfile | null> {
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
 * Save or update a worker profile in Firestore
 */
export async function saveFirestoreWorker(worker: WorkerProfile): Promise<void> {
  const path = `${WORKERS_COLLECTION}/${worker.id}`;
  try {
    await setDoc(doc(db, WORKERS_COLLECTION, worker.id), worker);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all workers (for Admin management and candidate matching)
 */
export async function getFirestoreAllWorkers(): Promise<WorkerProfile[]> {
  try {
    const snap = await getDocs(collection(db, WORKERS_COLLECTION));
    return snap.docs.map((d) => d.data() as WorkerProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, WORKERS_COLLECTION);
    return [];
  }
}

/**
 * Fetch an employer profile by ID
 */
export async function getFirestoreEmployer(employerId: string): Promise<EmployerProfile | null> {
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
 * Save or update an employer profile in Firestore
 */
export async function saveFirestoreEmployer(employer: EmployerProfile): Promise<void> {
  const path = `${EMPLOYERS_COLLECTION}/${employer.id}`;
  try {
    await setDoc(doc(db, EMPLOYERS_COLLECTION, employer.id), employer);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch all employers (for Admin CAC verification queue)
 */
export async function getFirestoreAllEmployers(): Promise<EmployerProfile[]> {
  try {
    const snap = await getDocs(collection(db, EMPLOYERS_COLLECTION));
    return snap.docs.map((d) => d.data() as EmployerProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, EMPLOYERS_COLLECTION);
    return [];
  }
}

/**
 * Fetch all applications
 */
export async function getFirestoreApplications(): Promise<JobApplication[]> {
  try {
    const snap = await getDocs(collection(db, APPLICATIONS_COLLECTION));
    return snap.docs.map((d) => d.data() as JobApplication);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, APPLICATIONS_COLLECTION);
    return [];
  }
}

/**
 * Real-time listener for job applications
 */
export function subscribeFirestoreApplications(onUpdate: (apps: JobApplication[]) => void): () => void {
  const q = collection(db, APPLICATIONS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const apps = snapshot.docs.map((d) => d.data() as JobApplication);
      onUpdate(apps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, APPLICATIONS_COLLECTION);
    }
  );
}

/**
 * Save a job application to Firestore
 */
export async function saveFirestoreApplication(application: JobApplication): Promise<void> {
  const path = `${APPLICATIONS_COLLECTION}/${application.id}`;
  try {
    await setDoc(doc(db, APPLICATIONS_COLLECTION, application.id), application);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Update application status (e.g., shortlisted, accepted, rejected)
 */
export async function updateFirestoreApplicationStatus(appId: string, status: JobApplication['status']): Promise<void> {
  const path = `${APPLICATIONS_COLLECTION}/${appId}`;
  try {
    await updateDoc(doc(db, APPLICATIONS_COLLECTION, appId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Fetch all opportunities from Cloud Firestore
 */
export async function getFirestoreOpportunities(): Promise<OpportunityListing[]> {
  try {
    const snap = await getDocs(collection(db, OPPORTUNITIES_COLLECTION));
    return snap.docs.map((d) => d.data() as OpportunityListing);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, OPPORTUNITIES_COLLECTION);
    return [];
  }
}

/**
 * Real-time listener for opportunities
 */
export function subscribeFirestoreOpportunities(onUpdate: (opps: OpportunityListing[]) => void): () => void {
  const q = collection(db, OPPORTUNITIES_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const opps = snapshot.docs.map((d) => d.data() as OpportunityListing);
      onUpdate(opps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, OPPORTUNITIES_COLLECTION);
    }
  );
}

/**
 * Create or update an opportunity in Cloud Firestore
 */
export async function saveFirestoreOpportunity(opportunity: OpportunityListing): Promise<void> {
  const path = `${OPPORTUNITIES_COLLECTION}/${opportunity.id}`;
  try {
    await setDoc(doc(db, OPPORTUNITIES_COLLECTION, opportunity.id), opportunity);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an opportunity from Cloud Firestore
 */
export async function deleteFirestoreOpportunity(id: string): Promise<void> {
  const path = `${OPPORTUNITIES_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, OPPORTUNITIES_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetch all insights/articles from Cloud Firestore
 */
export async function getFirestoreInsights(): Promise<InsightArticle[]> {
  try {
    const snap = await getDocs(collection(db, INSIGHTS_COLLECTION));
    return snap.docs.map((d) => d.data() as InsightArticle);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, INSIGHTS_COLLECTION);
    return [];
  }
}

/**
 * Real-time listener for insights/articles
 */
export function subscribeFirestoreInsights(onUpdate: (articles: InsightArticle[]) => void): () => void {
  const q = collection(db, INSIGHTS_COLLECTION);
  return onSnapshot(
    q,
    (snapshot) => {
      const articles = snapshot.docs.map((d) => d.data() as InsightArticle);
      onUpdate(articles);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, INSIGHTS_COLLECTION);
    }
  );
}

/**
 * Create or update an insight article in Cloud Firestore
 */
export async function saveFirestoreInsight(article: InsightArticle): Promise<void> {
  const path = `${INSIGHTS_COLLECTION}/${article.id}`;
  try {
    await setDoc(doc(db, INSIGHTS_COLLECTION, article.id), article);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete an insight article from Cloud Firestore
 */
export async function deleteFirestoreInsight(id: string): Promise<void> {
  const path = `${INSIGHTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, INSIGHTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Seed initial mock data to Cloud Firestore if collections are empty.
 * This guarantees the database is pre-populated for testing without overwriting user data.
 */
export async function seedInitialFirestoreData(
  initialJobs: JobListing[],
  initialWorkers: WorkerProfile[],
  initialEmployers: EmployerProfile[],
  initialOpportunities?: OpportunityListing[],
  initialInsights?: InsightArticle[]
): Promise<void> {
  try {
    const jobsSnap = await getDocs(collection(db, JOBS_COLLECTION));
    if (jobsSnap.empty && initialJobs.length > 0) {
      console.log('Seeding initial jobs into Cloud Firestore...');
      for (const j of initialJobs) {
        await setDoc(doc(db, JOBS_COLLECTION, j.id), j);
      }
    }

    const workersSnap = await getDocs(collection(db, WORKERS_COLLECTION));
    if (workersSnap.empty && initialWorkers.length > 0) {
      console.log('Seeding initial workers into Cloud Firestore...');
      for (const w of initialWorkers) {
        await setDoc(doc(db, WORKERS_COLLECTION, w.id), w);
      }
    }

    const employersSnap = await getDocs(collection(db, EMPLOYERS_COLLECTION));
    if (employersSnap.empty && initialEmployers.length > 0) {
      console.log('Seeding initial employers into Cloud Firestore...');
      for (const e of initialEmployers) {
        await setDoc(doc(db, EMPLOYERS_COLLECTION, e.id), e);
      }
    }

    if (initialOpportunities && initialOpportunities.length > 0) {
      const oppsSnap = await getDocs(collection(db, OPPORTUNITIES_COLLECTION));
      if (oppsSnap.empty) {
        console.log('Seeding initial opportunities into Cloud Firestore...');
        for (const opp of initialOpportunities) {
          await setDoc(doc(db, OPPORTUNITIES_COLLECTION, opp.id), opp);
        }
      }
    }

    if (initialInsights && initialInsights.length > 0) {
      const insightsSnap = await getDocs(collection(db, INSIGHTS_COLLECTION));
      if (insightsSnap.empty) {
        console.log('Seeding initial insights into Cloud Firestore...');
        for (const art of initialInsights) {
          await setDoc(doc(db, INSIGHTS_COLLECTION, art.id), art);
        }
      }
    }
  } catch (err) {
    console.warn('Initial seeding notice (non-fatal):', err);
  }
}
