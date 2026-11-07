import React from 'react';
import { WorkerProfile } from '../../types';
import { StatusIndicator, EvidenceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TourmsSymbol } from '../ui/TourmsLogo';
import {
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  FileCheck2,
  Edit3,
  Receipt
} from 'lucide-react';

export interface WorkerProfileViewProps {
  profile: WorkerProfile;
  onEditProfile?: () => void;
  onNavigatePayments?: () => void;
  isMobilePreview?: boolean;
}

export const WorkerProfileView: React.FC<WorkerProfileViewProps> = ({
  profile,
  onEditProfile,
  onNavigatePayments,
  isMobilePreview = false
}) => {
  return (
    <div
      className={`w-full text-left overflow-x-hidden ${
        isMobilePreview
          ? 'py-5 px-4 space-y-4 max-w-md mx-auto'
          : 'py-6 sm:py-10 md:py-12 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 sm:space-y-8'
      }`}
    >
      {/* Top Profile Header Card */}
      <section className={`bg-white border border-[#C4C8C5] rounded shadow-2xs ${isMobilePreview ? 'p-4 space-y-4' : 'p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EBEBDD]">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded bg-[#0E5A46] text-white flex items-center justify-center font-bold text-lg sm:text-xl font-display shrink-0 shadow-xs">
              {profile.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`${isMobilePreview ? 'text-lg' : 'text-lg sm:text-2xl'} font-extrabold text-[#0F1F1C] break-words`}>
                  {profile.fullName}
                </h1>
                <StatusIndicator
                  status={profile.verifiedStatus === 'verified' ? 'verified' : 'pending'}
                  customLabel={
                    profile.verifiedStatus === 'verified'
                      ? 'Verified Worker Record'
                      : 'Self-Reported Profile'
                  }
                />
                {(profile.isVerified || profile.phoneVerified) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E7F3EF] text-[#0E5A46] border border-[#0E5A46]/20">
                    <CheckCircle2 className="w-3 h-3 text-[#0E5A46]" />
                    <span>Phone Verified (SMS OTP)</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#0E5A46] mt-0.5">
                {profile.headline}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-[#5A6E68]">
                <span>Tel: <strong className="text-[#0F1F1C]">{profile.phone}</strong></span>
                {profile.email ? (
                  <span>Email: <strong className="text-[#0F1F1C]">{profile.email}</strong></span>
                ) : (
                  <span className="text-[11px] bg-[#F7F7EE] px-1.5 py-0.5 rounded text-[#5A6E68]">
                    Informal Field Worker (Phone Only)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {onNavigatePayments && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                leftIcon={<Receipt className="w-3.5 h-3.5 text-[#0E5A46]" />}
                onClick={onNavigatePayments}
              >
                Payments & Earnings
              </Button>
            )}
            {onEditProfile && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Vital Info Strip (2-col on mobile, 4-col on desktop) */}
        <div className={`grid grid-cols-2 ${isMobilePreview ? '' : 'sm:grid-cols-4'} gap-2.5 sm:gap-4 p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs`}>
          <div>
            <span className="text-[#5A6E68] text-[11px] block">Location</span>
            <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
              <span className="truncate">{profile.location.state}, {profile.location.lga}</span>
            </span>
          </div>

          <div>
            <span className="text-[#5A6E68] text-[11px] block">Availability</span>
            <span className="font-bold text-[#0F1F1C] flex items-center gap-1 mt-0.5 truncate">
              <Clock className="w-3.5 h-3.5 text-[#0E5A46] shrink-0" />
              <span className="truncate">{profile.availability}</span>
            </span>
          </div>

          <div>
            <span className="text-[#5A6E68] text-[11px] block">Relocation</span>
            <span className="font-bold text-[#0F1F1C] mt-0.5 block truncate">
              {profile.preferences.willingToRelocate ? 'Nationwide' : 'State Only'}
            </span>
          </div>

          <div>
            <span className="text-[#5A6E68] text-[11px] block">Completeness</span>
            <span className="font-bold text-[#0E5A46] tabular-nums mt-0.5 block">
              {profile.completionPercentage}% Documented
            </span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
            Field Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#3A4B47] leading-relaxed">
            {profile.summary}
          </p>
        </div>
      </section>

      {/* CORE SECTION: WHAT CAN THIS PERSON ACTUALLY DO? */}
      <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div className="border-b border-[#EBEBDD] pb-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#0E5A46] tracking-wider uppercase mb-1">
            <TourmsSymbol size={14} />
            <span>CAPABILITY-FIRST ARCHITECTURE</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F1F1C]">
            Verified Operational Capabilities
          </h2>
          <p className="text-xs text-[#5A6E68] mt-0.5">
            Demonstrated competencies backed by work logs, certifications, and institutional diplomas.
          </p>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {profile.capabilities.map((cap) => (
            <div
              key={cap.id}
              className="p-3.5 sm:p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD] space-y-1.5 text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F1F1C]">{cap.title}</h3>
                <EvidenceBadge level={cap.evidenceLevel} />
              </div>
              <p className="text-xs text-[#3A4B47] leading-relaxed">{cap.description}</p>
              {cap.evidenceDocumentName && (
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#0E5A46] font-medium">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Document Attachment: {cap.evidenceDocumentName}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technical Skills Tag Strip */}
        <div className="pt-3 border-t border-[#EBEBDD] space-y-1.5">
          <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
            Documented Skills
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6E68]">
            {profile.skills.map((skill, idx) => (
              <React.Fragment key={skill}>
                <span className="font-semibold text-[#08382B]">{skill}</span>
                {idx < profile.skills.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Experience History */}
      <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C] border-b border-[#EBEBDD] pb-2.5">
          Field & Management Experience
        </h2>

        <div className="space-y-5">
          {profile.workExperience.map((exp) => (
            <div key={exp.id} className="space-y-1.5 border-b border-[#EBEBDD] pb-4 last:border-b-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F1F1C]">{exp.role}</h3>
                <span className="text-[11px] sm:text-xs text-[#5A6E68]">
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0E5A46]">
                {exp.organisation} · {exp.location}
              </p>
              <ul className="space-y-1 text-xs text-[#3A4B47] pt-1">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A46] mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Credentials Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Education */}
        <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-[#EBEBDD] pb-2.5">
            <GraduationCap className="w-4 h-4 text-[#0E5A46]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
              Formal Education
            </h2>
          </div>
          <div className="space-y-2.5">
            {profile.education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <p className="font-bold text-[#0F1F1C]">{edu.qualification}</p>
                <p className="text-[#0E5A46] font-medium">{edu.field}</p>
                <p className="text-[#5A6E68]">
                  {edu.institution} ({edu.yearCompleted})
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white border border-[#C4C8C5] rounded p-4 sm:p-6 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-[#EBEBDD] pb-2.5">
            <Award className="w-4 h-4 text-[#C98A3A]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#0F1F1C] uppercase tracking-wider">
              Certifications & Licenses
            </h2>
          </div>
          <div className="space-y-2.5">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#0F1F1C]">{cert.name}</p>
                  <EvidenceBadge level={cert.evidenceLevel} />
                </div>
                <p className="text-[#5A6E68]">
                  Issued by {cert.issuer} ({cert.year})
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
