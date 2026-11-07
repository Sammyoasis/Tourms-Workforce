/**
 * TOURMS AGRO-SOLUTIONS
 * Mock Data for Payment & Engagement Management
 * All financial data represents sample demonstration figures.
 */

import {
  EngagementOffer,
  WorkCompletionSubmission,
  PaymentTransaction,
  EngagementDispute,
  RefundRequest,
  AdminPaymentMetrics
} from '../types/payment';

export const SAMPLE_ENGAGEMENTS: EngagementOffer[] = [
  {
    id: 'eng-001',
    referenceNumber: 'TRM-ENG-2026-088',
    jobId: 'job-001',
    jobTitle: 'Commercial Boom Sprayer Specialist (50ha Maize)',
    agriculturalSector: 'Crop Production & Machinery',
    employerId: 'emp-001',
    employerName: 'AgroAllied Integrated Farms Ltd',
    employerLocation: {
      state: 'Kaduna',
      lga: 'Ikara',
      farmAddress: 'Kilometre 14, Zaria-Gidan Gona Expressway, Ikara LGA'
    },
    workerId: 'worker-001',
    workerName: 'Musa Abdullahi',
    workerPhone: '+234 803 456 7890',
    duration: '3 Weeks (18 Field Days)',
    startDate: '2026-11-05',
    completionDeadline: '2026-11-26',
    deliverablesDescription:
      'Calibrated boom spray application of pre-emergence and post-emergence crop protection across 50 hectares of commercial hybrid maize. Full maintenance log and daily chemical dilution records required.',
    completionConditions: [
      '50 hectares sprayed with verified GPS swath guidance',
      'Daily dilution and chemical usage log signed by field agronomist',
      'End-of-operation nozzle and pump decontamination inspection'
    ],
    grossCompensationNaira: 180000,
    employerFeeNaira: 9000, // 5% illustrative
    workerFeeNaira: 0, // 0% subsidized
    totalEmployerFundingNaira: 189000,
    expectedWorkerNetNaira: 180000,
    engagementStatus: 'offered',
    paymentStatus: 'not_initiated',
    settlementStatus: 'not_eligible',
    createdAt: '2026-11-01'
  },
  {
    id: 'eng-002',
    referenceNumber: 'TRM-ENG-2026-092',
    jobId: 'job-003',
    jobTitle: 'Senior Drip Irrigation Maintenance Lead',
    agriculturalSector: 'Farm Operations & Water Tech',
    employerId: 'emp-002',
    employerName: 'MiddleBelt Greenhouses & Horticulture Co.',
    employerLocation: {
      state: 'Plateau',
      lga: 'Jos South',
      farmAddress: 'Plot 4, Bukuru Farmland Cluster'
    },
    workerId: 'worker-001',
    workerName: 'Musa Abdullahi',
    workerPhone: '+234 803 456 7890',
    duration: '2 Weeks (12 Field Days)',
    startDate: '2026-10-14',
    completionDeadline: '2026-10-28',
    deliverablesDescription:
      'Flushing and pressure calibration of 4 greenhouse drip manifolds, filter screen replacement, and fertigation injector overhaul.',
    completionConditions: [
      'Pressure testing showing uniform 1.2 bar emitter delivery across all 4 houses',
      'Filter disc backwash and clean log verified by farm manager'
    ],
    grossCompensationNaira: 140000,
    employerFeeNaira: 7000,
    workerFeeNaira: 0,
    totalEmployerFundingNaira: 147000,
    expectedWorkerNetNaira: 140000,
    engagementStatus: 'completion_submitted',
    paymentStatus: 'confirmed',
    settlementStatus: 'awaiting_review',
    createdAt: '2026-10-10',
    acceptedAt: '2026-10-11',
    fundedAt: '2026-10-12',
    startedAt: '2026-10-14',
    completionSubmittedAt: '2026-10-28'
  },
  {
    id: 'eng-003',
    referenceNumber: 'TRM-ENG-2026-077',
    jobId: 'job-002',
    jobTitle: 'Cassava Harvester & Mechanical Lifter Operator',
    agriculturalSector: 'Harvesting & Farm Mechanisation',
    employerId: 'emp-001',
    employerName: 'AgroAllied Integrated Farms Ltd',
    employerLocation: {
      state: 'Ogun',
      lga: 'Obafemi Owode',
      farmAddress: 'Abeokuta-Sagamu Road, Siun'
    },
    workerId: 'worker-002',
    workerName: 'Oluwaseun Adeyemi',
    workerPhone: '+234 802 123 4567',
    duration: '4 Weeks',
    startDate: '2026-09-01',
    completionDeadline: '2026-09-28',
    deliverablesDescription:
      'Mechanical harvesting and primary field de-topping of 35 hectares of TME-419 cassava with root damage rate below 4%.',
    completionConditions: [
      '35 hectares harvested and transferred to collection tractors',
      'Weighbridge receipts acknowledged by processing plant'
    ],
    grossCompensationNaira: 220000,
    employerFeeNaira: 11000,
    workerFeeNaira: 0,
    totalEmployerFundingNaira: 231000,
    expectedWorkerNetNaira: 220000,
    engagementStatus: 'completed',
    paymentStatus: 'confirmed',
    settlementStatus: 'settled',
    createdAt: '2026-08-25',
    acceptedAt: '2026-08-26',
    fundedAt: '2026-08-28',
    startedAt: '2026-09-01',
    completionSubmittedAt: '2026-09-27',
    completionApprovedAt: '2026-09-28',
    settledAt: '2026-09-29'
  },
  {
    id: 'eng-004',
    referenceNumber: 'TRM-ENG-2026-081',
    jobId: 'job-005',
    jobTitle: 'Broiler Flock Vaccination & Biosecurity Lead',
    agriculturalSector: 'Livestock & Veterinary Health',
    employerId: 'emp-003',
    employerName: 'Savannah Agro-Ventures',
    employerLocation: {
      state: 'Oyo',
      lga: 'Akinyele',
      farmAddress: 'Moniya Farm Settlement'
    },
    workerId: 'worker-003',
    workerName: 'Babatunde Fashola',
    workerPhone: '+234 805 789 0123',
    duration: '10 Days',
    startDate: '2026-10-05',
    completionDeadline: '2026-10-15',
    deliverablesDescription:
      'Gumboro and Newcastle drinking-water vaccination across 12,000 birds, including cold chain verification and post-vaccination serology logs.',
    completionConditions: [
      'Zero vaccine cold-chain break verified by digital loggers',
      'Post-vaccination mortality log below 0.3%'
    ],
    grossCompensationNaira: 95000,
    employerFeeNaira: 4750,
    workerFeeNaira: 0,
    totalEmployerFundingNaira: 99750,
    expectedWorkerNetNaira: 95000,
    engagementStatus: 'disputed',
    paymentStatus: 'confirmed',
    settlementStatus: 'on_hold',
    createdAt: '2026-10-01',
    acceptedAt: '2026-10-02',
    fundedAt: '2026-10-03',
    startedAt: '2026-10-05',
    completionSubmittedAt: '2026-10-15'
  }
];

export const SAMPLE_COMPLETION_SUBMISSION: WorkCompletionSubmission = {
  id: 'sub-002',
  engagementId: 'eng-002',
  submittedAt: '2026-10-28 16:45',
  summaryNotes:
    'Completed all 4 greenhouse irrigation manifolds overhaul in Jos South. Filter screens backwashed, emitter flow rates verified with pressure gauge at 1.25 bar. Test runs showed uniform water distribution without clogging.',
  checklistItems: [
    { label: 'Greenhouses 1-4 drip manifolds flushed and descaled', completed: true },
    { label: 'Disc filters backwashed and pressure tested at 1.25 bar', completed: true },
    { label: 'Fertigation venturi injector re-calibrated for liquid NPK', completed: true },
    { label: 'Farm manager verbal walk-through conducted', completed: true }
  ],
  evidenceAttachments: [
    {
      title: 'Pressure Gauge Verification Log (1.25 bar)',
      type: 'photo',
      timestamp: '2026-10-28 14:10'
    },
    {
      title: 'Filter Backwash Inspection Sheet (Signed by Farm Supervisor)',
      type: 'inspection_note',
      timestamp: '2026-10-28 15:30'
    }
  ],
  workerSignedDeclaration: true,
  status: 'pending_review'
};

export const SAMPLE_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'trx-101',
    transactionReference: 'TRX-2026-09412',
    engagementId: 'eng-003',
    engagementReference: 'TRM-ENG-2026-077',
    jobTitle: 'Cassava Harvester & Mechanical Lifter Operator',
    type: 'worker_payout',
    senderParty: 'TOURMS Settlement Escrow Holding (Provider-Neutral)',
    recipientParty: 'Oluwaseun Adeyemi',
    grossAmountNaira: 220000,
    feeAmountNaira: 0,
    netAmountNaira: 220000,
    paymentStatus: 'confirmed',
    settlementStatus: 'settled',
    providerName: 'NIBSS Instant Transfer',
    providerReference: 'NIP-20260929-8812903',
    narration: 'TOURMS Agro Settl: TRM-ENG-2026-077 Cassava Harvesting',
    timestamp: '2026-09-29 11:15',
    settlementAccount: {
      bankName: 'First Bank of Nigeria',
      accountNumber: '309****412',
      accountName: 'Oluwaseun Adeyemi'
    }
  },
  {
    id: 'trx-102',
    transactionReference: 'TRX-2026-09388',
    engagementId: 'eng-003',
    engagementReference: 'TRM-ENG-2026-077',
    jobTitle: 'Cassava Harvester & Mechanical Lifter Operator',
    type: 'employer_funding',
    senderParty: 'AgroAllied Integrated Farms Ltd',
    recipientParty: 'TOURMS Dedicated Virtual Account (Prov-Neutral)',
    grossAmountNaira: 231000,
    feeAmountNaira: 11000,
    netAmountNaira: 220000,
    paymentStatus: 'confirmed',
    settlementStatus: 'approved_for_settlement',
    providerName: 'Paystack/Monnify Adapter (Provider-Neutral)',
    providerReference: 'PSTK-CHG-98421034',
    narration: 'AgroAllied Funding: TRM-ENG-2026-077 Cassava Work',
    timestamp: '2026-08-28 09:30'
  },
  {
    id: 'trx-103',
    transactionReference: 'TRX-2026-09855',
    engagementId: 'eng-002',
    engagementReference: 'TRM-ENG-2026-092',
    jobTitle: 'Senior Drip Irrigation Maintenance Lead',
    type: 'employer_funding',
    senderParty: 'MiddleBelt Greenhouses & Horticulture Co.',
    recipientParty: 'TOURMS Dedicated Virtual Account (Prov-Neutral)',
    grossAmountNaira: 147000,
    feeAmountNaira: 7000,
    netAmountNaira: 140000,
    paymentStatus: 'confirmed',
    settlementStatus: 'awaiting_review',
    providerName: 'Paystack/Monnify Adapter (Provider-Neutral)',
    providerReference: 'MNFY-VACC-4491208',
    narration: 'MiddleBelt Funding: TRM-ENG-2026-092 Drip Overhaul',
    timestamp: '2026-10-12 14:05'
  },
  {
    id: 'trx-104',
    transactionReference: 'TRX-2026-09910',
    engagementId: 'eng-004',
    engagementReference: 'TRM-ENG-2026-081',
    jobTitle: 'Broiler Flock Vaccination & Biosecurity Lead',
    type: 'employer_funding',
    senderParty: 'Savannah Agro-Ventures',
    recipientParty: 'TOURMS Dedicated Virtual Account (Prov-Neutral)',
    grossAmountNaira: 99750,
    feeAmountNaira: 4750,
    netAmountNaira: 95000,
    paymentStatus: 'confirmed',
    settlementStatus: 'on_hold',
    providerName: 'Paystack/Monnify Adapter (Provider-Neutral)',
    providerReference: 'PSTK-CHG-1029482',
    narration: 'Savannah Funding: TRM-ENG-2026-081 Vaccination',
    timestamp: '2026-10-03 16:20'
  }
];

export const SAMPLE_DISPUTES: EngagementDispute[] = [
  {
    id: 'dsp-001',
    disputeReference: 'DSP-2026-042',
    engagementId: 'eng-004',
    engagementReference: 'TRM-ENG-2026-081',
    jobTitle: 'Broiler Flock Vaccination & Biosecurity Lead',
    raisedBy: 'employer',
    employerName: 'Savannah Agro-Ventures',
    workerName: 'Babatunde Fashola',
    category: 'scope_incomplete',
    description:
      'Employer reports that Pen 3 (3,000 broilers) was skipped during the second water-vaccine round due to miscommunication on water starvation timing. Worker contends employer did not isolate water lines on schedule.',
    disputedAmountNaira: 95000,
    undisputedAmountNaira: 0,
    evidenceNotes:
      'Employer submitted daily water log showing Pen 3 not treated. Worker submitted screenshot of WhatsApp message requesting pen isolation at 6:00 AM which went unanswered until 11:00 AM.',
    timeline: [
      { event: 'Vaccination completed & submitted', timestamp: '2026-10-15 17:00', actor: 'Worker' },
      { event: 'Dispute raised by Farm Manager', timestamp: '2026-10-16 09:30', actor: 'Employer' },
      { event: 'Funds placed on conditional hold', timestamp: '2026-10-16 09:35', actor: 'System' },
      { event: 'Assigned to Support & Mediation Lead', timestamp: '2026-10-16 11:00', actor: 'Admin' }
    ],
    assignedAdminName: 'Chioma Okeke (Verification & Support Lead)',
    status: 'under_investigation'
  }
];

export const SAMPLE_REFUNDS: RefundRequest[] = [
  {
    id: 'rfd-001',
    refundReference: 'RFD-2026-810',
    engagementId: 'eng-005',
    engagementReference: 'TRM-ENG-2026-065',
    employerName: 'Kano Commercial Grain Silos Ltd',
    workerName: 'Ibrahim Danladi',
    cancellationStage: 'funded_before_work',
    totalPaidNaira: 126000,
    eligibleRefundNaira: 120000,
    retainedProcessingFeeNaira: 6000,
    reason:
      'Pre-season heavy rainfall washed out field access culvert; tractor access impossible for 3 weeks. Engagement mutually cancelled before commencement.',
    status: 'approved',
    requestedAt: '2026-10-18',
    reviewedBy: 'Tunde Bakare (Operations Desk)',
    reviewedAt: '2026-10-19'
  }
];

export const SAMPLE_ADMIN_PAYMENT_METRICS: AdminPaymentMetrics = {
  totalPaymentVolumeNaira: 18450000,
  confirmedFundingNaira: 14200000,
  pendingFundingNaira: 1890000,
  settledTransactionsNaira: 11850000,
  pendingSettlementNaira: 2350000,
  disputedFundsNaira: 420000,
  refundedFundsNaira: 580000,
  platformServiceRevenueNaira: 912500,
  reconciliationMatchRate: 99.4,
  unmatchedTransactionsCount: 2
};
