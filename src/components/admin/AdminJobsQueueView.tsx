import React, { useState } from 'react';
import { JobListing } from '../../types';
import { Button } from '../ui/Button';
import { SearchField } from '../ui/Input';
import { Select } from '../ui/Select';
import { StatusIndicator } from '../ui/Badge';
import { Clock, Filter, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface AdminJobsQueueViewProps {
  jobs: JobListing[];
  onSelectJobForReview: (jobId: string) => void;
}

export const AdminJobsQueueView: React.FC<AdminJobsQueueViewProps> = ({
  jobs,
  onSelectJobForReview
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('awaiting_review');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = jobs.filter((job) => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!job.title.toLowerCase().includes(q) && !job.organisation.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl overflow-x-hidden min-w-0 break-words">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
            Agribusiness Job Verification Queue
          </h1>
          <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
            Review submitted employment requirements prior to public indexation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'awaiting_review', label: 'Awaiting Review Only' },
              { value: 'approved', label: 'Approved & Published' },
              { value: 'changes_requested', label: 'Changes Requested' },
              { value: 'rejected', label: 'Rejected' }
            ]}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <SearchField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter queue by job title or employer..."
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded border border-[#C4C8C5] overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EBEBDD] text-[#0F1F1C] border-b border-[#C4C8C5] font-bold">
            <tr>
              <th className="p-3.5">Job Title & Sector</th>
              <th className="p-3.5">Organisation</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Compensation</th>
              <th className="p-3.5">Submitted</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBDD]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#5A6E68]">
                  No job postings match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr key={job.id} className="hover:bg-[#F7F7EE] transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-[#0F1F1C]">{job.title}</p>
                    <p className="text-[#5A6E68] text-[11px]">{job.category}</p>
                  </td>
                  <td className="p-3.5 font-medium">
                    <div className="flex items-center gap-1">
                      <span>{job.organisation}</span>
                      {job.employerVerified && (
                        <span title="CAC Verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-[#5A6E68]">
                    {job.location.state}, {job.location.lga}
                  </td>
                  <td className="p-3.5 font-bold tabular-nums text-[#8E5A18]">
                    ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                  </td>
                  <td className="p-3.5 text-[#5A6E68] tabular-nums">{job.postedDate}</td>
                  <td className="p-3.5">
                    <StatusIndicator status={job.status as any} />
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => onSelectJobForReview(job.id)}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
