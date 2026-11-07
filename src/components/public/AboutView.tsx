import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { TourmsLogo, TourmsSymbol, TourmsFrequencyRhythm } from '../ui/TourmsLogo';
import { Modal } from '../ui/Modal';
import {
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles,
  SlidersHorizontal,
  FileText,
  ExternalLink,
  Target,
  Check,
  Award
} from 'lucide-react';

export interface AboutViewProps {
  onNavigate: (path: string) => void;
  isMobilePreview?: boolean;
}

type DoctrineTab = 'brand' | 'beliefs' | 'visual' | 'product' | 'antipatterns' | 'framework';

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  isMobilePreview = false
}) => {
  const [brandGuideModalOpen, setBrandGuideModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DoctrineTab>('brand');
  const [selectedAssetSection, setSelectedAssetSection] = useState<string>('all');

  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'max-w-md mx-auto border-x border-[#C4C8C5] shadow-lg bg-[#F7F7EE]'
          : ''
      }`}
    >
      {/* Doctrine Hero & Canonical Positioning */}
      <section className={`bg-white border-b border-[#C4C8C5] ${isMobilePreview ? 'py-6 px-4' : 'py-10 md:py-16 px-4 sm:px-6 lg:px-8'}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[#0E5A46] tracking-wider uppercase bg-[#E7F3EF] px-2.5 py-1 rounded">
            <TourmsSymbol size={14} />
            <span>TOURMS COMPREHENSIVE DOCTRINE</span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
              TOURMS MASTER BRAND • SAME SOUND, DIFFERENT FREQUENCY.
            </p>
            <h1 className={`${isMobilePreview ? 'text-2xl' : 'text-2xl sm:text-4xl md:text-5xl'} font-extrabold text-[#0F1F1C] tracking-tight font-display leading-[1.2] break-words`}>
              AGRICULTURE, CONNECTED BETTER.
            </h1>
          </div>

          <p className={`${isMobilePreview ? 'text-xs' : 'text-sm sm:text-base md:text-lg'} text-[#3A4B47] leading-relaxed break-words`}>
            Work, opportunity and knowledge for the people and businesses shaping agriculture across Nigeria and Africa.
            Built on purposeful simplicity, verified capability, and resilient systems.
          </p>

          {/* Canonical Architecture Pill Strip */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="p-2.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">
              <span className="text-[10px] uppercase font-bold text-[#5A6E68] block">Master Brand</span>
              <span className="text-xs font-bold text-[#0F1F1C]">TOURMS</span>
            </div>
            <div className="p-2.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">
              <span className="text-[10px] uppercase font-bold text-[#5A6E68] block">Master Tagline</span>
              <span className="text-xs font-bold text-[#0E5A46]">Same Sound, Diff. Freq.</span>
            </div>
            <div className="p-2.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">
              <span className="text-[10px] uppercase font-bold text-[#5A6E68] block">Product Line</span>
              <span className="text-xs font-bold text-[#0F1F1C]">Agro-Solutions</span>
            </div>
            <div className="p-2.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">
              <span className="text-[10px] uppercase font-bold text-[#5A6E68] block">Corporate Expression</span>
              <span className="text-xs font-bold text-[#C98A3A]">One Co. Many Possibilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Doctrine Explorer Navigation */}
      <section className="bg-[#EBEBDD] border-b border-[#C4C8C5] sticky top-0 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'brand', label: '1. Brand Philosophy', icon: Sparkles },
            { id: 'beliefs', label: '2. Design Beliefs', icon: Compass },
            { id: 'visual', label: '3. Visual System', icon: Layers },
            { id: 'product', label: '4. Product Pillars', icon: Target },
            { id: 'antipatterns', label: '8. Anti-Patterns', icon: AlertTriangle },
            { id: 'framework', label: '9. Decision Rules', icon: SlidersHorizontal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DoctrineTab)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#0E5A46] text-white shadow-xs'
                    : 'bg-white/80 text-[#3A4B47] hover:bg-white hover:text-[#0F1F1C]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tabbed Content Sections */}
      <section className={`${isMobilePreview ? 'py-6 px-4' : 'py-8 md:py-12 px-4 sm:px-6 lg:px-8'} max-w-4xl mx-auto space-y-8`}>
        {/* TAB 1: BRAND PHILOSOPHY */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-[10px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
                  Part One • The Tourms Brand Philosophy
                </h2>
                <h3 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display`}>
                  Same Sound, Different Frequency.
                </h3>
              </div>
              <TourmsFrequencyRhythm bars={9} height={20} />
            </div>

            <p className="text-xs sm:text-sm text-[#3A4B47] leading-relaxed break-words">
              This is the central expression of the TOURMS identity. It represents two complementary ideas:
            </p>

            <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'md:grid-cols-2'} gap-4`}>
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0E5A46]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#0E5A46] uppercase tracking-wider">
                    SAME SOUND — Consistency of Identity
                  </h4>
                </div>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Regardless of the industry, market, or product TOURMS enters, there is an unshakeable foundation:
                </p>
                <ul className="text-xs text-[#3A4B47] space-y-1.5 pl-2 list-disc list-inside">
                  <li>A consistent standard of build quality.</li>
                  <li>A consistent approach to solving real problems.</li>
                  <li>A consistent commitment to usefulness.</li>
                  <li>A consistent respect for people, resources, and trust.</li>
                  <li>A consistent philosophy of building systems that work.</li>
                </ul>
              </div>

              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#C98A3A]" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#C98A3A] uppercase tracking-wider">
                    DIFFERENT FREQUENCY — Freedom of Expression
                  </h4>
                </div>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  TOURMS is not restricted to one category or business model:
                </p>
                <ul className="text-xs text-[#3A4B47] space-y-1.5 pl-2 list-disc list-inside">
                  <li>Consistency does not require uniformity.</li>
                  <li>Different products can have distinct personalities and specialized UI.</li>
                  <li>Innovation should not destroy brand coherence.</li>
                  <li>Agro-Solutions adapts language, imagery, and workflows for African agriculture without forcing the master brand to become an agricultural-only mark.</li>
                </ul>
              </div>
            </div>

            {/* Principle 2: The Builder + The System */}
            <div className="p-5 sm:p-6 bg-white rounded border border-[#C4C8C5] space-y-4">
              <div className="border-b border-[#EBEBDD] pb-3">
                <span className="text-[10px] font-bold text-[#5A6E68] uppercase tracking-wider block">Internal Creative Principle</span>
                <h4 className="text-base sm:text-lg font-bold text-[#0F1F1C]">The Builder + The System</h4>
                <p className="text-xs text-[#3A4B47] mt-1">
                  TOURMS is interested in more than producing attractive things. It is interested in building useful systems that can operate, connect, improve and scale.
                </p>
              </div>

              <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'sm:grid-cols-2'} gap-4 text-xs text-[#3A4B47]`}>
                <div className="p-3.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]/60 space-y-1.5">
                  <p className="font-bold text-[#0F1F1C] uppercase text-[11px]">The Builder Represents</p>
                  <p>Vision, initiative, creativity, practical problem-solving, and the ability to recognize opportunities and turn them into something useful.</p>
                </div>
                <div className="p-3.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]/60 space-y-1.5">
                  <p className="font-bold text-[#0F1F1C] uppercase text-[11px]">The System Represents</p>
                  <p>Structure, repeatable processes, reliability, coordination, standards, and the discipline to make good ideas work consistently over time.</p>
                </div>
              </div>

              <div className="p-3 rounded bg-[#0F1F1C] text-white text-xs text-center font-display tracking-wider">
                STRENGTH IN STRUCTURE. FREEDOM TO GROW.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN BELIEFS */}
        {activeTab === 'beliefs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[10px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
                Part Two • Our Core Design Beliefs
              </h2>
              <h3 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display`}>
                Design is a Tool for Making Things Work Better.
              </h3>
              <p className="text-xs sm:text-sm text-[#3A4B47] mt-1">
                Design is not decoration. A beautiful interface that confuses people is not good design.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {[
                {
                  title: '1. Clarity Over Complexity',
                  desc: 'Complex agricultural problems do not require complicated interfaces. Organize complexity well with plain language, visual hierarchy, and progressive disclosure rather than displaying complexity everywhere.'
                },
                {
                  title: '2. Purposeful Simplicity',
                  desc: 'Every component must have a purpose. Remove unnecessary elements, but never remove essential functionality simply to make a screen look empty or minimal.'
                },
                {
                  title: '3. Function Before Decoration',
                  desc: 'Form must emerge from the task: job cards must be scannable, worker profiles must highlight real capabilities, employer dashboards must prioritize actions, and admin queues must accelerate decisions.'
                },
                {
                  title: '4. Respect People\'s Time, Money, Data & Trust',
                  desc: 'Never make people repeat information or navigate needless steps. Never fabricate opportunities or exaggerate verification. Trust must be demonstrated through product behavior, not just a badge.'
                },
                {
                  title: '5. Consistency Without Rigidity',
                  desc: 'Buttons, forms, typography, and status indicators follow system rules, while allowing contextual density (e.g. dense admin review queues vs. spacious public reading).'
                },
                {
                  title: '6. Human-Centred, Not Technology-Centred',
                  desc: 'Technology serves human outcomes. Never add AI, automation, or dashboards simply because they are technologically possible. Start from the user\'s real friction.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded border border-[#C4C8C5] space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1F1C]">{item.title}</h4>
                  <p className="text-xs text-[#3A4B47] leading-relaxed break-words">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* The Apple-Inspired Quality Standard */}
            <div className="p-5 bg-[#E7F3EF] border border-[#0E5A46]/30 rounded space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#0E5A46] uppercase tracking-wider">
                The Apple-Inspired Quality Reference
              </h4>
              <p className="text-xs text-[#0F1F1C] leading-relaxed">
                When we refer to Apple, we mean <strong>product discipline and craftsmanship</strong> (attention to detail, visual restraint, predictable behavior, and seamless integration)—not an instruction to copy Apple\'s styling. TOURMS has its own distinctive agricultural identity.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL SYSTEM & STANDARDS */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-[10px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
                  Part Three • Visual Design Standards
                </h2>
                <h3 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display`}>
                  Approved Palette, Typography & Frequency System
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
                onClick={() => setBrandGuideModalOpen(true)}
              >
                Inspect Full Brand Board
              </Button>
            </div>

            {/* Approved Palette Swatches */}
            <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
                Approved Brand Colour System
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-left">
                {[
                  { name: 'Tourms Charcoal', hex: '#0F1F1C', role: 'Primary Dark & Text', textDark: false },
                  { name: 'Deep Tourms Green', hex: '#0E5A46', role: 'Primary Brand Action', textDark: false },
                  { name: 'Warm Ivory', hex: '#F7F7EE', role: 'Primary Canvas', textDark: true },
                  { name: 'Amber Copper', hex: '#C98A3A', role: 'Restrained Accent', textDark: false },
                  { name: 'White', hex: '#FFFFFF', role: 'Card Contrast', textDark: true },
                  { name: 'Black', hex: '#111111', role: 'Monochrome Fallback', textDark: false },
                ].map((swatch, idx) => (
                  <div key={idx} className="rounded border border-[#C4C8C5] overflow-hidden text-xs">
                    <div
                      className="h-14 flex items-center justify-center font-mono font-bold text-[11px]"
                      style={{ backgroundColor: swatch.hex, color: swatch.textDark ? '#0F1F1C' : '#FFFFFF' }}
                    >
                      {swatch.hex}
                    </div>
                    <div className="p-2 bg-white space-y-0.5">
                      <p className="font-bold text-[#0F1F1C] text-[11px] truncate">{swatch.name}</p>
                      <p className="text-[10px] text-[#5A6E68] leading-tight">{swatch.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Tokens */}
            <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'sm:grid-cols-2'} gap-4`}>
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-2">
                <span className="text-[10px] font-bold text-[#0E5A46] uppercase">Headlines & Display</span>
                <h4 className="text-xl font-bold font-display text-[#0F1F1C]">Montserrat</h4>
                <p className="text-xs text-[#3A4B47]">
                  Used for brand headings, hero titles, milestone metrics, and prominent banners. Clean, confident, and enduring.
                </p>
                <div className="p-2.5 bg-[#F7F7EE] rounded font-display text-sm font-bold text-[#0F1F1C]">
                  AGRICULTURE, CONNECTED BETTER.
                </div>
              </div>

              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-2">
                <span className="text-[10px] font-bold text-[#C98A3A] uppercase">Body & Product Interfaces</span>
                <h4 className="text-xl font-bold font-sans text-[#0F1F1C]">Inter</h4>
                <p className="text-xs text-[#3A4B47]">
                  Used for all digital reading, form inputs, metadata badges, data tables, and operational queues. Optimized for high screen legibility.
                </p>
                <div className="p-2.5 bg-[#F7F7EE] rounded font-sans text-xs text-[#3A4B47]">
                  Verified Tractor Operator • 450 ha seasonal experience • CAC Reg #RC-1849204
                </div>
              </div>
            </div>

            {/* Geometric T Construction & Brand Asset Inspector Card */}
            <div
              onClick={() => setBrandGuideModalOpen(true)}
              className="group relative rounded border border-[#C4C8C5] overflow-hidden bg-[#0F1F1C] cursor-pointer shadow-md"
            >
              <img
                src="/public/assets/aistudio/ChatGPT_Image_Oct_31__2026__09_09_50_AM_947537e4.png"
                alt="TOURMS Brand Identity System: Master Logo, Symbol Construction, Typography, and Frequency System"
                className="w-full h-auto max-h-[380px] object-cover object-top transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F1C]/95 via-[#0F1F1C]/40 to-transparent flex items-end p-4 sm:p-6">
                <div className="flex items-center justify-between w-full">
                  <div className="text-left text-white space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold font-display">
                      Official Brand Identity Guidelines Board
                    </p>
                    <p className="text-[11px] text-[#A0B0AB]">
                      Tap to open high-resolution viewer with symbol construction, frequency system, and real applications
                    </p>
                  </div>
                  <span className="p-2 rounded bg-[#0E5A46] text-white shrink-0 group-hover:bg-[#0E5A46]/90">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT PILLARS & ARCHITECTURE */}
        {activeTab === 'product' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[10px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
                Part Five • The 3 Canonical Public Pillars
              </h2>
              <h3 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display`}>
                Strict Distinction: Jobs, Opportunities & Insights
              </h3>
              <p className="text-xs sm:text-sm text-[#3A4B47] mt-1">
                The platform is organised around real user goals, not internal corporate departments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jobs */}
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded bg-[#E7F3EF] text-[#0E5A46]">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1F1C]">1. Jobs</h4>
                    <span className="text-[10px] text-[#5A6E68]">Tourms Workforce</span>
                  </div>
                </div>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Connects workers with vetted agricultural employment. Prioritizes <strong>concrete capabilities</strong> (boom calibration, pest scouting, combine harvesting) rather than generic CV titles.
                </p>
                <div className="pt-2 border-t border-[#EBEBDD]">
                  <span className="text-[10px] font-bold text-[#0E5A46] block uppercase">Core Question</span>
                  <p className="text-xs font-semibold text-[#0F1F1C]">"What can this person actually do?"</p>
                </div>
              </div>

              {/* Opportunities */}
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded bg-[#FEF4E8] text-[#C98A3A]">
                    <Award className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1F1C]">2. Opportunities</h4>
                    <span className="text-[10px] text-[#5A6E68]">Capital & Growth</span>
                  </div>
                </div>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Distinct from employment: curates verified grants, concessionary loans, scholarships, fellowships, and training. Strictly non-employment development paths.
                </p>
                <div className="pt-2 border-t border-[#EBEBDD]">
                  <span className="text-[10px] font-bold text-[#C98A3A] block uppercase">Core Standard</span>
                  <p className="text-xs font-semibold text-[#0F1F1C]">Transparent eligibility, deadlines & application links</p>
                </div>
              </div>

              {/* Insights */}
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded bg-[#F7F7EE] text-[#0F1F1C]">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1F1C]">3. Insights</h4>
                    <span className="text-[10px] text-[#5A6E68]">Knowledge & Science</span>
                  </div>
                </div>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Editorial knowledge, agronomy research briefs, field notes, and market explainers with institutional citations (IITA, NIHORT, CBN, NCAM). Zero clickbait or filler.
                </p>
                <div className="pt-2 border-t border-[#EBEBDD]">
                  <span className="text-[10px] font-bold text-[#0F1F1C] block uppercase">Core Principle</span>
                  <p className="text-xs font-semibold text-[#0F1F1C]">Rigorous agricultural science & verifiable sources</p>
                </div>
              </div>
            </div>

            {/* Employer & Admin Operational Principles */}
            <div className={`grid grid-cols-1 ${isMobilePreview ? '' : 'sm:grid-cols-2'} gap-4`}>
              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-2">
                <span className="text-[10px] font-bold text-[#0E5A46] uppercase">Employer Philosophy</span>
                <h4 className="text-sm font-bold text-[#0F1F1C]">"What Needs My Attention?"</h4>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Task before vanity charts: immediate applicant review queues, active candidate status updates, CAC compliance verification, and clear job management.
                </p>
              </div>

              <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-2">
                <span className="text-[10px] font-bold text-[#C98A3A] uppercase">Admin Console Philosophy</span>
                <h4 className="text-sm font-bold text-[#0F1F1C]">"What Needs Tourms' Attention Right Now?"</h4>
                <p className="text-xs text-[#3A4B47] leading-relaxed">
                  Operational clarity: pending job approvals, CAC document audits, worker flags, opportunity verification, and complete audit logging across role boundaries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANTI-PATTERNS (PART EIGHT) */}
        {activeTab === 'antipatterns' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FFF5F5] border border-[#F5C2C7] rounded space-y-1">
              <div className="flex items-center gap-2 text-[#842029]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Part Eight • What Tourms Should Never Become
                </h3>
              </div>
              <p className="text-xs text-[#842029]">
                Strict architectural boundaries and anti-patterns governing all digital touchpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                '1. A generic agricultural website with an arbitrary green colour scheme.',
                '2. A visually attractive interface with weak, non-functional workflows.',
                '3. A dashboard full of meaningless decorative statistics and vanity charts.',
                '4. A platform that overwhelms users with excessive, unorganized features.',
                '5. A product that treats every agricultural user as having identical needs.',
                '6. A system that makes unsupported claims about verification or credibility.',
                '7. A design that prioritises desktop while treating mobile as an afterthought.',
                '8. A product that uses AI or automation without a clear user benefit.',
                '9. A collection of disconnected pages with no coherent design language.',
                '10. A product that sacrifices accessibility (contrast/legibility) for aesthetics.',
                '11. A system that fabricates jobs, opportunities, users, activity or editorial content.',
                '12. A codebase that becomes unmaintainable because of unnecessary complexity.',
                '13. A visual identity that relies on literal soundwave or agricultural clichés.',
                '14. A product that imitates another company\'s identity instead of developing its own.'
              ].map((rule, idx) => (
                <div key={idx} className="p-3 bg-white rounded border border-[#C4C8C5] flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C98A3A] mt-1.5 shrink-0" />
                  <p className="text-[#3A4B47] leading-relaxed break-words">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DECISION FRAMEWORK & PRIORITIES (PART NINE) */}
        {activeTab === 'framework' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[10px] sm:text-xs font-bold text-[#C98A3A] uppercase tracking-wider">
                Part Nine • The Decision Framework
              </h2>
              <h3 className={`${isMobilePreview ? 'text-lg' : 'text-xl sm:text-2xl'} font-extrabold text-[#0F1F1C] font-display`}>
                The Hierarchy of Priorities & 11 Criteria
              </h3>
              <p className="text-xs sm:text-sm text-[#3A4B47] mt-1">
                When principles compete, this ranked order governs all engineering and design decisions:
              </p>
            </div>

            {/* Hierarchy Ordered List */}
            <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
                Canonical Priority Ranking
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { rank: 1, label: 'User safety, privacy and trust', highlight: true },
                  { rank: 2, label: 'Functional correctness', highlight: true },
                  { rank: 3, label: 'Clarity and usability', highlight: false },
                  { rank: 4, label: 'Accessibility (WCAG 2.2 AA)', highlight: false },
                  { rank: 5, label: 'Performance and reliability', highlight: false },
                  { rank: 6, label: 'Consistency and maintainability', highlight: false },
                  { rank: 7, label: 'Visual refinement', highlight: false },
                  { rank: 8, label: 'Decorative expression', highlight: false }
                ].map((p) => (
                  <div
                    key={p.rank}
                    className={`flex items-center justify-between p-2.5 rounded ${
                      p.highlight ? 'bg-[#E7F3EF] border border-[#0E5A46]/30 font-bold text-[#0E5A46]' : 'bg-[#F7F7EE] text-[#0F1F1C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F1F1C] text-white flex items-center justify-center text-[10px] font-mono">
                        {p.rank}
                      </span>
                      <span>{p.label}</span>
                    </div>
                    {p.rank <= 2 && <span className="text-[10px] uppercase font-bold text-[#0E5A46]">Non-Negotiable</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* The 11 Evaluation Criteria */}
            <div className="p-5 bg-white rounded border border-[#C4C8C5] space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
                The 11 Decision Questions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { k: 'Purpose', q: 'What problem does this solve?' },
                  { k: 'User Value', q: 'Who benefits from this?' },
                  { k: 'Clarity', q: 'Does it make the experience easier to understand?' },
                  { k: 'Simplicity', q: 'Can it be achieved with less complexity?' },
                  { k: 'Functionality', q: 'Does it work as intended?' },
                  { k: 'Consistency', q: 'Does it fit the wider TOURMS system?' },
                  { k: 'Accessibility', q: 'Can different people use it effectively?' },
                  { k: 'Performance', q: 'Does it introduce unnecessary weight or delay?' },
                  { k: 'Trust', q: 'Is the information and behaviour honest?' },
                  { k: 'Maintainability', q: 'Can the product team support it properly?' },
                  { k: 'Scalability', q: 'Does it support sensible future growth?' }
                ].map((c, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#F7F7EE] border border-[#EBEBDD]">
                    <span className="font-bold text-[#0E5A46] block text-[11px] uppercase">{c.k}</span>
                    <span className="text-[#3A4B47]">{c.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Master Brand Architecture (from Brand Sheet section 10) */}
        <div className="p-5 sm:p-6 bg-white rounded border border-[#C4C8C5] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#EBEBDD] pb-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
                Master-Brand Architecture
              </h3>
              <p className="text-[11px] text-[#5A6E68]">One Mark. Many Expressions. Different Frequencies.</p>
            </div>
            <TourmsSymbol size={18} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded bg-[#F7F7EE] border border-[#EBEBDD] space-y-1">
              <p className="font-bold text-[#0F1F1C]">TOURMS</p>
              <p className="text-[11px] font-semibold text-[#0E5A46]">BIOFARMS</p>
              <span className="text-[9px] text-[#5A6E68] block">Commercial Production</span>
            </div>
            <div className="p-3 rounded bg-[#E7F3EF] border border-[#0E5A46]/30 space-y-1">
              <p className="font-bold text-[#0F1F1C]">TOURMS</p>
              <p className="text-[11px] font-bold text-[#0E5A46]">WORKFORCE</p>
              <span className="text-[9px] text-[#0E5A46] block font-semibold">(Powers Jobs & Capabilities)</span>
            </div>
            <div className="p-3 rounded bg-[#F7F7EE] border border-[#EBEBDD] space-y-1 opacity-75">
              <p className="font-bold text-[#0F1F1C]">TOURMS</p>
              <p className="text-[11px] font-semibold text-[#5A6E68]">ACADEMY</p>
              <span className="text-[9px] text-[#7A8B86] block">Future Horizon</span>
            </div>
            <div className="p-3 rounded bg-[#F7F7EE] border border-[#EBEBDD] space-y-1 opacity-75">
              <p className="font-bold text-[#0F1F1C]">TOURMS</p>
              <p className="text-[11px] font-semibold text-[#5A6E68]">FARM MANAGEMENT</p>
              <span className="text-[9px] text-[#7A8B86] block">Future Horizon</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 border-t border-[#C4C8C5] flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => onNavigate('/jobs')}
          >
            Explore Active Jobs
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => onNavigate('/worker/onboarding')}
          >
            Create Worker Capability Profile
          </Button>
          <Button
            variant="tertiary"
            size="md"
            className="w-full sm:w-auto text-[#0E5A46]"
            onClick={() => onNavigate('/insights')}
          >
            Read Agricultural Insights
          </Button>
        </div>
      </section>

      {/* Brand Identity Modal for high-res inspection */}
      <Modal
        isOpen={brandGuideModalOpen}
        onClose={() => setBrandGuideModalOpen(false)}
        title="TOURMS Brand Identity System & Comprehensive Specifications"
        description="Master Logo, Symbol Construction, Typography, Frequency Rhythms, and Real-World Applications"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-left">
          {/* Quick jump callout bar */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-[#3A4B47] pb-2 border-b border-[#EBEBDD]">
            <span className="font-bold text-[#0F1F1C]">Key Sections:</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">01 Master Logo</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">02 Symbol Construction</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">07 Colour System</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">08 Typography</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">09 Frequency Graphic System</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">10 Master-Brand Architecture</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7EE] border border-[#C4C8C5]">12 Real-World Applications</span>
          </div>

          <div className="overflow-auto max-h-[70vh] rounded border border-[#C4C8C5] bg-[#0F1F1C]">
            <img
              src="/public/assets/aistudio/ChatGPT_Image_Oct_31__2026__09_09_50_AM_947537e4.png"
              alt="TOURMS Brand System Comprehensive Sheet"
              className="w-full h-auto min-w-[640px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-[#5A6E68]">
              Verified Source: TOURMS Comprehensive Brand & Experience Doctrine
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBrandGuideModalOpen(false)}
            >
              Close Guidelines
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
