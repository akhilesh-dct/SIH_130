/**
 * Scheme & Incentives domain types — SIH 130 Industrial Platform
 *
 * Interface contract for the Schemes & Incentives Module (Task 7).
 * Designed to match a future FastAPI backend contract.
 */

import type { DocumentCategory } from './document.types';

// ---------------------------------------------------------------------------
// Configurable enumerations
// ---------------------------------------------------------------------------

export type SchemeCategory =
  | 'capital_subsidy'
  | 'tax_incentives'
  | 'interest_subsidy'
  | 'employment_incentives'
  | 'startup_support'
  | 'msme_support'
  | 'export_incentives'
  | 'skill_development'
  | 'technology_adoption'
  | 'green_sustainability'
  | 'infrastructure'
  | 'women_entrepreneurship'
  | 'rural_regional'
  | 'other';

export type SchemeBenefitType =
  | 'capital_subsidy'
  | 'interest_reimbursement'
  | 'tax_benefit'
  | 'electricity_duty_exemption'
  | 'employment_incentive'
  | 'training_reimbursement'
  | 'technology_subsidy'
  | 'loan_guarantee'
  | 'grant'
  | 'other';

export type SchemeApplicationStatus =
  | 'open'
  | 'closing_soon'   // within 30 days
  | 'closed'
  | 'upcoming'
  | 'ongoing';       // no fixed deadline — rolling applications

export type EligibilityStatus =
  | 'likely_eligible'
  | 'check_required'
  | 'missing_info'
  | 'not_eligible';

export type RelevanceLevel =
  | 'highly_relevant'
  | 'relevant'
  | 'potentially_relevant';

// ---------------------------------------------------------------------------
// Eligibility Rule Engine
// ---------------------------------------------------------------------------

export type RuleOperator =
  | 'eq'        // equals
  | 'neq'       // not equals
  | 'gte'       // greater than or equal
  | 'lte'       // less than or equal
  | 'in'        // value is in array
  | 'not_in'    // value is NOT in array
  | 'exists'    // field exists and is not null/empty
  | 'is_true';  // field === true

export interface SchemeEligibilityRule {
  id: string;
  schemeId: string;
  // The key in the BusinessProfile to evaluate
  profileField: string;
  operator: RuleOperator;
  // Expected value — can be primitive, array, or null (for 'exists')
  expectedValue: string | number | boolean | string[] | null;
  // Human-readable descriptions
  label: string;               // e.g., "Business registered in Maharashtra"
  description: string;         // e.g., "The scheme is only available to Maharashtra-based businesses."
  // Display helpers
  requiredValueLabel: string;  // e.g., "Maharashtra"
  isMandatory: boolean;
}

export interface EligibilityCriterionResult {
  rule: SchemeEligibilityRule;
  status: 'matched' | 'not_met' | 'missing_info';
  businessValue: string | number | boolean | null; // What the business has
  explanation: string;         // Plain language explanation
  actionLabel?: string;        // e.g., "Update Business Profile"
  actionHref?: string;         // e.g., "/business"
}

export interface EligibilityAssessment {
  schemeId: string;
  overallStatus: EligibilityStatus;
  totalCriteria: number;
  matchedCount: number;
  missingInfoCount: number;
  notMetCount: number;
  results: EligibilityCriterionResult[];
  assessedAt: string; // ISO 8601
  disclaimer: string;
}

// ---------------------------------------------------------------------------
// Document Requirements
// ---------------------------------------------------------------------------

export interface SchemeDocumentRequirement {
  id: string;
  schemeId: string;
  documentCategory: DocumentCategory;
  documentName: string;        // e.g., "MSME/Udyam Registration Certificate"
  description: string;
  isMandatory: boolean;
}

// ---------------------------------------------------------------------------
// Core Scheme Entity
// ---------------------------------------------------------------------------

export interface Scheme {
  id: string;
  name: string;
  department: string;
  governmentLevel: 'central' | 'state';
  state?: string;              // e.g., "Maharashtra" — null for central schemes
  category: SchemeCategory;
  benefitType: SchemeBenefitType[];
  benefitSummary: string;      // Short: "Up to 25% capital subsidy on fixed assets"
  benefitDetails: string;      // Full description
  description: string;         // 2-3 sentence overview
  eligibilitySummary: string;  // Plain text summary for card view
  whoCanApply: string[];       // bullet points
  applicationProcess: string[]; // step-by-step
  applicationStartDate: string | null; // ISO 8601
  applicationEndDate: string | null;   // ISO 8601 — null means ongoing
  schemeValidityInfo: string;  // e.g., "Approved under 2024-2029 policy"
  officialSourceLabel: string; // e.g., "Official Scheme Guidelines"
  officialSourceUrl: string | null; // null if not configured
  status: SchemeApplicationStatus;
  isActive: boolean;
  eligibilityRules: SchemeEligibilityRule[];
  documentRequirements: SchemeDocumentRequirement[];
  relatedApprovalIds: string[]; // e.g., ['app_cat_001', 'app_cat_002']
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export interface SchemeRecommendation {
  scheme: Scheme;
  relevanceLevel: RelevanceLevel;
  relevanceScore: number;       // 0-100 — used for sorting only, NOT displayed
  matchReasons: string[];       // e.g., ["Manufacturing sector matches", "Maharashtra location matches"]
  eligibilityStatus: EligibilityStatus;
  matchedCriteriaCount: number;
  totalCriteriaCount: number;
  missingRequirements: string[]; // e.g., ["MSME Registration Certificate"]
}

// ---------------------------------------------------------------------------
// Saved Scheme
// ---------------------------------------------------------------------------

export interface SavedScheme {
  id: string;
  schemeId: string;
  userId: string;
  savedAt: string;             // ISO 8601
  lastViewedAt: string | null;
  scheme: Scheme;              // Denormalized for UI
}

// ---------------------------------------------------------------------------
// Business Profile (source of truth for eligibility evaluation)
// ---------------------------------------------------------------------------

export interface BusinessProfile {
  organizationId: string;
  organizationName: string;
  state: string;               // e.g., "Maharashtra"
  district: string;            // e.g., "Pune"
  sector: string;              // e.g., "manufacturing"
  businessType: string;        // e.g., "private_limited", "partnership", "proprietorship"
  businessStage: string;       // e.g., "operational", "startup", "expanding"
  investmentLakh: number | null;    // Total investment in ₹ lakhs
  employeeCount: number | null;
  annualTurnoverLakh: number | null;
  ownershipCategory: string;   // e.g., "general", "sc_st", "obc", "women"
  isExporter: boolean;
  isStartup: boolean;
  isMSMERegistered: boolean;
  isGSTRegistered: boolean;
  industryCode?: string;
}
