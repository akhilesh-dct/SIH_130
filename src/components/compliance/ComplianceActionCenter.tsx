import { useMemo } from 'react';
import type { ComplianceObligation } from '@/types/compliance.types';
import { AlertCircle, ArrowRight, Clock, FileWarning } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  obligations: ComplianceObligation[];
}

export function ComplianceActionCenter({ obligations }: Props) {
  const actions = useMemo(() => {
    return obligations
      .filter(o => ['OVERDUE', 'DUE_SOON', 'REJECTED'].includes(o.status))
      .sort((a, b) => {
        // High risk first, then by date
        if (a.risk.score !== b.risk.score) return b.risk.score - a.risk.score;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 3); // Show top 3 actions
  }, [obligations]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <AlertCircle className="size-4 text-orange-500" />
        Requires Your Attention
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(action => (
          <div key={action.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {action.category}
              </span>
              {action.status === 'OVERDUE' && <span className="text-xs font-semibold text-red-600 flex items-center gap-1"><AlertCircle className="size-3"/> Overdue</span>}
              {action.status === 'REJECTED' && <span className="text-xs font-semibold text-red-600 flex items-center gap-1"><FileWarning className="size-3"/> Rejected</span>}
              {action.status === 'DUE_SOON' && <span className="text-xs font-semibold text-amber-600 flex items-center gap-1"><Clock className="size-3"/> Due Soon</span>}
            </div>
            
            <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{action.name}</h3>
            
            <p className="text-xs text-slate-500 flex-1 mb-4 line-clamp-2">
              {action.status === 'OVERDUE' ? 'Deadline passed. Immediate action required.' : 
               action.status === 'REJECTED' ? 'Previous submission rejected. Review and resubmit.' : 
               `Due on ${new Date(action.dueDate).toLocaleDateString()}.`}
            </p>
            
            <Link 
              to={`/compliance/${action.id}`}
              className="mt-auto inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Resolve Issue <ArrowRight className="size-3 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
