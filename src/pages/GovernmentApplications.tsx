import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { GovernmentApplication } from '@/types/government.types';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function GovernmentApplications() {
  const [applications, setApplications] = useState<GovernmentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await governmentService.getApplications({
          status: statusFilter,
          riskLevel: riskFilter,
          department: deptFilter,
        });
        setApplications(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [statusFilter, riskFilter, deptFilter]);

  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) || 
    app.id.toLowerCase().includes(search.toLowerCase()) ||
    app.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout
      pageTitle="Application Management"
      pageDescription="Search, filter, and review applications across your authorized departments."
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Applications' }]}
    >
      <div className="space-y-6 max-w-7xl">
        
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Application, or Business..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="size-4" />
              <span className="font-medium">Filter:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="documents_required">Documents Required</option>
              <option value="query_raised">Query Raised</option>
              <option value="inspection_scheduled">Inspection Scheduled</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Risks</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-md border border-slate-300 py-1.5 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Fire Department">Fire Department</option>
              <option value="Environment Board">Environment Board</option>
              <option value="Municipal Corporation">Municipal Corporation</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 font-medium">Application details</th>
                  <th className="px-5 py-4 font-medium">Department</th>
                  <th className="px-5 py-4 font-medium">Risk & SLA</th>
                  <th className="px-5 py-4 font-medium">Submitted</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      <div className="flex justify-center">
                        <div className="size-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 mb-0.5">{app.name}</p>
                        <p className="text-xs text-slate-500 mb-1">ID: {app.id}</p>
                        <p className="text-xs font-medium text-slate-700">{app.businessName}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-800">{app.department}</p>
                        {app.assignedOfficerName && (
                          <p className="text-xs text-slate-500 mt-1">Officer: {app.assignedOfficerName}</p>
                        )}
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
                        <div className="flex items-center gap-1.5">
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
                      <td className="px-5 py-4 text-xs">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredApps.length > 0 && (
            <div className="border-t border-slate-200 px-5 py-4 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <p>Showing {filteredApps.length} application(s)</p>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
