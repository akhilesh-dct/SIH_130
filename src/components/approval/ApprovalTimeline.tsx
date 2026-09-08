import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';
import type { ApprovalTimelineEvent } from '@/types/approval.types';
import { cn } from '@/lib/utils';

interface ApprovalTimelineProps {
  timeline: ApprovalTimelineEvent[];
}

export function ApprovalTimeline({ timeline }: ApprovalTimelineProps) {
  // Find the last completed or active index to draw the connecting line
  const activeIndex = timeline.reduce(
    (acc, event, idx) => (event.status === 'completed' || event.status === 'active' ? idx : acc),
    0
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-800 mb-6">Application Progress</h3>
      
      <div className="relative">
        {/* Connecting line background */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100" />
        
        {/* Active connecting line */}
        <div 
          className="absolute left-[15px] top-4 w-0.5 bg-blue-500 transition-all duration-500" 
          style={{ height: `${(activeIndex / Math.max(1, timeline.length - 1)) * 100}%` }}
        />

        <div className="space-y-6 relative">
          {timeline.map((event) => {
            const isCompleted = event.status === 'completed';
            const isActive = event.status === 'active';
            const isError = event.status === 'error';

            return (
              <div key={event.id} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full bg-white relative z-10",
                    isCompleted && "text-blue-600",
                    isActive && "text-blue-600 ring-4 ring-blue-50",
                    isError && "text-red-600",
                    !isCompleted && !isActive && !isError && "text-slate-300"
                  )}>
                    {isCompleted ? <CheckCircle2 className="size-6" /> :
                     isError ? <XCircle className="size-6" /> :
                     isActive ? <Circle className="size-5 fill-blue-600" /> :
                     <Circle className="size-5" />}
                  </div>
                </div>
                
                <div className="flex-1 pb-1">
                  <p className={cn(
                    "text-sm font-semibold leading-tight",
                    isActive ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-500"
                  )}>
                    {event.stage}
                  </p>
                  
                  {event.timestamp && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="size-3" />
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  )}
                  
                  {event.description && (
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
