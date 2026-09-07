/**
 * Dashboard Store — Zustand
 *
 * Global state for the dashboard module.
 * Handles: stats, applications, actions, approvals, activity, notifications.
 * No sessionStorage persistence — data is re-fetched each session.
 */

import { create } from 'zustand';
import type {
  Application,
  ActionItem,
  Approval,
  Activity,
  Notification,
  DashboardStats,
} from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';

interface DashboardStore {
  // State
  stats: DashboardStats | null;
  applications: Application[];
  selectedApplication: Application | null;
  actions: ActionItem[];
  approvals: Approval[];
  activity: Activity[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  // Computed
  unreadCount: number;

  // Actions
  fetchAll: () => Promise<void>;
  fetchApplication: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearSelectedApplication: () => void;
}

export const useDashboardStore = create<DashboardStore>()((set, get) => ({
  // Initial state
  stats: null,
  applications: [],
  selectedApplication: null,
  actions: [],
  approvals: [],
  activity: [],
  notifications: [],
  isLoading: false,
  error: null,

  // Computed
  get unreadCount() {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stats, applications, actions, approvals, activity, notifications] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getApplications(),
          dashboardService.getActions(),
          dashboardService.getApprovals(),
          dashboardService.getActivity(),
          dashboardService.getNotifications(),
        ]);
      set({
        stats,
        applications,
        actions,
        approvals,
        activity,
        notifications,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: 'Failed to load dashboard data.' });
    }
  },

  fetchApplication: async (id) => {
    try {
      const app = await dashboardService.getApplication(id);
      set({ selectedApplication: app });
    } catch {
      set({ error: 'Failed to load application details.' });
    }
  },

  markNotificationRead: async (id) => {
    await dashboardService.markNotificationRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllRead: async () => {
    await dashboardService.markAllNotificationsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  clearSelectedApplication: () => {
    set({ selectedApplication: null });
  },
}));
