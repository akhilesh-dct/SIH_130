/**
 * Compliance domain types — SIH 130 Industrial Platform
 */

export type ComplianceStatus =
  | 'COMPLIANT'
  | 'DUE_SOON'
  | 'DUE'
  | 'OVERDUE'
  | 'AT_RISK'
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NOT_APPLICABLE';

export type ComplianceCategory =
  | 'Labour'
  | 'Tax'
  | 'Environment'
  | 'Factory & Industrial Safety'
  | 'Fire & Safety'
  | 'Company / Corporate'
  | 'Local Authority'
  | 'Pollution Control'
  | 'Financial'
  | 'Licensing'
  | 'Employment'
  | 'Other';

export type ComplianceFrequency =
  | 'ONE_TIME'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'HALF_YEARLY'
  | 'ANNUAL'
  | 'CUSTOM';

export type ComplianceRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ComplianceRiskFactor {
  factor: string;
  score: number;
}

export interface ComplianceRisk {
  score: number;
  level: ComplianceRiskLevel;
  factors: ComplianceRiskFactor[];
}

export interface ComplianceEvidenceRequirement {
  id: string;
  documentCategoryId: string; // Linking to document category/type
  documentName: string;
  required: boolean;
  status: 'Missing' | 'Uploaded' | 'Verified' | 'Rejected' | 'Expiring Soon';
  linkedDocumentId?: string; // If uploaded, link to actual Document entity
  expiryDate?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  category: ComplianceCategory;
  authorityId: string;
  authorityName: string;
  description: string;
  frequency: ComplianceFrequency;
  applicabilityConditions: {
    industry?: string[];
    location?: string[];
    minEmployees?: number;
    businessType?: string[];
  };
  gracePeriodDays: number;
  active: boolean;
}

export interface ComplianceObligation {
  id: string;
  businessId: string;
  ruleId: string; // Link back to rule
  
  // Flattened info from rule for easy display
  name: string;
  category: ComplianceCategory;
  authorityName: string;
  description: string;
  frequency: ComplianceFrequency;

  status: ComplianceStatus;
  
  // Applicability reasons specific to this business
  applicabilityReasons: string[];

  // Dates
  dueDate: string;
  completedAt?: string;
  nextDueDate?: string;

  // Requirements
  requirements: string[];
  evidenceRequirements: ComplianceEvidenceRequirement[];

  // Risk
  risk: ComplianceRisk;

  createdAt: string;
  updatedAt: string;
}

export interface ComplianceCycle {
  id: string;
  obligationId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  submittedAt?: string;
  completedAt?: string;
  status: ComplianceStatus;
}

export interface ComplianceHistoryEvent {
  id: string;
  obligationId: string;
  action: 'CREATED' | 'EVIDENCE_UPLOADED' | 'EVIDENCE_VERIFIED' | 'SUBMITTED' | 'QUERY_RAISED' | 'REJECTED' | 'COMPLIANT' | 'OVERDUE' | 'CYCLE_RENEWED';
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface ComplianceSummary {
  totalApplicable: number;
  compliant: number;
  dueSoon: number;
  overdue: number;
  atRisk: number;
}
