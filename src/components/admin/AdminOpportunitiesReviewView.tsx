import React, { useState } from 'react';
import { OpportunityListing, OpportunityStatus } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';
import { Award, ShieldCheck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

export interface AdminOpportunitiesReviewViewProps {
  opportunities: OpportunityListing[];
  onUpdateOpportunityStatus: (id: string, status: OpportunityStatus) => void;
}

export const AdminOpportunitiesReviewView: React.FC<AdminOpportunitiesReviewViewProps> = ({
  opportunities,
  onUpdateOpportunityStatus
}) => {
  const { addToast } = useToast();
  const [selectedOpp, setSelectedOpp] = useState<OpportunityListing>(opportunities[0]);

  const handleStatusChange = (status: OpportunityStatus) => {
    onUpdateOpportunityStatus(selectedOpp.id, status);
    addToast({
      type: 'success',
      title: 'Lifecycle Status Updated',
      message: `${selectedOpp.title} is now marked as ${status.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left">
      <div className="pb-4 border-b border-[#C4C8C5]">
        <h1 className="text-xl font-bold text-[#0F1F1C]">
          Admin Opportunities Review (Screen 21)
        </h1>
        <p className="text-xs text-[#5A6E68] mt-0.5">
          Lifecycle Pipeline: SUBMITTED → VERIFIED → PUBLISHED → EXPIRED. Never mark as verified without official source vetting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunity List */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider mb-2">
            Opportunity Submissions ({opportunities.length})
          </p>
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              onClick={() => setSelectedOpp(opp)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1 ${
                selectedOpp.id === opp.id
                  ? 'border-[#0E5A46] bg-[#E7F3EF]'
                  : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F1F1C] truncate max-w-[170px]">
                  {opp.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#EBEBDD] text-[#0F1F1C] rounded font-semibold uppercase">
                  {opp.status}
                </span>
              </div>
              <p className="text-[#8E5A18] font-medium">{opp.category}</p>
              <p className="text-[#5A6E68] text-[11px]">Provider: {opp.provider}</p>
            </div>
          ))}
        </div>

        {/* Selected Inspection Card */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBEBDD]">
            <div>
              <h2 className="text-lg font-bold text-[#0F1F1C]">{selectedOpp.title}</h2>
              <p className="text-xs text-[#8E5A18] font-semibold">
                {selectedOpp.category} · Provider: {selectedOpp.provider}
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#0F1F1C] text-white rounded font-bold uppercase">
              {selectedOpp.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
            <div>
              <span className="text-[#5A6E68] block">Geographic Scope:</span>
              <span className="font-bold text-[#0F1F1C]">{selectedOpp.locationScope}</span>
            </div>
            <div>
              <span className="text-[#5A6E68] block">Application Deadline:</span>
              <span className="font-bold text-[#0F1F1C]">{selectedOpp.deadline}</span>
            </div>
            <div>
              <span className="text-[#5A6E68] block">Source Verification:</span>
              <span className="font-bold text-[#0E5A46]">
                {selectedOpp.verificationSource ? 'Vetted' : 'Unconfirmed'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Programme Details
            </h3>
            <p className="text-xs text-[#3A4B47] leading-relaxed p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {selectedOpp.description}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Eligibility & Selection Requirements
            </h3>
            <ul className="text-xs text-[#3A4B47] space-y-1">
              {selectedOpp.eligibility.map((el, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46] mt-0.5 shrink-0" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="pt-4 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('submitted')}
              >
                Mark as Pending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('verified')}
              >
                Mark as Verified
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => handleStatusChange('published')}
            >
              Publish to Directory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
