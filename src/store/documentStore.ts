/**
 * Document Store — Zustand
 *
 * Global state for the document verification module.
 * Handles: document list, selected document, upload state.
 * No sessionStorage persistence — documents are re-fetched on each session.
 */

import { create } from 'zustand';
import type { Document, VerificationSummary, UploadState } from '@/types/document.types';
import { documentService } from '@/services/document.service';

interface DocumentStore {
  // State
  documents: Document[];
  selectedDocumentId: string | null;
  summary: VerificationSummary | null;
  isLoading: boolean;
  uploadState: UploadState;
  error: string | null;

  // Computed
  selectedDocument: Document | null;

  // Actions
  fetchDocuments: () => Promise<void>;
  selectDocument: (id: string | null) => void;
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

  // Computed: resolve selected document from list
  get selectedDocument() {
    const { documents, selectedDocumentId } = get();
    return documents.find((d) => d.id === selectedDocumentId) ?? null;
  },

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const [documents, summary] = await Promise.all([
        documentService.getDocuments(),
        documentService.getSummary(),
      ]);
      set({ documents, summary, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load documents. Please try again.' });
    }
  },

  selectDocument: (id) => {
    set({ selectedDocumentId: id, uploadState: { phase: 'idle' } });
  },

  uploadFile: async (documentId, file) => {
    set({ uploadState: { phase: 'uploading', file, progressPercent: 0 } });
    try {
      const response = await documentService.uploadFile(documentId, file, (pct) => {
        set({ uploadState: { phase: 'uploading', file, progressPercent: pct } });
      });
      set({ uploadState: { phase: 'success', uploadedFile: response.uploadedFile } });
      // Refresh documents to reflect new state
      const [documents, summary] = await Promise.all([
        documentService.getDocuments(),
        documentService.getSummary(),
      ]);
      set({ documents, summary });
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
