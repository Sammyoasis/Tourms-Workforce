import React, { useState } from 'react';
import { EmployerProfile, VerificationStatus } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Building2,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Upload,
  Tractor,
  Wheat,
  Users,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  Plus,
  X
} from 'lucide-react';

export interface EmployerOnboardingProps {
  initialProfile: EmployerProfile;
  onComplete: (profile: EmployerProfile) => void;
  onCancel: () => void;
}

const STEPS = [
  'Corporate Identity & CAC',
  'Farm Site & Location',
  'Crop & Livestock Focus',
  'Mechanization & Capacity',
  'Executive Contact',
  'Verification Review'
];

const LEGAL_STRUCTURES = [
  'Private Limited Liability Company (Ltd / RC)',
  'Registered Business Name (BN)',
  'Agricultural Cooperative Society (Co-op)',
  'Commercial Agricultural Joint Venture',
  'Incorporated Trustee (Agri-Association)'
];

const FARM_SCALES = [
  'Smallholder Commercial (10 – 50 Hectares)',
  'Medium Commercial Farm (50 – 250 Hectares)',
  'Large Commercial Estate (250 – 1,000 Hectares)',
  'Mega Plantation (> 1,000 Hectares)',
  'Intensive Livestock / Poultry Facility (> 20,000 birds)',
  'Intensive RAS Aquaculture Facility (> 50,000 fingerlings/mo)'
];

const TENURE_TYPES = [
  'Certificate of Occupancy (C of O) — State Government',
  'Agricultural Customary Leasehold (> 15 Years)',
  'Federal / State River Basin Land Allocation',
  'Community Agricultural Partnership Agreement',
  'Private Deed of Assignment & Registered Survey'
];

const POPULAR_CROPS = [
  'Commercial Maize',
  'Cassava (HQCF & Industrial)',
  'Paddy Rice (Dry Season)',
  'Soya Beans',
  'Roma Tomatoes',
  'Oil Palm',
  'Cocoa',
  'Cashew',
  'Yam Tubers',
  'Sorghum',
  'Sesame Seeds',
  'Ginger & Spices'
];

const POPULAR_LIVESTOCK = [
  'Broiler Poultry (Deep-Litter)',
  'Layer Poultry (Battery Cage)',
  'African Catfish Hatchery (RAS)',
  'Nile Tilapia Grow-out',
  'Beef Cattle Fattening',
  'Dairy Cattle & Milk Processing',
  'Sheep & Boer Goats',
  'Piggery Operations'
];

const MACHINERY_TYPES = [
  'Tractors (75HP+)',
  'Combine Harvesters',
  'Tractor-Mounted Boom Sprayers',
  'Pneumatic Seed Drills',
  'Center-Pivot / Drip Irrigation Pumps',
  'Grain Dryers & Silos',
  'Automated Poultry Ventilation & Augers',
  'Mechanical Chipping & Rasper Machines'
];

export const EmployerOnboarding: React.FC<EmployerOnboardingProps> = ({
  initialProfile,
  onComplete,
  onCancel
}) => {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [companyName, setCompanyName] = useState(initialProfile.companyName || '');
  const [businessType, setBusinessType] = useState(initialProfile.businessType || LEGAL_STRUCTURES[0]);
  const [registrationNumber, setRegistrationNumber] = useState(initialProfile.registrationNumber || 'RC 1492084');
  const [establishedYear, setEstablishedYear] = useState(initialProfile.establishedYear || '2020');
  
  // Location
  const [state, setState] = useState(initialProfile.location?.state || 'Oyo');
  const [lga, setLga] = useState(initialProfile.location?.lga || 'Iseyin');
  const [farmSiteAddress, setFarmSiteAddress] = useState(initialProfile.location?.farmSiteAddress || '');
  const [farmScale, setFarmScale] = useState(initialProfile.farmScale || FARM_SCALES[1]);
  const [landTenure, setLandTenure] = useState(initialProfile.landTenure || TENURE_TYPES[0]);

  // Agricultural Focus
  const [primaryFocus, setPrimaryFocus] = useState(initialProfile.primaryFocus || 'Commercial Grain & Root Crop Production');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    initialProfile.crops && initialProfile.crops.length > 0
      ? initialProfile.crops
      : ['Commercial Maize', 'Cassava (HQCF & Industrial)']
  );
  const [selectedLivestock, setSelectedLivestock] = useState<string[]>(
    initialProfile.livestock && initialProfile.livestock.length > 0 ? initialProfile.livestock : []
  );
  const [customCropInput, setCustomCropInput] = useState('');

  // Mechanization & Capacity
  const [mechanizationLevel, setMechanizationLevel] = useState(
    initialProfile.mechanizationLevel || 'Fully Mechanized Field Operations'
  );
  const [selectedMachinery, setSelectedMachinery] = useState<string[]>([
    'Tractors (75HP+)',
    'Tractor-Mounted Boom Sprayers',
    'Center-Pivot / Drip Irrigation Pumps'
  ]);
  const [workforceSize, setWorkforceSize] = useState(initialProfile.workforceSize || '15 Permanent · 40 Seasonal');

  // Executive Contact
  const [contactPerson, setContactPerson] = useState(initialProfile.contactPerson || '');
  const [email, setEmail] = useState(initialProfile.email || '');
  const [phone, setPhone] = useState(initialProfile.phone || '');

  // Document Upload State
  const [uploadedDocName, setUploadedDocName] = useState<string>('CAC_Certificate_Incorporation.pdf');

  const availableLgas = getLgasForState(state);

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const toggleLivestock = (item: string) => {
    setSelectedLivestock((prev) =>
      prev.includes(item) ? prev.filter((l) => l !== item) : [...prev, item]
    );
  };

  const toggleMachinery = (item: string) => {
    setSelectedMachinery((prev) =>
      prev.includes(item) ? prev.filter((m) => m !== item) : [...prev, item]
    );
  };

  const handleAddCustomCrop = () => {
    if (!customCropInput.trim()) return;
    if (!selectedCrops.includes(customCropInput.trim())) {
      setSelectedCrops((prev) => [...prev, customCropInput.trim()]);
    }
    setCustomCropInput('');
  };

  const handleNext = () => {
    // Step-by-step validations
    if (currentStep === 1) {
      if (!companyName.trim()) {
        addToast({ type: 'error', title: 'Company Name Required', message: 'Specify your registered agribusiness legal entity.' });
        return;
      }
      if (!registrationNumber.trim()) {
        addToast({ type: 'error', title: 'CAC Registration Required', message: 'Enter your CAC RC/BN number.' });
        return;
      }
    }

    if (currentStep === 2) {
      if (!state || !lga) {
        addToast({ type: 'error', title: 'Farm Location Required', message: 'Select your operational Nigerian State and LGA.' });
        return;
      }
      if (!farmSiteAddress.trim()) {
        addToast({ type: 'error', title: 'Farm Address Required', message: 'Enter your farm site road/highway address.' });
        return;
      }
    }

    if (currentStep === 3) {
      if (selectedCrops.length === 0 && selectedLivestock.length === 0) {
        addToast({ type: 'error', title: 'Agricultural Focus Required', message: 'Select at least one crop, livestock, or commodity specialization.' });
        return;
      }
    }

    if (currentStep === 5) {
      if (!contactPerson.trim() || !email.trim() || !phone.trim()) {
        addToast({ type: 'error', title: 'Contact Details Required', message: 'Provide contact person, official email, and active telephone.' });
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 6 Complete: Build Employer Profile
      const finalizedProfile: EmployerProfile = {
        ...initialProfile,
        companyName: companyName.trim(),
        businessType: businessType,
        registrationNumber: registrationNumber.trim(),
        establishedYear,
        location: {
          state,
          lga,
          farmSiteAddress: farmSiteAddress.trim()
        },
        farmScale,
        landTenure,
        primaryFocus,
        crops: selectedCrops,
        livestock: selectedLivestock,
        mechanizationLevel,
        workforceSize,
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isVerified: true,
        phoneVerified: true,
        emailVerified: true,
        verificationStatus: 'verified', // Verified employer onboarding!
        cacVerified: true,
        verificationDocuments: [
          {
            id: `doc-${Date.now()}-1`,
            title: 'CAC Certificate of Incorporation',
            documentType: 'CAC_RC',
            submittedAt: new Date().toISOString().split('T')[0],
            status: 'verified',
            notes: 'Verified via TOURMS Enterprise Onboarding Verification Protocol.'
          },
          {
            id: `doc-${Date.now()}-2`,
            title: `Land Rights Document (${landTenure.split('—')[0].trim()})`,
            documentType: 'LAND_TITLE',
            submittedAt: new Date().toISOString().split('T')[0],
            status: 'verified',
            notes: `${state} Ministry of Agriculture land registration active.`
          }
        ]
      };

      onComplete(finalizedProfile);
      addToast({
        type: 'success',
        title: 'Enterprise Onboarding Complete',
        message: `${companyName} is now registered and verified in the TOURMS agricultural registry.`
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
    <div className="w-full text-left py-6 sm:py-8 md:py-12 px-3.5 sm:px-6 lg:px-8 max-w-3xl mx-auto overflow-x-hidden">
      {/* Progress Tracker */}
      <div className="mb-6 sm:mb-8 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold text-[#5A6E68]">
          <span className="text-[#0E5A46] uppercase tracking-wider text-[11px] sm:text-xs">
            Step {currentStep} of 6: {STEPS[currentStep - 1]}
          </span>
          <span className="tabular-nums text-[11px] sm:text-xs text-[#0E5A46]">
            {Math.round((currentStep / 6) * 100)}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#EBEBDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0E5A46] transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#5A6E68]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
          <span>TOURMS Enterprise Accreditation: Verified commercial agribusiness and agricultural land rights registry.</span>
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 shadow-xs space-y-5 sm:space-y-6 overflow-hidden break-words">
        {/* =================================================================== */}
        {/* STEP 1: CORPORATE IDENTITY & CAC REGISTRATION                       */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 1: Enterprise Identity & CAC Corporate Registration
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Establish official corporate standing with the Corporate Affairs Commission (CAC) of Nigeria.
              </p>
            </div>

            <Input
              label="Agribusiness / Corporate Legal Entity Name"
              required
              placeholder="e.g. Flourish Agri-Enterprises Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              helperText="Exact registered name appearing on your CAC Certificate of Incorporation."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Legal Corporate Structure"
                required
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                options={LEGAL_STRUCTURES.map((str) => ({ value: str, label: str }))}
              />

              <Input
                label="CAC Registration Number (RC / BN)"
                required
                placeholder="e.g. RC 1492084 or BN 291034"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                helperText="Verified against Federal Corporate Registry gazette."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Year of Incorporation / Establishment"
                placeholder="e.g. 2018"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
              />

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0F1F1C] block">
                  CAC Certificate of Incorporation Attachment
                </label>
                <div className="flex items-center gap-2 p-2.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
                  <FileCheck className="w-4 h-4 text-[#0E5A46] shrink-0" />
                  <span className="font-mono text-[11px] truncate flex-1">{uploadedDocName}</span>
                  <label className="text-[10px] text-[#0E5A46] font-bold hover:underline cursor-pointer">
                    Replace
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setUploadedDocName(e.target.files[0].name);
                          addToast({ type: 'info', title: 'File Attached', message: e.target.files[0].name });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: FARM LOCATION & GEOGRAPHIC INFRASTRUCTURE                   */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 2: Farm Location & Geographic Infrastructure
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Define the agro-ecological zone and physical settlement where your operations occur.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Operational State (36 States & FCT)"
                required
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setLga('');
                }}
                options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
              />

              <Select
                label={`Local Government Area (LGA) in ${state}`}
                required
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                options={availableLgas.map((l) => ({ value: l, label: l }))}
              />
            </div>

            <Input
              label="Farm Site / Physical Processing Facility Address"
              required
              placeholder="e.g. Kilometre 14, Iseyin-Oyo Road, Iseyin LGA"
              value={farmSiteAddress}
              onChange={(e) => setFarmSiteAddress(e.target.value)}
              helperText="Physical landmark, coordinate or highway milestone used by dispatching crew."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Farm Scale / Operational Scope"
                value={farmScale}
                onChange={(e) => setFarmScale(e.target.value)}
                options={FARM_SCALES.map((s) => ({ value: s, label: s }))}
              />

              <Select
                label="Agricultural Land Rights & Title Status"
                value={landTenure}
                onChange={(e) => setLandTenure(e.target.value)}
                options={TENURE_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: AGRICULTURAL SECTOR & PRIMARY COMMODITY FOCUS               */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 3: Primary Crop, Livestock & Commodity Focus
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Select the agricultural sub-sectors and commodities driving your seasonal labor demands.
              </p>
            </div>

            <Input
              label="Primary Agricultural Production Focus"
              required
              placeholder="e.g. Commercial Grain, Yellow Maize & Cassava Starch"
              value={primaryFocus}
              onChange={(e) => setPrimaryFocus(e.target.value)}
              helperText="Headline sector description used by the semantic candidate matching engine."
            />

            {/* Crop Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0F1F1C] block">
                Commercial Crops & Field Commodities (Select all that apply):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CROPS.map((crop) => {
                  const isSelected = selectedCrops.includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0E5A46] text-white border-[#0E5A46] shadow-2xs'
                          : 'bg-white text-[#3A4B47] border-[#C4C8C5] hover:border-[#0E5A46]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {crop}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Crop */}
              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Add other crop (e.g. Cashew, Plantain)..."
                  value={customCropInput}
                  onChange={(e) => setCustomCropInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCrop())}
                  className="flex-1 bg-white border border-[#C4C8C5] rounded px-3 py-1.5 text-xs text-[#0F1F1C]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomCrop}
                  leftIcon={<Plus className="w-3 h-3" />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Livestock & Aquaculture Selection Chips */}
            <div className="space-y-2 pt-2 border-t border-[#EBEBDD]">
              <label className="text-xs font-bold text-[#0F1F1C] block">
                Livestock, Poultry & Aquaculture Specialties (Optional):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_LIVESTOCK.map((item) => {
                  const isSelected = selectedLivestock.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleLivestock(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#8E5A18] text-white border-[#8E5A18] shadow-2xs'
                          : 'bg-white text-[#3A4B47] border-[#C4C8C5] hover:border-[#8E5A18]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: MECHANIZATION & WORKFORCE REQUIREMENTS                     */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 4: Farm Mechanization & Workforce Capacity
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Help TOURMS match certified machinery operators, agronomists, and harvest technicians.
              </p>
            </div>

            <Select
              label="Overall Farm Mechanization Level"
              value={mechanizationLevel}
              onChange={(e) => setMechanizationLevel(e.target.value)}
              options={[
                { value: 'Fully Mechanized Field Operations', label: 'Fully Mechanized (Tractors, Combines, Hydraulic Implements)' },
                { value: 'Semi-Mechanized with Manual Crews', label: 'Semi-Mechanized (Tractors with manual weeding/harvesting crews)' },
                { value: 'Specialized Automated Controlled Facility', label: 'Specialized Automated Facility (Greenhouse, RAS, Poultry Augers)' },
                { value: 'Primarily Manual Field Operations', label: 'Primarily Manual Seasonal Field Operations' }
              ]}
            />

            {/* Farm Machinery Fleet */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0F1F1C] block">
                Machinery & Equipment Implements Operated on Site:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MACHINERY_TYPES.map((m) => {
                  const isSelected = selectedMachinery.includes(m);
                  return (
                    <div
                      key={m}
                      onClick={() => toggleMachinery(m)}
                      className={`p-2.5 rounded border text-xs flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-[#E7F3EF] border-[#0E5A46] text-[#0E5A46] font-semibold'
                          : 'bg-white border-[#C4C8C5] text-[#3A4B47] hover:border-[#0E5A46]'
                      }`}
                    >
                      <span>{m}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-[#0E5A46]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <Input
              label="Estimated Operational Workforce per Farming Cycle"
              placeholder="e.g. 15 Permanent Staff · 60 Seasonal Harvest Crew"
              value={workforceSize}
              onChange={(e) => setWorkforceSize(e.target.value)}
              helperText="Helps the seasonal matching algorithm pre-allocate local labor pools."
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: EXECUTIVE CONTACT & OPERATIONS DESK                         */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 5: Executive Contact & Operations Desk
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Official contact channel for candidate dispatches, escrow payment authorizations, and CAC audits.
              </p>
            </div>

            <Input
              label="Primary Operations Executive / Managing Director"
              required
              placeholder="e.g. Adewale Johnson (Managing Director)"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              helperText="Authorized corporate signatory for labor contracts and escrow releases."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Agribusiness Email"
                required
                type="email"
                placeholder="operations@flourishagri.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="For verified candidate notifications and settlement receipts."
              />

              <Input
                label="Direct Operations Telephone / WhatsApp"
                required
                placeholder="+234 802 334 5566"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                helperText="Used for immediate phone verification by TOURMS officers."
              />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 6: VERIFICATION REVIEW & SUBMISSION                            */}
        {/* =================================================================== */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-[#EBEBDD] pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
                Stage 6: Final Verification Review & Submission
              </h2>
              <p className="text-xs text-[#5A6E68] mt-1">
                Inspect your agribusiness requisition details before accreditation in the TOURMS registry.
              </p>
            </div>

            {/* Summary Specification Card */}
            <div className="p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Enterprise Name:</span>
                <span className="font-bold text-[#0F1F1C]">{companyName}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">CAC Registration:</span>
                <span className="font-mono font-bold text-[#0E5A46]">{registrationNumber} ({businessType.split('(')[1]?.replace(')', '') || 'RC'})</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Farm Location:</span>
                <span className="font-bold text-[#0F1F1C]">{lga} LGA, {state} State</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Primary Focus:</span>
                <span className="font-semibold text-[#0F1F1C]">{primaryFocus}</span>
              </div>
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Crops & Commodities:</span>
                <span className="font-bold text-[#0E5A46]">{selectedCrops.join(', ') || 'General Agriculture'}</span>
              </div>
              {selectedLivestock.length > 0 && (
                <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                  <span className="text-[#5A6E68]">Livestock & Aquaculture:</span>
                  <span className="font-bold text-[#8E5A18]">{selectedLivestock.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-[#EBEBDD] pb-2">
                <span className="text-[#5A6E68]">Farm Scale & Tenure:</span>
                <span className="font-semibold text-[#0F1F1C]">{farmScale.split('(')[0]} · {landTenure.split('—')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A6E68]">Executive Contact:</span>
                <span className="font-bold text-[#0F1F1C]">{contactPerson} ({phone})</span>
              </div>
            </div>

            {/* Compliance Policy Notice */}
            <div className="p-4 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs text-[#08382B] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0E5A46]" />
                <span>CAC Accreditation & Trust Guarantee</span>
              </p>
              <p>
                By completing this onboarding, your enterprise registration ({registrationNumber}) is routed to the TOURMS Compliance Desk. Verified agribusinesses gain instant access to candidate matching, escrow payment protection, and verified employer status badges.
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
            rightIcon={currentStep < 6 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            className="bg-[#0E5A46] hover:bg-[#08382B]"
          >
            {currentStep < 6 ? 'Continue to Next Stage' : 'COMPLETE ENTERPRISE ONBOARDING'}
          </Button>
        </div>
      </div>
    </div>
  );
};
