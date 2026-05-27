# PMDSPM Tracker — Project Handoff Document

> **For the next Claude instance:** This file is your complete briefing. Read it top to bottom before touching any code. **V1 is complete, tested, and in production use.** Do NOT re-architect or re-do anything already built. Any new work should be additive only.

---

## What This App Is

A personal budget tracking web app for **Kushaal Rana** built around the **PMDSPM framework** — a 6-bucket money management system taught by Mitesh (financial coach). Every dollar of income is assigned to one of six buckets before spending.

**The 6 Buckets (PMDSPM):**

| Letter | Bucket |
|---|---|
| P | Passive Income |
| M | Must Expenses (rent, wifi, electricity, utilities, groceries, gym, insurance) |
| D | Desire (car fund, gadgets, trips) |
| S | Self Pampering (small treats) |
| P | Personal Growth (learning & skill development) |
| M | Make a Difference (giving) |
| — | Buffer (travel + opportunity fund — auto-calculated, never manually allocated) |

User sets their own monthly income + per-bucket allocations in Settings. Buffer = income − sum(6 allocations).

**Why this app exists:** Rich visual analytics (progress bars, pie charts, 6-month bar charts), cross-device access (phone, home laptop, office laptop) via Supabase backend.

**Intended scale:** Built as SaaS-quality. V2 will add stock tracking and potentially multi-user support.

---

## Tech Stack (Final — Do Not Change)

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript + **Vite 5** | Vite 8 requires Node 20.19+; Kushaal has Node 20.14.0 |
| Styling | Tailwind CSS **v3** + shadcn/ui (manual) | Tailwind 4 / shadcn CLI incompatible with this setup |
| Routing | React Router **v6** | SPA routing |
| Server state | TanStack Query v5 | Server state, query invalidation |
| Client state | Zustand v5 | Active month, modal open/close, sidebar collapse, currency preference |
| Forms | React Hook Form + Zod **v3** | Validated expense form |
| Charts | Recharts v2 | React-native charts |
| Animations | Framer Motion v11 | Smooth interactions |
| Date handling | date-fns **v3** | react-day-picker v8 requires v2 or v3 |
| Backend + Auth + DB | **Supabase** | Postgres + RLS + Auth — cross-device sync |
| Deployment | Vercel | `vercel.json` ready |
| Toasts | Sonner v1 | |
| Bottom sheet | vaul v1 | Mobile drawer |

**Critical version constraints (never change):**
- Node: 20.14.0 → Vite 5 only
- Tailwind: v3 with PostCSS (NOT `@tailwindcss/vite`)
- date-fns: v3 (v4 breaks react-day-picker v8)
- React: 18 (NOT 19)
- zod: v3 (NOT v4)
- @hookform/resolvers: v3 (NOT v5 — v5 is for zod v4)
- shadcn/ui: manually written Radix UI components (CLI was incompatible)

---

## V1 Build Status — COMPLETE ✅

`npm run build` passes with zero TypeScript errors. App is in active production use.

### Infrastructure & Config
- `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.app.json`
- `src/vite-env.d.ts` — Vite env type declarations for `import.meta.env`
- `vercel.json` — SPA rewrites + security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- `.env.local` — Supabase URL + anon key (gitignored)
- `index.html` — inline script before React boots applies `dark` class from `localStorage` to prevent flash-of-wrong-theme. Title: "PMDSPM Tracker".

### Types / Constants / Lib / Stores
- `src/types/` — bucket.ts, expense.ts, allocation.ts, currency.ts, index.ts
- `src/constants/` — buckets.ts (`BUCKET_CONFIG`, `BUCKET_ORDER` only — **no hardcoded financial amounts**), categories.ts
- `src/lib/` — supabase.ts, queryClient.ts (includes `queryKeys.profile`), utils.ts
- `src/store/` — authStore.ts, uiStore.ts (also holds `sidebarCollapsed`), currencyStore.ts

### Services
- `src/services/auth.service.ts` — `signInWithPassword`, `sendMagicLink`, `signOut`
- `src/services/expenses.service.ts` — `getExpenses`, `insertExpense`, `updateExpense`, `softDeleteExpense`, `getMonthlyTotals`, `getLast6MonthsTotals`
- `src/services/allocations.service.ts` — `getAllocationsByMonth` (returns empty array for new months — no auto-seeding), `upsertAllocations`
- `src/services/profiles.service.ts` — `getProfile`, `updateProfile` (reads/writes `public.profiles.full_name` and `public.profiles.monthly_income`)

### Hooks
- `useAuth`, `useExpenses`, `useAddExpense`, `useDeleteExpense`, `useUpdateExpense`, `useBucketAllocations`, `useMonthlyTotals`, `useLast6MonthsTotals`, `useMediaQuery`, `useTheme`, `useCurrency`, `useProfile` / `useUpdateProfile`

### Auth Boot (main.tsx)
- `getSession()` reads JWT from localStorage (cache, no network call)
- If session found, immediately calls `getUser()` to verify with Supabase server
- If `getUser()` fails (user deleted, token invalid) → auto sign-out before any page renders
- `onAuthStateChange` keeps session in sync for ongoing token refreshes
- Prevents deleted users with cached JWTs from accessing the app

### Currency (USD ↔ INR)
- DB always stores amounts in **USD** (canonical). Display layer converts.
- `src/types/currency.ts` — `CurrencyCode = 'USD' | 'INR'`
- `src/store/currencyStore.ts` — Zustand store with currency preference + exchange rate, persisted to localStorage (keys: `pmdspm-currency`, `pmdspm-exchange-rate`). Default rate: 95.67.
- `src/hooks/useCurrency.ts` — exposes `format(usd)` (USD → display), `formatRaw(amount)` (already in display currency, NO conversion), `symbol`, `toStorage(entered)` (display → USD for DB), `toDisplay(usd)` (USD → display number)
- `src/lib/utils.ts` — `formatCurrency(usd, currency, rate)`, `formatCurrencyRaw(amount, currency)`, `toStorageAmount`, `toDisplayAmount`, `getCurrencySymbol`
- Settings page has a "Currency" card to toggle USD/INR and edit exchange rate. INR rate is user-maintained (no live API fetch).
- All amount inputs (Add Expense, Edit Expense, Allocation editor, Monthly Income) accept values in the active display currency; conversion to USD happens in `toStorage()` before DB write.
- All amount displays (cards, charts, tables, tooltips) read USD from DB and pass through `format()` for display conversion.
- `formatRaw` exists specifically to avoid display→USD→display round-trips in Settings (where form state is already in display currency).

### Monthly Income (DB-backed, cross-device sync)
- Stored in `public.profiles.monthly_income` — NUMERIC(10,2), USD canonical, default 0
- **Migration required:** `ALTER TABLE public.profiles ADD COLUMN monthly_income NUMERIC(10,2) NOT NULL DEFAULT 0;` (already applied to the live Supabase project)
- Read/written via `useProfile()` / `useUpdateProfile()` hooks (TanStack Query, cached, invalidated on update)
- Settings page has a "Monthly income" card with a single input (in display currency) and Save button. Shows amber prompt when unset.
- Used by `SettingsPage` (income cap, buffer calc, %) and `DonutSummary` (remaining + percent). `IncomeHeader` keeps its own dynamic `totalIncome = sum(allocations)` — unchanged.
- `DEFAULT_MONTHLY_INCOME` constant is **deleted** — no hardcoded financial values in code.

### Layouts
- `src/layouts/AuthLayout.tsx` — centered card, redirects if already authed
- `src/layouts/AppLayout.tsx` — Sidebar (desktop) + TopBar + BottomNav (mobile) + Add Expense modal/sheet
- `src/layouts/ProtectedRoute.tsx` — spinner while loading, redirect to /login if no session

### Pages
- `src/pages/LoginPage.tsx` — password login + magic link toggle
- `src/pages/DashboardPage.tsx` — full dashboard wired to hooks
- `src/pages/ExpensesPage.tsx` — filters, sortable table with total footer, mobile card list, edit + delete dialogs
- `src/pages/SettingsPage.tsx` — Account card (name + email + sign out), Display name editor, Currency toggle + rate editor, Monthly income input, Set password, Allocation editor with live %, read-only Buffer row

### Navigation
- `Sidebar.tsx` — desktop vertical nav. **Collapsible** via toggle button in the top-right of the sidebar header (uses `PanelLeftClose` / `PanelLeftOpen` icons). Collapsed width is `w-16` (icons only with hover tooltips), expanded is `w-60` (icons + labels). State persisted to localStorage via `uiStore.sidebarCollapsed` (key: `pmdspm-sidebar-collapsed`). Main content auto-adjusts since sidebar is part of the flex layout.
- `TopBar.tsx` — month picker, theme toggle, Add Expense CTA; passes `expenseFilters.bucket` to `openAddExpense()`
- `BottomNav.tsx` (mobile) — 3 evenly-spaced nav items (Dashboard, Expenses, Settings) plus a **floating + button** that's `position: fixed`, centered horizontally at `left-1/2 -translate-x-1/2`, sits cleanly *above* the nav bar at `bottom-20` (no overlap with tabs). Original inline 4-item layout looked off-center; this FAB pattern fixes the visual asymmetry.

### Dashboard Components
- `IncomeHeader.tsx` — dark gradient card; `totalIncome` = sum of actual DB allocations (dynamic, not hardcoded); shows "Remaining" = `totalIncome - totalSpent`; shows zero-state if no allocations set for the month
- `BucketCard.tsx` — clickable, navigates to /expenses with bucket pre-filtered
- `BucketGrid.tsx`, `BucketProgressBar.tsx`, `RecentExpenses.tsx`
- Buffer card absent from BucketGrid — `BUCKET_ORDER` never includes `'buffer'`

### Chart Components
- `DonutSummary.tsx` — spent vs remaining donut (uses `monthlyIncomeUSD` from `useProfile()`)
- `SpendingPieChart.tsx` — breakdown by bucket
- `MonthlyBarChart.tsx` — 6-month stacked bar trend

### Add Expense
- `AddExpenseForm.tsx` — `SPLIT_WAYS = 3`; split type shows "Total bill amount" label + live "Your share" preview (converts entered display-currency → USD before dividing); stores `amount ÷ 3` in USD in DB
- `AddExpenseModal.tsx` — desktop Dialog
- `AddExpenseSheet.tsx` — mobile vaul drawer; `max-h-[92svh]` so sheet hugs content; `overflow-y-auto` on inner div only

### Expense Components
- `ExpenseFilters.tsx` — month + bucket/category/type selects + clear filters
- `ExpenseTable.tsx` — desktop sortable table with total footer row
- `ExpenseList.tsx` — mobile card list
- `ExpenseRow.tsx` — edit (pencil) + delete (trash) buttons in both variants
- `EditExpenseDialog.tsx` — pre-fills form; converts stored USD → display currency for inputs; split expenses reverse-engineer original total (`toDisplay(stored) × 3`); converts back to USD on save
- `DeleteExpenseDialog.tsx`, `EmptyState.tsx`

### Settings Page Details
- Account card: avatar initial (from first name if set, else email), name + email display, Sign out button
- Display name: first name + last name inputs → saved as `full_name` in `public.profiles`; loaded from DB on mount; splits on first space
- Password section: two-field form (new + confirm) → `supabase.auth.updateUser({ password })`; **toast shows real Supabase error message** (e.g. "New password should be different from the old password.") instead of generic "Failed to set password"; requires Supabase "Secure password change" setting to be **OFF**
- Currency card: USD/INR toggle, exchange rate editor (visible only when INR active). Persisted to localStorage.
- Monthly income card: single input in active currency, saves to `profiles.monthly_income` (USD canonical). Shows amber prompt when unset.
- Allocation editor: 6 editable buckets (BUCKET_ORDER), live % per bucket, read-only Buffer row auto-calculated as `monthlyIncome - totalAllocated`. Uses `formatRaw` (no USD round-trip) since input values are already in display currency.

### Shared Components
- `BucketBadge.tsx` — inline styles with hex opacity (`color22` bg, `color44` border); fixed width `min-w-[88px]` sm / `min-w-[96px]` md; works in light + dark mode
- `CategoryBadge.tsx`, `MonthPicker.tsx`, `CurrencyAmount.tsx`, `LoadingSpinner.tsx`, `ErrorBoundary.tsx`

### UI Primitives (manually written Radix-based, in `src/components/ui/`)
- button, input, label, card, badge, separator, dialog, select, sheet, skeleton, tooltip, dropdown-menu

### Dark Mode
- Tailwind `darkMode: ['class']`; CSS variables in `.dark` in `index.css` (deep navy palette)
- `useTheme` hook: reads localStorage on init, applies `dark` class to `<html>`, persists on change
- Inline script in `index.html` applies class before React boots — prevents flash-of-wrong-theme
- Toggle in Sidebar (desktop) and TopBar (always visible)

---

## Key Architectural Decisions (Do Not Revisit)

1. **`month` stored as TEXT `"2026-04"`** — composite index `(user_id, month)` for fast queries
2. **Soft delete** — `deleted_at` column; all queries filter `WHERE deleted_at IS NULL`
3. **`user_id` injected in service layer** from `supabase.auth.getUser()` — NEVER from form input
4. **No backend server** — Supabase client calls directly from React, protected by RLS
5. **activeMonth in Zustand** (not URL params) — resets to current month on refresh (acceptable)
6. **Buffer is auto-calculated, never manually entered** — Buffer = `monthlyIncome − sum(6 bucket allocations)` in Settings (read-only row). In IncomeHeader, Remaining = `totalIncome − totalSpent`. Buffer is NOT in BUCKET_ORDER and has no BucketCard. Users never log expenses against the buffer bucket.
7. **Add Expense is modal on desktop / bottom sheet on mobile** — `useIsMobile()` hook. Sheet uses `max-h-[92svh]` to hug content, inner div handles overflow scroll.
8. **No auto-seeding of allocations** — `getAllocationsByMonth` returns empty array for new months. New users start blank. Existing user's saved allocations load from DB. IncomeHeader shows zero-state if no allocations exist for the month.
9. **Split expenses always divide by 3** — Kushaal splits Wi-Fi, utilities, electricity with 2 roommates. `SPLIT_WAYS = 3` in `AddExpenseForm.tsx` and `EditExpenseDialog.tsx`. Store the user's share, not the full bill.
10. **Bucket pre-selection in Add Expense** — `openAddExpense(expenseFilters.bucket ?? undefined)` in both TopBar and BottomNav so clicking a bucket card pre-selects it in the form
11. **Auth boot always server-verifies** — `getSession()` (cache) + `getUser()` (network) on every page load. Deleted users with cached JWTs are caught and signed out immediately.
12. **IncomeHeader uses dynamic totalIncome** — reads from sum of actual DB allocations, not `profiles.monthly_income`. Accurate even if allocations change.
13. **DB always stores USD** — single source of truth. Display layer (`useCurrency`) converts to user's preferred currency. No DB column ever holds INR.
14. **Monthly income lives in DB** (`profiles.monthly_income`), not in code or localStorage. Cross-device sync. No hardcoded financial values anywhere in source.
15. **Sidebar collapse state lives in localStorage** (not DB) — per-device UI preference, doesn't need to sync. Same pattern as currency preference.
16. **Mobile + button is a FAB** (floating action button) — positioned absolutely above the BottomNav with no overlap, NOT inline as a 4th tab.
17. **`useEffect` deps must not include unstable function references** from `useCurrency()` — use the underlying primitives (`currency`, `exchangeRate`) and call `toDisplayAmount(...)` from utils directly. Otherwise effects re-run every render and wipe input state.

---

## Data Model Quick Reference

### `expenses` table columns
`id, user_id, amount, description, bucket, category, expense_type, date, month, notes, deleted_at, created_at, updated_at`

### `bucket_allocations` table columns
`id, user_id, month, bucket, amount, created_at, updated_at`

### `profiles` table columns
`id, email, full_name, avatar_url, monthly_income, created_at, updated_at`
Auto-created via DB trigger `on_auth_user_created` on new signup. `monthly_income` defaults to 0 (NUMERIC(10,2), USD). `id` is the PK and equals `auth.users.id` — queries filter by `id`.

### Bucket enum values
`passive_income | must | desire | self_pampering | personal_growth | make_a_difference | buffer`

### Category enum values
`groceries | rent | wifi | utilities | rental_insurance | electricity | subscription | stocks | other`
Note: `scooter` was removed. Any legacy DB rows tagged `scooter` should be cleaned up via Supabase.

### Expense type values
`own | split | pending`
- `split` = bill divided by 3 (roommates). **Store amount ÷ 3 (in USD), not full bill.**
- `pending` = expense awaiting reimbursement
- `own` = personal expense, full amount

---

## Supabase Setup

- Credentials in `.env.local` (gitignored) ✅
- Schema migrations applied: `001_initial_schema.sql`, `002_rls_policies.sql` ✅
- `monthly_income` column added to `profiles` table ✅
- RLS policies active on all 4 tables ✅
- Auth URL config includes both `http://localhost:5173` (dev) and production Vercel URL ✅

### Critical Supabase Settings (must be configured)
- **Sign-ups disabled** — Auth → Settings → "Allow new users to sign up" → OFF. Only existing users can sign in.
- **Secure password change OFF** — Auth → Settings → "Secure password change" → OFF. Required for the in-app "Set password" form to work immediately without email confirmation.

**Never use the service_role key in frontend code.** Only `VITE_SUPABASE_ANON_KEY` goes in `.env.local`.

---

## Supabase Security Rules (Never Break)

1. RLS is ON for all 4 tables — `profiles, bucket_allocations, expenses, income_entries`
2. Every RLS policy uses `auth.uid() = user_id` — no exceptions
3. `user_id` always from `supabase.auth.getUser()` in service layer — NEVER from form data
4. Only `VITE_SUPABASE_ANON_KEY` in frontend env vars — service_role key NEVER in frontend
5. Soft delete only — no hard deletes from UI
6. Zod validates all inputs before insert/update

---

## Running the App

```bash
npm run dev       # → http://localhost:5173
npm run build     # Must pass with zero TypeScript errors before any deploy
```

---

## Deployment (Vercel)

`vercel.json` is ready. Steps to deploy:
1. Push code to GitHub (private repo: `kushaal-rana/FinVault`)
2. Import repo in Vercel dashboard
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Supabase → Auth → URL Configuration → add `https://your-app.vercel.app` to Site URL and Redirect URLs
5. Verify: hard refresh on `/expenses` returns app (not 404), auth works, data persists

---

## Design Principles (Always Apply)

- **Apple/Dribbble quality UI** — clean, minimal, lots of whitespace, premium feel
- **Mobile-first** — BottomNav (3 tabs + FAB) on mobile, Sidebar on desktop (collapsible)
- **No tables on dashboard** — progress bars, charts, cards only
- **Bucket colors are sacred** — always from `BUCKET_CONFIG[key].color`
  - Must: `#ef4444` (red) | Desire: `#f59e0b` (amber) | Self Pampering: `#ec4899` (pink)
  - Personal Growth: `#10b981` (emerald) | Make a Difference: `#8b5cf6` (violet)
  - Passive Income: `#6366f1` (indigo) | Buffer: `#64748b` (slate)
- **Progress bars turn red at 90%+ usage**
- **All dollar amounts via `useCurrency().format()` from a hook, NOT direct `formatCurrency()` import** — except in `formatRaw` cases (Settings inputs already in display currency)

---

## V2 Roadmap (Do Not Build Yet — Noted for Future)

- **Framer Motion stagger** on BucketGrid cards on page load
- **Loading skeletons** on charts while data fetches
- **Stock tracking** — `stock_positions` table (ticker, qty, avg_cost_basis, platform); `stock_prices` from Edge Function; new Settings tab "Portfolio"
- **Multi-user SaaS** — schema already supports it (all tables have `user_id`)
- **Code splitting** — bundle is ~1.1MB; can add `manualChunks` in `vite.config.ts` to split recharts/supabase/react. Warning only, not an error. Fine for personal use.
- **ESLint no-console rule** — prevent financial data leaking to logs in production
- **Live exchange rate fetch** — currently `pmdspm-exchange-rate` is user-maintained, defaulting to 95.67. Could integrate a rates API to keep it fresh.

---

## About Kushaal (Context for Personalization)

- Software engineer at Google, Santa Clara
- PMDSPM taught by his financial coach Mitesh
- Splits Wi-Fi, utilities, electricity 3 ways with roommates (always ÷3)
- Uses the app across phone, home laptop, office laptop — anything user-specific that needs cross-device sync goes in Supabase, not localStorage
- This app should eventually be scalable to SaaS (multi-user)
