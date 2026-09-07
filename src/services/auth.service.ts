/**
 * Mock Authentication Service
 *
 * This service mirrors the interface of the future FastAPI backend.
 * To connect to a real backend, replace the implementation of `login()`
 * with an actual HTTP call — all consumer components remain unchanged.
 *
 * Expected backend contract:
 *   POST /api/v1/auth/login
 *   Body: { email, password, role }
 *   Response: { user, token, expiresIn }
 */

import type {
  AuthResponse,
  AuthError,
  LoginCredentials,
  User,
} from '@/types/auth.types';
import { delay } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mock user database (removed when real backend is connected)
// ---------------------------------------------------------------------------

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'business@example.com': {
    password: 'password123',
    user: {
      id: 'usr_01',
      email: 'business@example.com',
      name: 'Rajesh Kumar',
      role: 'business_user',
      organizationName: 'Kumar Industries Pvt. Ltd.',
      organizationId: 'org_001',
      isVerified: true,
      lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  'officer@gov.in': {
    password: 'govpass123',
    user: {
      id: 'usr_02',
      email: 'officer@gov.in',
      name: 'Priya Sharma',
      role: 'government_officer',
      organizationName: 'Ministry of Commerce & Industry',
      organizationId: 'org_gov_001',
      isVerified: true,
      lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    },
  },
};

// ---------------------------------------------------------------------------
// Auth service interface
// ---------------------------------------------------------------------------

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  validateSession(token: string): Promise<User | null>;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

class AuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network latency
    await delay(900);

    const record = MOCK_USERS[credentials.email.toLowerCase()];

    if (!record || record.password !== credentials.password) {
      const error: AuthError = {
        code: 'INVALID_CREDENTIALS',
        message: 'The email or password you entered is incorrect.',
      };
      throw error;
    }

    if (record.user.role !== credentials.role) {
      const error: AuthError = {
        code: 'INVALID_CREDENTIALS',
        message: `This account is registered as a ${record.user.role === 'business_user' ? 'Business User' : 'Government Officer'}. Please select the correct role.`,
      };
      throw error;
    }

    // Produce a mock opaque token (never a real JWT — no sensitive data embedded)
    const token = `mock_session_${record.user.id}_${Date.now()}`;

    return {
      user: record.user,
      token,
      expiresIn: credentials.rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60, // 30d or 8h
    };
  }

  async logout(): Promise<void> {
    await delay(200);
    // In production: POST /api/v1/auth/logout with session token
  }

  async validateSession(token: string): Promise<User | null> {
    await delay(300);
    // In production: GET /api/v1/auth/me with Authorization header
    // Mock: simply check if token format matches
    if (token.startsWith('mock_session_')) {
      return null; // Force re-auth in mock (no persistence across tabs in demo)
    }
    return null;
  }
}

// Export singleton instance
export const authService: IAuthService = new AuthService();
