/**
 * ApplicationTimeline component
 *
 * Vertical timeline showing the progression of a single application.
 * Completed steps: solid line + check. Active: pulsing dot. Pending: dashed.
 */

import { CheckCircle2, Circle } from 'lucide-react';
import type { TimelineEvent } from '@/types/dashboard.types';
import { cn } from '@/lib/utils';

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
}

export function ApplicationTimeline({ events }: ApplicationTimelineProps) {
  return (
    <ol className="relative space-y-0" aria-label="Application timeline">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="relative flex gap-4">
            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[11px] top-6 w-0.5 h-full',
                  event.status === 'completed'
                    ? 'bg-blue-200'
                    : 'border-l-2 border-dashed border-slate-200'
                )}
                aria-hidden="true"
              />
            )}

            {/* Icon */}
            <div className="relative flex size-6 shrink-0 items-center justify-center">
              {event.status === 'completed' ? (
                <CheckCircle2 className="size-5.5 text-blue-600" aria-label="Completed" />
              ) : event.status === 'active' ? (
                <div className="relative flex size-5 items-center justify-center">
                  <span
                    className="absolute inline-flex size-5 rounded-full bg-blue-400 opacity-40 animate-ping"
                    aria-hidden="true"
                  />
                  <span className="relative inline-flex size-3 rounded-full bg-blue-600" />
                </div>
              ) : (
                <Circle className="size-5 text-slate-300" aria-label="Pending" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <p
                className={cn(
                  'text-sm font-medium leading-snug',
                  event.status === 'completed'
                    ? 'text-slate-700'
                    : event.status === 'active'
                    ? 'text-slate-900'
                    : 'text-slate-400'
                )}
              >
                {event.label}
              </p>
              {event.description && (
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {event.description}
                </p>
              )}
              {event.timestamp && (
                <p className="mt-1 text-xs text-slate-400">
                  {formatTimestamp(event.timestamp)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
