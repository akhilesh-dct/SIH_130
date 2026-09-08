import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import type { ApprovalDocumentRequirement } from '@/types/approval.types';
import { useDocumentStore } from '@/store/documentStore';
import { cn } from '@/lib/utils';

interface DocumentReadinessProps {
  requirements: ApprovalDocumentRequirement[];
  approvalId: string;
}

export function DocumentReadiness({ requirements, approvalId }: DocumentReadinessProps) {
  const navigate = useNavigate();
  const { documents, isLoading, fetchDocuments } = useDocumentStore();
  
  useEffect(() => {
    if (documents.length === 0) {
      fetchDocuments();
    }
  }, [documents.length, fetchDocuments]);

  // If loading documents
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-slate-200 p-5">
        <div className="h-4 w-1/3 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded" />
          <div className="h-10 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  // Calculate readiness
  let verifiedCount = 0;
  let needsAttentionCount = 0;
  let missingCount = 0;
  let pendingCount = 0;

  const mappedDocs = requirements.map((req) => {
    // In reality, this would match based on exact doc category and requirement mapping.
    // For this prototype, we'll try to find a document that matches the category.
    const doc = documents.find(d => d.category === req.category);
    
    if (!doc) {
      missingCount++;
      return { req, status: 'missing', doc: null };
    }
    
    if (doc.status === 'verified') {
      verifiedCount++;
      return { req, status: 'verified', doc };
    }
    
    if (doc.status === 'needs_attention' || doc.status === 'rejected') {
      needsAttentionCount++;
      return { req, status: 'needs_attention', doc };
    }
    
    pendingCount++;
    return { req, status: 'pending', doc };
  });

  const totalRequired = requirements.length;
  const isReady = verifiedCount === totalRequired;

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Document Readiness</h3>
          <span className="text-sm font-medium text-slate-600">
            {verifiedCount} / {totalRequired} Ready
          </span>
        </div>
        
        {/* Status Alert */}
        <div className={cn(
          "mt-3 flex items-start gap-3 rounded-md p-3 border",
          isReady ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
        )}>
          {isReady ? (
            <CheckCircle2 className="mt-0.5 size-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-5 text-amber-600 shrink-0" />
          )}
          <div>
            <p className={cn(
              "text-sm font-semibold",
              isReady ? "text-emerald-800" : "text-amber-800"
            )}>
              {isReady ? "READY TO APPLY" : "NOT READY TO APPLY"}
            </p>
            <p className={cn(
              "mt-1 text-xs",
              isReady ? "text-emerald-700" : "text-amber-700"
            )}>
              {isReady 
                ? "All required documents are verified. You can proceed with the application."
                : needsAttentionCount > 0 
                  ? `${needsAttentionCount} document(s) need your attention.`
                  : missingCount > 0
                    ? `You must upload ${missingCount} more document(s).`
                    : `${pendingCount} document(s) are currently under verification.`}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {mappedDocs.map((item) => (
          <div key={item.req.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex size-8 items-center justify-center rounded-full shrink-0",
                item.status === 'verified' ? 'bg-emerald-100 text-emerald-600' :
                item.status === 'needs_attention' ? 'bg-red-100 text-red-600' :
                item.status === 'pending' ? 'bg-blue-100 text-blue-600' :
                'bg-slate-100 text-slate-400'
              )}>
                {item.status === 'verified' ? <CheckCircle2 className="size-4" /> :
                 item.status === 'needs_attention' ? <AlertCircle className="size-4" /> :
                 item.status === 'pending' ? <Clock className="size-4" /> :
                 <FileText className="size-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{item.req.name}</p>
                <p className="text-xs text-slate-500 capitalize">{item.req.category}</p>
              </div>
            </div>
            
            <div>
              {item.status === 'verified' && (
                <span className="text-xs font-medium text-emerald-600">Verified</span>
              )}
              {item.status === 'pending' && (
                <span className="text-xs font-medium text-blue-600">Under Review</span>
              )}
              {item.status === 'missing' && (
                <button 
                  onClick={() => navigate('/documents')}
                  className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                  Upload <ArrowRight className="size-3" />
                </button>
              )}
              {item.status === 'needs_attention' && (
                <button 
                  onClick={() => navigate(`/documents/${item.doc?.id}`)}
                  className="text-xs font-medium text-red-600 hover:underline flex items-center gap-1"
                >
                  Fix Document <ArrowRight className="size-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!isReady && (
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => navigate(`/documents?approval=${approvalId}`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Manage Documents →
          </button>
        </div>
      )}
    </div>
  );
}
