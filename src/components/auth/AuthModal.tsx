import React, { useState } from 'react';
import { UserRole, WorkerProfile, EmployerProfile, EvidenceLevel } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TourmsSymbol, TourmsFrequencyRhythm } from '../ui/TourmsLogo';
import {
  User,
  Briefcase,
  ShieldCheck,
  Building2,
  LogIn,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
  Smartphone,
  KeyRound,
  Send
} from 'lucide-react';
import { VerificationModal } from './VerificationModal';
import { PostRegistrationOtpModal } from './PostRegistrationOtpModal';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'worker_reg' | 'employer_reg' | 'signin';
  onWorkerRegister: (worker: WorkerProfile) => void;
  onEmployerRegister: (employer: EmployerProfile) => void;
  onSignIn: (role: UserRole, userEmail: string) => void;
}

const AG_SPECIALIZATIONS = [
  'Tractor & Heavy Machinery Operator',
  'Agronomist & Crop Protection Specialist',
  'Irrigation & Water Systems Technician',
  'Farm Manager & Commercial Supervisor',
  'Post-Harvest & Grain Storage Specialist',
  'Livestock & Dairy Operations Specialist',
  'Fisheries & Aquaculture Technician',
  'Greenhouse & Precision Farming Specialist'
];

const AG_SECTORS = [
  'Commercial Crop Production (Grains & Tubers)',
  'Commercial Horticulture & Vegetables',
  'Livestock, Poultry & Feed Production',
  'Agricultural Processing, Milling & Packaging',
  'Cold Chain & Agro-Logistics',
  'Input Supply, Mechanization & Seeds',
  'Agricultural Commodity Trading & Export'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'worker_reg',
  onWorkerRegister,
  onEmployerRegister,
  onSignIn
}) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'worker_reg' | 'employer_reg' | 'signin'>(defaultTab);

  // Sync defaultTab if changed
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerState, setWorkerState] = useState(ALL_STATE_NAMES[0]);
  const [workerLga, setWorkerLga] = useState('');
  const [workerSpec, setWorkerSpec] = useState(AG_SPECIALIZATIONS[0]);
  const [workerYears, setWorkerYears] = useState('3-5 years');

  // Employer Form State
  const [companyName, setCompanyName] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [employerState, setEmployerState] = useState(ALL_STATE_NAMES[0]);
  const [employerLga, setEmployerLga] = useState('');
  const [employerSector, setEmployerSector] = useState(AG_SECTORS[0]);
  const [farmScale, setFarmScale] = useState('100 - 500 Hectares');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInMode, setSignInMode] = useState<'password' | 'sms_otp'>('password');
  const [signInRole, setSignInRole] = useState<'worker' | 'employer'>('worker');

  // Phone & Email Verification Modal State
  const [workerPhoneVerified, setWorkerPhoneVerified] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<'phone' | 'email'>('phone');
  const [verificationTarget, setVerificationTarget] = useState('');
  const [verificationContext, setVerificationContext] = useState<'worker_phone' | 'employer_email' | 'signin_otp'>('worker_phone');

  // Post-Registration Phone OTP Modal State (Mandatory phone verification, email excluded for workers)
  const [postRegOtpOpen, setPostRegOtpOpen] = useState(false);
  const [postRegRole, setPostRegRole] = useState<'worker' | 'employer'>('worker');
  const [pendingWorker, setPendingWorker] = useState<WorkerProfile | null>(null);
  const [pendingEmployer, setPendingEmployer] = useState<EmployerProfile | null>(null);

  // Update LGAs dynamically
  const workerLgas = getLgasForState(workerState);
  const employerLgas = getLgasForState(employerState);

  React.useEffect(() => {
    if (workerLgas.length > 0 && !workerLgas.includes(workerLga)) {
      setWorkerLga(workerLgas[0]);
    }
  }, [workerState, workerLgas, workerLga]);

  React.useEffect(() => {
    if (employerLgas.length > 0 && !employerLgas.includes(employerLga)) {
      setEmployerLga(employerLgas[0]);
    }
  }, [employerState, employerLgas, employerLga]);

  // Handle Worker Registration (Email is strictly optional for informal laborers)
  const handleSubmitWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerPhone.trim()) {
      addToast({
        type: 'error',
        title: 'Missing information',
        message: 'Please provide your full legal name and active mobile telephone number.'
      });
      return;
    }

    const newWorker: WorkerProfile = {
      id: `worker-${Date.now()}`,
      fullName: workerName.trim(),
      headline: `${workerSpec} • ${workerYears} experience`,
      email: workerEmail.trim() || undefined,
      phone: workerPhone.trim(),
      isVerified: false,
      phoneVerified: false,
      emailVerified: Boolean(workerEmail.trim()),
      verificationMethod: 'sms_otp',
      location: {
        state: workerState,
        lga: workerLga || workerLgas[0] || 'Municipal'
      },
      summary: `Registered agricultural professional based in ${workerState}, Nigeria with dedicated competency in ${workerSpec}.`,
      capabilities: [
        {
          id: `cap-${Date.now()}`,
          title: workerSpec,
          description: `Practical field capability across ${workerYears} of operational commercial agriculture in ${workerState}.`,
          evidenceLevel: 'self_reported'
        }
      ],
      skills: [workerSpec, 'Field Operations', 'Equipment Maintenance', 'Pest Scouting'],
      workExperience: [
        {
          id: `exp-${Date.now()}`,
          role: workerSpec,
          organisation: `Commercial Farm Enterprise, ${workerState}`,
          location: `${workerState}, Nigeria`,
          startDate: '2022-01',
          current: true,
          responsibilities: [
            `Field operations in ${workerSpec}`,
            'Equipment operation and preventative maintenance',
            'Farm daily task execution and logging'
          ]
        }
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: `Federal Agricultural Institute, ${workerState}`,
          qualification: 'Diploma in Agriculture',
          field: 'Agronomy & Farm Mechanisation',
          yearCompleted: '2021'
        }
      ],
      certifications: [],
      availability: 'Immediately Available',
      preferences: {
        employmentTypes: ['Full-time', 'Seasonal'],
        preferredStates: [workerState],
        willingToRelocate: true
      },
      completionPercentage: 65,
      verifiedStatus: 'unverified'
    };

    setPendingWorker(newWorker);
    setPostRegRole('worker');
    setPostRegOtpOpen(true);
  };

  // Handle Employer Registration
  const handleSubmitEmployer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !cacNumber.trim() || !employerEmail.trim() || !contactPerson.trim()) {
      addToast({
        type: 'error',
        title: 'Required fields missing',
        message: 'Business name, CAC RC/BN number, contact person, and official email are required for agribusiness verification.'
      });
      return;
    }

    const newEmployer: EmployerProfile = {
      id: `emp-${Date.now()}`,
      companyName: companyName.trim(),
      businessType: employerSector,
      registrationNumber: cacNumber.trim().toUpperCase(),
      cacVerified: false,
      isVerified: false,
      location: {
        state: employerState,
        lga: employerLga || employerLgas[0] || 'Central',
        farmSiteAddress: `Kilometre 14, Commercial Farm Road, ${employerState}`
      },
      contactPerson: contactPerson.trim(),
      email: employerEmail.trim(),
      phone: employerPhone.trim() || '+234 800 000 0000',
      phoneVerified: false,
      emailVerified: false,
      verificationStatus: 'pending',
      verificationDocuments: [
        {
          id: `doc-${Date.now()}`,
          title: 'CAC Certificate of Incorporation',
          documentType: 'CAC_RC_CERTIFICATE',
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'pending'
        }
      ]
    };

    setPendingEmployer(newEmployer);
    setPostRegRole('employer');
    setPostRegOtpOpen(true);
  };

  // Handles successful phone OTP verification right after registration
  const handlePostRegVerificationSuccess = () => {
    if (postRegRole === 'worker' && pendingWorker) {
      const verifiedWorker: WorkerProfile = {
        ...pendingWorker,
        isVerified: true,
        phoneVerified: true,
        verificationMethod: 'sms_otp'
      };
      onWorkerRegister(verifiedWorker);
      setPendingWorker(null);
      setPostRegOtpOpen(false);
      onClose();
    } else if (postRegRole === 'employer' && pendingEmployer) {
      const verifiedEmployer: EmployerProfile = {
        ...pendingEmployer,
        isVerified: true,
        phoneVerified: true
      };
      onEmployerRegister(verifiedEmployer);
      setPendingEmployer(null);
      setPostRegOtpOpen(false);
      onClose();
    }
  };

  // Skip verification option if user prefers to verify later
  const handlePostRegSkip = () => {
    if (postRegRole === 'worker' && pendingWorker) {
      onWorkerRegister(pendingWorker);
      setPendingWorker(null);
    } else if (postRegRole === 'employer' && pendingEmployer) {
      onEmployerRegister(pendingEmployer);
      setPendingEmployer(null);
    }
    setPostRegOtpOpen(false);
    onClose();
  };

  // Handle Sign In Form (Supports Email OR Phone Number via Password or SMS OTP)
  const handleSubmitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = signInEmail.trim();
    if (!identifier) {
      addToast({
        type: 'error',
        title: 'Identifier required',
        message: 'Please provide your registered phone number or email address.'
      });
      return;
    }

    if (signInMode === 'sms_otp') {
      // Trigger instant SMS OTP flow
      setVerificationTarget(identifier);
      setVerificationType(identifier.includes('@') ? 'email' : 'phone');
      setVerificationContext('signin_otp');
      setVerificationModalOpen(true);
      return;
    }

    // Direct password/PIN sign in
    const lower = identifier.toLowerCase();
    if (signInRole === 'employer' || lower.includes('farm') || lower.includes('agro') || lower.includes('ltd')) {
      onSignIn('employer', identifier);
    } else {
      onSignIn('worker', identifier);
    }

    addToast({
      type: 'success',
      title: 'Session Authenticated',
      message: `Signed in successfully as ${signInRole.toUpperCase()}: ${identifier}`
    });
    onClose();
  };

  // Callback from VerificationModal on successful OTP entry
  const handleOtpVerified = (verifiedVal: string) => {
    if (verificationContext === 'worker_phone') {
      setWorkerPhoneVerified(true);
      addToast({
        type: 'success',
        title: 'Mobile Verified',
        message: `${verifiedVal} confirmed via instant Nigerian SMS gateway.`
      });
    } else if (verificationContext === 'signin_otp') {
      const lower = verifiedVal.toLowerCase();
      if (lower.includes('farm') || lower.includes('agro') || lower.includes('ltd')) {
        onSignIn('employer', verifiedVal);
      } else {
        onSignIn('worker', verifiedVal);
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="TOURMS Access & Registration"
      description="Create your verified agricultural profile or sign in to your existing session."
      maxWidth="lg"
    >
      <div className="space-y-4 text-left">
        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EBEBDD] rounded border border-[#C4C8C5]">
          <button
            type="button"
            onClick={() => setActiveTab('worker_reg')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'worker_reg'
                ? 'bg-white text-[#0E5A46] shadow-xs'
                : 'text-[#3A4B47] hover:text-[#0F1F1C]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">Worker / Pro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employer_reg')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'employer_reg'
                ? 'bg-white text-[#0E5A46] shadow-xs'
                : 'text-[#3A4B47] hover:text-[#0F1F1C]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">Agribusiness</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-[#0E5A46] shadow-xs'
                : 'text-[#3A4B47] hover:text-[#0F1F1C]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="truncate">Sign In</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: WORKER REGISTRATION                                            */}
        {/* ==================================================================== */}
        {activeTab === 'worker_reg' && (
          <form onSubmit={handleSubmitWorker} className="space-y-3.5">
            <div className="p-3 bg-[#E7F3EF] border border-[#0E5A46]/20 rounded text-xs text-[#0F1F1C] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Tourms Workforce Capability Registration</span>
              </div>
              <p className="text-[11px] text-[#3A4B47]">
                Registration registers your self-reported profile immediately so you can apply for jobs and build verified evidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Legal Name"
                placeholder="e.g. Musa Haruna"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                required
              />
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="musa.haruna@example.ng (optional)"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
                helperText="Optional for field workers. Mobile phone is your primary login."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Input
                  label="Mobile Phone / WhatsApp (Primary Login)"
                  placeholder="+234 803 000 0000"
                  value={workerPhone}
                  onChange={(e) => {
                    setWorkerPhone(e.target.value);
                    setWorkerPhoneVerified(false);
                  }}
                  required
                  helperText="Required. Used for SMS job alerts & fast OTP login."
                />
                {workerPhone.trim().length >= 8 && (
                  <div className="pt-0.5">
                    {workerPhoneVerified ? (
                      <span className="text-[11px] text-[#0E5A46] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
                        Phone Verified via SMS OTP
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationType('phone');
                          setVerificationTarget(workerPhone);
                          setVerificationContext('worker_phone');
                          setVerificationModalOpen(true);
                        }}
                        className="text-[11px] text-[#0E5A46] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Verify Phone via SMS/WhatsApp OTP →
                      </button>
                    )}
                  </div>
                )}
              </div>
              <Select
                label="Primary Field Specialization"
                value={workerSpec}
                onChange={(e) => setWorkerSpec(e.target.value)}
                options={AG_SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Operational State"
                value={workerState}
                onChange={(e) => setWorkerState(e.target.value)}
                options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
              />
              <Select
                label="Local Government Area (LGA)"
                value={workerLga}
                onChange={(e) => setWorkerLga(e.target.value)}
                options={workerLgas.map((lg) => ({ value: lg, label: lg }))}
              />
              <Select
                label="Practical Experience"
                value={workerYears}
                onChange={(e) => setWorkerYears(e.target.value)}
                options={[
                  { value: '1-2 years', label: '1 - 2 Years' },
                  { value: '3-5 years', label: '3 - 5 Years' },
                  { value: '6-10 years', label: '6 - 10 Years' },
                  { value: '10+ years', label: 'Over 10 Years' }
                ]}
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#C4C8C5]">
              <span className="text-[11px] text-[#5A6E68]">Free agricultural registration</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Register Worker Profile
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: AGRIBUSINESS EMPLOYER REGISTRATION                             */}
        {/* ==================================================================== */}
        {activeTab === 'employer_reg' && (
          <form onSubmit={handleSubmitEmployer} className="space-y-3.5">
            <div className="p-3 bg-[#FEF4E8] border border-[#C98A3A]/30 rounded text-xs text-[#0F1F1C] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#C98A3A]">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>CAC Corporate Agribusiness Registration</span>
              </div>
              <p className="text-[11px] text-[#5A6E68]">
                Registered companies undergo Nigerian CAC identity verification before job posts appear with the "Verified Employer" trust badge.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Agribusiness / Company Name"
                placeholder="e.g. Sahel Agro-Ventures Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <Input
                label="CAC Registration Number"
                placeholder="RC-1294801 or BN-849204"
                value={cacNumber}
                onChange={(e) => setCacNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Contact Officer Name & Title"
                placeholder="e.g. Aisha Bello (Head of HR)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
              <Input
                label="Corporate Email Address"
                type="email"
                placeholder="hiring@sahelagro.ng"
                value={employerEmail}
                onChange={(e) => setEmployerEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Agricultural Sub-Sector"
                value={employerSector}
                onChange={(e) => setEmployerSector(e.target.value)}
                options={AG_SECTORS.map((sec) => ({ value: sec, label: sec }))}
              />
              <Select
                label="Operational Scale"
                value={farmScale}
                onChange={(e) => setFarmScale(e.target.value)}
                options={[
                  { value: 'Under 50 Hectares', label: 'Under 50 Hectares (Smallholder/Mid)' },
                  { value: '50 - 200 Hectares', label: '50 - 200 Hectares (Commercial)' },
                  { value: '200 - 1,000 Hectares', label: '200 - 1,000 Hectares (Large Enterprise)' },
                  { value: '1,000+ Hectares', label: '1,000+ Hectares (Mega Industrial Farm)' },
                  { value: 'Processing Facility', label: 'Processing & Value-Addition Mill' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Headquarters / Farm State"
                value={employerState}
                onChange={(e) => setEmployerState(e.target.value)}
                options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
              />
              <Select
                label="Farm LGA Location"
                value={employerLga}
                onChange={(e) => setEmployerLga(e.target.value)}
                options={employerLgas.map((lg) => ({ value: lg, label: lg }))}
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#C4C8C5]">
              <span className="text-[11px] text-[#5A6E68]">Direct compliance review</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Register Agribusiness
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: SIGN IN & QUICK SWITCHER                                      */}
        {/* ==================================================================== */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {/* Sign-in Method Selector */}
            <div className="p-1 bg-[#EBEBDD] rounded border border-[#C4C8C5] grid grid-cols-2 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSignInMode('password')}
                className={`py-1.5 px-2 rounded font-semibold text-center transition-colors cursor-pointer ${
                  signInMode === 'password'
                    ? 'bg-white text-[#0E5A46] shadow-xs'
                    : 'text-[#5A6E68] hover:text-[#0F1F1C]'
                }`}
              >
                Password / PIN
              </button>
              <button
                type="button"
                onClick={() => setSignInMode('sms_otp')}
                className={`py-1.5 px-2 rounded font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  signInMode === 'sms_otp'
                    ? 'bg-white text-[#0E5A46] shadow-xs'
                    : 'text-[#5A6E68] hover:text-[#0F1F1C]'
                }`}
              >
                <Smartphone className="w-3 h-3 text-[#0E5A46]" />
                <span>Instant SMS OTP</span>
              </button>
            </div>

            {/* Account Role Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#5A6E68] uppercase tracking-wider block">
                Account Type:
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#EBEBDD] rounded border border-[#C4C8C5] text-xs">
                <button
                  type="button"
                  onClick={() => setSignInRole('worker')}
                  className={`py-1.5 px-2 rounded font-semibold text-center transition-colors cursor-pointer ${
                    signInRole === 'worker' ? 'bg-[#0E5A46] text-white shadow-xs' : 'text-[#3A4B47] hover:text-[#0F1F1C]'
                  }`}
                >
                  Worker
                </button>
                <button
                  type="button"
                  onClick={() => setSignInRole('employer')}
                  className={`py-1.5 px-2 rounded font-semibold text-center transition-colors cursor-pointer ${
                    signInRole === 'employer' ? 'bg-[#0E5A46] text-white shadow-xs' : 'text-[#3A4B47] hover:text-[#0F1F1C]'
                  }`}
                >
                  Agribusiness
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitSignIn} className="space-y-3">
              <Input
                label={signInMode === 'sms_otp' ? 'Registered Phone Number or Email' : 'Phone Number or Email Address'}
                type="text"
                placeholder={signInMode === 'sms_otp' ? '+234 803 000 0000' : '+234 803 000 0000 or musa.haruna@tourms.ng'}
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />

              {signInMode === 'password' && (
                <Input
                  label="Password / Security PIN"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
              )}

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('worker_reg')}
                  className="text-xs text-[#0E5A46] hover:underline"
                >
                  Need an account? Register here
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  rightIcon={signInMode === 'sms_otp' ? <Smartphone className="w-3.5 h-3.5" /> : undefined}
                >
                  {signInMode === 'sms_otp' ? 'Send OTP & Sign In' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Quick Demo Switcher Presets */}
            <div className="pt-3 border-t border-[#C4C8C5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5A6E68] uppercase tracking-wider">
                  Quick Testing Accounts (Evaluator Presets)
                </span>
                <span className="text-[10px] text-[#7A8B86]">Instant session switch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onSignIn('worker', 'musa.haruna@tourms.ng');
                    onClose();
                  }}
                  className="p-2.5 rounded bg-[#F7F7EE] hover:bg-[#E7F3EF] border border-[#C4C8C5] text-left space-y-0.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-[#0E5A46] font-bold">
                    <User className="w-3 h-3" />
                    <span>Worker Demo</span>
                  </div>
                  <p className="text-[10px] text-[#5A6E68] truncate">Musa Haruna (Agronomist)</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSignIn('employer', 'hr@agrogreen.ng');
                    onClose();
                  }}
                  className="p-2.5 rounded bg-[#F7F7EE] hover:bg-[#E7F3EF] border border-[#C4C8C5] text-left space-y-0.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-[#0E5A46] font-bold">
                    <Building2 className="w-3 h-3" />
                    <span>Employer Demo</span>
                  </div>
                  <p className="text-[10px] text-[#5A6E68] truncate">AgroGreen Valley Ltd</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive SMS / WhatsApp / Email OTP Verification Modal */}
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        type={verificationType}
        targetValue={verificationTarget}
        onVerified={handleOtpVerified}
      />

      {/* Post-Registration Phone OTP Verification Modal (Auto-triggered upon registration) */}
      <PostRegistrationOtpModal
        isOpen={postRegOtpOpen}
        onClose={() => setPostRegOtpOpen(false)}
        role={postRegRole}
        userName={
          postRegRole === 'worker'
            ? pendingWorker?.fullName || 'Worker'
            : pendingEmployer?.companyName || 'Agribusiness'
        }
        phoneNumber={
          postRegRole === 'worker'
            ? pendingWorker?.phone || ''
            : pendingEmployer?.phone || ''
        }
        email={postRegRole === 'worker' ? pendingWorker?.email : pendingEmployer?.email}
        onVerificationSuccess={handlePostRegVerificationSuccess}
        onSkip={handlePostRegSkip}
      />
    </Modal>
  );
};
