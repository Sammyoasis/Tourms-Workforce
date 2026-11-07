import React, { useState } from 'react';
import {
  EngagementOffer,
  WorkCompletionSubmission,
  PaymentTransaction
} from '../../types/payment';
import { FeeBreakdownCard } from '../payment/FeeBreakdownCard';
import { ReceiptModal } from '../payment/ReceiptModal';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { TourmsSymbol } from '../ui/TourmsLogo';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Upload,
  Eye,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  Receipt
} from 'lucide-react';

export interface WorkerPaymentHubProps {
  initialScreen?: 'screen-25' | 'screen-26' | 'screen-27' | 'screen-28';
  engagements: EngagementOffer[];
  transactions: PaymentTransaction[];
  onUpdateEngagement?: (eng: EngagementOffer) => void;
  onSubmitCompletion?: (sub: WorkCompletionSubmission) => void;
  isMobilePreview?: boolean;
}

export const WorkerPaymentHub: React.FC<WorkerPaymentHubProps> = ({
  initialScreen = 'screen-25',
  engagements,
  transactions,
  onUpdateEngagement,
  onSubmitCompletion,
  isMobilePreview = false
}) => {
  // Active Screen Tab in Worker Payment Hub
  const [activeScreen, setActiveScreen] = useState<'screen-25' | 'screen-26' | 'screen-27' | 'screen-28'>(
    initialScreen
  );

  // Selected Engagement for Detail views
  const [selectedOfferId, setSelectedOfferId] = useState<string>(engagements[0]?.id || 'eng-001');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Completion Form State (Screen 27)
  const [completionNotes, setCompletionNotes] = useState(
    'All assigned maize hectares sprayed according to agronomist dilution ratios. Equipment washed down.'
  );
  const [checklist, setChecklist] = useState<{ label: string; completed: boolean }[]>([
    { label: '50 hectares sprayed with verified GPS swath guidance', completed: true },
    { label: 'Daily chemical dilution and spray log signed by field agronomist', completed: true },
    { label: 'End-of-operation nozzle and pump decontamination inspection', completed: false }
  ]);
  const [hasUploadedEvidence, setHasUploadedEvidence] = useState(true);
  const [signedDeclaration, setSignedDeclaration] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const currentOffer = engagements.find((e) => e.id === selectedOfferId) || engagements[0];
  const workerTransactions = transactions.filter((t) => t.recipientParty.includes(currentOffer?.workerName || ''));

  // Calculate earnings summaries
  const totalSettledEarnings = transactions
    .filter((t) => t.type === 'worker_payout' && t.settlementStatus === 'settled')
    .reduce((sum, t) => sum + t.netAmountNaira, 0);

  const pendingSettlementEarnings = engagements
    .filter((e) => e.engagementStatus === 'completion_submitted' || e.settlementStatus === 'awaiting_review')
    .reduce((sum, e) => sum + e.expectedWorkerNetNaira, 0);

  const handleAcceptOffer = () => {
    if (!onUpdateEngagement || !currentOffer) return;
    const updated: EngagementOffer = {
      ...currentOffer,
      engagementStatus: 'accepted',
      acceptedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateEngagement(updated);
    setActiveScreen('screen-26');
  };

  const handleDeclineOffer = () => {
    if (!onUpdateEngagement || !currentOffer) return;
    const updated: EngagementOffer = {
      ...currentOffer,
      engagementStatus: 'cancelled'
    };
    onUpdateEngagement(updated);
  };

  const handleSubmitCompletionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedDeclaration) return;

    if (onSubmitCompletion) {
      onSubmitCompletion({
        id: `sub-${Date.now()}`,
        engagementId: currentOffer.id,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        summaryNotes: completionNotes,
        checklistItems: checklist,
        evidenceAttachments: [
          {
            title: 'Field GPS Swath Log & Dilution Sheet',
            type: 'logsheet',
            timestamp: new Date().toISOString()
          }
        ],
        workerSignedDeclaration: true,
        status: 'pending_review'
      });
    }

    if (onUpdateEngagement && currentOffer) {
      onUpdateEngagement({
        ...currentOffer,
        engagementStatus: 'completion_submitted',
        settlementStatus: 'awaiting_review',
        completionSubmittedAt: new Date().toISOString().split('T')[0]
      });
    }

    setSubmissionFeedback('Work completion successfully submitted. The employer has 72 hours to review deliverables.');
    setTimeout(() => {
      setActiveScreen('screen-26');
    }, 1500);
  };

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'py-4 px-3.5 space-y-4 max-w-md mx-auto bg-[#F7F7EE]'
          : 'py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6'
      }`}
    >
      {/* Top Breadcrumb & Hub Title */}
      <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
              <TourmsSymbol size={16} />
              <span>WORKER PORTAL</span>
              <span aria-hidden="true">·</span>
              <span>ENGAGEMENTS & CONDITIONAL SETTLEMENT</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#0F1F1C] tracking-tight font-display">
              Worker Engagements & Earnings
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5A6E68]">Active Role:</span>
            <span className="font-bold text-[#0E5A46] bg-[#F2F7F4] px-2.5 py-1 rounded border border-[#C2DDD3]">
              {currentOffer.workerName}
            </span>
          </div>
        </div>

        {/* Screen Switcher Tabs (Screens 25 - 28) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveScreen('screen-25')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-25'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Screen 25: Offer Breakdown
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-26')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-26'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Screen 26: Payment Status
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-27')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-27'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Screen 27: Submit Completion
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-28')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-28'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Screen 28: Earnings & Receipts
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 25 — ENGAGEMENT OFFER AND PAYMENT BREAKDOWN */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-25' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#8E5A18] uppercase tracking-wider block">
                  Screen 25 · Engagement Offer Review
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  {currentOffer.jobTitle}
                </h2>
                <p className="text-xs text-[#08382B] font-semibold flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-[#0E5A46]" />
                  <span>{currentOffer.employerName}</span>
                  <span className="text-[#5A6E68]">· Ref: {currentOffer.referenceNumber}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6E68] block">Net Payment to You</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                  ₦{currentOffer.expectedWorkerNetNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Scope & Key Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] text-xs">
              <div>
                <span className="text-[#5A6E68] block text-[11px]">Location</span>
                <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                  <span>{currentOffer.employerLocation.state}, {currentOffer.employerLocation.lga}</span>
                </span>
                <span className="text-[11px] text-[#5A6E68] block truncate">{currentOffer.employerLocation.farmAddress}</span>
              </div>

              <div>
                <span className="text-[#5A6E68] block text-[11px]">Duration & Dates</span>
                <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0E5A46]" />
                  <span>{currentOffer.duration}</span>
                </span>
                <span className="text-[11px] text-[#5A6E68] block">Starts {currentOffer.startDate}</span>
              </div>

              <div>
                <span className="text-[#5A6E68] block text-[11px]">Sector & Role</span>
                <span className="font-bold text-[#0F1F1C] mt-0.5 block">{currentOffer.agriculturalSector}</span>
                <span className="text-[11px] text-[#5A6E68] block">Short-term Task Engagement</span>
              </div>
            </div>

            {/* Work Deliverables */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                Deliverables & Work Description
              </h3>
              <p className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] text-[#3A4B47] leading-relaxed">
                {currentOffer.deliverablesDescription}
              </p>
            </div>

            {/* Required Completion Conditions */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                Completion Conditions For Payment Settlement
              </h3>
              <ul className="space-y-2 bg-[#FAF9F5] p-3 rounded border border-[#EBEBDD]">
                {currentOffer.completionConditions.map((cond, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[#0F1F1C]">
                    <CheckCircle2 className="w-4 h-4 text-[#0E5A46] shrink-0 mt-0.5" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Financial Transparency Component */}
            <FeeBreakdownCard
              grossCompensationNaira={currentOffer.grossCompensationNaira}
              employerFeePercent={5}
              workerFeePercent={0}
              userPerspective="worker"
            />

            {/* Payment Conditions & Protections */}
            <div className="p-3.5 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-1.5 text-xs text-[#0F1F1C]">
              <div className="flex items-center gap-2 font-bold text-[#0E5A46]">
                <ShieldCheck className="w-4 h-4" />
                <span>Conditional Settlement Terms</span>
              </div>
              <p className="text-[11px] text-[#3A4B47] leading-relaxed">
                Before you begin work, the employer funds this engagement. You will be notified when funding is confirmed.
                Once deliverables are completed, submit your completion checklist. The employer has 72 hours to review and approve,
                after which settlement is initiated directly to your registered Nigerian bank account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#EBEBDD] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#5A6E68]">
                Offer Status: <strong className="text-[#0F1F1C] capitalize">{currentOffer.engagementStatus}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1 sm:flex-none justify-center"
                  onClick={handleDeclineOffer}
                >
                  Decline Offer
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 sm:flex-none justify-center"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={handleAcceptOffer}
                >
                  Accept Engagement Offer
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 26 — WORKER ENGAGEMENT PAYMENT STATUS */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-26' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Screen 26 · Engagement & Funding Monitor
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  {currentOffer.jobTitle}
                </h2>
                <p className="text-xs text-[#5A6E68]">
                  Employer: <strong className="text-[#0F1F1C]">{currentOffer.employerName}</strong> · Ref: {currentOffer.referenceNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusIndicator
                  status={currentOffer.paymentStatus === 'confirmed' ? 'verified' : 'pending'}
                  customLabel={
                    currentOffer.paymentStatus === 'confirmed'
                      ? 'Employer Funding Confirmed'
                      : 'Awaiting Employer Funding'
                  }
                />
              </div>
            </div>

            {/* Triad Status Tracker (Engagement, Payment, Settlement) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FAF9F5] rounded border border-[#EBEBDD]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Engagement Status</span>
                <p className="text-sm font-bold text-[#0F1F1C] capitalize">
                  {currentOffer.engagementStatus.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-[#5A6E68]">
                  {currentOffer.engagementStatus === 'in_progress' ? 'Work is currently ongoing' : 'Terms accepted'}
                </p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#EBEBDD] pt-2 sm:pt-0 sm:pl-3">
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Employer Funding Status</span>
                <p className="text-sm font-bold text-[#0E5A46] capitalize">
                  {currentOffer.paymentStatus === 'confirmed' ? 'Funding Confirmed' : 'Not Yet Initiated'}
                </p>
                <p className="text-[11px] text-[#5A6E68]">
                  {currentOffer.paymentStatus === 'confirmed'
                    ? 'Safe to begin field operations'
                    : 'Do not commence until funds are confirmed'}
                </p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#EBEBDD] pt-2 sm:pt-0 sm:pl-3">
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Settlement Status</span>
                <p className="text-sm font-bold text-[#8E5A18] capitalize">
                  {currentOffer.settlementStatus.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-[#5A6E68]">Direct bank transfer upon deliverable approval</p>
              </div>
            </div>

            {/* Work Readiness Advice */}
            {currentOffer.paymentStatus !== 'confirmed' ? (
              <div className="p-4 bg-[#FFF8EE] rounded border border-[#E7D6BE] flex items-start gap-3 text-xs text-[#8E5A18]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Important Notice: Awaiting Employer Funding</p>
                  <p className="text-[11px] leading-relaxed">
                    The employer has not yet completed funding for this engagement. Under TOURMS verified work rules,
                    workers should not travel to farm sites or deploy machinery until funding is formally confirmed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#F2F7F4] rounded border border-[#C2DDD3] flex items-start gap-3 text-xs text-[#0E5A46]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Ready to Work: Funding Confirmed by Provider</p>
                  <p className="text-[11px] leading-relaxed">
                    Employer funding of ₦{currentOffer.totalEmployerFundingNaira.toLocaleString()} is confirmed.
                    You may proceed with field operations according to the agreed schedule.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline Progress Tracker */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                Engagement Lifecycle Progression
              </h3>
              <div className="border border-[#C4C8C5] rounded p-4 space-y-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0E5A46] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1F1C]">1. Engagement Terms Agreed & Accepted</p>
                    <p className="text-[11px] text-[#5A6E68]">Accepted {currentOffer.acceptedAt || currentOffer.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      currentOffer.paymentStatus === 'confirmed'
                        ? 'bg-[#0E5A46] text-white'
                        : 'bg-[#EBEBDD] text-[#5A6E68]'
                    }`}
                  >
                    {currentOffer.paymentStatus === 'confirmed' ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1F1C]">2. Employer Pre-Funds Engagement</p>
                    <p className="text-[11px] text-[#5A6E68]">
                      {currentOffer.paymentStatus === 'confirmed' ? 'Confirmed by Payment Adapter' : 'Pending payment initiation'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      currentOffer.engagementStatus === 'completion_submitted' || currentOffer.engagementStatus === 'completed'
                        ? 'bg-[#0E5A46] text-white'
                        : 'bg-[#EBEBDD] text-[#5A6E68]'
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1F1C]">3. Work Completion Submission</p>
                    <p className="text-[11px] text-[#5A6E68]">Submit logs, photos, or sign-offs upon finishing</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      currentOffer.settlementStatus === 'settled'
                        ? 'bg-[#0E5A46] text-white'
                        : 'bg-[#EBEBDD] text-[#5A6E68]'
                    }`}
                  >
                    4
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1F1C]">4. Direct Bank Payout Settlement</p>
                    <p className="text-[11px] text-[#5A6E68]">₦{currentOffer.expectedWorkerNetNaira.toLocaleString()} disbursed to your bank</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                onClick={() => alert('Support Desk: If employer funding is delayed, call TOURMS Support at 0800-TOURMS-AGRO')}
              >
                Report a Problem / Support
              </Button>

              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setActiveScreen('screen-27')}
              >
                Go to Submit Work Completion
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 27 — SUBMIT WORK COMPLETION */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-27' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Screen 27 · Formal Completion Submission
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  Submit Work Completion
                </h2>
                <p className="text-xs text-[#5A6E68]">
                  Engagement: <strong className="text-[#0F1F1C]">{currentOffer.jobTitle}</strong> ({currentOffer.referenceNumber})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6E68] block">Claimable Amount</span>
                <span className="text-lg sm:text-xl font-extrabold text-[#0E5A46] tabular-nums">
                  ₦{currentOffer.expectedWorkerNetNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {submissionFeedback && (
              <div className="p-3.5 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-xs font-semibold text-[#0E5A46] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCompletionForm} className="space-y-5 text-xs">
              {/* Deliverable Checklist */}
              <div className="space-y-2">
                <label className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px] block">
                  1. Required Deliverables Checklist
                </label>
                <div className="space-y-2 bg-[#FAF9F5] p-3.5 rounded border border-[#EBEBDD]">
                  {checklist.map((item, index) => (
                    <label key={index} className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          const updated = [...checklist];
                          updated[index].completed = e.target.checked;
                          setChecklist(updated);
                        }}
                        className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4 mt-0.5"
                      />
                      <span className={`${item.completed ? 'text-[#0F1F1C] font-medium' : 'text-[#5A6E68]'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Completion Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px] block">
                  2. Summary Notes on Completed Work
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded bg-white text-[#0F1F1C] border border-[#C4C8C5] text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#0E5A46] leading-relaxed"
                  placeholder="Detail hectares covered, operational parameters, handover notes, or issues encountered..."
                  required
                />
              </div>

              {/* Evidence Upload Mock */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px] block">
                  3. Field Evidence Attachments (Photos, Inspection Log, Weighbridge Slip)
                </label>
                <div className="p-4 bg-[#FAF9F5] border-2 border-dashed border-[#C4C8C5] rounded text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#0E5A46] mx-auto" />
                  <p className="text-xs font-semibold text-[#0F1F1C]">
                    {hasUploadedEvidence ? '1 Document Attached: Field_Spray_GPS_Log_Kaduna.pdf (1.4 MB)' : 'Upload verification evidence'}
                  </p>
                  <p className="text-[11px] text-[#5A6E68]">
                    Supported files: PNG, JPG, PDF up to 10MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setHasUploadedEvidence(!hasUploadedEvidence)}
                  >
                    {hasUploadedEvidence ? 'Replace Attachment' : 'Select Files'}
                  </Button>
                </div>
              </div>

              {/* Clear Explanation of Review Process */}
              <div className="p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1 text-[11px] text-[#5A6E68]">
                <p className="font-bold text-[#0F1F1C]">What Happens Next?</p>
                <p>
                  Upon submission, the employer is notified immediately. They have <strong>72 hours</strong> to inspect the farm site
                  and approve completion. If approved, settlement release is authorized directly to your verified bank account.
                  In the event of dispute, TOURMS administrative mediation is triggered.
                </p>
              </div>

              {/* Declaration Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signedDeclaration}
                    onChange={(e) => setSignedDeclaration(e.target.checked)}
                    className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4 mt-0.5"
                    required
                  />
                  <span className="text-[11px] text-[#0F1F1C] font-semibold leading-relaxed">
                    I solemnly declare that the agricultural work detailed above has been completed fully in accordance
                    with the agreed engagement standards and farm safety guidelines.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-[#EBEBDD] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveScreen('screen-26')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!signedDeclaration}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Submit Formal Completion
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 28 — WORKER PAYMENT HISTORY AND RECEIPTS */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-28' && (
        <section className="space-y-5 animate-in fade-in">
          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Total Settled Earnings</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                ₦{totalSettledEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Directly disbursed to bank account</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Pending Settlements</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#8E5A18] tabular-nums">
                ₦{pendingSettlementEarnings.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">In employer review or payout queue</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Active Engagements</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0F1F1C] tabular-nums">
                {engagements.length}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Short-term & seasonal contracts</p>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="bg-white border border-[#C4C8C5] rounded p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Screen 28 · Payment Ledger
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Payout Transactions & Settlement History
                </h3>
              </div>
              <span className="text-xs text-[#5A6E68] font-semibold">
                {transactions.length} Records
              </span>
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 bg-[#FAF9F5] rounded border border-[#C4C8C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#0E5A46] font-bold">{tx.transactionReference}</span>
                      <span className="text-[#5A6E68]">·</span>
                      <span className="font-semibold text-[#0F1F1C]">{tx.jobTitle}</span>
                    </div>
                    <p className="text-[11px] text-[#5A6E68]">
                      Originator: {tx.senderParty} · Settled via {tx.providerName}
                    </p>
                    <p className="text-[10px] text-[#5A6E68]">{tx.timestamp}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBEBDD]">
                    <div className="text-left sm:text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#0E5A46] tabular-nums block">
                        ₦{tx.netAmountNaira.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-[#0E5A46] uppercase">
                        {tx.settlementStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Receipt className="w-3.5 h-3.5 text-[#0E5A46]" />}
                      onClick={() => setSelectedReceipt(tx)}
                    >
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </div>
  );
};
