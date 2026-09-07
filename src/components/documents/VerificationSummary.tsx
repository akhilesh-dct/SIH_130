/**
 * VerificationSummary component
 *
 * Shows aggregate counts of document verification states.
 * Displayed in the page header area of the Documents workspace.
 */

import type { VerificationSummary as Summary } from '@/types/document.types';
import { cn } from '@/lib/utils';

interface SummaryItemProps {
  label: string;
  value: number;
  highlight?: 'green' | 'amber' | 'red' | 'blue' | 'default';
}

function SummaryItem({ label, value, highlight = 'default' }: SummaryItemProps) {
  const valueClass = {
    green: 'text-green-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    default: 'text-slate-800',
  }[highlight];

  return (
    <div className="flex flex-col items-center px-4 py-3 sm:border-r sm:border-slate-200 last:border-r-0">
      <span className={cn('text-xl font-semibold tabular-nums leading-none', valueClass)}>
        {value}
      </span>
      <span className="mt-1 text-xs text-slate-500 text-center leading-tight">{label}</span>
    </div>
  );
}

interface VerificationSummaryProps {
  summary: Summary;
}

export function VerificationSummary({ summary }: VerificationSummaryProps) {
  return (
    <div
      className="flex flex-wrap justify-center sm:justify-start divide-y sm:divide-y-0 sm:divide-x divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"
      role="region"
      aria-label="Document verification summary"
    >
      <SummaryItem label="Required" value={summary.required} />
      <SummaryItem label="Uploaded" value={summary.uploaded} highlight="blue" />
      <SummaryItem label="Verified" value={summary.verified} highlight="green" />
      <SummaryItem label="Needs attention" value={summary.needsAttention} highlight="amber" />
      <SummaryItem label="Pending" value={summary.pending} />
      {summary.rejected > 0 && (
        <SummaryItem label="Rejected" value={summary.rejected} highlight="red" />
      )}
    </div>
  );
}
