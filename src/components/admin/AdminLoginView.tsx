import React, { useState } from 'react';
import { AdminSubRole, UserRole } from '../../types';
import { TourmsLogo, TourmsSymbol, TourmsFrequencyRhythm } from '../ui/TourmsLogo';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, UserCheck, Eye, EyeOff } from 'lucide-react';

export interface AdminLoginViewProps {
  onSignInSuccess: (role: UserRole, subRole: AdminSubRole, email: string) => void;
  onCancel: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onSignInSuccess,
  onCancel
}) => {
  const [email, setEmail] = useState('molanysolutions@gmail.com');
  const [password, setPassword] = useState('tourms2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [subRole, setSubRole] = useState<AdminSubRole>('super_admin');
  const [securityPin, setSecurityPin] = useState('7702');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter an authorized administrative work email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess('admin', subRole, email.trim());
    }, 400);
  };

  const handleQuickLogin = (targetSubRole: AdminSubRole, targetEmail: string) => {
    setIsLoading(true);
    setSubRole(targetSubRole);
    setEmail(targetEmail);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess('admin', targetSubRole, targetEmail);
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6 bg-gradient-to-b from-[#0F1F1C] via-[#162C27] to-[#0A1614] text-[#F7F7EE] text-left">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          onClick={onCancel}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-[#A0B0AB] hover:text-white transition-colors cursor-pointer"
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
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C98A3A]/20 text-[#C98A3A] border border-[#C98A3A]/40 uppercase tracking-wider">
                <Lock className="w-2.5 h-2.5" />
                <span>Restricted</span>
              </span>
            </div>

            <div className="pt-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C98A3A] shrink-0" />
                <span>Staff & Admin Console</span>
              </h1>
              <p className="text-xs text-[#A0B0AB] mt-1">
                Authorized operations, compliance auditing, CAC document verification, and platform management.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-[#331414] border border-[#8C2E2E] rounded text-xs text-[#FF8585] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D3DDD9] block">
                Administrative Work Email:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@tourmsworkforce.com.ng"
                className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded px-3 py-2 text-xs text-white placeholder-[#5A6E68] focus:outline-none focus:border-[#0E5A46] focus:ring-1 focus:ring-[#0E5A46]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#D3DDD9] block">
                  Security Passcode / Password:
                </label>
                <span className="text-[10px] text-[#A0B0AB]">256-bit Encrypted</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="tourms2026!"
                  className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded pl-3 pr-9 py-2 text-xs text-white placeholder-[#5A6E68] focus:outline-none focus:border-[#0E5A46] focus:ring-1 focus:ring-[#0E5A46]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0B0AB] hover:text-white transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-[#A0B0AB]">
                Default Passcode: <span className="font-mono text-[#C98A3A] font-bold">tourms2026!</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D3DDD9] block">
                  Assigned Sub-Role:
                </label>
                <select
                  value={subRole}
                  onChange={(e) => setSubRole(e.target.value as AdminSubRole)}
                  className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#0E5A46]"
                >
                  <option value="super_admin">Super Administrator</option>
                  <option value="operations">Operations Officer</option>
                  <option value="verification">Verification Lead</option>
                  <option value="editorial">Senior Editorial Desk</option>
                  <option value="support">Support Lead</option>
                  <option value="analyst">Data Analyst</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#D3DDD9] block">
                  Security Token / PIN:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="7702"
                  className="w-full bg-[#0F1F1C] border border-[#2B4741] rounded px-3 py-2 text-xs text-white placeholder-[#5A6E68] focus:outline-none focus:border-[#0E5A46] font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center bg-[#0E5A46] hover:bg-[#08382B] text-white font-bold text-xs py-2.5 mt-2 shadow-lg cursor-pointer"
            >
              {isLoading ? 'Authenticating Operator Session...' : 'Authenticate & Open Console'}
            </Button>
          </form>

          {/* Quick Operator Presets */}
          <div className="pt-4 border-t border-[#243B36] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A0B0AB] uppercase tracking-wider">
                Quick Operator Presets
              </span>
              <span className="text-[10px] text-[#7A8B86]">Instant Sign-In</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('super_admin', 'molanysolutions@gmail.com')}
                className="p-2.5 rounded bg-[#0F1F1C] hover:bg-[#1A312D] border border-[#2B4741] text-left transition-colors cursor-pointer space-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-[#C98A3A] font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Executive Admin</span>
                </div>
                <p className="text-[10px] text-[#A0B0AB] truncate">molanysolutions@gmail.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('verification', 'verifier@tourmsworkforce.com.ng')}
                className="p-2.5 rounded bg-[#0F1F1C] hover:bg-[#1A312D] border border-[#2B4741] text-left transition-colors cursor-pointer space-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-[#28A745] font-bold text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>CAC Verifier</span>
                </div>
                <p className="text-[10px] text-[#A0B0AB] truncate">Document Desk Lead</p>
              </button>
            </div>
          </div>

          {/* Compliance & Audit Footer */}
          <div className="pt-3 border-t border-[#243B36] flex items-center justify-between text-[10px] text-[#7A8B86]">
            <span>Session ID: #TRM-SEC-2026</span>
            <TourmsFrequencyRhythm bars={7} height={14} />
          </div>
        </div>
      </div>
    </div>
  );
};
