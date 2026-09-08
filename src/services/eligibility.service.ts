/**
 * Eligibility Service — Rule-based Engine
 *
 * Evaluates a business profile against a scheme's eligibility rules.
 * This is a deterministic, rule-based engine — NOT an AI model.
 *
 * Each rule is evaluated independently. The overall status is derived
 * from the aggregate of all criteria results.
 *
 * Business logic lives HERE — not in React components.
 */

import type {
  Scheme,
  SchemeEligibilityRule,
  EligibilityCriterionResult,
  EligibilityAssessment,
  EligibilityStatus,
  BusinessProfile,
} from '@/types/scheme.types';

// ---------------------------------------------------------------------------
// Core rule evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluates a single eligibility rule against the business profile.
 * Returns a deterministic result with a plain-language explanation.
 */
function evaluateRule(
  rule: SchemeEligibilityRule,
  profile: BusinessProfile
): EligibilityCriterionResult {
  // Safely get the value from the profile using the field path
  const rawValue = (profile as unknown as Record<string, unknown>)[rule.profileField];

  // --- MISSING INFO: field is null or undefined
  if (rawValue === null || rawValue === undefined) {
    return {
      rule,
      status: 'missing_info',
      businessValue: null,
      explanation: `This information is not available in your business profile. Please update your profile to assess this criterion.`,
      actionLabel: 'Update Business Profile',
      actionHref: '/business',
    };
  }

  const bizValue = rawValue as string | number | boolean;

  // --- Evaluate by operator
  let passed = false;

  switch (rule.operator) {
    case 'eq':
      passed = String(bizValue).toLowerCase() === String(rule.expectedValue).toLowerCase();
      break;
    case 'neq':
      passed = String(bizValue).toLowerCase() !== String(rule.expectedValue).toLowerCase();
      break;
    case 'gte':
      passed = Number(bizValue) >= Number(rule.expectedValue);
      break;
    case 'lte':
      passed = Number(bizValue) <= Number(rule.expectedValue);
      break;
    case 'in':
      passed = Array.isArray(rule.expectedValue) &&
        rule.expectedValue.map(v => String(v).toLowerCase()).includes(String(bizValue).toLowerCase());
      break;
    case 'not_in':
      passed = Array.isArray(rule.expectedValue) &&
        !rule.expectedValue.map(v => String(v).toLowerCase()).includes(String(bizValue).toLowerCase());
      break;
    case 'exists':
      passed = bizValue !== null && bizValue !== undefined && bizValue !== '' && bizValue !== false;
      break;
    case 'is_true':
      passed = bizValue === true;
      break;
    default:
      passed = false;
  }

  if (passed) {
    return {
      rule,
      status: 'matched',
      businessValue: bizValue,
      explanation: generateMatchedExplanation(rule, bizValue),
    };
  }

  // Not met — generate actionable explanation
  return {
    rule,
    status: 'not_met',
    businessValue: bizValue,
    explanation: generateNotMetExplanation(rule, bizValue),
    actionLabel: 'Review Requirement',
    actionHref: '/business',
  };
}

// ---------------------------------------------------------------------------
// Explanation generators
// ---------------------------------------------------------------------------

function formatValue(value: unknown): string {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === null || value === undefined) return 'Not provided';
  return String(value);
}

function generateMatchedExplanation(rule: SchemeEligibilityRule, bizValue: unknown): string {
  switch (rule.operator) {
    case 'eq':
    case 'in':
      return `Your business value "${formatValue(bizValue)}" matches the requirement: ${rule.requiredValueLabel}.`;
    case 'neq':
    case 'not_in':
      return `Your business value "${formatValue(bizValue)}" satisfies the exclusion requirement.`;
    case 'gte':
      return `Your value (${formatValue(bizValue)}) meets or exceeds the minimum requirement of ${rule.requiredValueLabel}.`;
    case 'lte':
      return `Your value (${formatValue(bizValue)}) is within the maximum limit of ${rule.requiredValueLabel}.`;
    case 'exists':
    case 'is_true':
      return `This requirement is satisfied based on your business profile.`;
    default:
      return 'Criterion is satisfied.';
  }
}

function generateNotMetExplanation(rule: SchemeEligibilityRule, bizValue: unknown): string {
  switch (rule.operator) {
    case 'eq':
      return `Required: ${rule.requiredValueLabel}. Your business: "${formatValue(bizValue)}". This criterion is not currently satisfied.`;
    case 'neq':
      return `Your business value "${formatValue(bizValue)}" does not satisfy the exclusion requirement for this scheme.`;
    case 'gte':
      return `Required: ${rule.requiredValueLabel}. Your business: ${formatValue(bizValue)}. Your value is below the minimum required.`;
    case 'lte':
      return `Required: ${rule.requiredValueLabel}. Your business: ${formatValue(bizValue)}. Your value exceeds the maximum allowed.`;
    case 'in':
      return `Required: ${rule.requiredValueLabel}. Your business sector/type "${formatValue(bizValue)}" is not in the eligible categories.`;
    case 'not_in':
      return `Your business value "${formatValue(bizValue)}" is in an excluded category for this scheme.`;
    case 'exists':
    case 'is_true':
      return `This requirement is not currently met. Please check and update your business profile.`;
    default:
      return `This criterion is not currently satisfied.`;
  }
}

// ---------------------------------------------------------------------------
// Overall status derivation
// ---------------------------------------------------------------------------

function deriveOverallStatus(results: EligibilityCriterionResult[]): EligibilityStatus {
  const mandatoryResults = results.filter(r => r.rule.isMandatory);

  const mandatoryNotMet = mandatoryResults.filter(r => r.status === 'not_met');
  const mandatoryMissing = mandatoryResults.filter(r => r.status === 'missing_info');

  if (mandatoryNotMet.length > 0) return 'not_eligible';
  if (mandatoryMissing.length > 0) return 'missing_info';

  // All mandatory criteria are matched
  const optionalResults = results.filter(r => !r.rule.isMandatory);
  const optionalNotMet = optionalResults.filter(r => r.status !== 'matched');

  if (optionalNotMet.length > 0) return 'check_required';
  return 'likely_eligible';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const ELIGIBILITY_DISCLAIMER =
  'This assessment is for informational purposes only. Final eligibility is determined by the relevant government authority in accordance with official scheme guidelines. The platform does not guarantee legal eligibility.';

export const eligibilityService = {
  /**
   * Runs all rules for a scheme against the business profile.
   * Returns a complete EligibilityAssessment.
   */
  assessEligibility(scheme: Scheme, profile: BusinessProfile): EligibilityAssessment {
    const results = scheme.eligibilityRules.map(rule => evaluateRule(rule, profile));
    const overallStatus = deriveOverallStatus(results);

    return {
      schemeId: scheme.id,
      overallStatus,
      totalCriteria: results.length,
      matchedCount: results.filter(r => r.status === 'matched').length,
      missingInfoCount: results.filter(r => r.status === 'missing_info').length,
      notMetCount: results.filter(r => r.status === 'not_met').length,
      results,
      assessedAt: new Date().toISOString(),
      disclaimer: ELIGIBILITY_DISCLAIMER,
    };
  },

  /**
   * Returns only the overall eligibility status without full assessment.
   * Useful for card-level display.
   */
  getEligibilityStatus(scheme: Scheme, profile: BusinessProfile): EligibilityStatus {
    return this.assessEligibility(scheme, profile).overallStatus;
  },
};
