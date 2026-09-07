/**
 * ApprovalProgress component
 *
 * Shows overall approval progress as a segmented progress indicator
 * with a list of individual approvals and their status.
 */

import { CheckCircle2, Loader2, Circle, XCircle } from 'lucide-react';
import type { Approval, ApprovalStatus } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  Icon: React.ElementType;
  iconClass: string;
  textClass: string;
}

const STATUS_MAP: Record<ApprovalStatus, StatusConfig> = {
  approved: {
    label: 'Approved',
    Icon: CheckCircle2,
    iconClass: 'text-green-600',
    textClass: 'text-slate-700',
  },
  in_progress: {
    label: 'In progress',
    Icon: Loader2,
    iconClass: 'text-blue-500',
    textClass: 'text-slate-700',
  },
  not_started: {
    label: 'Not started',
    Icon: Circle,
    iconClass: 'text-slate-300',
    textClass: 'text-slate-400',
  },
  rejected: {
    label: 'Rejected',
    Icon: XCircle,
    iconClass: 'text-red-500',
    textClass: 'text-red-700',
  },
};

interface ApprovalProgressProps {
  approvals: Approval[];
}

export function ApprovalProgress({ approvals }: ApprovalProgressProps) {
  const completed = approvals.filter((a) => a.status === 'approved').length;
  const total = approvals.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">Approval Progress</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          {completed} of {total} major approvals completed
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Overall completion</span>
          <span className="text-xs font-semibold text-slate-700 tabular-nums">{pct}%</span>
        </div>
        <div
          className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-100"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Approval completion"
        >
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Individual approvals */}
      <ul className="px-5 pb-5 pt-3 space-y-2.5" aria-label="Approval statuses">
        {approvals.map((approval) => {
          const cfg = STATUS_MAP[approval.status];
          const { Icon } = cfg;
          return (
            <li key={approval.id} className="flex items-start gap-2.5">
              <Icon
                className={cn(
                  'mt-0.5 size-4 shrink-0',
                  cfg.iconClass,
                  approval.status === 'in_progress' && 'animate-spin'
                )}
                aria-label={cfg.label}
              />
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm', cfg.textClass, 'truncate')}>{approval.name}</p>
                <p className="text-xs text-slate-400 truncate">{approval.authority}</p>
              </div>
              <span className={cn('text-xs shrink-0', cfg.iconClass)}>
                {cfg.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
