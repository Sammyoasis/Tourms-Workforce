import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCw,
  Sparkles,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  sendTermiiOtp,
  verifyTermiiOtp,
  isTermiiLiveConfigured,
  TermiiSendOtpResponse
} from '../../services/otpService';
import {
  detectCarrier,
  normalizeNigerianPhone
} from '../../services/otpVerificationService';

export interface PostRegistrationOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'worker' | 'employer';
  userName: string;
  phoneNumber: string;
  email?: string;
  onVerificationSuccess: () => void;
  onSkip?: () => void;
}

export const PostRegistrationOtpModal: React.FC<PostRegistrationOtpModalProps> = ({
  isOpen,
  onClose,
  role,
  userName,
  phoneNumber,
  email,
  onVerificationSuccess,
  onSkip
}) => {
  const { addToast } = useToast();
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activePinId, setActivePinId] = useState<string>('');
  const [activeSession, setActiveSession] = useState<TermiiSendOtpResponse | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [incomingSmsBanner, setIncomingSmsBanner] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const normalized = normalizeNigerianPhone(phoneNumber || '08030000000');
  const carrier = detectCarrier(normalized);

  // Send Termii SMS on modal open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSending(true);
    setDigits(['', '', '', '', '', '']);
    setCountdown(60);
    setCanResend(false);

    sendTermiiOtp(phoneNumber || '08030000000', role, channel === 'whatsapp' ? 'whatsapp' : 'dnd').then((session) => {
      if (!isMounted) return;
      setActiveSession(session);
      setActivePinId(session.pinId);
      if (session.previewCode) {
        setIncomingSmsBanner(session.previewCode);
      }
      setIsSending(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, phoneNumber, role, channel]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    const targetIdx = Math.min(pasted.length, 5);
    inputRefs.current[targetIdx]?.focus();
  };

  const handleAutoFill = () => {
    if (!activeSession?.previewCode) return;
    const targetCode = activeSession.previewCode;
    setDigits(targetCode.split(''));
    inputRefs.current[5]?.focus();
    addToast({
      type: 'info',
      title: 'Termii OTP Auto-Filled',
      message: `Termii code ${targetCode} auto-filled for testing.`
    });
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsSending(true);
    setDigits(['', '', '', '', '', '']);
    setCountdown(60);
    setCanResend(false);

    const session = await sendTermiiOtp(phoneNumber, role, channel === 'whatsapp' ? 'whatsapp' : 'dnd');
    setActiveSession(session);
    setActivePinId(session.pinId);
    if (session.previewCode) {
      setIncomingSmsBanner(session.previewCode);
    }
    setIsSending(false);

    addToast({
      type: 'info',
      title: 'Termii OTP Dispatched',
      message: `Fresh verification code sent via ${channel === 'sms' ? 'Termii DND SMS' : 'WhatsApp'}.`
    });
  };

  const handleVerify = async () => {
    const entered = digits.join('');
    if (entered.length !== 6) {
      addToast({
        type: 'error',
        title: 'Incomplete Code',
        message: 'Please enter all 6 digits of the verification code.'
      });
      return;
    }

    setIsVerifying(true);
    const result = await verifyTermiiOtp(activePinId, entered, phoneNumber);
    setIsVerifying(false);

    if (result.verified) {
      addToast({
        type: 'success',
        title: 'Phone Number Verified',
        message: `Welcome to TOURMS, ${userName}. Your mobile account is verified via Termii.`
      });
      onVerificationSuccess();
      onClose();
    } else {
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: result.message
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role === 'worker' ? 'Verify Mobile Phone Number' : 'Enterprise Mobile Verification'}
      description="Quick 6-digit SMS confirmation to activate your verified TOURMS account."
      maxWidth="md"
    >
      <div className="space-y-4 text-left">
        {/* Role-Specific Context Notice: EXCLUDING EMAIL FOR WORKERS */}
        {role === 'worker' ? (
          <div className="p-3 bg-[#E7F3EF] border border-[#0E5A46]/20 rounded-md text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#0E5A46]" />
              <span>Phone-First Informal Agricultural Worker Access</span>
            </div>
            <p className="text-[11px] text-[#3A4B47] leading-relaxed">
              <strong>Email is completely excluded and not required.</strong> As an agricultural worker, your account and direct SMS job alerts are tied directly to your verified Nigerian mobile number.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-[#F2F7F4] border border-[#C2DDD3] rounded-md text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#0E5A46]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#0E5A46]" />
              <span>Agribusiness Enterprise Contact Verification</span>
            </div>
            <p className="text-[11px] text-[#3A4B47] leading-relaxed">
              Verify the primary operations mobile number for {userName || 'your agribusiness'} to receive real-time candidate applications and dispatch confirmations.
            </p>
          </div>
        )}

        {/* Recipient Details & Telco Route */}
        <div className="p-3 bg-white border border-[#C4C8C5] rounded-lg shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#0E5A46] text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5A6E68] tracking-wider block">
                Target Mobile Number
              </span>
              <span className="text-sm font-bold text-[#0F1F1C] tracking-wide block font-mono">
                {normalized}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0E5A46]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46]" />
                  {carrier.name}
                </span>
                <span className="text-[10px] text-[#5A6E68]">DND Bypass Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F7EE] p-1 rounded border border-[#EBEBDD] text-xs">
            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                channel === 'sms' ? 'bg-[#0E5A46] text-white' : 'text-[#3A4B47] hover:bg-white'
              }`}
            >
              SMS
            </button>
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                channel === 'whatsapp' ? 'bg-[#25D366] text-white' : 'text-[#3A4B47] hover:bg-white'
              }`}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {/* High-Fidelity Incoming SMS Simulation Card */}
        {incomingSmsBanner && (
          <div className="p-3 bg-[#FFF9E6] border border-[#F3D78A] rounded-lg space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#855B14] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C98A3A]" />
                Simulated {channel === 'sms' ? 'SMS Gateway Notification' : 'WhatsApp Message'}
              </span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] font-bold text-[#0E5A46] hover:underline bg-white px-2 py-0.5 rounded border border-[#C2DDD3] cursor-pointer"
              >
                Tap to Autofill
              </button>
            </div>
            <p className="text-xs font-mono text-[#0F1F1C] bg-white/70 p-2 rounded border border-[#F3D78A]/60">
              📨 &quot;TOURMS: Your mobile verification code is <strong className="text-base text-[#0E5A46] tracking-widest">{incomingSmsBanner}</strong>. Valid for 5 minutes.&quot;
            </p>
          </div>
        )}

        {/* 6 Digit Input Group */}
        <div className="py-2 space-y-2 text-center">
          <label className="text-xs font-semibold text-[#0F1F1C] block">
            Enter 6-Digit SMS Verification Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono bg-white border-2 border-[#C4C8C5] focus:border-[#0E5A46] focus:ring-2 focus:ring-[#0E5A46]/20 rounded-md outline-none transition-all text-[#0F1F1C]"
                aria-label={`Verification Digit ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5A6E68] pt-2 px-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#5A6E68]" />
              {countdown > 0 ? (
                <span>Code expires in <strong className="text-[#0F1F1C]">{countdown}s</strong></span>
              ) : (
                <span className="text-[#BA1A1A] font-semibold">Code expired</span>
              )}
            </div>

            <button
              type="button"
              disabled={!canResend || isSending}
              onClick={handleResend}
              className={`flex items-center gap-1 font-semibold ${
                canResend && !isSending
                  ? 'text-[#0E5A46] hover:underline cursor-pointer'
                  : 'text-[#A0B0AB] cursor-not-allowed'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-[#C4C8C5]">
          {onSkip ? (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-[#5A6E68] hover:text-[#0F1F1C] hover:underline cursor-pointer font-medium"
            >
              Skip verification for now
            </button>
          ) : (
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            type="button"
            isLoading={isVerifying}
            onClick={handleVerify}
            rightIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Verify Phone Number
          </Button>
        </div>
      </div>
    </Modal>
  );
};
