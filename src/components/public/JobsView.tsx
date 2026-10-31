import React, { useState, useMemo } from 'react';
import { JobListing, JobCategory, EmploymentType } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { SearchField } from '../ui/Input';
import { Select } from '../ui/Select';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { BottomSheet } from '../ui/Modal';
import { Filter, MapPin, Briefcase, SlidersHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';

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
      // Status filter: show approved or public active
      if (job.status !== 'approved') return false;

      // Query filter
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

      // Category filter
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }

      // State filter
      if (selectedState !== 'all' && job.location.state !== selectedState) {
        return false;
      }

      // LGA filter
      if (selectedLga !== 'all' && job.location.lga !== selectedLga) {
        return false;
      }

      // Employment type
      if (selectedType !== 'all' && job.employmentType !== selectedType) {
        return false;
      }

      // Verified only
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
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedState !== 'all' ? 1 : 0) +
    (selectedLga !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className={`w-full text-left ${isMobilePreview ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]' : ''}`}>
      {/* Header Banner */}
      <section className="bg-white border-b border-[#C4C8C5] py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
            <span>TOURMS WORKFORCE</span>
            <span aria-hidden="true">·</span>
            <span>EMPLOYMENT DISCOVERY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F1F1C] tracking-tight font-display">
            FIND WORK IN AGRICULTURE.
          </h1>

          <p className="text-sm md:text-base text-[#3A4B47] max-w-2xl leading-relaxed">
            Direct connections between skilled agricultural professionals and vetted agribusinesses across Nigeria.
          </p>

          {/* Search Input Bar */}
          <div className="pt-2 max-w-3xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search by role, skill (e.g. Boom Sprayer), or keyword..."
              />
            </div>
            {/* Mobile Filter Button */}
            <div className="sm:hidden flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => setMobileFilterOpen(true)}
              >
                <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
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

          {/* Job Listings List (Desktop & Mobile) */}
          <main className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#5A6E68] pb-2 border-b border-[#C4C8C5]">
              <span>
                Showing <strong className="text-[#0F1F1C] tabular-nums">{filteredJobs.length}</strong> active job demand{filteredJobs.length === 1 ? '' : 's'}
              </span>
              {activeFilterCount > 0 && (
                <span className="text-[#0E5A46] font-medium hidden sm:inline">
                  Filters applied
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
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#0E5A46] transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
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
                        <h2 className="text-lg font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                          {job.title}
                        </h2>
                        <p className="text-xs font-semibold text-[#08382B] mt-0.5">
                          {job.organisation}
                        </p>
                      </div>

                      {/* Metadata Row (Clean unboxed text with separators - Zero-Pill discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
                        <span className="flex items-center gap-1 font-medium text-[#0F1F1C]">
                          <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                          <span>{job.location.state}, {job.location.lga}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{job.employmentType}</span>
                        {job.duration && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{job.duration}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="text-[#8E5A18] font-bold tabular-nums">
                          ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                        </span>
                      </div>

                      <p className="text-xs text-[#3A4B47] leading-relaxed line-clamp-2 pt-1">
                        {job.summary}
                      </p>

                      {/* Skills List */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[11px] text-[#5A6E68]">
                          <span className="font-semibold text-[#0F1F1C]">Required:</span>
                          {job.skills.map((skill, idx) => (
                            <React.Fragment key={skill}>
                              <span>{skill}</span>
                              {idx < job.skills.length - 1 && <span aria-hidden="true">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs">
                      <span className="text-[#5A6E68]">Posted {job.postedDate}</span>
                      <span className="font-semibold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
                        <span>View Role Details & Apply</span>
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
        <div className="space-y-5 text-left pb-4">
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

          <label className="flex items-center gap-2.5 text-sm font-semibold text-[#0F1F1C] cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-5 h-5 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
              <span>Verified Employers Only</span>
            </span>
          </label>

          <div className="pt-4 flex items-center gap-3">
            <Button
              variant="primary"
              className="w-full"
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
