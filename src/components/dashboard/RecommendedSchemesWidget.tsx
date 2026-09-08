/**
 * RecommendedSchemesWidget — Task 7
 *
 * Dashboard widget showing top recommended schemes.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ChevronRight } from 'lucide-react';
import { useSchemeStore } from '@/store/schemeStore';

export function RecommendedSchemesWidget() {
  const { recommendations, isLoading, fetchRecommendations, fetchBusinessProfile } = useSchemeStore();

  useEffect(() => {
    fetchBusinessProfile().then(() => fetchRecommendations());
  }, [fetchRecommendations, fetchBusinessProfile]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden" aria-label="Recommended Schemes">
      <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Gift className="size-4 text-blue-500" />
          Recommended Schemes
        </h2>
        <Link 
          to="/schemes" 
          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2"
        >
          View all
        </Link>
      </div>
      
      <div className="p-0">
        {isLoading ? (
          <div className="p-5 space-y-4 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-md"></div>
            <div className="h-16 bg-slate-100 rounded-md"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500 mb-3">Complete your profile to get personalized recommendations.</p>
            <Link 
              to="/schemes" 
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Explore all schemes <ChevronRight className="size-3 ml-0.5" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recommendations.slice(0, 3).map((rec) => (
              <li key={rec.scheme.id}>
                <Link 
                  to={`/schemes/${rec.scheme.id}`}
                  className="block p-4 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:bg-slate-50"
                >
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{rec.scheme.name}</p>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">{rec.scheme.benefitSummary}</p>
                  
                  {rec.matchReasons.length > 0 && (
                     <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">
                        <span className="shrink-0 text-emerald-500">✓</span>
                        <span className="truncate">{rec.matchReasons[0]}</span>
                     </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
