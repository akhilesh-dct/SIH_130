# TRD — IndustriaConnect: Technical Reference Document

**Document version:** 2.0  
**Status:** Task 1 + 2 + 3 Implemented  
**Project:** SIH 2026, Problem Statement 130

---

## 1. Architecture Overview

IndustriaConnect is a client-side SPA (Single Page Application) with a clean separation between:
- **UI layer** — React components + Tailwind CSS
- **State layer** — Zustand store (global auth state)
- **Service layer** — Auth service (swappable mock/real)
- **Routing layer** — React Router v7 (declarative, nested routes)

```
Browser
  └── React SPA (Vite)
        ├── Router (React Router v7)
        ├── Pages
        │   ├── LoginPage
        │   └── DashboardPage (placeholder)
        ├── Components
        │   └── auth/ (AuthLayout, LoginForm, PasswordInput, ...)
        ├── Hooks
        │   └── useAuth (bridges store ↔ service ↔ router)
        ├── Store (Zustand)
        │   └── authStore (user, token, status, error)
        ├── Services
        │   └── auth.service.ts (mock → FastAPI-compatible)
        └── Types
            └── auth.types.ts
```

---

## 2. Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI rendering (new JSX transform, no React import needed) |
| TypeScript | 6.x | Static typing |
| Vite | 8.x | Build tool + dev server |
| Tailwind CSS | 4.x | Utility-first styling via CSS `@theme` (no JS config) |
| React Router | 7.x | SPA routing with `createBrowserRouter` |
| Zustand | 5.x | Lightweight global state |
| React Hook Form | 7.x | Form state management + validation integration |
| Zod | 4.x | Schema validation |
| Lucide React | 1.x | Icon set (tree-shakeable) |
| clsx + tailwind-merge | latest | Safe class name composition |

---

## 3. Routing Architecture

Routes are all declared in `src/router/index.tsx`. Adding a new module requires only adding an entry here.

```
/                   → redirect → /login
/login              → LoginPage          [public]
/register           → RegisterPage       [public, Task 2]
/forgot-password    → ForgotPasswordPage [public, Task 2]
/dashboard          → DashboardPage      [protected, Task 3]
/documents          → DocumentsPage      [protected, Task 2]
/applications       → ApplicationsPage  [protected]
/profile            → ProfilePage       [protected]
*                   → redirect → /login
```

**Protected route guard:** `ProtectedRoute` component checks `authStore.status`. If not `'authenticated'`, redirects to `/login`.

---

## 4. Component Architecture

### Auth Components (`src/components/auth/`)

| Component | Responsibility |
|-----------|---------------|
| `AuthLayout` | Page shell: brand panel + form panel, responsive |
| `LoginForm` | Complete form with all states, role selector, validation |
| `PasswordInput` | Input with show/hide toggle (forwardRef, accessible) |
| `FormField` | Label + input + error slot wrapper |
| `LoadingButton` | Submit button with spinner, disabled, and loading states |
| `ErrorMessage` | Field-level inline errors and form-level banner |

### Design Principles
- **No prop drilling** — each component is self-contained
- **forwardRef** — PasswordInput exposes ref for React Hook Form `Controller`
- **aria-*** — every interactive element has correct accessibility attributes
- **Compound semantics** — `form`, `label`, `button[type=submit]`, `role=radiogroup` used correctly

---

## 5. Authentication Abstraction

The auth service is interface-driven. The `IAuthService` interface defines:

```typescript
interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  validateSession(token: string): Promise<User | null>;
}
```

**Current implementation:** Mock service simulating network latency (900ms), credential matching against an in-memory user map.

**Production swap:** Replace the class body of `AuthService` with real `fetch` / `axios` calls to:
- `POST /api/v1/auth/login` → returns `{ user, token, expiresIn }`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me` with `Authorization: Bearer <token>`

**Zero UI changes required** on this swap — the hook, store, and components remain identical.

---

## 6. State Management

### Auth Store (`src/store/authStore.ts`)
Built with Zustand + `persist` middleware.

```typescript
// State shape
{
  user: User | null
  token: string | null     // Opaque token — not decoded in UI
  status: AuthStatus       // 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'
  error: AuthError | null
}
```

**Persistence:** `sessionStorage` (default). Token and user survive page refresh within same tab. Clears on tab close — appropriate for shared-workstation government contexts.

**"Keep me signed in":** When active, the backend would issue a longer-lived token. The mock service adjusts `expiresIn` accordingly. `localStorage` persistence could be switched in via Zustand middleware when the backend is connected.

---

## 7. Validation Approach

- **Library:** Zod v4 + `@hookform/resolvers`
- **Mode:** `onTouched` — errors appear after the user leaves a field (not on every keystroke)
- **Client-side rules:**
  - Email: required, valid format, max 254 chars
  - Password: required, min 8 chars
- **Server-side errors:** Returned as typed `AuthError` from the service, displayed as a form-level banner
- **Clearing errors:** Server error clears automatically when user modifies email or password

---

## 8. Design System

Tailwind v4 uses a CSS-first `@theme` block in `src/index.css` instead of a `tailwind.config.js` file.

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `brand-900` | `#0f2040` | Brand panel background |
| `brand-700` | `#1e3a5f` | Dark brand accents |
| `brand-500` | `#2563eb` | Primary action color |
| `neutral-950` | `#0f172a` | Body text |
| `neutral-600` | `#64748b` | Secondary text |
| `neutral-300` | `#e2e8f0` | Borders |
| `error-600` | `#dc2626` | Error state |

### Typography
- Font: **Inter** (Google Fonts CDN, 300–700 weights)
- Base: 16px / 1.5 line-height
- Scale: 12px body-small → 14px body → 16px label → 20px heading → 24px page-title

### Spacing
4px base grid. All component padding/margin follows 4px increments.

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Token exposure | Tokens stored in sessionStorage (not cookies, not localStorage by default) |
| Token display | Tokens are never rendered, logged, or included in error messages |
| Password logging | Passwords are never passed to analytics or error tracking |
| Form replay | Form resets on navigation; no autofill of password on error |
| XSS | React's JSX escaping + no dangerouslySetInnerHTML used anywhere |
| CSRF | Stateless token auth (not cookie-based) eliminates CSRF surface |
| Error messages | Non-technical messages that don't reveal system internals |

---

## 10. Future Backend Integration

### Expected FastAPI Endpoints

```
POST   /api/v1/auth/login          → AuthResponse
POST   /api/v1/auth/logout         → 204 No Content
GET    /api/v1/auth/me             → User
POST   /api/v1/auth/refresh        → { token, expiresIn }
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### Integration Steps
1. Replace `AuthService` class body with real HTTP calls using `fetch` or `axios`
2. Set `VITE_API_BASE_URL` in environment configuration
3. Add request interceptor for `Authorization: Bearer <token>` header
4. Handle token refresh in `validateSession()`
5. Store token in `httpOnly` cookie (if SSR) or keep in sessionStorage (if SPA-only)

### Environment Variables
```env
VITE_API_BASE_URL=https://api.industriaconnect.gov.in/api/v1
VITE_APP_ENV=production
```

---

## 11. Scalability Considerations

- **Code splitting:** React Router v7 supports `lazy()` — add `React.lazy()` to each page import for route-based code splitting as the app grows
- **Micro-frontends:** Vite module federation can be added for large team scenarios
- **i18n:** All user-facing strings are in JSX (not hardcoded in CSS) — extractable with `react-i18next`
- **Theme switching:** Tailwind v4 `@theme` supports light/dark via `@variant dark`
- **State scaling:** Zustand slices can be added without modifying the auth store

---

## 12. Folder Structure

```
src/
├── components/
│   └── auth/
│       ├── AuthLayout.tsx       # Page shell
│       ├── LoginForm.tsx        # Complete form
│       ├── PasswordInput.tsx    # Show/hide password
│       ├── FormField.tsx        # Label + input + error
│       ├── LoadingButton.tsx    # Submit with loading state
│       └── ErrorMessage.tsx    # Field/banner error display
├── hooks/
│   └── useAuth.ts               # Auth state + actions interface
├── lib/
│   ├── utils.ts                 # cn(), delay(), maskEmail()
│   └── validations.ts           # Zod schemas
├── pages/
│   ├── LoginPage.tsx            # /login
│   └── DashboardPage.tsx        # /dashboard (Task 3 placeholder)
├── router/
│   └── index.tsx                # All route declarations
├── services/
│   └── auth.service.ts          # Mock auth (swappable)
├── store/
│   └── authStore.ts             # Zustand auth store
├── types/
│   └── auth.types.ts            # Domain types
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind v4 @theme design tokens
```

---

## 12. Document Verification Module — Task 2

### Module Overview

The Document Verification module is a client-side workspace for document management and verification status display. It has no real backend — the mock service simulates the full flow.

### Component Architecture

```
pages/DocumentsPage.tsx              ← Dashboard-style orchestrator
  └── components/layout/AppLayout.tsx  ← Shared nav shell (used by all auth pages)
  └── components/documents/
      ├── DocumentFilters.tsx         ← Status and text search filters
      ├── DocumentTable.tsx           ← Main data table for documents
      ├── DocumentRow.tsx             ← Individual row in table
      ├── DocumentPreview.tsx         ← Mock document representation
      ├── DocumentDetails.tsx         ← Side panel for upload and details
      ├── DocumentUpload.tsx          ← Upload state machine component
      ├── DocumentVersionHistory.tsx  ← Shows past versions
      ├── DocumentTimeline.tsx        ← Audit trail feed
      ├── UploadProgress.tsx          ← Animated progress bar during upload
      ├── VerificationStatus.tsx      ← Status badge (shared)
      ├── VerificationChecklist.tsx   ← List of check results
      ├── VerificationIssue.tsx       ← Issue card for attention/rejected
      └── VerificationSummary.tsx     ← Aggregate counts header bar
```

### Data Layer

```
src/
├── types/document.types.ts    ← All TypeScript types for the domain
├── data/documents.ts          ← Mock data (replace with API fetch)
├── services/document.service.ts ← IDocumentService interface + mock impl
└── store/documentStore.ts     ← Zustand store (no persistence)
```

### TypeScript Types

```typescript
Document           // Core document entity
UploadedFile       // File metadata after upload
DocumentVersion    // Historical versions
DocumentHistory    // Audit trail events
VerificationResult // Result of a verification run
VerificationCheck  // Individual check item
VerificationIssue  // Identified issue with suggested action
VerificationSummary // Aggregate counts
DocumentUploadRequest / Response // API shapes
UploadState        // Discriminated union for upload UI state machine
```

### Service Interface (FastAPI Integration Boundary)

```typescript
interface IDocumentService {
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | null>;
  uploadFile(documentId, file, onProgress): Promise<DocumentUploadResponse>;
  removeFile(documentId: string): Promise<void>;
  getSummary(): Promise<VerificationSummary>;
}
```

**FastAPI endpoint mapping:**

| Method | Endpoint | Maps to |
|--------|----------|---------|
| GET | `/api/v1/documents` | `getDocuments()` |
| GET | `/api/v1/documents/:id` | `getDocument(id)` |
| POST | `/api/v1/documents/:id/upload` | `uploadFile()` |
| DELETE | `/api/v1/documents/:id/file` | `removeFile()` |
| GET | `/api/v1/documents/summary` | `getSummary()` |

### Upload State Machine

The `UploadState` type is a discriminated union:

```
idle → selected → uploading → success
                            → error → idle (on retry)
```

This drives all visual states in `DocumentUpload.tsx` without any conditional boolean flags.

### Routing

```
/documents                → DocumentsPage (list view, first doc auto-selected)
/documents/:documentId    → DocumentsPage (specific doc pre-selected — for future deep links)
```

### Layout Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| < 1024px (xl) | Stacked layout: Document Table followed by Details below if selected |
| ≥ 1024px (xl) | Dashboard layout: Data Table + Side panel for Details (sticky) |

### Mock Data Reset

The in-memory mock resets on page reload. When connecting to FastAPI, the mock data module (`src/data/documents.ts`) and mock service (`src/services/document.service.ts`) are the only files that need replacing.

### AppLayout — Task 3 Integration Point

`AppLayout` is the shared shell for all authenticated pages. Task 3 extended it to include:
- A collapsible sidebar navigation structure
- A mobile drawer layout
- A notification bell in the topbar with an unread badge and dropdown panel

Existing pages (Documents, Dashboard, Applications) automatically inherit this layout.

## 5. Task 3: Dashboard Architecture

### Store Architecture (Zustand)
The dashboard uses a dedicated `dashboardStore` to manage all its state. Unlike the document store, this data is heavily aggregated and primarily fetch-driven.
- State: `stats`, `applications`, `actions`, `approvals`, `activity`, `notifications`.
- Computed: `unreadCount`.
- Methods: parallel data fetching via `Promise.all` in `fetchAll()`.

### Services
`dashboard.service.ts` provides the `IDashboardService` interface, mocking future FastAPI endpoints like `/api/v1/dashboard/stats`, `/api/v1/applications`, and `/api/v1/notifications`.

### Component Design
The dashboard employs a highly modular widget architecture:
- `MetricCard.tsx`: Reusable KPI tile.
- `ApplicationStatusCard.tsx`: Row component for application listings.
- `ActionRequiredCard.tsx`: Alert tile for actionable items.
- `DocumentStatusWidget.tsx`: Directly integrates Task 2's knowledge domain into the dashboard.
- `ApprovalProgress.tsx`: Status tracking.
- `RecentActivity.tsx`: Chronological feed grouped by day.
- `ApplicationTimeline.tsx`: Specialized vertical stepper for detail views.

### Routing Additions
Task 3 implemented multiple routes, maintaining SPA integrity:
- `/dashboard`
- `/applications` (List view)
- `/applications/:applicationId` (Detail view)

Placeholders are used for unbuilt sections (`/approvals`, `/compliance`) which also render within the `AppLayout`.

---

## 6. Task 4: Government Operations Module

### Architecture Overview
The Government Module runs in parallel with the Business Dashboard within the same React SPA. It leverages a custom `GovernmentRoute` guard to enforce RBAC based on `user.role`. Business Users are routed away from Government paths and vice versa.

### Data Layer (`government.service.ts`)
The service layer drives all decision-making without relying on AI:
- **Deterministic SLA Calculation**: Compares the application's `slaDeadline` against the current date via `date-fns` logic, resulting in strict statuses (`ON_TRACK`, `AT_RISK`, `CRITICAL`, `OVERDUE`).
- **Risk Assessment System**: Generates a numeric `riskScore` (0-100) and discrete `riskLevel` based on arrays of explicitly defined `RiskFactor` objects (e.g., SLA breaches, active queries, pending inspections).

### Core Components
- `GovernmentDashboard.tsx`: KPI aggregation and priority lists.
- `GovernmentApplications.tsx`: Data grid with multi-dimensional filtering (Status, Risk Level, Department).
- `GovernmentApplicationDetails.tsx`: Split-pane detail view combining business document previews with an internal Action Panel.
- `DepartmentPerformance.tsx`: Analytics view computing SLA compliance across departments.
- `Escalations.tsx` & `AuditLogs.tsx`: Compliance tracking and security logging.

### Component Design (Action Dialogs)
Instead of fragmented pages, administrative actions are designed as context-aware, inline modal dialogs (`AssignOfficerDialog.tsx`, `EscalationDialog.tsx`) directly accessible from the application details view. This reduces context switching for government officers.
