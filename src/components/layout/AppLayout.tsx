/**
 * AppLayout — Shared authenticated page shell (Task 3 upgrade)
 *
 * Desktop: fixed left sidebar (220px) + top bar + main content
 * Mobile: top bar with hamburger + slide-out drawer
 *
 * Used by: DashboardPage, DocumentsPage, ApplicationDetailPage, and all future pages.
 */

import { type ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  Building2,
  LogOut,
  User,
  FileText,
  LayoutDashboard,
  ChevronRight,
  Bell,
  Menu,
  X,
  FolderOpen,
  CheckSquare,
  LifeBuoy,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
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
// Navigation definition
// ---------------------------------------------------------------------------

interface NavItem {
  href: string;
  label: string;
  Icon: React.ElementType;
  exact?: boolean;
  disabled?: boolean;
  badge?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/applications', label: 'Applications', Icon: FolderOpen },
  { href: '/documents', label: 'Documents', Icon: FileText },
  { href: '/approvals', label: 'Approvals', Icon: CheckSquare, disabled: true },
  { href: '/compliance', label: 'Compliance', Icon: CheckSquare, disabled: true },
  {
  href: '/business',
  label: 'Business Details',
  Icon: Building2,
},
];

const SECONDARY_NAV: NavItem[] = [
  { href: '/schemes', label: 'Schemes & Support', Icon: LifeBuoy, disabled: true },
  { href: '/profile', label: 'Profile', Icon: User },
];

// ---------------------------------------------------------------------------
// NavLink component
// ---------------------------------------------------------------------------

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.href
    : location.pathname.startsWith(item.href);

  if (item.disabled) {
    return (
      <span
        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-400 cursor-default select-none"
        aria-disabled="true"
        title="Coming soon"
      >
        <item.Icon className="size-4 shrink-0" aria-hidden="true" />
        {item.label}
        <span className="ml-auto text-xs text-slate-300 font-medium">Soon</span>
      </span>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
        'transition-colors duration-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <item.Icon className="size-4 shrink-0" aria-hidden="true" />
      {item.label}
      {item.badge && (
        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Notification bell (header)
// ---------------------------------------------------------------------------

function NotificationBell() {
  const { notifications, markNotificationRead, markAllRead } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-notif-panel]')) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const severityDot: Record<string, string> = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  }

  return (
    <div className="relative" data-notif-panel>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread > 0 ? ` — ${unread} unread` : ''}`}
        aria-expanded={open}
        className={cn(
          'relative flex size-9 items-center justify-center rounded-md',
          'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        )}
      >
        <Bell className="size-4" aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-red-500"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 w-80 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Notifications
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                  {unread}
                </span>
              )}
            </h2>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400 text-center">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors',
                    !n.isRead && 'bg-blue-50/40'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'mt-1.5 size-1.5 shrink-0 rounded-full',
                        severityDot[n.severity]
                      )}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-semibold text-slate-800 leading-snug', !n.isRead && 'text-slate-900')}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                        {n.body}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {relativeTime(n.timestamp)}
                      </p>
                    </div>
                    {!n.isRead && (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar content (shared between desktop + mobile drawer)
// ---------------------------------------------------------------------------

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Wordmark */}
      <div className="px-4 py-4 border-b border-slate-200">
        <Link
          to="/dashboard"
          onClick={onNavClick}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          aria-label="IndustriaConnect — go to dashboard"
        >
          <div
            className="flex size-8 items-center justify-center rounded-md shrink-0"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Layers className="size-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-slate-900 leading-tight">
              IndustriaConnect
            </span>
            <span className="block text-xs text-slate-400 leading-tight">
              Industrial Approvals
            </span>
          </div>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Main navigation">
        <p className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </p>
        {PRIMARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} onClick={onNavClick} />
        ))}

        <p className="px-3 pb-2 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Account
        </p>
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} onClick={onNavClick} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-200 px-3 py-3">
        {user && (
          <div className="mb-2 flex items-center gap-2.5 px-3 py-2 rounded-md">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200">
              <User className="size-3.5 text-slate-500" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.organizationName}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
            'text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
          )}
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main layout
// ---------------------------------------------------------------------------

export function AppLayout({
  children,
  breadcrumbs,
  pageTitle,
  pageDescription,
  actions,
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer on route change
  const location = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen overflow-hidden"
        aria-label="Application sidebar"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden',
          'transition-transform duration-200',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md text-slate-400 hover:text-slate-600"
          aria-label="Close navigation"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        <SidebarContent onNavClick={() => setMobileMenuOpen(false)} />
      </div>

      {/* ── Main area (top bar + content) ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white px-4 sm:px-6 gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          {/* Breadcrumbs or page title — in topbar */}
          <div className="flex-1 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-xs text-slate-500">
                  {breadcrumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {i > 0 && (
                        <ChevronRight className="size-3 text-slate-300" aria-hidden="true" />
                      )}
                      {crumb.href ? (
                        <Link
                          to={crumb.href}
                          className="hover:text-slate-700 hover:underline underline-offset-2"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-slate-700 font-medium truncate">{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : pageTitle ? (
              <span className="text-sm font-semibold text-slate-800 truncate">{pageTitle}</span>
            ) : null}
          </div>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-1.5 shrink-0">
            <NotificationBell />
            {/* User avatar — mobile only (sidebar handles desktop) */}
            <div className="lg:hidden flex size-9 items-center justify-center rounded-md text-slate-500">
              <User className="size-4" aria-hidden="true" />
            </div>
          </div>
        </header>

        {/* Page sub-header */}
        {(pageTitle || pageDescription || actions) && (
          <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-4">
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
        )}

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-400 text-center">
            © 2026 IndustriaConnect &nbsp;·&nbsp; SIH 2026, Problem Statement 130
          </p>
        </footer>
      </div>
    </div>
  );
}
