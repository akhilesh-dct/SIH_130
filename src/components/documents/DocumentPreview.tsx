/**
 * DocumentPreview component
 *
 * Renders a safe, visually accurate mock document preview.
 * Does NOT display actual personal/government documents.
 * Shows a realistic-looking placeholder that represents the document type.
 */

import { FileText, Lock, Download, RefreshCw, Trash2 } from 'lucide-react';
import type { Document } from '@/types/document.types';
import { VerificationStatus } from './VerificationStatus';
import { cn } from '@/lib/utils';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const CATEGORY_MOCK: Record<
  string,
  { header: string; fields: { label: string; value: string }[] }
> = {
  corporate: {
    header: 'CERTIFICATE OF INCORPORATION',
    fields: [
      { label: 'Company Name', value: 'Kumar Industries Private Limited' },
      { label: 'CIN', value: 'U27100MH2020PTC123456' },
      { label: 'Date of Incorporation', value: '15th March 2020' },
      { label: 'Registered Office State', value: 'Maharashtra' },
      { label: 'Type of Company', value: 'Private Limited' },
    ],
  },
  tax: {
    header: 'GST REGISTRATION CERTIFICATE',
    fields: [
      { label: 'Legal Name', value: 'Kumar Industries Private Limited' },
      { label: 'GSTIN', value: '27AABCK1234F1ZX' },
      { label: 'Type of Registration', value: 'Regular' },
      { label: 'Effective Date', value: '01st April 2021' },
      { label: 'State', value: 'Maharashtra' },
    ],
  },
  factory: {
    header: 'FACTORY LICENSE',
    fields: [
      { label: 'License No.', value: 'MH/2021/FAC/001234' },
      { label: 'Factory Name', value: 'Kumar Industries — Unit I' },
      { label: 'Factory Address', value: 'Plot No. 45, MIDC Pune, Maharashtra' },
      { label: 'Valid From', value: '01st January 2024' },
      { label: 'Valid Until', value: '31st December 2026' },
    ],
  },
  environment: {
    header: 'CONSENT TO OPERATE',
    fields: [
      { label: 'Order No.', value: 'MPCB/CTO/2024/0987' },
      { label: 'Applicant Name', value: 'Kumar Industries Private Limited' },
      { label: 'Industry Category', value: 'Orange' },
      { label: 'Valid From', value: '01st April 2024' },
      { label: 'Valid Until', value: '31st March 2027' },
    ],
  },
  financial: {
    header: 'DETAILED PROJECT REPORT',
    fields: [
      { label: 'Project Name', value: 'Expansion of Manufacturing Capacity' },
      { label: 'Project Cost', value: '₹ 12,50,00,000' },
      { label: 'Location', value: 'MIDC Pune, Maharashtra' },
      { label: 'Industry Sector', value: 'Metal Fabrication' },
      { label: 'Employment', value: '150 Direct, 300 Indirect' },
    ],
  },
  identity: {
    header: 'ADDRESS PROOF',
    fields: [
      { label: 'Document Type', value: 'Utility Bill — Electricity' },
      { label: 'Account Name', value: 'Kumar Industries Pvt. Ltd.' },
      { label: 'Address', value: 'Plot 45, MIDC Pune, Maharashtra — 411019' },
      { label: 'Bill Date', value: '01st August 2026' },
      { label: 'Issued By', value: 'Maharashtra State Electricity Board' },
    ],
  },
  land: {
    header: 'PROPERTY DOCUMENT',
    fields: [
      { label: 'Document Type', value: 'Sale Deed' },
      { label: 'Property No.', value: 'MH/PUNE/2022/0045' },
      { label: 'Location', value: 'Plot 45, MIDC Pune' },
      { label: 'Area', value: '2,500 sq. metres' },
      { label: 'Registration Date', value: '10th January 2022' },
    ],
  },
};

interface DocumentPreviewProps {
  document: Document;
  onDownload?: (doc: Document) => void;
  onReplace?: (docId: string) => void;
  onDelete?: (docId: string) => void;
}

export function DocumentPreview({ document: doc, onDownload, onReplace, onDelete }: DocumentPreviewProps) {
  if (doc.status === 'not_uploaded') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-4 text-center p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <FileText className="size-6 text-slate-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">No file uploaded</p>
          <p className="mt-1 text-xs text-slate-400 max-w-[200px]">
            Upload a document to see the preview here.
          </p>
        </div>
      </div>
    );
  }

  const mock = CATEGORY_MOCK[doc.category] ?? CATEGORY_MOCK.corporate;

  return (
    <div className="flex flex-col h-full min-h-[360px]">
      {/* Preview label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200">
        <Lock className="size-3 text-slate-400" aria-hidden="true" />
        <span className="text-xs text-slate-500">Document preview — mock representation</span>
      </div>

      {/* Document mock */}
      <div
        className="flex-1 overflow-auto bg-white p-6"
        aria-label="Document preview"
      >
        {/* Watermark header */}
        <div className="border border-slate-300 rounded p-6 space-y-5 font-mono text-xs">
          {/* Document header */}
          <div className="text-center border-b border-slate-200 pb-4">
            <p className="text-xs text-slate-400 mb-1">Government of India</p>
            <p className="text-sm font-bold text-slate-800 tracking-wide">{mock.header}</p>
            <div
              className="mt-2 mx-auto h-0.5 w-12 rounded"
              style={{ backgroundColor: '#2563eb' }}
              aria-hidden="true"
            />
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {mock.fields.map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[140px_1fr] gap-2">
                <span className="text-slate-500 leading-relaxed">{label}:</span>
                <span
                  className={cn(
                    'font-semibold leading-relaxed',
                    doc.status === 'needs_attention' && label === 'Address'
                      ? 'text-red-600'
                      : 'text-slate-800'
                  )}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
            <div>
              <p className="text-slate-400">Authorised Signatory</p>
              <p className="mt-4 text-slate-300 italic text-xs">[Signature]</p>
            </div>
            {doc.uploadedFile && (
              <p className="text-slate-400 text-right">
                Uploaded: {formatDate(doc.uploadedFile.uploadedAt)}
              </p>
            )}
          </div>
        </div>

        {/* File info bar and Actions */}
        {doc.uploadedFile && (
          <div className="mt-4 border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <FileText className="size-4 text-slate-500" aria-hidden="true" />
                <span className="truncate max-w-[200px]">{doc.uploadedFile.fileName}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{(doc.uploadedFile.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                <span>•</span>
                <span className="uppercase">{doc.uploadedFile.fileType.split('/')[1] || 'PDF'}</span>
                <span>•</span>
                <span>{formatDate(doc.uploadedFile.uploadedAt)}</span>
              </div>
              <div className="mt-1">
                <VerificationStatus status={doc.status} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  <Download className="size-4" />
                  Download
                </button>
              )}
              {onReplace && (
                <button
                  onClick={() => onReplace(doc.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="size-4" />
                  Replace
                </button>
              )}
              {onDelete && doc.status !== 'verified' && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
