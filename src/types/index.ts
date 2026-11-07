/**
 * TOURMS AGRO-SOLUTIONS Type Definitions
 * Architecture: Jobs (Workforce), Opportunities, Insights, Worker, Employer, Administration
 */

export type UserRole = 'public' | 'worker' | 'employer' | 'admin';

export type AdminSubRole =
  | 'super_admin'
  | 'operations'
  | 'verification'
  | 'editorial'
  | 'support'
  | 'analyst';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type EvidenceLevel = 'self_reported' | 'verified_document' | 'institutional_credential';

export type JobCategory =
  | 'Farm Operations'
  | 'Crop Production'
  | 'Livestock'
  | 'Fisheries & Aquaculture'
  | 'Processing'
  | 'Agribusiness'
  | 'Logistics'
  | 'Technology & Data'
  | 'Research & Development'
  | 'Administration & Support';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Seasonal'
  | 'Contract'
  | 'Apprenticeship';

export interface Compensation {
  type: 'fixed' | 'range' | 'negotiable';
  amountMin?: number;
  amountMax?: number;
  currency: 'NGN';
  frequency: 'month' | 'day' | 'week' | 'season' | 'project';
  notes?: string;
}

export interface JobLocation {
  state: string;
  lga: string;
  farmSiteOrAddress?: string;
}

export type JobStatus =
  | 'draft'
  | 'awaiting_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'closed'
  | 'expired';

export interface JobListing {
  id: string;
  title: string;
  organisation: string;
  employerId: string;
  employerVerified: boolean;
  location: JobLocation;
  employmentType: EmploymentType;
  duration?: string;
  category: JobCategory;
  compensation: Compensation;
  summary: string;
  responsibilities: string[];
  essentialRequirements: string[];
  desirableQualifications: string[];
  skills: string[];
  applicationInstructions: string;
  deadline: string;
  postedDate: string;
  status: JobStatus;
  priority?: 'normal' | 'urgent';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  totalApplicationsCount?: number;
}

export type OpportunityCategory =
  | 'Scholarship'
  | 'Grant'
  | 'Loan'
  | 'Fellowship'
  | 'Competition'
  | 'Training Programme'
  | 'Internship'
  | 'Research Opportunity'
  | 'Event'
  | 'Funding Call'
  | 'Professional Development'
  | 'Institutional Programme';

export type OpportunityStatus = 'submitted' | 'verified' | 'published' | 'expired';

export interface OpportunityListing {
  id: string;
  title: string;
  provider: string;
  providerVerified: boolean;
  category: OpportunityCategory;
  description: string;
  eligibility: string[];
  benefits: string[];
  locationScope: string; // e.g. "Nigeria-wide", "South-West States", "Pan-African"
  deadline: string;
  sourceUrl: string;
  status: OpportunityStatus;
  verificationSource?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export type InsightCategory =
  | 'Article'
  | 'Research Brief'
  | 'Explainer'
  | 'Field Notes'
  | 'Industry Analysis'
  | 'Guide'
  | 'Career Intelligence'
  | 'Technology & Data';

export type InsightStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export interface InsightArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: {
    name: string;
    role: string;
    affiliation: string;
  };
  category: InsightCategory;
  readingTimeMinutes: number;
  publishedDate: string;
  status: InsightStatus;
  citations?: string[];
  tags?: string[];
}

export interface WorkerCapability {
  id: string;
  title: string;
  description: string;
  evidenceLevel: EvidenceLevel;
  evidenceDocumentName?: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  headline: string;
  email?: string;
  phone: string;
  isVerified?: boolean;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  verificationMethod?: 'sms_otp' | 'whatsapp_otp' | 'email_link' | 'agent_verified';
  location: {
    state: string;
    lga: string;
  };
  summary: string;
  capabilities: WorkerCapability[];
  skills: string[];
  workExperience: {
    id: string;
    role: string;
    organisation: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    responsibilities: string[];
  }[];
  education: {
    id: string;
    institution: string;
    qualification: string;
    field: string;
    yearCompleted: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    year: string;
    evidenceLevel: EvidenceLevel;
  }[];
  availability: 'Immediately Available' | '2 Weeks Notice' | '1 Month Notice' | 'Seasonal Only';
  preferences: {
    employmentTypes: EmploymentType[];
    preferredStates: string[];
    willingToRelocate: boolean;
  };
  completionPercentage: number;
  verifiedStatus: VerificationStatus;
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  businessType: string;
  registrationNumber: string; // CAC
  cacVerified: boolean;
  isVerified?: boolean;
  location: {
    state: string;
    lga: string;
    farmSiteAddress: string;
  };
  contactPerson: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verificationStatus: VerificationStatus;
  verificationDocuments: {
    id: string;
    title: string;
    documentType: string;
    submittedAt: string;
    status: VerificationStatus;
    notes?: string;
  }[];
  primaryFocus?: string;
  crops?: string[];
  livestock?: string[];
  farmScale?: string;
  workforceSize?: string;
  mechanizationLevel?: string;
  establishedYear?: string;
  landTenure?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  organisation: string;
  applicantId: string;
  applicantName: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantHeadline: string;
  applicantLocation: string;
  coverNote: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'job' | 'employer' | 'worker' | 'opportunity' | 'insight';
  targetId: string;
  targetTitle: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'P1' | 'P2' | 'P3';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'operations' | 'verification' | 'editorial' | 'support' | 'analyst';
  status: 'active' | 'suspended' | 'invited';
  lastActive: string;
  permissions: string[];
}
