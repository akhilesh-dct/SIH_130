import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Building2, Hash, Clock, AlertTriangle, CheckCircle2,
  AlertCircle, ShieldAlert, CheckSquare, FileText, Send
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ApplicationTimeline } from '@/components/dashboard/ApplicationTimeline';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { VerificationStatus as StatusBadge } from '@/components/documents/VerificationStatus';
import { useDocumentStore } from '@/store/documentStore';
import { governmentService } from '@/services/government.service';
import type { GovernmentApplication, GovernmentApplicationStatus } from '@/types/government.types';
import type { DocumentStatus } from '@/types/document.types';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const statusMap: Partial<Record<GovernmentApplicationStatus, DocumentStatus>> = {
  approved: 'verified',
  query_raised: 'needs_attention',
  documents_required: 'needs_attention',
  rejected: 'rejected',
  under_review: 'uploaded',
  submitted: 'uploaded',
  inspection_scheduled: 'uploaded'
};

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

export function GovernmentApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<GovernmentApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const { documents, isLoading: docsLoading, fetchDocuments } = useDocumentStore();
  const { user } = useAuthStore();

  const [queryTitle, setQueryTitle] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (id) {
        setLoading(true);
        try {
          const data = await governmentService.getApplicationDetails(id);
          setApp(data);
          await fetchDocuments(id);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [id, fetchDocuments]);

  const handleUpdateStatus = async (status: GovernmentApplicationStatus) => {
    if (!app || !user) return;
    setIsUpdating(true);
    await governmentService.updateStatus(app.id, status, user.id, user.name);
    const updated = await governmentService.getApplicationDetails(app.id);
    setApp(updated);
    setIsUpdating(false);
  };

  const handleRaiseQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !user || !queryTitle.trim() || !queryMessage.trim()) return;
    setIsUpdating(true);
    await governmentService.raiseQuery(app.id, queryTitle, queryMessage, new Date(Date.now() + 7 * 86400000).toISOString(), user.id, user.name);
    const updated = await governmentService.getApplicationDetails(app.id);
    setApp(updated);
    setQueryTitle('');
    setQueryMessage('');
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Applications', href: '/government/applications' }, { label: 'Loading…' }]}>
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Applications', href: '/government/applications' }, { label: 'Not Found' }]}>
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-slate-500">Application not found.</p>
        </div>
      </AppLayout>
    );
  }

  const docStatus = statusMap[app.status] ?? 'uploaded';

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Government', href: '/government' },
        { label: 'Applications', href: '/government/applications' },
        { label: app.id },
      ]}
    >
      <Link
        to="/government/applications"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to applications
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ── Left Column: Application Details & Docs ── */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
             {/* decorative background element based on risk */}
            {app.riskLevel === 'CRITICAL' && <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0" />}
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-slate-900">{app.name}</h1>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {app.id}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700">{app.businessName}</p>
              </div>
              <StatusBadge status={docStatus} size="md" />
            </div>

            <div className="relative z-10 mt-6 grid grid-cols-2 gap-y-5 gap-x-4">
              <DetailRow icon={Building2} label="Department" value={app.department} />
              {app.assignedOfficerName ? (
                <DetailRow icon={CheckSquare} label="Assigned Officer" value={app.assignedOfficerName} />
              ) : (
                <DetailRow icon={AlertTriangle} label="Assignment" value="Unassigned" valueClass="text-amber-600" />
              )}
              {app.submittedAt && (
                <DetailRow icon={Calendar} label="Submitted Date" value={new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
              )}
              <DetailRow icon={Hash} label="Reference No." value={app.referenceNo} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="size-4 text-blue-600" />
                Submitted Documents
              </h2>
            </div>
            <div className="p-1">
              <DocumentTable
                documents={documents}
                selectedId={null}
                isLoading={docsLoading}
                onSelect={(id) => {
                  window.open(`/documents/${id}`, '_blank');
                }}
                onDownload={() => {}}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-900">Application Timeline</h2>
            </div>
            <div className="p-5">
              <ApplicationTimeline events={app.timeline} />
            </div>
          </div>
        </div>

        {/* ── Right Column: Risk, SLA, & Actions ── */}
        <div className="space-y-6">
          
          {/* Intelligence Panel (Risk & SLA) */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 text-white shadow-md overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <ShieldAlert className="size-4" />
                Intelligence & Risk Assessment
              </h2>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs text-slate-400 mb-1">Calculated Risk Score</p>
                <div className="flex items-end gap-3">
                  <span className={cn(
                    "text-3xl font-bold tracking-tight",
                    app.riskLevel === 'CRITICAL' ? "text-red-400" :
                    app.riskLevel === 'HIGH' ? "text-amber-400" :
                    app.riskLevel === 'MEDIUM' ? "text-yellow-400" : "text-green-400"
                  )}>
                    {app.riskScore}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-semibold mb-1 uppercase",
                    app.riskLevel === 'CRITICAL' ? "bg-red-500/20 text-red-300" :
                    app.riskLevel === 'HIGH' ? "bg-amber-500/20 text-amber-300" :
                    app.riskLevel === 'MEDIUM' ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"
                  )}>
                    {app.riskLevel}
                  </span>
                </div>
              </div>

              {app.riskFactors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">Risk Factors:</p>
                  <ul className="space-y-2">
                    {app.riskFactors.map(factor => (
                      <li key={factor.id} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/50 p-2 rounded">
                        <AlertCircle className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{factor.description} <span className="text-slate-500 ml-1">(+{factor.score})</span></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-2">SLA Status</p>
                <div className={cn(
                  "p-3 rounded-lg border",
                  app.slaStatus === 'OVERDUE' ? "bg-red-500/10 border-red-500/20 text-red-300" :
                  app.slaStatus === 'CRITICAL' ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                  app.slaStatus === 'AT_RISK' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" : 
                  "bg-green-500/10 border-green-500/20 text-green-300"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="size-4" />
                    <span className="font-semibold text-sm">{app.slaStatus.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs opacity-80">
                    {app.slaStatus === 'OVERDUE' ? `Overdue by ${app.slaDaysOverdue} days` : 
                     app.slaDaysRemaining !== null ? `${app.slaDaysRemaining} days remaining` : 'No strict deadline'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Officer Action Panel */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-200 px-5 py-4 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-900">Officer Actions</h2>
            </div>
            <div className="p-5 flex-1">
              
              {app.status === 'approved' || app.status === 'rejected' ? (
                <div className="text-center py-6">
                  <div className={cn(
                    "mx-auto flex size-12 items-center justify-center rounded-full mb-3",
                    app.status === 'approved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {app.status === 'approved' ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}
                  </div>
                  <p className="text-sm font-medium text-slate-900">Application {app.status}</p>
                  <p className="text-xs text-slate-500 mt-1">No further actions required.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus('approved')}
                      className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-4" /> Approve
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus('rejected')}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <AlertTriangle className="size-4" /> Reject
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-slate-500">or raise query</span>
                    </div>
                  </div>

                  {/* Raise Query Form */}
                  <form onSubmit={handleRaiseQuery} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Query Subject</label>
                      <input
                        type="text"
                        value={queryTitle}
                        onChange={(e) => setQueryTitle(e.target.value)}
                        placeholder="E.g., Missing Environmental Clearance"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Message to Applicant</label>
                      <textarea
                        value={queryMessage}
                        onChange={(e) => setQueryMessage(e.target.value)}
                        placeholder="Please upload the updated clearance document..."
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isUpdating || !queryTitle.trim() || !queryMessage.trim()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="size-4" />
                      Send Query
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
