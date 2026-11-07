import React, { useState } from 'react';
import { InsightArticle, InsightStatus } from '../../types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { BookOpen, CheckCircle2, Clock, Edit3, Send } from 'lucide-react';

export interface AdminContentManagementViewProps {
  insights: InsightArticle[];
  onUpdateStatus: (id: string, status: InsightStatus) => void;
}

export const AdminContentManagementView: React.FC<AdminContentManagementViewProps> = ({
  insights,
  onUpdateStatus
}) => {
  const { addToast } = useToast();
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle>(insights[0]);

  const handleStatusChange = (status: InsightStatus) => {
    onUpdateStatus(selectedArticle.id, status);
    addToast({
      type: 'success',
      title: 'Editorial Lifecycle Updated',
      message: `"${selectedArticle.title}" transitioned to ${status.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      <div className="pb-4 border-b border-[#C4C8C5]">
        <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
          Admin Insights & Content Management (Screen 22)
        </h1>
        <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
          Editorial Lifecycle: DRAFT → IN REVIEW → APPROVED → SCHEDULED/PUBLISHED → ARCHIVED. Grounded knowledge only.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editorial Articles Roster */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider mb-2">
            Knowledge Articles ({insights.length})
          </p>
          {insights.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1 ${
                selectedArticle.id === art.id
                  ? 'border-[#0E5A46] bg-[#E7F3EF]'
                  : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F1F1C] truncate max-w-[170px]">
                  {art.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#EBEBDD] text-[#0F1F1C] rounded font-semibold uppercase">
                  {art.status}
                </span>
              </div>
              <p className="text-[#0E5A46] font-medium">{art.category}</p>
              <p className="text-[#5A6E68] text-[11px]">{art.author.name}</p>
            </div>
          ))}
        </div>

        {/* Selected Article Editorial Review */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EBEBDD]">
            <div>
              <h2 className="text-lg font-bold text-[#0F1F1C]">
                {selectedArticle.title}
              </h2>
              <p className="text-xs text-[#5A6E68]">
                {selectedArticle.category} · Author: {selectedArticle.author.name} ({selectedArticle.author.affiliation})
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 bg-[#0F1F1C] text-white rounded font-bold uppercase">
              {selectedArticle.status}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Abstract & Excerpt
            </h3>
            <p className="text-xs text-[#3A4B47] leading-relaxed p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {selectedArticle.excerpt}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Body Excerpt (Full Content)
            </h3>
            <div className="space-y-2 text-xs text-[#3A4B47] leading-relaxed max-h-48 overflow-y-auto p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
              {selectedArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Editorial Lifecycle Action Controls */}
          <div className="pt-4 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('in_review')}
              >
                Request Editorial Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('approved')}
              >
                Approve Draft
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => handleStatusChange('published')}
            >
              Publish to Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
