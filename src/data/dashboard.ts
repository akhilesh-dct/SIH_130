/**
 * Mock dashboard data — SIH 130 Industrial Platform
 *
 * Centralized, structured mock data for the dashboard.
 * Designed as a drop-in for real API responses.
 * No hardcoded data in component files.
 *
 * All names, reference numbers, and entity data are synthetic.
 */

import type {
  Application,
  Approval,
  Activity,
  Notification,
  DashboardStats,
  ActionItem,
} from '@/types/dashboard.types';

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_01',
    referenceNo: 'IC/2026/FL/004872',
    name: 'Factory License',
    department: 'Dept. of Industrial Safety & Health, Maharashtra',
    status: 'query_raised',
    priority: 'high',
    submittedAt: '2026-09-03T09:00:00Z',
    updatedAt: '2026-09-06T14:22:00Z',
    estimatedDays: 30,
    slaDeadline: '2026-10-03T09:00:00Z',
    progress: 55,
    nextAction: 'Respond to department query regarding revised site plan.',
    timeline: [
      {
        id: 'tl_01_1',
        label: 'Application started',
        timestamp: '2026-08-29T10:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_01_2',
        label: 'Documents submitted',
        timestamp: '2026-09-03T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_01_3',
        label: 'Documents verified',
        description: 'All submitted documents passed verification.',
        timestamp: '2026-09-04T16:30:00Z',
        status: 'completed',
      },
      {
        id: 'tl_01_4',
        label: 'Application under review',
        timestamp: '2026-09-05T10:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_01_5',
        label: 'Query raised by department',
        description: 'Revised site plan required as per new safety regulations.',
        timestamp: '2026-09-06T14:22:00Z',
        status: 'active',
      },
      {
        id: 'tl_01_6',
        label: 'Applicant response',
        timestamp: null,
        status: 'pending',
      },
      {
        id: 'tl_01_7',
        label: 'Final decision',
        timestamp: null,
        status: 'pending',
      },
    ],
  },
  {
    id: 'app_02',
    referenceNo: 'IC/2026/ECO/002341',
    name: 'Environmental Consent Order',
    department: 'Maharashtra Pollution Control Board',
    status: 'documents_required',
    priority: 'high',
    submittedAt: '2026-09-01T11:00:00Z',
    updatedAt: '2026-09-05T09:00:00Z',
    estimatedDays: 45,
    slaDeadline: '2026-10-16T11:00:00Z',
    progress: 30,
    nextAction: 'Upload Environmental Impact Assessment report.',
    timeline: [
      {
        id: 'tl_02_1',
        label: 'Application started',
        timestamp: '2026-08-25T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_02_2',
        label: 'Initial documents submitted',
        timestamp: '2026-09-01T11:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_02_3',
        label: 'Additional documents required',
        description: 'EIA report and site map required for processing.',
        timestamp: '2026-09-05T09:00:00Z',
        status: 'active',
      },
      {
        id: 'tl_02_4',
        label: 'Documents review',
        timestamp: null,
        status: 'pending',
      },
      {
        id: 'tl_02_5',
        label: 'Site inspection',
        timestamp: null,
        status: 'pending',
      },
      {
        id: 'tl_02_6',
        label: 'Consent order issued',
        timestamp: null,
        status: 'pending',
      },
    ],
  },
  {
    id: 'app_03',
    referenceNo: 'IC/2026/FIRE/008810',
    name: 'Fire NOC',
    department: 'Maharashtra Fire Services',
    status: 'approved',
    priority: 'normal',
    submittedAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-09-02T15:00:00Z',
    estimatedDays: 21,
    slaDeadline: null,
    progress: 100,
    nextAction: null,
    timeline: [
      {
        id: 'tl_03_1',
        label: 'Application started',
        timestamp: '2026-08-05T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_03_2',
        label: 'Documents submitted',
        timestamp: '2026-08-10T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_03_3',
        label: 'Site inspection conducted',
        timestamp: '2026-08-22T10:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_03_4',
        label: 'NOC Approved',
        description: 'Fire NOC granted. Valid for 3 years.',
        timestamp: '2026-09-02T15:00:00Z',
        status: 'completed',
      },
    ],
  },
  {
    id: 'app_04',
    referenceNo: 'IC/2026/PCRA/001199',
    name: 'Power Connection & Load Approval',
    department: 'Maharashtra State Electricity Distribution Co.',
    status: 'under_review',
    priority: 'normal',
    submittedAt: '2026-09-06T10:00:00Z',
    updatedAt: '2026-09-06T10:00:00Z',
    estimatedDays: 15,
    slaDeadline: '2026-09-21T10:00:00Z',
    progress: 20,
    nextAction: null,
    timeline: [
      {
        id: 'tl_04_1',
        label: 'Application submitted',
        timestamp: '2026-09-06T10:00:00Z',
        status: 'completed',
      },
      {
        id: 'tl_04_2',
        label: 'Under review',
        timestamp: '2026-09-06T10:00:00Z',
        status: 'active',
      },
      {
        id: 'tl_04_3',
        label: 'Site survey',
        timestamp: null,
        status: 'pending',
      },
      {
        id: 'tl_04_4',
        label: 'Approval & connection',
        timestamp: null,
        status: 'pending',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Action Items
// ---------------------------------------------------------------------------

export const MOCK_ACTIONS: ActionItem[] = [
  {
    id: 'act_01',
    applicationId: 'app_01',
    applicationName: 'Factory License',
    severity: 'urgent',
    title: 'Respond to department query',
    description:
      'The Department of Industrial Safety & Health has raised a query regarding the revised site plan. A response is required within 10 days to avoid SLA breach.',
    deadline: '2026-09-16T09:00:00Z',
    ctaLabel: 'View query',
    ctaHref: '/applications/app_01',
  },
  {
    id: 'act_02',
    applicationId: 'app_02',
    applicationName: 'Environmental Consent Order',
    severity: 'warning',
    title: 'Upload Environmental Impact Assessment',
    description:
      'The MPCB has requested your EIA report before processing can continue. Upload the document to resume your application.',
    deadline: '2026-09-14T11:00:00Z',
    ctaLabel: 'Upload document',
    ctaHref: '/documents',
  },
  {
    id: 'act_03',
    applicationId: 'app_01',
    applicationName: 'Factory License',
    severity: 'warning',
    title: 'Address proof requires correction',
    description:
      'Your uploaded address proof does not match the registered business address. Please replace the document.',
    deadline: null,
    ctaLabel: 'Manage documents',
    ctaHref: '/documents',
  },
];

// ---------------------------------------------------------------------------
// Approvals overview
// ---------------------------------------------------------------------------

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'apr_01',
    name: 'Certificate of Incorporation',
    authority: 'Registrar of Companies, MCA',
    status: 'approved',
    completedAt: '2020-03-15T00:00:00Z',
  },
  {
    id: 'apr_02',
    name: 'PAN Registration',
    authority: 'Income Tax Department',
    status: 'approved',
    completedAt: '2020-04-01T00:00:00Z',
  },
  {
    id: 'apr_03',
    name: 'GST Registration',
    authority: 'Goods and Services Tax Network',
    status: 'approved',
    completedAt: '2021-04-01T00:00:00Z',
  },
  {
    id: 'apr_04',
    name: 'Fire NOC',
    authority: 'Maharashtra Fire Services',
    status: 'approved',
    completedAt: '2026-09-02T15:00:00Z',
  },
  {
    id: 'apr_05',
    name: 'Factory License',
    authority: 'Dept. of Industrial Safety & Health',
    status: 'in_progress',
    completedAt: null,
  },
  {
    id: 'apr_06',
    name: 'Environmental Consent Order',
    authority: 'Maharashtra Pollution Control Board',
    status: 'in_progress',
    completedAt: null,
  },
];

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act_a1',
    type: 'query_raised',
    title: 'Query raised by department',
    description: 'DISH Maharashtra raised a query on Factory License application.',
    timestamp: '2026-09-06T14:22:00Z',
    applicationId: 'app_01',
    applicationName: 'Factory License',
  },
  {
    id: 'act_a2',
    type: 'document_verified',
    title: 'Factory License verified',
    description: 'Factory License document passed all verification checks.',
    timestamp: '2026-09-05T09:35:00Z',
  },
  {
    id: 'act_a3',
    type: 'status_changed',
    title: 'Application under review',
    description: 'Factory License application moved to review stage.',
    timestamp: '2026-09-05T09:00:00Z',
    applicationId: 'app_01',
    applicationName: 'Factory License',
  },
  {
    id: 'act_a4',
    type: 'document_verified',
    title: 'PAN Card verified',
    timestamp: '2026-09-04T10:47:00Z',
  },
  {
    id: 'act_a5',
    type: 'application_submitted',
    title: 'Environmental Consent application submitted',
    timestamp: '2026-09-01T11:00:00Z',
    applicationId: 'app_02',
    applicationName: 'Environmental Consent Order',
  },
  {
    id: 'act_a6',
    type: 'approval_granted',
    title: 'Fire NOC approved',
    description: 'Fire NOC granted by Maharashtra Fire Services. Valid 3 years.',
    timestamp: '2026-09-02T15:00:00Z',
    applicationId: 'app_03',
    applicationName: 'Fire NOC',
  },
  {
    id: 'act_a7',
    type: 'application_submitted',
    title: 'Factory License application submitted',
    timestamp: '2026-09-03T09:00:00Z',
    applicationId: 'app_01',
    applicationName: 'Factory License',
  },
  {
    id: 'act_a8',
    type: 'document_verified',
    title: 'Certificate of Incorporation verified',
    timestamp: '2026-09-04T10:45:00Z',
  },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    severity: 'warning',
    title: 'Query raised — Factory License',
    body: 'The Department of Industrial Safety & Health has raised a query. Response required by 16 Sep.',
    timestamp: '2026-09-06T14:22:00Z',
    isRead: false,
    href: '/applications/app_01',
  },
  {
    id: 'notif_02',
    severity: 'warning',
    title: 'Document requires attention',
    body: 'Address proof on GST Registration does not match the application address.',
    timestamp: '2026-09-04T11:00:00Z',
    isRead: false,
    href: '/documents',
  },
  {
    id: 'notif_03',
    severity: 'success',
    title: 'Fire NOC approved',
    body: 'Your Fire NOC application has been approved by Maharashtra Fire Services.',
    timestamp: '2026-09-02T15:00:00Z',
    isRead: true,
    href: '/applications/app_03',
  },
  {
    id: 'notif_04',
    severity: 'info',
    title: 'Documents verified',
    body: 'Certificate of Incorporation and PAN Card have passed all verification checks.',
    timestamp: '2026-09-04T16:30:00Z',
    isRead: true,
  },
];

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  applications: {
    total: 4,
    inProgress: 3,
    approved: 1,
    actionRequired: 2,
  },
  documents: {
    required: 6,
    verified: 4,
    needsAttention: 1,
  },
  approvals: {
    required: 6,
    completed: 4,
    pending: 2,
  },
};
