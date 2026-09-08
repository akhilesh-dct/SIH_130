/**
 * DocumentUpload component
 *
 * Full-featured file upload UI with all states:
 * - empty (drag & drop zone)
 * - drag-over (hover highlight)
 * - selected (file chosen, not yet uploaded)
 * - uploading (progress bar via UploadProgress)
 * - success (file uploaded)
 * - error (upload failed)
 *
 * Does not actually send files to a server in the mock.
 * When connected to FastAPI, only the store action changes.
 */

import { useRef, useState, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle2, XCircle, X, AlertTriangle } from 'lucide-react';
import type { Document, UploadState } from '@/types/document.types';
import { UploadProgress } from './UploadProgress';
import { cn } from '@/lib/utils';

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentUploadProps {
  document: Document;
  uploadState: UploadState;
  onUpload: (documentId: string, file: File) => void;
  onRemove: (documentId: string) => void;
  onClearError: () => void;
}

export function DocumentUpload({
  document: doc,
  uploadState,
  onUpload,
  onRemove,
  onClearError,
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = doc.acceptedFormats
    .map((f) => {
      if (f === 'PDF') return 'application/pdf';
      if (f === 'JPG') return 'image/jpeg';
      if (f === 'PNG') return 'image/png';
      return `image/${f.toLowerCase()}`;
    })
    .join(',');

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      setValidationError(null);
      // Basic client-side validation
      if (file.size > doc.maxSizeMb * 1024 * 1024) {
        setValidationError(`File is too large. Maximum allowed size is ${doc.maxSizeMb} MB.`);
        return;
      }
      
      const fileExt = file.name.split('.').pop()?.toUpperCase() || '';
      const isAcceptedFormat = doc.acceptedFormats.includes(fileExt) || 
        doc.acceptedFormats.some(fmt => file.type.includes(fmt.toLowerCase()));
        
      if (!isAcceptedFormat) {
        setValidationError(`Invalid file type. Accepted formats are: ${doc.acceptedFormats.join(', ')}`);
        return;
      }
      
      onUpload(doc.id, file);
    },
    [doc]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // Reset so same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── Uploading state ──
  if (uploadState.phase === 'uploading') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <UploadProgress
          fileName={uploadState.file.name}
          fileSizeBytes={uploadState.file.size}
          progressPercent={uploadState.progressPercent}
        />
      </div>
    );
  }

  // ── Success state (just uploaded in this session) ──
  if (uploadState.phase === 'success' && doc.status === 'uploaded') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
            <p className="mt-0.5 text-xs text-green-600 truncate">
              {uploadState.uploadedFile.fileName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Already has an uploaded file (persisted state) ──
  if (doc.uploadedFile && doc.status !== 'not_uploaded') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-100">
            <FileText className="size-5 text-slate-500" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {doc.uploadedFile.fileName}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatSize(doc.uploadedFile.fileSizeBytes)} &middot;{' '}
              {new Date(doc.uploadedFile.uploadedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(doc.id)}
            className={cn(
              'flex items-center gap-1.5 rounded border border-slate-200 px-2.5 py-1.5',
              'text-xs font-medium text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50',
              'transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
            )}
            aria-label="Remove uploaded file"
          >
            <X className="size-3" aria-hidden="true" />
            Remove
          </button>
        </div>

        {/* Re-upload hint for attention/rejected */}
        {(doc.status === 'needs_attention' || doc.status === 'rejected') && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={cn(
                'text-xs font-medium text-blue-700 hover:text-blue-800',
                'underline-offset-2 hover:underline',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
              )}
            >
              Replace with a new file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={acceptTypes}
              className="sr-only"
              onChange={handleInputChange}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        )}
        {validationError && (
          <div className="mt-3 text-xs text-red-600 flex items-start gap-1">
            <XCircle className="size-3.5 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}
      </div>
    );
  }

  // ── Error state ──
  if (uploadState.phase === 'error') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Upload failed</p>
            <p className="mt-0.5 text-xs text-red-600">{uploadState.message}</p>
            <button
              type="button"
              onClick={onClearError}
              className="mt-2 text-xs font-medium text-red-700 underline underline-offset-2 hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty / drag-and-drop state ──
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload file — click or drag and drop"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed',
          'cursor-pointer px-6 py-8 text-center transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white'
        )}
      >
        <UploadCloud
          className={cn(
            'size-8',
            isDragOver ? 'text-blue-500' : 'text-slate-400'
          )}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-medium text-slate-700">
            {isDragOver ? 'Drop file here' : 'Click to browse or drag a file'}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {doc.acceptedFormats.join(', ')} &middot; max {doc.maxSizeMb} MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {validationError && (
        <div className="mt-2 text-xs text-red-600 flex items-start justify-center gap-1">
          <XCircle className="size-3.5 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {doc.maxSizeMb > 5 && !validationError && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <AlertTriangle className="size-3 shrink-0" aria-hidden="true" />
          Large files may take longer to verify.
        </p>
      )}
    </div>
  );
}
