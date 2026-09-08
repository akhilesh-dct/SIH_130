/**
 * ApplicationDetailPage
 *
 * Detailed view of a single application.
 * Shows: full metadata, status, progress, complete timeline, and next actions.
 * Route: /applications/:applicationId
 */

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Building2, Hash, Clock, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ApplicationTimeline } from '@/components/dashboard/ApplicationTimeline';
import { ActionRequiredCard } from '@/components/dashboard/ActionRequiredCard';
import { VerificationStatus as StatusBadge } from '@/components/documents/VerificationStatus';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { useDocumentStore } from '@/store/documentStore';
import { cn } from '@/lib/utils';

// Map application status to document status for badge reuse
import type { ApplicationStatus } from '@/types/dashboard.types';
import type { DocumentStatus } from '@/types/document.types';

const statusMap: Partial<Record<ApplicationStatus, DocumentStatus>> = {
  approved: 'verified',
  query_raised: 'needs_attention',
  documents_required: 'needs_attention',
  rejected: 'rejected',
  under_review: 'uploaded',
  submitted: 'uploaded',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function daysUntil(iso: string): { label: string; isUrgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return { label: `${Math.abs(days)} days overdue`, isUrgent: true };
  if (days === 0) return { label: 'SLA expires today', isUrgent: true };
  if (days <= 7) return { label: `${days} days remaining`, isUrgent: true };
  return { label: `${days} days remaining`, isUrgent: false };
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={cn('text-sm font-medium text-slate-800', valueClass)}>{value}</p>
      </div>
    </div>
  );
}

export function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { selectedApplication, actions, fetchApplication, clearSelectedApplication } =
    useDashboardStore();
  const { documents, isLoading: docsLoading, fetchDocuments } = useDocumentStore();

  useEffect(() => {
    if (applicationId) {
      fetchApplication(applicationId);
      fetchDocuments(applicationId);
    }
    return () => clearSelectedApplication();
  }, [applicationId, fetchApplication, fetchDocuments, clearSelectedApplication]);

  const app = selectedApplication;
  const relatedActions = actions.filter((a) => a.applicationId === applicationId);
  const docStatus = app ? (statusMap[app.status] ?? 'uploaded') : 'uploaded';

  if (!app) {
    return (
      <AppLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Applications', href: '/applications' },
          { label: 'Loading…' },
        ]}
      >
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-500">Loading application…</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const sla = app.slaDeadline ? daysUntil(app.slaDeadline) : null;

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Applications', href: '/applications' },
        { label: app.name },
      ]}
    >
      {/* Back link */}
      <Link
        to="/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: details + actions ── */}
        <div className="xl:col-span-2 space-y-6">
          {/* Application header card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{app.name}</h1>
                <p className="mt-0.5 text-sm text-slate-500">{app.department}</p>
              </div>
              <StatusBadge status={docStatus} size="md" />
            </div>

            {/* Progress */}
            {app.status !== 'draft' && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">Application progress</span>
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    {app.progress}%
                  </span>
                </div>
                <div
                  className="h-2 w-full rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={app.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      app.status === 'approved' ? 'bg-green-500' : 'bg-blue-600'
                    )}
                    style={{ width: `${app.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Detail rows */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <DetailRow icon={Hash} label="Reference no." value={app.referenceNo} />
              <DetailRow icon={Building2} label="Department" value={app.department} />
              {app.submittedAt && (
                <DetailRow
                  icon={Calendar}
                  label="Submitted"
                  value={formatDate(app.submittedAt)}
                />
              )}
              {app.estimatedDays && (
                <DetailRow
                  icon={Clock}
                  label="Estimated processing"
                  value={`${app.estimatedDays} working days`}
                />
              )}
              {sla && (
                <DetailRow
                  icon={AlertTriangle}
                  label="SLA deadline"
                  value={sla.label}
                  valueClass={sla.isUrgent ? 'text-red-700' : undefined}
                />
              )}
              {app.status === 'approved' && (
                <DetailRow
                  icon={CheckCircle2}
                  label="Outcome"
                  value="Approved"
                  valueClass="text-green-700"
                />
              )}
            </div>
          </div>

          {/* Actions required */}
          {relatedActions.length > 0 && (
            <section aria-label="Actions required for this application">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Actions required</h2>
              <div className="space-y-3">
                {relatedActions.map((action) => (
                  <ActionRequiredCard key={action.id} action={action} />
                ))}
              </div>
            </section>
          )}

          {/* Required Documents Table */}
          <section aria-label="Required documents for this application" className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Required Documents</h2>
              <Link to="/documents" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View all in workspace &rarr;
              </Link>
            </div>
            <DocumentTable
              documents={documents}
              selectedId={null}
              isLoading={docsLoading}
              onSelect={(id) => {
                // Navigate to documents workspace with this doc selected
                window.location.href = `/documents?docId=${id}`;
              }}
              onDownload={() => {}}
            />
          </section>

          {/* Approved message */}
          {app.status === 'approved' && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-5 text-green-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Application approved</p>
                  <p className="mt-0.5 text-xs text-green-700">
                    This approval has been granted. Please download the certificate from the
                    department portal or await postal delivery.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Timeline ── */}
        <div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-5">Application timeline</h2>
            <ApplicationTimeline events={app.timeline} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
