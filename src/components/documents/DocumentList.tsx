/**
 * DocumentList component
 *
 * Renders the left panel — scrollable list of all document slots.
 * Handles loading skeleton and empty states.
 */

import type { Document } from '@/types/document.types';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
}

function ListSkeleton() {
  return (
    <div aria-hidden="true" aria-label="Loading documents">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-3.5 border-b border-slate-100 flex items-start gap-3 animate-pulse"
        >
          <div className="mt-0.5 size-8 rounded-md bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocumentList({
  documents,
  selectedId,
  isLoading,
  onSelect,
}: DocumentListProps) {
  if (isLoading) return <ListSkeleton />;

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <p className="text-sm font-medium text-slate-600">No documents found</p>
        <p className="mt-1 text-xs text-slate-400">
          Your required documents will appear here.
        </p>
      </div>
    );
  }

  const required = documents.filter((d) => d.isRequired);
  const optional = documents.filter((d) => !d.isRequired);

  return (
    <div role="list" aria-label="Document list">
      {required.length > 0 && (
        <section>
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Required ({required.length})
            </p>
          </div>
          {required.map((doc) => (
            <div key={doc.id} role="listitem">
              <DocumentCard
                document={doc}
                isSelected={doc.id === selectedId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </section>
      )}

      {optional.length > 0 && (
        <section>
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Optional ({optional.length})
            </p>
          </div>
          {optional.map((doc) => (
            <div key={doc.id} role="listitem">
              <DocumentCard
                document={doc}
                isSelected={doc.id === selectedId}
                onSelect={onSelect}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
