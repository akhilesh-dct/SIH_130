/**
 * Document Service — Mock implementation
 *
 * IDocumentService interface mirrors the future FastAPI contract:
 *   GET    /api/v1/documents              → Document[]
 *   GET    /api/v1/documents/:id          → Document
 *   POST   /api/v1/documents/:id/upload   → DocumentUploadResponse
 *   DELETE /api/v1/documents/:id/file     → void
 *
 * To connect to the real backend: replace class body only.
 * All consumer components (store, hooks, pages) remain unchanged.
 */

import type {
  Document,
  DocumentUploadResponse,
  VerificationSummary,
} from '@/types/document.types';
import { MOCK_DOCUMENTS } from '@/data/documents';
import { delay } from '@/lib/utils';

// In-memory mutable state for the mock (simulates database)
let mockDocuments: Document[] = MOCK_DOCUMENTS.map((d) => ({ ...d }));

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IDocumentService {
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | null>;
  uploadFile(
    documentId: string,
    file: File,
    onProgress: (pct: number) => void
  ): Promise<DocumentUploadResponse>;
  removeFile(documentId: string): Promise<void>;
  getSummary(): Promise<VerificationSummary>;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

class DocumentService implements IDocumentService {
  async getDocuments(): Promise<Document[]> {
    await delay(400);
    return mockDocuments.map((d) => ({ ...d }));
  }

  async getDocument(id: string): Promise<Document | null> {
    await delay(200);
    return mockDocuments.find((d) => d.id === id) ?? null;
  }

  async uploadFile(
    documentId: string,
    file: File,
    onProgress: (pct: number) => void
  ): Promise<DocumentUploadResponse> {
    // Simulate chunked upload progress
    for (let pct = 0; pct <= 100; pct += 20) {
      await delay(220);
      onProgress(pct);
    }

    const uploadedFile = {
      id: `upl_${Date.now()}`,
      fileName: file.name,
      fileSizeBytes: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'usr_01',
    };

    // Update in-memory state
    mockDocuments = mockDocuments.map((d) =>
      d.id === documentId
        ? { ...d, status: 'uploaded', uploadedFile }
        : d
    );

    return { uploadedFile, message: 'File uploaded successfully.' };
  }

  async removeFile(documentId: string): Promise<void> {
    await delay(300);
    mockDocuments = mockDocuments.map((d) =>
      d.id === documentId
        ? { ...d, status: 'not_uploaded', uploadedFile: undefined, verificationResult: undefined }
        : d
    );
  }

  async getSummary(): Promise<VerificationSummary> {
    await delay(200);
    const docs = mockDocuments;
    return {
      required: docs.filter((d) => d.isRequired).length,
      uploaded: docs.filter((d) => d.status !== 'not_uploaded').length,
      verified: docs.filter((d) => d.status === 'verified').length,
      needsAttention: docs.filter((d) => d.status === 'needs_attention').length,
      pending: docs.filter(
        (d) => d.isRequired && (d.status === 'not_uploaded' || d.status === 'uploaded')
      ).length,
      rejected: docs.filter((d) => d.status === 'rejected').length,
    };
  }
}

export const documentService: IDocumentService = new DocumentService();
