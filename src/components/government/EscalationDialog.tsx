import { useState } from 'react';
import { X, AlertOctagon } from 'lucide-react';
import { governmentService } from '@/services/government.service';
import { useAuthStore } from '@/store/authStore';

interface EscalationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  onEscalated: () => void;
}

export function EscalationDialog({ isOpen, onClose, applicationId, onEscalated }: EscalationDialogProps) {
  const { user } = useAuthStore();
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState<'Medium'|'High'|'Critical'>('High');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      await governmentService.escalateApplication(
        applicationId, 
        reason, 
        severity,
        user.id,
        user.name
      );
      onEscalated();
      onClose();
      setReason('');
      setSeverity('High');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50/50 px-5 py-4 rounded-t-xl">
          <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <AlertOctagon className="size-5 text-red-600" />
            Escalate Application
          </h2>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Escalation Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="Medium">Medium (Department Head Review)</option>
              <option value="High">High (Secretary Review)</option>
              <option value="Critical">Critical (Immediate Action Required)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Escalation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this application needs to be escalated..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
              required
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Escalating...' : 'Submit Escalation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
