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
  | 'verifying'
  | 'verified'
  | 'needs_attention'
  | 'rejected';

export type VerificationCheckStatus = 'passed' | 'failed' | 'warning' | 'pending';

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  isRequired: boolean;
  acceptedFormats: string[];        // e.g. ['PDF', 'JPG', 'PNG']
  maxSizeMb: number;
  status: DocumentStatus;
  uploadedFile?: UploadedFile;
  verificationResult?: VerificationResult;
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
