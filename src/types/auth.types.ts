// Auth domain types for SIH 130 Industrial Platform
// Interface-stable: designed to match FastAPI backend contract

export type UserRole = 'business_user' | 'officer' | 'department_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationName: string;
  organizationId: string;
  isVerified: boolean;
  lastLoginAt: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  rememberMe: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;           // Opaque session token — never exposed in UI
  expiresIn: number;       // seconds
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;          // field-level errors from server
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_NOT_VERIFIED'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: AuthError | null;
}
