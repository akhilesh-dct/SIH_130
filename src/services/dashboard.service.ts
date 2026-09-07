/**
 * Dashboard Service — Mock implementation
 *
 * IAppdashboardService interface mirrors the future FastAPI contract:
 *   GET /api/v1/dashboard/stats          → DashboardStats
 *   GET /api/v1/applications             → Application[]
 *   GET /api/v1/applications/:id         → Application
 *   GET /api/v1/actions                  → ActionItem[]
 *   GET /api/v1/approvals                → Approval[]
 *   GET /api/v1/activity                 → Activity[]
 *   GET /api/v1/notifications            → Notification[]
 *   PATCH /api/v1/notifications/:id/read → void
 */

import type {
  Application,
  ActionItem,
  Approval,
  Activity,
  Notification,
  DashboardStats,
} from '@/types/dashboard.types';

import {
  MOCK_APPLICATIONS,
  MOCK_ACTIONS,
  MOCK_APPROVALS,
  MOCK_ACTIVITIES,
  MOCK_NOTIFICATIONS,
  MOCK_DASHBOARD_STATS,
} from '@/data/dashboard';

import { delay } from '@/lib/utils';

// In-memory mutable notification state
let notifications = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IDashboardService {
  getStats(): Promise<DashboardStats>;
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | null>;
  getActions(): Promise<ActionItem[]>;
  getApprovals(): Promise<Approval[]>;
  getActivity(limit?: number): Promise<Activity[]>;
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

class DashboardService implements IDashboardService {
  async getStats(): Promise<DashboardStats> {
    await delay(300);
    return { ...MOCK_DASHBOARD_STATS };
  }

  async getApplications(): Promise<Application[]> {
    await delay(400);
    return MOCK_APPLICATIONS.map((a) => ({ ...a }));
  }

  async getApplication(id: string): Promise<Application | null> {
    await delay(250);
    return MOCK_APPLICATIONS.find((a) => a.id === id) ?? null;
  }

  async getActions(): Promise<ActionItem[]> {
    await delay(250);
    return MOCK_ACTIONS.map((a) => ({ ...a }));
  }

  async getApprovals(): Promise<Approval[]> {
    await delay(250);
    return MOCK_APPROVALS.map((a) => ({ ...a }));
  }

  async getActivity(limit = 8): Promise<Activity[]> {
    await delay(250);
    return MOCK_ACTIVITIES.slice(0, limit).map((a) => ({ ...a }));
  }

  async getNotifications(): Promise<Notification[]> {
    await delay(200);
    return notifications.map((n) => ({ ...n }));
  }

  async markNotificationRead(id: string): Promise<void> {
    await delay(100);
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
  }

  async markAllNotificationsRead(): Promise<void> {
    await delay(150);
    notifications = notifications.map((n) => ({ ...n, isRead: true }));
  }
}

export const dashboardService: IDashboardService = new DashboardService();
