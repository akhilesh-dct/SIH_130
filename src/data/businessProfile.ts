/**
 * Mock Business Profile — SIH 130 Industrial Platform
 *
 * Represents the currently logged-in organization's (org_001) business profile.
 * In production, this is fetched from GET /api/v1/business/profile.
 *
 * This is the single source of truth for the Eligibility Engine.
 * Profile data is intentionally realistic — some fields are missing to
 * demonstrate the "complete your profile" flow.
 */

import type { BusinessProfile } from '@/types/scheme.types';

export const MOCK_BUSINESS_PROFILE: BusinessProfile = {
  organizationId: 'org_001',
  organizationName: 'Apex Manufacturing Pvt. Ltd.',
  state: 'Maharashtra',
  district: 'Pune',
  sector: 'manufacturing',
  businessType: 'private_limited',
  businessStage: 'operational',
  investmentLakh: 48,           // ₹48 lakh — just below ₹50 lakh threshold for some schemes
  employeeCount: 22,
  annualTurnoverLakh: 120,      // ₹1.2 crore
  ownershipCategory: 'general',
  isExporter: false,
  isStartup: false,
  isMSMERegistered: true,
  isGSTRegistered: true,
};

/**
 * Profile completeness check — returns fields that are missing or null.
 * Used by the Recommendations page to show "Complete your profile" prompts.
 */
export function getMissingProfileFields(profile: BusinessProfile): string[] {
  const missing: string[] = [];
  if (profile.investmentLakh === null) missing.push('Total Investment');
  if (profile.employeeCount === null) missing.push('Employee Count');
  if (profile.annualTurnoverLakh === null) missing.push('Annual Turnover');
  if (!profile.state) missing.push('Business Location (State)');
  if (!profile.sector) missing.push('Business Sector');
  return missing;
}
