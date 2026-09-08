/**
 * LoginForm component
 *
 * Handles the complete login form UX:
 * - Role selection (Business User / Government Officer)
 * - Email + Password fields with validation
 * - Show/hide password
 * - Remember me checkbox
 * - Forgot password link
 * - Server-level error banner
 * - Loading, success, and disabled states
 * - Keyboard navigation throughout
 */

import { useEffect } from 'react';
import type { ElementType } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Landmark, CheckCircle2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema, loginFormDefaults, type LoginFormValues } from '@/lib/validations';
import type { UserRole } from '@/types/auth.types';
import { cn } from '@/lib/utils';

import { FormField } from './FormField';
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from './LoadingButton';
import { ErrorMessage } from './ErrorMessage';

// ---------------------------------------------------------------------------
// Role Selector
// ---------------------------------------------------------------------------

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  const roles: { id: UserRole; label: string; Icon: ElementType }[] = [
    { id: 'business_user', label: 'Business User', Icon: Building2 },
    { id: 'officer', label: 'Government', Icon: Landmark },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Select your role"
      className="flex rounded-md border border-slate-200 bg-white p-1 gap-1"
    >
      {roles.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          disabled={disabled}
          onClick={() => onChange(id)}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded py-2 px-3 text-sm font-medium',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            disabled && 'cursor-not-allowed opacity-50',
            value === id
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoginForm
// ---------------------------------------------------------------------------

export function LoginForm() {
  const { login, isLoading, error, status, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormDefaults,
    mode: 'onTouched',
  });

  // Clear server error when user starts typing again
  const email = watch('email');
  const password = watch('password');
  useEffect(() => {
    if (error) clearError();
  }, [email, password]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: LoginFormValues) => {
    await login({
      email: data.email,
      password: data.password,
      role: data.role,
      rememberMe: data.rememberMe,
    });
  };

  const isSuccess = status === 'authenticated';

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your credentials to access the platform.
        </p>
      </div>

      {/* ── Server Error Banner ── */}
      {error && (
        <ErrorMessage
          message={error.message}
          variant="banner"
        />
      )}

      {/* ── Success State ── */}
      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3"
        >
          <CheckCircle2 className="size-4 shrink-0 text-green-600" aria-hidden="true" />
          <p className="text-sm font-medium text-green-700">
            Authenticated successfully. Redirecting…
          </p>
        </div>
      )}

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Login form"
        className="space-y-5"
      >
        {/* Role Selector */}
        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-slate-700 select-none">
            I am a
          </span>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelector
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading || isSuccess}
              />
            )}
          />
        </div>

        {/* Email Field */}
        <FormField
          id="login-email"
          label="Email address"
          required
          error={errors.email?.message}
        >
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            placeholder="you@company.com"
            disabled={isLoading || isSuccess}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder-slate-400',
              'bg-white shadow-sm transition-form-element',
              'focus:outline-none focus:ring-1',
              errors.email
                ? 'border-red-400 ring-red-300 focus:border-red-400 focus:ring-red-300'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
            )}
            {...register('email')}
          />
        </FormField>

        {/* Password Field */}
        <FormField
          id="login-password"
          label="Password"
          required
          error={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                id="login-password"
                hasError={!!errors.password}
                disabled={isLoading || isSuccess}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                placeholder="Enter your password"
                {...field}
              />
            )}
          />
        </FormField>

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              id="login-remember-me"
              type="checkbox"
              disabled={isLoading || isSuccess}
              className={cn(
                'size-4 rounded border-slate-300 text-blue-600',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                'accent-blue-700'
              )}
              {...register('rememberMe')}
            />
            <span className="text-sm text-slate-600">Keep me signed in</span>
          </label>

          <Link
            to="/forgot-password"
            className={cn(
              'text-sm font-medium text-blue-700 hover:text-blue-800',
              'underline-offset-4 hover:underline',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
            )}
            tabIndex={isLoading ? -1 : 0}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <LoadingButton
          isLoading={isLoading}
          loadingText="Signing in…"
          disabled={!isDirty || !isValid || isSuccess}
        >
          <LogIn className="size-4" aria-hidden="true" />
          Sign in
        </LoadingButton>
      </form>

      {/* ── Registration CTA ── */}
      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className={cn(
            'font-medium text-blue-700 hover:text-blue-800',
            'underline-offset-4 hover:underline',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded'
          )}
        >
          Register your business
        </Link>
      </p>

      {/* ── Security Notice ── */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <svg
          className="size-3.5 text-slate-400 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 1L2 4v4c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 8l2 2 3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs text-slate-400">
          Your information is protected with secure authentication.
        </span>
      </div>
    </div>
  );
}
