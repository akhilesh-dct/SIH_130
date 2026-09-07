/**
 * MetricCard component
 *
 * A compact KPI tile used in the dashboard overview row.
 * Shows: label, value, optional sub-label, optional trend indicator.
 * Deliberately simple — no unnecessary decoration.
 */

import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number | string;
  subLabel?: string;
  Icon?: ElementType;
  intent?: 'default' | 'warning' | 'success' | 'error';
  onClick?: () => void;
}

const intentStyles = {
  default: {
    icon: 'bg-slate-100 text-slate-500',
    value: 'text-slate-900',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-600',
    value: 'text-amber-700',
  },
  success: {
    icon: 'bg-green-50 text-green-600',
    value: 'text-green-700',
  },
  error: {
    icon: 'bg-red-50 text-red-600',
    value: 'text-red-700',
  },
};

export function MetricCard({
  label,
  value,
  subLabel,
  Icon,
  intent = 'default',
  onClick,
}: MetricCardProps) {
  const styles = intentStyles[intent];
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
        onClick &&
          'cursor-pointer hover:border-blue-200 hover:shadow-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-left'
      )}
    >
      {Icon && (
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-md',
            styles.icon
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </div>
      )}
      <div>
        <p className={cn('text-2xl font-semibold tabular-nums leading-none', styles.value)}>
          {value}
        </p>
        <p className="mt-1.5 text-xs font-medium text-slate-600">{label}</p>
        {subLabel && (
          <p className="mt-0.5 text-xs text-slate-400">{subLabel}</p>
        )}
      </div>
    </Wrapper>
  );
}
