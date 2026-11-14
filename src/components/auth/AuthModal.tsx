import React, { useState } from 'react';
import { UserRole, WorkerProfile, EmployerProfile } from '../../types';
import { ALL_STATE_NAMES, getLgasForState } from '../../data/nigeriaLocations';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  ShieldCheck,
  Building2,
  LogIn,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  KeyRound,
  RotateCcw
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
  const { signIn, signUp, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'worker_reg' | 'employer_reg' | 'signin'>(defaultTab);

  // Sync defaultTab if changed
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');
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
  const [employerPassword, setEmployerPassword] = useState('');
  const [employerState, setEmployerState] = useState(ALL_STATE_NAMES[0]);
  const [employerLga, setEmployerLga] = useState('');
  const [employerSector, setEmployerSector] = useState(AG_SECTORS[0]);
  const [farmScale, setFarmScale] = useState('100 - 500 Hectares');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInMode, setSignInMode] = useState<'password' | 'sms_otp'>('password');
  const [signInRole, setSignInRole] = useState<'worker' | 'employer'>('worker');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone & Email Verification Modal State
  const [workerPhoneVerified, setWorkerPhoneVerified] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<'phone' | 'email'>('phone');
  const [verificationTarget, setVerificationTarget] = useState('');
  const [verificationContext, setVerificationContext] = useState<'worker_phone' | 'employer_email' | 'signin_otp'>('worker_phone');

  // Post-Registration Phone OTP Modal State
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

  // Handle Worker Registration with real Firebase Authentication
  const handleSubmitWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerPhone.trim() || !workerEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Missing information',
        message: 'Please provide your full legal name, active mobile number, and email address.'
      });
      return;
    }

    if (!workerEmail.includes('@') || !workerEmail.includes('.')) {
      addToast({
        type: 'error',
        title: 'Valid Email Required',
        message: 'Please enter a valid personal email address for official Firebase Authentication.'
      });
      return;
    }

    if (!workerPassword || workerPassword.length < 6) {
      addToast({
        type: 'error',
        title: 'Passcode required',
        message: 'Security passcode must be at least 6 characters long.'
      });
      return;
    }

    // Official Firebase Authentication email
    const accountEmail = workerEmail.trim().toLowerCase();

    const newWorker: WorkerProfile = {
      id: `worker-${Date.now()}`,
      fullName: workerName.trim(),
      headline: `${workerSpec} • ${workerYears} experience`,
      email: accountEmail,
      phone: workerPhone.trim(),
      isVerified: false,
      phoneVerified: false, // Sandbox OTP does not grant production telecom verification
      emailVerified: false,
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

    setIsSubmitting(true);
    try {
      const res = await signUp(accountEmail, workerPassword, 'worker', newWorker);
      if (!res.success) {
        addToast({
          type: 'error',
          title: 'Registration Failed',
          message: res.error || 'Failed to create worker account.'
        });
        return;
      }

      if (res.user) {
        newWorker.id = res.user.uid;
      }

      setPendingWorker(newWorker);
      setPostRegRole('worker');
      setPostRegOtpOpen(true);
      addToast({
        type: 'success',
        title: 'Account Created',
        message: 'Your worker identity has been provisioned on Firebase Auth.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Could not complete registration.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Employer Registration with real Firebase Authentication
  const handleSubmitEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !cacNumber.trim() || !employerEmail.trim() || !contactPerson.trim()) {
      addToast({
        type: 'error',
        title: 'Required fields missing',
        message: 'Business name, CAC RC/BN number, contact person, and official email are required for agribusiness verification.'
      });
      return;
    }

    if (!employerPassword || employerPassword.length < 6) {
      addToast({
        type: 'error',
        title: 'Passcode required',
        message: 'Security passcode must be at least 6 characters long.'
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

    setIsSubmitting(true);
    try {
      const res = await signUp(employerEmail.trim(), employerPassword, 'employer', newEmployer);
      if (!res.success) {
        addToast({
          type: 'error',
          title: 'Registration Failed',
          message: res.error || 'Failed to create employer account.'
        });
        return;
      }

      if (res.user) {
        newEmployer.id = res.user.uid;
      }

      setPendingEmployer(newEmployer);
      setPostRegRole('employer');
      setPostRegOtpOpen(true);
      addToast({
        type: 'success',
        title: 'Enterprise Account Created',
        message: 'Agribusiness account provisioned on Firebase Auth. Proceed to verification.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Could not complete employer registration.'
      });
    } finally {
      setIsSubmitting(false);
    }
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

  // Handle Sign In with genuine Firebase Authentication
  const handleSubmitSignIn = async (e: React.FormEvent) => {
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

    if (!signInPassword) {
      addToast({
        type: 'error',
        title: 'Password required',
        message: 'Please enter your account password or security PIN.'
      });
      return;
    }

    if (!identifier.includes('@')) {
      addToast({
        type: 'error',
        title: 'Email Required for Password Sign In',
        message: 'Please provide your registered email address (e.g. name@domain.com) to authenticate with password.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const accountEmail = identifier.toLowerCase();

      const result = await signIn(accountEmail, signInPassword);
      if (!result.success) {
        addToast({
          type: 'error',
          title: 'Sign In Failed',
          message: result.error || 'Invalid credentials. Please verify your email and passcode.'
        });
        return;
      }

      const role = result.role || signInRole;
      onSignIn(role, identifier);
      addToast({
        type: 'success',
        title: 'Session Authenticated',
        message: `Signed in successfully via Firebase Auth (${role.toUpperCase()}).`
      });
      onClose();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: err.message || 'Sign in failed.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInEmail.includes('@')) {
      addToast({
        type: 'error',
        title: 'Valid Email Required',
        message: 'Please enter your registered email address to receive password reset instructions.'
      });
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(signInEmail.trim());
    setIsSubmitting(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Password Reset Email Dispatched',
        message: `Instructions have been sent to ${signInEmail.trim()}. Check your inbox.`
      });
      setIsForgotPassword(false);
    } else {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: result.error || 'Failed to dispatch reset email.'
      });
    }
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
            onClick={() => {
              setActiveTab('worker_reg');
              setIsForgotPassword(false);
            }}
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
            onClick={() => {
              setActiveTab('employer_reg');
              setIsForgotPassword(false);
            }}
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
                Registration registers your capability-first profile immediately via Firebase Auth so you can apply for jobs and build verified credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Legal Name"
                placeholder="Enter your legal full name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                required
              />
              <Input
                label="Email Address (Required for Firebase Login)"
                type="email"
                placeholder="you@example.com"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
                required
                helperText="Required for Firebase authentication, password reset, and identity protection."
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
              <Input
                label="Account Passcode / Security PIN"
                type="password"
                placeholder="Minimum 6 characters"
                value={workerPassword}
                onChange={(e) => setWorkerPassword(e.target.value)}
                required
                helperText="Secures your capability profile on Firebase."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Field Specialization"
                value={workerSpec}
                onChange={(e) => setWorkerSpec(e.target.value)}
                options={AG_SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
              />
              <Select
                label="Operational State"
                value={workerState}
                onChange={(e) => setWorkerState(e.target.value)}
                options={ALL_STATE_NAMES.map((st) => ({ value: st, label: st }))}
              />
              <Select
                label="LGA Location"
                value={workerLga}
                onChange={(e) => setWorkerLga(e.target.value)}
                options={workerLgas.map((lg) => ({ value: lg, label: lg }))}
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#C4C8C5]">
              <span className="text-[11px] text-[#5A6E68]">Free agricultural registration</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Registering with Firebase...' : 'Register Worker Profile'}
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
              <Input
                label="Create Security Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={employerPassword}
                onChange={(e) => setEmployerPassword(e.target.value)}
                required
                helperText="Used for official corporate dashboard access."
              />
              <Select
                label="Agricultural Sub-Sector"
                value={employerSector}
                onChange={(e) => setEmployerSector(e.target.value)}
                options={AG_SECTORS.map((sec) => ({ value: sec, label: sec }))}
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
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Registering with Firebase...' : 'Register Agribusiness'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: SIGN IN & PASSWORD RESET                                       */}
        {/* ==================================================================== */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {isForgotPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="p-3 bg-[#E7F3EF] border border-[#0E5A46]/20 rounded text-xs text-[#0F1F1C] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span>Reset Your Passcode</span>
                  </div>
                  <p className="text-[11px] text-[#3A4B47]">
                    Enter your registered email address. We will dispatch a secure password reset link via Firebase Auth.
                  </p>
                </div>

                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="e.g. you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-xs text-[#5A6E68] hover:text-[#0F1F1C] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Back to Sign In
                  </button>
                  <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
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
                    label={signInMode === 'sms_otp' ? 'Registered Phone Number or Email' : 'Email Address or Phone Number'}
                    type="text"
                    placeholder={signInMode === 'sms_otp' ? 'e.g. +234 803 123 4567' : 'e.g. you@example.com'}
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />

                  {signInMode === 'password' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#0F1F1C]">Password / Security PIN</label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-[11px] text-[#0E5A46] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('worker_reg')}
                      className="text-xs text-[#0E5A46] hover:underline cursor-pointer"
                    >
                      Need an account? Register here
                    </button>
                    <Button
                      variant="primary"
                      size="md"
                      type="submit"
                      disabled={isSubmitting}
                      rightIcon={signInMode === 'sms_otp' ? <Smartphone className="w-4 h-4" /> : undefined}
                    >
                      {isSubmitting
                        ? 'Verifying...'
                        : signInMode === 'sms_otp'
                        ? 'Send OTP & Sign In'
                        : 'Sign In via Firebase'}
                    </Button>
                  </div>
                </form>
              </>
            )}
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

      {/* Post-Registration Phone OTP Verification Modal */}
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
