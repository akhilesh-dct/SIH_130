/**
 * Dashboard domain types — SIH 130 Industrial Platform
 *
 * Interface contract designed to match the future FastAPI backend.
 * Covers: applications, approvals, activity feed, notifications, dashboard stats.
 */

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'documents_required'
  | 'under_review'
  | 'query_raised'
  | 'inspection_scheduled'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export type ApplicationPriority = 'normal' | 'high' | 'critical';

export interface Application {
  id: string;
  referenceNo: string;
  name: string;
  department: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  submittedAt: string | null;   // ISO 8601
  updatedAt: string;
  estimatedDays: number | null; // expected processing days from submission
  slaDeadline: string | null;   // ISO 8601 — when SLA expires
  progress: number;             // 0–100
  nextAction: string | null;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  label: string;
  description?: string;
  timestamp: string | null;     // null = future step
  status: 'completed' | 'active' | 'pending';
}

// ---------------------------------------------------------------------------
// Actions Required
// ---------------------------------------------------------------------------

export type ActionSeverity = 'info' | 'warning' | 'urgent';

export interface ActionItem {
  id: string;
  applicationId: string;
  applicationName: string;
  severity: ActionSeverity;
  title: string;
  description: string;
  deadline: string | null;      // ISO 8601
  ctaLabel: string;
  ctaHref: string;
}

// ---------------------------------------------------------------------------
// Approvals
// ---------------------------------------------------------------------------

export type ApprovalStatus = 'not_started' | 'in_progress' | 'approved' | 'rejected';

export interface Approval {
  id: string;
  name: string;
  authority: string;
  status: ApprovalStatus;
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export type ActivityType =
  | 'document_verified'
  | 'document_uploaded'
  | 'application_submitted'
  | 'query_raised'
  | 'query_resolved'
  | 'approval_granted'
  | 'status_changed'
  | 'inspection_scheduled'
  | 'note_added';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;            // ISO 8601
  applicationId?: string;
  applicationName?: string;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationSeverity = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  href?: string;
}

// ---------------------------------------------------------------------------
// Dashboard summary stats
// ---------------------------------------------------------------------------

export interface DashboardStats {
  applications: {
    total: number;
    inProgress: number;
    approved: number;
    actionRequired: number;
  };
  documents: {
    required: number;
    verified: number;
    needsAttention: number;
  };
  approvals: {
    required: number;
    completed: number;
    pending: number;
  };
}
