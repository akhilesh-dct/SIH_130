import type { DocumentVersion } from '@/types/document.types';
import { VerificationStatus } from './VerificationStatus';
import { Download, FileText, FileImage, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentVersionHistoryProps {
  versions: DocumentVersion[];
  onDownload?: (version: DocumentVersion) => void;
}

export function DocumentVersionHistory({ versions, onDownload }: DocumentVersionHistoryProps) {
  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-slate-500">No previous versions available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900">Version History</h4>
      <div className="space-y-3">
        {versions.map((version, index) => {
          const isLatest = index === 0;
          const isImage = version.fileType.startsWith('image/');
          const isPdf = version.fileType === 'application/pdf';

          return (
            <div 
              key={version.id} 
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                isLatest ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                  isLatest ? "border-blue-200 bg-blue-100 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isImage ? <FileImage className="size-4" /> : 
                   isPdf ? <FileText className="size-4" /> : 
                   <File className="size-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      Version {version.version}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">
                      {new Date(version.uploadedAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{(version.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <VerificationStatus status={version.status} />
                {onDownload && (
                  <button 
                    onClick={() => onDownload(version)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    title="Download version"
                  >
                    <Download className="size-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
