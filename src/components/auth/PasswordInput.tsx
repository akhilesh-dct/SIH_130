/**
 * PasswordInput component
 *
 * Input field with show/hide password toggle.
 * Accessible: toggle button labeled for screen readers.
 */

import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ hasError = false, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggle = () => setIsVisible((v) => !v);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          autoComplete="current-password"
          className={cn(
            'w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder-slate-400',
            'bg-white shadow-sm transition-form-element',
            'pr-10', // space for toggle button
            hasError
              ? 'border-red-400 ring-1 ring-red-300 focus:outline-none focus:border-red-400 focus:ring-red-300'
              : 'border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          tabIndex={0}
          className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2',
            'flex items-center justify-center',
            'rounded p-0.5 text-slate-400 hover:text-slate-600',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            'transition-colors duration-150'
          )}
        >
          {isVisible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
