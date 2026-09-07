/**
 * DocumentDetails component
 *
 * Right panel: shows document description, upload widget, and verification result.
 * Adapts based on document status — shows upload zone, verification checklist, or issues.
 */

import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Document, UploadState } from '@/types/document.types';
import { VerificationStatus } from './VerificationStatus';
import { VerificationChecklist } from './VerificationChecklist';
import { VerificationIssue } from './VerificationIssue';
import { DocumentUpload } from './DocumentUpload';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  corporate: 'Corporate',
  tax: 'Tax & GST',
  factory: 'Factory',
  environment: 'Environment',
  financial: 'Financial',
  land: 'Land & Property',
  identity: 'Identity',
};

interface DocumentDetailsProps {
  document: Document;
  uploadState: UploadState;
  onUpload: (documentId: string, file: File) => void;
  onRemove: (documentId: string) => void;
  onClearError: () => void;
}

export function DocumentDetails({
  document: doc,
  uploadState,
  onUpload,
  onRemove,
  onClearError,
}: DocumentDetailsProps) {
  const hasVerification = !!doc.verificationResult;
  const hasIssues =
    doc.verificationResult?.issues && doc.verificationResult.issues.length > 0;

  return (
    <div className="space-y-6">
      {/* Document header */}
      <div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{doc.name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {CATEGORY_LABELS[doc.category]} &middot;{' '}
              {doc.isRequired ? (
                <span className="text-blue-600 font-medium">Required</span>
              ) : (
                <span className="text-slate-400">Optional</span>
              )}
            </p>
          </div>
          <VerificationStatus status={doc.status} size="md" />
        </div>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{doc.description}</p>
      </div>

      {/* Accepted formats */}
      <div className="flex flex-wrap gap-2 text-xs">
        {doc.acceptedFormats.map((fmt) => (
          <span
            key={fmt}
            className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-500"
          >
            {fmt}
          </span>
        ))}
        <span className="text-slate-400 self-center">up to {doc.maxSizeMb} MB</span>
      </div>

      <div className="h-px bg-slate-100" aria-hidden="true" />

      {/* Upload section */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">File upload</h3>
        <DocumentUpload
          document={doc}
          uploadState={uploadState}
          onUpload={onUpload}
          onRemove={onRemove}
          onClearError={onClearError}
        />
      </div>

      {/* Verification result */}
      {hasVerification && doc.verificationResult && (
        <>
          <div className="h-px bg-slate-100" aria-hidden="true" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">Verification checks</h3>
              {doc.verificationResult.verifiedAt && (
                <span className="text-xs text-slate-400">
                  {new Date(doc.verificationResult.verifiedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            <VerificationChecklist checks={doc.verificationResult.checks} />
          </div>

          {/* Issues */}
          {hasIssues && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Issues identified</h3>
              <div className="space-y-3">
                {doc.verificationResult.issues.map((issue) => (
                  <VerificationIssue key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pending verification notice */}
      {doc.status === 'uploaded' && !hasVerification && (
        <div className="flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden="true" />
          <p className="text-sm text-blue-700 leading-relaxed">
            This document has been uploaded and is queued for verification. You will be
            notified when the review is complete.
          </p>
        </div>
      )}

      {/* Continue action */}
      <div
        className={cn(
          'pt-2 border-t border-slate-100'
        )}
      >
        <Link
          to="/dashboard"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2',
            'rounded-md px-4 py-2.5 text-sm font-semibold',
            'bg-blue-700 text-white shadow-sm',
            'hover:bg-blue-800 transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          )}
        >
          Continue to application
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
