/**
 * LoadingButton component
 *
 * A button with integrated loading state, disabled state, and spinner.
 * Used for the primary form submit action.
 */


import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButton({
  isLoading = false,
  loadingText = 'Processing...',
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        'relative inline-flex w-full items-center justify-center gap-2',
        'rounded-md px-4 py-2.5 text-sm font-semibold text-white',
        'bg-blue-700 shadow-sm',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        isDisabled
          ? 'cursor-not-allowed opacity-50'
          : 'hover:bg-blue-800 active:bg-blue-900',
        className
      )}
      {...props}
    >
      {isLoading && (
        <Loader2
          className="size-4 animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
}
