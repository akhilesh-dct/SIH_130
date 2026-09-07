# IndustriaConnect

**Industrial Approvals & Compliance Platform**  
SIH 2026 — Problem Statement 130

---

## Overview

IndustriaConnect is a unified digital platform for streamlining industrial approvals, compliance processes, and access to government support services in India. It connects businesses, regulatory bodies, and government departments through a professional, enterprise-grade web interface.

This is a multi-module application being built incrementally:

| Task | Module | Status |
|------|--------|--------|
| Task 1 | Authentication (Login Page) | ✅ Implemented |
| Task 2 | Document Verification | ✅ Implemented |
| Task 3 | Business Dashboard | ✅ Implemented |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 (CSS-first `@theme`) |
| UI Components | Custom component library (auth/) |
| Routing | React Router 7 |
| State | Zustand 5 |
| Forms | React Hook Form 7 + Zod 4 |
| Icons | Lucide React |

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd SIH_130

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Development Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
npm run lint      # Lint with oxlint
```

---

## Project Structure

```
SIH_130/
├── src/
│   ├── components/
│   │   └── auth/              # Reusable auth UI components
│   │       ├── AuthLayout.tsx
│   │       ├── LoginForm.tsx
│   │       ├── PasswordInput.tsx
│   │       ├── FormField.tsx
│   │       ├── LoadingButton.tsx
│   │       └── ErrorMessage.tsx
│   ├── hooks/
│   │   └── useAuth.ts         # Auth state & actions hook
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   └── validations.ts     # Zod schemas
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx  # Task 3 placeholder
│   ├── router/
│   │   └── index.tsx          # All routes declared here
│   ├── services/
│   │   └── auth.service.ts    # Mock auth (FastAPI-compatible interface)
│   ├── store/
│   │   └── authStore.ts       # Zustand auth state
│   ├── types/
│   │   └── auth.types.ts      # TypeScript domain types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Global styles + Tailwind @theme tokens
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── PRD.md                     # Product Requirements Document
├── TRD.md                     # Technical Reference Document
└── README.md
```

---

## Environment Configuration

Create a `.env.local` file for environment-specific configuration:

```env
# API base URL (connect to FastAPI backend)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Application environment
VITE_APP_ENV=development
```

Environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## Currently Implemented Features (Task 1)

### Authentication Page (`/login`)
- **Role-based login:** Business User or Government Officer selection
- **Form validation:** Email format, password length — on blur, not on every keystroke
- **All auth states:** idle, loading, error (banner), success, disabled
- **Show/hide password:** Accessible toggle
- **Remember me:** Persists session via sessionStorage
- **Responsive layout:** Two-column desktop, single-column mobile
- **Accessible:** Keyboard navigable, ARIA labels, visible focus rings

### Mock Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Business User | `business@example.com` | `password123` |
| Government Officer | `officer@gov.in` | `govpass123` |

### Routing
All future routes are pre-declared. Adding a new module = add one entry in `src/router/index.tsx`.

---

## How Task 2 and Task 3 Will Integrate

### Task 2 — Document Verification
- Add `DocumentsPage.tsx` in `src/pages/`
- Replace the placeholder in `src/router/index.tsx` at `/documents`
- Reuse `FormField`, `ErrorMessage`, `AuthLayout` or create a new `DashboardLayout`
- The auth store and `useAuth` hook are already available

### Task 3 — Business Dashboard
- Replace the `DashboardPage.tsx` placeholder content
- The route `/dashboard` and the protected route guard are already in place
- Auth state (user, role, organization) is available via `useAuthStore()`

---

## Connecting to a Real Backend (FastAPI)

1. Implement these endpoints in FastAPI:
   - `POST /api/v1/auth/login`
   - `POST /api/v1/auth/logout`
   - `GET /api/v1/auth/me`

2. In `src/services/auth.service.ts`, replace the mock implementation with `fetch` or `axios` calls.

3. Set `VITE_API_BASE_URL` in `.env.local`

**No changes to UI components or the Zustand store are needed.**

---

## Design System

The visual design system is defined in `src/index.css` using Tailwind v4's `@theme` directive.

Key tokens:
- **Primary color:** `#2563eb` (blue-600) — CTAs, focus rings, selected states
- **Brand dark:** `#0f2040` — left brand panel background
- **Typography:** Inter (Google Fonts)
- **Border radius:** 4–8px (enterprise aesthetic, not pill-heavy)
- **Shadows:** Minimal `sm` and `md` only

This design system extends unchanged into Task 2 and Task 3.

---

## Security Notes

- Passwords are never logged or stored
- Session tokens are stored in `sessionStorage` (clears on tab close)
- No sensitive data is embedded in mock tokens
- Error messages are generic (don't reveal internal state)
- All interactive elements have proper ARIA attributes

---

## Document Verification Module (Task 2)

### Routes

| Route | Page | Description |
|-------|------|-------------|
| `/documents` | DocumentsPage | Three-panel verification workspace |
| `/documents/:documentId` | DocumentsPage | Deep link to specific document |

### Workspace Layout

**Desktop (≥ 1024px):** Three-column layout
- Left (280px): Scrollable document list grouped by Required/Optional
- Center (flex): Mock document preview panel
- Right (340px): Document details, upload zone, verification result

**Mobile (< 1024px):** Tab navigation between Documents / Preview / Details

### Document Verification States

| Status | Meaning |
|--------|---------|
| `not_uploaded` | No file submitted |
| `uploaded` | File uploaded, pending review |
| `verifying` | Under active review |
| `verified` | All checks passed |
| `needs_attention` | Issue found — user must act |
| `rejected` | Document rejected |

### Mock Document Data

Located in [`src/data/documents.ts`](src/data/documents.ts). Contains 7 realistic Indian industrial compliance documents with varied states.

To reset upload state: refresh the page (in-memory mock only).

### Connecting Document Service to FastAPI

1. Open [`src/services/document.service.ts`](src/services/document.service.ts)
2. Replace the `DocumentService` class body with real `fetch` calls
3. Map to endpoints: `GET /api/v1/documents`, `POST /api/v1/documents/:id/upload`, etc.

**Zero UI or store changes needed.**

## Currently Implemented Features (Task 3)

### Dashboard & Layout
- **App Layout**: Persistent sidebar navigation on desktop, mobile slide-out drawer, top bar.
- **Metric Row**: High-level KPIs (Applications, Actions, Documents, Approvals).
- **Action Required Alerts**: Urgency-colored actionable alerts that link directly to resolutions.
- **Application Status & Feed**: List view of ongoing applications with progress bars and status indicators.
- **Application Detail View**: Deep dive into individual applications, showing complete timelines, reference numbers, and SLA tracking.
- **Recent Activity**: Date-grouped activity stream.
- **Document Widget**: Integration of Task 2 into the dashboard overview.

### Connecting Dashboard Service to FastAPI
1. Open [`src/services/dashboard.service.ts`](src/services/dashboard.service.ts)
2. Replace the `DashboardService` class body with real `fetch` calls.
3. Replace the mock endpoints with `GET /api/v1/dashboard/stats`, `GET /api/v1/applications`, etc.

---

*IndustriaConnect — SIH 2026, Problem Statement 130*