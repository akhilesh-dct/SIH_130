import { cn } from '@/lib/utils';
import type { ComplianceStatus } from '@/types/compliance.types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, FileWarning, HelpCircle } from 'lucide-react';

interface Props {
  status: ComplianceStatus;
  className?: string;
  showIcon?: boolean;
}

export function ComplianceStatusBadge({ status, className, showIcon = true }: Props) {
  const config: Record<ComplianceStatus, { label: string; color: string; Icon: any }> = {
    COMPLIANT: { label: 'Compliant', color: 'bg-green-100 text-green-700 border-green-200', Icon: CheckCircle2 },
    DUE_SOON: { label: 'Due Soon', color: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock },
    DUE: { label: 'Due', color: 'bg-orange-100 text-orange-700 border-orange-200', Icon: AlertTriangle },
    OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200', Icon: XCircle },
    AT_RISK: { label: 'At Risk', color: 'bg-rose-100 text-rose-700 border-rose-200', Icon: AlertTriangle },
    NOT_STARTED: { label: 'Not Started', color: 'bg-slate-100 text-slate-700 border-slate-200', Icon: HelpCircle },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', Icon: Clock },
    SUBMITTED: { label: 'Submitted', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', Icon: FileWarning },
    UNDER_REVIEW: { label: 'Under Review', color: 'bg-purple-100 text-purple-700 border-purple-200', Icon: Clock },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', Icon: XCircle },
    EXPIRED: { label: 'Expired', color: 'bg-slate-100 text-slate-700 border-slate-200', Icon: XCircle },
    NOT_APPLICABLE: { label: 'Not Applicable', color: 'bg-slate-50 text-slate-500 border-slate-200', Icon: HelpCircle },
  };

  const { label, color, Icon } = config[status] || config['NOT_STARTED'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        color,
        className
      )}
    >
      {showIcon && <Icon className="size-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
}
