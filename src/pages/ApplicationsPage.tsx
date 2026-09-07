/**
 * ApplicationsPage
 *
 * Lists all applications with status, progress, and quick links to detail views.
 * Route: /applications
 */

import { useEffect } from 'react';

import { FolderOpen } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ApplicationStatusCard } from '@/components/dashboard/ApplicationStatusCard';

export function ApplicationsPage() {
  const { applications, isLoading, fetchAll } = useDashboardStore();

  useEffect(() => {
    if (applications.length === 0) fetchAll();
  }, [applications.length, fetchAll]);

  const active = applications.filter(
    (a) => a.status !== 'approved' && a.status !== 'rejected' && a.status !== 'withdrawn'
  );
  const completed = applications.filter(
    (a) => a.status === 'approved' || a.status === 'rejected' || a.status === 'withdrawn'
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Applications' },
      ]}
      pageTitle="Applications"
      pageDescription="All industrial approval and compliance applications."
    >
      {isLoading ? (
        <div className="space-y-3 animate-pulse" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border border-slate-200 bg-white" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <FolderOpen className="size-6 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-600">No applications yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Applications you submit will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <section aria-label="Active applications">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Active
                <span className="ml-2 text-slate-400 font-normal">({active.length})</span>
              </h2>
              <div className="space-y-3">
                {active.map((app) => (
                  <ApplicationStatusCard key={app.id} application={app} />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section aria-label="Completed applications">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Completed
                <span className="ml-2 text-slate-400 font-normal">({completed.length})</span>
              </h2>
              <div className="space-y-3">
                {completed.map((app) => (
                  <ApplicationStatusCard key={app.id} application={app} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AppLayout>
  );
}
