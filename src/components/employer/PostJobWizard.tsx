import React, { useState } from 'react';
import { JobListing, JobCategory, EmploymentType, Compensation } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

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
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    '• Manage day-to-day agricultural operations\n• Supervise field technicians\n• Track inputs and seasonal output'
  );
  const [skillsText, setSkillsText] = useState('Field Agronomy, Crop Scouting, Record Keeping');
  const [essentialRequirementsText, setEssentialRequirementsText] = useState(
    '• Minimum 2 years commercial field experience\n• Relevant agricultural degree or diploma'
  );
  const [desirableQualificationsText, setDesirableQualificationsText] = useState(
    '• Tractor implement operation\n• Valid driving license'
  );
  const [state, setState] = useState('Oyo');
  const [lga, setLga] = useState('Iseyin');
  const [siteAddress, setSiteAddress] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [duration, setDuration] = useState('12 Months Renewable');
  const [compType, setCompType] = useState<'fixed' | 'range' | 'negotiable'>('range');
  const [amountMin, setAmountMin] = useState(250000);
  const [amountMax, setAmountMax] = useState(350000);
  const [frequency, setFrequency] = useState<'month' | 'day' | 'week' | 'season' | 'project'>('month');
  const [compNotes, setCompNotes] = useState('Includes farm accommodation and meal allowance.');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [appInstructions, setAppInstructions] = useState(
    'Submit your Tourms capability profile with verified educational credentials attached.'
  );

  const availableLgas = getLgasForState(state);

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
    <div className="w-full text-left py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Mathematically Consistent 7-Stage Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#0E5A46] uppercase tracking-wider">
            Step {currentStep} of 7: {STAGES[currentStep - 1]}
          </span>
          <span className="text-[#5A6E68] tabular-nums">
            {Math.round((currentStep / 7) * 100)}% Completed
          </span>
        </div>

        <div className="w-full h-2 bg-[#EBEBDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0E5A46] transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5A6E68]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
          <span>All submissions undergo Tourms Verification Review before public listing.</span>
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 shadow-xs space-y-6">
        {/* Step 1 (Screen 11): Role Identity & Category */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 1: Job Identity & Classification
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Define the title and core agricultural sub-sector.
              </p>
            </div>

            <Input
              label="Role Title"
              required
              placeholder="e.g. Senior Agronomist — Commercial Cassava & Maize"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="Use a precise title describing actual agricultural work."
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
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 2: Role Description & Key Responsibilities
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Help agricultural professionals understand what they will actually do in the field.
              </p>
            </div>

            <Textarea
              label="Executive Role Summary"
              required
              rows={3}
              placeholder="e.g. Lead agronomic operations, soil fertility management, and planting schedules across 450 hectares..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <Textarea
              label="Key Responsibilities (One per line)"
              required
              rows={5}
              placeholder="• Manage seedbed preparation and planting density&#10;• Execute chemical spraying schedules&#10;• Supervise tractor operators"
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              helperText="Enter each concrete task on a new line."
            />
          </div>
        )}

        {/* Step 3 (Screen 13): Required Skills & Capabilities */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 3: Required Skills & Technical Capabilities
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                What practical capabilities are required to perform this job successfully?
              </p>
            </div>

            <Input
              label="Skills & Tools (Comma-separated)"
              required
              placeholder="e.g. Field Agronomy, Boom Sprayer Calibration, QGIS Mapping"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              helperText="These keywords are used to match worker capability profiles."
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
                Distinguish essential requirements from desirable qualifications.
              </p>
            </div>

            <Textarea
              label="Essential Requirements (One per line)"
              required
              rows={4}
              value={essentialRequirementsText}
              onChange={(e) => setEssentialRequirementsText(e.target.value)}
              placeholder="• B.Agric in Agronomy or Crop Science&#10;• Minimum 3 years commercial farming experience"
            />

            <Textarea
              label="Desirable Qualifications (Optional, one per line)"
              rows={3}
              value={desirableQualificationsText}
              onChange={(e) => setDesirableQualificationsText(e.target.value)}
              placeholder="• Valid Nigerian driving license&#10;• Experience with drip irrigation"
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
              placeholder="e.g. Kilometre 14, Iseyin-Oyo Road"
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
                placeholder="e.g. Permanent or 8-Month Harvest Window"
              />
            </div>
          </div>
        )}

        {/* Step 6 (Screen 14c): Compensation & Terms */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                Stage 6: Compensation & Benefits
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Transparent remuneration in Nigerian Naira (NGN).
              </p>
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
              placeholder="e.g. Free on-site housing, performance bonus based on yield..."
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
                Inspect your submission before routing it to the Tourms Editorial & Verification Desk.
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
                  ₦{amountMin.toLocaleString()} {compType === 'range' ? `– ₦${amountMax.toLocaleString()}` : ''} / {frequency}
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

        {/* Action Buttons */}
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
    </div>
  );
};
