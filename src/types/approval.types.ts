/**
 * Approval domain types — SIH 130 Industrial Platform
 *
 * Interface contract for the Approval Module (Task 6).
 */

import type { DocumentCategory } from './document.types';

// ---------------------------------------------------------------------------
// Core Categories and Statuses
// ---------------------------------------------------------------------------

export type ApprovalCategory =
  | 'business_registration'
  | 'factory'
  | 'environment'
  | 'fire_safety'
  | 'labour'
  | 'electricity'
  | 'local_authority'
  | 'construction'
  | 'other';

export type ApprovalStatus =
  | 'not_started'
  | 'documents_pending'
  | 'ready_to_apply'
  | 'submitted'
  | 'under_review'
  | 'query_raised'
  | 'inspection_pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'renewal_required';

// ---------------------------------------------------------------------------
// Static Approval Definitions (The Catalog)
// ---------------------------------------------------------------------------

export interface ApprovalDocumentRequirement {
  id: string;
  category: DocumentCategory;
  name: string;          // e.g. "Factory Layout Plan"
  isMandatory: boolean;
}

export interface ApprovalRequirement {
  id: string;
  type: 'prerequisite' | 'condition';
  description: string;
  isMandatory: boolean;
}

export interface ApprovalCatalog {
  id: string;
  name: string;
  department: string;
  category: ApprovalCategory;
  whyRequired: string;
  description: string;
  processingDays: number;
  validityMonths: number | null; // null means lifetime validity
  isActive: boolean;
  documentRequirements: ApprovalDocumentRequirement[];
  otherRequirements: ApprovalRequirement[];
  feeEstimate?: string;
  applicableTo: string[];
}

// ---------------------------------------------------------------------------
// Business's Specific Approval Journey
// ---------------------------------------------------------------------------

export interface RenewalInfo {
  id: string;
  expiresAt: string;          // ISO 8601
  renewalStatus: 'valid' | 'expiring_soon' | 'renewal_required' | 'expired';
  daysRemaining: number;
  lastRenewedAt?: string;
}

export interface ApprovalTimelineEvent {
  id: string;
  stage: string;              // e.g. "Requirements", "Documents", "Ready to Apply", "Under Review", "Approved"
  description?: string;
  timestamp: string | null;   // null = future
  status: 'completed' | 'active' | 'pending' | 'error';
}

export interface ApprovalApplication {
  id: string;                 // unique id for this business's approval attempt
  approvalId: string;         // links to ApprovalCatalog
  businessId: string;
  
  // Link to actual application entity if one exists
  applicationId: string | null; 
  status: ApprovalStatus;
  
  // Progress indicators
  progressScore: number;      // 0 - 100
  
  // Connected information
  assignedOfficerName?: string;
  slaDeadline?: string;       // ISO 8601
  
  // Timestamps
  startedAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  
  // Query
  activeQuery?: {
    text: string;
    deadline: string;
  };
  
  // Inspection
  inspection?: {
    status: 'pending' | 'completed';
    scheduledDate: string | null;
    officer: string;
  };
  
  renewal?: RenewalInfo;
  timeline: ApprovalTimelineEvent[];
}

// ---------------------------------------------------------------------------
// Aggregated UI Type
// ---------------------------------------------------------------------------

// This type merges the static catalog data and the dynamic application state for easy UI consumption
export interface ApprovalDetail {
  catalog: ApprovalCatalog;
  application: ApprovalApplication | null; // Null if they haven't even started adding documents
}
