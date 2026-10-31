import React, { useState } from 'react';
import { WorkerProfile, EvidenceLevel, EmploymentType } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, FileCheck, User } from 'lucide-react';

export interface WorkerOnboardingProps {
  initialProfile: WorkerProfile;
  onComplete: (profile: WorkerProfile) => void;
  onCancel: () => void;
}

const STEPS = [
  'Identity',
  'Location',
  'Capabilities',
  'Education',
  'Experience',
  'Certifications',
  'Availability',
  'Review'
];

export const WorkerOnboarding: React.FC<WorkerOnboardingProps> = ({
  initialProfile,
  onComplete,
  onCancel
}) => {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WorkerProfile>(initialProfile);

  // New capability buffer
  const [newCapTitle, setNewCapTitle] = useState('');
  const [newCapDesc, setNewCapDesc] = useState('');
  const [newCapEvidence, setNewCapEvidence] = useState<EvidenceLevel>('self_reported');

  // New skill buffer
  const [newSkill, setNewSkill] = useState('');

  const lgas = getLgasForState(formData.location.state);

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.headline.trim()) {
        addToast({
          type: 'error',
          title: 'Missing information',
          message: 'Please provide your full legal name and professional headline.'
        });
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.location.state || !formData.location.lga) {
        addToast({
          type: 'error',
          title: 'Location required',
          message: 'Please select your primary operational Nigerian State and LGA.'
        });
        return;
      }
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      onComplete(formData);
      addToast({
        type: 'success',
        title: 'Profile Published',
        message: 'Your Tourms capability profile is now ready for employer discovery.'
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

  const addCapability = () => {
    if (!newCapTitle.trim() || !newCapDesc.trim()) {
      addToast({
        type: 'error',
        title: 'Capability details required',
        message: 'Specify both the capability title and a concrete description of your work.'
      });
      return;
    }
    const newCap = {
      id: `cap-${Date.now()}`,
      title: newCapTitle.trim(),
      description: newCapDesc.trim(),
      evidenceLevel: newCapEvidence
    };
    setFormData((prev) => ({
      ...prev,
      capabilities: [...prev.capabilities, newCap]
    }));
    setNewCapTitle('');
    setNewCapDesc('');
    setNewCapEvidence('self_reported');
  };

  const addSkillTag = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const removeSkillTag = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  return (
    <div className="w-full text-left py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Step Progress Tracker */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#5A6E68]">
          <span className="text-[#0E5A46] uppercase tracking-wider">
            Step {currentStep} of 8: {STEPS[currentStep - 1]}
          </span>
          <span className="tabular-nums">
            {Math.round((currentStep / 8) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#EBEBDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0E5A46] transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        <p className="text-xs text-[#5A6E68]">
          Capability-first worker registry. Self-reported details are clearly separated from verified institutional documents.
        </p>
      </div>

      {/* Step Form Card */}
      <div className="bg-white border border-[#C4C8C5] rounded p-6 md:p-8 shadow-xs space-y-6">
        {/* Step 1: Basic Identity */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">1. Basic Professional Identity</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Provide your primary agricultural focus and legal contact information.
              </p>
            </div>

            <Input
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Ibrahim Babatunde Alabi"
            />

            <Input
              label="Professional Headline"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Commercial Agronomist & Mechanized Crop Operations Specialist"
              helperText="Focus on your primary field specialization, not just a generic title."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 803 000 0000"
              />
            </div>

            <Textarea
              label="Professional Summary"
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief overview of crops cultivated, livestock managed, or equipment operated..."
            />
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">2. Primary Operational Location</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Select where you are currently based in Nigeria.
              </p>
            </div>

            <Select
              label="State (36 States & FCT)"
              required
              value={formData.location.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { state: e.target.value, lga: '' }
                })
              }
              options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
            />

            <Select
              label={`Local Government Area in ${formData.location.state}`}
              required
              value={formData.location.lga}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, lga: e.target.value }
                })
              }
              options={lgas.map((lga) => ({ value: lga, label: lga }))}
            />

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#0F1F1C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.willingToRelocate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        willingToRelocate: e.target.checked
                      }
                    })
                  }
                  className="rounded border-[#C4C8C5] text-[#0E5A46] focus:ring-[#0E5A46] w-4 h-4"
                />
                <span>Willing to relocate across agricultural corridors in Nigeria</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Capabilities & Skills */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">
                3. What Can You Actually Do? (Capabilities)
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Describe practical technical competencies. Avoid abstract buzzwords.
              </p>
            </div>

            {/* List existing capabilities */}
            <div className="space-y-3">
              {formData.capabilities.map((cap, i) => (
                <div key={cap.id} className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F1F1C]">{cap.title}</span>
                    <span className="text-[11px] font-semibold text-[#0E5A46]">
                      {cap.evidenceLevel === 'institutional_credential'
                        ? 'Institutional Credential'
                        : cap.evidenceLevel === 'verified_document'
                        ? 'Verified Document'
                        : 'Self-Reported'}
                    </span>
                  </div>
                  <p className="text-xs text-[#3A4B47]">{cap.description}</p>
                </div>
              ))}
            </div>

            {/* Add capability mini-form */}
            <div className="p-4 border border-[#C4C8C5] rounded space-y-3 bg-white">
              <p className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
                Add Specific Capability
              </p>
              <Input
                label="Capability Title"
                placeholder="e.g. Tractor Implement Rigging & Seed Drill Calibration"
                value={newCapTitle}
                onChange={(e) => setNewCapTitle(e.target.value)}
              />
              <Textarea
                label="What did you actually achieve or operate?"
                rows={2}
                placeholder="e.g. Calibrated 18-meter boom sprayer for 300 hectares with zero crop scorching..."
                value={newCapDesc}
                onChange={(e) => setNewCapDesc(e.target.value)}
              />
              <Select
                label="Evidence Level"
                value={newCapEvidence}
                onChange={(e) => setNewCapEvidence(e.target.value as EvidenceLevel)}
                options={[
                  { value: 'self_reported', label: 'Self-Reported (No document attached)' },
                  { value: 'verified_document', label: 'Verified Document (Logbook/Letter)' },
                  { value: 'institutional_credential', label: 'Institutional Credential (NASC, IITA, etc.)' }
                ]}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCapability}>
                + Add Capability Item
              </Button>
            </div>

            {/* Skills tag editor */}
            <div className="space-y-2 pt-2 border-t border-[#EBEBDD]">
              <label className="text-xs font-semibold text-[#0F1F1C]">Specific Skills Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Soil Sampling, Drip Irrigation, Broiler Nutrition"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-[#C4C8C5] rounded text-sm min-h-[44px]"
                />
                <Button type="button" variant="secondary" size="sm" onClick={addSkillTag}>
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EBEBDD] text-[#0F1F1C] rounded font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillTag(skill)}
                      className="text-[#5A6E68] hover:text-[#C53030]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Education */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">4. Education & Formal Training</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Colleges of Agriculture, polytechnics, universities, or vocational training centers.
              </p>
            </div>

            <div className="space-y-3">
              {formData.education.map((edu) => (
                <div key={edu.id} className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
                  <p className="font-bold text-[#0F1F1C]">{edu.qualification} in {edu.field}</p>
                  <p className="text-[#5A6E68]">{edu.institution} ({edu.yearCompleted})</p>
                </div>
              ))}
            </div>

            <div className="p-4 border border-[#C4C8C5] rounded space-y-3">
              <Input
                label="Institution Name"
                placeholder="e.g. University of Ibadan / Federal College of Agriculture Akure"
                defaultValue={formData.education[0]?.institution || ''}
                onChange={(e) => {
                  const updated = [...formData.education];
                  if (updated[0]) updated[0].institution = e.target.value;
                  setFormData({ ...formData, education: updated });
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Qualification"
                  placeholder="e.g. B.Agric / HND / OND"
                  defaultValue={formData.education[0]?.qualification || ''}
                  onChange={(e) => {
                    const updated = [...formData.education];
                    if (updated[0]) updated[0].qualification = e.target.value;
                    setFormData({ ...formData, education: updated });
                  }}
                />
                <Input
                  label="Year Completed"
                  placeholder="e.g. 2021"
                  defaultValue={formData.education[0]?.yearCompleted || ''}
                  onChange={(e) => {
                    const updated = [...formData.education];
                    if (updated[0]) updated[0].yearCompleted = e.target.value;
                    setFormData({ ...formData, education: updated });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Work Experience */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">5. Agricultural Work Experience</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Commercial estates, seed companies, processing mills, or cooperative clusters.
              </p>
            </div>

            <div className="space-y-3">
              {formData.workExperience.map((exp) => (
                <div key={exp.id} className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs space-y-1">
                  <p className="font-bold text-[#0F1F1C]">{exp.role} at {exp.organisation}</p>
                  <p className="text-[#5A6E68]">{exp.location} ({exp.startDate} - {exp.endDate || 'Present'})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Certifications & Verification */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">6. Certifications & Evidence</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Professional licenses (e.g. NASC Seed Inspector, Trade Test, Pesticide Applicator).
              </p>
            </div>

            <div className="space-y-3">
              {formData.certifications.map((cert) => (
                <div key={cert.id} className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0F1F1C]">{cert.name}</p>
                    <p className="text-[#5A6E68]">{cert.issuer} ({cert.year})</p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Availability & Preferences */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">7. Availability & Work Preferences</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                State your deployment notice period and preferred employment contracts.
              </p>
            </div>

            <Select
              label="Deployment Availability"
              value={formData.availability}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: e.target.value as any
                })
              }
              options={[
                { value: 'Immediately Available', label: 'Immediately Available' },
                { value: '2 Weeks Notice', label: '2 Weeks Notice' },
                { value: '1 Month Notice', label: '1 Month Notice' },
                { value: 'Seasonal Only', label: 'Seasonal Planting/Harvest Window Only' }
              ]}
            />
          </div>
        )}

        {/* Step 8: Final Review */}
        {currentStep === 8 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F1F1C]">8. Profile Review & Consent</h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Verify your entries before making your capability profile discoverable by employers.
              </p>
            </div>

            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Full Name:</span>
                <span className="font-bold text-[#0F1F1C]">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Specialization:</span>
                <span className="font-bold text-[#0F1F1C]">{formData.headline}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Location:</span>
                <span className="font-bold text-[#0F1F1C]">{formData.location.state}, {formData.location.lga}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Documented Capabilities:</span>
                <span className="font-bold text-[#0E5A46]">{formData.capabilities.length} Items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6E68]">Availability:</span>
                <span className="font-bold text-[#0F1F1C]">{formData.availability}</span>
              </div>
            </div>

            <div className="p-4 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs text-[#08382B] space-y-1">
              <p className="font-semibold">Trust & Verification Policy:</p>
              <p>
                By publishing, you confirm that your recorded credentials represent authentic field experience.
                Tourms reserves the right to audit certificates and request references prior to employer introduction.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions (Back & Next / Submit) */}
        <div className="pt-6 border-t border-[#EBEBDD] flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous Step'}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            rightIcon={currentStep < 8 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          >
            {currentStep < 8 ? 'Save & Continue' : 'Publish Capability Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};
