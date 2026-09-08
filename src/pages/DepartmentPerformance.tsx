import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { DepartmentPerformance as DeptPerfType } from '@/types/government.types';
import { Building2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DepartmentPerformance() {
  const [performance, setPerformance] = useState<DeptPerfType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await governmentService.getDepartmentPerformance();
        setPerformance(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppLayout
      pageTitle="Department Analytics"
      pageDescription="Monitor SLA compliance and identify bottlenecks across all departments."
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Departments' }]}
    >
      <div className="space-y-6 max-w-7xl">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performance.map((dept) => (
              <div key={dept.departmentId} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-slate-200 px-5 py-4 bg-slate-50 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="size-5 text-blue-600" />
                    {dept.departmentName}
                  </h2>
                  <span className="text-sm font-medium text-slate-500">{dept.totalApplications} total applications</span>
                </div>
                
                <div className="p-5 flex-1 space-y-6">
                  
                  {/* Compliance KPI */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-slate-700">SLA Compliance</span>
                      <span className={cn(
                        "text-lg font-bold",
                        dept.slaCompliancePercentage >= 90 ? "text-green-600" :
                        dept.slaCompliancePercentage >= 75 ? "text-amber-500" : "text-red-600"
                      )}>{dept.slaCompliancePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={cn(
                          "h-3 rounded-full transition-all",
                          dept.slaCompliancePercentage >= 90 ? "bg-green-500" :
                          dept.slaCompliancePercentage >= 75 ? "bg-amber-400" : "bg-red-500"
                        )} 
                        style={{ width: `${dept.slaCompliancePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center">
                      <Clock className="size-5 mx-auto text-slate-400 mb-1" />
                      <p className="text-xs text-slate-500 mb-0.5">Avg Processing</p>
                      <p className="text-lg font-bold text-slate-900">{dept.averageProcessingDays} <span className="text-xs font-normal text-slate-500">days</span></p>
                    </div>
                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 text-center">
                      <AlertTriangle className="size-5 mx-auto text-red-400 mb-1" />
                      <p className="text-xs text-red-700 mb-0.5">Overdue</p>
                      <p className="text-lg font-bold text-red-700">{dept.overdueCount}</p>
                    </div>
                    <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3 text-center">
                      <CheckCircle2 className="size-5 mx-auto text-amber-500 mb-1" />
                      <p className="text-xs text-amber-700 mb-0.5">At Risk</p>
                      <p className="text-lg font-bold text-amber-700">{dept.atRiskCount}</p>
                    </div>
                  </div>

                  {/* Bottlenecks */}
                  {Object.keys(dept.bottlenecks).length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Top Delay Reasons</p>
                      <div className="space-y-2">
                        {Object.entries(dept.bottlenecks)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([reason, count]) => (
                            <div key={reason} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 truncate mr-4">{reason.replace(/_/g, ' ')}</span>
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                {count} incidents
                              </span>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {performance.length === 0 && (
              <div className="lg:col-span-2 text-center py-12 text-slate-500">
                No department data available.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
