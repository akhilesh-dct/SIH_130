import { addDays, differenceInDays, formatISO, parseISO, addMonths, addYears } from 'date-fns';
import type { 
  ComplianceObligation, 
  ComplianceSummary, 
  ComplianceHistoryEvent,
  ComplianceStatus,
  ComplianceRiskLevel,
  ComplianceRiskFactor
} from '@/types/compliance.types';

// Removed unused mockRules

// Helper for date calculation based on frequency
function calculateNextDueDate(currentDueDate: string, frequency: string): string {
  const date = parseISO(currentDueDate);
  switch (frequency) {
    case 'MONTHLY':
      return formatISO(addMonths(date, 1));
    case 'ANNUAL':
      return formatISO(addYears(date, 1));
    case 'QUARTERLY':
      return formatISO(addMonths(date, 3));
    case 'HALF_YEARLY':
      return formatISO(addMonths(date, 6));
    default:
      return formatISO(addDays(date, 30));
  }
}


function calculateRisk(
  status: ComplianceStatus, 
  dueDateStr: string, 
  evidenceMissingCount: number,
  isRejected: boolean
): { score: number; level: ComplianceRiskLevel; factors: ComplianceRiskFactor[] } {
  let score = 0;
  const factors: ComplianceRiskFactor[] = [];

  const dueDate = parseISO(dueDateStr);
  const daysDiff = differenceInDays(dueDate, new Date());

  if (status === 'OVERDUE') {
    score += 40;
    factors.push({ factor: 'Deadline passed', score: 40 });
  } else if (daysDiff >= 0 && daysDiff <= 3) {
    score += 25;
    factors.push({ factor: 'Deadline within 3 days', score: 25 });
  }

  if (evidenceMissingCount > 0) {
    const evScore = evidenceMissingCount * 15;
    score += evScore;
    factors.push({ factor: `Missing ${evidenceMissingCount} required document(s)`, score: evScore });
  }

  if (isRejected) {
    score += 20;
    factors.push({ factor: 'Previous submission rejected', score: 20 });
  }

  // Cap at 100
  score = Math.min(100, score);

  let level: ComplianceRiskLevel = 'LOW';
  if (score > 80) level = 'CRITICAL';
  else if (score > 60) level = 'HIGH';
  else if (score > 30) level = 'MEDIUM';

  return { score, level, factors };
}

// Generate deterministic mock obligations for a business
function generateMockObligations(businessId: string): ComplianceObligation[] {
  // Use current date as reference to make data look live
  const today = new Date();
  const past3Days = addDays(today, -3);
  const future3Days = addDays(today, 3);
  const future20Days = addDays(today, 20);
  const past15Days = addDays(today, -15);
  const future5Days = addDays(today, 5);

  const obligations: ComplianceObligation[] = [
    {
      id: 'obl-1',
      businessId,
      ruleId: 'rule-1',
      name: 'Factory Safety Inspection',
      category: 'Factory & Industrial Safety',
      authorityName: 'Directorate of Industrial Safety',
      description: 'Submit the annual safety inspection report certified by a registered engineer.',
      frequency: 'ANNUAL',
      status: 'DUE_SOON',
      applicabilityReasons: [
        'Business operates in Maharashtra',
        'Business category is Manufacturing',
        'Employee count exceeds 20'
      ],
      dueDate: formatISO(future3Days),
      requirements: [
        'Hire a certified safety engineer',
        'Conduct full premises inspection',
        'Upload certified report'
      ],
      evidenceRequirements: [
        {
          id: 'ev-1',
          documentCategoryId: 'factory_safety',
          documentName: 'Safety Inspection Report',
          required: true,
          status: 'Missing'
        }
      ],
      risk: calculateRisk('DUE_SOON', formatISO(future3Days), 1, false),
      createdAt: formatISO(addDays(today, -300)),
      updatedAt: formatISO(today)
    },
    {
      id: 'obl-2',
      businessId,
      ruleId: 'rule-2',
      name: 'GST Return Filing',
      category: 'Tax',
      authorityName: 'GST Authority',
      description: 'Monthly summary return of outward and inward supplies.',
      frequency: 'MONTHLY',
      status: 'SUBMITTED', // Or upcoming depending on logic, let's say submitted
      applicabilityReasons: ['Business is GST registered'],
      dueDate: formatISO(future20Days),
      completedAt: undefined,
      requirements: ['Calculate monthly GST liability', 'File return on portal'],
      evidenceRequirements: [
        {
          id: 'ev-2',
          documentCategoryId: 'tax_return',
          documentName: 'GST Challan',
          required: true,
          status: 'Uploaded',
          linkedDocumentId: 'doc-gst-123'
        }
      ],
      risk: calculateRisk('SUBMITTED', formatISO(future20Days), 0, false),
      createdAt: formatISO(addDays(today, -15)),
      updatedAt: formatISO(today)
    },
    {
      id: 'obl-3',
      businessId,
      ruleId: 'rule-3',
      name: 'Environmental Consent Renewal',
      category: 'Environment',
      authorityName: 'State Pollution Control Board',
      description: 'Renewal of Consent to Operate (CTO) before expiry.',
      frequency: 'ANNUAL',
      status: 'OVERDUE',
      applicabilityReasons: ['Business category is Manufacturing'],
      dueDate: formatISO(past3Days),
      requirements: ['Submit effluent test report', 'Pay renewal fee'],
      evidenceRequirements: [
        {
          id: 'ev-3',
          documentCategoryId: 'env_report',
          documentName: 'Effluent Test Report',
          required: true,
          status: 'Missing'
        },
        {
          id: 'ev-4',
          documentCategoryId: 'fee_receipt',
          documentName: 'Fee Payment Receipt',
          required: true,
          status: 'Missing'
        }
      ],
      risk: calculateRisk('OVERDUE', formatISO(past3Days), 2, false),
      createdAt: formatISO(addDays(today, -30)),
      updatedAt: formatISO(today)
    },
    {
      id: 'obl-4',
      businessId,
      ruleId: 'rule-4',
      name: 'PF & ESI Contributions',
      category: 'Labour',
      authorityName: 'EPFO & ESIC',
      description: 'Monthly deposit of provident fund and employee state insurance contributions.',
      frequency: 'MONTHLY',
      status: 'COMPLIANT',
      applicabilityReasons: ['Employee count exceeds 10'],
      dueDate: formatISO(past15Days),
      completedAt: formatISO(addDays(past15Days, -2)),
      nextDueDate: calculateNextDueDate(formatISO(past15Days), 'MONTHLY'),
      requirements: ['Deposit PF contribution'],
      evidenceRequirements: [
        {
          id: 'ev-5',
          documentCategoryId: 'pf_receipt',
          documentName: 'PF Deposit Challan',
          required: true,
          status: 'Verified',
          linkedDocumentId: 'doc-pf-123'
        }
      ],
      risk: calculateRisk('COMPLIANT', formatISO(past15Days), 0, false),
      createdAt: formatISO(addDays(today, -45)),
      updatedAt: formatISO(addDays(past15Days, -2))
    },
    {
      id: 'obl-5',
      businessId,
      ruleId: 'rule-5',
      name: 'Fire Safety Audit',
      category: 'Fire & Safety',
      authorityName: 'State Fire Service',
      description: 'Biennial or annual fire safety audit based on building type.',
      frequency: 'ANNUAL',
      status: 'REJECTED',
      applicabilityReasons: ['Business Type is Private Limited', 'Factory Area > 1000 sqm'],
      dueDate: formatISO(future5Days),
      requirements: ['Conduct audit by approved agency'],
      evidenceRequirements: [
        {
          id: 'ev-6',
          documentCategoryId: 'fire_audit',
          documentName: 'Fire Audit Certificate',
          required: true,
          status: 'Rejected',
          linkedDocumentId: 'doc-fire-123' // Assume it was uploaded but rejected
        }
      ],
      risk: calculateRisk('REJECTED', formatISO(future5Days), 1, true),
      createdAt: formatISO(addDays(today, -10)),
      updatedAt: formatISO(today)
    }
  ];

  // Let's generate a total of ~29 obligations to match the PRD spec, by repeating a few with different statuses
  // To keep it simple, we'll clone compliant ones to make up the numbers.
  const clonedObligations: ComplianceObligation[] = [];
  for (let i = 6; i <= 29; i++) {
    clonedObligations.push({
      ...obligations[3], // Clone the compliant one
      id: `obl-${i}`,
      name: `Standard Compliance Requirement ${i}`,
      category: 'Other',
      authorityName: 'Local Authority',
      description: 'Routine local compliance check.',
      frequency: 'ANNUAL',
      status: 'COMPLIANT',
      dueDate: formatISO(addDays(today, i - 15)),
      completedAt: formatISO(addDays(today, i - 16)),
      nextDueDate: calculateNextDueDate(formatISO(addDays(today, i - 15)), 'ANNUAL'),
      evidenceRequirements: [
        {
          id: `ev-clone-${i}`,
          documentCategoryId: 'routine_receipt',
          documentName: 'Routine Receipt',
          required: true,
          status: 'Verified'
        }
      ]
    });
  }

  return [...obligations, ...clonedObligations];
}

class ComplianceService {
  private obligations: ComplianceObligation[] | null = null;
  private histories: Record<string, ComplianceHistoryEvent[]> = {};

  async getObligations(businessId: string): Promise<ComplianceObligation[]> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!this.obligations) {
      this.obligations = generateMockObligations(businessId);
    }
    return this.obligations;
  }

  async getObligationById(businessId: string, obligationId: string): Promise<ComplianceObligation | null> {
    const obs = await this.getObligations(businessId);
    return obs.find(o => o.id === obligationId) || null;
  }

  async getSummary(businessId: string): Promise<ComplianceSummary> {
    const obs = await this.getObligations(businessId);
    const summary: ComplianceSummary = {
      totalApplicable: obs.length,
      compliant: obs.filter(o => o.status === 'COMPLIANT').length,
      dueSoon: obs.filter(o => o.status === 'DUE_SOON').length,
      overdue: obs.filter(o => o.status === 'OVERDUE').length,
      atRisk: obs.filter(o => o.risk.level === 'HIGH' || o.risk.level === 'CRITICAL').length
    };
    return summary;
  }

  async submitCompliance(businessId: string, obligationId: string): Promise<ComplianceObligation> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const obs = await this.getObligations(businessId);
    const obIndex = obs.findIndex(o => o.id === obligationId);
    
    if (obIndex === -1) throw new Error('Obligation not found');

    const ob = obs[obIndex];
    ob.status = 'SUBMITTED';
    ob.updatedAt = formatISO(new Date());

    // Risk recalculation
    ob.risk = calculateRisk(ob.status, ob.dueDate, ob.evidenceRequirements.filter(e => e.status === 'Missing').length, false);

    // Add history
    this.addHistoryEvent(obligationId, 'SUBMITTED', 'Business User');

    return ob;
  }

  async markCompliant(businessId: string, obligationId: string, reviewerName: string): Promise<ComplianceObligation> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const obs = await this.getObligations(businessId);
    const obIndex = obs.findIndex(o => o.id === obligationId);
    
    if (obIndex === -1) throw new Error('Obligation not found');

    const ob = obs[obIndex];
    ob.status = 'COMPLIANT';
    ob.completedAt = formatISO(new Date());
    ob.nextDueDate = calculateNextDueDate(ob.dueDate, ob.frequency);
    ob.updatedAt = formatISO(new Date());

    ob.risk = calculateRisk(ob.status, ob.dueDate, 0, false);

    this.addHistoryEvent(obligationId, 'COMPLIANT', reviewerName);

    return ob;
  }

  async updateEvidenceStatus(
    businessId: string, 
    obligationId: string, 
    evidenceId: string, 
    documentId: string
  ): Promise<ComplianceObligation> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const obs = await this.getObligations(businessId);
    const ob = obs.find(o => o.id === obligationId);
    if (!ob) throw new Error('Obligation not found');

    const ev = ob.evidenceRequirements.find(e => e.id === evidenceId);
    if (ev) {
      ev.status = 'Uploaded';
      ev.linkedDocumentId = documentId;
      this.addHistoryEvent(obligationId, 'EVIDENCE_UPLOADED', 'Business User', { evidenceId, documentId });
    }

    // Recalc risk
    const missingCount = ob.evidenceRequirements.filter(e => e.status === 'Missing').length;
    ob.risk = calculateRisk(ob.status, ob.dueDate, missingCount, ob.status === 'REJECTED');

    return ob;
  }

  async getHistory(obligationId: string): Promise<ComplianceHistoryEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!this.histories[obligationId]) {
      // Seed some dummy history
      this.histories[obligationId] = [
        {
          id: `hist-${Date.now()}-1`,
          obligationId,
          action: 'CREATED',
          performedBy: 'System',
          timestamp: formatISO(addDays(new Date(), -30))
        }
      ];
    }
    return [...this.histories[obligationId]].reverse(); // newest first
  }

  async getPendingSubmissions(): Promise<ComplianceObligation[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // For demo purposes, we will return some mock submissions
    // In a real app this would query across all businesses
    if (!this.obligations) {
      this.obligations = generateMockObligations('mock-business-123');
    }
    return this.obligations.filter(o => o.status === 'SUBMITTED' || o.status === 'UNDER_REVIEW');
  }

  private addHistoryEvent(obligationId: string, action: ComplianceHistoryEvent['action'], performedBy: string, metadata?: Record<string, string>) {
    if (!this.histories[obligationId]) {
      this.histories[obligationId] = [];
    }
    this.histories[obligationId].push({
      id: `hist-${Date.now()}-${Math.random()}`,
      obligationId,
      action,
      performedBy,
      timestamp: formatISO(new Date()),
      metadata
    });
  }
}

export const complianceService = new ComplianceService();
