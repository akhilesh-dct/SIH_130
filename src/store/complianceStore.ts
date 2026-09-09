import { create } from 'zustand';
import { complianceService } from '@/services/compliance.service';
import type { ComplianceObligation, ComplianceSummary, ComplianceHistoryEvent } from '@/types/compliance.types';

interface ComplianceState {
  obligations: ComplianceObligation[];
  summary: ComplianceSummary | null;
  history: Record<string, ComplianceHistoryEvent[]>;
  isLoading: boolean;
  error: string | null;

  fetchObligations: (businessId: string) => Promise<void>;
  fetchSummary: (businessId: string) => Promise<void>;
  submitCompliance: (businessId: string, obligationId: string) => Promise<void>;
  updateEvidence: (businessId: string, obligationId: string, evidenceId: string, documentId: string) => Promise<void>;
  fetchHistory: (obligationId: string) => Promise<void>;
}

export const useComplianceStore = create<ComplianceState>((set, get) => ({
  obligations: [],
  summary: null,
  history: {},
  isLoading: false,
  error: null,

  fetchObligations: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const obligations = await complianceService.getObligations(businessId);
      set({ obligations, isLoading: false });
      // Also fetch summary when fetching obligations
      get().fetchSummary(businessId);
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchSummary: async (businessId: string) => {
    try {
      const summary = await complianceService.getSummary(businessId);
      set({ summary });
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  },

  submitCompliance: async (businessId: string, obligationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await complianceService.submitCompliance(businessId, obligationId);
      set((state) => ({
        obligations: state.obligations.map((o) => (o.id === obligationId ? updated : o)),
        isLoading: false
      }));
      get().fetchSummary(businessId);
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  updateEvidence: async (businessId: string, obligationId: string, evidenceId: string, documentId: string) => {
    try {
      const updated = await complianceService.updateEvidenceStatus(businessId, obligationId, evidenceId, documentId);
      set((state) => ({
        obligations: state.obligations.map((o) => (o.id === obligationId ? updated : o))
      }));
    } catch (err) {
      console.error('Failed to update evidence', err);
    }
  },

  fetchHistory: async (obligationId: string) => {
    try {
      const hist = await complianceService.getHistory(obligationId);
      set((state) => ({
        history: {
          ...state.history,
          [obligationId]: hist
        }
      }));
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  }
}));
