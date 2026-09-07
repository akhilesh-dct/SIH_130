/**
 * UploadProgress component
 *
 * Shows file upload progress with a progress bar.
 * Used inside DocumentUpload during the uploading phase.
 */

import { FileText, Loader2 } from 'lucide-react';

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadProgressProps {
  fileName: string;
  fileSizeBytes: number;
  progressPercent: number;
}

export function UploadProgress({
  fileName,
  fileSizeBytes,
  progressPercent,
}: UploadProgressProps) {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-label={`Uploading ${fileName}: ${progressPercent}% complete`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-50">
          <FileText className="size-5 text-blue-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{fileName}</p>
          <p className="text-xs text-slate-400">{formatSize(fileSizeBytes)}</p>
        </div>
        <Loader2 className="size-4 text-blue-500 animate-spin shrink-0" aria-hidden="true" />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">Uploading…</span>
          <span className="text-xs font-medium text-slate-700 tabular-nums">
            {progressPercent}%
          </span>
        </div>
        <div
          className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
