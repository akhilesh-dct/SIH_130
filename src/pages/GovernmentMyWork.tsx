import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { GovernmentApplication } from '@/types/government.types';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { complianceService } from '@/services/compliance.service';
import type { ComplianceObligation } from '@/types/compliance.types';
import { ComplianceStatusBadge } from '@/components/compliance/ComplianceStatusBadge';


export function GovernmentMyWork() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<GovernmentApplication[]>([]);
  const [compliances, setCompliances] = useState<ComplianceObligation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user) {
        setLoading(true);
        try {
          const [data, complianceData] = await Promise.all([
            governmentService.getMyWork(user.id),
            complianceService.getPendingSubmissions()
          ]);
          setApplications(data);
          setCompliances(complianceData);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user]);

  const activeApps = applications.filter(a => !['approved', 'rejected', 'withdrawn'].includes(a.status));

  const handleApproveCompliance = async (id: string) => {
    if (!user) return;
    await complianceService.markCompliant('mock-business-123', id, user.name);
    const updated = await complianceService.getPendingSubmissions();
    setCompliances(updated);
  };

  return (
    <AppLayout
      pageTitle="My Work"
      pageDescription={`Welcome back, ${user?.name}. Here are the applications assigned to you.`}
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'My Work' }]}
    >
      <div className="space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Applications</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{activeApps.length}</p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="size-6" />
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Overdue SLA</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {activeApps.filter(a => a.slaStatus === 'OVERDUE').length}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle className="size-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 bg-slate-50">
            <h2 className="text-base font-semibold text-slate-900">Active Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 font-medium">Application details</th>
                  <th className="px-5 py-4 font-medium">Risk & SLA</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      Loading your work...
                    </td>
                  </tr>
                ) : activeApps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      You have no active applications assigned.
                    </td>
                  </tr>
                ) : (
                  activeApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 mb-0.5">{app.name}</p>
                        <p className="text-xs text-slate-500 mb-1">ID: {app.id}</p>
                        <p className="text-xs font-medium text-slate-700">{app.businessName}</p>
                      </td>
                      <td className="px-5 py-4 space-y-1.5">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                          app.riskLevel === 'CRITICAL' ? "bg-red-50 text-red-700 border-red-200" :
                          app.riskLevel === 'HIGH' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          app.riskLevel === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-green-50 text-green-700 border-green-200"
                        )}>
                          Risk: {app.riskScore}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {app.slaStatus === 'OVERDUE' && <AlertTriangle className="size-3 text-red-500" />}
                          <span className={cn(
                            "text-xs font-medium",
                            app.slaStatus === 'OVERDUE' ? "text-red-600" :
                            app.slaStatus === 'CRITICAL' ? "text-amber-600" :
                            app.slaStatus === 'AT_RISK' ? "text-yellow-600" :
                            "text-green-600"
                          )}>
                            SLA: {app.slaStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/government/applications/${app.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                        >
                          Process
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Submissions Section */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 bg-slate-50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-900">Pending Compliance Submissions</h2>
            <span className="text-xs font-medium text-slate-500">{compliances.length} pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 font-medium">Compliance Details</th>
                  <th className="px-5 py-4 font-medium">Authority & Category</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      Loading submissions...
                    </td>
                  </tr>
                ) : compliances.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      No pending compliance submissions.
                    </td>
                  </tr>
                ) : (
                  compliances.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 mb-0.5">{comp.name}</p>
                        <p className="text-xs text-slate-500 mb-1">Due: {new Date(comp.dueDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{comp.authorityName}</p>
                        <p className="text-xs text-slate-500">{comp.category}</p>
                      </td>
                      <td className="px-5 py-4">
                        <ComplianceStatusBadge status={comp.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveCompliance(comp.id)}
                            className="inline-flex items-center justify-center rounded-md bg-green-50 border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-all"
                          >
                            <CheckCircle2 className="size-4 mr-1.5" />
                            Mark Compliant
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
