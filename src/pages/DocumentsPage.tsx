/**
 * DocumentsPage — Document Verification Workspace
 *
 * Three-panel layout:
 *   Left    — DocumentList (scrollable)
 *   Center  — DocumentPreview
 *   Right   — DocumentDetails (upload + verification result)
 *
 * On tablet (md): two panels (list + details, preview hidden)
 * On mobile: tab navigation between list, preview, and details
 */

import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { DocumentDetails } from '@/components/documents/DocumentDetails';
import { VerificationSummary } from '@/components/documents/VerificationSummary';
import { cn } from '@/lib/utils';
import { List, Eye, FileCheck } from 'lucide-react';

type MobileTab = 'list' | 'preview' | 'details';

const MOBILE_TABS: { id: MobileTab; label: string; Icon: ElementType }[] = [
  { id: 'list', label: 'Documents', Icon: List },
  { id: 'preview', label: 'Preview', Icon: Eye },
  { id: 'details', label: 'Details', Icon: FileCheck },
];

export function DocumentsPage() {
  const {
    documents,
    selectedDocumentId,
    selectedDocument,
    summary,
    isLoading,
    uploadState,
    fetchDocuments,
    selectDocument,
    uploadFile,
    removeFile,
    clearUploadState,
  } = useDocumentStore();

  const [mobileTab, setMobileTab] = useState<MobileTab>('list');

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Auto-select first document on desktop
  useEffect(() => {
    if (!isLoading && documents.length > 0 && !selectedDocumentId) {
      selectDocument(documents[0].id);
    }
  }, [isLoading, documents, selectedDocumentId, selectDocument]);

  const handleSelect = (id: string) => {
    selectDocument(id);
    // On mobile, switch to details tab after selecting
    setMobileTab('details');
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Document Verification' },
      ]}
      pageTitle="Document Verification"
      pageDescription="Upload, manage, and track verification of your required compliance documents."
    >
      {/* Summary bar */}
      <div className="mb-5">
        {summary ? (
          <VerificationSummary summary={summary} />
        ) : (
          <div className="h-16 animate-pulse rounded-lg border border-slate-200 bg-white" aria-hidden="true" />
        )}
      </div>

      {/* ── Mobile tab bar ── */}
      <div className="xl:hidden flex border-b border-slate-200 bg-white rounded-t-lg overflow-hidden mb-0">
        {MOBILE_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobileTab(id)}
            aria-current={mobileTab === id ? 'true' : undefined}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium',
              'border-b-2 transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
              mobileTab === id
                ? 'border-blue-600 text-blue-700 bg-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Three-panel workspace ── */}
      <div
        className="flex border border-slate-200 rounded-b-lg xl:rounded-lg bg-white overflow-hidden shadow-sm"
        style={{ minHeight: '600px' }}
      >
        {/* ── Left: Document List ── */}
        <div
          className={cn(
            'xl:w-[280px] xl:border-r xl:border-slate-200 xl:flex xl:flex-col overflow-y-auto',
            // Mobile visibility
            mobileTab === 'list' ? 'flex flex-col w-full' : 'hidden xl:flex xl:flex-col'
          )}
          aria-label="Document list panel"
        >
          <DocumentList
            documents={documents}
            selectedId={selectedDocumentId}
            isLoading={isLoading}
            onSelect={handleSelect}
          />
        </div>

        {/* ── Center: Preview ── */}
        <div
          className={cn(
            'xl:flex-1 xl:border-r xl:border-slate-200 xl:flex xl:flex-col overflow-hidden',
            // Mobile visibility
            mobileTab === 'preview' ? 'flex flex-col flex-1' : 'hidden xl:flex xl:flex-col xl:flex-1'
          )}
          aria-label="Document preview panel"
        >
          {selectedDocument ? (
            <DocumentPreview document={selectedDocument} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center p-8">
              <p className="text-sm text-slate-400">
                Select a document from the list to preview it here.
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Details ── */}
        <div
          className={cn(
            'xl:w-[340px] xl:flex xl:flex-col overflow-y-auto',
            // Mobile visibility
            mobileTab === 'details' ? 'flex flex-col w-full' : 'hidden xl:flex xl:flex-col'
          )}
          aria-label="Document details panel"
        >
          {selectedDocument ? (
            <div className="p-5">
              <DocumentDetails
                document={selectedDocument}
                uploadState={uploadState}
                onUpload={uploadFile}
                onRemove={removeFile}
                onClearError={clearUploadState}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center p-8">
              <p className="text-sm text-slate-400">
                Select a document to view details and verification status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions footnote */}
      <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
        <span
          className="inline-block size-1.5 rounded-full bg-blue-400"
          aria-hidden="true"
        />
        Required documents are marked with a star. All required documents must be verified before submitting your application.
      </p>
    </AppLayout>
  );
}
