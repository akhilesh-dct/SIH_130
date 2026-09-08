/**
 * Document Store — Zustand
 *
 * Global state for the document verification module.
 * Handles: document list, selected document, upload state.
 * No sessionStorage persistence — documents are re-fetched on each session.
 */

import { create } from 'zustand';
import type { Document, VerificationSummary, UploadState, DocumentVersion, DocumentHistory } from '@/types/document.types';
import { documentService } from '@/services/document.service';

interface DocumentStore {
  // State
  documents: Document[];
  selectedDocumentId: string | null;
  summary: VerificationSummary | null;
  isLoading: boolean;
  uploadState: UploadState;
  error: string | null;

  // Document specific details
  versions: DocumentVersion[];
  history: DocumentHistory[];
  isDetailsLoading: boolean;

  // Computed
  selectedDocument: Document | null;

  // Actions
  fetchDocuments: (applicationId?: string) => Promise<void>;
  selectDocument: (id: string | null) => void;
  fetchDocumentDetails: (id: string) => Promise<void>;
  uploadFile: (documentId: string, file: File) => Promise<void>;
  removeFile: (documentId: string) => Promise<void>;
  clearUploadState: () => void;
}

export const useDocumentStore = create<DocumentStore>()((set, get) => ({
  // Initial state
  documents: [],
  selectedDocumentId: null,
  summary: null,
  isLoading: false,
  uploadState: { phase: 'idle' },
  error: null,

  versions: [],
  history: [],
  isDetailsLoading: false,

  // Computed: resolve selected document from list
  get selectedDocument() {
    const { documents, selectedDocumentId } = get();
    return documents.find((d) => d.id === selectedDocumentId) ?? null;
  },

  fetchDocuments: async (applicationId) => {
    set({ isLoading: true, error: null });
    try {
      const docsPromise = applicationId 
        ? documentService.getDocumentsByApplication(applicationId) 
        : documentService.getDocuments();

      const [documents, summary] = await Promise.all([
        docsPromise,
        documentService.getSummary(),
      ]);
      set({ documents, summary, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load documents. Please try again.' });
    }
  },

  selectDocument: (id) => {
    set({ selectedDocumentId: id, uploadState: { phase: 'idle' }, versions: [], history: [] });
    if (id) {
      get().fetchDocumentDetails(id);
    }
  },

  fetchDocumentDetails: async (id) => {
    set({ isDetailsLoading: true });
    try {
      const [versions, history] = await Promise.all([
        documentService.getDocumentVersions(id),
        documentService.getDocumentHistory(id)
      ]);
      set({ versions, history, isDetailsLoading: false });
    } catch {
      set({ isDetailsLoading: false });
    }
  },

  uploadFile: async (documentId, file) => {
    set({ uploadState: { phase: 'uploading', file, progressPercent: 0 } });
    try {
      const response = await documentService.uploadFile(documentId, file, (pct) => {
        set({ uploadState: { phase: 'uploading', file, progressPercent: pct } });
      });
      set({ uploadState: { phase: 'success', uploadedFile: response.uploadedFile } });
      // Refresh documents and details to reflect new state
      const [documents, summary] = await Promise.all([
        documentService.getDocuments(), // or by application if we stored it, but we can assume global refresh for now
        documentService.getSummary(),
      ]);
      set({ documents, summary });
      get().fetchDocumentDetails(documentId);
    } catch {
      set({ uploadState: { phase: 'error', message: 'Upload failed. Please try again.' } });
    }
  },

  removeFile: async (documentId) => {
    try {
      await documentService.removeFile(documentId);
      const [documents, summary] = await Promise.all([
        documentService.getDocuments(),
        documentService.getSummary(),
      ]);
      set({ documents, summary, uploadState: { phase: 'idle' } });
    } catch {
      set({ error: 'Could not remove the file. Please try again.' });
    }
  },

  clearUploadState: () => {
    set({ uploadState: { phase: 'idle' } });
  },
}));
