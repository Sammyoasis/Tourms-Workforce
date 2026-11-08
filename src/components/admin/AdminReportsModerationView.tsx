import React, { useState } from 'react';
import { ModerationReport } from '../../types';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface AdminReportsModerationViewProps {
  reports: ModerationReport[];
  onResolveReport: (id: string, status: any, notes: string) => void;
}

export const AdminReportsModerationView: React.FC<AdminReportsModerationViewProps> = ({
  reports,
  onResolveReport
}) => {
  const { addToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ModerationReport>(reports[0]);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (status: 'resolved' | 'dismissed') => {
    onResolveReport(selectedReport.id, status, resolutionNotes);
    addToast({
      type: 'success',
      title: 'Incident Resolved',
      message: `Report #${selectedReport.id} marked as ${status}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      <div className="pb-4 border-b border-[#C4C8C5]">
        <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
          Safety, Compliance & Trust Moderation
        </h1>
        <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
          Structured incident management: Severity, Priority, Assigned Owner, and Audit Logging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports Queue */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider mb-2">
            Incident Queue ({reports.length})
          </p>
          {reports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1 ${
                selectedReport.id === rep.id
                  ? 'border-[#C53030] bg-[#FFF5F5]'
                  : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#C53030] font-bold">
                  [{rep.priority}] {rep.severity.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-[#5A6E68] uppercase">
                  {rep.status}
                </span>
              </div>
              <p className="font-bold text-[#0F1F1C] truncate">{rep.targetTitle}</p>
              <p className="text-[#5A6E68] text-[11px] truncate">{rep.reason}</p>
            </div>
          ))}
        </div>

        {/* Selected Incident Resolution Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBEBDD]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 bg-[#C53030] text-white rounded font-bold">
                  {selectedReport.priority}
                </span>
                <h2 className="text-base font-bold text-[#0F1F1C]">
                  {selectedReport.targetTitle}
                </h2>
              </div>
              <p className="text-xs text-[#5A6E68] mt-1">
                Target Type: <strong className="text-[#0F1F1C]">{selectedReport.targetType.toUpperCase()}</strong> · ID: {selectedReport.targetId}
              </p>
            </div>
            <span className="font-mono text-xs font-bold uppercase text-[#0F1F1C]">
              Status: {selectedReport.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
            <div>
              <span className="text-[#5A6E68] block">Reported By:</span>
              <span className="font-bold text-[#0F1F1C]">{selectedReport.reportedBy}</span>
            </div>
            <div>
              <span className="text-[#5A6E68] block">Timestamp:</span>
              <span className="font-bold text-[#0F1F1C]">{selectedReport.reportedAt}</span>
            </div>
            <div>
              <span className="text-[#5A6E68] block">Assigned Investigator:</span>
              <span className="font-bold text-[#0E5A46]">{selectedReport.assignedTo || 'Unassigned'}</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-[#0F1F1C] uppercase tracking-wider">
              Reported Incident Reason
            </h3>
            <p className="p-3 bg-[#FFF5F5] rounded border border-[#C53030]/20 text-[#3A4B47] leading-relaxed">
              {selectedReport.reason}
            </p>
          </div>

          {selectedReport.resolutionNotes && (
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-[#0E5A46] uppercase tracking-wider">
                Prior Resolution Notes
              </h3>
              <p className="p-3 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-[#08382B]">
                {selectedReport.resolutionNotes}
              </p>
            </div>
          )}

          {/* Resolution Form */}
          <div className="pt-4 border-t border-[#EBEBDD] space-y-3">
            <Textarea
              label="Investigation Findings & Enforcement Notes"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Detail actions taken (e.g. Account suspended, post removed, false alarm dismissed)..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve('dismissed')}
              >
                Dismiss Report
              </Button>
              <Button
                variant="destructive"
                size="sm"
                leftIcon={<ShieldAlert className="w-4 h-4" />}
                onClick={() => handleResolve('resolved')}
              >
                Enforce Policy & Resolve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
