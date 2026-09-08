import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { governmentService } from '@/services/government.service';
import type { Escalation } from '@/types/government.types';
import { AlertTriangle, Clock, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function Escalations() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await governmentService.getEscalations();
        setEscalations(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppLayout
      pageTitle="Escalations"
      pageDescription="Review and manage applications that have breached critical thresholds."
      breadcrumbs={[{ label: 'Government', href: '/government' }, { label: 'Escalations' }]}
    >
      <div className="space-y-6 max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-200 px-5 py-4 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="size-5 text-red-600" />
              Active Escalations
            </h2>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
              {escalations.filter(e => e.status !== 'Resolved').length} Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-medium">Application</th>
                  <th className="px-5 py-3 font-medium">Reason & Severity</th>
                  <th className="px-5 py-3 font-medium">Escalated On</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      Loading escalations...
                    </td>
                  </tr>
                ) : escalations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                      No escalations currently recorded.
                    </td>
                  </tr>
                ) : (
                  escalations.map((esc) => (
                    <tr key={esc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 truncate max-w-[250px]">{esc.applicationName}</p>
                        <p className="text-xs text-slate-500">ID: {esc.applicationId}</p>
                        <p className="text-xs text-slate-500 mt-1">{esc.departmentName}</p>
                      </td>
                      <td className="px-5 py-4 max-w-sm">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={cn(
                            "size-4 shrink-0 mt-0.5",
                            esc.severity === 'Critical' ? "text-red-600" :
                            esc.severity === 'High' ? "text-amber-500" : "text-blue-500"
                          )} />
                          <div>
                            <span className={cn(
                              "inline-flex mb-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                              esc.severity === 'Critical' ? "bg-red-50 text-red-700 border-red-200" :
                              esc.severity === 'High' ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-blue-50 text-blue-700 border-blue-200"
                            )}>
                              {esc.severity}
                            </span>
                            <p className="text-sm text-slate-700 line-clamp-2">{esc.reason}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="size-3.5" />
                          {new Date(esc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
                          esc.status === 'Open' ? "bg-red-100 text-red-800" :
                          esc.status === 'In Progress' ? "bg-amber-100 text-amber-800" :
                          "bg-green-100 text-green-800"
                        )}>
                          {esc.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/government/applications/${esc.applicationId}`}
                          className="inline-flex items-center justify-center rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
                        >
                          Review App
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
    </AppLayout>
  );
}
