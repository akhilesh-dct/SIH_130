import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, CheckSquare } from 'lucide-react';
import { useApprovalStore } from '@/store/approvalStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ApprovalCard } from '@/components/approval/ApprovalCard';

export function ApprovalsPage() {
  const { approvals, isLoading, error, fetchAll } = useApprovalStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Aggregate stats
  const stats = useMemo(() => {
    let required = approvals.length;
    let inProgress = 0;
    let approved = 0;
    let actionRequired = 0;
    let expiringSoon = 0;

    approvals.forEach((app) => {
      const status = app.application?.status || 'not_started';
      
      if (status === 'approved') approved++;
      if (status === 'submitted' || status === 'under_review' || status === 'inspection_pending') inProgress++;
      if (status === 'documents_pending' || status === 'query_raised' || status === 'renewal_required') actionRequired++;
      if (app.application?.renewal?.renewalStatus === 'expiring_soon') expiringSoon++;
    });

    return { required, inProgress, approved, actionRequired, expiringSoon };
  }, [approvals]);

  // Filter logic
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const matchesSearch = item.catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.catalog.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const status = item.application?.status || 'not_started';
      
      let matchesFilter = true;
      if (filterStatus === 'action_required') {
        matchesFilter = ['documents_pending', 'query_raised', 'renewal_required'].includes(status);
      } else if (filterStatus === 'in_progress') {
        matchesFilter = ['submitted', 'under_review', 'inspection_pending'].includes(status);
      } else if (filterStatus === 'approved') {
        matchesFilter = status === 'approved';
      } else if (filterStatus === 'expiring_soon') {
        matchesFilter = item.application?.renewal?.renewalStatus === 'expiring_soon';
      }

      return matchesSearch && matchesFilter;
    });
  }, [approvals, searchQuery, filterStatus]);

  return (
    <AppLayout
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Approvals' }]}
      pageTitle="Approvals"
      pageDescription="Track the approvals required for your business and monitor their progress."
    >
      {error && (
         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
           <p className="text-sm text-red-700">{error}</p>
         </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Required</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.required}</span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
          </div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{stats.approved}</span>
          </div>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Action Required</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-900">{stats.actionRequired}</span>
          </div>
        </div>
        <div className="col-span-2 md:col-span-4 xl:col-span-1 rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col justify-between">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Expiring Soon</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">{stats.expiringSoon}</span>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search approvals or departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-slate-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Approvals</option>
            <option value="action_required">Action Required</option>
            <option value="in_progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* ── Approval Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg border border-slate-200 bg-white" />
          ))}
        </div>
      ) : filteredApprovals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-lg border border-dashed border-slate-300 bg-white">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <CheckSquare className="size-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No approvals found</p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApprovals.map((approval) => (
            <ApprovalCard key={approval.catalog.id} approval={approval} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
