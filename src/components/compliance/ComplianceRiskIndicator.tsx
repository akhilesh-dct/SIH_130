import { cn } from '@/lib/utils';
import type { ComplianceRisk } from '@/types/compliance.types';
import { AlertOctagon, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
  risk: ComplianceRisk;
  className?: string;
}

export function ComplianceRiskIndicator({ risk, className }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const config = {
    LOW: { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', Icon: ShieldCheck },
    MEDIUM: { label: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', Icon: Info },
    HIGH: { label: 'High Risk', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', Icon: AlertTriangle },
    CRITICAL: { label: 'Critical Risk', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', Icon: AlertOctagon },
  };

  const { label, color, bg, border, Icon } = config[risk.level];

  if (risk.level === 'LOW') {
    return (
      <div className={cn('flex items-center gap-1.5 text-sm font-medium', color, className)}>
        <Icon className="size-4" />
        {label}
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <div className={cn('flex items-center gap-1.5 text-sm font-semibold cursor-help', color, className)}>
        <Icon className="size-4" />
        {label}
      </div>

      {showTooltip && risk.factors.length > 0 && (
        <div className={cn('absolute z-10 w-64 p-3 mt-2 text-sm rounded-lg border shadow-lg', bg, border)}>
          <p className="font-semibold mb-2 text-slate-800">Risk Factors:</p>
          <ul className="space-y-1.5">
            {risk.factors.map((factor, idx) => (
              <li key={idx} className="flex justify-between items-start gap-2">
                <span className="text-slate-700">{factor.factor}</span>
                <span className={cn('font-medium', color)}>+{factor.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
