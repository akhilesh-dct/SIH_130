import { useState } from 'react';
import type { ComplianceEvidenceRequirement } from '@/types/compliance.types';
import { FileText, CheckCircle2, AlertCircle, UploadCloud, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useComplianceStore } from '@/store/complianceStore';

interface Props {
  businessId: string;
  obligationId: string;
  evidence: ComplianceEvidenceRequirement[];
  isEditable?: boolean;
}

export function EvidenceList({ businessId, obligationId, evidence, isEditable = false }: Props) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const { updateEvidence } = useComplianceStore();

  const handleUploadClick = async (ev: ComplianceEvidenceRequirement) => {
    // In a real app, this would open a file picker or redirect to /documents module.
    // For the demo, we mock an upload delay and then mark it as uploaded.
    setUploadingId(ev.id);
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1000));
    // Simulate updating evidence with a mock document ID
    await updateEvidence(businessId, obligationId, ev.id, `doc-mock-${Date.now()}`);
    setUploadingId(null);
  };

  if (evidence.length === 0) {
    return (
      <div className="text-sm text-slate-500 py-4 text-center border rounded-lg border-dashed">
        No evidence documents required.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((ev) => {
        const isMissing = ev.status === 'Missing';
        const isRejected = ev.status === 'Rejected';
        const isVerified = ev.status === 'Verified';
        const isUploaded = ev.status === 'Uploaded';

        return (
          <div
            key={ev.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border',
              isMissing ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-200'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center justify-center size-8 rounded-full bg-slate-100',
                isMissing && 'bg-red-100 text-red-600',
                isVerified && 'bg-green-100 text-green-600',
                isUploaded && 'bg-blue-100 text-blue-600'
              )}>
                <FileText className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {ev.documentName}
                  {ev.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isMissing && <><AlertCircle className="size-3 text-red-500" /><span className="text-xs text-red-600 font-medium">Missing</span></>}
                  {isVerified && <><CheckCircle2 className="size-3 text-green-500" /><span className="text-xs text-green-600 font-medium">Verified</span></>}
                  {isUploaded && <><CheckCircle2 className="size-3 text-blue-500" /><span className="text-xs text-blue-600 font-medium">Uploaded</span></>}
                  {isRejected && <><XCircle className="size-3 text-red-500" /><span className="text-xs text-red-600 font-medium">Rejected</span></>}
                </div>
              </div>
            </div>

            {isEditable && (isMissing || isRejected) && (
              <button
                onClick={() => handleUploadClick(ev)}
                disabled={uploadingId === ev.id}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {uploadingId === ev.id ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <UploadCloud className="size-3.5" />
                    Upload
                  </>
                )}
              </button>
            )}
            
            {(!isMissing && !isRejected) && (
              <a
                href={`/documents/${ev.linkedDocumentId}`}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                View Document
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
