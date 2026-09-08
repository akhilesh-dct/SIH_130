import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { AuditLog } from '@/types/government.types';
import { Search, ShieldCheck, User, Activity, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await governmentService.getAuditLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(search.toLowerCase()) || 
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    if (action.includes('DOCUMENT')) return <FileText className="size-4 text-blue-500" />;
    if (action.includes('LOGIN')) return <User className="size-4 text-emerald-500" />;
    if (action.includes('STATUS') || action.includes('ESCALATED')) return <Activity className="size-4 text-amber-500" />;
    return <ShieldCheck className="size-4 text-slate-500" />;
  };

  return (
    <AppLayout
      pageTitle="System Audit Logs"
      pageDescription="Immutable record of all actions performed within the Government Operations Module."
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Audit Logs' }]}
    >
      <div className="space-y-6 max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          
          <div className="border-b border-slate-200 px-5 py-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="size-5 text-slate-600" />
              Activity Stream
            </h2>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-slate-300 pl-9 pr-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-medium w-48">Timestamp</th>
                  <th className="px-5 py-3 font-medium w-48">User</th>
                  <th className="px-5 py-3 font-medium w-48">Action Event</th>
                  <th className="px-5 py-3 font-medium">Detailed Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                      No logs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono text-[13px]">
                      <td className="px-5 py-3 whitespace-nowrap text-slate-500">
                        {new Date(log.timestamp).toLocaleString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', second: '2-digit',
                          hour12: false
                        })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 font-sans text-sm">{log.userName}</span>
                          <span className="text-[11px] text-slate-400">{log.userId}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className={cn(
                            "inline-flex rounded px-2 py-0.5 text-[10px] font-bold tracking-wide border",
                            log.action.includes('LOGIN') ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            log.action.includes('STATUS') ? "bg-amber-50 text-amber-700 border-amber-200" :
                            log.action.includes('QUERY') ? "bg-purple-50 text-purple-700 border-purple-200" :
                            log.action.includes('ASSIGNED') ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                            "bg-slate-100 text-slate-700 border-slate-200"
                          )}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-sans text-sm text-slate-700">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-slate-200 px-5 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <p>Showing {filteredLogs.length} event records</p>
            <p>End of log</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
