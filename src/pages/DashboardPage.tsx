/**
 * Dashboard Page — Task 3 Placeholder
 *
 * This page will be fully implemented in Task 3.
 * It exists here to support authenticated routing and to establish
 * the route structure early.
 */


import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { Layers, LogOut, Building2, Landmark, User } from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate('/login', { replace: true });
  };

  const RoleIcon = user?.role === 'government_officer' ? Landmark : Building2;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center rounded-md"
              style={{ backgroundColor: '#2563eb' }}
            >
              <Layers className="size-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              IndustriaConnect
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Sign out"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="mx-auto max-w-lg text-center">
          <div
            className="mx-auto mb-5 flex size-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: '#eff6ff' }}
          >
            <RoleIcon className="size-7" style={{ color: '#2563eb' }} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {user?.organizationName}
          </p>

          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Under Construction
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-800">
              Dashboard — Task 3
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              The full dashboard including application management, document
              verification, compliance tracker, and government scheme browser
              will be implemented in Task 3 of this project.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                'Application Tracker',
                'Document Verification',
                'Compliance Status',
                'Government Schemes',
                'Inspection Schedule',
                'Support & Help',
              ].map((module) => (
                <div
                  key={module}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <p className="text-xs font-medium text-slate-500">{module}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Coming in Task 3</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
