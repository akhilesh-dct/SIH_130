/**
 * Dashboard Page — Task 3 Placeholder
 *
 * This page will be fully implemented in Task 3.
 * Now uses AppLayout (shared nav shell) established in Task 2.
 */

import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { Building2, Landmark, FileText, ArrowRight } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuthStore();
  const RoleIcon = user?.role === 'government_officer' ? Landmark : Building2;

  const quickLinks = [
    {
      label: 'Document Verification',
      description: 'Upload and verify your compliance documents.',
      href: '/documents',
      icon: FileText,
      status: 'active' as const,
    },
    {
      label: 'Application Tracker',
      description: 'Track status of your submitted applications.',
      href: '/applications',
      icon: ArrowRight,
      status: 'soon' as const,
    },
    {
      label: 'Compliance Status',
      description: 'Review your compliance obligations and deadlines.',
      href: '/applications',
      icon: ArrowRight,
      status: 'soon' as const,
    },
    {
      label: 'Government Schemes',
      description: 'Explore applicable central and state schemes.',
      href: '/applications',
      icon: ArrowRight,
      status: 'soon' as const,
    },
    {
      label: 'Inspection Schedule',
      description: 'View upcoming and past facility inspections.',
      href: '/applications',
      icon: ArrowRight,
      status: 'soon' as const,
    },
    {
      label: 'Support & Help',
      description: 'Get assistance with your applications.',
      href: '/applications',
      icon: ArrowRight,
      status: 'soon' as const,
    },
  ];

  return (
    <AppLayout
      pageTitle={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
      pageDescription={user?.organizationName}
    >
      {/* Role indicator */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <RoleIcon className="size-5" style={{ color: '#2563eb' }} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">
            {user?.role === 'government_officer' ? 'Government Officer' : 'Business User'} &nbsp;·&nbsp; {user?.organizationName}
          </p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <span className="size-1.5 rounded-full bg-green-500" aria-hidden="true" />
            Active session
          </span>
        </div>
      </div>

      {/* Module grid */}
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(({ label, description, href, icon: Icon, status }) => (
          <div key={label}>
            {status === 'active' ? (
              <Link
                to={href}
                className="group flex flex-col h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex size-9 items-center justify-center rounded-md bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon className="size-4 text-blue-600" aria-hidden="true" />
                  </div>
                  <ArrowRight className="size-4 text-slate-300 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed flex-1">{description}</p>
              </Link>
            ) : (
              <div className="flex flex-col h-full rounded-lg border border-slate-200 bg-slate-50 p-5 opacity-60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex size-9 items-center justify-center rounded-md bg-slate-100">
                    <Icon className="size-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Task 3
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed flex-1">{description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Task 3 notice */}
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Task 3 — In Progress
          </span>
        </div>
        <p className="text-sm text-amber-700">
          The full dashboard with analytics, application management, compliance tracker, and government scheme browser will be implemented in Task 3.
        </p>
      </div>
    </AppLayout>
  );
}
