import { Link } from 'react-router-dom';
import { Clock, FileText, CheckCircle2, Building2 } from 'lucide-react';
import type { ApprovalDetail } from '@/types/approval.types';
import { cn } from '@/lib/utils';

interface ApprovalCardProps {
  approval: ApprovalDetail;
}

export function ApprovalCard({ approval }: ApprovalCardProps) {
  const { catalog, application } = approval;
  
  const statusColors: Record<string, string> = {
    not_started: 'bg-slate-100 text-slate-700 border-slate-200',
    documents_pending: 'bg-amber-50 text-amber-700 border-amber-200',
    ready_to_apply: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-purple-50 text-purple-700 border-purple-200',
    query_raised: 'bg-orange-50 text-orange-700 border-orange-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    expired: 'bg-red-50 text-red-700 border-red-200',
    renewal_required: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const statusLabels: Record<string, string> = {
    not_started: 'Not Started',
    documents_pending: 'Documents Pending',
    ready_to_apply: 'Ready to Apply',
    submitted: 'Submitted',
    under_review: 'Under Review',
    query_raised: 'Query Raised',
    approved: 'Approved',
    expired: 'Expired',
    renewal_required: 'Renewal Required',
  };

  const currentStatus = application?.status || 'not_started';
  const isActionRequired = currentStatus === 'documents_pending' || currentStatus === 'query_raised' || currentStatus === 'renewal_required';
  const isExpiringSoon = application?.renewal?.renewalStatus === 'expiring_soon';

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              <Link to={`/approvals/${catalog.id}`} className="focus:outline-none before:absolute before:inset-0">
                {catalog.name}
              </Link>
            </h3>
            <p className="mt-1 flex items-center text-xs text-slate-500">
              <Building2 className="mr-1.5 size-3.5 text-slate-400" />
              {catalog.department}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                statusColors[currentStatus] || statusColors.not_started
              )}
            >
              {statusLabels[currentStatus] || 'Unknown'}
            </span>
            {isExpiringSoon && (
              <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Expiring Soon
              </span>
            )}
            {isActionRequired && !isExpiringSoon && (
              <span className="inline-flex items-center text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                Action Required
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {catalog.whyRequired}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-4 border-t border-slate-100 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-slate-400" />
            {catalog.processingDays} days expected
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="size-3.5 text-slate-400" />
            {catalog.documentRequirements.length} docs needed
          </div>
          {currentStatus === 'approved' && application?.approvedAt && (
             <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="size-3.5" />
              Granted on {new Date(application.approvedAt).toLocaleDateString()}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
