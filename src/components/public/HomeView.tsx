import React from 'react';
import { ArrowRight, Briefcase, Award, BookOpen, MapPin } from 'lucide-react';
import { JobListing, OpportunityListing, InsightArticle } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TourmsSymbol, TourmsFrequencyRhythm } from '../ui/TourmsLogo';

export interface HomeViewProps {
  onNavigate: (path: string) => void;
  featuredJobs: JobListing[];
  featuredOpportunities: OpportunityListing[];
  featuredInsights: InsightArticle[];
  isMobilePreview?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  featuredJobs,
  featuredOpportunities,
  featuredInsights,
  isMobilePreview = false
}) => {
  // Mobile-specific preview branch: single-column with comfortable spacing & touch targets
  if (isMobilePreview) {
    return (
      <div className="w-full text-left overflow-x-hidden bg-[#F7F7EE] select-text">
        {/* Mobile Hero Section */}
        <section className="relative overflow-hidden pt-10 pb-12 px-5 border-b border-[#C4C8C5]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0E5A46_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="text-center space-y-5 relative z-10 max-w-sm mx-auto">
            {/* Section Kicker */}
            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
              <TourmsSymbol size={15} />
              <span>TOURMS AGRO-SOLUTIONS</span>
              <span aria-hidden="true">·</span>
              <span>NIGERIA-FIRST</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1F1C] tracking-tight font-display leading-[1.2] px-1">
              AGRICULTURE, CONNECTED BETTER.
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm text-[#3A4B47] leading-relaxed px-1">
              Work, opportunity and knowledge for the people and businesses shaping agriculture across Nigeria.
            </p>

            {/* Frequency Visual Accent */}
            <div className="flex justify-center pt-1">
              <TourmsFrequencyRhythm bars={11} height={18} />
            </div>

            {/* 3 Prominent Entry Points */}
            <div className="pt-3 flex flex-col gap-3 w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center min-h-[46px]"
                leftIcon={<Briefcase className="w-4 h-4" />}
                onClick={() => onNavigate('/jobs')}
              >
                Find Jobs (Workforce)
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center min-h-[46px]"
                leftIcon={<Award className="w-4 h-4 text-[#C98A3A]" />}
                onClick={() => onNavigate('/opportunities')}
              >
                Explore Opportunities
              </Button>

              <Button
                variant="outline"
                size="md"
                className="w-full justify-center min-h-[46px]"
                leftIcon={<BookOpen className="w-4 h-4" />}
                onClick={() => onNavigate('/insights')}
              >
                Read Insights
              </Button>
            </div>

            {/* Value Anchor Strip - Spacious unboxed columns */}
            <div className="pt-6 grid grid-cols-2 gap-4 text-left border-t border-[#EBEBDD] mt-6">
              <div className="space-y-1 py-1">
                <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Workforce</p>
                <p className="text-sm font-bold text-[#0F1F1C]">Capability-First</p>
                <p className="text-xs text-[#5A6E68] leading-relaxed">Assessing real field skills</p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Opportunities</p>
                <p className="text-sm font-bold text-[#0F1F1C]">Verified Grants</p>
                <p className="text-xs text-[#5A6E68] leading-relaxed">Concessionary capital</p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Editorial</p>
                <p className="text-sm font-bold text-[#0F1F1C]">Field Insights</p>
                <p className="text-xs text-[#5A6E68] leading-relaxed">Research briefs & data</p>
              </div>
              <div className="space-y-1 py-1">
                <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Coverage</p>
                <p className="text-sm font-bold text-[#0F1F1C]">36 States & FCT</p>
                <p className="text-xs text-[#5A6E68] leading-relaxed">Nationwide agricultural reach</p>
              </div>
            </div>
          </div>
        </section>

        {/* Destination 1: Jobs Introduction & Selected Listings */}
        <section className="py-12 px-5 border-b border-[#C4C8C5]">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
                <span>POWERED BY TOURMS WORKFORCE</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F1F1C] font-display leading-tight">
                Featured Employment Demands
              </h2>
              <p className="text-sm text-[#5A6E68] leading-relaxed">
                Verified agricultural roles with transparent compensation and certified employers.
              </p>
            </div>

            <div className="space-y-4 text-left">
              {featuredJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  onClick={() => onNavigate(`/jobs/${job.id}`)}
                  className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#5A6E68] truncate max-w-[170px]">{job.category}</span>
                      <StatusIndicator
                        status={job.employerVerified ? 'verified' : 'unverified'}
                        customLabel={job.employerVerified ? 'Verified' : 'Unverified'}
                      />
                    </div>

                    <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                      {job.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#08382B]">{job.organisation}</p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
                        <span>{job.location.state}, {job.location.lga}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{job.employmentType}</span>
                    </div>

                    <p className="text-xs text-[#3A4B47] line-clamp-2 leading-relaxed pt-1">
                      {job.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-xs text-[#5A6E68] block">Compensation:</span>
                      <span className="font-bold text-[#0F1F1C] tabular-nums text-sm">
                        ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/jobs')}
            >
              Browse All Jobs
            </Button>
          </div>
        </section>

        {/* Destination 2: Opportunities Introduction & Selected Listings */}
        <section className="py-12 px-5 bg-[#EBEBDD]/40 border-b border-[#C4C8C5]">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E5A18] tracking-widest uppercase">
                <span>PATHWAYS & CAPITAL</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F1F1C] font-display leading-tight">
                Agricultural Opportunities
              </h2>
              <p className="text-sm text-[#5A6E68] leading-relaxed">
                Distinct from employment: Grants, concessionary loans, fellowships, and training.
              </p>
            </div>

            <div className="space-y-4 text-left">
              {featuredOpportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onNavigate('/opportunities')}
                  className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#C98A3A] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#8E5A18] truncate max-w-[180px]">{opp.category}</span>
                      <span className="text-[#5A6E68] shrink-0">Closes {opp.deadline}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#8E5A18] transition-colors leading-snug">
                      {opp.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#08382B]">{opp.provider}</p>

                    <p className="text-xs text-[#3A4B47] line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs text-[#0E5A46] font-semibold">
                    <span className="truncate max-w-[160px] text-xs">Scope: {opp.locationScope}</span>
                    <span className="group-hover:underline shrink-0 text-xs">Details →</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/opportunities')}
            >
              Explore Opportunities
            </Button>
          </div>
        </section>

        {/* Destination 3: Insights & Editorial Intelligence */}
        <section className="py-12 px-5 border-b border-[#C4C8C5]">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
                <span>EDITORIAL & KNOWLEDGE</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F1F1C] font-display leading-tight">
                Field Intelligence & Research
              </h2>
              <p className="text-sm text-[#5A6E68] leading-relaxed">
                Agronomic analysis, logistics economics, and post-harvest engineering briefs.
              </p>
            </div>

            <div className="space-y-4 text-left">
              {featuredInsights.slice(0, 3).map((art) => (
                <article
                  key={art.id}
                  onClick={() => onNavigate(`/insights/${art.slug}`)}
                  className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A6E68]">
                      <span className="font-semibold text-[#0E5A46]">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readingTimeMinutes} min read</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#3A4B47] line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs">
                    <span className="text-[#5A6E68] text-xs truncate max-w-[140px]">{art.author.name}</span>
                    <span className="text-[#0E5A46] font-bold group-hover:underline shrink-0">Read Brief →</span>
                  </div>
                </article>
              ))}
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/insights')}
            >
              Read Insights
            </Button>
          </div>
        </section>

        {/* Tourms Principles Section (Mobile Fitted) */}
        <section className="py-12 px-5 bg-[#0F1F1C] text-white border-b border-[#243B36]">
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#C98A3A] tracking-widest uppercase">
                PHILOSOPHY & FOUNDATIONS
              </p>
              <h2 className="text-xl font-bold font-display leading-tight">
                The Builder + The System.
              </h2>
              <p className="text-xs text-[#A0B0AB] leading-relaxed">
                Tourms Agro-Solutions is structured agricultural infrastructure designed for practical durability.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              <div className="space-y-1.5 border-t border-[#243B36] pt-4">
                <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">01. Capability-First</p>
                <h3 className="text-sm font-bold text-white">What Can You Actually Do?</h3>
                <p className="text-xs text-[#A0B0AB] leading-relaxed">
                  Practical agricultural skills and verified field accomplishments over decorative resumes.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-[#243B36] pt-4">
                <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">02. Trust Through Verification</p>
                <h3 className="text-sm font-bold text-white">No Fabricated Claims</h3>
                <p className="text-xs text-[#A0B0AB] leading-relaxed">
                  Real CAC records and audit histories for all employers.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-[#243B36] pt-4">
                <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">03. Resilient By Design</p>
                <h3 className="text-sm font-bold text-white">Nigeria-First Performance</h3>
                <p className="text-xs text-[#A0B0AB] leading-relaxed">
                  Optimized for mobile browsing across all 36 States and FCT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Mobile Call to Action */}
        <section className="py-12 px-5 text-center bg-[#F7F7EE]">
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#0F1F1C] font-display">
              Shape Agricultural Growth with Tourms
            </h2>
            <p className="text-sm text-[#3A4B47] leading-relaxed">
              Connect agricultural demand with verified capability across Nigeria.
            </p>
            <div className="pt-2 flex flex-col gap-3 w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center min-h-[46px]"
                onClick={() => onNavigate('/worker/onboarding')}
              >
                Create Worker Profile
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center min-h-[46px]"
                onClick={() => onNavigate('/employer/post-job')}
              >
                Post Employment Demand
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Standard Desktop & Large Viewport Branch
  return (
    <div className="w-full text-left overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        {/* Architectural Subtle Grid Motif */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0E5A46_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0E5A46] tracking-widest uppercase">
            <TourmsSymbol size={18} />
            <span>TOURMS AGRO-SOLUTIONS</span>
            <span aria-hidden="true">·</span>
            <span>NIGERIA-FIRST AGRICULTURAL INFRASTRUCTURE</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0F1F1C] tracking-tight font-display leading-[1.12] max-w-4xl mx-auto [text-wrap:balance]">
            AGRICULTURE, CONNECTED BETTER.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-[#3A4B47] max-w-3xl mx-auto leading-relaxed">
            Work, opportunity and knowledge for the people and businesses shaping agriculture.
            Connecting agricultural talent, verified agribusinesses, and funding pathways across Nigeria.
          </p>

          {/* Frequency Visual Accent */}
          <div className="flex justify-center pt-2">
            <TourmsFrequencyRhythm bars={13} height={22} />
          </div>

          {/* 3 Prominent Entry Points */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px]"
              leftIcon={<Briefcase className="w-5 h-5" />}
              onClick={() => onNavigate('/jobs')}
            >
              Find Jobs (Workforce)
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px]"
              leftIcon={<Award className="w-5 h-5 text-[#C98A3A]" />}
              onClick={() => onNavigate('/opportunities')}
            >
              Explore Opportunities
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px]"
              leftIcon={<BookOpen className="w-5 h-5" />}
              onClick={() => onNavigate('/insights')}
            >
              Read Insights
            </Button>
          </div>

          {/* Value Anchor Strip - Architectural & Spacious */}
          <div className="pt-12 sm:pt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-left border-t border-[#EBEBDD] mt-10 sm:mt-12">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Workforce Engine</p>
              <p className="text-base font-bold text-[#0F1F1C]">Capability-First Hiring</p>
              <p className="text-xs sm:text-sm text-[#5A6E68] leading-relaxed">Assessing actual field competence over decorative credentials</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Opportunities</p>
              <p className="text-base font-bold text-[#0F1F1C]">Verified Programs</p>
              <p className="text-xs sm:text-sm text-[#5A6E68] leading-relaxed">Grants, concessionary loans, and developmental capital</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">Editorial Intelligence</p>
              <p className="text-base font-bold text-[#0F1F1C]">Rigorous Insights</p>
              <p className="text-xs sm:text-sm text-[#5A6E68] leading-relaxed">Evidence-backed agronomic research and supply chain analysis</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">National Coverage</p>
              <p className="text-base font-bold text-[#0F1F1C]">36 States & FCT</p>
              <p className="text-xs sm:text-sm text-[#5A6E68] leading-relaxed">Localized operational zones across every agro-ecological belt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination 1: Jobs Introduction & Selected Listings */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
                <span>POWERED BY TOURMS WORKFORCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F1F1C] font-display">
                Featured Employment Demands
              </h2>
              <p className="text-sm sm:text-base text-[#5A6E68] max-w-xl leading-relaxed">
                Genuine agricultural roles with verified compensation and transparent operational requirements.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/jobs')}
            >
              Browse All Jobs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
            {featuredJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                onClick={() => onNavigate(`/jobs/${job.id}`)}
                className="bg-white border border-[#C4C8C5] rounded p-6 sm:p-7 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#5A6E68]">{job.category}</span>
                    <StatusIndicator
                      status={job.employerVerified ? 'verified' : 'unverified'}
                      customLabel={job.employerVerified ? 'Verified' : 'Unverified'}
                    />
                  </div>

                  <h3 className="text-lg font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#08382B]">{job.organisation}</p>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                      <span>{job.location.state}, {job.location.lga}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{job.employmentType}</span>
                  </div>

                  <p className="text-sm text-[#3A4B47] line-clamp-2 leading-relaxed pt-1">
                    {job.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-xs text-[#5A6E68] block">Compensation:</span>
                    <span className="font-bold text-[#0F1F1C] tabular-nums text-sm sm:text-base">
                      ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination 2: Opportunities Introduction & Selected Listings */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#EBEBDD]/40 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E5A18] tracking-widest uppercase">
                <span>PATHWAYS & CAPITAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F1F1C] font-display">
                Agricultural Opportunities
              </h2>
              <p className="text-sm sm:text-base text-[#5A6E68] max-w-xl leading-relaxed">
                Distinct from employment demand: Grants, concessionary loans, fellowships, and training.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/opportunities')}
            >
              Explore Opportunities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {featuredOpportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('/opportunities')}
                className="bg-white border border-[#C4C8C5] rounded p-6 sm:p-7 hover:border-[#C98A3A] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#8E5A18]">{opp.category}</span>
                    <span className="text-[#5A6E68]">Closes {opp.deadline}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F1F1C] group-hover:text-[#8E5A18] transition-colors leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#08382B]">{opp.provider}</p>

                  <p className="text-sm text-[#3A4B47] line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-5 flex items-center justify-between text-xs text-[#0E5A46] font-semibold">
                  <span className="truncate max-w-[170px]">Scope: {opp.locationScope}</span>
                  <span className="group-hover:underline shrink-0">Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination 3: Insights & Editorial Intelligence */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5A46] tracking-widest uppercase">
                <span>EDITORIAL & KNOWLEDGE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F1F1C] font-display">
                Field Intelligence & Research Briefs
              </h2>
              <p className="text-sm sm:text-base text-[#5A6E68] max-w-xl leading-relaxed">
                Rigorous agronomic analysis, logistics economics, and post-harvest technology.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/insights')}
            >
              Read Insights
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
            {featuredInsights.slice(0, 3).map((art) => (
              <article
                key={art.id}
                onClick={() => onNavigate(`/insights/${art.slug}`)}
                className="bg-white border border-[#C4C8C5] rounded p-6 sm:p-7 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs text-[#5A6E68]">
                    <span className="font-semibold text-[#0E5A46]">{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readingTimeMinutes} min read</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-sm text-[#3A4B47] line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-5 flex items-center justify-between text-xs">
                  <span className="text-[#5A6E68] font-medium truncate max-w-[150px]">{art.author.name}</span>
                  <span className="text-[#0E5A46] font-bold group-hover:underline shrink-0">Read Brief →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tourms Principles Section */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0F1F1C] text-white border-b border-[#243B36]">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-14 text-left">
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#C98A3A] tracking-widest uppercase">
              PHILOSOPHY & FOUNDATIONS
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-tight">
              The Builder + The System.
            </h2>
            <p className="text-sm sm:text-base text-[#A0B0AB] max-w-2xl leading-relaxed">
              We do not build generic directories or superficial job portals. Tourms Agro-Solutions is structured agricultural infrastructure designed for practical durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-2">
            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">01. Capability-First</p>
              <h3 className="text-base font-bold text-white">What Can You Actually Do?</h3>
              <p className="text-xs sm:text-sm text-[#A0B0AB] leading-relaxed">
                Prioritizing practical agricultural skills, tractor calibration, and verified field accomplishments over decorative resumes.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">02. Trust Through Verification</p>
              <h3 className="text-base font-bold text-white">No Fabricated Claims</h3>
              <p className="text-xs sm:text-sm text-[#A0B0AB] leading-relaxed">
                Strict distinction between self-reported data and verified documentation. Real CAC records and audit histories for all employers.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">03. Resilient By Design</p>
              <h3 className="text-base font-bold text-white">Nigeria-First Performance</h3>
              <p className="text-xs sm:text-sm text-[#A0B0AB] leading-relaxed">
                Optimized for low-bandwidth mobile browsing, local data budgets, and coverage across all 36 States and FCT Area Councils.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 text-center bg-[#F7F7EE]">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F1F1C] font-display">
            Shape Agricultural Growth with Tourms
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3A4B47] leading-relaxed max-w-xl mx-auto">
            Whether you are an agricultural professional seeking serious work or an agribusiness looking for verified talent, our platform connects demand with capability.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px]"
              onClick={() => onNavigate('/worker/onboarding')}
            >
              Create Worker Profile
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px]"
              onClick={() => onNavigate('/employer/post-job')}
            >
              Post Employment Demand
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
