import React, { useState } from 'react';
import {
  EngagementOffer,
  PaymentTransaction,
  EngagementDispute,
  RefundRequest,
  AdminPaymentMetrics
} from '../../types/payment';
import { SAMPLE_ADMIN_PAYMENT_METRICS } from '../../data/samplePayments';
import { ReceiptModal } from '../payment/ReceiptModal';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  LayoutDashboard,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Download,
  Calendar,
  Building2,
  User,
  Check,
  X,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export interface AdminPaymentsHubProps {
  initialScreen?: 'screen-34' | 'screen-35' | 'screen-36' | 'screen-37' | 'screen-38' | 'screen-39';
  engagements: EngagementOffer[];
  transactions: PaymentTransaction[];
  disputes: EngagementDispute[];
  refunds: RefundRequest[];
  onUpdateDispute?: (dsp: EngagementDispute) => void;
  onUpdateRefund?: (rfd: RefundRequest) => void;
  onAuthorizeSettlement?: (engId: string) => void;
  isMobilePreview?: boolean;
}

export const AdminPaymentsHub: React.FC<AdminPaymentsHubProps> = ({
  initialScreen = 'screen-34',
  engagements,
  transactions,
  disputes,
  refunds,
  onUpdateDispute,
  onUpdateRefund,
  onAuthorizeSettlement,
  isMobilePreview = false
}) => {
  const [activeScreen, setActiveScreen] = useState<'screen-34' | 'screen-35' | 'screen-36' | 'screen-37' | 'screen-38' | 'screen-39'>(
    initialScreen
  );

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Screen 35: Transaction Filters
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('all');

  // Screen 36: Settlement Queue Action
  const [settlementSuccessNotice, setSettlementSuccessNotice] = useState<string | null>(null);

  // Screen 37: Dispute Resolution Modal State
  const [selectedDispute, setSelectedDispute] = useState<EngagementDispute | null>(null);
  const [resolutionDecision, setResolutionDecision] = useState<'payout_worker' | 'refund_employer' | 'split_50_50'>('payout_worker');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Screen 38: Refund Action State
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  // Screen 39: Reconciliation Export Feedback
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const metrics = SAMPLE_ADMIN_PAYMENT_METRICS;

  const handleResolveDispute = () => {
    if (!selectedDispute || !onUpdateDispute) return;
    const updated: EngagementDispute = {
      ...selectedDispute,
      status: resolutionDecision === 'payout_worker' ? 'resolved_payout' : resolutionDecision === 'refund_employer' ? 'resolved_refund' : 'resolved_split',
      resolutionDecision: resolutionNotes || `Resolved in favor of ${resolutionDecision.replace('_', ' ')}`,
      resolvedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateDispute(updated);
    setSelectedDispute(null);
  };

  const handleApproveRefund = (rfd: RefundRequest) => {
    if (!onUpdateRefund) return;
    const updated: RefundRequest = {
      ...rfd,
      status: 'approved',
      reviewedBy: 'Admin Operations Lead',
      reviewedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateRefund(updated);
  };

  const handleTriggerSettlement = (engId: string) => {
    if (onAuthorizeSettlement) {
      onAuthorizeSettlement(engId);
    }
    setSettlementSuccessNotice(`Settlement approved. NIBSS payout instruction queued for engagement ${engId}.`);
    setTimeout(() => setSettlementSuccessNotice(null), 3000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) return false;
    if (txSearch.trim()) {
      const q = txSearch.toLowerCase();
      return (
        tx.transactionReference.toLowerCase().includes(q) ||
        tx.jobTitle.toLowerCase().includes(q) ||
        tx.senderParty.toLowerCase().includes(q) ||
        tx.recipientParty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full text-left space-y-5 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Screen Navigation */}
      <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
          <div>
            <div className="text-[10px] font-bold text-[#C98A3A] uppercase tracking-wider">
              Administration · Payment & Settlement Operations
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#0F1F1C] tracking-tight font-display">
              Administrative Payment Desk
            </h1>
          </div>
          <span className="text-xs font-semibold text-[#5A6E68]">
            Protocols: Strict Conditional Settlement & Audit Trail
          </span>
        </div>

        {/* Payment Operations Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveScreen('screen-34')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-34'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Payment Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-35')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-35'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Transaction Ledger
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-36')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-36'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Settlement Queue
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-37')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-37'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Dispute Mediation
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-38')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-38'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Refunds & Cancellations
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('screen-39')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeScreen === 'screen-39'
                ? 'bg-[#0E5A46] text-white shadow-2xs'
                : 'bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] border border-[#C4C8C5]'
            }`}
          >
            Reconciliation & Reports
          </button>
        </div>
      </div>

      {settlementSuccessNotice && (
        <div className="p-4 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-xs font-semibold text-[#0E5A46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{settlementSuccessNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 34 — ADMIN PAYMENT OVERVIEW */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-34' && (
        <section className="space-y-5 animate-in fade-in">
          {/* Top Operational Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Total Volume (Gross)</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0F1F1C] tabular-nums">
                ₦{metrics.totalPaymentVolumeNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">All short-term engagements</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Confirmed Funding (Escrow)</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#0E5A46] tabular-nums">
                ₦{metrics.confirmedFundingNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Secured by payment adapter</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Disbursed Payouts</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#08382B] tabular-nums">
                ₦{metrics.settledTransactionsNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Settled to verified worker accounts</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Platform Fee Revenue</span>
              <p className="text-xl sm:text-2xl font-extrabold text-[#8E5A18] tabular-nums">
                ₦{metrics.platformServiceRevenueNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">5% operational fee earned</p>
            </div>
          </div>

          {/* Secondary Triad & Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded border border-[#C4C8C5] space-y-1">
              <span className="text-[10px] font-bold text-[#8E5A18] uppercase">Pending Settlements</span>
              <p className="text-xl font-bold text-[#0F1F1C] tabular-nums">
                ₦{metrics.pendingSettlementNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Completion submitted, in review window</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] space-y-1">
              <span className="text-[10px] font-bold text-[#C53030] uppercase">Disputed Funds (On Hold)</span>
              <p className="text-xl font-bold text-[#C53030] tabular-nums">
                ₦{metrics.disputedFundsNaira.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#5A6E68]">Locked pending mediation outcome</p>
            </div>

            <div className="p-4 bg-white rounded border border-[#C4C8C5] space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Reconciliation Status</span>
              <p className="text-xl font-bold text-[#0E5A46] tabular-nums">
                {metrics.reconciliationMatchRate}% Matched
              </p>
              <p className="text-[11px] text-[#5A6E68]">{metrics.unmatchedTransactionsCount} audit exceptions</p>
            </div>
          </div>

          {/* Regulatory Ledger Standard */}
          <div className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] text-xs text-[#5A6E68]">
            <strong>Regulatory Ledger Standard:</strong> All escrow holdings, transactions, and conditional settlements are recorded under central audit protocols adhering to Nigerian agribusiness labor and commercial contracts standards.
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CENTRAL TRANSACTION MANAGEMENT */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-35' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Central Transaction Ledger
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  All Financial Events, Orders & Transfers
                </h3>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="search"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Filter by ref, employer, worker..."
                  className="px-3 py-1.5 text-xs bg-white border border-[#C4C8C5] rounded w-48 sm:w-64 focus:ring-1 focus:ring-[#0E5A46]"
                />

                <select
                  value={txTypeFilter}
                  onChange={(e) => setTxTypeFilter(e.target.value)}
                  className="px-2 py-1.5 text-xs bg-white border border-[#C4C8C5] rounded focus:ring-1 focus:ring-[#0E5A46]"
                >
                  <option value="all">All Event Types</option>
                  <option value="employer_funding">Employer Funding</option>
                  <option value="worker_payout">Worker Payout</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="border border-[#C4C8C5] rounded overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#FAF9F5] border-b border-[#C4C8C5] text-[10px] uppercase font-bold text-[#5A6E68]">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Engagement</th>
                    <th className="p-3">Sender / Recipient</th>
                    <th className="p-3">Gross (NGN)</th>
                    <th className="p-3">Fee (NGN)</th>
                    <th className="p-3">Net (NGN)</th>
                    <th className="p-3">Channel Ref</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBDD]">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#FAF9F5]">
                      <td className="p-3 font-mono font-bold text-[#0E5A46]">{tx.transactionReference}</td>
                      <td className="p-3 text-[#0F1F1C]">
                        <span className="font-semibold block">{tx.engagementReference}</span>
                        <span className="text-[10px] text-[#5A6E68]">{tx.jobTitle}</span>
                      </td>
                      <td className="p-3 text-[#3A4B47]">
                        <span className="font-semibold block">{tx.senderParty}</span>
                        <span className="text-[10px] text-[#5A6E68]">→ {tx.recipientParty}</span>
                      </td>
                      <td className="p-3 tabular-nums font-medium">₦{tx.grossAmountNaira.toLocaleString()}</td>
                      <td className="p-3 tabular-nums text-[#8E5A18]">₦{tx.feeAmountNaira.toLocaleString()}</td>
                      <td className="p-3 tabular-nums font-bold text-[#0E5A46]">₦{tx.netAmountNaira.toLocaleString()}</td>
                      <td className="p-3 font-mono text-[11px] text-[#5A6E68]">{tx.providerReference}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold uppercase text-[#0E5A46] bg-[#F2F7F4] px-2 py-0.5 rounded border border-[#C2DDD3]">
                          {tx.settlementStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReceipt(tx)}
                        >
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 36 — ADMIN SETTLEMENT REVIEW QUEUE */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-36' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Settlement Verification Queue
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Engagements Awaiting Conditional Release Authorization
                </h3>
              </div>
              <span className="text-xs text-[#5A6E68]">
                {engagements.filter((e) => e.settlementStatus === 'awaiting_review' || e.settlementStatus === 'approved_for_settlement').length} Pending Settlement Actions
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {engagements.map((eng) => (
                <div
                  key={eng.id}
                  className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#0E5A46] font-bold">{eng.referenceNumber}</span>
                      <span className="text-[#5A6E68]">·</span>
                      <h4 className="font-bold text-[#0F1F1C]">{eng.jobTitle}</h4>
                    </div>
                    <p className="text-[#5A6E68]">
                      Employer: <strong>{eng.employerName}</strong> · Worker: <strong>{eng.workerName}</strong>
                    </p>
                    <p className="text-[11px] text-[#5A6E68]">
                      Payment: <strong>{eng.paymentStatus}</strong> · Settlement: <strong>{eng.settlementStatus}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBEBDD]">
                    <div className="text-left sm:text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#0E5A46] tabular-nums block">
                        ₦{eng.expectedWorkerNetNaira.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#5A6E68]">Net Payout Amount</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {eng.settlementStatus === 'awaiting_review' || eng.settlementStatus === 'approved_for_settlement' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          onClick={() => handleTriggerSettlement(eng.id)}
                        >
                          Authorize Release
                        </Button>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#5A6E68] italic">
                          {eng.settlementStatus === 'settled' ? 'Settled' : 'Not Ready'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 37 — ADMIN DISPUTE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-37' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#C53030] uppercase tracking-wider block">
                  Dispute Mediation & Arbitration
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Active Engagement Claims & Disputed Settlement Pools
                </h3>
              </div>
              <span className="text-xs text-[#5A6E68]">{disputes.length} Registered Disputes</span>
            </div>

            <div className="space-y-3 text-xs">
              {disputes.map((dsp) => (
                <div key={dsp.id} className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBEBDD]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#C53030] font-bold">{dsp.disputeReference}</span>
                        <span className="text-[#5A6E68]">·</span>
                        <h4 className="font-bold text-[#0F1F1C]">{dsp.jobTitle}</h4>
                      </div>
                      <p className="text-[11px] text-[#5A6E68] mt-0.5">
                        Claim by: <strong className="capitalize">{dsp.raisedBy}</strong> ({dsp.raisedBy === 'employer' ? dsp.employerName : dsp.workerName})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#8E5A18] bg-[#FFF8EE] px-2 py-0.5 rounded border border-[#E7D6BE]">
                        {dsp.status.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-[#0F1F1C] tabular-nums">
                        ₦{dsp.disputedAmountNaira.toLocaleString()} at stake
                      </span>
                    </div>
                  </div>

                  <p className="text-[#3A4B47] leading-relaxed p-3 bg-white rounded border border-[#EBEBDD]">
                    {dsp.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[#5A6E68]">
                    <span>Mediator: <strong>{dsp.assignedAdminName}</strong></span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedDispute(dsp)}
                    >
                      Arbitrate & Resolve Claim
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 38 — ADMIN REFUNDS AND CANCELLATIONS */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-38' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#8E5A18] uppercase tracking-wider block">
                  Refund Request Management
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Cancelled Engagements & Payout Reversals
                </h3>
              </div>
              <span className="text-xs text-[#5A6E68]">{refunds.length} Refund Requests</span>
            </div>

            <div className="space-y-3 text-xs">
              {refunds.map((rfd) => (
                <div key={rfd.id} className="p-4 bg-[#FAF9F5] rounded border border-[#C4C8C5] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBEBDD]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#8E5A18] font-bold">{rfd.refundReference}</span>
                        <span className="text-[#5A6E68]">·</span>
                        <span className="font-bold text-[#0F1F1C]">{rfd.employerName}</span>
                      </div>
                      <p className="text-[11px] text-[#5A6E68]">Worker: {rfd.workerName} · Ref: {rfd.engagementReference}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#0E5A46] bg-[#F2F7F4] px-2 py-0.5 rounded border border-[#C2DDD3]">
                        {rfd.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#3A4B47] leading-relaxed p-2.5 bg-white rounded border border-[#EBEBDD]">
                    Reason: {rfd.reason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-white rounded border border-[#EBEBDD] text-[11px]">
                    <div>Total Paid: <strong>₦{rfd.totalPaidNaira.toLocaleString()}</strong></div>
                    <div>Eligible Refund: <strong className="text-[#0E5A46]">₦{rfd.eligibleRefundNaira.toLocaleString()}</strong></div>
                    <div>Retained Fee: <strong className="text-[#5A6E68]">₦{rfd.retainedProcessingFeeNaira.toLocaleString()}</strong></div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {rfd.status === 'requested' || rfd.status === 'under_review' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveRefund(rfd)}
                      >
                        Approve Refund (₦{rfd.eligibleRefundNaira.toLocaleString()})
                      </Button>
                    ) : (
                      <span className="text-[11px] text-[#0E5A46] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Refund Approved & Settled</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 39 — ADMIN PAYMENT REPORTS AND RECONCILIATION */}
      {/* ========================================================================= */}
      {activeScreen === 'screen-39' && (
        <section className="space-y-4 animate-in fade-in">
          <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBEBDD]">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A46] uppercase tracking-wider block">
                  Audit & Ledger Reconciliation
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  Financial Accounting Oversight & Settlement Reconciliation
                </h3>
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => {
                  setExportNotice('Generated export CSV: tourms_financial_reconciliation_2026.csv (Ready for audit)');
                  setTimeout(() => setExportNotice(null), 3000);
                }}
              >
                Export Audit Ledger (CSV)
              </Button>
            </div>

            {exportNotice && (
              <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-xs font-semibold text-[#0E5A46] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Financial Ledger Distinction Matrix */}
            <div className="border border-[#C4C8C5] rounded overflow-hidden text-xs">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#FAF9F5] border-b border-[#C4C8C5] text-[10px] uppercase font-bold text-[#5A6E68]">
                  <tr>
                    <th className="p-3">Accounting Stream</th>
                    <th className="p-3">Characterization</th>
                    <th className="p-3 text-right">Volume (NGN)</th>
                    <th className="p-3">Provider Settlement Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBDD]">
                  <tr>
                    <td className="p-3 font-bold text-[#0F1F1C]">Gross Employer Funding</td>
                    <td className="p-3 text-[#5A6E68]">Inflow to conditional settlement account</td>
                    <td className="p-3 text-right font-mono font-bold tabular-nums">₦14,200,000</td>
                    <td className="p-3 text-[#0E5A46] font-semibold">100% Provider Matched</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F1F1C]">Worker Disbursed Compensation</td>
                    <td className="p-3 text-[#5A6E68]">Direct passthrough payout to workers</td>
                    <td className="p-3 text-right font-mono font-bold tabular-nums">₦11,850,000</td>
                    <td className="p-3 text-[#0E5A46] font-semibold">NIBSS Verified</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0E5A46]">TOURMS Service Revenue</td>
                    <td className="p-3 text-[#5A6E68]">Net platform fee earned (Non-passthrough)</td>
                    <td className="p-3 text-right font-mono font-bold text-[#0E5A46] tabular-nums">₦912,500</td>
                    <td className="p-3 text-[#0E5A46] font-semibold">Reconciled to Operating Account</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#8E5A18]">Undisbursed Escrow Liabilities</td>
                    <td className="p-3 text-[#5A6E68]">Active engagements under review</td>
                    <td className="p-3 text-right font-mono font-bold text-[#8E5A18] tabular-nums">₦2,350,000</td>
                    <td className="p-3 text-[#5A6E68]">Held in Virtual Reserve</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reconciliation Note */}
            <div className="p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1 text-[11px] text-[#5A6E68] leading-relaxed">
              <p className="font-bold text-[#0F1F1C]">Fiduciary Accounting Standard</p>
              <p>
                In compliance with strict platform accounting principles, TOURMS distinguishes customer pass-through
                funds from platform service revenue. Customer payments for worker compensation are not recognized as TOURMS
                revenue and remain restricted until authorized release.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Dispute Arbitration Modal */}
      <Modal
        isOpen={selectedDispute !== null}
        onClose={() => setSelectedDispute(null)}
        title="Dispute Arbitration & Resolution Determination"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-left">
          {selectedDispute && (
            <>
              <div className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1">
                <span className="font-mono font-bold text-[#C53030]">{selectedDispute.disputeReference}</span>
                <p className="font-bold text-[#0F1F1C]">{selectedDispute.jobTitle}</p>
                <p className="text-[11px] text-[#5A6E68]">
                  Amount at Stake: <strong>₦{selectedDispute.disputedAmountNaira.toLocaleString()}</strong>
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F1F1C]">Select Arbitration Determination:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 rounded border border-[#C4C8C5] cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'payout_worker'}
                      onChange={() => setResolutionDecision('payout_worker')}
                      className="text-[#0E5A46]"
                    />
                    <span>Authorize Full Payout to Worker (Deliverable verified)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded border border-[#C4C8C5] cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'refund_employer'}
                      onChange={() => setResolutionDecision('refund_employer')}
                      className="text-[#0E5A46]"
                    />
                    <span>Authorize Refund to Employer (Failure of essential condition)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded border border-[#C4C8C5] cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={resolutionDecision === 'split_50_50'}
                      onChange={() => setResolutionDecision('split_50_50')}
                      className="text-[#0E5A46]"
                    />
                    <span>Equitable Split / Partial Settlement (Mutual compromise)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F1F1C]">Arbitration Notes for Audit Log:</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={2}
                  placeholder="Record justification and evidence consulted..."
                  className="w-full rounded border border-[#C4C8C5] p-2 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleResolveDispute}>
                  Execute Determination
                </Button>
              </div>
            </>
          )}
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
