import React, { useState, useMemo } from 'react';
import { JobListing, JobCategory, EmploymentType } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Select } from '../ui/Select';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { BottomSheet } from '../ui/Modal';
import { TourmsSymbol } from '../ui/TourmsLogo';
import {
  Filter,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Search,
  Briefcase,
  X,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

export interface JobsViewProps {
  jobs: JobListing[];
  onSelectJob: (jobId: string) => void;
  isMobilePreview?: boolean;
}

const CATEGORIES: JobCategory[] = [
  'Farm Operations',
  'Crop Production',
  'Livestock',
  'Fisheries & Aquaculture',
  'Processing',
  'Agribusiness',
  'Logistics',
  'Technology & Data',
  'Research & Development',
  'Administration & Support'
];

const QUICK_CATEGORIES = [
  'All',
  'Farm Operations',
  'Crop Production',
  'Livestock',
  'Agribusiness',
  'Processing',
  'Logistics',
  'Technology & Data'
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Seasonal',
  'Contract',
  'Apprenticeship'
];

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onSelectJob,
  isMobilePreview = false
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedLga, setSelectedLga] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available LGAs for current state
  const availableLgas = useMemo(() => {
    if (selectedState === 'all') return [];
    return getLgasForState(selectedState);
  }, [selectedState]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status !== 'approved') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesOrg = job.organisation.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchesSummary = job.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesSkills && !matchesSummary) {
          return false;
        }
      }

      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }

      if (selectedState !== 'all' && job.location.state !== selectedState) {
        return false;
      }

      if (selectedLga !== 'all' && job.location.lga !== selectedLga) {
        return false;
      }

      if (selectedType !== 'all' && job.employmentType !== selectedType) {
        return false;
      }

      if (verifiedOnly && !job.employerVerified) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedCategory, selectedState, selectedLga, selectedType, verifiedOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
    setSelectedLga('all');
    setSelectedType('all');
    setVerifiedOnly(false);
  };

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedState !== 'all' ? 1 : 0) +
    (selectedLga !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Header Banner */}
      <section className={`bg-white border-b border-[#C4C8C5] ${isMobilePreview ? 'py-8 px-5' : 'py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
              <TourmsSymbol size={16} />
              <span>TOURMS WORKFORCE</span>
              <span aria-hidden="true">·</span>
              <span>AGRICULTURAL EMPLOYMENT DISCOVERY</span>
            </div>

            <h1 className={`${isMobilePreview ? 'text-2xl' : 'text-2xl sm:text-4xl md:text-5xl'} font-extrabold text-[#0F1F1C] tracking-tight font-display break-words`}>
              FIND WORK IN AGRICULTURE.
            </h1>

            <p className={`${isMobilePreview ? 'text-sm' : 'text-sm sm:text-base md:text-lg'} text-[#3A4B47] max-w-3xl leading-relaxed`}>
              Direct connections between skilled agricultural professionals and vetted commercial agribusinesses across Nigeria.
            </p>
          </div>

          {/* Unified Search and Filter Bar */}
          <div className="bg-[#FAF9F5] sm:bg-white rounded-lg border border-[#C4C8C5] p-5 sm:p-6 md:p-7 shadow-sm space-y-4">
            {/* Main Bar: Keyword + Location + Category + More Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Keyword Search */}
              <div className="lg:col-span-5 min-w-0">
                <div className="relative flex items-center w-full">
                  <Search className="absolute left-4 h-4 w-4 text-[#3A4B47] pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, skill (e.g. Boom Sprayer), or keyword..."
                    className="w-full pl-11 pr-10 py-3 min-h-[48px] bg-white border border-[#C4C8C5] rounded text-sm text-[#0F1F1C] placeholder:text-[#5A6E68] focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3.5 text-xs text-[#5A6E68] hover:text-[#0F1F1C] p-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Location Filter (State) */}
              <div className="lg:col-span-3 min-w-0">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0E5A46] pointer-events-none z-10" />
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedLga('all');
                    }}
                    aria-label="Filter by Nigerian State"
                    className="w-full appearance-none rounded bg-white text-[#0F1F1C] border border-[#C4C8C5] text-sm min-h-[48px] pl-11 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46] cursor-pointer font-medium truncate"
                  >
                    <option value="all">All States (36 + FCT)</option>
                    {ALL_STATE_NAMES.map((st) => (
                      <option key={st} value={st}>
                        {st} State
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A4B47] pointer-events-none" />
                </div>
              </div>

              {/* Role Category Filter */}
              <div className="lg:col-span-3 min-w-0">
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0E5A46] pointer-events-none z-10" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Filter by Role Category"
                    className="w-full appearance-none rounded bg-white text-[#0F1F1C] border border-[#C4C8C5] text-sm min-h-[48px] pl-11 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E5A46] focus:border-[#0E5A46] cursor-pointer font-medium truncate"
                  >
                    <option value="all">All Role Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A4B47] pointer-events-none" />
                </div>
              </div>

              {/* More Filters Trigger */}
              <div className="lg:col-span-1 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="w-full min-h-[48px] px-3.5 border border-[#C4C8C5] rounded bg-white hover:bg-[#F7F7EE] text-[#0F1F1C] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="More filters (LGA, Employment Type, Verified Only)"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#0E5A46]" />
                  <span className="lg:hidden">More</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-[#0E5A46] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Sector Chips + Verified Toggle + Quick Reset */}
            <div className="pt-3 border-t border-[#EBEBDD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider shrink-0 pr-1 hidden sm:inline">
                  Roles:
                </span>
                {QUICK_CATEGORIES.map((cat) => {
                  const isSelected = (cat === 'All' && selectedCategory === 'all') || selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
                      className={`text-xs px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-[#0E5A46] text-white font-semibold shadow-2xs'
                          : 'bg-white sm:bg-[#F7F7EE] text-[#3A4B47] hover:bg-[#EBEBDD] hover:text-[#0F1F1C] border border-[#C4C8C5]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                <label className="flex items-center gap-2 text-xs text-[#0F1F1C] font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4 cursor-pointer"
                  />
                  <span>Verified Employers</span>
                  <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
                </label>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-[#C53030] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="pt-3 border-t border-[#EBEBDD] flex flex-wrap items-center gap-2 text-xs text-[#5A6E68]">
                <span className="font-bold text-[#0F1F1C] uppercase tracking-wider">Active:</span>
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    Keyword: <span className="font-semibold">"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-[#C53030] p-0.5" aria-label="Clear keyword filter">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    Role: <span className="font-semibold">{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-[#C53030] p-0.5" aria-label="Clear role filter">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedState !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    State: <span className="font-semibold">{selectedState}</span>
                    <button
                      onClick={() => {
                        setSelectedState('all');
                        setSelectedLga('all');
                      }}
                      className="hover:text-[#C53030] p-0.5"
                      aria-label="Clear state filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedLga !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    LGA: <span className="font-semibold">{selectedLga}</span>
                    <button onClick={() => setSelectedLga('all')} className="hover:text-[#C53030] p-0.5" aria-label="Clear LGA filter">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    Type: <span className="font-semibold">{selectedType}</span>
                    <button onClick={() => setSelectedType('all')} className="hover:text-[#C53030] p-0.5" aria-label="Clear type filter">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] rounded text-[#0F1F1C]">
                    <span>Verified Employers</span>
                    <button onClick={() => setVerifiedOnly(false)} className="hover:text-[#C53030] p-0.5" aria-label="Clear verified filter">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#C53030] hover:underline ml-1 font-semibold cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className={`max-w-7xl mx-auto ${isMobilePreview ? 'px-4 py-6' : 'px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12'}`}>
        <div className={isMobilePreview ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8'}>
          {/* Desktop Filter Sidebar - only rendered when not in mobile preview */}
          {!isMobilePreview && (
            <aside className="hidden lg:block space-y-6 bg-white p-6 rounded border border-[#C4C8C5] h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBDD]">
              <div className="flex items-center gap-2 text-[#0F1F1C] font-bold text-sm">
                <Filter className="w-4 h-4 text-[#0E5A46]" />
                <span>Filters</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#C53030] hover:underline font-semibold cursor-pointer"
                >
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <Select
                label="Sector / Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Agricultural Sectors' },
                  ...CATEGORIES.map((cat) => ({ value: cat, label: cat }))
                ]}
              />
            </div>

            {/* State Filter */}
            <div className="space-y-1.5">
              <Select
                label="State (36 States & FCT)"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedLga('all');
                }}
                options={[
                  { value: 'all', label: 'All Nigerian States' },
                  ...ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))
                ]}
              />
            </div>

            {/* LGA Filter (dynamically populated) */}
            {selectedState !== 'all' && availableLgas.length > 0 && (
              <div className="space-y-1.5 animate-in fade-in">
                <Select
                  label={`LGA in ${selectedState}`}
                  value={selectedLga}
                  onChange={(e) => setSelectedLga(e.target.value)}
                  options={[
                    { value: 'all', label: `All LGAs in ${selectedState}` },
                    ...availableLgas.map((lga) => ({ value: lga, label: lga }))
                  ]}
                />
              </div>
            )}

            {/* Employment Type */}
            <div className="space-y-1.5">
              <Select
                label="Employment Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Employment Types' },
                  ...EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))
                ]}
              />
            </div>

            {/* Verified Employer Checkbox */}
            <div className="pt-2 border-t border-[#EBEBDD]">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#0F1F1C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
                  <span>Verified Employers Only</span>
                </span>
              </label>
            </div>
          </aside>
          )}

          {/* Job Listings List (Desktop & Mobile) */}
          <main className={`${isMobilePreview ? 'w-full' : 'lg:col-span-3'} space-y-4`}>
            <div className="flex items-center justify-between text-xs text-[#5A6E68] pb-2 border-b border-[#C4C8C5]">
              <span>
                Showing <strong className="text-[#0F1F1C] tabular-nums">{filteredJobs.length}</strong> active job demand{filteredJobs.length === 1 ? '' : 's'}
              </span>
              {activeFilterCount > 0 && (
                <span className="text-[#0E5A46] font-medium hidden sm:inline">
                  {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} applied
                </span>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <EmptyState
                title="No Matching Agricultural Jobs Found"
                description="Try broadening your state, category, or keyword search criteria to find available demand."
                actionLabel="Reset All Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="bg-white border border-[#C4C8C5] rounded p-6 sm:p-7 md:p-8 hover:border-[#0E5A46] transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                  >
                    <div className="space-y-3 sm:space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#5A6E68]">
                          {job.category}
                        </span>
                        <StatusIndicator
                          status={job.employerVerified ? 'verified' : 'unverified'}
                          customLabel={job.employerVerified ? 'Verified Employer' : 'Unverified'}
                        />
                      </div>

                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                          {job.title}
                        </h2>
                        <p className="text-sm font-semibold text-[#08382B] mt-1">
                          {job.organisation}
                        </p>
                      </div>

                      {/* Metadata Row (Clean unboxed text with separators - Zero-Pill discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#5A6E68]">
                        <span className="flex items-center gap-1 font-medium text-[#0F1F1C]">
                          <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                          <span>{job.location.state}, {job.location.lga}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{job.employmentType}</span>
                        {job.duration && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[160px] sm:max-w-none">{job.duration}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="text-[#8E5A18] font-bold tabular-nums">
                          ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                        </span>
                      </div>

                      <p className="text-sm text-[#3A4B47] leading-relaxed line-clamp-2 pt-1">
                        {job.summary}
                      </p>

                      {/* Skills List */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5 text-xs text-[#5A6E68]">
                          <span className="font-semibold text-[#0F1F1C]">Skills:</span>
                          {job.skills.map((skill, idx) => (
                            <React.Fragment key={skill}>
                              <span>{skill}</span>
                              {idx < job.skills.length - 1 && <span aria-hidden="true">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#EBEBDD] mt-5 flex items-center justify-between text-xs">
                      <span className="text-[#5A6E68]">Posted {job.postedDate}</span>
                      <span className="font-bold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <BottomSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Job Opportunities"
      >
        <div className="space-y-4 text-left pb-4">
          <Select
            label="Sector / Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All Agricultural Sectors' },
              ...CATEGORIES.map((cat) => ({ value: cat, label: cat }))
            ]}
          />

          <Select
            label="State (36 States & FCT)"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLga('all');
            }}
            options={[
              { value: 'all', label: 'All Nigerian States' },
              ...ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))
            ]}
          />

          {selectedState !== 'all' && availableLgas.length > 0 && (
            <Select
              label={`LGA in ${selectedState}`}
              value={selectedLga}
              onChange={(e) => setSelectedLga(e.target.value)}
              options={[
                { value: 'all', label: `All LGAs in ${selectedState}` },
                ...availableLgas.map((lga) => ({ value: lga, label: lga }))
              ]}
            />
          )}

          <Select
            label="Employment Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: 'all', label: 'All Employment Types' },
              ...EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))
            ]}
          />

          <label className="flex items-center gap-2.5 text-xs font-semibold text-[#0F1F1C] cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
              <span>Verified Employers Only</span>
            </span>
          </label>

          <div className="pt-3 flex items-center gap-2.5">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => setMobileFilterOpen(false)}
            >
              Show {filteredJobs.length} Results
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
