import React, { useState } from 'react';
import { WorkerProfile } from '../../types';
import { Button } from '../ui/Button';
import { StatusIndicator, EvidenceBadge } from '../ui/Badge';
import { SearchField } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { Users, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export interface AdminWorkerManagementViewProps {
  workers: WorkerProfile[];
  onVerifyWorker: (workerId: string, status: any) => void;
}

export const AdminWorkerManagementView: React.FC<AdminWorkerManagementViewProps> = ({
  workers,
  onVerifyWorker
}) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile>(workers[0]);

  const handleVerify = () => {
    onVerifyWorker(selectedWorker.id, 'verified');
    addToast({
      type: 'success',
      title: 'Worker Status Updated',
      message: `${selectedWorker.fullName} verified in capability registry.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      <div className="pb-4 border-b border-[#C4C8C5]">
        <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
          Admin Worker Management (Screen 20)
        </h1>
        <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
          Audit agricultural worker capability evidence, institutional certificates, and privacy protections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Roster */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider mb-2">
            Registered Profiles ({workers.length})
          </p>
          {workers.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedWorker(w)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1 ${
                selectedWorker.id === w.id
                  ? 'border-[#0E5A46] bg-[#E7F3EF]'
                  : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#0F1F1C]">{w.fullName}</p>
                <StatusIndicator status={w.verifiedStatus as any} />
              </div>
              <p className="text-[#0E5A46] font-medium truncate">{w.headline}</p>
              <p className="text-[#5A6E68]">{w.location.state}, {w.location.lga}</p>
            </div>
          ))}
        </div>

        {/* Selected Worker Capability Details */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBEBDD]">
            <div>
              <h2 className="text-lg font-bold text-[#0F1F1C]">
                {selectedWorker.fullName}
              </h2>
              <p className="text-xs text-[#0E5A46] font-semibold">
                {selectedWorker.headline}
              </p>
              <p className="text-xs text-[#5A6E68] mt-0.5">
                Location: {selectedWorker.location.state}, {selectedWorker.location.lga} · Availability: {selectedWorker.availability}
              </p>
            </div>
            <StatusIndicator status={selectedWorker.verifiedStatus as any} />
          </div>

          {/* Capabilities audit */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Documented Capabilities ({selectedWorker.capabilities.length})
            </h3>
            {selectedWorker.capabilities.map((cap) => (
              <div
                key={cap.id}
                className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F1F1C]">{cap.title}</span>
                  <EvidenceBadge level={cap.evidenceLevel} />
                </div>
                <p className="text-[#3A4B47]">{cap.description}</p>
              </div>
            ))}
          </div>

          {/* Institutional Credentials */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Education & Certifications
            </h3>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-[#0F1F1C]">
                {selectedWorker.education[0]?.qualification} — {selectedWorker.education[0]?.institution}
              </p>
              <p className="text-[#5A6E68]">
                {selectedWorker.certifications[0]?.name} ({selectedWorker.certifications[0]?.issuer})
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs text-[#5A6E68]">
            <p className="font-semibold text-[#0F1F1C]">Privacy Safeguard:</p>
            <p>Direct personal contacts (phone, email) are shielded until employer engagement is verified.</p>
          </div>

          <div className="pt-4 border-t border-[#EBEBDD] flex justify-end gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              onClick={handleVerify}
            >
              Verify Worker Credentials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
