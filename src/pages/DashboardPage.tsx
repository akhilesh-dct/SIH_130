/**
 * DashboardPage — Task 3
 *
 * Central workspace after login.
 * Sections: greeting header, metric overview, action required, application status,
 * document status widget, approval progress, recent activity.
 *
 * All data comes from useDashboardStore — no hardcoded values in JSX.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, FileText, CheckSquare, AlertCircle, Building2} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ApplicationStatusCard } from '@/components/dashboard/ApplicationStatusCard';
import { ActionRequiredCard } from '@/components/dashboard/ActionRequiredCard';
import { DocumentStatusWidget } from '@/components/dashboard/DocumentStatusWidget';
import { ApprovalProgress } from '@/components/dashboard/ApprovalProgress';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

// ---------------------------------------------------------------------------
// Greeting helper
// ---------------------------------------------------------------------------

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// Loading skeleton for metric row
// ---------------------------------------------------------------------------

function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 h-24" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const { user } = useAuthStore();
  const {
    stats, applications, actions, approvals, activity,
    isLoading, error, fetchAll,
  } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const firstName = user?.name?.split(' ')[0] ?? '';

  // Highest-priority applications first (actionable ones at top)
  const sortedApps = [...applications].sort((a, b) => {
    const aScore = a.status === 'query_raised' || a.status === 'documents_required' ? 1 : 0;
    const bScore = b.status === 'query_raised' || b.status === 'documents_required' ? 1 : 0;
    return bScore - aScore;
  });

  return (
    <AppLayout>
      {/* ── Greeting header ── */}
    {/* ── Greeting header ── */}
<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
      {greeting()}{firstName ? `, ${firstName}` : ''}
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      {user?.organizationName} &nbsp;·&nbsp;
      Here's the current status of your applications and compliance requirements.
    </p>
  </div>

  <Link
    to="/applications/new"
    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
  >
    <Building2 size={17} />
    Create New Business
  </Link>
</div>


      {/* ── Error state ── */}
      {error && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4"
          role="alert"
        >
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={fetchAll}
            className="mt-1 text-xs font-medium text-red-600 underline underline-offset-2 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Metric overview ── */}
      {isLoading || !stats ? (
        <MetricSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Applications"
            value={stats.applications.total}
            subLabel={`${stats.applications.inProgress} in progress`}
            Icon={FolderOpen}
          />
          <MetricCard
            label="Action required"
            value={stats.applications.actionRequired}
            subLabel="Need your response"
            Icon={AlertCircle}
            intent={stats.applications.actionRequired > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            label="Documents verified"
            value={`${stats.documents.verified}/${stats.documents.required}`}
            subLabel={stats.documents.needsAttention > 0 ? `${stats.documents.needsAttention} need attention` : 'All checked'}
            Icon={FileText}
            intent={stats.documents.needsAttention > 0 ? 'warning' : 'success'}
          />
          <MetricCard
            label="Approvals completed"
            value={`${stats.approvals.completed}/${stats.approvals.required}`}
            subLabel={`${stats.approvals.pending} pending`}
            Icon={CheckSquare}
          />
        </div>
      )}

      {/* ── Action required ── */}
      {!isLoading && actions.length > 0 && (
        <section className="mb-8" aria-label="Actions required">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Action required
            <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {actions.length}
            </span>
          </h2>
          <div className="space-y-3">
            {actions.map((action) => (
              <ActionRequiredCard key={action.id} action={action} />
            ))}
          </div>
        </section>
      )}

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column — Application status + Activity */}
        <div className="xl:col-span-2 space-y-6">
          {/* Application status */}
          <section aria-label="Application status">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Application status</h2>
              <a
                href="/applications"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline underline-offset-2"
              >
                View all
              </a>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-lg border border-slate-200 bg-white" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedApps.map((app) => (
                  <ApplicationStatusCard key={app.id} application={app} />
                ))}
              </div>
            )}
          </section>

          {/* Recent activity */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden" aria-label="Recent activity">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            </div>
            <RecentActivity activities={activity} isLoading={isLoading} />
          </section>
        </div>

        {/* Right column — Documents + Approvals */}
        <div className="space-y-6">
          <DocumentStatusWidget />
          {!isLoading && approvals.length > 0 && (
            <ApprovalProgress approvals={approvals} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
