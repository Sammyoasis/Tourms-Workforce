/**
 * TOURMS AGRO-SOLUTIONS
 * Payment & Engagement Management Module Types
 * Primary Domain: Short-Term, Task-Based, and Seasonal Agricultural Engagements
 */

export type EngagementStatus =
  | 'draft'
  | 'offered'
  | 'accepted'
  | 'funded'
  | 'in_progress'
  | 'completion_submitted'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type PaymentStatus =
  | 'not_initiated'
  | 'initiated'
  | 'processing'
  | 'confirmed'
  | 'failed'
  | 'reversed'
  | 'refunded';

export type SettlementStatus =
  | 'not_eligible'
  | 'awaiting_review'
  | 'approved_for_settlement'
  | 'processing'
  | 'settled'
  | 'on_hold'
  | 'disputed'
  | 'partially_settled';

export type DisputeCategory =
  | 'scope_incomplete'
  | 'quality_deficit'
  | 'non_attendance'
  | 'damage_to_equipment'
  | 'safety_hazard'
  | 'payment_delay'
  | 'contract_variation';

export type DisputeStatus =
  | 'opened'
  | 'evidence_requested'
  | 'under_investigation'
  | 'resolved_payout'
  | 'resolved_refund'
  | 'resolved_split'
  | 'escalated';

export type RefundStatus =
  | 'not_requested'
  | 'requested'
  | 'under_review'
  | 'approved'
  | 'processed'
  | 'declined';

export interface FeeStructure {
  employerServiceFeePercent: number; // e.g. 5%
  workerServiceFeePercent: number; // e.g. 0% or 3%
  isIllustrative: boolean;
  notes: string;
}

export interface EngagementOffer {
  id: string;
  referenceNumber: string; // e.g. "TRM-ENG-2026-088"
  jobId: string;
  jobTitle: string;
  agriculturalSector: string;
  employerId: string;
  employerName: string;
  employerLocation: {
    state: string;
    lga: string;
    farmAddress: string;
  };
  workerId: string;
  workerName: string;
  workerPhone: string;
  duration: string; // e.g. "3 Weeks (18 Field Days)"
  startDate: string;
  completionDeadline: string;
  deliverablesDescription: string;
  completionConditions: string[];

  // Financial Breakdown
  grossCompensationNaira: number; // In Naira (e.g. 180,000)
  employerFeeNaira: number; // e.g. 9,000 (5%)
  workerFeeNaira: number; // e.g. 0 (0% or subsidized)
  totalEmployerFundingNaira: number; // gross + employer fee
  expectedWorkerNetNaira: number; // gross - worker fee

  // Status Triad
  engagementStatus: EngagementStatus;
  paymentStatus: PaymentStatus;
  settlementStatus: SettlementStatus;

  // Timeline
  createdAt: string;
  acceptedAt?: string;
  fundedAt?: string;
  startedAt?: string;
  completionSubmittedAt?: string;
  completionApprovedAt?: string;
  settledAt?: string;
}

export interface WorkCompletionSubmission {
  id: string;
  engagementId: string;
  submittedAt: string;
  summaryNotes: string;
  checklistItems: {
    label: string;
    completed: boolean;
  }[];
  evidenceAttachments: {
    title: string;
    type: 'photo' | 'weighbridge_slip' | 'logsheet' | 'inspection_note';
    url?: string;
    timestamp: string;
  }[];
  workerSignedDeclaration: boolean;
  employerReviewNotes?: string;
  reviewedAt?: string;
  status: 'pending_review' | 'clarification_requested' | 'approved' | 'disputed';
}

export interface EngagementPaymentOrder {
  id: string;
  orderReference: string; // e.g. "ORD-9421-NG"
  engagementId: string;
  engagementTitle: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  amountNaira: number;
  paymentMethod: 'bank_transfer' | 'card' | 'ussd' | 'virtual_account';
  virtualAccountNumber?: string;
  virtualBankName?: string;
  providerReference?: string;
  status: PaymentStatus;
  failureReason?: string;
  initiatedAt: string;
  confirmedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionReference: string; // e.g. "TRX-2026-90412"
  engagementId: string;
  engagementReference: string;
  jobTitle: string;
  type: 'employer_funding' | 'worker_payout' | 'platform_fee' | 'refund' | 'adjustment';
  senderParty: string;
  recipientParty: string;
  grossAmountNaira: number;
  feeAmountNaira: number;
  netAmountNaira: number;
  paymentStatus: PaymentStatus;
  settlementStatus: SettlementStatus;
  providerName: 'Paystack/Monnify Adapter (Provider-Neutral)' | 'NIBSS Instant Transfer';
  providerReference: string;
  narration: string;
  timestamp: string;
  settlementAccount?: {
    bankName: string;
    accountNumber: string; // masked
    accountName: string;
  };
}

export interface EngagementDispute {
  id: string;
  disputeReference: string; // e.g. "DSP-042"
  engagementId: string;
  engagementReference: string;
  jobTitle: string;
  raisedBy: 'employer' | 'worker';
  employerName: string;
  workerName: string;
  category: DisputeCategory;
  description: string;
  disputedAmountNaira: number;
  undisputedAmountNaira: number;
  evidenceNotes: string;
  timeline: {
    event: string;
    timestamp: string;
    actor: string;
  }[];
  assignedAdminName: string;
  status: DisputeStatus;
  resolutionDecision?: string;
  resolvedAt?: string;
}

export interface RefundRequest {
  id: string;
  refundReference: string; // e.g. "RFD-810"
  engagementId: string;
  engagementReference: string;
  employerName: string;
  workerName: string;
  cancellationStage: 'before_funding' | 'funded_before_work' | 'work_in_progress' | 'disputed';
  totalPaidNaira: number;
  eligibleRefundNaira: number;
  retainedProcessingFeeNaira: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AdminPaymentMetrics {
  totalPaymentVolumeNaira: number;
  confirmedFundingNaira: number;
  pendingFundingNaira: number;
  settledTransactionsNaira: number;
  pendingSettlementNaira: number;
  disputedFundsNaira: number;
  refundedFundsNaira: number;
  platformServiceRevenueNaira: number;
  reconciliationMatchRate: number; // e.g. 99.4%
  unmatchedTransactionsCount: number;
}
