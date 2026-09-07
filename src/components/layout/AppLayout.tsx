/**
 * AppLayout — Shared authenticated page shell
 *
 * Used by all protected pages (Documents, Dashboard, etc.).
 * Provides: top navigation bar, optional page header, main content area.
 *
 * Task 3 will extend this with a sidebar navigation.
 */

import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, LogOut, User, FileText, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageTitle?: string;
  pageDescription?: string;
  actions?: ReactNode;
}

// ---------------------------------------------------------------------------
// Navigation items — shared across all authenticated pages
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', Icon: FileText },
];

export function AppLayout({
  children,
  breadcrumbs,
  pageTitle,
  pageDescription,
  actions,
}: AppLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          {/* Wordmark */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              aria-label="IndustriaConnect — go to dashboard"
            >
              <div
                className="flex size-8 items-center justify-center rounded-md"
                style={{ backgroundColor: '#2563eb' }}
              >
                <Layers className="size-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-slate-900 hidden sm:inline">
                IndustriaConnect
              </span>
            </Link>

            {/* Nav links — visible from md+ */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1"
            >
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const isActive =
                  href === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    to={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium',
                      'transition-colors duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-slate-100">
                  <User className="size-3.5 text-slate-500" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-800 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-none truncate max-w-[140px]">
                    {user.organizationName}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className={cn(
                'flex items-center gap-1.5 rounded-md border border-slate-200 bg-white',
                'px-2.5 py-1.5 text-sm font-medium text-slate-600 shadow-sm',
                'hover:bg-slate-50 hover:text-slate-900 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              )}
              aria-label="Sign out"
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Mobile nav bar */}
        <div className="md:hidden flex items-center gap-1 border-t border-slate-100 px-4 py-2 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive =
              href === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(href);
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* ── Page Header (optional) ── */}
      {(breadcrumbs || pageTitle) && (
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-4">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-2">
                <ol className="flex items-center gap-1.5 text-xs text-slate-500">
                  {breadcrumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {i > 0 && (
                        <ChevronRight
                          className="size-3 text-slate-400"
                          aria-hidden="true"
                        />
                      )}
                      {crumb.href ? (
                        <Link
                          to={crumb.href}
                          className="hover:text-slate-700 hover:underline underline-offset-2"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-slate-700 font-medium">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                {pageTitle && (
                  <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                    {pageTitle}
                  </h1>
                )}
                {pageDescription && (
                  <p className="mt-0.5 text-sm text-slate-500">{pageDescription}</p>
                )}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 mx-auto w-full max-w-screen-xl px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="mx-auto max-w-screen-xl px-6 py-3">
          <p className="text-xs text-slate-400 text-center">
            © 2026 IndustriaConnect &nbsp;·&nbsp; SIH 2026, Problem Statement 130
          </p>
        </div>
      </footer>
    </div>
  );
}
