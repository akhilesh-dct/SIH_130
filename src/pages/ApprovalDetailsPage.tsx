import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Building2, Calendar, ShieldCheck, AlertCircle, PlayCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApprovalStore } from '@/store/approvalStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentReadiness } from '@/components/approval/DocumentReadiness';
import { ApprovalTimeline } from '@/components/approval/ApprovalTimeline';

export function ApprovalDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedApproval, isLoading, error, fetchApproval, startApplication } = useApprovalStore();

  useEffect(() => {
    if (id) fetchApproval(id);
  }, [id, fetchApproval]);

  if (isLoading || !selectedApproval) {
    return (
      <AppLayout pageTitle="Loading Approval...">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout pageTitle="Error">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <Link to="/approvals" className="mt-2 text-sm text-blue-600 hover:underline inline-block">
            ← Back to Approvals
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { catalog, application } = selectedApproval;
  const status = application?.status || 'not_started';

  // Actions logic
  const handleStartApplication = () => {
    if (id) startApplication(id);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Approvals', href: '/approvals' },
        { label: catalog.name },
      ]}
    >
      <div className="mb-6">
        <Link to="/approvals" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft className="mr-1 size-4" />
          Back to Approvals
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{catalog.name}</h1>
            <p className="mt-1.5 flex items-center text-sm text-slate-500">
              <Building2 className="mr-1.5 size-4 text-slate-400" />
              {catalog.department}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 flex items-center">
               <Calendar className="mr-2 size-4 text-slate-400" />
               Expected: {catalog.processingDays} days
             </div>
             {application?.applicationId && (
               <div className="px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700 flex items-center">
                 ID: {application.applicationId}
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Required Alert */}
          {application?.activeQuery && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 flex items-start gap-3">
              <AlertCircle className="size-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-orange-800">Action Required: Department Query</h3>
                <p className="mt-1 text-sm text-orange-700">{application.activeQuery.text}</p>
                <p className="mt-2 text-xs font-medium text-orange-600">Deadline: {new Date(application.activeQuery.deadline).toLocaleDateString()}</p>
                <button className="mt-3 text-sm font-medium bg-orange-600 text-white px-4 py-1.5 rounded hover:bg-orange-700 transition-colors">
                  Resolve Query
                </button>
              </div>
            </div>
          )}

          {/* Expiring Soon Alert */}
          {application?.renewal?.renewalStatus === 'expiring_soon' && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800">Approval Expiring Soon</h3>
                <p className="mt-1 text-sm text-amber-700">
                  This approval will expire in {application.renewal.daysRemaining} days (on {new Date(application.renewal.expiresAt).toLocaleDateString()}).
                </p>
                <button className="mt-3 text-sm font-medium bg-amber-600 text-white px-4 py-1.5 rounded hover:bg-amber-700 transition-colors inline-flex items-center">
                  <RotateCcw className="mr-2 size-4" /> Start Renewal
                </button>
              </div>
            </div>
          )}

          {/* Details Section */}
          <section className="rounded-lg border border-slate-200 bg-white p-6">
             <h2 className="text-base font-semibold text-slate-900 mb-4">Why is this required?</h2>
             <p className="text-sm text-slate-600 leading-relaxed mb-6">
               {catalog.whyRequired}
             </p>

             <h2 className="text-base font-semibold text-slate-900 mb-4 mt-8">Description</h2>
             <p className="text-sm text-slate-600 leading-relaxed">
               {catalog.description}
             </p>
             
             <h2 className="text-base font-semibold text-slate-900 mb-4 mt-8">Applicable To</h2>
             <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
               {catalog.applicableTo.map((item, idx) => (
                 <li key={idx}>{item}</li>
               ))}
             </ul>

             {catalog.feeEstimate && (
               <>
                 <h2 className="text-base font-semibold text-slate-900 mb-2 mt-8">Fee Estimate</h2>
                 <p className="text-sm text-slate-600">{catalog.feeEstimate}</p>
               </>
             )}
          </section>

          {/* Document Readiness */}
          <DocumentReadiness requirements={catalog.documentRequirements} approvalId={catalog.id} />

        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            {status === 'not_started' ? (
              <>
                <ShieldCheck className="size-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-slate-900">Not Started</h3>
                <p className="mt-2 text-sm text-slate-500 mb-6">You haven't started compiling documents for this approval yet.</p>
                <button 
                  onClick={handleStartApplication}
                  className="w-full justify-center inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <PlayCircle className="mr-2 size-4" /> Start Process
                </button>
              </>
            ) : status === 'approved' ? (
              <>
                <CheckCircle2 className="size-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-emerald-700">Approval Granted</h3>
                <p className="mt-2 text-sm text-slate-500 mb-6">This approval is currently active and valid.</p>
                <button className="w-full justify-center inline-flex items-center rounded-md bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  View Approval Certificate
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center size-12 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <span className="text-lg font-bold">{application?.progressScore}%</span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 capitalize">{status.replace('_', ' ')}</h3>
                <p className="mt-2 text-sm text-slate-500 mb-6">
                  {status === 'documents_pending' ? 'Gathering required documents.' : 'Application is currently being processed by the department.'}
                </p>
                
                {status === 'documents_pending' && (
                  <button className="w-full justify-center inline-flex items-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">
                    Check Requirements
                  </button>
                )}
                {status === 'ready_to_apply' && (
                  <button className="w-full justify-center inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                    Submit Application
                  </button>
                )}
              </>
            )}
          </div>

          {/* Timeline */}
          {application && <ApprovalTimeline timeline={application.timeline} />}
        </div>
      </div>
    </AppLayout>
  );
}
