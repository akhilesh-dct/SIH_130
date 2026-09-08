import { Search, Filter } from 'lucide-react';
import type { DocumentStatus } from '@/types/document.types';

export interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: DocumentStatus | 'all';
  onStatusFilterChange: (status: DocumentStatus | 'all') => void;
}

const STATUS_OPTIONS: { value: DocumentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'not_uploaded', label: 'Not Uploaded' },
  { value: 'uploaded', label: 'Uploaded' },
  { value: 'validating', label: 'Validating' },
  { value: 'verifying', label: 'Verifying' },
  { value: 'verified', label: 'Verified' },
  { value: 'needs_attention', label: 'Needs Attention' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
];

export function DocumentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
      <div className="relative w-full sm:max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex w-full sm:w-auto items-center gap-2">
        <Filter className="size-4 text-slate-400 hidden sm:block" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as DocumentStatus | 'all')}
          className="block w-full sm:w-auto rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
