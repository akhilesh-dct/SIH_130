/**
 * AuthLayout component
 *
 * Two-column layout for authentication pages.
 * - Left: Brand panel (dark navy, product identity, trust signals)
 * - Right: Form panel (white, focused)
 * On mobile/tablet: collapses to single column (form only, compact brand header)
 */


import type { ReactNode } from 'react';
import { Shield, Layers } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div
        className="hidden lg:flex lg:w-[440px] xl:w-[480px] flex-col justify-between p-10 xl:p-12"
        style={{ backgroundColor: '#0f2040' }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 items-center justify-center rounded-md"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Layers className="size-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-base font-semibold text-white tracking-tight leading-none">
              IndustriaConnect
            </span>
            <span className="block text-xs text-blue-300 mt-0.5 font-normal">
              Industrial Approvals Platform
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-white leading-snug">
              Streamline your industrial approvals and compliance processes.
            </h1>
            <p className="mt-4 text-sm text-blue-200 leading-relaxed">
              A unified platform connecting businesses, regulatory bodies, and
              government departments to accelerate industrial growth in India.
            </p>
          </div>

          {/* Feature indicators */}
          <ul className="space-y-3" aria-label="Platform features">
            {[
              'Single-window clearance for industrial licenses',
              'Real-time application tracking and status updates',
              'Digital document verification and compliance',
              'Access to government schemes and support services',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className="mt-0.5 size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: '#3b82f6', marginTop: '7px' }}
                  aria-hidden="true"
                />
                <span className="text-sm text-blue-100 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust & Legal Footer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-blue-300 shrink-0" aria-hidden="true" />
            <span className="text-xs text-blue-300">
              Your information is protected with secure, encrypted authentication.
            </span>
          </div>
          <p className="text-xs text-blue-400">
            Government of India Initiative &nbsp;·&nbsp; SIH 2026 &nbsp;·&nbsp; Problem Statement 130
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Mobile header (visible below lg) */}
        <div
          className="lg:hidden flex items-center gap-3 px-6 py-5 border-b border-slate-200 bg-white"
        >
          <div
            className="flex size-8 items-center justify-center rounded-md"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Layers className="size-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-slate-900">
              IndustriaConnect
            </span>
            <span className="block text-xs text-slate-500 font-normal">
              Industrial Approvals Platform
            </span>
          </div>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            © 2026 IndustriaConnect &nbsp;·&nbsp;
            <a
              href="/privacy"
              className="hover:text-slate-600 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </a>
            &nbsp;·&nbsp;
            <a
              href="/terms"
              className="hover:text-slate-600 underline-offset-2 hover:underline"
            >
              Terms of Use
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
