/**
 * FormField component
 *
 * Wraps a label + input + error message with consistent layout and spacing.
 * Supports required indicator and optional helper text.
 */


import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  error,
  required = false,
  helperText,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 select-none"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
      <ErrorMessage message={error} />
    </div>
  );
}
