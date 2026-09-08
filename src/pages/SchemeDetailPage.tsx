/**
 * SchemeDetailPage — Task 7
 *
 * Detailed information about a scheme.
 */

import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Building2, Bookmark, BookmarkCheck, Calendar, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EligibilityBadge } from '@/components/schemes/EligibilityBadge';
import { DocumentRequirementRow } from '@/components/schemes/DocumentRequirementRow';
import { useSchemeStore } from '@/store/schemeStore';
import { SCHEME_CATEGORY_LABELS, SCHEME_APPLICATION_STATUS_LABELS } from '@/data/schemes';

export function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const {
    selectedScheme: scheme,
    eligibilityAssessment,
    savedSchemeIds,
    isLoading,
    isLoadingEligibility,
    fetchScheme,
    fetchEligibility,
    fetchBusinessProfile,
    saveScheme,
    unsaveScheme,
  } = useSchemeStore();

  useEffect(() => {
    fetchBusinessProfile();
    if (id) {
      fetchScheme(id);
      fetchEligibility(id);
    }
  }, [id, fetchScheme, fetchEligibility, fetchBusinessProfile]);

  const isSaved = useMemo(() => scheme ? savedSchemeIds.has(scheme.id) : false, [scheme, savedSchemeIds]);

  if (isLoading) {
    return (
      <AppLayout pageTitle="Loading...">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white rounded-lg border border-slate-200"></div>
          <div className="h-64 bg-white rounded-lg border border-slate-200"></div>
        </div>
      </AppLayout>
    );
  }

  if (!scheme) {
    return (
      <AppLayout pageTitle="Scheme Not Found">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">The requested scheme could not be found.</p>
          <Link to="/schemes" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Schemes
          </Link>
        </div>
      </AppLayout>
    );
  }

  const deadline = scheme.applicationEndDate
    ? new Date(scheme.applicationEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Schemes', href: '/schemes' },
        { label: scheme.name },
      ]}
    >
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            to="/schemes"
            className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="size-3" />
            Back to schemes
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
             <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {SCHEME_CATEGORY_LABELS[scheme.category] || scheme.category}
            </span>
             <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {SCHEME_APPLICATION_STATUS_LABELS[scheme.status] || scheme.status}
            </span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {scheme.name}
          </h1>
          <p className="mt-2 flex items-center text-sm text-slate-600">
            <Building2 className="mr-1.5 size-4 shrink-0 text-slate-400" />
            {scheme.department}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => isSaved ? unsaveScheme(scheme.id) : saveScheme(scheme.id)}
            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isSaved ? (
              <><BookmarkCheck className="size-4 text-blue-600" /> Saved</>
            ) : (
              <><Bookmark className="size-4" /> Save</>
            )}
          </button>
          
          <Link
            to={`/schemes/${scheme.id}/eligibility`}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ShieldCheck className="size-4" />
            Check Eligibility
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content (Left) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {scheme.description}
            </p>
          </section>

          {/* Benefits */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Benefits</h2>
            <p className="text-sm font-medium text-slate-800 mb-2">
              {scheme.benefitSummary}
            </p>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap ml-4 border-l-2 border-slate-200 pl-4">
              {scheme.benefitDetails}
            </div>
          </section>

          {/* Who Can Apply */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Who Can Apply</h2>
            <ul className="space-y-2">
              {scheme.whoCanApply.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-1.5 size-1.5 rounded-full bg-slate-300 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Application Process */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Application Process</h2>
            <ol className="relative ml-3 border-l border-slate-200 space-y-4 pb-2">
              {scheme.applicationProcess.map((step, i) => (
                <li key={i} className="pl-6 relative">
                  <span className="absolute -left-[11px] top-0.5 flex size-5 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white text-[10px] font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>

        </div>

        {/* ── Sidebar (Right) ── */}
        <div className="space-y-6">
          
          {/* Eligibility Assessment Widget */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
               <h3 className="text-sm font-semibold text-slate-900">Your Eligibility</h3>
             </div>
             <div className="p-5">
               {isLoadingEligibility || !eligibilityAssessment ? (
                 <div className="animate-pulse space-y-2">
                   <div className="h-6 w-1/2 bg-slate-200 rounded"></div>
                   <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                 </div>
               ) : (
                 <>
                   <EligibilityBadge status={eligibilityAssessment.overallStatus} size="md" className="mb-3" />
                   <p className="text-sm text-slate-600 mb-4">
                     Based on your business profile, {eligibilityAssessment.matchedCount} of {eligibilityAssessment.totalCriteria} criteria match.
                   </p>
                   <Link
                    to={`/schemes/${scheme.id}/eligibility`}
                    className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    View Full Assessment
                    <ArrowRight className="size-4 text-slate-400" />
                  </Link>
                 </>
               )}
             </div>
          </section>

          {/* Required Documents Widget */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
               <h3 className="text-sm font-semibold text-slate-900">Required Documents</h3>
             </div>
             <div className="p-0">
               {scheme.documentRequirements.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-slate-100 px-5 block">
                        {scheme.documentRequirements.map(req => (
                          <DocumentRequirementRow key={req.id} requirement={req} />
                        ))}
                      </tbody>
                    </table>
                 </div>
               ) : (
                 <p className="p-5 text-sm text-slate-500">No specific documents listed.</p>
               )}
             </div>
          </section>

           {/* Important Dates */}
           <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
               <h3 className="text-sm font-semibold text-slate-900">Important Dates</h3>
             </div>
             <div className="p-5 space-y-4">
               {deadline && (
                 <div>
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Application Deadline</p>
                   <p className="flex items-center text-sm font-semibold text-slate-800">
                     <Calendar className="mr-2 size-4 text-slate-400" />
                     {deadline}
                   </p>
                 </div>
               )}
               <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Validity Info</p>
                  <p className="text-sm text-slate-700">{scheme.schemeValidityInfo}</p>
               </div>
             </div>
          </section>

          {/* Official Source */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Official Source</p>
              <p className="text-sm font-medium text-slate-900 mb-3">{scheme.officialSourceLabel}</p>
              {scheme.officialSourceUrl ? (
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Official Guidelines
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <p className="text-xs text-slate-500 italic">Official link not configured.</p>
              )}
            </div>
          </section>
          
        </div>
      </div>
    </AppLayout>
  );
}
