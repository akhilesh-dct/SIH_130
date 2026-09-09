import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useComplianceStore } from '@/store/complianceStore';
import { useAuthStore } from '@/store/authStore';
import { ComplianceStatusBadge } from '@/components/compliance/ComplianceStatusBadge';
import { ComplianceActionCenter } from '@/components/compliance/ComplianceActionCenter';
import { Search, Calendar, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComplianceStatus } from '@/types/compliance.types';

export function CompliancePage() {
  const { user } = useAuthStore();
  const { obligations, summary, isLoading, fetchObligations } = useComplianceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (user?.id) {
      fetchObligations(user.id);
    }
  }, [user?.id, fetchObligations]);

  const filteredObligations = useMemo(() => {
    return obligations.filter((o) => {
      const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.authorityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [obligations, searchTerm, statusFilter]);

  return (
    <AppLayout
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Compliance' }]}
      pageTitle="Compliance Management"
      pageDescription="Monitor your regulatory obligations, deadlines, and compliance status."
      actions={
        <div className="flex gap-2">
          <Link
            to="/compliance/history"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View History
          </Link>
          <Link
            to="/compliance/calendar"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Link>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <span className="text-sm font-medium text-slate-500">Total Obligations</span>
                <span className="text-2xl font-bold text-slate-900 mt-1">{summary.totalApplicable}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1"><CheckCircle2 className="size-4 text-green-500"/> Compliant</span>
                <span className="text-2xl font-bold text-slate-900 mt-1">{summary.compliant}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1"><Calendar className="size-4 text-amber-500"/> Due Soon</span>
                <span className="text-2xl font-bold text-slate-900 mt-1">{summary.dueSoon}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col border-red-100 bg-red-50/30">
                <span className="text-sm font-medium text-red-600 flex items-center gap-1"><AlertTriangle className="size-4"/> Overdue</span>
                <span className="text-2xl font-bold text-red-700 mt-1">{summary.overdue}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col border-orange-100 bg-orange-50/30">
                <span className="text-sm font-medium text-orange-600 flex items-center gap-1"><AlertTriangle className="size-4"/> At Risk</span>
                <span className="text-2xl font-bold text-orange-700 mt-1">{summary.atRisk}</span>
              </div>
            </div>
          )}

          {/* Action Center */}
          <ComplianceActionCenter obligations={obligations} />

          {/* List Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
              <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search compliance obligations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ComplianceStatus | 'ALL')}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLIANT">Compliant</option>
                    <option value="DUE_SOON">Due Soon</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Authority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Next Due
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredObligations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                        No compliance obligations found.
                      </td>
                    </tr>
                  ) : (
                    filteredObligations.map((ob) => (
                      <tr key={ob.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{ob.name}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{ob.frequency}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">{ob.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">{ob.authorityName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "text-sm font-medium",
                            ob.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-900'
                          )}>
                            {new Date(ob.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ComplianceStatusBadge status={ob.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/compliance/${ob.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900"
                          >
                            Manage
                            <ChevronRight className="ml-1 size-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
