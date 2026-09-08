/**
 * EligibilityBadge — Reusable eligibility status indicator
 *
 * Uses text + colored indicator (not color-alone for accessibility).
 * Screen-reader friendly with aria-label.
 */

import { cn } from '@/lib/utils';
import type { EligibilityStatus } from '@/types/scheme.types';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  EligibilityStatus,
  { label: string; dotClass: string; textClass: string; bgClass: string; borderClass: string }
> = {
  likely_eligible: {
    label: 'Likely Eligible',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-800',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  check_required: {
    label: 'Eligibility Check Required',
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-800',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  missing_info: {
    label: 'Information Required',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-800',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
  },
  not_eligible: {
    label: 'Not Eligible',
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
  },
};

export function EligibilityBadge({ status, className, size = 'sm' }: EligibilityBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      role="status"
      aria-label={`Eligibility status: ${cfg.label}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 font-medium',
        size === 'sm' ? 'py-0.5 text-xs' : 'py-1 text-sm',
        cfg.bgClass,
        cfg.borderClass,
        cfg.textClass,
        className
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', cfg.dotClass)} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
