/**
 * DocumentCard component
 *
 * Renders a single row in the document list.
 * Shows: document name, category, upload date, status badge, and action button.
 * Handles selected state, required indicator.
 */

import { FileText, Upload, Star } from 'lucide-react';
import type { Document } from '@/types/document.types';
import { VerificationStatus } from './VerificationStatus';
import { cn } from '@/lib/utils';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const CATEGORY_LABELS: Record<string, string> = {
  corporate: 'Corporate',
  tax: 'Tax & GST',
  factory: 'Factory',
  environment: 'Environment',
  financial: 'Financial',
  land: 'Land & Property',
  identity: 'Identity',
};

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function DocumentCard({ document: doc, isSelected, onSelect }: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doc.id)}
      aria-pressed={isSelected}
      aria-label={`${doc.name} — ${doc.status.replace('_', ' ')}`}
      className={cn(
        'w-full text-left px-4 py-3.5 border-b border-slate-100',
        'flex items-start gap-3 transition-colors duration-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
        isSelected
          ? 'bg-blue-50 border-l-2 border-l-blue-600'
          : 'bg-white hover:bg-slate-50 border-l-2 border-l-transparent'
      )}
    >
      {/* File icon */}
      <div
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
          doc.status === 'verified'
            ? 'bg-green-50'
            : doc.status === 'needs_attention' || doc.status === 'rejected'
            ? 'bg-amber-50'
            : 'bg-slate-100'
        )}
        aria-hidden="true"
      >
        <FileText
          className={cn(
            'size-4',
            doc.status === 'verified'
              ? 'text-green-600'
              : doc.status === 'needs_attention' || doc.status === 'rejected'
              ? 'text-amber-600'
              : 'text-slate-400'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1.5">
          <p
            className={cn(
              'text-sm font-medium leading-snug truncate flex-1',
              isSelected ? 'text-blue-800' : 'text-slate-800'
            )}
          >
            {doc.name}
          </p>
          {doc.isRequired && (
            <Star
              className="size-3 mt-0.5 shrink-0 text-blue-400 fill-blue-400"
              aria-label="Required document"
            />
          )}
        </div>

        <p className="mt-0.5 text-xs text-slate-400">
          {CATEGORY_LABELS[doc.category] ?? doc.category}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VerificationStatus status={doc.status} />
          {doc.uploadedFile ? (
            <span className="text-xs text-slate-400">
              {formatDate(doc.uploadedFile.uploadedAt)} &middot;{' '}
              {formatSize(doc.uploadedFile.fileSizeBytes)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Upload className="size-3" aria-hidden="true" />
              Not uploaded
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
