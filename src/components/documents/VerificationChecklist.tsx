/**
 * VerificationChecklist component
 *
 * Renders the list of individual verification checks for a document.
 * Shows pass/fail/warning/pending states per check.
 */

import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { ElementType } from 'react';
import type { VerificationCheck, VerificationCheckStatus } from '@/types/document.types';
import { cn } from '@/lib/utils';



interface CheckItemConfig {
  Icon: ElementType;
  iconClass: string;
  labelClass: string;
}

const CHECK_STATUS: Record<VerificationCheckStatus, CheckItemConfig> = {
  passed: {
    Icon: CheckCircle2,
    iconClass: 'text-green-600',
    labelClass: 'text-slate-700',
  },
  failed: {
    Icon: XCircle,
    iconClass: 'text-red-600',
    labelClass: 'text-red-700',
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: 'text-amber-600',
    labelClass: 'text-amber-700',
  },
  pending: {
    Icon: Clock,
    iconClass: 'text-slate-400',
    labelClass: 'text-slate-500',
  },
};

interface VerificationChecklistProps {
  checks: VerificationCheck[];
}

export function VerificationChecklist({ checks }: VerificationChecklistProps) {
  return (
    <div
      className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden"
      role="list"
      aria-label="Verification checks"
    >
      {checks.map((check) => {
        const config = CHECK_STATUS[check.status];
        const { Icon } = config;

        return (
          <div
            key={check.id}
            role="listitem"
            className="flex items-start gap-3 bg-white px-4 py-3"
          >
            <Icon
              className={cn('mt-0.5 size-4 shrink-0', config.iconClass)}
              aria-label={check.status}
            />
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium', config.labelClass)}>
                {check.label}
              </p>
              {check.status !== 'passed' && (
                <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                  {check.description}
                </p>
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium capitalize shrink-0',
                config.iconClass
              )}
              aria-hidden="true"
            >
              {check.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
