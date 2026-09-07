# TRD — IndustriaConnect: Technical Reference Document

**Document version:** 1.0  
**Status:** Task 1 (Authentication) Implemented  
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
