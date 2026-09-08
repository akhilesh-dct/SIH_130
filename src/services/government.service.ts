import { delay } from '@/lib/utils';
import type { 
  GovernmentApplication, 
  DelayReason, 
  RiskFactor, 
  DepartmentPerformance, 
  OfficerWorkload,
  Escalation,
  AuditLog,
  AuditLogAction,
  GovernmentApplicationStatus
} from '@/types/government.types';
import { MOCK_APPLICATIONS } from '@/data/dashboard';

// --- Helper Functions for deterministic rules ---

function calculateSLA(app: any) {
  if (!app.slaDeadline) return { slaDaysRemaining: null, slaDaysOverdue: null, slaStatus: 'ON_TRACK' };
  
  const now = new Date();
  const deadline = new Date(app.slaDeadline);
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (['approved', 'rejected', 'withdrawn'].includes(app.status)) {
    return { slaDaysRemaining: diffDays > 0 ? diffDays : 0, slaDaysOverdue: 0, slaStatus: 'COMPLETED' as const };
  }

  if (diffDays < 0) {
    return { slaDaysRemaining: 0, slaDaysOverdue: Math.abs(diffDays), slaStatus: 'OVERDUE' as const };
  } else if (diffDays <= 2) {
    return { slaDaysRemaining: diffDays, slaDaysOverdue: 0, slaStatus: 'CRITICAL' as const };
  } else if (diffDays <= 5) {
    return { slaDaysRemaining: diffDays, slaDaysOverdue: 0, slaStatus: 'AT_RISK' as const };
  } else {
    return { slaDaysRemaining: diffDays, slaDaysOverdue: 0, slaStatus: 'ON_TRACK' as const };
  }
}

function calculateRiskScore(app: any, slaResult: any, _delayReasons: DelayReason[], officerWorkload?: OfficerWorkload) {
  let score = 0;
  const factors: RiskFactor[] = [];

  const addFactor = (type: string, description: string, points: number) => {
    score += points;
    factors.push({
      id: `rf_${Date.now()}_${Math.random()}`,
      applicationId: app.id,
      factorType: type,
      score: points,
      description,
      createdAt: new Date().toISOString()
    });
  };

  if (slaResult.slaStatus === 'OVERDUE') {
    addFactor('SLA_BREACH', 'SLA deadline has been breached', 30);
  } else if (slaResult.slaStatus === 'CRITICAL') {
    addFactor('SLA_APPROACHING', `Deadline is in ${slaResult.slaDaysRemaining} days`, 20);
  }

  if (app.status === 'inspection_scheduled') {
    addFactor('INSPECTION_PENDING', 'Inspection is currently pending', 15);
  }

  if (app.status === 'query_raised') {
    addFactor('QUERY_UNRESOLVED', 'Query is waiting to be resolved', 15);
  }

  if (app.status === 'documents_required') {
    addFactor('MISSING_DOCUMENT', 'Applicant needs to submit missing documents', 10);
  }

  if (officerWorkload && officerWorkload.workloadLevel === 'HIGH') {
    addFactor('OFFICER_WORKLOAD', 'Assigned officer has high workload', 10);
  }

  const finalScore = Math.min(100, score);
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (finalScore > 80) riskLevel = 'CRITICAL';
  else if (finalScore > 60) riskLevel = 'HIGH';
  else if (finalScore > 30) riskLevel = 'MEDIUM';

  return { riskScore: finalScore, riskLevel, riskFactors: factors };
}

function calculateWorkloadLevel(activeCount: number): OfficerWorkload['workloadLevel'] {
  if (activeCount <= 5) return 'LOW';
  if (activeCount <= 10) return 'NORMAL';
  if (activeCount <= 15) return 'HIGH';
  return 'OVERLOADED';
}

// --- Mock Data Setup ---

let mockGovernmentApplications: GovernmentApplication[] = MOCK_APPLICATIONS.map(app => {
  // Let's add some artificial data for the government side based on dashboard mock
  const isPending = !['approved', 'rejected', 'withdrawn'].includes(app.status);
  
  // Fake officer
  const assignedOfficerId = isPending ? (Math.random() > 0.5 ? 'usr_02' : 'usr_other') : null;
  const assignedOfficerName = assignedOfficerId === 'usr_02' ? 'Priya Sharma' : (assignedOfficerId ? 'Rahul Joshi' : null);

  const delayReasons: DelayReason[] = [];
  if (app.status === 'inspection_scheduled') {
    delayReasons.push({
      id: `dr_${app.id}_1`,
      applicationId: app.id,
      reasonType: 'INSPECTION_PENDING',
      description: 'Waiting for field officer inspection report.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      resolvedAt: null
    });
  }
  
  const slaResult = calculateSLA(app);
  const riskResult = calculateRiskScore(app, slaResult, delayReasons);

  return {
    ...app,
    businessId: 'org_001',
    businessName: 'Kumar Industries Pvt. Ltd.',
    assignedOfficerId,
    assignedOfficerName,
    ...slaResult,
    ...riskResult,
    delayReasons
  } as unknown as GovernmentApplication;
});

let mockAuditLogs: AuditLog[] = [
  {
    id: 'al_1',
    timestamp: new Date().toISOString(),
    userId: 'usr_02',
    userName: 'Priya Sharma',
    action: 'LOGIN',
    details: 'User logged in successfully'
  }
];

let mockEscalations: Escalation[] = [];

// --- Service Implementation ---

export interface IGovernmentService {
  getDashboardKPIs(): Promise<{
    totalApplications: number;
    pendingReview: number;
    atRisk: number;
    overdue: number;
    approved: number;
  }>;
  getApplicationsRequiringAttention(): Promise<GovernmentApplication[]>;
  getApplications(filters?: { department?: string, status?: string, riskLevel?: string, officerId?: string }): Promise<GovernmentApplication[]>;
  getApplicationDetails(id: string): Promise<GovernmentApplication | null>;
  assignOfficer(applicationId: string, officerId: string, officerName: string, adminId: string, adminName: string): Promise<void>;
  raiseQuery(applicationId: string, title: string, message: string, deadline: string, officerId: string, officerName: string): Promise<void>;
  updateStatus(applicationId: string, status: GovernmentApplicationStatus, officerId: string, officerName: string, reason?: string): Promise<void>;
  escalateApplication(applicationId: string, reason: string, severity: 'Medium'|'High'|'Critical', adminId: string, adminName: string): Promise<void>;
  getDepartmentPerformance(): Promise<DepartmentPerformance[]>;
  getOfficerWorkload(departmentId?: string): Promise<OfficerWorkload[]>;
  getMyWork(officerId: string): Promise<GovernmentApplication[]>;
  getAuditLogs(): Promise<AuditLog[]>;
  getEscalations(): Promise<Escalation[]>;
}

class GovernmentService implements IGovernmentService {
  
  private logAction(userId: string, userName: string, action: AuditLogAction, details: string) {
    mockAuditLogs.unshift({
      id: `al_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      action,
      details
    });
  }

  async getDashboardKPIs() {
    await delay(300);
    const total = mockGovernmentApplications.length;
    const pending = mockGovernmentApplications.filter(a => !['approved', 'rejected', 'withdrawn'].includes(a.status)).length;
    const atRisk = mockGovernmentApplications.filter(a => a.slaStatus === 'AT_RISK' || a.slaStatus === 'CRITICAL').length;
    const overdue = mockGovernmentApplications.filter(a => a.slaStatus === 'OVERDUE').length;
    const approved = mockGovernmentApplications.filter(a => a.status === 'approved').length;

    return { totalApplications: total, pendingReview: pending, atRisk, overdue, approved };
  }

  async getApplicationsRequiringAttention() {
    await delay(300);
    return mockGovernmentApplications
      .filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL' || a.slaStatus === 'OVERDUE')
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);
  }

  async getApplications(filters?: any) {
    await delay(400);
    let result = [...mockGovernmentApplications];
    if (filters) {
      if (filters.department && filters.department !== 'all') {
        result = result.filter(a => a.department === filters.department);
      }
      if (filters.status && filters.status !== 'all') {
        result = result.filter(a => a.status === filters.status);
      }
      if (filters.riskLevel && filters.riskLevel !== 'all') {
        result = result.filter(a => a.riskLevel === filters.riskLevel);
      }
      if (filters.officerId && filters.officerId !== 'all') {
        result = result.filter(a => a.assignedOfficerId === filters.officerId);
      }
    }
    return result;
  }

  async getApplicationDetails(id: string) {
    await delay(200);
    return mockGovernmentApplications.find(a => a.id === id) || null;
  }

  async assignOfficer(applicationId: string, officerId: string, officerName: string, adminId: string, adminName: string) {
    await delay(400);
    const appIndex = mockGovernmentApplications.findIndex(a => a.id === applicationId);
    if (appIndex > -1) {
      mockGovernmentApplications[appIndex] = {
        ...mockGovernmentApplications[appIndex],
        assignedOfficerId: officerId,
        assignedOfficerName: officerName
      };
      // Recalculate risk? Optional
      this.logAction(adminId, adminName, 'APPLICATION_ASSIGNED', `Assigned application ${applicationId} to ${officerName}`);
    }
  }

  async raiseQuery(applicationId: string, title: string, _message: string, _deadline: string, officerId: string, officerName: string) {
    await delay(500);
    const appIndex = mockGovernmentApplications.findIndex(a => a.id === applicationId);
    if (appIndex > -1) {
      const app = mockGovernmentApplications[appIndex];
      const newStatus = 'query_raised';
      
      const newDelay: DelayReason = {
        id: `dr_${Date.now()}`,
        applicationId,
        reasonType: 'QUERY_UNRESOLVED',
        description: title,
        createdAt: new Date().toISOString(),
        resolvedAt: null
      };

      const updatedApp = {
        ...app,
        status: newStatus as GovernmentApplicationStatus,
        delayReasons: [...app.delayReasons, newDelay],
        updatedAt: new Date().toISOString()
      };
      
      // recalc risk
      const riskResult = calculateRiskScore(updatedApp, {slaStatus: app.slaStatus, slaDaysRemaining: app.slaDaysRemaining}, updatedApp.delayReasons);
      mockGovernmentApplications[appIndex] = { ...updatedApp, ...riskResult };

      this.logAction(officerId, officerName, 'QUERY_RAISED', `Raised query on ${applicationId}: ${title}`);
      this.logAction(officerId, officerName, 'STATUS_CHANGED', `Changed status of ${applicationId} to ${newStatus}`);
    }
  }

  async updateStatus(applicationId: string, status: GovernmentApplicationStatus, officerId: string, officerName: string, reason?: string) {
    await delay(400);
    const appIndex = mockGovernmentApplications.findIndex(a => a.id === applicationId);
    if (appIndex > -1) {
      mockGovernmentApplications[appIndex] = {
        ...mockGovernmentApplications[appIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      this.logAction(officerId, officerName, 'STATUS_CHANGED', `Status of ${applicationId} changed to ${status}${reason ? ' - ' + reason : ''}`);
    }
  }

  async escalateApplication(applicationId: string, reason: string, severity: 'Medium'|'High'|'Critical', adminId: string, adminName: string) {
    await delay(400);
    const app = mockGovernmentApplications.find(a => a.id === applicationId);
    if (app) {
      const newEscalation: Escalation = {
        id: `esc_${Date.now()}`,
        applicationId,
        applicationName: app.name,
        departmentName: app.department,
        reason,
        severity,
        createdAt: new Date().toISOString(),
        assignedTo: 'admin@gov.in',
        status: 'Open'
      };
      mockEscalations.unshift(newEscalation);
      this.logAction(adminId, adminName, 'ESCALATED', `Escalated application ${applicationId}: ${reason}`);
    }
  }

  async getDepartmentPerformance() {
    await delay(400);
    
    // Group by department
    const depts: Record<string, GovernmentApplication[]> = {};
    mockGovernmentApplications.forEach(app => {
      if (!depts[app.department]) depts[app.department] = [];
      depts[app.department].push(app);
    });

    return Object.keys(depts).map(dept => {
      const apps = depts[dept];
      const completed = apps.filter(a => a.status === 'approved' || a.status === 'rejected');
      const overdue = apps.filter(a => a.slaStatus === 'OVERDUE');
      const atRisk = apps.filter(a => a.slaStatus === 'AT_RISK' || a.slaStatus === 'CRITICAL');
      
      let processingSum = 0;
      let onTimeCount = 0;

      completed.forEach(c => {
        const sub = c.submittedAt ? new Date(c.submittedAt).getTime() : 0;
        const end = new Date(c.updatedAt).getTime();
        processingSum += Math.max(1, (end - sub) / (1000 * 60 * 60 * 24));

        if (c.slaDeadline) {
           const dl = new Date(c.slaDeadline).getTime();
           if (end <= dl) onTimeCount++;
        } else {
           onTimeCount++;
        }
      });

      const avgProcessing = completed.length ? Math.round((processingSum / completed.length) * 10) / 10 : 0;
      const slaComp = completed.length ? Math.round((onTimeCount / completed.length) * 100) : 100;

      const bottlenecks: Record<string, number> = {};
      apps.forEach(a => {
        a.delayReasons.forEach(dr => {
          if (!dr.resolvedAt) {
            bottlenecks[dr.reasonType] = (bottlenecks[dr.reasonType] || 0) + 1;
          }
        });
      });

      return {
        departmentId: dept,
        departmentName: dept,
        totalApplications: apps.length,
        averageProcessingDays: avgProcessing,
        slaCompliancePercentage: slaComp,
        overdueCount: overdue.length,
        atRiskCount: atRisk.length,
        bottlenecks
      };
    });
  }

  async getOfficerWorkload(departmentId?: string) {
    await delay(300);
    // Group by officer
    const officers: Record<string, OfficerWorkload> = {};
    
    mockGovernmentApplications.forEach(app => {
      if (departmentId && app.department !== departmentId) return;
      if (!app.assignedOfficerId || !app.assignedOfficerName) return;

      if (!officers[app.assignedOfficerId]) {
        officers[app.assignedOfficerId] = {
          officerId: app.assignedOfficerId,
          officerName: app.assignedOfficerName,
          departmentId: app.department,
          departmentName: app.department,
          activeApplications: 0,
          overdue: 0,
          atRisk: 0,
          workloadLevel: 'LOW'
        };
      }

      const o = officers[app.assignedOfficerId];
      if (!['approved', 'rejected', 'withdrawn'].includes(app.status)) {
        o.activeApplications++;
        if (app.slaStatus === 'OVERDUE') o.overdue++;
        if (app.slaStatus === 'AT_RISK' || app.slaStatus === 'CRITICAL') o.atRisk++;
      }
    });

    return Object.values(officers).map(o => ({
      ...o,
      workloadLevel: calculateWorkloadLevel(o.activeApplications)
    }));
  }

  async getMyWork(officerId: string) {
    await delay(300);
    return mockGovernmentApplications.filter(a => a.assignedOfficerId === officerId);
  }

  async getAuditLogs() {
    await delay(200);
    return [...mockAuditLogs];
  }

  async getEscalations() {
    await delay(300);
    return [...mockEscalations];
  }
}

export const governmentService = new GovernmentService();
