import React, { useState } from 'react';
import { EmployerProfile, VerificationStatus } from '../../types';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { Textarea } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { Building2, ShieldCheck, FileCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export interface AdminEmployerVerificationViewProps {
  employers: EmployerProfile[];
  onVerifyEmployer: (employerId: string, status: VerificationStatus, note: string) => void;
}

export const AdminEmployerVerificationView: React.FC<AdminEmployerVerificationViewProps> = ({
  employers,
  onVerifyEmployer
}) => {
  const { addToast } = useToast();
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerProfile>(employers[0]);
  const [reviewNote, setReviewNote] = useState('');

  const handleDecision = (status: VerificationStatus) => {
    onVerifyEmployer(selectedEmployer.id, status, reviewNote);
    addToast({
      type: status === 'verified' ? 'success' : 'info',
      title: 'Verification Recorded',
      message: `${selectedEmployer.companyName} marked as ${status}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left">
      <div className="pb-4 border-b border-[#C4C8C5]">
        <h1 className="text-xl font-bold text-[#0F1F1C]">
          Admin Employer CAC Verification (Screen 19)
        </h1>
        <p className="text-xs text-[#5A6E68] mt-0.5">
          Verify corporate incorporation and physical agricultural land rights. Never display as verified without an approved decision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employers List */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider mb-2">
            Employer Registry ({employers.length})
          </p>
          {employers.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployer(emp)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1 ${
                selectedEmployer.id === emp.id
                  ? 'border-[#0E5A46] bg-[#E7F3EF]'
                  : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0F1F1C]">{emp.companyName}</p>
                <StatusIndicator status={emp.verificationStatus as any} />
              </div>
              <p className="text-[#5A6E68]">RC: {emp.registrationNumber}</p>
              <p className="text-[#5A6E68]">{emp.location.state}, {emp.location.lga}</p>
            </div>
          ))}
        </div>

        {/* Selected Employer Inspection Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBEBDD]">
            <div>
              <h2 className="text-lg font-bold text-[#0F1F1C]">
                {selectedEmployer.companyName}
              </h2>
              <p className="text-xs text-[#5A6E68]">
                {selectedEmployer.businessType} · Contact: {selectedEmployer.contactPerson}
              </p>
            </div>
            <StatusIndicator status={selectedEmployer.verificationStatus as any} />
          </div>

          {/* Documentation Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Submitted Corporate Documents
            </h3>
            {selectedEmployer.verificationDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0E5A46]" />
                  <div>
                    <p className="font-bold text-[#0F1F1C]">{doc.title}</p>
                    <p className="text-[#5A6E68] text-[11px]">
                      Type: {doc.documentType} · Submitted {doc.submittedAt}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#0E5A46] font-semibold">
                  {doc.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Physical Location Evidence */}
          <div className="p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs space-y-1">
            <p className="font-bold text-[#0F1F1C]">Farm Site / Operational Facility:</p>
            <p className="text-[#3A4B47]">{selectedEmployer.location.farmSiteAddress}</p>
            <p className="text-[#5A6E68]">
              LGA: {selectedEmployer.location.lga} · State: {selectedEmployer.location.state}
            </p>
          </div>

          {/* Verification Decision Controls */}
          <div className="pt-4 border-t border-[#EBEBDD] space-y-3">
            <Textarea
              label="Audit Review Notes & CAC Verification Reference"
              rows={2}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. CAC Search Report confirmed active status on portal..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDecision('rejected')}
              >
                Reject CAC Verification
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => handleDecision('verified')}
              >
                Approve CAC Verification
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
