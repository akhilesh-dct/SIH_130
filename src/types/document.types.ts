/**
 * Document domain types — SIH 130 Industrial Platform
 *
 * Interface contract designed to match the future FastAPI backend.
 * All types are stable — connecting to the real API only requires
 * replacing the service implementation, not these type definitions.
 */

// ---------------------------------------------------------------------------
// Core enumerations
// ---------------------------------------------------------------------------

export type DocumentCategory =
  | 'corporate'
  | 'tax'
  | 'factory'
  | 'environment'
  | 'financial'
  | 'land'
  | 'identity';

export type DocumentStatus =
  | 'not_uploaded'
  | 'uploaded'
  | 'validating'
  | 'verifying'
  | 'verified'
  | 'needs_attention'
  | 'rejected'
  | 'expired';

export type VerificationCheckStatus = 'passed' | 'failed' | 'warning' | 'pending';

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Document {
  id: string;
  applicationId?: string;           // Link to the parent application
  name: string;
  category: DocumentCategory;
  description: string;
  isRequired: boolean;
  acceptedFormats: string[];        // e.g. ['PDF', 'JPG', 'PNG']
  maxSizeMb: number;
  status: DocumentStatus;
  version?: number;                 // Current document version
  uploadedFile?: UploadedFile;
  verificationResult?: VerificationResult;
  updatedAt?: string;               // ISO 8601
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
  uploadedAt: string;               // ISO 8601
  uploadedBy: string;               // User ID
}

export interface VerificationResult {
  documentId: string;
  verifiedAt: string;               // ISO 8601
  overallStatus: DocumentStatus;
  checks: VerificationCheck[];
  issues: VerificationIssue[];
  notes?: string;
}

export interface VerificationCheck {
  id: string;
  label: string;
  description: string;
  status: VerificationCheckStatus;
}

export interface VerificationIssue {
  id: string;
  severity: 'error' | 'warning';
  code: string;
  title: string;
  description: string;
  suggestedAction?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  status: DocumentStatus;
}

export interface DocumentHistory {
  id: string;
  documentId: string;
  action: 'UPLOAD' | 'VIEW' | 'DOWNLOAD' | 'REPLACE' | 'DELETE' | 'VERIFICATION_REQUESTED' | 'VERIFIED' | 'REJECTED';
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// API request/response shapes (for backend integration boundary)
// ---------------------------------------------------------------------------

export interface DocumentUploadRequest {
  documentId: string;               // The document slot being filled
  file: File;
}

export interface DocumentUploadResponse {
  uploadedFile: UploadedFile;
  message: string;
}

export interface VerificationSummary {
  required: number;
  uploaded: number;
  verified: number;
  needsAttention: number;
  pending: number;
  rejected: number;
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

export type UploadState =
  | { phase: 'idle' }
  | { phase: 'selected'; file: File }
  | { phase: 'uploading'; file: File; progressPercent: number }
  | { phase: 'success'; uploadedFile: UploadedFile }
  | { phase: 'error'; message: string };
