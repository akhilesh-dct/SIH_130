/**
 * EligibilityCriteria — Detailed eligibility criteria breakdown
 *
 * Renders eligibility assessment results grouped by status.
 * Each criterion shows: requirement, business value, result, explanation, action.
 */

import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { EligibilityAssessment, EligibilityCriterionResult } from '@/types/scheme.types';
import { cn } from '@/lib/utils';

interface EligibilityCriteriaProps {
  assessment: EligibilityAssessment;
  showAll?: boolean; // false = show only non-matched
}

function CriterionRow({ result }: { result: EligibilityCriterionResult }) {
  const isMatched = result.status === 'matched';
  const isMissing = result.status === 'missing_info';
  const isNotMet = result.status === 'not_met';

  return (
    <div
      className={cn(
        'rounded-md border px-4 py-3',
        isMatched && 'border-emerald-200 bg-emerald-50/50',
        isMissing && 'border-blue-200 bg-blue-50/50',
        isNotMet && 'border-red-200 bg-red-50/50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className="shrink-0 mt-0.5">
          {isMatched && <CheckCircle2 className="size-4 text-emerald-600" aria-label="Matched" />}
          {isMissing && <AlertCircle className="size-4 text-blue-600" aria-label="Information required" />}
          {isNotMet && <XCircle className="size-4 text-red-600" aria-label="Not met" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <p
              className={cn(
                'text-sm font-semibold leading-snug',
                isMatched && 'text-emerald-900',
                isMissing && 'text-blue-900',
                isNotMet && 'text-red-900'
              )}
            >
              {result.rule.label}
              {!result.rule.isMandatory && (
                <span className="ml-2 text-xs font-normal text-slate-500">(Optional)</span>
              )}
            </p>
            <span
              className={cn(
                'shrink-0 text-xs font-semibold',
                isMatched && 'text-emerald-700',
                isMissing && 'text-blue-700',
                isNotMet && 'text-red-700'
              )}
            >
              {isMatched ? 'Matched' : isMissing ? 'Info Required' : 'Not Met'}
            </span>
          </div>

          {/* Requirement vs business value */}
          <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Required</span>
              <p className="font-medium text-slate-800 mt-0.5">{result.rule.requiredValueLabel}</p>
            </div>
            <div>
              <span className="text-slate-500">Your business</span>
              <p className="font-medium text-slate-800 mt-0.5">
                {result.businessValue === null ? (
                  <span className="text-slate-400 italic">Not provided</span>
                ) : result.businessValue === true ? (
                  'Yes'
                ) : result.businessValue === false ? (
                  'No'
                ) : (
                  String(result.businessValue)
                )}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {result.explanation}
          </p>

          {/* Action */}
          {result.actionLabel && result.actionHref && (
            <Link
              to={result.actionHref}
              className="mt-2 inline-flex text-xs font-semibold text-blue-600 hover:underline underline-offset-2"
            >
              {result.actionLabel} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EligibilityCriteria({ assessment, showAll = true }: EligibilityCriteriaProps) {
  const matched = assessment.results.filter(r => r.status === 'matched');
  const needsInfo = assessment.results.filter(r => r.status === 'missing_info');
  const notMet = assessment.results.filter(r => r.status === 'not_met');

  return (
    <div className="space-y-6">
      {/* Not Met */}
      {notMet.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <XCircle className="size-4 text-red-500" aria-hidden="true" />
            Criteria Not Met
            <span className="ml-auto text-xs font-medium text-red-600">{notMet.length}</span>
          </h3>
          <div className="space-y-2">
            {notMet.map(r => <CriterionRow key={r.rule.id} result={r} />)}
          </div>
        </section>
      )}

      {/* Needs Info */}
      {needsInfo.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-blue-500" aria-hidden="true" />
            Information Required
            <span className="ml-auto text-xs font-medium text-blue-600">{needsInfo.length}</span>
          </h3>
          <div className="space-y-2">
            {needsInfo.map(r => <CriterionRow key={r.rule.id} result={r} />)}
          </div>
        </section>
      )}

      {/* Matched */}
      {showAll && matched.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
            Criteria Matched
            <span className="ml-auto text-xs font-medium text-emerald-600">{matched.length}</span>
          </h3>
          <div className="space-y-2">
            {matched.map(r => <CriterionRow key={r.rule.id} result={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
