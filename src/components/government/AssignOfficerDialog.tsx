import { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { governmentService } from '@/services/government.service';
import { useAuthStore } from '@/store/authStore';

interface AssignOfficerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  currentOfficerId: string | null;
  onAssigned: () => void;
}

export function AssignOfficerDialog({ isOpen, onClose, applicationId, currentOfficerId, onAssigned }: AssignOfficerDialogProps) {
  const { user } = useAuthStore();
  const [officerId, setOfficerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock list of officers
  const officers = [
    { id: 'usr_02', name: 'Priya Sharma (Fire Dept)' },
    { id: 'usr_03', name: 'Rahul Joshi (Environment)' },
    { id: 'usr_04', name: 'Amit Patel (Municipal)' },
  ];

  useEffect(() => {
    if (isOpen) {
      setOfficerId(currentOfficerId || '');
    }
  }, [isOpen, currentOfficerId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId || !user) return;
    
    setIsSubmitting(true);
    const selectedOfficer = officers.find(o => o.id === officerId);
    
    try {
      await governmentService.assignOfficer(
        applicationId, 
        officerId, 
        selectedOfficer?.name || 'Unknown Officer',
        user.id,
        user.name
      );
      onAssigned();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UserPlus className="size-5 text-blue-600" />
            Assign Officer
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Officer</label>
            <select
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select an officer to assign...</option>
              {officers.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
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
              disabled={isSubmitting || !officerId || officerId === currentOfficerId}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Assigning...' : 'Assign Officer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
