import React from 'react';
import { ArrowRight, Briefcase, Award, BookOpen, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { JobListing, OpportunityListing, InsightArticle } from '../../types';
import { StatusIndicator } from '../ui/Badge';
import { Button } from '../ui/Button';

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
  return (
    <div className={`w-full ${isMobilePreview ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]' : ''}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        {/* Subtle Architectural Grid Background Motif */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0E5A46_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E5A46] tracking-wider uppercase">
            <span>TOURMS AGRO-SOLUTIONS</span>
            <span aria-hidden="true">·</span>
            <span>NIGERIA-FIRST ARCHITECTURE</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#0F1F1C] tracking-tight font-display leading-[1.1] max-w-4xl mx-auto [text-wrap:balance]">
            AGRICULTURE, CONNECTED BETTER.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-[#3A4B47] max-w-2xl mx-auto leading-relaxed">
            Work, opportunity and knowledge for the people and businesses shaping agriculture.
            Connecting agricultural talent, employers, and verified funding pathways across Nigeria.
          </p>

          {/* 3 Prominent Entry Points */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={<Briefcase className="w-4 h-4" />}
              onClick={() => onNavigate('/jobs')}
            >
              Find Jobs
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={<Award className="w-4 h-4 text-[#C98A3A]" />}
              onClick={() => onNavigate('/opportunities')}
            >
              Explore Opportunities
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              leftIcon={<BookOpen className="w-4 h-4" />}
              onClick={() => onNavigate('/insights')}
            >
              Read Insights
            </Button>
          </div>

          {/* Value Anchor Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-[#EBEBDD] mt-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">Workforce Engine</p>
              <p className="text-sm font-bold text-[#0F1F1C]">Capability-First Hiring</p>
              <p className="text-xs text-[#5A6E68]">Direct assessment of actual skills</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">Opportunities</p>
              <p className="text-sm font-bold text-[#0F1F1C]">Verified Programs</p>
              <p className="text-xs text-[#5A6E68]">Grants, loans, and fellowships</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">Editorial</p>
              <p className="text-sm font-bold text-[#0F1F1C]">Rigorous Insights</p>
              <p className="text-xs text-[#5A6E68]">Research briefs & field analysis</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#5A6E68] uppercase tracking-wider">Coverage</p>
              <p className="text-sm font-bold text-[#0F1F1C]">36 States & FCT</p>
              <p className="text-xs text-[#5A6E68]">Localised across agricultural zones</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination 1: Jobs Introduction & Selected Listings */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E5A46] tracking-wider uppercase mb-1">
                <span>POWERED BY TOURMS WORKFORCE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F1F1C] font-display">
                Featured Employment Demands
              </h2>
              <p className="text-sm text-[#5A6E68] mt-1 max-w-xl">
                Genuine agricultural roles with verified compensation and transparent requirements.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/jobs')}
            >
              Browse All Jobs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {featuredJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                onClick={() => onNavigate(`/jobs/${job.id}`)}
                className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#5A6E68]">{job.category}</span>
                    <StatusIndicator
                      status={job.employerVerified ? 'verified' : 'unverified'}
                      customLabel={job.employerVerified ? 'Verified' : 'Unverified'}
                    />
                  </div>

                  <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#08382B]">{job.organisation}</p>

                  <div className="flex items-center gap-3 text-xs text-[#5A6E68]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0E5A46]" />
                      <span>{job.location.state}, {job.location.lga}</span>
                    </span>
                    <span>·</span>
                    <span>{job.employmentType}</span>
                  </div>

                  <p className="text-xs text-[#3A4B47] line-clamp-2 leading-relaxed pt-1">
                    {job.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-[#5A6E68] block">Compensation:</span>
                    <span className="font-bold text-[#0F1F1C] tabular-nums">
                      ₦{job.compensation.amountMin?.toLocaleString()} / {job.compensation.frequency}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#0E5A46] group-hover:underline inline-flex items-center gap-1">
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
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#EBEBDD]/40 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E5A18] tracking-wider uppercase mb-1">
                <span>PATHWAYS & CAPITAL</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F1F1C] font-display">
                Agricultural Opportunities
              </h2>
              <p className="text-sm text-[#5A6E68] mt-1 max-w-xl">
                Distinct from employment demand: Grants, concessionary loans, fellowships, and training.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/opportunities')}
            >
              Explore All Opportunities
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {featuredOpportunities.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                onClick={() => onNavigate('/opportunities')}
                className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#C98A3A] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#8E5A18]">{opp.category}</span>
                    <span className="text-[#5A6E68]">Deadline: {opp.deadline}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#8E5A18] transition-colors leading-snug">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-[#5A6E68] font-medium">{opp.provider}</p>

                  <p className="text-xs text-[#3A4B47] line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs text-[#0E5A46] font-semibold">
                  <span>Scope: {opp.locationScope}</span>
                  <span className="group-hover:underline">Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination 3: Insights & Editorial Intelligence */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C4C8C5]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E5A46] tracking-wider uppercase mb-1">
                <span>EDITORIAL & KNOWLEDGE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F1F1C] font-display">
                Field Intelligence & Research Briefs
              </h2>
              <p className="text-sm text-[#5A6E68] mt-1 max-w-xl">
                Rigorous agronomic analysis, logistics economics, and post-harvest technology.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/insights')}
            >
              Read Insights
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {featuredInsights.slice(0, 3).map((art) => (
              <article
                key={art.id}
                onClick={() => onNavigate(`/insights/${art.slug}`)}
                className="bg-white border border-[#C4C8C5] rounded p-5 hover:border-[#0E5A46] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#5A6E68]">
                    <span>{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readingTimeMinutes} min read</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F1F1C] group-hover:text-[#0E5A46] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#3A4B47] line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EBEBDD] mt-4 flex items-center justify-between text-xs">
                  <span className="text-[#5A6E68] font-medium">{art.author.name}</span>
                  <span className="text-[#0E5A46] font-semibold group-hover:underline">Read Brief →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tourms Principles Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0F1F1C] text-white border-b border-[#243B36]">
        <div className="max-w-5xl mx-auto space-y-12 text-left">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#C98A3A] tracking-wider uppercase">
              PHILOSOPHY & FOUNDATIONS
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              The Builder + The System.
            </h2>
            <p className="text-sm text-[#A0B0AB] max-w-2xl leading-relaxed">
              We do not build generic directories or superficial job portals. Tourms Agro-Solutions is structured agricultural infrastructure designed for practical durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">01. Capability-First</p>
              <h3 className="text-base font-bold text-white">What Can You Actually Do?</h3>
              <p className="text-xs text-[#A0B0AB] leading-relaxed">
                Prioritizing practical agricultural skills, tractor calibration, and verified field accomplishments over decorative resumes.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">02. Trust Through Verification</p>
              <h3 className="text-base font-bold text-white">No Fabricated Claims</h3>
              <p className="text-xs text-[#A0B0AB] leading-relaxed">
                Strict distinction between self-reported data and verified documentation. Real CAC records and audit histories for all employers.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#243B36] pt-4">
              <p className="text-xs font-bold text-[#C98A3A] uppercase tracking-wider">03. Resilient By Design</p>
              <h3 className="text-base font-bold text-white">Nigeria-First Performance</h3>
              <p className="text-xs text-[#A0B0AB] leading-relaxed">
                Optimized for low-bandwidth mobile browsing, local data budgets, and coverage across all 36 States and FCT Area Councils.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center bg-[#F7F7EE]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F1F1C] font-display">
            Shape Agricultural Growth with Tourms
          </h2>
          <p className="text-sm sm:text-base text-[#3A4B47] leading-relaxed max-w-xl mx-auto">
            Whether you are an agricultural professional seeking serious work or an agribusiness looking for verified talent, our platform connects demand with capability.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => onNavigate('/worker/onboarding')}
            >
              Create Worker Profile
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
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
