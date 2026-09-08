/**
 * DocumentsPage — Document Verification Workspace
 *
 * Dashboard layout:
 *   Top     — Verification Summary
 *   Left    — DocumentFilters & DocumentTable
 *   Right   — DocumentDetails (slide-over or side panel on desktop)
 */

import { useEffect, useState, useMemo } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentDetails } from '@/components/documents/DocumentDetails';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { VerificationSummary } from '@/components/documents/VerificationSummary';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { DocumentStatus } from '@/types/document.types';

export function DocumentsPage() {
  const {
    documents,
    selectedDocumentId,
    selectedDocument,
    summary,
    isLoading,
    uploadState,
    versions,
    history,
    fetchDocuments,
    selectDocument,
    uploadFile,
    removeFile,
    clearUploadState,
  } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [showPreview, setShowPreview] = useState(false);

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSelect = (id: string) => {
    selectDocument(id);
    setShowPreview(false); // Reset to details view when selecting a new doc
  };

  const handleDownload = (doc: any) => {
    // Mock download action
    console.log('Downloading document:', doc.name || doc.fileName);
    alert(`Downloading ${doc.name || doc.fileName}...`);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Document Verification' },
      ]}
      pageTitle="Document Verification"
      pageDescription="Manage documents required for your applications and approvals."
    >
      {/* Summary bar */}
      <div className="mb-6">
        {summary ? (
          <VerificationSummary summary={summary} />
        ) : (
          <div className="h-16 animate-pulse rounded-lg border border-slate-200 bg-white" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start relative">
        {/* Main Content: Filters + Table */}
        <div className={cn(
          "flex-1 w-full flex flex-col space-y-4",
          selectedDocument ? "xl:w-[calc(100%-420px)]" : "w-full"
        )}>
          <DocumentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <DocumentTable
            documents={filteredDocuments}
            selectedId={selectedDocumentId}
            isLoading={isLoading}
            onSelect={handleSelect}
            onDownload={handleDownload}
          />
        </div>

        {/* Side Panel: Details or Preview */}
        {selectedDocument && (
          <div className="w-full xl:w-[400px] shrink-0 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col xl:sticky xl:top-6" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">
                {showPreview ? 'Document Preview' : 'Document Details'}
              </h3>
              <div className="flex items-center gap-2">
                {selectedDocument.uploadedFile && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPreview ? 'Show Details' : 'Show Preview'}
                  </button>
                )}
                <button
                  onClick={() => selectDocument(null)}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 xl:p-5">
              {showPreview ? (
                <DocumentPreview 
                  document={selectedDocument} 
                  onDownload={handleDownload}
                  onReplace={() => setShowPreview(false)}
                />
              ) : (
                <DocumentDetails
                  document={selectedDocument}
                  uploadState={uploadState}
                  onUpload={uploadFile}
                  onRemove={removeFile}
                  onClearError={clearUploadState}
                  versions={versions}
                  history={history}
                  onDownloadVersion={handleDownload}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
