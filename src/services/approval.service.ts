import type {
  ApprovalCatalog,
  ApprovalApplication,
  ApprovalDetail,
} from '@/types/approval.types';
import { delay } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

// ---------------------------------------------------------------------------
// Mock Catalog Data (The "Rules / Regulatory Knowledge Base")
// ---------------------------------------------------------------------------

const MOCK_CATALOG: Record<string, ApprovalCatalog> = {
  'app_cat_001': {
    id: 'app_cat_001',
    name: 'Factory License',
    department: 'Department of Factories',
    category: 'factory',
    whyRequired: 'Mandatory under the Factories Act, 1948 for premises where 10 or more workers are working with the aid of power, or 20 or more without the aid of power.',
    description: 'Registration and grant of license to operate a factory safely and legally.',
    processingDays: 15,
    validityMonths: 36, // 3 years
    isActive: true,
    applicableTo: ['Manufacturing units', 'Industrial establishments', 'Heavy industries'],
    feeEstimate: '₹5,000 - ₹25,000 based on worker count and installed power',
    documentRequirements: [
      { id: 'doc_req_01', category: 'identity', name: 'Identity Proof of Occupier', isMandatory: true },
      { id: 'doc_req_02', category: 'factory', name: 'Factory Layout Plan', isMandatory: true },
      { id: 'doc_req_03', category: 'corporate', name: 'Certificate of Incorporation', isMandatory: true },
      { id: 'doc_req_04', category: 'corporate', name: 'List of Directors', isMandatory: true },
    ],
    otherRequirements: [
      { id: 'req_01', type: 'prerequisite', description: 'Minimum structural safety norms must be met.', isMandatory: true },
    ],
  },
  'app_cat_002': {
    id: 'app_cat_002',
    name: 'Fire NOC (No Objection Certificate)',
    department: 'State Fire Services',
    category: 'fire_safety',
    whyRequired: 'To certify that the premises complies with all necessary fire safety measures and fire prevention protocols.',
    description: 'Safety certification required for commercial and industrial buildings above a certain height or specific risk profile.',
    processingDays: 21,
    validityMonths: 12, // 1 year
    isActive: true,
    applicableTo: ['High-rise buildings', 'Chemical factories', 'Hazardous storage units'],
    feeEstimate: '₹2,000 base fee + variable inspection charges',
    documentRequirements: [
      { id: 'doc_req_05', category: 'factory', name: 'Approved Building Plan', isMandatory: true },
      { id: 'doc_req_06', category: 'corporate', name: 'Fire Safety Equipment List', isMandatory: true },
    ],
    otherRequirements: [
      { id: 'req_02', type: 'condition', description: 'Functional fire extinguishers must be installed every 50 sq meters.', isMandatory: true },
    ],
  },
  'app_cat_003': {
    id: 'app_cat_003',
    name: 'Consent to Establish (CTE) / Consent to Operate (CTO)',
    department: 'State Pollution Control Board',
    category: 'environment',
    whyRequired: 'Mandatory environmental clearance under the Water (Prevention & Control of Pollution) Act and Air Act.',
    description: 'Clearance to ensure the industry does not exceed permitted pollution and emission levels.',
    processingDays: 30,
    validityMonths: 60, // 5 years
    isActive: true,
    applicableTo: ['Manufacturing units', 'Chemical plants', 'Textile dyeing units'],
    feeEstimate: '₹10,000 - ₹1,00,000 based on Capital Investment',
    documentRequirements: [
      { id: 'doc_req_07', category: 'environment', name: 'Environmental Impact Assessment', isMandatory: true },
      { id: 'doc_req_08', category: 'factory', name: 'Site Plan', isMandatory: true },
    ],
    otherRequirements: [
      { id: 'req_03', type: 'prerequisite', description: 'Must have an Effluent Treatment Plant (ETP) installed if generating liquid waste.', isMandatory: true },
    ],
  },
  'app_cat_004': {
    id: 'app_cat_004',
    name: 'Labour Registration',
    department: 'Department of Labour',
    category: 'labour',
    whyRequired: 'Required for hiring contract workers and ensuring compliance with minimum wage and welfare laws.',
    description: 'Registration under the Contract Labour (Regulation and Abolition) Act.',
    processingDays: 7,
    validityMonths: null, // Lifetime until revoked
    isActive: true,
    applicableTo: ['Any establishment employing 20 or more contract labourers'],
    feeEstimate: '₹1,000 - ₹5,000',
    documentRequirements: [
      { id: 'doc_req_09', category: 'identity', name: 'PAN Card', isMandatory: true },
      { id: 'doc_req_10', category: 'corporate', name: 'Trade License', isMandatory: true },
    ],
    otherRequirements: [],
  },
};

// ---------------------------------------------------------------------------
// Mock Application State (The business's journey)
// ---------------------------------------------------------------------------
// Simulating an active business state. Note that 'APP-1024' represents the Factory License that is currently under review.

let mockApplications: ApprovalApplication[] = [
  {
    id: 'app_appl_001',
    approvalId: 'app_cat_001', // Factory License
    businessId: 'org_001',
    applicationId: 'APP-1024', // Linked to the main dashboard application
    status: 'under_review',
    progressScore: 60,
    assignedOfficerName: 'Priya Sharma',
    slaDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    activeQuery: {
      text: 'Please provide the updated structural safety certificate for Sector B.',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    timeline: [
      { id: 't1', stage: 'Requirements Check', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
      { id: 't2', stage: 'Documents Verified', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
      { id: 't3', stage: 'Submitted', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
      { id: 't4', stage: 'Under Review', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'active' },
      { id: 't5', stage: 'Inspection', timestamp: null, status: 'pending' },
      { id: 't6', stage: 'Decision', timestamp: null, status: 'pending' },
    ],
  },
  {
    id: 'app_appl_002',
    approvalId: 'app_cat_002', // Fire NOC
    businessId: 'org_001',
    applicationId: 'APP-1008',
    status: 'approved',
    progressScore: 100,
    approvedAt: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000).toISOString(), // ~11 months ago
    renewal: {
      id: 'ren_001',
      expiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // Expires in ~35 days
      renewalStatus: 'expiring_soon',
      daysRemaining: 35,
    },
    timeline: [
      { id: 't1', stage: 'Approved', timestamp: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
    ],
  },
  {
    id: 'app_appl_003',
    approvalId: 'app_cat_003', // CTO
    businessId: 'org_001',
    applicationId: null, // Not started
    status: 'documents_pending',
    progressScore: 10,
    timeline: [
      { id: 't1', stage: 'Requirements Check', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
      { id: 't2', stage: 'Documents Gathering', timestamp: null, status: 'active' },
      { id: 't3', stage: 'Ready to Apply', timestamp: null, status: 'pending' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Service Implementation
// ---------------------------------------------------------------------------

export interface IApprovalService {
  getApprovals(): Promise<ApprovalDetail[]>;
  getApprovalById(id: string): Promise<ApprovalDetail>;
  startApplication(approvalId: string): Promise<ApprovalDetail>;
}

class ApprovalService implements IApprovalService {
  private getBusinessId(): string {
    const user = useAuthStore.getState().user;
    return user?.organizationId || 'org_001';
  }

  /**
   * Fetches the composite list of approvals (Catalog + State)
   */
  async getApprovals(): Promise<ApprovalDetail[]> {
    await delay(600);
    const bId = this.getBusinessId();

    const results: ApprovalDetail[] = [];

    // In a real app, the backend's "Recommendation Engine" decides which catalogs to return here based on the business profile.
    for (const catalogId of Object.keys(MOCK_CATALOG)) {
      const catalog = MOCK_CATALOG[catalogId];
      const application = mockApplications.find((app) => app.approvalId === catalogId && app.businessId === bId) || null;

      results.push({
        catalog,
        application,
      });
    }

    return results;
  }

  /**
   * Fetches a single composite approval
   */
  async getApprovalById(id: string): Promise<ApprovalDetail> {
    await delay(400);
    const bId = this.getBusinessId();

    const catalog = MOCK_CATALOG[id];
    if (!catalog) throw new Error('Approval not found');

    const application = mockApplications.find((app) => app.approvalId === id && app.businessId === bId) || null;

    return {
      catalog,
      application,
    };
  }

  /**
   * Mock endpoint to "start" an application
   */
  async startApplication(approvalId: string): Promise<ApprovalDetail> {
    await delay(800);
    const bId = this.getBusinessId();
    
    let application = mockApplications.find((app) => app.approvalId === approvalId && app.businessId === bId);
    
    if (!application) {
      application = {
        id: `app_appl_${Date.now()}`,
        approvalId,
        businessId: bId,
        applicationId: null,
        status: 'documents_pending',
        progressScore: 5,
        timeline: [
          { id: 't1', stage: 'Requirements Check', timestamp: new Date().toISOString(), status: 'completed' },
          { id: 't2', stage: 'Documents Gathering', timestamp: new Date().toISOString(), status: 'active' },
          { id: 't3', stage: 'Ready to Apply', timestamp: null, status: 'pending' },
        ],
      };
      mockApplications.push(application);
    }
    
    return {
      catalog: MOCK_CATALOG[approvalId],
      application,
    };
  }
}

export const approvalService = new ApprovalService();
