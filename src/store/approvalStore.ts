import { create } from 'zustand';
import type { ApprovalDetail } from '@/types/approval.types';
import { approvalService } from '@/services/approval.service';

interface ApprovalStore {
  approvals: ApprovalDetail[];
  selectedApproval: ApprovalDetail | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchApproval: (id: string) => Promise<void>;
  startApplication: (id: string) => Promise<void>;
  clearSelectedApproval: () => void;
}

export const useApprovalStore = create<ApprovalStore>()((set) => ({
  approvals: [],
  selectedApproval: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const approvals = await approvalService.getApprovals();
      set({ approvals, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load approvals.' });
    }
  },

  fetchApproval: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const approval = await approvalService.getApprovalById(id);
      set({ selectedApproval: approval, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load approval details.' });
    }
  },

  startApplication: async (id) => {
    try {
      const approval = await approvalService.startApplication(id);
      set({ selectedApproval: approval });
    } catch {
      set({ error: 'Failed to start application.' });
    }
  },

  clearSelectedApproval: () => {
    set({ selectedApproval: null });
  },
}));
