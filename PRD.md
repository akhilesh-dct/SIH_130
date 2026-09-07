# PRD — IndustriaConnect: Industrial Approvals & Compliance Platform

**Document version:** 2.0  
**Status:** Active — Task 1 (Auth) + Task 2 (Docs) + Task 3 (Dashboard) Implemented  
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
| Task 2 — Document Verification | ✅ Implemented — see Section 10 below |
| Task 3 — Dashboard | The `DashboardPage` placeholder and route exist; Task 3 fills the content |
| Backend (FastAPI) | `auth.service.ts` interface is stable; swap mock implementation for real HTTP calls |
| SSO / OAuth | Router and auth hook are designed to accept additional auth methods |
| OTP / MFA | Password step can be extended with a multi-step form flow |
| Session refresh | `validateSession()` in auth service is scaffolded for token refresh |

---

## 10. Document Verification Feature (Task 2)

### Feature Objective

Provide a professional document management workspace where business users can:
- View all required and optional compliance documents for their application
- Upload documents in accepted formats
- Track verification status for each document
- Review verification check results and identified issues
- Take corrective action on documents requiring attention

### Documents in Scope

| Document | Category | Required |
|----------|----------|---------|
| Certificate of Incorporation | Corporate | Yes |
| PAN Card (Organization) | Tax | Yes |
| GST Registration Certificate | Tax | Yes |
| Factory License | Factory | Yes |
| Environmental Consent Order | Environment | Yes |
| Address Proof (Registered Office) | Identity | Yes |
| Project Report / DPR | Financial | No |

### User Journey

```
Login → Dashboard → Documents
  → Select document from list
  → Upload file (drag/drop or browse)
  → File uploaded → queued for verification
  → Verification result: Verified / Needs Attention / Rejected
  → If Needs Attention: review issue → replace document
  → All required documents verified → Continue to Application
```

### Document Statuses

| Status | Description |
|--------|-------------|
| Not Uploaded | No file submitted |
| Uploaded | File submitted, verification pending |
| Verifying | Under active review |
| Verified | All checks passed |
| Needs Attention | Issue identified — user action required |
| Rejected | Document rejected — must re-submit |

### Verification Checks (per document)

1. Document format — file type and structure
2. Required fields — all mandatory fields present
3. Document legibility — content readable
4. Information consistency — matches application data
5. Validity period — within valid date range

### Acceptance Criteria — Task 2

- [x] Document list shows all required and optional documents grouped
- [x] Each document shows name, category, status badge, upload date
- [x] Clicking a document selects it and shows preview + details
- [x] Upload zone supports click-to-browse and drag-and-drop
- [x] Upload progress shown with animated bar
- [x] Verified documents show green status and checklist of passed checks
- [x] Needs Attention documents show issue card with description and suggested action
- [x] Replace file option available for needs-attention/rejected documents
- [x] Verification summary bar shows aggregate counts
- [x] Responsive: mobile tab navigation, tablet two-panel, desktop three-panel
- [x] Continue to Application button links to application workflow
- [x] No console errors in production build
- [x] All existing routes (login, dashboard) continue to work


### Verification Summary

Shows aggregate counts visible at the top of the workspace:
- Required, Uploaded, Verified, Needs Attention, Pending, Rejected

## Task 3: Business Dashboard

The business dashboard serves as the central workspace for the authenticated user, summarizing all ongoing and completed activities within IndustriaConnect.

### Core Objectives
1. **At-a-Glance Clarity**: Instantly show application statuses and compliance metrics.
2. **Action-Oriented Design**: Highlight pending items that block progress.
3. **Comprehensive Tracking**: Let users see where applications are stuck in the bureaucracy.
4. **Navigational Shell**: Implement the primary app layout (sidebar + header) for all views.

### Modules & Widgets
- **Global Navigation (AppLayout)**: Responsive sidebar for desktop, drawer for mobile. Notification bell with unread count.
- **Metric Row (KPIs)**: High-level counts for total applications, required actions, document statuses, and approvals.
- **Action Required**: High-priority alerts requiring user intervention (e.g., query raised by officer, missing documents).
- **Application Status Feed**: Sortable list of ongoing applications showing current stage, department, and progress bar.
- **Document Status Widget**: Summarized view of required vs. verified documents with quick links to the Document Verification module.
- **Approval Progress Widget**: Shows completion percentage of multi-step approvals.
- **Recent Activity Feed**: Chronological log of system and user events.
- **Application Detail View (`/applications/:id`)**: Deep-dive page showing full timeline of a specific application and metadata (department, reference number, SLA deadline).

### UX/UI Philosophy
- **Restraint & Utility**: Focus on fast information retrieval, avoiding decorative clutter.
- **Severity-based Coloring**: Use standard semantic colors for urgency (red = urgent, amber = warning, green = success).
- **Smooth Navigation**: Zero page reloads across the dashboard, documents, and application details.
