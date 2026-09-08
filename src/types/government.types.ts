import type { Application } from './dashboard.types';

export type GovernmentApplicationStatus = Application['status'];

export interface DelayReason {
  id: string;
  applicationId: string;
  reasonType: 
    | 'MISSING_DOCUMENT'
    | 'DOCUMENT_MISMATCH'
    | 'QUERY_UNRESOLVED'
    | 'INSPECTION_PENDING'
    | 'OFFICER_WORKLOAD'
    | 'APPLICANT_RESPONSE_DELAY'
    | 'TECHNICAL_VERIFICATION'
    | 'SLA_BREACH'
    | 'OTHER';
  description: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface RiskFactor {
  id: string;
  applicationId: string;
  factorType: string;
  score: number;
  description: string;
  createdAt: string;
}

export interface GovernmentApplication extends Application {
  businessId: string;
  businessName: string;
  assignedOfficerId: string | null;
  assignedOfficerName: string | null;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: RiskFactor[];
  delayReasons: DelayReason[];
  slaDaysRemaining: number | null;
  slaDaysOverdue: number | null;
  slaStatus: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'OVERDUE' | 'COMPLETED';
}

export interface OfficerWorkload {
  officerId: string;
  officerName: string;
  departmentId: string;
  departmentName: string;
  activeApplications: number;
  overdue: number;
  atRisk: number;
  workloadLevel: 'LOW' | 'NORMAL' | 'HIGH' | 'OVERLOADED';
}

export interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  totalApplications: number;
  averageProcessingDays: number;
  slaCompliancePercentage: number;
  overdueCount: number;
  atRiskCount: number;
  bottlenecks: Record<string, number>; // reasonType -> count
}

export type EscalationSeverity = 'Medium' | 'High' | 'Critical';
export type EscalationStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Escalation {
  id: string;
  applicationId: string;
  applicationName: string;
  departmentName: string;
  reason: string;
  severity: EscalationSeverity;
  createdAt: string;
  assignedTo: string;
  status: EscalationStatus;
}

export type AuditLogAction = 
  | 'LOGIN'
  | 'APPLICATION_ASSIGNED'
  | 'APPLICATION_REASSIGNED'
  | 'STATUS_CHANGED'
  | 'QUERY_RAISED'
  | 'ESCALATED'
  | 'DOCUMENT_VIEWED'
  | 'DOCUMENT_DOWNLOADED';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditLogAction;
  details: string;
}
