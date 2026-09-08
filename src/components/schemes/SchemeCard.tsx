/**
 * SchemeCard — Compact professional scheme card
 *
 * Used in the Recommended section and the All Schemes grid view.
 * Information-dense, no decorative elements, no fake AI scores.
 */

import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Building2, Calendar, ChevronRight } from 'lucide-react';
import { EligibilityBadge } from './EligibilityBadge';
import type { SchemeRecommendation } from '@/types/scheme.types';
import { SCHEME_CATEGORY_LABELS, SCHEME_APPLICATION_STATUS_LABELS } from '@/data/schemes';
import { cn } from '@/lib/utils';

interface SchemeCardProps {
  recommendation: SchemeRecommendation;
  isSaved: boolean;
  onSave: (id: string) => void;
  onUnsave: (id: string) => void;
  showReasons?: boolean;
}

const APP_STATUS_STYLE: Record<string, string> = {
  open: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  closing_soon: 'text-amber-700 bg-amber-50 border-amber-200',
  closed: 'text-slate-500 bg-slate-100 border-slate-200',
  upcoming: 'text-blue-700 bg-blue-50 border-blue-200',
  ongoing: 'text-slate-600 bg-slate-50 border-slate-200',
};

export function SchemeCard({
  recommendation,
  isSaved,
  onSave,
  onUnsave,
  showReasons = true,
}: SchemeCardProps) {
  const { scheme, eligibilityStatus, matchReasons, matchedCriteriaCount, totalCriteriaCount, missingRequirements } = recommendation;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) onUnsave(scheme.id);
    else onSave(scheme.id);
  };

  const deadline = scheme.applicationEndDate
    ? new Date(scheme.applicationEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <article className="relative flex flex-col rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md hover:border-slate-300">
      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  APP_STATUS_STYLE[scheme.status] || APP_STATUS_STYLE.open
                )}
              >
                {SCHEME_APPLICATION_STATUS_LABELS[scheme.status] || scheme.status}
              </span>
              <span className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                {SCHEME_CATEGORY_LABELS[scheme.category] || scheme.category}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 leading-snug">
              <Link
                to={`/schemes/${scheme.id}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded hover:text-blue-700 transition-colors"
              >
                {scheme.name}
              </Link>
            </h3>
            <p className="mt-1 flex items-center text-xs text-slate-500">
              <Building2 className="mr-1 size-3 text-slate-400 shrink-0" />
              <span className="truncate">{scheme.department}</span>
            </p>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSaveToggle}
            aria-label={isSaved ? `Remove ${scheme.name} from saved` : `Save ${scheme.name}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isSaved ? (
              <BookmarkCheck className="size-4 text-blue-600" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </button>
        </div>

        {/* Benefit summary */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
          <span className="font-medium text-slate-700">Benefit: </span>
          {scheme.benefitSummary}
        </p>

        {/* Why recommended */}
        {showReasons && matchReasons.length > 0 && (
          <div className="mt-3 space-y-1">
            {matchReasons.slice(0, 2).map((reason, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <span className="mt-0.5 text-emerald-500 shrink-0 font-semibold">✓</span>
                {reason}
              </p>
            ))}
          </div>
        )}

        {/* Missing requirements */}
        {missingRequirements.length > 0 && (
          <div className="mt-2">
            {missingRequirements.slice(0, 1).map((req, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <span className="mt-0.5 text-amber-500 shrink-0 font-semibold">⚠</span>
                {req}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <EligibilityBadge status={eligibilityStatus} />
          {totalCriteriaCount > 0 && (
            <span className="text-xs text-slate-500">
              {matchedCriteriaCount}/{totalCriteriaCount} criteria
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {deadline && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="size-3" />
              {deadline}
            </span>
          )}
          <Link
            to={`/schemes/${scheme.id}`}
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            View details <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
