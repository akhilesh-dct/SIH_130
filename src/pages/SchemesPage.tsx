/**
 * SchemesPage — Task 7
 *
 * Overview dashboard for Schemes & Incentives.
 * Sections: Recommended Schemes, All Schemes table, and Profile Completion prompt.
 */

import { useEffect, useMemo, useState } from 'react';
import { Search, AlertCircle, Building2, Gift, Building } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SchemeCard } from '@/components/schemes/SchemeCard';
import { useSchemeStore } from '@/store/schemeStore';
import { getMissingProfileFields } from '@/data/businessProfile';
import { SCHEME_CATEGORY_LABELS, SCHEME_APPLICATION_STATUS_LABELS } from '@/data/schemes';
import { Link } from 'react-router-dom';

export function SchemesPage() {
  const {
    schemes,
    recommendations,
    savedSchemeIds,
    businessProfile,
    isLoading,
    fetchSchemes,
    fetchRecommendations,
    fetchBusinessProfile,
    saveScheme,
    unsaveScheme,
  } = useSchemeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchBusinessProfile();
    fetchSchemes();
    fetchRecommendations();
  }, [fetchBusinessProfile, fetchSchemes, fetchRecommendations]);

  const missingFields = useMemo(() => {
    if (!businessProfile) return [];
    return getMissingProfileFields(businessProfile);
  }, [businessProfile]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            scheme.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || scheme.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || scheme.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [schemes, searchQuery, filterCategory, filterStatus]);

  const categories = useMemo(() => Array.from(new Set(schemes.map(s => s.category))), [schemes]);
  const statuses = useMemo(() => Array.from(new Set(schemes.map(s => s.status))), [schemes]);

  return (
    <AppLayout
      pageTitle="Schemes & Incentives"
      pageDescription="Discover government schemes and incentives relevant to your business."
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Schemes' }]}
      actions={
        <Link
          to="/schemes/saved"
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          <Gift className="size-4" />
          Saved Schemes
          {savedSchemeIds.size > 0 && (
            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
              {savedSchemeIds.size}
            </span>
          )}
        </Link>
      }
    >
      <div className="space-y-8">
        
        {/* Profile completion prompt */}
        {missingFields.length > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  Complete your business profile to improve scheme recommendations
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  We need {missingFields.join(', ')} to accurately assess your eligibility for various schemes.
                </p>
                <Link
                  to="/business"
                  className="mt-3 inline-block text-sm font-medium text-blue-800 hover:underline underline-offset-2"
                >
                  Update Business Profile →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Schemes */}
        <section aria-labelledby="recommended-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="recommended-heading" className="text-lg font-semibold text-slate-900">
              Recommended for Your Business
            </h2>
            {isLoading && <span className="text-xs text-slate-500">Loading...</span>}
          </div>
          
          {recommendations.length === 0 && !isLoading ? (
             <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <Building className="mx-auto size-8 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-700">No highly relevant schemes found</p>
              <p className="mt-1 text-xs text-slate-500">
                Update your business profile or explore all schemes below.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec) => (
                <SchemeCard
                  key={rec.scheme.id}
                  recommendation={rec}
                  isSaved={savedSchemeIds.has(rec.scheme.id)}
                  onSave={saveScheme}
                  onUnsave={unsaveScheme}
                />
              ))}
            </div>
          )}
        </section>

        {/* All Schemes */}
        <section aria-labelledby="all-heading" className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="sm:flex sm:items-center sm:justify-between">
              <h2 id="all-heading" className="text-lg font-semibold text-slate-900">
                All Schemes
              </h2>
            </div>
            
            {/* Filters & Search */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search schemes, departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border-0 py-2 pl-9 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-md border-0 py-2 pl-3 pr-8 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{SCHEME_CATEGORY_LABELS[c] || c}</option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-md border-0 py-2 pl-3 pr-8 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map(s => (
                    <option key={s} value={s}>{SCHEME_APPLICATION_STATUS_LABELS[s] || s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Scheme</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredSchemes.map((scheme) => (
                  <tr key={scheme.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 min-w-[300px] whitespace-normal">
                      <p className="font-semibold text-slate-900 leading-snug">{scheme.name}</p>
                      <p className="mt-0.5 flex items-center text-xs text-slate-500">
                        <Building2 className="mr-1 size-3 text-slate-400 shrink-0" />
                        {scheme.department}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                       <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {SCHEME_CATEGORY_LABELS[scheme.category] || scheme.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-xs text-slate-600">{SCHEME_APPLICATION_STATUS_LABELS[scheme.status] || scheme.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/schemes/${scheme.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {filteredSchemes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                      No schemes match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
