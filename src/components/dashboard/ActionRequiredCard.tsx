/**
 * ActionRequiredCard component
 *
 * Displays a single action item requiring user attention.
 * Shows: severity, application context, description, deadline, CTA.
 */

import { Link } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Info, Calendar } from 'lucide-react';
import type { ActionItem, ActionSeverity } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

interface SeverityConfig {
  Icon: React.ElementType;
  containerClass: string;
  iconClass: string;
  labelClass: string;
  label: string;
}

const SEVERITY_MAP: Record<ActionSeverity, SeverityConfig> = {
  urgent: {
    Icon: AlertCircle,
    containerClass: 'border-red-200 bg-red-50',
    iconClass: 'text-red-600',
    labelClass: 'text-red-700',
    label: 'Urgent',
  },
  warning: {
    Icon: AlertTriangle,
    containerClass: 'border-amber-200 bg-amber-50',
    iconClass: 'text-amber-600',
    labelClass: 'text-amber-700',
    label: 'Action required',
  },
  info: {
    Icon: Info,
    containerClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    labelClass: 'text-blue-700',
    label: 'Information',
  },
};

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  const diff = d.getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days (${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})`;
}

interface ActionRequiredCardProps {
  action: ActionItem;
}

export function ActionRequiredCard({ action }: ActionRequiredCardProps) {
  const cfg = SEVERITY_MAP[action.severity];
  const { Icon } = cfg;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 space-y-3',
        cfg.containerClass
      )}
      role="article"
      aria-label={`Action: ${action.title}`}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <Icon className={cn('mt-0.5 size-4 shrink-0', cfg.iconClass)} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs font-semibold uppercase tracking-wide', cfg.labelClass)}>
              {cfg.label}
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-600 font-medium">{action.applicationName}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900">{action.title}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-700 leading-relaxed">{action.description}</p>

      {/* Footer: deadline + CTA */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {action.deadline && (
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            {formatDeadline(action.deadline)}
          </span>
        )}
        <Link
          to={action.ctaHref}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5',
            'text-xs font-semibold transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            action.severity === 'urgent'
              ? 'border-red-300 bg-white text-red-700 hover:bg-red-100'
              : action.severity === 'warning'
              ? 'border-amber-300 bg-white text-amber-700 hover:bg-amber-100'
              : 'border-blue-300 bg-white text-blue-700 hover:bg-blue-100'
          )}
        >
          {action.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
