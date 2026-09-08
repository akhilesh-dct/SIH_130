import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { GovernmentApplication, DepartmentPerformance } from '@/types/government.types';
import { AlertCircle, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function GovernmentDashboard() {
  const [kpis, setKpis] = useState<{
    totalApplications: number;
    pendingReview: number;
    atRisk: number;
    overdue: number;
    approved: number;
  } | null>(null);

  const [attentionApps, setAttentionApps] = useState<GovernmentApplication[]>([]);
  const [deptPerformance, setDeptPerformance] = useState<DepartmentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiData, appsData, perfData] = await Promise.all([
          governmentService.getDashboardKPIs(),
          governmentService.getApplicationsRequiringAttention(),
          governmentService.getDepartmentPerformance(),
        ]);
        setKpis(kpiData);
        setAttentionApps(appsData);
        setDeptPerformance(perfData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppLayout
      pageTitle="Operations Dashboard"
      pageDescription="Overview of department application processing and SLA compliance."
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Dashboard' }]}
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : (
        <div className="space-y-6 max-w-7xl">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Applications</p>
                  <p className="text-2xl font-bold text-slate-900">{kpis?.totalApplications || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900">{kpis?.pendingReview || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/30 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Overdue (SLA Breach)</p>
                  <p className="text-2xl font-bold text-red-600">{kpis?.overdue || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved</p>
                  <p className="text-2xl font-bold text-slate-900">{kpis?.approved || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Needs Attention Table */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="border-b border-slate-200 px-5 py-4 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-amber-500" />
                  Requires Immediate Attention
                </h2>
                <Link to="/government/applications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-medium">Application</th>
                      <th className="px-5 py-3 font-medium">Business</th>
                      <th className="px-5 py-3 font-medium">Risk Score</th>
                      <th className="px-5 py-3 font-medium">SLA Status</th>
                      <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attentionApps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                          No applications currently require immediate attention.
                        </td>
                      </tr>
                    ) : (
                      attentionApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-slate-900 truncate max-w-[200px]">{app.name}</p>
                            <p className="text-xs text-slate-500">{app.id}</p>
                          </td>
                          <td className="px-5 py-3 truncate max-w-[150px]">{app.businessName}</td>
                          <td className="px-5 py-3">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                              app.riskLevel === 'CRITICAL' ? "bg-red-50 text-red-700 border-red-200" :
                              app.riskLevel === 'HIGH' ? "bg-amber-50 text-amber-700 border-amber-200" :
                              app.riskLevel === 'MEDIUM' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-green-50 text-green-700 border-green-200"
                            )}>
                              {app.riskScore} - {app.riskLevel}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                              app.slaStatus === 'OVERDUE' ? "bg-red-100 text-red-800" :
                              app.slaStatus === 'CRITICAL' ? "bg-amber-100 text-amber-800" :
                              app.slaStatus === 'AT_RISK' ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            )}>
                              {app.slaStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              to={`/government/applications/${app.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department Performance */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-900">Department SLA Compliance</h2>
              </div>
              <div className="flex-1 p-5 space-y-6">
                {deptPerformance.map((dept) => (
                  <div key={dept.departmentId}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-slate-800">{dept.departmentName}</span>
                      <span className="text-sm font-semibold text-slate-900">{dept.slaCompliancePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={cn(
                          "h-2.5 rounded-full",
                          dept.slaCompliancePercentage < 70 ? "bg-red-500" :
                          dept.slaCompliancePercentage < 90 ? "bg-amber-500" : "bg-green-500"
                        )} 
                        style={{ width: `${dept.slaCompliancePercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                      <span>{dept.overdueCount} Overdue</span>
                      <span>Avg: {dept.averageProcessingDays} days</span>
                    </div>
                  </div>
                ))}
                
                {deptPerformance.length === 0 && (
                   <p className="text-sm text-slate-500 text-center py-4">No department data available.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </AppLayout>
  );
}
