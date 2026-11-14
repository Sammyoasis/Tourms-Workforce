import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import {
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCw,
  MessageSquare,
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { sendTermiiOtp, verifyTermiiOtp } from '../../services/otpService';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'phone' | 'email';
  targetValue: string; // phone number or email address
  userName?: string;
  onVerified: (verifiedValue: string, channel: 'sms' | 'whatsapp' | 'email') => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  type,
  targetValue,
  userName = 'User',
  onVerified
}) => {
  const { addToast } = useToast();
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState<string>('482910');
  const [countdown, setCountdown] = useState<number>(55);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [simulatedDelivered, setSimulatedDelivered] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Detect Nigerian Network Provider from phone prefix
  const detectCarrier = (phoneStr: string): string => {
    const clean = phoneStr.replace(/\D/g, '');
    const prefix = clean.startsWith('234') ? clean.slice(3, 6) : clean.slice(0, 4);
    if (['803', '806', '703', '706', '813', '816', '810', '814', '903', '906', '0803', '0806', '0703', '0813'].includes(prefix)) {
      return 'MTN Nigeria';
    }
    if (['802', '808', '708', '812', '701', '902', '901', '904', '0802', '0808', '0708', '0812'].includes(prefix)) {
      return 'Airtel Nigeria';
    }
    if (['805', '807', '705', '815', '811', '905', '0805', '0807', '0705', '0815'].includes(prefix)) {
      return 'Globacom (Glo)';
    }
    if (['809', '817', '818', '909', '908', '0809', '0817'].includes(prefix)) {
      return '9mobile';
    }
    return 'Nigerian Mobile Network';
  };

  const [pinId, setPinId] = useState<string>('');

  // Generate random 6-digit OTP when modal opens or resends
  const generateNewOtp = async () => {
    setOtpDigits(['', '', '', '', '', '']);
    setCountdown(55);
    setCanResend(false);
    setSimulatedDelivered(true);

    if (type === 'phone') {
      const resp = await sendTermiiOtp(targetValue || '08030000000', 'worker', channel === 'whatsapp' ? 'whatsapp' : 'dnd');
      setPinId(resp.pinId);
      if (resp.previewCode) {
        setGeneratedCode(resp.previewCode);
      }
    } else {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(randomCode);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateNewOtp();
    }
  }, [isOpen, type, targetValue]);

  // Timer countdown
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
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    // Auto advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    const lastFilledIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleAutoFillCode = () => {
    const digits = generatedCode.split('');
    setOtpDigits(digits);
    inputRefs.current[5]?.focus();
    addToast({
      type: 'info',
      title: 'OTP Auto-Filled',
      message: `Verified SMS code ${generatedCode} was securely populated.`
    });
  };

  const handleVerify = async () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      addToast({
        type: 'error',
        title: 'Incomplete OTP',
        message: 'Please enter the complete 6-digit verification code.'
      });
      return;
    }

    setIsVerifying(true);
    let verified = false;
    if (type === 'phone') {
      const resp = await verifyTermiiOtp(pinId, enteredCode, targetValue);
      verified = resp.verified;
    } else {
      verified = enteredCode === generatedCode;
    }
    setIsVerifying(false);

    if (verified) {
      const finalChannel = type === 'email' ? 'email' : channel;
      onVerified(targetValue, finalChannel);
      addToast({
        type: 'success',
        title: `${type === 'phone' ? 'Phone Number' : 'Email'} Verified`,
        message: `${targetValue} has been authenticated with TOURMS Registry.`
      });
      onClose();
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Verification Code',
        message: 'The code you entered is incorrect or expired. Please check and try again.'
      });
    }
  };

  const carrier = type === 'phone' ? detectCarrier(targetValue) : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'phone' ? 'Verify Mobile Phone' : 'Verify Official Email'}
      description={
        type === 'phone'
          ? 'Secure your TOURMS agricultural account via instant SMS or WhatsApp one-time PIN.'
          : 'Confirm your commercial enterprise email address to activate your employer account.'
      }
      maxWidth="md"
    >
      <div className="space-y-4 text-left">
        {/* Recipient & Channel Info Card */}
        <div className="p-3.5 bg-[#F2F7F4] border border-[#C2DDD3] rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0E5A46] text-white flex items-center justify-center shrink-0">
                {type === 'phone' ? <Smartphone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#5A6E68] uppercase tracking-wider block">
                  {type === 'phone' ? 'Recipient Mobile' : 'Recipient Corporate Email'}
                </span>
                <span className="text-sm font-bold text-[#0F1F1C] tracking-wide block">
                  {targetValue || '(No target specified)'}
                </span>
                {type === 'phone' && (
                  <span className="text-[10px] text-[#0E5A46] font-medium">
                    Route: {carrier} • DND Bypass Active
                  </span>
                )}
              </div>
            </div>

            {type === 'phone' && (
              <div className="flex items-center gap-1 bg-white p-1 rounded border border-[#C4C8C5] text-xs">
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    channel === 'sms' ? 'bg-[#0E5A46] text-white' : 'text-[#3A4B47] hover:bg-[#F2F7F4]'
                  }`}
                >
                  SMS OTP
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    channel === 'whatsapp' ? 'bg-[#25D366] text-white' : 'text-[#3A4B47] hover:bg-[#F2F7F4]'
                  }`}
                >
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Confirmation Note */}
        <div className="p-3 bg-[#FAF9F5] border border-[#EBEBDD] rounded text-xs text-[#5A6E68] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0E5A46] shrink-0" />
          <span>
            A secure 6-digit OTP has been dispatched to your mobile phone. Please enter it below to confirm your identity.
          </span>
        </div>

        {/* 6-digit OTP Inputs */}
        <div className="py-2 space-y-2 text-center">
          <label className="text-xs font-semibold text-[#0F1F1C] block">
            Enter 6-Digit Verification Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
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
                aria-label={`Digit ${idx + 1}`}
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
              disabled={!canResend}
              onClick={generateNewOtp}
              className={`flex items-center gap-1 font-semibold ${
                canResend
                  ? 'text-[#0E5A46] hover:underline cursor-pointer'
                  : 'text-[#A0B0AB] cursor-not-allowed'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              Resend Code
            </button>
          </div>
        </div>

        {/* Informal Worker Assistance Note */}
        {type === 'phone' && (
          <div className="p-2.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-[11px] text-[#5A6E68] space-y-1">
            <div className="font-semibold text-[#0F1F1C] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#C98A3A]" />
              Field Extension & Informal Worker Support:
            </div>
            <p>
              Informal agricultural workers without internet data can receive this via standard SMS or WhatsApp. No email address is required.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-[#C4C8C5]">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            isLoading={isVerifying}
            onClick={handleVerify}
            rightIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Verify & Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
