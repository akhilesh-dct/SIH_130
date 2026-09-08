/**
 * Scheme Recommendation Service — Transparent Scoring Engine
 *
 * Ranks schemes by relevance to a given business profile.
 * Scoring is deterministic and rule-based — NOT an AI model.
 *
 * The score is used ONLY for internal sorting.
 * The UI shows relevance LABELS ("Highly Relevant"), not scores.
 * Each recommendation explains WHY it was included.
 */

import type {
  Scheme,
  SchemeRecommendation,
  RelevanceLevel,
  BusinessProfile,
} from '@/types/scheme.types';
import { eligibilityService } from './eligibility.service';

// ---------------------------------------------------------------------------
// Scoring weights
// ---------------------------------------------------------------------------

const WEIGHTS = {
  sector: 25,
  location: 20,
  businessType: 15,
  investmentRange: 15,
  msmeStatus: 10,
  ownershipCategory: 10,
  exportStatus: 5,
};

// ---------------------------------------------------------------------------
// Scoring logic
// ---------------------------------------------------------------------------

interface ScoringResult {
  score: number;
  matchReasons: string[];
}

function scoreScheme(scheme: Scheme, profile: BusinessProfile): ScoringResult {
  let score = 0;
  const matchReasons: string[] = [];

  // --- Sector match
  const sectorRule = scheme.eligibilityRules.find(r => r.profileField === 'sector');
  if (sectorRule && profile.sector) {
    const expected = Array.isArray(sectorRule.expectedValue)
      ? sectorRule.expectedValue
      : [sectorRule.expectedValue];
    if (expected.includes(profile.sector)) {
      score += WEIGHTS.sector;
      matchReasons.push(`${profile.sector.charAt(0).toUpperCase() + profile.sector.slice(1)} sector matches scheme criteria`);
    }
  }

  // --- Location match
  const stateRule = scheme.eligibilityRules.find(r => r.profileField === 'state');
  if (stateRule) {
    if (scheme.governmentLevel === 'central') {
      score += WEIGHTS.location;
      matchReasons.push('Central government scheme — applies to all states');
    } else if (stateRule.expectedValue === profile.state) {
      score += WEIGHTS.location;
      matchReasons.push(`${profile.state} location matches scheme availability`);
    }
  } else if (scheme.governmentLevel === 'central') {
    score += WEIGHTS.location;
    matchReasons.push('Central government scheme — applies nationwide');
  }

  // --- MSME status
  if (profile.isMSMERegistered) {
    const msmeRule = scheme.eligibilityRules.find(r => r.profileField === 'isMSMERegistered');
    if (msmeRule) {
      score += WEIGHTS.msmeStatus;
      matchReasons.push('MSME/Udyam registration supports eligibility');
    }
  }

  // --- Investment range
  const investRule = scheme.eligibilityRules.find(r => r.profileField === 'investmentLakh');
  if (investRule && profile.investmentLakh !== null) {
    const reqVal = Number(investRule.expectedValue);
    if (investRule.operator === 'gte' && profile.investmentLakh >= reqVal * 0.7) {
      // Within 30% of threshold
      score += WEIGHTS.investmentRange;
      matchReasons.push('Investment profile is within the scheme\'s applicable range');
    } else if (investRule.operator === 'lte' && profile.investmentLakh <= reqVal) {
      score += WEIGHTS.investmentRange;
      matchReasons.push('Investment scale qualifies for this scheme');
    }
  }

  // --- Ownership category match
  const ownershipRule = scheme.eligibilityRules.find(r => r.profileField === 'ownershipCategory');
  if (ownershipRule) {
    const expected = Array.isArray(ownershipRule.expectedValue)
      ? ownershipRule.expectedValue
      : [ownershipRule.expectedValue];
    if (expected.includes(profile.ownershipCategory)) {
      score += WEIGHTS.ownershipCategory;
      matchReasons.push('Ownership category matches scheme target group');
    }
  } else {
    // Scheme has no ownership restriction — add partial score
    score += Math.floor(WEIGHTS.ownershipCategory / 2);
  }

  // --- Export status
  const exportRule = scheme.eligibilityRules.find(r => r.profileField === 'isExporter');
  if (!exportRule) {
    // No restriction — neutral
    score += Math.floor(WEIGHTS.exportStatus / 2);
  } else if (profile.isExporter && exportRule.operator === 'is_true') {
    score += WEIGHTS.exportStatus;
    matchReasons.push('Export status qualifies for this scheme');
  }

  return { score, matchReasons };
}

function scoreToRelevanceLevel(score: number): RelevanceLevel {
  if (score >= 70) return 'highly_relevant';
  if (score >= 45) return 'relevant';
  return 'potentially_relevant';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const schemeRecommendationService = {
  /**
   * Returns schemes ranked by relevance to the business profile.
   * Includes eligibility assessment and match reasoning.
   * Filters out schemes with score below a minimum threshold.
   */
  getRecommendations(schemes: Scheme[], profile: BusinessProfile): SchemeRecommendation[] {
    const MIN_SCORE = 30;

    const recommendations: SchemeRecommendation[] = schemes
      .filter(s => s.isActive)
      .map(scheme => {
        const { score, matchReasons } = scoreScheme(scheme, profile);
        const assessment = eligibilityService.assessEligibility(scheme, profile);

        // Identify missing documents for the card
        const missingRequirements: string[] = assessment.results
          .filter(r => r.status === 'not_met' && r.rule.isMandatory)
          .map(r => r.rule.label);

        return {
          scheme,
          relevanceScore: score,
          relevanceLevel: scoreToRelevanceLevel(score),
          matchReasons,
          eligibilityStatus: assessment.overallStatus,
          matchedCriteriaCount: assessment.matchedCount,
          totalCriteriaCount: assessment.totalCriteria,
          missingRequirements,
        };
      })
      .filter(r => r.relevanceScore >= MIN_SCORE)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return recommendations;
  },
};
