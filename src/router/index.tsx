/**
 * Router Configuration
 *
 * All application routes are declared here. Adding new modules (Task 2, Task 3)
 * requires only adding entries here — no restructuring of App.tsx.
 *
 * Route structure:
 *   /                   → redirect to /login
 *   /login              → LoginPage
 *   /register           → RegisterPage (Task 2)
 *   /forgot-password    → ForgotPasswordPage (Task 2)
 *   /dashboard          → DashboardPage (Task 3) — protected
 *   /documents          → DocumentsPage (Task 2) — protected
 *   /applications       → ApplicationsPage — protected
 *   /profile            → ProfilePage — protected
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
// Placeholder for unimplemented pages
// ---------------------------------------------------------------------------

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          This page will be implemented in an upcoming task.
        </p>
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
    element: <PlaceholderPage title="Business Registration — Coming Soon" />,
  },
  {
    path: '/forgot-password',
    element: <PlaceholderPage title="Password Reset — Coming Soon" />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/documents',
        element: <PlaceholderPage title="Document Verification — Task 2" />,
      },
      {
        path: '/applications',
        element: <PlaceholderPage title="Application Management — Task 3" />,
      },
      {
        path: '/profile',
        element: <PlaceholderPage title="Profile & Settings — Coming Soon" />,
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
