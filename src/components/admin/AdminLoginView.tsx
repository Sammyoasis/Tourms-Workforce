import React, { useState } from 'react';
import { AdminSubRole, UserRole } from '../../types';
import { TourmsLogo, TourmsFrequencyRhythm } from '../ui/TourmsLogo';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Terminal,
  LogOut,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export interface AdminLoginViewProps {
  onSignInSuccess: (role: UserRole, subRole: AdminSubRole, email: string) => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onSignInSuccess,
  onCancel
}) => {
  const { signIn, currentUser, userRole, adminSubRole, isAdminVerified, signOutUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessDeniedUser, setAccessDeniedUser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setAccessDeniedUser(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter an authorized administrative work email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrative security passcode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(cleanEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
        setIsSubmitting(false);
        return;
      }

      // Check if user has administrative rights
      if (result.role !== 'admin') {
        // Authenticated as standard user, but lacks backend admin custom claims
        setAccessDeniedUser(cleanEmail);
        setIsSubmitting(false);
        return;
      }

      onSignInSuccess('admin', adminSubRole, cleanEmail);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOutFromDenied = async () => {
    await signOutUser();
    setAccessDeniedUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 bg-gradient-to-b from-[#0F1F1C] via-[#162C27] to-[#0A1614] text-[#F7F7EE] text-left">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          onClick={onCancel}
          type="button"
          className="inline-flex items-center gap-2 text-xs text-[#A0B0AB] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Homepage</span>
        </button>

        {/* Console Security Card */}
        <div className="bg-[#142622] border border-[#2B4741] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
          {/* Header */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <TourmsLogo variant="agro-solutions" size="sm" theme="dark" />
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-[#C98A3A]/20 text-[#C98A3A] border border-[#C98A3A]/40 uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                <span>Restricted</span>
              </span>
            </div>

            <div className="pt-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C98A3A] shrink-0" />
                <span>Staff & Admin Console</span>
              </h1>
              <p className="text-xs text-[#A0B0AB] mt-1.5 leading-relaxed">
                Authorized platform governance, compliance auditing, CAC verification, and operational controls.
              </p>
            </div>
          </div>

          {/* Access Denied State (User authenticated, but missing admin custom claims) */}
          {accessDeniedUser ? (
            <div className="p-4 bg-[#261010] border border-[#8C2E2E] rounded-lg space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5 text-[#FF8585]">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm">Access Denied: Insufficient Privileges</h3>
                  <p className="mt-1 text-[#E0B4B4] leading-relaxed">
                    Account <strong className="text-white">{accessDeniedUser}</strong> authenticated successfully, but does not have verified administrative custom claims (<code className="bg-[#3D1A1A] px-1 py-0.5 rounded text-[10px]">role: admin</code>).
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-[#1B0C0C] border border-[#521C1C] rounded text-[11px] text-[#A0B0AB] space-y-1.5">
                <div className="flex items-center gap-1.5 font-mono text-white">
                  <Terminal className="w-3.5 h-3.5 text-[#C98A3A]" />
                  <span>Administrative Provisioning Required</span>
                </div>
                <p>
                  To grant governance privileges, execute the offline Admin SDK provisioning script on a secured terminal:
                </p>
                <pre className="p-2 bg-[#0F0808] rounded text-[10px] text-[#C98A3A] font-mono overflow-x-auto">
                  node scripts/setAdminClaims.js {accessDeniedUser} super_admin
                </pre>
              </div>

              <div className="pt-1 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOutFromDenied}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs text-white border-[#521C1C] hover:bg-[#3D1A1A]"
                >
                  Sign Out & Try Another Account
                </Button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 bg-[#331414] border border-[#8C2E2E] rounded text-xs text-[#FF8585] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D3DDD9] block">
                    Administrative Work Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tourmsworkforce.com.ng"
                    className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded px-3.5 py-2.5 text-xs text-white placeholder-[#5A6E68] focus:outline-none focus:border-[#0E5A46] focus:ring-1 focus:ring-[#0E5A46]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#D3DDD9] block">
                      Security Passcode:
                    </label>
                    <span className="text-[10px] text-[#A0B0AB]">Firebase Auth</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrative passcode"
                      className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-[#5A6E68] focus:outline-none focus:border-[#0E5A46] focus:ring-1 focus:ring-[#0E5A46]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0B0AB] hover:text-white transition-colors cursor-pointer p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0F1F1C] border border-[#2B4741] rounded text-[11px] text-[#A0B0AB]">
                  <p className="flex items-center gap-1.5 text-[#D3DDD9] font-medium">
                    <Lock className="w-3 h-3 text-[#C98A3A]" />
                    <span>Role Enforcement:</span>
                  </p>
                  <p className="mt-1 text-[10px] text-[#7A8B86]">
                    Administrative privileges are strictly verified against backend custom claims (<code className="text-[#C98A3A]">request.auth.token.role == 'admin'</code>). Client self-elevation is rejected.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center bg-[#0E5A46] hover:bg-[#08382B] text-white font-bold text-xs py-3 mt-2 shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Authenticating Operator Session...' : 'Authenticate & Open Console'}
                </Button>
              </form>
            </>
          )}

          {/* Compliance & Audit Footer */}
          <div className="pt-3 border-t border-[#243B36] flex items-center justify-between text-[10px] text-[#7A8B86]">
            <span>Security Model: ABAC / Zero-Trust</span>
            <TourmsFrequencyRhythm bars={7} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
