/**
 * DocumentStatusWidget component
 *
 * Dashboard widget showing document verification summary and individual statuses.
 * Connected to the document verification module (Task 2) — clicking navigates to /documents.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Circle, ArrowRight } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { cn } from '@/lib/utils';

export function DocumentStatusWidget() {
  const { documents, fetchDocuments, isLoading } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const docs = documents.filter((d) => d.isRequired);
  const verified = docs.filter((d) => d.status === 'verified').length;
  const attention = docs.filter((d) => d.status === 'needs_attention').length;
  const total = docs.length;

  const progressPct = Math.round((verified / total) * 100);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Document Verification</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {verified} of {total} required documents verified
          </p>
        </div>
        <Link
          to="/documents"
          className={cn(
            'flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5',
            'text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
          )}
          aria-label="Manage documents"
        >
          Manage
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Verification progress</span>
          <span className="text-xs font-semibold text-slate-700 tabular-nums">{progressPct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Document list */}
      <div className="px-5 pb-5 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Required document statuses">
            {docs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-2.5">
            {doc.status === 'verified' ? (
              <CheckCircle2 className="size-4 shrink-0 text-green-600" aria-label="Verified" />
            ) : doc.status === 'needs_attention' || doc.status === 'rejected' ? (
              <AlertCircle className="size-4 shrink-0 text-amber-600" aria-label="Needs attention" />
            ) : (
              <Circle className="size-4 shrink-0 text-slate-300" aria-label="Not verified" />
            )}
            <span
              className={cn(
                'text-sm truncate',
                doc.status === 'verified'
                  ? 'text-slate-700'
                  : doc.status === 'needs_attention'
                  ? 'text-amber-700 font-medium'
                  : 'text-slate-400'
              )}
            >
              {doc.name}
            </span>
            {doc.status === 'needs_attention' && (
              <span className="ml-auto shrink-0 text-xs text-amber-600 font-medium">
                Action needed
              </span>
            )}
          </li>
        ))}
      </ul>
      )}
      </div>

      {attention > 0 && (
        <div className="border-t border-slate-100 px-5 py-3">
          <Link
            to="/documents"
            className="text-xs font-medium text-amber-700 hover:text-amber-900 hover:underline underline-offset-2"
          >
            {attention} document{attention > 1 ? 's' : ''} require{attention === 1 ? 's' : ''} your attention →
          </Link>
        </div>
      )}
    </div>
  );
}
