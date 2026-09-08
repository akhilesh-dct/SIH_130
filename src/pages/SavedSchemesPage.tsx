/**
 * SavedSchemesPage — Task 7
 *
 * Dedicated view for bookmarked/saved schemes.
 */

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Bookmark, Building2, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSchemeStore } from '@/store/schemeStore';
import { SCHEME_APPLICATION_STATUS_LABELS } from '@/data/schemes';

export function SavedSchemesPage() {
  const { savedSchemes, isLoading, fetchSaved, unsaveScheme } = useSchemeStore();

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const sortedSchemes = useMemo(() => {
    return [...savedSchemes].sort((a, b) => 
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }, [savedSchemes]);

  return (
    <AppLayout
      pageTitle="Saved Schemes"
      pageDescription="Manage the government schemes you've bookmarked for later."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Schemes', href: '/schemes' },
        { label: 'Saved' },
      ]}
    >
      <div className="mb-6">
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft className="size-3" />
          Back to all schemes
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white rounded-lg border border-slate-200"></div>
          <div className="h-32 bg-white rounded-lg border border-slate-200"></div>
        </div>
      ) : sortedSchemes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
          <Bookmark className="mx-auto size-8 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900">No saved schemes</h3>
          <p className="mt-1 text-sm text-slate-500">
            You haven't bookmarked any schemes yet. Explore the schemes directory to find relevant opportunities.
          </p>
          <div className="mt-6">
            <Link
              to="/schemes"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Explore Schemes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSchemes.map(({ scheme }) => (
            <article key={scheme.id} className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    <Link to={`/schemes/${scheme.id}`} className="hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                      {scheme.name}
                    </Link>
                  </h3>
                  <button
                    onClick={() => unsaveScheme(scheme.id)}
                    className="shrink-0 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Remove from saved"
                  >
                    <Bookmark className="size-4 fill-current" />
                  </button>
                </div>
                
                <p className="flex items-center text-xs text-slate-500 mb-4">
                  <Building2 className="mr-1 size-3 text-slate-400 shrink-0" />
                  <span className="truncate">{scheme.department}</span>
                </p>
                
                <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                  {scheme.benefitSummary}
                </p>
              </div>
              
              <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between mt-auto">
                <div>
                   <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Status</span>
                   <span className="text-xs font-semibold text-slate-700">
                     {SCHEME_APPLICATION_STATUS_LABELS[scheme.status] || scheme.status}
                   </span>
                </div>
                
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Details
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
