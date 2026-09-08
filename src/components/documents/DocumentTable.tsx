import type { Document } from '@/types/document.types';
import { DocumentRow } from './DocumentRow';
import { FolderOpen } from 'lucide-react';

export interface DocumentTableProps {
  documents: Document[];
  selectedId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onDownload?: (document: Document) => void;
}

export function DocumentTable({
  documents,
  selectedId,
  isLoading,
  onSelect,
  onDownload,
}: DocumentTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-300 rounded-lg bg-slate-50/50">
        <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FolderOpen className="size-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">No documents found</h3>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your filters or upload a new document.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold tracking-wider">
          <tr>
            <th scope="col" className="px-4 py-3">Document</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">Uploaded</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Last Updated</th>
            <th scope="col" className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              isSelected={doc.id === selectedId}
              onSelect={onSelect}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
