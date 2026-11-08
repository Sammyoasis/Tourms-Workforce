import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export interface FeeBreakdownCardProps {
  grossCompensationNaira: number;
  employerFeePercent?: number; // e.g. 5
  workerFeePercent?: number; // e.g. 0
  userPerspective?: 'worker' | 'employer' | 'admin';
  className?: string;
  isIllustrative?: boolean;
}

export const FeeBreakdownCard: React.FC<FeeBreakdownCardProps> = ({
  grossCompensationNaira,
  employerFeePercent = 5,
  workerFeePercent = 0,
  userPerspective = 'employer',
  className = '',
  isIllustrative = true
}) => {
  const employerFeeNaira = Math.round((grossCompensationNaira * employerFeePercent) / 100);
  const workerFeeNaira = Math.round((grossCompensationNaira * workerFeePercent) / 100);
  const totalEmployerFundingNaira = grossCompensationNaira + employerFeeNaira;
  const netWorkerPayoutNaira = grossCompensationNaira - workerFeeNaira;

  return (
    <div className={`bg-white rounded border border-[#C4C8C5] p-4 sm:p-5 text-left space-y-4 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
          <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
            Engagement Financial Breakdown
          </h3>
        </div>
        {isIllustrative && (
          <span className="text-[10px] text-[#8E5A18] font-medium bg-[#FFF8EE] px-2 py-0.5 rounded border border-[#E7D6BE]">
            Illustrative Model
          </span>
        )}
      </div>

      {/* Figures Breakdown */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#5A6E68]">Agreed Worker Gross Compensation:</span>
          <span className="font-semibold text-[#0F1F1C] tabular-nums">
            ₦{grossCompensationNaira.toLocaleString()}
          </span>
        </div>

        {/* Employer perspective */}
        <div className="flex items-center justify-between">
          <span className="text-[#5A6E68] flex items-center gap-1">
            <span>Employer Platform Service Fee ({employerFeePercent}%):</span>
          </span>
          <span className="font-semibold text-[#0F1F1C] tabular-nums">
            ₦{employerFeeNaira.toLocaleString()}
          </span>
        </div>

        {/* Worker Fee (if any) */}
        {workerFeePercent > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-[#5A6E68]">Worker Platform Fee ({workerFeePercent}%):</span>
            <span className="font-semibold text-[#C53030] tabular-nums">
              -₦{workerFeeNaira.toLocaleString()}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[#0E5A46]">
            <span>Worker Service Fee Deduction:</span>
            <span className="font-bold">₦0 (100% Subsidised / Free for Workers)</span>
          </div>
        )}

        {/* Highlights depending on user perspective */}
        <div className="pt-2.5 border-t border-[#EBEBDD] space-y-2">
          {userPerspective === 'employer' || userPerspective === 'admin' ? (
            <div className="flex items-baseline justify-between p-2.5 bg-[#FAF9F5] rounded border border-[#EBEBDD]">
              <div>
                <span className="text-xs font-bold text-[#0F1F1C] block">Total Funding Obligation:</span>
                <span className="text-[10px] text-[#5A6E68]">Required prior to engagement commencement</span>
              </div>
              <span className="text-base sm:text-lg font-extrabold text-[#0E5A46] tabular-nums">
                ₦{totalEmployerFundingNaira.toLocaleString()}
              </span>
            </div>
          ) : null}

          {userPerspective === 'worker' || userPerspective === 'admin' ? (
            <div className="flex items-baseline justify-between p-2.5 bg-[#F2F7F4] rounded border border-[#C2DDD3]">
              <div>
                <span className="text-xs font-bold text-[#0E5A46] block">Expected Net Payout:</span>
                <span className="text-[10px] text-[#5A6E68]">Amount transferred directly to your bank upon approval</span>
              </div>
              <span className="text-base sm:text-lg font-extrabold text-[#08382B] tabular-nums">
                ₦{netWorkerPayoutNaira.toLocaleString()}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Regulatory & Commercial Transparency Note */}
      <div className="p-2.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] flex items-start gap-2 text-[11px] text-[#5A6E68] leading-relaxed">
        <Info className="w-3.5 h-3.5 text-[#0E5A46] shrink-0 mt-0.5" />
        <p>
          <strong>Regulated Fee Schedule:</strong> Platform and processing charges are transparently accounted upfront. TOURMS conditional settlement is processed via licensed Nigerian financial infrastructure with direct automated bank disbursement.
        </p>
      </div>
    </div>
  );
};
