/**
 * Scheme Store — Zustand
 *
 * Global state for the Schemes & Incentives module.
 * No sessionStorage persistence — data is re-fetched each session.
 */

import { create } from 'zustand';
import type {
  Scheme,
  SchemeRecommendation,
  SavedScheme,
  EligibilityAssessment,
  BusinessProfile,
} from '@/types/scheme.types';
import { schemeService } from '@/services/scheme.service';

interface SchemeStore {
  // State
  schemes: Scheme[];
  recommendations: SchemeRecommendation[];
  savedSchemes: SavedScheme[];
  selectedScheme: Scheme | null;
  eligibilityAssessment: EligibilityAssessment | null;
  businessProfile: BusinessProfile | null;
  savedSchemeIds: Set<string>;
  isLoading: boolean;
  isLoadingEligibility: boolean;
  error: string | null;

  // Actions
  fetchSchemes: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  fetchSaved: () => Promise<void>;
  fetchScheme: (id: string) => Promise<void>;
  fetchEligibility: (schemeId: string) => Promise<void>;
  fetchBusinessProfile: () => Promise<void>;
  saveScheme: (id: string) => Promise<void>;
  unsaveScheme: (id: string) => Promise<void>;
  clearSelectedScheme: () => void;
  clearEligibility: () => void;
}

export const useSchemeStore = create<SchemeStore>()((set) => ({
  schemes: [],
  recommendations: [],
  savedSchemes: [],
  selectedScheme: null,
  eligibilityAssessment: null,
  businessProfile: null,
  savedSchemeIds: new Set(['sch_001']),
  isLoading: false,
  isLoadingEligibility: false,
  error: null,

  fetchSchemes: async () => {
    set({ isLoading: true, error: null });
    try {
      const schemes = await schemeService.getSchemes();
      set({ schemes, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load schemes.' });
    }
  },

  fetchRecommendations: async () => {
    set({ isLoading: true, error: null });
    try {
      const recommendations = await schemeService.getRecommended();
      set({ recommendations, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load recommendations.' });
    }
  },

  fetchSaved: async () => {
    set({ isLoading: true, error: null });
    try {
      const savedSchemes = await schemeService.getSaved();
      set({ savedSchemes, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load saved schemes.' });
    }
  },

  fetchScheme: async (id: string) => {
    set({ isLoading: true, error: null, selectedScheme: null });
    try {
      const scheme = await schemeService.getSchemeById(id);
      set({ selectedScheme: scheme, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load scheme details.' });
    }
  },

  fetchEligibility: async (schemeId: string) => {
    set({ isLoadingEligibility: true, error: null });
    try {
      const assessment = await schemeService.getEligibilityAssessment(schemeId);
      set({ eligibilityAssessment: assessment, isLoadingEligibility: false });
    } catch {
      set({ isLoadingEligibility: false, error: 'Failed to assess eligibility.' });
    }
  },

  fetchBusinessProfile: async () => {
    try {
      const profile = await schemeService.getBusinessProfile();
      set({ businessProfile: profile });
    } catch {
      // Non-fatal
    }
  },

  saveScheme: async (id: string) => {
    await schemeService.saveScheme(id);
    set(state => ({
      savedSchemeIds: new Set([...state.savedSchemeIds, id]),
    }));
  },

  unsaveScheme: async (id: string) => {
    await schemeService.unsaveScheme(id);
    set(state => {
      const newSet = new Set(state.savedSchemeIds);
      newSet.delete(id);
      return {
        savedSchemeIds: newSet,
        savedSchemes: state.savedSchemes.filter(s => s.schemeId !== id),
      };
    });
  },

  clearSelectedScheme: () => set({ selectedScheme: null }),
  clearEligibility: () => set({ eligibilityAssessment: null }),
}));
