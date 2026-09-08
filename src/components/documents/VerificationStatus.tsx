/**
 * VerificationStatus component
 *
 * Renders a badge/chip for a document's verification status.
 * Used in both the list row and the detail panel.
 */

import { CheckCircle2, Clock, AlertCircle, XCircle, Upload, HelpCircle } from 'lucide-react';
import type { ElementType } from 'react';
import type { DocumentStatus } from '@/types/document.types';
import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  Icon: ElementType;
  className: string;
}

const STATUS_MAP: Record<DocumentStatus, StatusConfig> = {
  not_uploaded: {
    label: 'Not uploaded',
    Icon: HelpCircle,
    className: 'bg-slate-100 text-slate-500',
  },
  validating: {
    label: 'Validating',
    Icon: Clock,
    className: 'bg-blue-50 text-blue-600',
  },
  uploaded: {
    label: 'Uploaded',
    Icon: Upload,
    className: 'bg-blue-50 text-blue-600',
  },
  verifying: {
    label: 'Verifying',
    Icon: Clock,
    className: 'bg-amber-50 text-amber-600',
  },
  verified: {
    label: 'Verified',
    Icon: CheckCircle2,
    className: 'bg-green-50 text-green-700',
  },
  needs_attention: {
    label: 'Needs attention',
    Icon: AlertCircle,
    className: 'bg-amber-50 text-amber-700',
  },
  rejected: {
    label: 'Rejected',
    Icon: XCircle,
    className: 'bg-red-50 text-red-700',
  },
  expired: {
    label: 'Expired',
    Icon: AlertCircle,
    className: 'bg-slate-100 text-slate-500',
  },
};

interface VerificationStatusProps {
  status: DocumentStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function VerificationStatus({
  status,
  size = 'sm',
  className,
}: VerificationStatusProps) {
  const config = STATUS_MAP[status];
  const { Icon } = config;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
      aria-label={`Status: ${config.label}`}
    >
      <Icon
        className={cn('shrink-0', size === 'sm' ? 'size-3' : 'size-3.5')}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
