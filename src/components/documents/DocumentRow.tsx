import { Download, Eye, FileText, FileImage, File } from 'lucide-react';
import type { Document } from '@/types/document.types';
import { VerificationStatus } from './VerificationStatus';
import { cn } from '@/lib/utils';

export interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDownload?: (document: Document) => void;
}

export function DocumentRow({
  document,
  isSelected,
  onSelect,
  onDownload,
}: DocumentRowProps) {
  const fileDate = document.uploadedFile?.uploadedAt;
  const displayDate = fileDate
    ? new Date(fileDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';
    
  const updatedDate = document.updatedAt 
    ? new Date(document.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  const isUploaded = !!document.uploadedFile;
  const isImage = document.uploadedFile?.fileType.startsWith('image/');
  const isPdf = document.uploadedFile?.fileType === 'application/pdf';

  return (
    <tr 
      className={cn(
        "group cursor-pointer transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-0",
        isSelected ? "bg-blue-50/50" : "bg-white"
      )}
      onClick={() => onSelect(document.id)}
    >
      {/* Document Name */}
      <td className="px-4 py-4 min-w-[280px] w-1/3 whitespace-normal">
        <div className="flex items-start gap-3">
          <div className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border",
            isImage ? "border-purple-200 bg-purple-50 text-purple-600" :
            isPdf ? "border-red-200 bg-red-50 text-red-600" :
            isUploaded ? "border-blue-200 bg-blue-50 text-blue-600" :
            "border-slate-200 bg-slate-50 text-slate-400"
          )}>
            {isImage ? <FileImage className="size-4" /> : 
             isPdf ? <FileText className="size-4" /> : 
             <File className="size-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 line-clamp-1">{document.name}</span>
              {document.isRequired && (
                <span className="text-red-500 text-xs" title="Required">*</span>
              )}
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{document.description}</p>
          </div>
        </div>
      </td>
      
      {/* Application (using document category as a stand-in for application context) */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-sm text-slate-600 capitalize">
          {document.category}
        </span>
      </td>

      {/* Type */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex gap-1">
          {document.acceptedFormats.map((fmt) => (
            <span key={fmt} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
              {fmt}
            </span>
          ))}
        </div>
      </td>

      {/* Uploaded Date */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
        {displayDate}
      </td>

      {/* Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <VerificationStatus status={document.status} />
      </td>

      {/* Last Updated */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
        {updatedDate}
      </td>

      {/* Actions */}
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploaded && (
            <button 
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Preview"
              onClick={(e) => { e.stopPropagation(); onSelect(document.id); }}
            >
              <Eye className="size-4" />
            </button>
          )}
          {isUploaded && onDownload && (
            <button 
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              title="Download"
              onClick={(e) => { e.stopPropagation(); onDownload(document); }}
            >
              <Download className="size-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
