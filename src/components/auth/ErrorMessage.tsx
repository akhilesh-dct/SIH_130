/**
 * ErrorMessage component
 *
 * Renders inline field-level validation errors and server-level error banners.
 * Supports two variants: 'field' (inline) and 'banner' (form-level).
 */


import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string | undefined;
  variant?: 'field' | 'banner';
  className?: string;
}

export function ErrorMessage({ message, variant = 'field', className }: ErrorMessageProps) {
  if (!message) return null;

  if (variant === 'banner') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={cn(
          'flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3',
          className
        )}
      >
        <XCircle
          className="mt-0.5 size-4 shrink-0 text-red-600"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-red-700 leading-snug">{message}</p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn('flex items-center gap-1.5 mt-1.5', className)}
    >
      <AlertCircle
        className="size-3.5 shrink-0 text-red-600"
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-red-600">{message}</span>
    </div>
  );
}
