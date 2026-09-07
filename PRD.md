# PRD — IndustriaConnect: Industrial Approvals & Compliance Platform

**Document version:** 1.0  
**Status:** Active — Task 1 (Authentication) Implemented  
**Project:** SIH 2026, Problem Statement 130

---

## 1. Product Overview

IndustriaConnect is an integrated digital platform that streamlines industrial approvals, compliance monitoring, and access to government support services. It creates a unified interface for businesses, regulatory bodies, and government departments, replacing fragmented, paper-based processes with a single-window digital experience.

---

## 2. Problem Statement

Industrial businesses in India face:
- Fragmented approval processes across multiple departments and portals
- Lack of real-time visibility into application status
- Manual, paper-based document submission and verification
- Difficulty discovering and accessing applicable government schemes
- Compliance tracking spread across disconnected systems

These inefficiencies increase time-to-operation for new businesses and create compliance risks for existing ones.

---

## 3. Target Users

### Primary: Business Users
Industrial enterprise owners, compliance officers, and authorized representatives of registered businesses seeking licenses, clearances, and regulatory compliance.

### Secondary: Government Officers
Inspectors, regulators, and administrative officers from ministries and state departments who review applications, conduct inspections, and issue approvals.

---

## 4. Login Feature Objective (Task 1)

Establish a secure, production-quality authentication entry point that:
- Enforces role-based access (Business User vs. Government Officer)
- Validates credentials before granting access
- Provides clear, actionable feedback for all auth states
- Builds user trust through a professional, government-grade visual identity
- Lays the foundation for future modules (document verification, dashboard)

---

## 5. Functional Requirements

### Authentication
| ID | Requirement |
|----|-------------|
| FR-01 | User can log in with email and password |
| FR-02 | User can select role: Business User or Government Officer |
| FR-03 | Invalid credentials display a clear, non-technical error message |
| FR-04 | Successful login redirects to the user dashboard |
| FR-05 | Password can be shown or hidden via toggle |
| FR-06 | "Keep me signed in" persists session across browser sessions |
| FR-07 | Forgot password link navigates to password reset flow |
| FR-08 | Registration CTA links to the business registration page |
| FR-09 | Form validates fields before submission (client-side) |
| FR-10 | Submit button is disabled when fields are empty or invalid |

### Auth States
| State | Behavior |
|-------|----------|
| Idle | Normal form, all fields empty |
| Validating | Field-level errors appear on blur |
| Loading | Button shows spinner, form disabled |
| Error | Banner message above form |
| Success | Success indicator → redirect to /dashboard |
| Disabled | Button disabled when form invalid |

---

## 6. Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| Accessibility | WCAG 2.1 AA — keyboard navigable, screen reader compatible, visible focus indicators |
| Responsiveness | Functional on mobile (375px+), tablet (768px+), desktop (1280px+) |
| Performance | Login page loads in < 2s on 4G connection |
| Security | Passwords never logged, tokens never exposed in UI, sessionStorage for session |
| Reliability | Errors handled gracefully; no unhandled exceptions reach the user |
| Localization | English (en-IN) — designed for future i18n extension |

---

## 7. User Flow — Authentication

```
User navigates to / or /login
       ↓
Login page renders (idle state)
       ↓
User selects role → enters email → enters password
       ↓
Client-side validation passes
       ↓
User clicks "Sign in"
       ↓
Loading state (button spinner, form disabled, ~900ms)
       ↓
       ├── AUTH SUCCESS → success state → redirect to /dashboard
       └── AUTH FAILURE → error banner → user corrects input → retry
```

---

## 8. Acceptance Criteria

- [x] Login page renders at `/login` with correct layout and branding
- [x] Role selector switches between Business User and Government Officer
- [x] Email field validates format on blur
- [x] Password field validates minimum length on blur
- [x] Show/hide toggle works and is keyboard accessible
- [x] "Keep me signed in" checkbox is functional
- [x] Submit button disabled until form is valid
- [x] Loading state shows spinner and disables inputs
- [x] Incorrect credentials display an error banner
- [x] Successful login redirects to `/dashboard`
- [x] Responsive: works on 375px mobile through 1440px desktop
- [x] No console errors in production build
- [x] "Register your business" and "Forgot password?" links work

---

## 9. Future Integration Points

| Module | Notes |
|--------|-------|
| Task 2 — Document Verification | Will use the same `AuthLayout`, `FormField`, and auth store established here |
| Task 3 — Dashboard | The `DashboardPage` placeholder and route exist; Task 3 fills the content |
| Backend (FastAPI) | `auth.service.ts` interface is stable; swap mock implementation for real HTTP calls |
| SSO / OAuth | Router and auth hook are designed to accept additional auth methods |
| OTP / MFA | Password step can be extended with a multi-step form flow |
| Session refresh | `validateSession()` in auth service is scaffolded for token refresh |
