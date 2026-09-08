/**
 * DocumentRequirementRow — Per-scheme document status row
 *
 * Cross-references the scheme's document requirements against
 * the user's actual documents in the document store.
 * Reuses the existing document module — no new document system.
 */

import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Clock, FileText, Upload } from 'lucide-react';
import type { SchemeDocumentRequirement } from '@/types/scheme.types';
import { useDocumentStore } from '@/store/documentStore';
import { cn } from '@/lib/utils';

interface DocumentRequirementRowProps {
  requirement: SchemeDocumentRequirement;
}

export function DocumentRequirementRow({ requirement }: DocumentRequirementRowProps) {
  const { documents } = useDocumentStore();

  // Find document by category — in production this would be by doc type ID
  const doc = documents.find(d => d.category === requirement.documentCategory);

  type DocStatus = 'verified' | 'needs_attention' | 'pending' | 'missing';
  let displayStatus: DocStatus = 'missing';
  let docId: string | undefined;

  if (doc) {
    docId = doc.id;
    if (doc.status === 'verified') displayStatus = 'verified';
    else if (doc.status === 'needs_attention' || doc.status === 'rejected') displayStatus = 'needs_attention';
    else if (doc.status === 'not_uploaded') displayStatus = 'missing';
    else displayStatus = 'pending';
  }

  const iconMap = {
    verified: <CheckCircle2 className="size-4 text-emerald-600" aria-label="Verified" />,
    needs_attention: <AlertCircle className="size-4 text-amber-600" aria-label="Needs attention" />,
    pending: <Clock className="size-4 text-blue-500" aria-label="Under review" />,
    missing: <FileText className="size-4 text-slate-400" aria-label="Not uploaded" />,
  };

  const statusLabel = {
    verified: 'Verified',
    needs_attention: 'Needs Attention',
    pending: 'Under Review',
    missing: 'Not Uploaded',
  };

  const statusTextClass = {
    verified: 'text-emerald-700',
    needs_attention: 'text-amber-700',
    pending: 'text-blue-700',
    missing: 'text-slate-500',
  };

  return (
    <tr className={cn('border-b border-slate-100 last:border-0', displayStatus === 'needs_attention' && 'bg-amber-50/30')}>
      {/* Document name */}
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-slate-800">{requirement.documentName}</p>
        <p className="text-xs text-slate-500 mt-0.5">{requirement.description}</p>
      </td>

      {/* Required */}
      <td className="py-3 pr-4 text-center">
        <span className={cn('text-xs font-medium', requirement.isMandatory ? 'text-slate-700' : 'text-slate-400')}>
          {requirement.isMandatory ? 'Required' : 'Optional'}
        </span>
      </td>

      {/* Status icon */}
      <td className="py-3 pr-4 text-center">
        <div className="flex justify-center">{iconMap[displayStatus]}</div>
      </td>

      {/* Status label + action */}
      <td className="py-3 text-right">
        {displayStatus === 'missing' ? (
          <Link
            to="/documents"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline underline-offset-2"
          >
            <Upload className="size-3" />
            Upload
          </Link>
        ) : displayStatus === 'needs_attention' ? (
          <Link
            to={docId ? `/documents/${docId}` : '/documents'}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline underline-offset-2"
          >
            <AlertCircle className="size-3" />
            Fix
          </Link>
        ) : (
          <span className={cn('text-xs font-medium', statusTextClass[displayStatus])}>
            {statusLabel[displayStatus]}
          </span>
        )}
      </td>
    </tr>
  );
}
