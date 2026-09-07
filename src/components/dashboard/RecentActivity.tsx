/**
 * RecentActivity component
 *
 * Chronological activity feed showing recent events across all applications.
 * Groups by date, shows event type icon and description.
 */

import {
  CheckCircle2, Upload, FileText, MessageSquare, CheckSquare,
  Award, ArrowRightLeft, Calendar, PenLine,
} from 'lucide-react';
import type { Activity, ActivityType } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

interface TypeConfig {
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const TYPE_MAP: Record<ActivityType, TypeConfig> = {
  document_verified: { Icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  document_uploaded: { Icon: Upload, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  application_submitted: { Icon: FileText, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  query_raised: { Icon: MessageSquare, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  query_resolved: { Icon: CheckSquare, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  approval_granted: { Icon: Award, iconBg: 'bg-green-50', iconColor: 'text-green-700' },
  status_changed: { Icon: ArrowRightLeft, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
  inspection_scheduled: { Icon: Calendar, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  note_added: { Icon: PenLine, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
};

function formatActivityDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

function groupByDate(activities: Activity[]): Record<string, Activity[]> {
  const groups: Record<string, Activity[]> = {};
  for (const a of activities) {
    const key = formatActivityDate(a.timestamp);
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  }
  return groups;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4 animate-pulse px-5 py-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="size-7 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="h-2.5 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) return <ActivitySkeleton />;

  const grouped = groupByDate(activities);

  return (
    <div role="feed" aria-label="Recent activity">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="px-5 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-y border-slate-100">
            {date}
          </p>
          <div className="divide-y divide-slate-100">
            {items.map((activity) => {
              const cfg = TYPE_MAP[activity.type];
              const { Icon } = cfg;

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 px-5 py-3"
                  role="article"
                >
                  <div
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5',
                      cfg.iconBg
                    )}
                    aria-hidden="true"
                  >
                    <Icon className={cn('size-3.5', cfg.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        {activity.description}
                      </p>
                    )}
                    {activity.applicationName && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {activity.applicationName}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 mt-0.5 tabular-nums">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
