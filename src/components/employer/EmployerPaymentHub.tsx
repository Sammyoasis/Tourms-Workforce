import React, { useState } from 'react';
import {
  EngagementOffer,
  WorkCompletionSubmission,
  PaymentTransaction,
  EngagementDispute
} from '../../types/payment';
import { FeeBreakdownCard } from '../payment/FeeBreakdownCard';
import { ReceiptModal } from '../payment/ReceiptModal';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { TourmsSymbol } from '../ui/TourmsLogo';
import { Modal } from '../ui/Modal';
import {
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CreditCard,
  Building,
  ArrowRight,
  Filter,
  Search,
  Receipt,
  FileCheck2,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Paperclip
} from 'lucide-react';

export interface EmployerPaymentHubProps {
  initialScreen?: 'screen-29' | 'screen-30' | 'screen-31' | 'screen-32' | 'screen-33';
  engagements: EngagementOffer[];
  transactions: PaymentTransaction[];
  disputes: EngagementDispute[];
  completionSubmission?: WorkCompletionSubmission;
  onUpdateEngagement?: (eng: EngagementOffer) => void;
  onAddTransaction?: (tx: PaymentTransaction) => void;
  onRaiseDispute?: (dsp: EngagementDispute) => void;
  isMobilePreview?: boolean;
}

export const EmployerPaymentHub: React.FC<EmployerPaymentHubProps> = ({
  initialScreen = 'screen-31',
  engagements,
  transactions,
  disputes,
  completionSubmission,
  onUpdateEngagement,
  onAddTransaction,
  onRaiseDispute,
  isMobilePreview = false
}) => {
  // Navigation tabs in Employer Payment Hub (Screens 29 - 33)
  const [activeScreen, setActiveScreen] = useState<'screen-29' | 'screen-30' | 'screen-31' | 'screen-32' | 'screen-33'>(
    initialScreen
  );

  // Active engagement for Screen 29 / 30 / 32
  const [selectedEngId, setSelectedEngId] = useState<string>(engagements[0]?.id || 'eng-001');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Screen 30 (Payment Funding Simulation State)
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card'>('bank_transfer');
  const [fundingState, setFundingState] = useState<'initial' | 'processing' | 'confirmed' | 'failed'>('initial');
  const [fundingFailureReason, setFundingFailureReason] = useState<string>('');

  // Screen 31 (Filter & Search State)
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Screen 32 (Review & Actions State)
  const [reviewActionModal, setReviewActionModal] = useState<'approve' | 'clarify' | 'dispute' | null>(null);
  const [clarificationText, setClarificationText] = useState<string>('');
  const [disputeReasonText, setDisputeReasonText] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const currentEngagement = engagements.find((e) => e.id === selectedEngId) || engagements[0];

  // Screen 31: Filtered Engagements
  const filteredEngagements = engagements.filter((eng) => {
    if (filterStatus !== 'all') {
      if (filterStatus === 'awaiting_funding' && eng.paymentStatus !== 'not_initiated') return false;
      if (filterStatus === 'funded' && eng.paymentStatus !== 'confirmed') return false;
      if (filterStatus === 'awaiting_review' && eng.engagementStatus !== 'completion_submitted') return false;
      if (filterStatus === 'disputed' && eng.engagementStatus !== 'disputed') return false;
      if (filterStatus === 'settled' && eng.settlementStatus !== 'settled') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        eng.jobTitle.toLowerCase().includes(q) ||
        eng.workerName.toLowerCase().includes(q) ||
        eng.referenceNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Funding handler (Screen 30)
  const handleInitiateFunding = (simulateFail: boolean = false) => {
    setFundingState('processing');
    setTimeout(() => {
      if (simulateFail) {
        setFundingState('failed');
        setFundingFailureReason('Virtual Account transfer timed out or invalid session. Please retry or choose card payment.');
      } else {
        setFundingState('confirmed');
        // Update engagement state
        if (onUpdateEngagement && currentEngagement) {
          const updated: EngagementOffer = {
            ...currentEngagement,
            paymentStatus: 'confirmed',
            engagementStatus: 'funded',
            fundedAt: new Date().toISOString().split('T')[0]
          };
          onUpdateEngagement(updated);
        }

        // Add transaction
        if (onAddTransaction && currentEngagement) {
          const newTx: PaymentTransaction = {
            id: `trx-${Date.now()}`,
            transactionReference: `TRX-${Date.now().toString().slice(-6)}`,
            engagementId: currentEngagement.id,
            engagementReference: currentEngagement.referenceNumber,
            jobTitle: currentEngagement.jobTitle,
            type: 'employer_funding',
            senderParty: currentEngagement.employerName,
            recipientParty: 'TOURMS Dedicated Settlement Escrow (Provider-Neutral)',
            grossAmountNaira: currentEngagement.totalEmployerFundingNaira,
            feeAmountNaira: currentEngagement.employerFeeNaira,
            netAmountNaira: currentEngagement.grossCompensationNaira,
            paymentStatus: 'confirmed',
            settlementStatus: 'approved_for_settlement',
            providerName: 'Paystack/Monnify Adapter (Provider-Neutral)',
            providerReference: `PSTK-REF-${Math.floor(Math.random() * 900000 + 100000)}`,
            narration: `Employer Funding: ${currentEngagement.referenceNumber}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          onAddTransaction(newTx);
        }
      }
    }, 1200);
  };

  // Screen 32: Completion Review Actions
  const handleApproveCompletion = () => {
    if (onUpdateEngagement && currentEngagement) {
      onUpdateEngagement({
        ...currentEngagement,
        engagementStatus: 'completed',
        settlementStatus: 'approved_for_settlement',
        completionApprovedAt: new Date().toISOString().split('T')[0]
      });
    }
    setReviewActionModal(null);
    setActionSuccessMessage('Completion approved. Next step: Conditional settlement disbursement has been authorised for the worker.');
    setTimeout(() => {
      setActiveScreen('screen-31');
      setActionSuccessMessage(null);
    }, 2000);
  };

  const handleRaiseDisputeSubmit = () => {
    if (!disputeReasonText.trim()) return;
    if (onRaiseDispute && currentEngagement) {
      onRaiseDispute({
        id: `dsp-${Date.now()}`,
        disputeReference: `DSP-2026-${Math.floor(Math.random() * 900 + 100)}`,
        engagementId: currentEngagement.id,
        engagementReference: currentEngagement.referenceNumber,
        jobTitle: currentEngagement.jobTitle,
        raisedBy: 'employer',
        employerName: currentEngagement.employerName,
        workerName: currentEngagement.workerName,
        category: 'quality_deficit',
        description: disputeReasonText,
        disputedAmountNaira: currentEngagement.grossCompensationNaira,
        undisputedAmountNaira: 0,
        evidenceNotes: 'Employer raised formal dispute during completion review.',
        timeline: [
          { event: 'Dispute raised by employer', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), actor: 'Employer' },
          { event: 'Funds placed on administrative hold', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), actor: 'System' }
        ],
        assignedAdminName: 'Chioma Okeke (Platform Support)',
        status: 'opened'
      });
    }

    if (onUpdateEngagement && currentEngagement) {
      onUpdateEngagement({
        ...currentEngagement,
        engagementStatus: 'disputed',
        settlementStatus: 'on_hold'
      });
    }

    setReviewActionModal(null);
    setActionSuccessMessage('Dispute registered. Funds remain on conditional hold while administrative mediation commences.');
    setTimeout(() => {
      setActiveScreen('screen-31');
      setActionSuccessMessage(null);
    }, 2000);
  };

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'py-4 px-3.5 space-y-4 max-w-md mx-auto bg-[#F7F7EE]'
          : 'py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6'
      }`}
    >
      {/* Top Breadcrumb & Hub Title */}
      <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
              <TourmsSymbol size={16} />
              <span>EMPLOYER CONSOLE</span>
              <span aria-hidden="true">·</span>
              <span>ENGAGEMENT FUNDING & SETTLEMENT</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#0F1F1C] tracking-tight font-display">
              Employer Payment Management
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5A6E68]">Enterprise:</span>
            <span className="font-bold text-[#0E5A46] bg-[#F2F7F4] px-2.5 py-1 rounded border border-[#C2DDD3]">
              {currentEngagement.employerName}
            </span>
          </div>
        </div>

        {/* Screen Switcher Tabs (Screens 29 - 33) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveScreen('screen-31')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-31'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Payment Dashboard
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-29')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-29'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Cost Summary
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-30')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-30'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Fund Engagement
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-32')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-32'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Review Completion
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-33')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-33'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Transactions & Receipts
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-xs font-semibold text-[#0E5A46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 31 — EMPLOYER ENGAGEMENT PAYMENT DASHBOARD */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-31' && (
        <section className="space-y-5 animate-in fade-in">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3.5 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Awaiting Funding</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#8E5A18] tabular-nums">
                {engagements.filter((e) => e.paymentStatus === 'not_initiated').length}
              </p>
              <p className="text-[10px] text-[#5A6E68]">Needs employer funding</p>
            </div>

            <div className="p-3.5 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Funded / Active</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                {engagements.filter((e) => e.paymentStatus === 'confirmed' && e.engagementStatus !== 'completed').length}
              </p>
              <p className="text-[10px] text-[#5A6E68]">Funds secured; work ongoing</p>
            </div>

            <div className="p-3.5 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Awaiting Review</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0F1F1C] tabular-nums">
                {engagements.filter((e) => e.engagementStatus === 'completion_submitted').length}
              </p>
              <p className="text-[10px] text-[#5A6E68]">Deliverables ready for audit</p>
            </div>

            <div className="p-3.5 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Settled / Closed</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#5A6E68] tabular-nums">
                {engagements.filter((e) => e.settlementStatus === 'settled').length}
              </p>
              <p className="text-[10px] text-[#5A6E68]">Disbursed to workers</p>
            </div>
          </div>

          {/* Engagement Pipeline & Filters */}
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Consolidated Engagement Pipeline
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  All Contracted Engagements & Payment Statuses
                </h3>
              </div>

              {/* Quick Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {['all', 'awaiting_funding', 'funded', 'awaiting_review', 'disputed', 'settled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded capitalize whitespace-nowrap font-medium cursor-pointer ${
                      filterStatus === st
                        ? 'bg-[#0E5A46] text-white font-bold'
                        : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD]'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Engagements */}
            <div className="space-y-3">
              {filteredEngagements.map((eng) => (
                <div
                  key={eng.id}
                  className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] hover:border-[#0E5A46] transition-colors space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#0E5A46] font-bold">{eng.referenceNumber}</span>
                        <span className="text-[#5A6E68]">·</span>
                        <h4 className="text-sm font-bold text-[#0F1F1C]">{eng.jobTitle}</h4>
                      </div>
                      <p className="text-[11px] text-[#5A6E68] mt-0.5">
                        Worker: <strong className="text-[#0F1F1C]">{eng.workerName}</strong> ({eng.workerPhone}) · Location: {eng.employerLocation.state}, {eng.employerLocation.lga}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#5A6E68] uppercase">
                        {eng.engagementStatus.replace(/_/g, ' ')}
                      </span>
                      <StatusIndicator
                        status={eng.paymentStatus === 'confirmed' ? 'verified' : 'pending'}
                        customLabel={eng.paymentStatus === 'confirmed' ? 'Funded' : 'Unfunded'}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-[#5A6E68] block">Worker Net Payout:</span>
                        <span className="font-bold text-[#0F1F1C] tabular-nums">
                          ₦{eng.expectedWorkerNetNaira.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5A6E68] block">Total Obligation (Inc. Fee):</span>
                        <span className="font-bold text-[#0E5A46] tabular-nums">
                          ₦{eng.totalEmployerFundingNaira.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5A6E68] block">Settlement State:</span>
                        <span className="font-bold text-[#8E5A18] capitalize">
                          {eng.settlementStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Contextual Action Buttons */}
                    <div className="flex items-center gap-2">
                      {eng.paymentStatus !== 'confirmed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedEngId(eng.id);
                            setActiveScreen('screen-30');
                          }}
                        >
                          Fund Engagement (₦{eng.totalEmployerFundingNaira.toLocaleString()})
                        </Button>
                      )}

                      {eng.engagementStatus === 'completion_submitted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedEngId(eng.id);
                            setActiveScreen('screen-32');
                          }}
                        >
                          Review Completion
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEngId(eng.id);
                          setActiveScreen('screen-29');
                        }}
                      >
                        Cost Breakdown
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 29 — EMPLOYER ENGAGEMENT COST SUMMARY */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-29' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#8E5A18] uppercase tracking-wider block">
                  Financial Obligation Summary
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  Employer Engagement Cost Breakdown
                </h2>
                <p className="text-xs text-[#5A6E68]">
                  Engagement: <strong className="text-[#0F1F1C]">{currentEngagement.jobTitle}</strong> ({currentEngagement.referenceNumber})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6E68] block">Total Amount Payable</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                  ₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Parties Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF9F5] rounded border border-[#EBEBDD] text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Contracted Worker</span>
                <p className="font-bold text-[#0F1F1C] text-sm mt-0.5">{currentEngagement.workerName}</p>
                <p className="text-[11px] text-[#5A6E68]">{currentEngagement.workerPhone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Location & Duration</span>
                <p className="font-bold text-[#0F1F1C] mt-0.5">
                  {currentEngagement.employerLocation.state}, {currentEngagement.employerLocation.lga}
                </p>
                <p className="text-[11px] text-[#5A6E68]">{currentEngagement.duration}</p>
              </div>
            </div>

            {/* Fee Breakdown Component */}
            <FeeBreakdownCard
              grossCompensationNaira={currentEngagement.grossCompensationNaira}
              employerFeePercent={5}
              workerFeePercent={0}
              userPerspective="employer"
            />

            {/* Terms & Conditional Holding Advice */}
            <div className="p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1.5 text-xs text-[#5A6E68]">
              <p className="font-bold text-[#0F1F1C]">Payment Terms & Disbursement Condition</p>
              <p className="text-[11px] leading-relaxed">
                By clicking "Proceed to Fund Engagement", you initiate conditional funding. The full amount is locked
                in the payment settlement pool. Funds are only disbursed to the worker when you formally inspect and
                approve deliverables or following administrative dispute resolution.
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#EBEBDD] flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setActiveScreen('screen-31')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => setActiveScreen('screen-30')}
              >
                Proceed to Fund Engagement
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 30 — FUND AN ENGAGEMENT */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-30' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Secure Engagement Funding
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  Fund Engagement #{currentEngagement.referenceNumber}
                </h2>
                <p className="text-xs text-[#5A6E68]">
                  Worker: <strong className="text-[#0F1F1C]">{currentEngagement.workerName}</strong> · {currentEngagement.jobTitle}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6E68] block">Total Funding Due</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                  ₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Funding State Switcher: Initial, Processing, Confirmed, Failed */}
            {fundingState === 'processing' && (
              <div className="p-8 text-center space-y-3 bg-[#FAF9F5] rounded border border-[#C4C8C5]">
                <div className="w-10 h-10 border-4 border-[#0E5A46] border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-[#0F1F1C]">Connecting to Nigerian Payment Channel...</h3>
                <p className="text-xs text-[#5A6E68]">
                  Verifying transaction settlement token. Please do not close this window.
                </p>
              </div>
            )}

            {fundingState === 'confirmed' && (
              <div className="p-6 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0E5A46] text-white flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-[#0E5A46]">Engagement Successfully Funded!</h3>
                <p className="text-xs text-[#3A4B47] max-w-md mx-auto">
                  Payment of <strong>₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()}</strong> has been confirmed.
                  The engagement status is now set to <strong>Funded & Ready to Begin</strong>. Worker {currentEngagement.workerName} has been notified.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveScreen('screen-33')}
                  >
                    View Transaction Receipt
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setFundingState('initial');
                      setActiveScreen('screen-31');
                    }}
                  >
                    Return to Payment Dashboard
                  </Button>
                </div>
              </div>
            )}

            {fundingState === 'failed' && (
              <div className="p-6 bg-[#FFF2F2] rounded border border-[#F8B4B4] space-y-3 text-center">
                <AlertCircle className="w-10 h-10 text-[#C53030] mx-auto" />
                <h3 className="text-sm font-bold text-[#C53030]">Payment Failed or Timed Out</h3>
                <p className="text-xs text-[#0F1F1C]">{fundingFailureReason}</p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFundingState('initial')}
                  >
                    Try Another Method
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleInitiateFunding(false)}
                  >
                    Retry Funding
                  </Button>
                </div>
              </div>
            )}

            {fundingState === 'initial' && (
              <div className="space-y-5 text-xs">
                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px] block">
                    Select Verified Payment Channel (Provider-Neutral Adapter)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-4 rounded border cursor-pointer transition-colors space-y-2 ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-[#0E5A46] bg-[#F2F7F4] ring-1 ring-[#0E5A46]'
                          : 'border-[#C4C8C5] bg-[#FAF9F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1F1C] flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-[#0E5A46]" />
                          <span>Dedicated NIBSS Virtual Account</span>
                        </span>
                        {paymentMethod === 'bank_transfer' && <Check className="w-4 h-4 text-[#0E5A46]" />}
                      </div>
                      <p className="text-[11px] text-[#5A6E68]">
                        Instant transfer via your Nigerian banking app (Access, GTB, Zenith, First Bank, etc.). Zero card limits.
                      </p>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded border cursor-pointer transition-colors space-y-2 ${
                        paymentMethod === 'card'
                          ? 'border-[#0E5A46] bg-[#F2F7F4] ring-1 ring-[#0E5A46]'
                          : 'border-[#C4C8C5] bg-[#FAF9F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1F1C] flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#0E5A46]" />
                          <span>Corporate Debit Card / MasterCard / Verve</span>
                        </span>
                        {paymentMethod === 'card' && <Check className="w-4 h-4 text-[#0E5A46]" />}
                      </div>
                      <p className="text-[11px] text-[#5A6E68]">
                        Direct corporate card checkout with 3D-Secure 2FA OTP verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions Box depending on method */}
                {paymentMethod === 'bank_transfer' ? (
                  <div className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] space-y-2">
                    <span className="font-bold text-[#0F1F1C] block text-[11px] uppercase">
                      Virtual Account Instructions
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-white rounded border border-[#EBEBDD]">
                      <div>
                        <span className="text-[#5A6E68] text-[10px] block">Bank Name</span>
                        <span className="font-bold text-[#0F1F1C]">Wema / Providus Bank</span>
                      </div>
                      <div>
                        <span className="text-[#5A6E68] text-[10px] block">Virtual Account Number</span>
                        <span className="font-mono font-bold text-[#0E5A46] text-sm">9921048821</span>
                      </div>
                      <div>
                        <span className="text-[#5A6E68] text-[10px] block">Account Name</span>
                        <span className="font-bold text-[#0F1F1C] truncate">TOURMS Agro Settlement</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5A6E68]">
                      Transfer exactly <strong>₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()}</strong>.
                      This single-use virtual account expires in 60 minutes.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] space-y-2">
                    <span className="font-bold text-[#0F1F1C] block text-[11px] uppercase">
                      Card Authorization Simulation
                    </span>
                    <p className="text-[11px] text-[#5A6E68]">
                      Clicking "Initiate Payment" will invoke the encrypted CBN-compliant checkout gateway to hold funds securely in escrow.
                    </p>
                  </div>
                )}

                {/* Security and Trust Footer */}
                <div className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] flex items-center gap-2 text-[11px] text-[#5A6E68]">
                  <ShieldCheck className="w-4 h-4 text-[#0E5A46] shrink-0" />
                  <span>
                    256-bit Encrypted Settlement Channel. Funds are conditionally locked until deliverable verification.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveScreen('screen-31')}
                  >
                    Cancel & Return
                  </Button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInitiateFunding(true)}
                      className="text-[11px] text-[#8E5A18] hover:underline font-semibold cursor-pointer mr-2"
                      title="Test failure state handling"
                    >
                      (Test Failed State)
                    </button>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      leftIcon={<Check className="w-4 h-4" />}
                      onClick={() => handleInitiateFunding(false)}
                    >
                      Authorize Funding (₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()})
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 32 — REVIEW WORK COMPLETION */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-32' && (
        <section className="space-y-5 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Completion Inspection & Approval
                </span>
                <h2 className="text-base sm:text-xl font-bold text-[#0F1F1C] mt-0.5">
                  Review Work Completion
                </h2>
                <p className="text-xs text-[#5A6E68]">
                  Engagement: <strong className="text-[#0F1F1C]">{currentEngagement.jobTitle}</strong> ({currentEngagement.referenceNumber})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5A6E68] block">Disbursement Upon Approval</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                  ₦{currentEngagement.expectedWorkerNetNaira.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Worker & Submission Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Contractor / Worker</span>
                <p className="font-bold text-[#0F1F1C] text-sm mt-0.5">{currentEngagement.workerName}</p>
                <p className="text-[11px] text-[#5A6E68]">{currentEngagement.workerPhone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Submission Timestamp</span>
                <p className="font-bold text-[#0F1F1C] mt-0.5">{currentEngagement.completionSubmittedAt || '2026-10-28 16:45'}</p>
                <p className="text-[11px] text-[#0E5A46] font-semibold">Under 72-Hour Review Period</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Settlement Pool</span>
                <p className="font-bold text-[#0E5A46] mt-0.5">Funds Fully Confirmed</p>
                <p className="text-[11px] text-[#5A6E68]">Awaiting Employer Authorization</p>
              </div>
            </div>

            {/* Worker's Submitted Deliverables & Notes */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                Worker's Completion Summary & Logs
              </h3>
              <div className="p-4 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-2 text-[#3A4B47] leading-relaxed">
                <p>
                  "Completed full 4-house irrigation overhaul in Jos South. Filter screens backwashed, emitter flow rates verified with pressure gauge at 1.25 bar. Test runs showed uniform water distribution without clogging."
                </p>
                <div className="pt-2 border-t border-[#EBEBDD] flex items-center gap-2 text-xs font-semibold text-[#0E5A46]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Worker Signed Formal Completion Declaration</span>
                </div>
              </div>
            </div>

            {/* Attached Verification Evidence */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                Submitted Evidence & Field Attachments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF9F5] rounded border border-[#C4C8C5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-[#0E5A46]" />
                    <div>
                      <p className="font-bold text-[#0F1F1C]">Pressure_Gauge_Reading_1_25_bar.jpg</p>
                      <p className="text-[10px] text-[#5A6E68]">Timestamp: 2026-10-28 14:10 · 2.1 MB</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#0E5A46] font-semibold">Attached</span>
                </div>

                <div className="p-3 bg-[#FAF9F5] rounded border border-[#C4C8C5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#0E5A46]" />
                    <div>
                      <p className="font-bold text-[#0F1F1C]">Supervisor_Backwash_Inspection.pdf</p>
                      <p className="text-[10px] text-[#5A6E68]">Signed by Farm Supervisor · 840 KB</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#0E5A46] font-semibold">Attached</span>
                </div>
              </div>
            </div>

            {/* Decision Actions Bar */}
            <div className="pt-4 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[#C53030] border-[#C53030] hover:bg-[#FFF2F2]"
                  leftIcon={<AlertTriangle className="w-4 h-4 text-[#C53030]" />}
                  onClick={() => setReviewActionModal('dispute')}
                >
                  Raise Dispute
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<HelpCircle className="w-4 h-4" />}
                  onClick={() => setReviewActionModal('clarify')}
                >
                  Request Clarification
                </Button>
              </div>

              <Button
                variant="primary"
                size="md"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={() => setReviewActionModal('approve')}
              >
                Approve & Release Settlement (₦{currentEngagement.expectedWorkerNetNaira.toLocaleString()})
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 33 — EMPLOYER PAYMENT HISTORY AND TRANSACTION DETAILS */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-33' && (
        <section className="space-y-5 animate-in fade-in">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Total Engagements Funded</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                ₦{transactions.reduce((sum, t) => sum + t.grossAmountNaira, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Direct agricultural operations</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Platform Service Charges</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#8E5A18] tabular-nums">
                ₦{transactions.reduce((sum, t) => sum + t.feeAmountNaira, 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">5% standard operational fee</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Active Disputes</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0F1F1C] tabular-nums">
                {disputes.length}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Under mediation</p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-[#C4C8C5] rounded p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Transaction Records
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Employer Financial Transactions & Receipts
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
                      Recipient / Purpose: {tx.recipientParty} · Provider: {tx.providerName}
                    </p>
                    <p className="text-[10px] text-[#5A6E68]">{tx.timestamp} · Session Ref: {tx.providerReference}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBEBDD]">
                    <div className="text-left sm:text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#0F1F1C] tabular-nums block">
                        ₦{tx.grossAmountNaira.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-[#0E5A46] uppercase">
                        {tx.paymentStatus}
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

      {/* Confirmation Modals for Screen 32 Consequential Actions */}
      {/* 1. Approve Settlement Modal */}
      <Modal
        isOpen={reviewActionModal === 'approve'}
        onClose={() => setReviewActionModal(null)}
        title="Confirm Work Completion & Authorize Payout"
      >
        <div className="space-y-4 text-xs text-left">
          <p className="text-[#3A4B47] leading-relaxed">
            Are you sure you want to approve this work completion? Approving will authorize the immediate conditional release of{' '}
            <strong className="text-[#0E5A46]">₦{currentEngagement.expectedWorkerNetNaira.toLocaleString()}</strong> to{' '}
            <strong>{currentEngagement.workerName}</strong> via direct NIBSS bank transfer.
          </p>
          <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-[11px] text-[#0E5A46]">
            This action is final and marks the short-term engagement as Completed.
          </div>
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setReviewActionModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApproveCompletion}>
              Yes, Approve & Settle
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2. Raise Dispute Modal */}
      <Modal
        isOpen={reviewActionModal === 'dispute'}
        onClose={() => setReviewActionModal(null)}
        title="Raise Formal Engagement Dispute"
      >
        <div className="space-y-4 text-xs text-left">
          <p className="text-[#3A4B47] leading-relaxed">
            Raising a dispute places the locked funds of <strong>₦{currentEngagement.totalEmployerFundingNaira.toLocaleString()}</strong> on
            administrative hold. A TOURMS mediation officer will review submissions from both parties.
          </p>
          <div className="space-y-1">
            <label className="font-bold text-[#0F1F1C]">Reason for Dispute / Missing Deliverables:</label>
            <textarea
              value={disputeReasonText}
              onChange={(e) => setDisputeReasonText(e.target.value)}
              rows={3}
              placeholder="Detail discrepancies, incomplete field hectares, or unfulfilled conditions..."
              className="w-full rounded border border-[#C4C8C5] p-2.5 text-xs text-[#0F1F1C] focus:ring-1 focus:ring-[#C53030]"
            />
          </div>
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setReviewActionModal(null)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#C53030] text-white hover:bg-[#9B2C2C] border-none"
              onClick={handleRaiseDisputeSubmit}
            >
              Submit Dispute
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Clarification Request Modal */}
      <Modal
        isOpen={reviewActionModal === 'clarify'}
        onClose={() => setReviewActionModal(null)}
        title="Request Deliverable Clarification"
      >
        <div className="space-y-4 text-xs text-left">
          <p className="text-[#3A4B47] leading-relaxed">
            Ask worker <strong>{currentEngagement.workerName}</strong> for additional logs, photos, or explanations before approving.
          </p>
          <div className="space-y-1">
            <label className="font-bold text-[#0F1F1C]">Clarification Message:</label>
            <textarea
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
              rows={3}
              placeholder="e.g. Please upload higher-resolution photos of the manifold pressure gauges..."
              className="w-full rounded border border-[#C4C8C5] p-2.5 text-xs text-[#0F1F1C] focus:ring-1 focus:ring-[#0E5A46]"
            />
          </div>
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setReviewActionModal(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setReviewActionModal(null);
                setActionSuccessMessage('Clarification request dispatched to worker.');
                setTimeout(() => setActionSuccessMessage(null), 2500);
              }}
            >
              Send Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={selectedReceipt !== null}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </div>
  );
};
