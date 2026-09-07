/**
 * VerificationIssue component
 *
 * Renders a structured issue card for documents in 'needs_attention' or 'rejected' state.
 * Shows severity, code, title, description, and suggested action.
 */

import { AlertTriangle, XCircle } from 'lucide-react';
import type { VerificationIssue as Issue } from '@/types/document.types';
import { cn } from '@/lib/utils';

interface VerificationIssueProps {
  issue: Issue;
}

export function VerificationIssue({ issue }: VerificationIssueProps) {
  const isError = issue.severity === 'error';

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4 space-y-2',
        isError
          ? 'border-red-200 bg-red-50'
          : 'border-amber-200 bg-amber-50'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5">
        {isError ? (
          <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
        ) : (
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        )}
        <div>
          <p className={cn('text-sm font-semibold', isError ? 'text-red-800' : 'text-amber-800')}>
            {issue.title}
          </p>
          <p className={cn('text-xs mt-0.5', isError ? 'text-red-600' : 'text-amber-700')}>
            Code: {issue.code}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className={cn('text-sm leading-relaxed', isError ? 'text-red-700' : 'text-amber-700')}>
        {issue.description}
      </p>

      {/* Suggested action */}
      {issue.suggestedAction && (
        <div
          className={cn(
            'mt-2 rounded-md border px-3 py-2 text-xs leading-relaxed',
            isError
              ? 'border-red-200 bg-white text-red-700'
              : 'border-amber-200 bg-white text-amber-700'
          )}
        >
          <span className="font-semibold">Suggested action: </span>
          {issue.suggestedAction}
        </div>
      )}
    </div>
  );
}
