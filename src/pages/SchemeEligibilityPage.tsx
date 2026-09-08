/**
 * SchemeEligibilityPage — Task 7
 *
 * Full page detailed assessment of business eligibility for a specific scheme.
 */

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Info, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EligibilityCriteria } from '@/components/schemes/EligibilityCriteria';
import { EligibilityBadge } from '@/components/schemes/EligibilityBadge';
import { useSchemeStore } from '@/store/schemeStore';

export function SchemeEligibilityPage() {
  const { id } = useParams<{ id: string }>();
  
  const {
    selectedScheme: scheme,
    eligibilityAssessment,
    isLoading,
    isLoadingEligibility,
    fetchScheme,
    fetchEligibility,
    fetchBusinessProfile,
  } = useSchemeStore();

  useEffect(() => {
    fetchBusinessProfile();
    if (id) {
      fetchScheme(id);
      fetchEligibility(id);
    }
  }, [id, fetchScheme, fetchEligibility, fetchBusinessProfile]);

  if (isLoading || isLoadingEligibility) {
    return (
      <AppLayout pageTitle="Loading Assessment...">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white rounded-lg border border-slate-200"></div>
          <div className="h-64 bg-white rounded-lg border border-slate-200"></div>
        </div>
      </AppLayout>
    );
  }

  if (!scheme || !eligibilityAssessment) {
    return (
      <AppLayout pageTitle="Assessment Not Found">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">The eligibility assessment could not be loaded.</p>
          <Link to={id ? `/schemes/${id}` : '/schemes'} className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Schemes', href: '/schemes' },
        { label: scheme.name, href: `/schemes/${scheme.id}` },
        { label: 'Eligibility' },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to={`/schemes/${scheme.id}`}
            className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft className="size-3" />
            Back to scheme details
          </Link>
          
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Eligibility Assessment
          </h1>
          <p className="text-sm text-slate-600">
             For <span className="font-semibold text-slate-800">{scheme.name}</span>
          </p>
        </div>

        {/* Overall Status Card */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mb-6">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
               <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Overall Result</p>
               <EligibilityBadge status={eligibilityAssessment.overallStatus} size="md" />
             </div>
             
             <div className="flex gap-4 sm:border-l sm:border-slate-200 sm:pl-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{eligibilityAssessment.matchedCount}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Matched</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{eligibilityAssessment.notMetCount}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Not Met</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{eligibilityAssessment.missingInfoCount}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Missing Info</p>
                </div>
             </div>
           </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-8 flex gap-3">
          <Info className="size-5 text-slate-400 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            {eligibilityAssessment.disclaimer}
          </p>
        </div>

        {/* Missing Info Prompt */}
        {eligibilityAssessment.missingInfoCount > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 mb-8 flex gap-3">
            <AlertCircle className="size-5 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Incomplete Profile
              </h3>
              <p className="mt-1 text-sm text-blue-700 leading-relaxed">
                Some requirements cannot be verified because your business profile is missing information. Please update your profile to get a complete assessment.
              </p>
              <Link
                to="/business"
                className="mt-3 inline-block text-sm font-medium text-blue-800 hover:underline underline-offset-2"
              >
                Update Business Profile →
              </Link>
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Detailed Breakdown</h2>
          <EligibilityCriteria assessment={eligibilityAssessment} showAll={true} />
        </div>

      </div>
    </AppLayout>
  );
}
