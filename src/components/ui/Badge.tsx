import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

export type StatusVariant =
  | 'verified'
  | 'pending'
  | 'unverified'
  | 'approved'
  | 'rejected'
  | 'self_reported'
  | 'urgent'
  | 'active'
  | 'closed';

interface StatusIndicatorProps {
  status: StatusVariant;
  customLabel?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  customLabel,
  className = ''
}) => {
  const configs: Record<
    StatusVariant,
    { label: string; icon: React.ReactNode; textClass: string }
  > = {
    verified: {
      label: 'Verified Organisation',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />,
      textClass: 'text-[#0E5A46] font-semibold'
    },
    approved: {
      label: 'Approved & Active',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />,
      textClass: 'text-[#0E5A46] font-semibold'
    },
    pending: {
      label: 'Awaiting Review',
      icon: <Clock className="w-3.5 h-3.5 text-[#8E5A18]" />,
      textClass: 'text-[#8E5A18] font-semibold'
    },
    unverified: {
      label: 'Unverified Entity',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#6B7280]" />,
      textClass: 'text-[#4B5563]'
    },
    self_reported: {
      label: 'Self-Reported Evidence',
      icon: <Clock className="w-3.5 h-3.5 text-[#4B5563]" />,
      textClass: 'text-[#4B5563]'
    },
    urgent: {
      label: 'Urgent Placement',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#C53030]" />,
      textClass: 'text-[#C53030] font-semibold'
    },
    active: {
      label: 'Active Listing',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />,
      textClass: 'text-[#0E5A46]'
    },
    closed: {
      label: 'Application Closed',
      icon: <XCircle className="w-3.5 h-3.5 text-[#6B7280]" />,
      textClass: 'text-[#6B7280]'
    },
    rejected: {
      label: 'Changes Requested / Rejected',
      icon: <XCircle className="w-3.5 h-3.5 text-[#C53030]" />,
      textClass: 'text-[#C53030] font-semibold'
    }
  };

  const current = configs[status] || configs.unverified;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${current.textClass} ${className}`}
    >
      <span className="shrink-0">{current.icon}</span>
      <span>{customLabel || current.label}</span>
    </span>
  );
};

export const EvidenceBadge: React.FC<{
  level: 'self_reported' | 'verified_document' | 'institutional_credential';
  className?: string;
}> = ({ level, className = '' }) => {
  if (level === 'institutional_credential') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-[#0E5A46] font-semibold ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-[#0E5A46]" />
        <span>Institutional Credential</span>
      </span>
    );
  }

  if (level === 'verified_document') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-[#08382B] font-medium ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46]" />
        <span>Verified Document Attached</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-[#5A6E68] ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#8A9C96]"></span>
      <span>Self-Reported</span>
    </span>
  );
};
