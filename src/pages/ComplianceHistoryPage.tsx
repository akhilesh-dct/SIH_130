import { useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComplianceStore } from '@/store/complianceStore';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { ComplianceStatusBadge } from '@/components/compliance/ComplianceStatusBadge';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';

export function ComplianceHistoryPage() {
  const { user } = useAuthStore();
  const { obligations, isLoading, fetchObligations } = useComplianceStore();

  useEffect(() => {
    if (user?.id) {
      fetchObligations(user.id);
    }
  }, [user?.id, fetchObligations]);

  // For the history view, we typically want completed ones, or those with past events.
  // We mock this by showing COMPLIANT, SUBMITTED, and REJECTED items.
  const historyItems = useMemo(() => {
    return obligations
      .filter(o => ['COMPLIANT', 'SUBMITTED', 'REJECTED'].includes(o.status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [obligations]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Compliance', href: '/compliance' },
        { label: 'History' }
      ]}
      pageTitle="Compliance History"
      pageDescription="View a record of all submitted and completed compliance obligations."
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Obligation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cycle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {historyItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                      No compliance history found.
                    </td>
                  </tr>
                ) : (
                  historyItems.map((ob) => (
                    <tr key={ob.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{ob.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{ob.authorityName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{format(new Date(ob.dueDate), 'yyyy')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {format(new Date(ob.updatedAt), 'dd MMM yyyy')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ComplianceStatusBadge status={ob.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/compliance/${ob.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          View
                          <ChevronRight className="ml-1 size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
