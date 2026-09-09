import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComplianceStore } from '@/store/complianceStore';
import { useAuthStore } from '@/store/authStore';
import { ComplianceStatusBadge } from '@/components/compliance/ComplianceStatusBadge';
import { ComplianceRiskIndicator } from '@/components/compliance/ComplianceRiskIndicator';
import { EvidenceList } from '@/components/compliance/EvidenceList';
import { 
  Building2, Calendar, FileText, CheckCircle2, Info, 
  History, Building, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export function ComplianceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { obligations, history, fetchObligations, fetchHistory, submitCompliance } = useComplianceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      if (obligations.length === 0) {
        fetchObligations(user.id);
      }
      if (id) {
        fetchHistory(id);
      }
    }
  }, [user?.id, id, obligations.length, fetchObligations, fetchHistory]);

  const obligation = useMemo(() => obligations.find((o) => o.id === id), [obligations, id]);
  const obHistory = useMemo(() => id ? history[id] || [] : [], [history, id]);

  const canSubmit = obligation && 
                    (obligation.status === 'NOT_STARTED' || obligation.status === 'DUE_SOON' || obligation.status === 'OVERDUE' || obligation.status === 'REJECTED') &&
                    obligation.evidenceRequirements.every(e => e.status === 'Uploaded' || e.status === 'Verified' || !e.required);

  const handleSubmit = async () => {
    if (!user?.id || !obligation) return;
    setIsSubmitting(true);
    await submitCompliance(user.id, obligation.id);
    setIsSubmitting(false);
  };

  if (!obligation) {
    return (
      <AppLayout
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Compliance', href: '/compliance' }, { label: 'Details' }]}
        pageTitle="Compliance Details"
      >
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Compliance', href: '/compliance' },
        { label: obligation.name }
      ]}
      actions={
        canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Compliance'}
          </button>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{obligation.name}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {obligation.authorityName}</span>
                  <span className="flex items-center gap-1.5"><Info className="size-4" /> {obligation.category}</span>
                </div>
              </div>
              <ComplianceStatusBadge status={obligation.status} />
            </div>

            <p className="text-slate-700 mb-6">{obligation.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-1">Due Date</span>
                <span className="block text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <Calendar className="size-4 text-slate-400" />
                  {format(new Date(obligation.dueDate), 'dd MMM yyyy')}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-1">Frequency</span>
                <span className="block text-sm font-semibold text-slate-900">{obligation.frequency}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-1">Risk Status</span>
                <ComplianceRiskIndicator risk={obligation.risk} />
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-500 mb-1">Last Completed</span>
                <span className="block text-sm font-semibold text-slate-900">
                  {obligation.completedAt ? format(new Date(obligation.completedAt), 'dd MMM yyyy') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Requirements */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="size-5 text-blue-600" />
              Required Evidence
            </h2>
            <EvidenceList 
              businessId={user?.id || ''} 
              obligationId={obligation.id} 
              evidence={obligation.evidenceRequirements} 
              isEditable={['NOT_STARTED', 'DUE_SOON', 'OVERDUE', 'REJECTED'].includes(obligation.status)}
            />
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Action Items
            </h2>
            <ul className="space-y-3">
              {obligation.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="mt-0.5 size-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-500 font-medium text-[10px]">
                    {idx + 1}
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Applicability Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Building className="size-4 text-slate-500" />
              Why this applies
            </h3>
            <ul className="space-y-2">
              {obligation.applicabilityReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link to="/profile" className="text-xs text-blue-600 font-medium hover:underline flex items-center">
                Review Business Profile <ChevronRight className="size-3 ml-1" />
              </Link>
            </div>
          </div>

          {/* Timeline / History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <History className="size-4 text-slate-500" />
              Timeline
            </h3>
            <div className="relative border-l border-slate-200 ml-3 space-y-6">
              {obHistory.length === 0 ? (
                <div className="pl-4 text-sm text-slate-500">No history available</div>
              ) : (
                obHistory.map((hist) => (
                  <div key={hist.id} className="relative pl-6">
                    <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-200" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{hist.action.replace('_', ' ')}</span>
                      <span className="text-xs text-slate-500 mt-0.5 flex justify-between">
                        <span>{hist.performedBy}</span>
                        <span>{format(new Date(hist.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
