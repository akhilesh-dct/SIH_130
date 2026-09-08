/**
 * Scheme Service — CRUD + Application Integration
 *
 * Interface mirrors future FastAPI endpoints:
 *   GET  /api/v1/schemes                → Scheme[]
 *   GET  /api/v1/schemes/recommended    → SchemeRecommendation[]
 *   GET  /api/v1/schemes/:id            → Scheme
 *   GET  /api/v1/schemes/:id/eligibility → EligibilityAssessment
 *   GET  /api/v1/schemes/saved          → SavedScheme[]
 *   POST /api/v1/schemes/:id/save       → void
 *   DELETE /api/v1/schemes/:id/save     → void
 */

import type {
  Scheme,
  SchemeRecommendation,
  SavedScheme,
  EligibilityAssessment,
  BusinessProfile,
} from '@/types/scheme.types';
import { MOCK_SCHEMES } from '@/data/schemes';
import { MOCK_BUSINESS_PROFILE } from '@/data/businessProfile';
import { eligibilityService } from './eligibility.service';
import { schemeRecommendationService } from './schemeRecommendation.service';
import { useAuthStore } from '@/store/authStore';
import { delay } from '@/lib/utils';

// ---------------------------------------------------------------------------
// In-memory mutable state (replaces DB in production)
// ---------------------------------------------------------------------------

let savedSchemeIds = new Set<string>(['sch_001']); // Pre-save one for demo

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ISchemeService {
  getSchemes(): Promise<Scheme[]>;
  getSchemeById(id: string): Promise<Scheme | null>;
  getRecommended(): Promise<SchemeRecommendation[]>;
  getSaved(): Promise<SavedScheme[]>;
  saveScheme(id: string): Promise<void>;
  unsaveScheme(id: string): Promise<void>;
  isSaved(id: string): boolean;
  getEligibilityAssessment(schemeId: string): Promise<EligibilityAssessment | null>;
  getBusinessProfile(): Promise<BusinessProfile>;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

class SchemeService implements ISchemeService {
  private getProfile(): BusinessProfile {
    // In production: GET /api/v1/business/profile using auth token
    // Here we use the mock, augmented with any auth store data
    const user = useAuthStore.getState().user;
    return {
      ...MOCK_BUSINESS_PROFILE,
      organizationId: user?.organizationId || MOCK_BUSINESS_PROFILE.organizationId,
      organizationName: user?.organizationName || MOCK_BUSINESS_PROFILE.organizationName,
    };
  }

  async getSchemes(): Promise<Scheme[]> {
    await delay(500);
    return MOCK_SCHEMES.filter(s => s.isActive);
  }

  async getSchemeById(id: string): Promise<Scheme | null> {
    await delay(300);
    return MOCK_SCHEMES.find(s => s.id === id) ?? null;
  }

  async getRecommended(): Promise<SchemeRecommendation[]> {
    await delay(600);
    const profile = this.getProfile();
    const allSchemes = MOCK_SCHEMES.filter(s => s.isActive);
    return schemeRecommendationService.getRecommendations(allSchemes, profile);
  }

  async getSaved(): Promise<SavedScheme[]> {
    await delay(400);
    const user = useAuthStore.getState().user;
    return Array.from(savedSchemeIds)
      .map((schemeId): SavedScheme | null => {
        const scheme = MOCK_SCHEMES.find(s => s.id === schemeId);
        if (!scheme) return null;
        return {
          id: `saved_${schemeId}`,
          schemeId,
          userId: user?.id || 'user_001',
          savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastViewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          scheme,
        };
      })
      .filter((s): s is SavedScheme => s !== null);
  }

  async saveScheme(id: string): Promise<void> {
    await delay(200);
    savedSchemeIds.add(id);
  }

  async unsaveScheme(id: string): Promise<void> {
    await delay(200);
    savedSchemeIds.delete(id);
  }

  isSaved(id: string): boolean {
    return savedSchemeIds.has(id);
  }

  async getEligibilityAssessment(schemeId: string): Promise<EligibilityAssessment | null> {
    await delay(400);
    const scheme = MOCK_SCHEMES.find(s => s.id === schemeId);
    if (!scheme) return null;
    const profile = this.getProfile();
    return eligibilityService.assessEligibility(scheme, profile);
  }

  async getBusinessProfile(): Promise<BusinessProfile> {
    await delay(200);
    return this.getProfile();
  }
}

export const schemeService = new SchemeService();
