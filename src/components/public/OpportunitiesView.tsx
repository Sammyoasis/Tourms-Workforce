import React, { useState, useMemo } from 'react';
import { OpportunityListing, OpportunityCategory } from '../../types';
import { SearchField } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { TourmsSymbol } from '../ui/TourmsLogo';
import { Award, Calendar, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface OpportunitiesViewProps {
  opportunities: OpportunityListing[];
  isMobilePreview?: boolean;
}

const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  'Scholarship',
  'Grant',
  'Loan',
  'Fellowship',
  'Competition',
  'Training Programme',
  'Internship',
  'Research Opportunity',
  'Event',
  'Funding Call',
  'Professional Development',
  'Institutional Programme'
];

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  isMobilePreview = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityListing | null>(null);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.status !== 'published') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesProvider = opp.provider.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesDesc) return false;
      }

      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedCategory]);

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Banner */}
      <section className={`bg-white border-b border-[#C4C8C5] ${isMobilePreview ? 'py-8 px-5' : 'py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8'}`}>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8E5A18] tracking-widest uppercase">
            <TourmsSymbol size={16} />
            <span>PROGRAMMES & CAPITAL</span>
            <span aria-hidden="true">·</span>
            <span>NOT EMPLOYMENT DEMAND</span>
          </div>

          <h1 className={`${isMobilePreview ? 'text-2xl' : 'text-2xl sm:text-4xl md:text-5xl'} font-extrabold text-[#0F1F1C] tracking-tight font-display break-words`}>
            AGRICULTURAL OPPORTUNITIES.
          </h1>

          <p className={`${isMobilePreview ? 'text-sm' : 'text-sm sm:text-base md:text-lg'} text-[#3A4B47] max-w-3xl leading-relaxed`}>
            Verified scholarships, concessionary grants, fellowships, competitions, and developmental funding pathways shaping Nigerian agriculture.
          </p>

          {/* Search & Category Filter */}
          <div className="pt-2 sm:pt-4 max-w-3xl flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search grants, scholarships, or fellowships..."
              />
            </div>
            <div className={isMobilePreview ? 'w-full' : 'sm:w-72'}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...OPPORTUNITY_CATEGORIES.map((c) => ({ value: c, label: c }))
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Opportunities */}
      <div className={`max-w-7xl mx-auto ${isMobilePreview ? 'px-5 py-8' : 'px-4 sm:px-6 lg:px-8 py-10 sm:py-16'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#5A6E68] pb-3 border-b border-[#C4C8C5] mb-6 sm:mb-8">
          <span>
            Displaying <strong className="text-[#0F1F1C] tabular-nums">{filteredOpportunities.length}</strong> verified programme{filteredOpportunities.length === 1 ? '' : 's'}
          </span>
          <span className="text-[#0E5A46] font-semibold text-xs sm:text-sm">
            Sources Vetted by Editorial Verification Desk
          </span>
        </div>

        {filteredOpportunities.length === 0 ? (
          <EmptyState
            title="No Opportunities Match Your Criteria"
            description="Clear your keyword or category filter to inspect all active funding calls and scholarships."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 sm:gap-8`}>
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                onClick={() => setSelectedOpp(opp)}
                className="bg-white border border-[#C4C8C5] rounded p-6 sm:p-7 md:p-8 hover:border-[#C98A3A] transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-[#8E5A18]">{opp.category}</span>
                    <span className="text-[#5A6E68] flex items-center gap-1.5 text-xs">
                      <Calendar className="w-4 h-4" />
                      <span>{opp.deadline}</span>
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C] group-hover:text-[#8E5A18] transition-colors leading-snug">
                    {opp.title}
                  </h2>

                  <p className="text-sm font-semibold text-[#08382B]">{opp.provider}</p>

                  <p className="text-sm text-[#3A4B47] line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Highlights (Zero-Pill clean inline text) */}
                  <div className="pt-2 text-xs sm:text-sm text-[#5A6E68] space-y-1.5">
                    <p className="truncate">
                      <strong className="text-[#0F1F1C]">Scope:</strong> {opp.locationScope}
                    </p>
                    {opp.benefits[0] && (
                      <p className="truncate">
                        <strong className="text-[#0F1F1C]">Benefit:</strong> {opp.benefits[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-5 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-xs text-[#5A6E68]">Source Verified</span>
                  <span className="font-bold text-[#8E5A18] group-hover:underline">
                    View Requirements →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <Modal
          isOpen={!!selectedOpp}
          onClose={() => setSelectedOpp(null)}
          title={selectedOpp.title}
          description={`Administered by ${selectedOpp.provider}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-left">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
              <div>
                <span className="text-[#5A6E68] text-[11px] block">Category:</span>
                <span className="font-bold text-[#8E5A18] truncate block">{selectedOpp.category}</span>
              </div>
              <div>
                <span className="text-[#5A6E68] text-[11px] block">Deadline:</span>
                <span className="font-bold text-[#0F1F1C] block">{selectedOpp.deadline}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#5A6E68] text-[11px] block">Geographic Scope:</span>
                <span className="font-bold text-[#0F1F1C] truncate block">{selectedOpp.locationScope}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1.5">
                Programme Description
              </h3>
              <p className="text-xs sm:text-sm text-[#3A4B47] leading-relaxed">
                {selectedOpp.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1.5">
                Eligibility Criteria
              </h3>
              <ul className="space-y-1.5 text-xs text-[#3A4B47]">
                {selectedOpp.eligibility.map((el, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46] mt-0.5 shrink-0" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider mb-1.5">
                Key Benefits & Financing
              </h3>
              <ul className="space-y-1.5 text-xs text-[#3A4B47]">
                {selectedOpp.benefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3A] mt-1.5 shrink-0" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedOpp.verificationSource && (
              <div className="p-3 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs text-[#08382B]">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
                  <span>Verified Source Reference</span>
                </p>
                <p className="text-[11px] text-[#3A4B47] mt-1">
                  {selectedOpp.verificationSource}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-[#EBEBDD]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOpp(null)}
              >
                Close
              </Button>
              <a
                href={selectedOpp.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0E5A46] text-white text-xs font-semibold rounded hover:bg-[#0A4535] min-h-[44px]"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
