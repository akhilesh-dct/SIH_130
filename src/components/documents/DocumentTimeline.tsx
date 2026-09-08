import type { DocumentHistory } from '@/types/document.types';
import { Upload, Eye, Download, RefreshCw, Trash2, CheckCircle, Clock, XCircle, FilePlus } from 'lucide-react';
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

export interface DocumentTimelineProps {
  history: DocumentHistory[];
}

const ACTION_CONFIG: Record<string, { label: string; icon: ElementType; colorClass: string; bgClass: string }> = {
  UPLOAD: { label: 'Document uploaded', icon: Upload, colorClass: 'text-blue-600', bgClass: 'bg-blue-50 ring-blue-100' },
  VIEW: { label: 'Document viewed', icon: Eye, colorClass: 'text-slate-600', bgClass: 'bg-slate-50 ring-slate-100' },
  DOWNLOAD: { label: 'Document downloaded', icon: Download, colorClass: 'text-slate-600', bgClass: 'bg-slate-50 ring-slate-100' },
  REPLACE: { label: 'Document replaced', icon: RefreshCw, colorClass: 'text-purple-600', bgClass: 'bg-purple-50 ring-purple-100' },
  DELETE: { label: 'Document deleted', icon: Trash2, colorClass: 'text-red-600', bgClass: 'bg-red-50 ring-red-100' },
  VERIFICATION_REQUESTED: { label: 'Verification requested', icon: Clock, colorClass: 'text-amber-600', bgClass: 'bg-amber-50 ring-amber-100' },
  VERIFIED: { label: 'Document verified', icon: CheckCircle, colorClass: 'text-green-600', bgClass: 'bg-green-50 ring-green-100' },
  REJECTED: { label: 'Document rejected', icon: XCircle, colorClass: 'text-red-600', bgClass: 'bg-red-50 ring-red-100' },
};

export function DocumentTimeline({ history }: DocumentTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-slate-500">No history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900">Audit Trail</h4>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {history.map((event, eventIdx) => {
            const config = ACTION_CONFIG[event.action] || { 
              label: event.action, 
              icon: FilePlus, 
              colorClass: 'text-slate-500', 
              bgClass: 'bg-slate-100 ring-slate-200' 
            };
            const Icon = config.icon;

            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== history.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={cn(
                        "flex size-8 items-center justify-center rounded-full ring-8 ring-white",
                        config.bgClass
                      )}>
                        <Icon aria-hidden="true" className={cn("size-4", config.colorClass)} />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-slate-900">
                          {config.label}{' '}
                          <span className="font-medium text-slate-600">by {event.performedBy}</span>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-xs text-slate-500">
                        <time dateTime={event.timestamp}>
                          {new Date(event.timestamp).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
