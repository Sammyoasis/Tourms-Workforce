import React from 'react';
import { PaymentTransaction } from '../../types/payment';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TourmsLogo } from '../ui/TourmsLogo';
import { Printer, Download, CheckCircle2, ShieldCheck, Building2, User, ArrowDownRight } from 'lucide-react';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Settlement Receipt" maxWidth="lg">
      <div className="space-y-6 text-left p-1">
        {/* Printable Receipt Container */}
        <div className="bg-white border-2 border-[#0F1F1C] rounded-lg p-5 sm:p-7 space-y-6 shadow-sm print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#C4C8C5]">
            <div className="space-y-1">
              <TourmsLogo size="md" />
              <p className="text-[11px] font-semibold text-[#5A6E68] tracking-wider uppercase">
                TOURMS AGRO-SOLUTIONS · ENGAGEMENT SETTLEMENT ADVICE
              </p>
            </div>
            <div className="text-left sm:text-right text-xs">
              <span className="font-mono text-[#0E5A46] font-bold block text-sm">
                {transaction.transactionReference}
              </span>
              <span className="text-[#5A6E68] text-[11px]">
                Generated {transaction.timestamp}
              </span>
            </div>
          </div>

          {/* Status Badge Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E5A46]" />
              <span className="font-bold text-[#0E5A46]">
                {transaction.paymentStatus === 'confirmed' ? 'TRANSACTION CONFIRMED' : 'PROCESSING'}
              </span>
              <span className="text-[#5A6E68]">·</span>
              <span className="text-[#3A4B47] uppercase font-semibold">
                Settlement: {transaction.settlementStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#5A6E68]">
              Ref: {transaction.providerReference}
            </span>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A6E68] uppercase">
                <Building2 className="w-3 h-3 text-[#0E5A46]" />
                <span>Originating Party</span>
              </div>
              <p className="font-bold text-[#0F1F1C] text-sm">{transaction.senderParty}</p>
              <p className="text-[#5A6E68] text-[11px]">Commercial Agricultural Agribusiness</p>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A6E68] uppercase">
                <User className="w-3 h-3 text-[#0E5A46]" />
                <span>Beneficiary Party</span>
              </div>
              <p className="font-bold text-[#0F1F1C] text-sm">{transaction.recipientParty}</p>
              {transaction.settlementAccount ? (
                <p className="text-[#5A6E68] text-[11px]">
                  {transaction.settlementAccount.bankName} · {transaction.settlementAccount.accountNumber}
                </p>
              ) : (
                <p className="text-[#5A6E68] text-[11px]">TOURMS Designated Settlement Flow</p>
              )}
            </div>
          </div>

          {/* Engagement Details */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
              Associated Agricultural Engagement
            </h4>
            <div className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F1F1C]">{transaction.jobTitle}</span>
                <span className="font-mono text-[#0E5A46] font-semibold">{transaction.engagementReference}</span>
              </div>
              <p className="text-[#5A6E68] text-[11px]">{transaction.narration}</p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
              Financial Ledger Breakdown
            </h4>
            <div className="border border-[#C4C8C5] rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-[#C4C8C5] text-[10px] uppercase font-bold text-[#5A6E68]">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-right">Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBDD]">
                  <tr>
                    <td className="p-2.5 text-[#0F1F1C]">Gross Agreed Engagement Compensation</td>
                    <td className="p-2.5 text-right font-medium text-[#0F1F1C] tabular-nums">
                      ₦{transaction.grossAmountNaira.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#5A6E68]">Platform Service Fee (Configurable Standard)</td>
                    <td className="p-2.5 text-right font-medium text-[#5A6E68] tabular-nums">
                      ₦{transaction.feeAmountNaira.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF9F5] font-bold">
                    <td className="p-3 text-[#0F1F1C] text-sm">Net Settlement Amount</td>
                    <td className="p-3 text-right text-sm text-[#0E5A46] tabular-nums">
                      ₦{transaction.netAmountNaira.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal / Channel Notice */}
          <div className="p-3 bg-[#FAF9F5] rounded border border-[#EBEBDD] space-y-1 text-[11px] text-[#5A6E68] leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-[#0F1F1C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>Payment Channel & Compliance Record</span>
            </div>
            <p>
              Channel: <strong>{transaction.providerName}</strong> · Provider Session Reference: <code>{transaction.providerReference}</code>.
              This receipt is an electronic record generated in accordance with TOURMS Agro-Solutions verification protocols.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Receipt
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
