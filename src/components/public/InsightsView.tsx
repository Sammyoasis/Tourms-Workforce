import React, { useState } from 'react';
import { InsightArticle, InsightCategory } from '../../types';
import { SearchField } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TourmsSymbol } from '../ui/TourmsLogo';
import { Clock, ArrowRight } from 'lucide-react';

export interface InsightsViewProps {
  insights: InsightArticle[];
  isMobilePreview?: boolean;
}

const CATEGORIES: InsightCategory[] = [
  'Article',
  'Research Brief',
  'Explainer',
  'Field Notes',
  'Industry Analysis',
  'Guide',
  'Career Intelligence',
  'Technology & Data'
];

export const InsightsView: React.FC<InsightsViewProps> = ({
  insights,
  isMobilePreview = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  const filteredArticles = insights.filter((art) => {
    if (art.status !== 'published') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = art.title.toLowerCase().includes(q);
      const matchesExcerpt = art.excerpt.toLowerCase().includes(q);
      const matchesAuthor = art.author.name.toLowerCase().includes(q);
      if (!matchesTitle && !matchesExcerpt && !matchesAuthor) return false;
    }
    if (selectedCategory !== 'all' && art.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Header Banner */}
      <section className={`bg-white border-b border-[#C4C8C5] ${isMobilePreview ? 'py-6 px-4' : 'py-6 sm:py-10 md:py-12 px-3.5 sm:px-6 lg:px-8'}`}>
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
            <TourmsSymbol size={16} />
            <span>EDITORIAL & INTELLIGENCE</span>
            <span aria-hidden="true">·</span>
            <span>AGRONOMIC KNOWLEDGE BASE</span>
          </div>

          <h1 className={`${isMobilePreview ? 'text-xl' : 'text-xl sm:text-3xl md:text-4xl'} font-extrabold text-[#0F1F1C] tracking-tight font-display break-words`}>
            FIELD INSIGHTS & RESEARCH.
          </h1>

          <p className={`${isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm md:text-base'} text-[#3A4B47] max-w-2xl leading-relaxed break-words`}>
            Evidence-backed agricultural analysis, post-harvest engineering, irrigation economics, and supply chain telemetry from practitioners across Nigeria.
          </p>

          <div className="pt-1 sm:pt-2 max-w-3xl flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="flex-1 min-w-0">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search research briefs or field notes..."
              />
            </div>
            <div className={isMobilePreview ? 'w-full' : 'sm:w-64'}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Formats' },
                  ...CATEGORIES.map((c) => ({ value: c, label: c }))
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <div className={`max-w-7xl mx-auto ${isMobilePreview ? 'px-4 py-6' : 'px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12'}`}>
        <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'md:grid-cols-2'} gap-4 sm:gap-6 md:gap-8`}>
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between shadow-2xs group overflow-hidden break-words"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6E68]">
                  <span className="font-semibold text-[#0E5A46]">{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readingTimeMinutes} min</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{art.publishedDate}</span>
                </div>

                <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#3A4B47] leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>

                {/* Author attribution */}
                <div className="pt-1.5 flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBEBDD] flex items-center justify-center text-[#0E5A46] font-bold text-xs shrink-0">
                    {art.author.name.charAt(0)}
                  </div>
                  <div className="text-xs min-w-0">
                    <p className="font-bold text-[#0F1F1C] truncate">{art.author.name}</p>
                    <p className="text-[#5A6E68] text-[11px] truncate max-w-[220px] sm:max-w-xs">{art.author.affiliation}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-[#EBEBDD] mt-4 sm:mt-6 flex items-center justify-between text-xs">
                <span className="text-[#5A6E68] text-[11px]">Practitioner Research</span>
                <span className="font-semibold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
                  <span>Read Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          description={`${activeArticle.category} · ${activeArticle.readingTimeMinutes} min read · Published ${activeArticle.publishedDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-left">
            {/* Author Box */}
            <div className="p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] flex items-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0E5A46] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {activeArticle.author.name.charAt(0)}
              </div>
              <div className="text-xs min-w-0">
                <p className="font-bold text-[#0F1F1C] text-xs sm:text-sm">{activeArticle.author.name}</p>
                <p className="text-[#08382B] font-medium">{activeArticle.author.role}</p>
                <p className="text-[#5A6E68] mt-0.5 truncate">{activeArticle.author.affiliation}</p>
              </div>
            </div>

            {/* Article Body Prose */}
            <div className="space-y-3.5 text-xs sm:text-sm text-[#3A4B47] leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Citations & Evidence */}
            {activeArticle.citations && activeArticle.citations.length > 0 && (
              <div className="p-3 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1.5 text-xs">
                <p className="font-bold text-[#0F1F1C] uppercase tracking-wider text-[11px]">
                  Citations & Technical References
                </p>
                <ul className="space-y-1 text-[#5A6E68] text-[11px]">
                  {activeArticle.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-mono text-[#0E5A46] shrink-0">[{i + 1}]</span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveArticle(null)}>
                Close Reader
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
