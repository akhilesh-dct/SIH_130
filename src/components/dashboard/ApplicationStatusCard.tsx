/**
 * ApplicationStatusCard component
 *
 * Renders a single application row with status badge, department, progress, and next action.
 * Used in the Application Status section of the dashboard.
 */

import { Link } from 'react-router-dom';
import {
  CheckCircle2, Clock, AlertCircle, FileText, XCircle, ChevronRight, AlertTriangle,
} from 'lucide-react';
import type { Application, ApplicationStatus } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

interface StatusConfig {
  label: string;
  Icon: React.ElementType;
  badgeClass: string;
}

const STATUS_MAP: Record<ApplicationStatus, StatusConfig> = {
  draft: { label: 'Draft', Icon: FileText, badgeClass: 'bg-slate-100 text-slate-500' },
  submitted: { label: 'Submitted', Icon: Clock, badgeClass: 'bg-blue-50 text-blue-600' },
  documents_required: { label: 'Documents required', Icon: AlertTriangle, badgeClass: 'bg-amber-50 text-amber-700' },
  under_review: { label: 'Under review', Icon: Clock, badgeClass: 'bg-blue-50 text-blue-700' },
  query_raised: { label: 'Query raised', Icon: AlertCircle, badgeClass: 'bg-amber-50 text-amber-700' },
  inspection_scheduled: { label: 'Inspection scheduled', Icon: Clock, badgeClass: 'bg-purple-50 text-purple-700' },
  approved: { label: 'Approved', Icon: CheckCircle2, badgeClass: 'bg-green-50 text-green-700' },
  rejected: { label: 'Rejected', Icon: XCircle, badgeClass: 'bg-red-50 text-red-700' },
  withdrawn: { label: 'Withdrawn', Icon: XCircle, badgeClass: 'bg-slate-100 text-slate-400' },
};


function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  return d === 0 ? 'today' : d === 1 ? '1 day ago' : `${d} days ago`;
}

interface ApplicationStatusCardProps {
  application: Application;
}

export function ApplicationStatusCard({ application: app }: ApplicationStatusCardProps) {
  const cfg = STATUS_MAP[app.status];
  const { Icon } = cfg;
  const isActionable =
    app.status === 'query_raised' ||
    app.status === 'documents_required';

  return (
    <Link
      to={`/applications/${app.id}`}
      className={cn(
        'group flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm',
        'hover:shadow-md transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isActionable ? 'border-amber-200' : 'border-slate-200'
      )}
      aria-label={`${app.name} — ${cfg.label}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{app.name}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{app.department}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
              cfg.badgeClass
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {cfg.label}
          </span>
          <ChevronRight
            className="size-4 text-slate-300 group-hover:text-blue-500 transition-colors"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Progress bar */}
      {app.status !== 'draft' && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs font-medium text-slate-600 tabular-nums">
              {app.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100" aria-hidden="true">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                app.status === 'approved' ? 'bg-green-500' : 'bg-blue-600'
              )}
              style={{ width: `${app.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Ref: {app.referenceNo}</span>
        {app.submittedAt && (
          <span>Submitted {daysAgo(app.submittedAt)}</span>
        )}
      </div>

      {/* Next action */}
      {app.nextAction && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-100 px-3 py-2">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <p className="text-xs text-amber-700 leading-relaxed">{app.nextAction}</p>
        </div>
      )}
    </Link>
  );
}
