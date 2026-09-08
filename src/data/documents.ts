/**
 * Mock document data — SIH 130 Industrial Platform
 *
 * Structured to be a direct replacement for an API response.
 * When connecting to FastAPI, replace this with GET /api/v1/documents.
 *
 * All personal/business information is synthetic — no real entity data.
 */

import type {
  Document,
  VerificationCheck,
  VerificationIssue,
} from '@/types/document.types';

// ---------------------------------------------------------------------------
// Reusable check templates
// ---------------------------------------------------------------------------

const passedChecks: VerificationCheck[] = [
  {
    id: 'fmt',
    label: 'Document format',
    description: 'File type and structure conforms to accepted standards.',
    status: 'passed',
  },
  {
    id: 'fields',
    label: 'Required fields',
    description: 'All mandatory fields are present and populated.',
    status: 'passed',
  },
  {
    id: 'legibility',
    label: 'Document legibility',
    description: 'Content is clear and machine-readable.',
    status: 'passed',
  },
  {
    id: 'consistency',
    label: 'Information consistency',
    description: 'Details match across submitted application data.',
    status: 'passed',
  },
  {
    id: 'expiry',
    label: 'Validity period',
    description: 'Document is within its stated validity period.',
    status: 'passed',
  },
];

const attentionChecks: VerificationCheck[] = [
  {
    id: 'fmt',
    label: 'Document format',
    description: 'File type and structure conforms to accepted standards.',
    status: 'passed',
  },
  {
    id: 'fields',
    label: 'Required fields',
    description: 'All mandatory fields are present and populated.',
    status: 'passed',
  },
  {
    id: 'legibility',
    label: 'Document legibility',
    description: 'Content is clear and machine-readable.',
    status: 'passed',
  },
  {
    id: 'consistency',
    label: 'Information consistency',
    description: 'Business address does not match application data.',
    status: 'failed',
  },
  {
    id: 'expiry',
    label: 'Validity period',
    description: 'Document is within its stated validity period.',
    status: 'passed',
  },
];

const attentionIssue: VerificationIssue = {
  id: 'iss_001',
  severity: 'error',
  code: 'ADDRESS_MISMATCH',
  title: 'Address inconsistency detected',
  description:
    'The business address on this document does not match the address provided in the primary application form.',
  suggestedAction:
    'Upload a document with the correct registered address, or update the application form to reflect the address on this certificate.',
};

// ---------------------------------------------------------------------------
// Mock document list
// ---------------------------------------------------------------------------

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_01',
    applicationId: 'app_01',
    name: 'Certificate of Incorporation',
    category: 'corporate',
    description:
      'Official certificate issued by the Registrar of Companies (RoC) confirming company registration under the Companies Act.',
    isRequired: true,
    acceptedFormats: ['PDF'],
    maxSizeMb: 5,
    status: 'verified',
    version: 1,
    updatedAt: '2026-09-04T10:45:00Z',
    uploadedFile: {
      id: 'upl_01',
      fileName: 'certificate_of_incorporation.pdf',
      fileSizeBytes: 1_245_184,
      fileType: 'application/pdf',
      uploadedAt: '2026-09-04T10:22:00Z',
      uploadedBy: 'usr_01',
    },
    verificationResult: {
      documentId: 'doc_01',
      verifiedAt: '2026-09-04T10:45:00Z',
      overallStatus: 'verified',
      checks: passedChecks,
      issues: [],
    },
  },
  {
    id: 'doc_02',
    applicationId: 'app_01',
    name: 'PAN Card (Organization)',
    category: 'tax',
    description:
      'Permanent Account Number card issued by the Income Tax Department to the registered organization.',
    isRequired: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 2,
    status: 'verified',
    version: 1,
    updatedAt: '2026-09-04T10:47:00Z',
    uploadedFile: {
      id: 'upl_02',
      fileName: 'organization_pan.pdf',
      fileSizeBytes: 382_976,
      fileType: 'application/pdf',
      uploadedAt: '2026-09-04T10:25:00Z',
      uploadedBy: 'usr_01',
    },
    verificationResult: {
      documentId: 'doc_02',
      verifiedAt: '2026-09-04T10:47:00Z',
      overallStatus: 'verified',
      checks: passedChecks,
      issues: [],
    },
  },
  {
    id: 'doc_03',
    applicationId: 'app_01',
    name: 'GST Registration Certificate',
    category: 'tax',
    description:
      'Certificate of GST registration issued by the Goods and Services Tax Network (GSTN), containing the GSTIN number.',
    isRequired: true,
    acceptedFormats: ['PDF'],
    maxSizeMb: 5,
    status: 'needs_attention',
    version: 1,
    updatedAt: '2026-09-04T11:00:00Z',
    uploadedFile: {
      id: 'upl_03',
      fileName: 'gst_registration_certificate.pdf',
      fileSizeBytes: 892_416,
      fileType: 'application/pdf',
      uploadedAt: '2026-09-04T10:30:00Z',
      uploadedBy: 'usr_01',
    },
    verificationResult: {
      documentId: 'doc_03',
      verifiedAt: '2026-09-04T11:00:00Z',
      overallStatus: 'needs_attention',
      checks: attentionChecks,
      issues: [attentionIssue],
    },
  },
  {
    id: 'doc_04',
    applicationId: 'app_01',
    name: 'Factory License',
    category: 'factory',
    description:
      'License issued under the Factories Act, 1948, permitting operation of the manufacturing facility.',
    isRequired: true,
    acceptedFormats: ['PDF'],
    maxSizeMb: 10,
    status: 'verified',
    version: 2,
    updatedAt: '2026-09-05T09:35:00Z',
    uploadedFile: {
      id: 'upl_04',
      fileName: 'factory_license_2026.pdf',
      fileSizeBytes: 2_097_152,
      fileType: 'application/pdf',
      uploadedAt: '2026-09-05T09:10:00Z',
      uploadedBy: 'usr_01',
    },
    verificationResult: {
      documentId: 'doc_04',
      verifiedAt: '2026-09-05T09:35:00Z',
      overallStatus: 'verified',
      checks: passedChecks,
      issues: [],
    },
  },
  {
    id: 'doc_05',
    applicationId: 'app_01',
    name: 'Environmental Consent Order',
    category: 'environment',
    description:
      'Consent to Establish / Consent to Operate issued by the State Pollution Control Board under the Environment Protection Act.',
    isRequired: true,
    acceptedFormats: ['PDF'],
    maxSizeMb: 10,
    status: 'uploaded',
    version: 1,
    updatedAt: '2026-09-06T14:00:00Z',
    uploadedFile: {
      id: 'upl_05',
      fileName: 'environmental_consent_order.pdf',
      fileSizeBytes: 3_145_728,
      fileType: 'application/pdf',
      uploadedAt: '2026-09-06T14:00:00Z',
      uploadedBy: 'usr_01',
    },
  },
  {
    id: 'doc_06',
    applicationId: 'app_01',
    name: 'Project Report / DPR',
    category: 'financial',
    description:
      'Detailed Project Report outlining the proposed industrial project, investment details, technology, and projected outputs.',
    isRequired: false,
    acceptedFormats: ['PDF'],
    maxSizeMb: 20,
    status: 'not_uploaded',
    version: 0,
  },
  {
    id: 'doc_07',
    applicationId: 'app_01',
    name: 'Address Proof (Registered Office)',
    category: 'identity',
    description:
      'Valid proof of the registered office address — utility bill, property tax receipt, or lease agreement (not older than 3 months).',
    isRequired: true,
    acceptedFormats: ['PDF', 'JPG', 'PNG'],
    maxSizeMb: 5,
    status: 'not_uploaded',
    version: 0,
  },
];

export const MOCK_DOCUMENT_VERSIONS = [
  {
    id: 'ver_01',
    documentId: 'doc_04',
    version: 1,
    fileName: 'factory_license_old.pdf',
    fileSizeBytes: 1_500_000,
    fileType: 'application/pdf',
    uploadedAt: '2025-08-10T09:00:00Z',
    uploadedBy: 'usr_01',
    status: 'expired',
  },
  {
    id: 'ver_02',
    documentId: 'doc_04',
    version: 2,
    fileName: 'factory_license_2026.pdf',
    fileSizeBytes: 2_097_152,
    fileType: 'application/pdf',
    uploadedAt: '2026-09-05T09:10:00Z',
    uploadedBy: 'usr_01',
    status: 'verified',
  }
];

export const MOCK_DOCUMENT_HISTORY = [
  {
    id: 'hist_01',
    documentId: 'doc_04',
    action: 'UPLOAD',
    performedBy: 'usr_01',
    timestamp: '2025-08-10T09:00:00Z',
  },
  {
    id: 'hist_02',
    documentId: 'doc_04',
    action: 'VERIFICATION_REQUESTED',
    performedBy: 'usr_01',
    timestamp: '2025-08-10T09:05:00Z',
  },
  {
    id: 'hist_03',
    documentId: 'doc_04',
    action: 'VERIFIED',
    performedBy: 'sys_auto',
    timestamp: '2025-08-10T10:00:00Z',
  },
  {
    id: 'hist_04',
    documentId: 'doc_04',
    action: 'REPLACE',
    performedBy: 'usr_01',
    timestamp: '2026-09-05T09:10:00Z',
  },
  {
    id: 'hist_05',
    documentId: 'doc_04',
    action: 'VERIFICATION_REQUESTED',
    performedBy: 'usr_01',
    timestamp: '2026-09-05T09:15:00Z',
  },
  {
    id: 'hist_06',
    documentId: 'doc_04',
    action: 'VERIFIED',
    performedBy: 'sys_auto',
    timestamp: '2026-09-05T09:35:00Z',
  }
];
