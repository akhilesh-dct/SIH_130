import { useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComplianceStore } from '@/store/complianceStore';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { ComplianceStatusBadge } from '@/components/compliance/ComplianceStatusBadge';
import { format, parseISO } from 'date-fns';

export function ComplianceCalendarPage() {
  const { user } = useAuthStore();
  const { obligations, isLoading, fetchObligations } = useComplianceStore();

  useEffect(() => {
    if (user?.id) {
      fetchObligations(user.id);
    }
  }, [user?.id, fetchObligations]);

  const sortedObligations = useMemo(() => {
    return [...obligations].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [obligations]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof obligations> = {};
    sortedObligations.forEach(ob => {
      const date = parseISO(ob.dueDate);
      const monthKey = format(date, 'MMMM yyyy');
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(ob);
    });
    return groups;
  }, [sortedObligations]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Compliance', href: '/compliance' },
        { label: 'Calendar' }
      ]}
      pageTitle="Compliance Calendar"
      pageDescription="Upcoming and past deadlines organized by month."
    >
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-4xl space-y-8">
          {Object.entries(groupedByMonth).map(([month, obs]) => (
            <div key={month} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-800">{month}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {obs.map((ob) => (
                  <Link 
                    key={ob.id} 
                    to={`/compliance/${ob.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-4 mb-3 sm:mb-0">
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 shrink-0 text-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase">{format(parseISO(ob.dueDate), 'MMM')}</span>
                        <span className="text-lg font-bold text-slate-800 leading-none mt-0.5">{format(parseISO(ob.dueDate), 'dd')}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{ob.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{ob.authorityName} • {ob.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:pl-4">
                      <ComplianceStatusBadge status={ob.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedByMonth).length === 0 && (
            <div className="text-center py-12 text-slate-500 border rounded-xl border-dashed">
              No compliance dates found.
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
