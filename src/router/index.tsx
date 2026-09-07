/**
 * Router Configuration
 *
 * All application routes are declared here.
 *
 * Route structure:
 *   /                        → redirect to /login
 *   /login                   → LoginPage (public)
 *   /register                → placeholder (public)
 *   /forgot-password         → placeholder (public)
 *   /dashboard               → DashboardPage (protected) — Task 3
 *   /applications            → ApplicationsPage (protected) — Task 3
 *   /applications/:id        → ApplicationDetailPage (protected) — Task 3
 *   /documents               → DocumentsPage (protected) — Task 2
 *   /documents/:documentId   → DocumentsPage (protected) — Task 2
 *   /approvals               → placeholder (protected)
 *   /compliance              → placeholder (protected)
 *   /schemes                 → placeholder (protected)
 *   /profile                 → placeholder (protected)
 */

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { AppLayout } from '@/components/layout/AppLayout';

// ---------------------------------------------------------------------------
// Protected Route Guard
// ---------------------------------------------------------------------------

function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// ---------------------------------------------------------------------------
// Placeholder page — uses AppLayout for navigational consistency
// ---------------------------------------------------------------------------

function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <AppLayout
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: title }]}
      pageTitle={title}
      pageDescription={description}
    >
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-10 py-12 max-w-sm">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-xs text-slate-400">
            This section will be implemented in a future task.
          </p>
          <a
            href="/dashboard"
            className="mt-5 inline-block text-sm font-medium text-blue-700 hover:underline underline-offset-2"
          >
            ← Back to dashboard
          </a>
        </div>
      </div>
    </AppLayout>
  );
}

// ---------------------------------------------------------------------------
// Public placeholder (pre-auth)
// ---------------------------------------------------------------------------

function PublicPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Coming soon.</p>
        <a
          href="/login"
          className="mt-4 inline-block text-sm text-blue-700 hover:underline"
        >
          ← Back to login
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <PublicPlaceholder title="Business Registration" />,
  },
  {
    path: '/forgot-password',
    element: <PublicPlaceholder title="Password Reset" />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      // Task 3 — Dashboard
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      // Task 3 — Applications
      {
        path: '/applications',
        element: <ApplicationsPage />,
      },
      {
        path: '/applications/:applicationId',
        element: <ApplicationDetailPage />,
      },
      // Task 2 — Document verification
      {
        path: '/documents',
        element: <DocumentsPage />,
      },
      {
        path: '/documents/:documentId',
        element: <DocumentsPage />,
      },
      // Future pages — rendered inside AppLayout with nav
      {
        path: '/approvals',
        element: (
          <PlaceholderPage
            title="Approvals"
            description="Manage your industrial approval requirements."
          />
        ),
      },
      {
        path: '/compliance',
        element: (
          <PlaceholderPage
            title="Compliance"
            description="Review your statutory compliance obligations."
          />
        ),
      },
      {
        path: '/schemes',
        element: (
          <PlaceholderPage
            title="Schemes & Support"
            description="Explore central and state government support schemes."
          />
        ),
      },
      {
        path: '/profile',
        element: (
          <PlaceholderPage
            title="Profile & Settings"
            description="Manage your account and organization details."
          />
        ),
      },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
