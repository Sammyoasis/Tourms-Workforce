import React, { useState } from 'react';
import { JobListing, JobCategory, EmploymentType, Compensation } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Wand2,
  Briefcase,
  Shield,
  Wrench,
  Coins,
  Copy,
  Check,
  MapPin,
  Calendar,
  Users,
  Info,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { generateJobDemandWithAI, AIJobDemandResult } from '../../services/aiAgriService';

export interface PostJobWizardProps {
  initialStep?: number;
  onComplete: (newJob: Partial<JobListing>) => void;
  onCancel: () => void;
  employerName: string;
  employerId: string;
}

const STAGES = [
  'Role Identity & Category',
  'Description & Responsibilities',
  'Required Skills & Capabilities',
  'Eligibility & Qualifications',
  'Location, Timing & Duration',
  'Compensation & Terms',
  'Review & Submit for Review'
];

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

export const PostJobWizard: React.FC<PostJobWizardProps> = ({
  initialStep = 1,
  onComplete,
  onCancel,
  employerName,
  employerId
}) => {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Form State across the 7 stages
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobCategory>('Crop Production');
  const [summary, setSummary] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [essentialRequirementsText, setEssentialRequirementsText] = useState('');
  const [desirableQualificationsText, setDesirableQualificationsText] = useState('');
  const [state, setState] = useState(ALL_STATE_NAMES[0]);
  const [lga, setLga] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [duration, setDuration] = useState('');
  const [compType, setCompType] = useState<'fixed' | 'range' | 'negotiable'>('range');
  const [amountMin, setAmountMin] = useState<number | undefined>(undefined);
  const [amountMax, setAmountMax] = useState<number | undefined>(undefined);
  const [frequency, setFrequency] = useState<'month' | 'day' | 'week' | 'season' | 'project'>('month');
  const [compNotes, setCompNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [appInstructions, setAppInstructions] = useState('');

  // Dedicated AI Job Drafter State
  const [isAIDrafterOpen, setIsAIDrafterOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTargetState, setAiTargetState] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedInfo, setAiGeneratedInfo] = useState<AIJobDemandResult | null>(null);
  const [hasCopiedText, setHasCopiedText] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'all' | 'responsibilities' | 'safety' | 'equipment' | 'wages'>('all');

  const availableLgas = getLgasForState(state);

  const samplePrompts = [
    {
      label: '🌾 Niger Grain Harvest',
      prompt: 'Need 8 harvesters and 1 combine driver in Niger State for 3 weeks',
      state: 'Niger'
    },
    {
      label: '🚜 Kaduna Boom Sprayers',
      prompt: 'Need 4 boom sprayers and calibration lead in Kaduna for 10 days',
      state: 'Kaduna'
    },
    {
      label: '🐔 Oyo Poultry Operations',
      prompt: 'Urgent commercial poultry vaccinator & flock supervisor in Oyo for 5,000 broilers',
      state: 'Oyo'
    },
    {
      label: '💧 Benue Irrigation Specialist',
      prompt: 'Drip and center-pivot irrigation lead for dry season hybrid maize in Benue for 6 months',
      state: 'Benue'
    },
    {
      label: '🐟 Delta Aquaculture Tech',
      prompt: 'Catfish and tilapia hatchery technician in Delta State for intensive broodstock breeding',
      state: 'Delta'
    }
  ];

  const handleAIDraft = async (customPrompt?: string, customState?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    const stateToUse = customState !== undefined ? customState : aiTargetState;
    if (!promptToUse.trim()) return;

    setIsGeneratingAI(true);
    try {
      const result = await generateJobDemandWithAI(promptToUse, stateToUse || undefined);
      setAiGeneratedInfo(result);

      addToast({
        type: 'success',
        title: 'Demand Draft Generated',
        message: `Drafted specification with ${result.state} State wage benchmarks & safety protocols.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'AI Draft Generation Failed',
        message: 'Could not draft listing. Please check input.'
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyDraftToWizard = (resultToApply?: AIJobDemandResult) => {
    const result = resultToApply || aiGeneratedInfo;
    if (!result) return;

    setTitle(result.title);
    setCategory(result.category);
    setSummary(result.summary);

    // Formatted responsibilities & safety guidelines for Stage 2
    const formattedResp = [
      'OPERATIONAL RESPONSIBILITIES:',
      ...result.responsibilities.map((r) => `• ${r}`),
      '',
      'FARM SAFETY GUIDELINES & PROTOCOLS:',
      ...result.safetyGuidelines.map((s) => `• ${s}`)
    ].join('\n');
    setResponsibilitiesText(formattedResp);

    // Skills & equipment proficiencies for Stage 3
    const combinedSkills = Array.from(
      new Set([...result.skills, ...result.equipmentRequirements.map((eq) => eq.split('(')[0].trim())])
    ).join(', ');
    setSkillsText(combinedSkills);

    // Essential & desirable for Stage 4
    setEssentialRequirementsText(result.essentialRequirements.map((r) => `• ${r}`).join('\n'));
    setDesirableQualificationsText(result.desirableQualifications.map((d) => `• ${d}`).join('\n'));

    // Location & timing for Stage 5
    setState(result.state);
    setLga(result.lga);
    setEmploymentType(result.employmentType);
    setDuration(result.duration);

    // Compensation & terms for Stage 6
    setAmountMin(result.amountMin);
    setAmountMax(result.amountMax);
    setFrequency(result.frequency);
    setCompType('range');
    const enrichedNotes = `${result.compNotes} [Wage Benchmark: ${result.wageBenchmark?.dailyRateEstimate || 'State verified'} / day equivalent]`;
    setCompNotes(enrichedNotes);

    setIsAIDrafterOpen(false);
    addToast({
      type: 'success',
      title: 'AI Draft Applied to Wizard',
      message: `All 7 steps updated with ${result.state} State wage benchmarks, equipment specs, and safety guidelines.`
    });
  };

  const handleCopyDraftText = () => {
    if (!aiGeneratedInfo) return;
    const fullText = `
ROLE: ${aiGeneratedInfo.title}
CATEGORY: ${aiGeneratedInfo.category}
LOCATION: ${aiGeneratedInfo.lga} LGA, ${aiGeneratedInfo.state} State
CONTRACT: ${aiGeneratedInfo.employmentType} (${aiGeneratedInfo.duration})
COMPENSATION BENCHMARK: ₦${aiGeneratedInfo.amountMin.toLocaleString()} – ₦${aiGeneratedInfo.amountMax.toLocaleString()} / ${aiGeneratedInfo.frequency} (${aiGeneratedInfo.wageBenchmark?.dailyRateEstimate || 'Local rate'})

SUMMARY:
${aiGeneratedInfo.summary}

KEY RESPONSIBILITIES:
${aiGeneratedInfo.responsibilities.map((r) => `• ${r}`).join('\n')}

FARM SAFETY GUIDELINES:
${aiGeneratedInfo.safetyGuidelines.map((s) => `• ${s}`).join('\n')}

EQUIPMENT & MACHINERY REQUIREMENTS:
${aiGeneratedInfo.equipmentRequirements.map((e) => `• ${e}`).join('\n')}

REQUIRED SKILLS & TOOLS:
${aiGeneratedInfo.skills.join(', ')}

ESSENTIAL REQUIREMENTS:
${aiGeneratedInfo.essentialRequirements.map((er) => `• ${er}`).join('\n')}

WAGE BENCHMARK DETAILS (${aiGeneratedInfo.wageBenchmark?.marketTier || aiGeneratedInfo.state}):
- Daily Rate Estimate: ${aiGeneratedInfo.wageBenchmark?.dailyRateEstimate}
- Monthly Equivalent: ${aiGeneratedInfo.wageBenchmark?.monthlyEquivalent}
- Notes: ${aiGeneratedInfo.wageBenchmark?.notes}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setHasCopiedText(true);
    setTimeout(() => setHasCopiedText(false), 2500);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Complete agricultural demand copied to clipboard.'
    });
  };

  const handleNext = () => {
    // Stage validation
    if (currentStep === 1 && !title.trim()) {
      addToast({ type: 'error', title: 'Role title required', message: 'Specify the agricultural role title.' });
      return;
    }
    if (currentStep === 2 && (!summary.trim() || !responsibilitiesText.trim())) {
      addToast({ type: 'error', title: 'Summary required', message: 'Provide a brief summary and core duties.' });
      return;
    }
    if (currentStep === 5 && (!state || !lga)) {
      addToast({ type: 'error', title: 'Location required', message: 'Select the operational State and LGA.' });
      return;
    }
    if (currentStep === 6 && compType !== 'negotiable' && (!amountMin || amountMin <= 0)) {
      addToast({ type: 'error', title: 'Compensation required', message: 'Specify valid Nigerian Naira compensation.' });
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Stage 7: Submit for Review
      const newJob: Partial<JobListing> = {
        id: `job-${Date.now()}`,
        title: title.trim(),
        organisation: employerName,
        employerId: employerId,
        employerVerified: true,
        category,
        employmentType,
        duration,
        location: {
          state,
          lga,
          farmSiteOrAddress: siteAddress
        },
        compensation: {
          type: compType,
          amountMin,
          amountMax: compType === 'range' ? amountMax : amountMin,
          currency: 'NGN',
          frequency,
          notes: compNotes
        },
        summary: summary.trim(),
        responsibilities: responsibilitiesText.split('\n').filter((l) => l.trim().length > 0),
        essentialRequirements: essentialRequirementsText.split('\n').filter((l) => l.trim().length > 0),
        desirableQualifications: desirableQualificationsText.split('\n').filter((l) => l.trim().length > 0),
        skills: skillsText.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        applicationInstructions: appInstructions,
        deadline,
        postedDate: new Date().toISOString().split('T')[0],
        status: 'awaiting_review', // Queued for admin review!
        totalApplicationsCount: 0
      };

      onComplete(newJob);
      addToast({
        type: 'success',
        title: 'Job Submitted for Review',
        message: 'Your job requirement has been placed in the Tourms editorial review queue.'
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  return (
    <div className="w-full text-left py-6 sm:py-8 md:py-12 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Header Bar with Step Counter & Dedicated AI Job Drafter Trigger */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#0E5A46] uppercase tracking-wider text-[11px] sm:text-xs font-bold">
                Step {currentStep} of 7: {STAGES[currentStep - 1]}
              </span>
              <span className="text-[#5A6E68] text-[11px] sm:text-xs">
                ({Math.round((currentStep / 7) * 100)}% Complete)
              </span>
            </div>
            <p className="text-xs text-[#5A6E68] mt-0.5">
              TOURMS Commercial Agricultural Workforce Requisition
            </p>
          </div>

          {/* Prominent Dedicated AI Drafter Tool Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsAIDrafterOpen(true);
              if (!aiGeneratedInfo) {
                handleAIDraft();
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-gradient-to-r from-[#0E5A46] to-[#164E40] text-white text-xs font-semibold hover:shadow-md transition-all shrink-0 cursor-pointer border border-[#0E5A46]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6C687] animate-pulse" />
            <span>AI Job Drafter</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-medium">
              Standard
            </span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#EBEBDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0E5A46] transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        {/* AI Drafter Applied Notice (if draft is currently active) */}
        {aiGeneratedInfo && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#F2F7F4] border border-[#C2DDD3] rounded text-xs text-[#0E5A46]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E5A46] shrink-0" />
              <span>
                <strong>AI Specification Active:</strong> {aiGeneratedInfo.title} (
                {aiGeneratedInfo.wageBenchmark?.state || aiGeneratedInfo.state} State Benchmark Applied)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAIDrafterOpen(true)}
              className="text-[11px] underline font-semibold hover:text-[#08382B] cursor-pointer"
            >
              Reopen AI Drafter Breakdown
            </button>
          </div>
        )}
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 shadow-xs space-y-5 sm:space-y-6 overflow-hidden break-words">
        {/* Step 1 (Screen 11): Role Identity & Category */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                  Stage 1: Role Identity & Category
                </h2>
                <p className="text-xs text-[#5A6E68] mt-1">
                  Define your agricultural position or let the AI Job Drafter compile all 7 steps automatically.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Wand2 className="w-3.5 h-3.5 text-[#C98A3A]" />}
                onClick={() => setIsAIDrafterOpen(true)}
                className="shrink-0 border-[#0E5A46] text-[#0E5A46] bg-[#F2F7F4]"
              >
                Launch AI Job Drafter Tool
              </Button>
            </div>

            {/* Quick AI Drafter Inline Box */}
            <div className="p-4 bg-gradient-to-br from-[#F2F7F4] via-[#F8FAF9] to-white rounded border border-[#C2DDD3] space-y-3 text-xs text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                  <Sparkles className="w-4 h-4 text-[#C98A3A]" />
                  <span>AI Job Drafter: Quick Synthesis</span>
                </div>
                <span className="text-[10px] bg-[#0E5A46] text-white font-semibold px-2 py-0.5 rounded">
                  TOURMS Intelligence
                </span>
              </div>

              <p className="text-[#3A4B47] text-[11px] leading-relaxed">
                Provide a quick phrase describing your farm labor need. The AI compiles responsibilities, safety guidelines, equipment requirements, and local Nigerian wage benchmarks.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Need 8 harvesters and 1 combine driver in Niger State for 3 weeks"
                  className="flex-1 bg-white border border-[#C4C8C5] rounded px-3 py-2 text-xs text-[#0F1F1C] focus:outline-none focus:ring-1 focus:ring-[#0E5A46]"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                  onClick={async () => {
                    await handleAIDraft();
                    setIsAIDrafterOpen(true);
                  }}
                  className="shrink-0 justify-center"
                >
                  {isGeneratingAI ? 'Generating...' : 'Draft with AI'}
                </Button>
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#5A6E68] font-semibold">Try sample:</span>
                {samplePrompts.slice(0, 3).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={async () => {
                      setAiPrompt(preset.prompt);
                      setAiTargetState(preset.state);
                      await handleAIDraft(preset.prompt, preset.state);
                      setIsAIDrafterOpen(true);
                    }}
                    className="text-[10px] px-2 py-0.5 bg-white hover:bg-[#EBEBDD] text-[#0E5A46] border border-[#C2DDD3] rounded truncate max-w-[220px] cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Role Title"
              required
              placeholder="e.g. Commercial Combine Harvester Operator & Field Lead"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="Use a clear, operational title describing field duties."
            />

            <Select
              label="Agricultural Sector / Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as JobCategory)}
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            />

            <Input
              label="Employing Organisation"
              disabled
              value={employerName}
              helperText="Verified against your active CAC employer profile."
            />
          </div>
        )}

        {/* Step 2 (Screen 12): Description & Responsibilities */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F1F1C]">
                  Stage 2: Role Description & Key Responsibilities
                </h2>
                <p className="text-xs text-[#5A6E68] mt-1">
                  Detail everyday field tasks, crop operations, and farm safety protocols.
                </p>
              </div>

              {aiGeneratedInfo && (
                <span className="text-[10px] bg-[#F2F7F4] text-[#0E5A46] border border-[#C2DDD3] px-2 py-1 rounded font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C98A3A]" />
                  AI Safety Protocols Included
                </span>
              )}
            </div>

            <Textarea
              label="Executive Role Summary"
              required
              rows={3}
              placeholder="e.g. Lead commercial harvest operations and machinery calibration across 350 hectares..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <Textarea
              label="Key Responsibilities & Farm Safety Guidelines"
              required
              rows={7}
              placeholder="• Execute mechanized field operations&#10;• Perform daily pre-start checks&#10;• Mandatory high-visibility gear & hydration pauses"
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              helperText="Includes operational field duties alongside mandatory agricultural health and safety protocols."
            />
          </div>
        )}

        {/* Step 3 (Screen 13): Required Skills & Capabilities */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F1F1C]">
                  Stage 3: Required Skills & Equipment Capabilities
                </h2>
                <p className="text-xs text-[#5A6E68] mt-1">
                  Specify mechanical proficiencies, implement calibrations, and tools needed.
                </p>
              </div>

              {aiGeneratedInfo && (
                <span className="text-[10px] bg-[#F2F7F4] text-[#0E5A46] border border-[#C2DDD3] px-2 py-1 rounded font-semibold flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-[#0E5A46]" />
                  Machinery Specs Integrated
                </span>
              )}
            </div>

            <Input
              label="Skills & Machinery Tools (Comma-separated)"
              required
              placeholder="e.g. Combine Harvester Operation, Hydraulic Header Calibration, Grain Loss Sampling, GPS Swath Guidance"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              helperText="These keywords drive our semantic candidate matching engine."
            />
          </div>
        )}

        {/* Step 4 (Screen 14): Eligibility & Qualifications */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 4: Eligibility & Qualifications
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Distinguish essential baseline competencies from desirable bonus qualifications.
              </p>
            </div>

            <Textarea
              label="Essential Requirements (One per line)"
              required
              rows={4}
              value={essentialRequirementsText}
              onChange={(e) => setEssentialRequirementsText(e.target.value)}
              placeholder="• Minimum 3 years verifiable experience operating commercial combine harvesters&#10;• Valid driver license"
            />

            <Textarea
              label="Desirable Qualifications (Optional, one per line)"
              rows={3}
              value={desirableQualificationsText}
              onChange={(e) => setDesirableQualificationsText(e.target.value)}
              placeholder="• NABTEB Agricultural Mechanics Certificate or Trade Test&#10;• Experience with dry-season paddy rice"
            />
          </div>
        )}

        {/* Step 5 (Screen 14b): Location, Timing & Duration */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 5: Location, Schedule & Duration
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Where is the farm or facility situated in Nigeria?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="State (36 States & FCT)"
                required
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setLga('');
                }}
                options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
              />

              <Select
                label={`LGA in ${state}`}
                required
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                options={availableLgas.map((l) => ({ value: l, label: l }))}
              />
            </div>

            <Input
              label="Farm Site / Physical Facility Address (Optional)"
              placeholder="e.g. Kilometre 14, Mokwa-Bida Highway"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))}
              />
              <Input
                label="Contract Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Weeks Intensive Operations"
              />
            </div>
          </div>
        )}

        {/* Step 6 (Screen 14c): Compensation & Terms */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0F1F1C]">
                  Stage 6: Compensation & Local Wage Benchmarks
                </h2>
                <p className="text-xs text-[#5A6E68] mt-1">
                  Transparent remuneration calibrated for Nigerian state agro-ecological hubs.
                </p>
              </div>

              {aiGeneratedInfo?.wageBenchmark && (
                <span className="text-[10px] bg-[#F2F7F4] text-[#0E5A46] border border-[#C2DDD3] px-2 py-1 rounded font-semibold flex items-center gap-1">
                  <Coins className="w-3 h-3 text-[#C98A3A]" />
                  {aiGeneratedInfo.wageBenchmark.dailyRateEstimate}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Compensation Structure"
                value={compType}
                onChange={(e) => setCompType(e.target.value as any)}
                options={[
                  { value: 'range', label: 'Salary Range (Min - Max)' },
                  { value: 'fixed', label: 'Fixed Amount' },
                  { value: 'negotiable', label: 'Negotiable / Market Rate' }
                ]}
              />

              <Input
                label="Minimum / Base Amount (NGN)"
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(Number(e.target.value))}
              />

              {compType === 'range' && (
                <Input
                  label="Maximum Amount (NGN)"
                  type="number"
                  value={amountMax}
                  onChange={(e) => setAmountMax(Number(e.target.value))}
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Payment Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                options={[
                  { value: 'month', label: 'Per Month' },
                  { value: 'day', label: 'Per Day' },
                  { value: 'week', label: 'Per Week' },
                  { value: 'season', label: 'Per Season' },
                  { value: 'project', label: 'Per Project' }
                ]}
              />

              <Input
                label="Application Closing Deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <Textarea
              label="Compensation Notes & Allowances"
              rows={2}
              value={compNotes}
              onChange={(e) => setCompNotes(e.target.value)}
              placeholder="e.g. Catered farm settlement accommodation, diesel stipend, and daily field hazard allowance..."
            />
          </div>
        )}

        {/* Step 7 (Screen 15): Review & Submit */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 7: Final Inspection & Review
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Inspect your requisition before routing it to the Tourms Editorial & Verification Desk.
              </p>
            </div>

            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Job Title:</span>
                <span className="font-bold text-[#0F1F1C]">{title}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Sector:</span>
                <span className="font-bold text-[#0E5A46]">{category}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Location:</span>
                <span className="font-bold text-[#0F1F1C]">{state}, {lga}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Contract:</span>
                <span className="font-bold text-[#0F1F1C]">{employmentType} ({duration})</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Compensation:</span>
                <span className="font-bold text-[#8E5A18] tabular-nums">
                  ₦{(amountMin ?? 0).toLocaleString()} {compType === 'range' && amountMax != null ? `– ₦${amountMax.toLocaleString()}` : ''} / {frequency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6E68]">Deadline:</span>
                <span className="font-bold text-[#0F1F1C]">{deadline}</span>
              </div>
            </div>

            <div className="p-4 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs text-[#08382B] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
                <span>Verification Policy Notice</span>
              </p>
              <p>
                Jobs are not published instantly. In compliance with Tourms trust guidelines, an operations officer will verify the employer standing, wage fairness, and work description within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="pt-6 border-t border-[#EBEBDD] flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous Stage'}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            rightIcon={currentStep < 7 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          >
            {currentStep < 7 ? 'Continue to Next Stage' : 'SUBMIT FOR REVIEW'}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DEDICATED AI JOB DRAFTER TOOL MODAL                                       */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAIDrafterOpen}
        onClose={() => setIsAIDrafterOpen(false)}
        maxWidth="2xl"
      >
        <div className="space-y-5 text-left text-xs">
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-[#EBEBDD] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#F2F7F4] text-[#0E5A46] rounded border border-[#C2DDD3]">
                  <Sparkles className="w-4 h-4 text-[#C98A3A]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F1F1C]">
                    AI Job Drafter
                  </h3>
                  <p className="text-[11px] text-[#5A6E68]">
                    Powered by TOURMS Nigerian Agro-Ecological Intelligence
                  </p>
                </div>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] bg-[#E2EFE9] text-[#0E5A46] font-bold px-2 py-0.5 rounded border border-[#C2DDD3]">
              TOURMS Engine
            </span>
          </div>

          {/* Prompt Input Section */}
          <div className="space-y-3 bg-[#F8FAF9] p-3.5 rounded border border-[#C2DDD3]">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F1F1C] block">
                Describe your agricultural workforce requirement:
              </label>
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Need 8 harvesters and 1 combine driver in Niger State for 3 weeks"
                className="w-full bg-white border border-[#C4C8C5] rounded p-2.5 text-xs text-[#0F1F1C] focus:outline-none focus:ring-1 focus:ring-[#0E5A46]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#5A6E68] whitespace-nowrap">Target State:</span>
                <select
                  value={aiTargetState}
                  onChange={(e) => setAiTargetState(e.target.value)}
                  className="bg-white border border-[#C4C8C5] rounded px-2 py-1 text-xs text-[#0F1F1C]"
                >
                  <option value="">Auto-Detect from Phrase</option>
                  {ALL_STATE_NAMES.map((st) => (
                    <option key={st} value={st}>
                      {st} State
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isGeneratingAI || !aiPrompt.trim()}
                leftIcon={isGeneratingAI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-[#E6C687]" />}
                onClick={() => handleAIDraft()}
                className="justify-center"
              >
                {isGeneratingAI ? 'Synthesizing Agro Demand...' : 'Generate Complete Demand'}
              </Button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="space-y-1 pt-1 border-t border-[#E2EFE9]">
              <span className="text-[10px] text-[#5A6E68] font-semibold block">Quick Examples:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAiPrompt(preset.prompt);
                      setAiTargetState(preset.state);
                      handleAIDraft(preset.prompt, preset.state);
                    }}
                    className="text-[10px] px-2 py-1 bg-white hover:bg-[#EBEBDD] text-[#0E5A46] border border-[#C2DDD3] rounded transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Breakdown Card (If Generated) */}
          {aiGeneratedInfo ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Generated Role Banner */}
              <div className="p-3 bg-gradient-to-r from-[#0E5A46]/10 to-[#C98A3A]/10 rounded border border-[#0E5A46]/20 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#0E5A46]">
                    Synthesized Requisition
                  </span>
                  <span className="text-[10px] font-semibold text-[#8E5A18]">
                    {aiGeneratedInfo.category} • {aiGeneratedInfo.employmentType} ({aiGeneratedInfo.duration})
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#0F1F1C]">
                  {aiGeneratedInfo.title}
                </h4>
                <p className="text-[11px] text-[#3A4B47] leading-relaxed">
                  {aiGeneratedInfo.summary}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] text-[#5A6E68]">
                  <span className="flex items-center gap-1 font-semibold text-[#0E5A46]">
                    <MapPin className="w-3 h-3" />
                    {aiGeneratedInfo.lga} LGA, {aiGeneratedInfo.state} State
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#5A6E68]" />
                    {aiGeneratedInfo.workersNeeded} Workers Required
                  </span>
                  <span className="text-[#8E5A18]">
                    {aiGeneratedInfo.aiRationale}
                  </span>
                </div>
              </div>

              {/* Pillar Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1 border-b border-[#EBEBDD] pb-1">
                {[
                  { id: 'all', label: 'All 4 Pillars' },
                  { id: 'responsibilities', label: '1. Responsibilities' },
                  { id: 'safety', label: '2. Safety Protocols' },
                  { id: 'equipment', label: '3. Equipment Specs' },
                  { id: 'wages', label: '4. Wage Benchmark' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePreviewTab(tab.id as any)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-t transition cursor-pointer ${
                      activePreviewTab === tab.id
                        ? 'bg-[#0E5A46] text-white'
                        : 'bg-[#F2F7F4] text-[#0E5A46] hover:bg-[#E2EFE9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* The 4 Distinct Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pillar 1: Responsibilities */}
                {(activePreviewTab === 'all' || activePreviewTab === 'responsibilities') && (
                  <div className="p-3 bg-white rounded border border-[#C2DDD3] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                      <Briefcase className="w-3.5 h-3.5 text-[#0E5A46]" />
                      <span>1. Key Operational Responsibilities</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-[#2D3F3B]">
                      {aiGeneratedInfo.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#0E5A46] font-bold">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pillar 2: Safety Guidelines */}
                {(activePreviewTab === 'all' || activePreviewTab === 'safety') && (
                  <div className="p-3 bg-[#FCF9F2] rounded border border-[#E8D6B5] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#8E5A18]">
                      <Shield className="w-3.5 h-3.5 text-[#C98A3A]" />
                      <span>2. Farm Safety Guidelines & Protocols</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-[#42331C]">
                      {aiGeneratedInfo.safetyGuidelines.map((safety, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#C98A3A] font-bold">⚠</span>
                          <span>{safety}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pillar 3: Equipment Requirements */}
                {(activePreviewTab === 'all' || activePreviewTab === 'equipment') && (
                  <div className="p-3 bg-white rounded border border-[#C2DDD3] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                      <Wrench className="w-3.5 h-3.5 text-[#0E5A46]" />
                      <span>3. Equipment & Machinery Requirements</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-[#2D3F3B]">
                      {aiGeneratedInfo.equipmentRequirements.map((eq, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#0E5A46] font-bold">⚙</span>
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pillar 4: Estimated Local Wage Benchmarks */}
                {(activePreviewTab === 'all' || activePreviewTab === 'wages') && (
                  <div className="p-3 bg-[#F2F7F4] rounded border border-[#C2DDD3] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                        <Coins className="w-3.5 h-3.5 text-[#C98A3A]" />
                        <span>4. Nigerian State Wage Benchmark</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#0E5A46] bg-white px-1.5 py-0.5 rounded border border-[#C2DDD3]">
                        {aiGeneratedInfo.wageBenchmark?.state || aiGeneratedInfo.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="bg-white p-2 rounded border border-[#C2DDD3]">
                        <span className="text-[10px] text-[#5A6E68] block">Daily Rate Estimate</span>
                        <span className="text-xs font-bold text-[#8E5A18]">
                          {aiGeneratedInfo.wageBenchmark?.dailyRateEstimate || '₦8,000 – ₦12,000 / day'}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded border border-[#C2DDD3]">
                        <span className="text-[10px] text-[#5A6E68] block">Monthly Equivalent</span>
                        <span className="text-xs font-bold text-[#0E5A46]">
                          {aiGeneratedInfo.wageBenchmark?.monthlyEquivalent || '₦200,000 – ₦280,000 / mo'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#5A6E68] leading-tight pt-1">
                      {aiGeneratedInfo.compNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#EBEBDD]">
                <button
                  type="button"
                  onClick={handleCopyDraftText}
                  className="flex items-center gap-1.5 text-xs text-[#5A6E68] hover:text-[#0E5A46] font-medium cursor-pointer"
                >
                  {hasCopiedText ? <Check className="w-3.5 h-3.5 text-[#0E5A46]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedText ? 'Copied to Clipboard!' : 'Copy Full Specification'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAIDrafterOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    onClick={() => handleApplyDraftToWizard()}
                    className="bg-[#0E5A46] hover:bg-[#08382B]"
                  >
                    Apply to All 7 Steps of Wizard
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#5A6E68] space-y-2">
              <Info className="w-8 h-8 text-[#C2DDD3] mx-auto" />
              <p className="text-xs">
                Enter your farm requisition prompt above or click one of the quick suggestions, then click "Generate Complete Demand" to inspect the 4 pillars.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
