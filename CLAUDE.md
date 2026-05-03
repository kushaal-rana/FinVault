# PMDSPM Tracker — Project Handoff Document

> **For the next Claude instance:** This file is your complete briefing. Read it top to bottom before touching any code. The app is **feature-complete and builds cleanly**. The current focus is **testing, polish, and deployment**. Do NOT re-architect or re-do anything already built — read this first.

---

## What This App Is

A personal budget tracking web app for **Kushaal Rana** built around the **PMDSPM framework** — a 6-bucket money management system taught by Mitesh (financial coach). Every dollar of income is assigned to one of six buckets before spending.

**The 6 Buckets (PMDSPM):**
| Letter | Bucket | Kushaal's Monthly Amount |
|---|---|---|
| P | Passive Income  |
| M | Must Expenses |(rent wifi, electricity, utilities, groceries, gym, insurance) |
| D | Desire |  (car fund — saving toward $50K milestone) |
| S | Self Pampering |  (small treats) |
| P | Personal Growth |  (Claude Code subscription only — frozen) |
| M | Make a Difference |  (giving) |
| — | Buffer |  (travel + opportunity fund) |
| **Total** | | **$XXXXX/month net** |

**Why this app exists:** Rich visual analytics (progress bars, pie charts, 6-month bar charts), cross-device access (phone, home laptop, office laptop) via Supabase backend.

**This is not a side project.** Built as SaaS-quality with intention to scale to multi-user and add stock tracking in v2.

---

## Tech Stack (Final — Do Not Change)

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript + **Vite 5** | Vite 8 requires Node 20.19+; Kushaal has Node 20.14.0 |
| Styling | Tailwind CSS **v3** + shadcn/ui (manual) | Tailwind 4 / shadcn CLI incompatible with this setup |
| Routing | React Router **v6** | SPA routing |
| Server state | TanStack Query v5 | Server state, query invalidation |
| Client state | Zustand v5 | Active month, modal open/close state |
| Forms | React Hook Form + Zod **v3** | Validated expense form |
| Charts | Recharts v2 | React-native charts |
| Animations | Framer Motion v11 | Smooth interactions |
| Date handling | date-fns **v3** | react-day-picker v8 requires v2 or v3 |
| Backend + Auth + DB | **Supabase** | Postgres + RLS + Auth — cross-device sync |
| Deployment | Vercel | `vercel.json` created, not yet deployed |
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

## Current Build Status — SESSION 4 UPDATE

### ✅ Fully Complete (builds cleanly — `npm run build` passes with zero errors)

**Infrastructure & Config**
- `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.app.json`
- `src/vite-env.d.ts` — Vite env type declarations for `import.meta.env`
- `vercel.json` — SPA rewrites + security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- `.env.local` — Real Supabase credentials present (URL + anon key for project ``)
- `src/App.css` — **DELETED** (was default Vite scaffold, never used)
- `index.html` — inline script before React boots applies `dark` class from `localStorage` to prevent flash-of-wrong-theme. Title updated to "PMDSPM Tracker".

**Types / Constants / Lib / Stores / Services / Hooks — all done**
- `src/types/` — bucket.ts, expense.ts, allocation.ts, index.ts
- `src/constants/` — buckets.ts (BUCKET_CONFIG, BUCKET_ORDER, DEFAULT_MONTHLY_ALLOCATIONS, DEFAULT_MONTHLY_INCOME=X000), categories.ts
- `src/lib/` — supabase.ts, queryClient.ts, utils.ts
- `src/store/` — authStore.ts, uiStore.ts
- `src/services/` — auth.service.ts, expenses.service.ts (includes `updateExpense`), allocations.service.ts
- `src/hooks/` — useAuth, useExpenses, useAddExpense, useDeleteExpense, **useUpdateExpense** (new), useBucketAllocations, useMonthlyTotals, useLast6MonthsTotals, useMediaQuery

**Supabase**
- Migrations run: `001_initial_schema.sql`, `002_rls_policies.sql`
- User account created in Supabase dashboard
- Auth URL configuration set to `http://localhost:5173`

**Layouts**
- `src/layouts/AuthLayout.tsx` — uses `<Outlet />`, redirects if already authed
- `src/layouts/AppLayout.tsx` — Sidebar (desktop) + TopBar + BottomNav (mobile) + Add Expense modal/sheet
- `src/layouts/ProtectedRoute.tsx` — spinner while loading, redirect to /login if no session

**Pages (all 4 built)**
- `src/pages/LoginPage.tsx` — password login + magic link toggle
- `src/pages/DashboardPage.tsx` — full dashboard wired to hooks
- `src/pages/ExpensesPage.tsx` — filters, table/list, edit + delete dialogs
- `src/pages/SettingsPage.tsx` — 6 editable buckets (BUCKET_ORDER only) with live % per bucket; Buffer row is **read-only, auto-calculated** as `$X,000 - sum(6 bucket allocations)`, shown in muted style, never saved to DB

**Navigation**
- `src/components/nav/Sidebar.tsx`
- `src/components/nav/TopBar.tsx` — passes `expenseFilters.bucket` to `openAddExpense()` (bucket pre-selection fix)
- `src/components/nav/BottomNav.tsx` — passes `expenseFilters.bucket` to `openAddExpense()` (bucket pre-selection fix); exactly 4 `flex-1` items (Dashboard, Expenses, +, Settings) — extra spacer div removed

**Dashboard components**
- `IncomeHeader.tsx` — dark gradient card; shows `$X,000 - totalSpent` as **"Remaining"** (live, auto-calculated). Buffer allocation row removed from this component entirely.
- `BucketCard.tsx` — clickable, navigates to /expenses with bucket pre-filtered via `setExpenseFilters`
- `BucketGrid.tsx`, `BucketProgressBar.tsx`, `RecentExpenses.tsx`
- Buffer card intentionally absent from BucketGrid — `BUCKET_ORDER` never includes `'buffer'`

**Chart components**
- `DonutSummary.tsx` — spent vs remaining donut (total)
- `SpendingPieChart.tsx` — breakdown by bucket (different purpose, not redundant)
- `MonthlyBarChart.tsx` — 6-month stacked bar trend

**Add Expense (modal + sheet)**
- `AddExpenseForm.tsx` — **Split type divides by 3 automatically**: label changes to "Total bill amount", shows live "Your share: $X.XX (÷3 ways)" preview, stores divided amount. Applies to Wi-Fi, utilities, electricity (always split 3 ways with roommates). `SPLIT_WAYS = 3` constant at top of file.
- `AddExpenseModal.tsx` (desktop dialog)
- `AddExpenseSheet.tsx` (mobile vaul drawer) — `max-h-[92svh]` so sheet hugs content height, no empty space below button. `overflow-y-auto` on inner div only, NOT on `Drawer.Content`

**Expense components**
- `ExpenseFilters.tsx` — month picker + bucket/category/type selects + clear filters
- `ExpenseTable.tsx` — desktop table with **total footer row** (sum of displayed expenses + count)
- `ExpenseList.tsx` — mobile card list
- `ExpenseRow.tsx` — **has both edit (pencil) and delete (trash) buttons** in both table and card variants
- `EmptyState.tsx`, `DeleteExpenseDialog.tsx`
- **`EditExpenseDialog.tsx`** (new) — pre-fills all fields from existing expense; for split expenses, reverse-engineers the original total (stored amount × 3) so user edits the full bill; stores divided amount on save

**Shared components**
- `BucketBadge.tsx`, `CategoryBadge.tsx`, `MonthPicker.tsx`, `CurrencyAmount.tsx`, `LoadingSpinner.tsx`, `ErrorBoundary.tsx`

**UI primitives** (manually written Radix-based, in `src/components/ui/`)
- button, input, label, card, badge, separator, dialog, select, sheet, skeleton, tooltip, dropdown-menu

---

## 🔲 PENDING — To-Do Before Production

### Testing Checklist (ongoing before pushing to production)

- [ ] Login flow — password login works, magic link works, redirects correctly
- [ ] Auth guard — hard refresh on `/expenses` stays on /expenses (not redirect to login then back)
- [ ] Add expense — all fields save correctly to Supabase
- [ ] Add expense — Split type saves `amount ÷ 3` in DB (not full amount)
- [ ] Edit expense — pre-fills correctly; split expenses show original total (stored × 3)
- [ ] Edit expense — saving updates DB, dashboard and expense list refresh
- [ ] Delete expense — soft delete (deleted_at set, not hard delete), list refreshes
- [ ] Filters — bucket/category/type filters work, clear filters $
- [ ] Bucket pre-selection — clicking Must card on dashboard → Add Expense defaults to Must
- [ ] Month navigation — changing month updates dashboard, expense list, settings all in sync
- [ ] Settings — Buffer row auto-calculates correctly as 6-bucket allocations change
- [ ] Settings — saving allocations upserts to Supabase, dashboard refreshes
- [ ] Charts — donut, pie, bar chart render with real data
- [ ] Mobile — bottom sheet hugs content (no empty space below button), BottomNav 4 items evenly spaced
- [ ] Mobile — form inside sheet scrolls internally, drag-to-close still works
- [ ] Total row — expense table footer shows correct sum
- [ ] Percentages — settings page shows correct % per bucket 
- [ ] IncomeHeader — "Remaining" shows `$0,000 - totalSpent` live
- [ ] Empty state — shows when no expenses for month/filter combo

### Polish (nice-to-have before deploy)
- [ ] Framer Motion stagger animation on BucketGrid cards on page load
- [ ] Loading skeletons on charts while data fetches
- [ ] Dark mode toggle
- [ ] Responsive audit — test on actual phone screen sizes

### Deployment
- [ ] Push code to GitHub repo
- [ ] Connect repo to Vercel
- [ ] Add env vars in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] Update Supabase Auth → URL Configuration → add production URL to Site URL and Redirect URLs
- [ ] Post-deploy verification: all routes work, auth works, data persists cross-device
- [ ] Hard refresh on `/expenses` → no 404 (SPA rewrite in vercel.json handles this)

### Security (before any public access)
- [ ] ESLint no-console rule to prevent financial data in logs
- [ ] Audit all `user_id` injection paths — should always be from `supabase.auth.getUser()`, never form input
- [ ] Verify RLS is active on all 4 Supabase tables

---

## Key Architectural Decisions (Do Not Revisit)

1. **`month` stored as TEXT `"2026-04"` in expenses** — composite index `(user_id, month)` for fast queries
2. **Soft delete** — `deleted_at` column; all queries filter `WHERE deleted_at IS NULL`
3. **`user_id` injected in service layer** from `supabase.auth.getUser()` — NEVER from form input
4. **No backend server** — Supabase client calls directly from React, protected by RLS
5. **activeMonth in Zustand** (not URL params) — resets to current month on refresh (acceptable)
6. **`buffer` is auto-calculated, never manually entered** — Buffer = `$X,000 - sum(6 bucket allocations)` in Settings (read-only row). In IncomeHeader, Remaining = `$X,000 - totalSpent`. Buffer is NOT in BUCKET_ORDER and has no BucketCard on dashboard. Users never log expenses against the buffer bucket.
7. **Add Expense is modal on desktop / bottom sheet on mobile** — `useIsMobile()` hook. Sheet uses `max-h-[92svh]` to hug content, inner div handles overflow scroll.
8. **Monthly allocations auto-seed** — `getAllocationsByMonth` seeds from `DEFAULT_MONTHLY_ALLOCATIONS` if month has no data
9. **Split expenses always divide by 3** — Kushaal splits Wi-Fi, utilities, electricity with 2 roommates. `SPLIT_WAYS = 3` in `AddExpenseForm.tsx` and `EditExpenseDialog.tsx`. Store the user's share, not the full bill.
10. **Bucket pre-selection in Add Expense** — `openAddExpense(expenseFilters.bucket ?? undefined)` in both TopBar and BottomNav so clicking a bucket card pre-selects it in the form

---

## Data Model Quick Reference

### `expenses` table columns
`id, user_id, amount, description, bucket, category, expense_type, date, month, notes, deleted_at, created_at, updated_at`

### `bucket_allocations` table columns
`id, user_id, month, bucket, amount, created_at, updated_at`

### Bucket enum values
`passive_income | must | desire | self_pampering | personal_growth | make_a_difference | buffer`

### Category enum values
`groceries | rent | wifi | utilities | rental_insurance | electricity | subscription | stocks | other`
Note: `scooter` was removed from CATEGORY_KEYS and CATEGORY_LABELS. Existing DB rows tagged scooter still exist but are no longer selectable. Remind the user(kushaal) to remove it from the db as well

### Expense type values
`own | split | pending`
- `split` = bill divided by 3 (roommates). **Store amount ÷ 3, not full bill.**
- `pending` = expense awaiting reimbursement
- `own` = personal expense, full amount

---

## Supabase Setup (Already Done)

- Project: `kushaal-money-tracker`, ID: ``
- URL: 
- Credentials in `.env.local` ✅
- Schema migrations run ✅
- RLS policies active ✅
- User account created ✅
- Auth URL config: `http://localhost:5173` ✅

**Never use the service_role key in frontend code.** Only `VITE_SUPABASE_ANON_KEY` goes in `.env.local`.

---

## Running the App

```bash
cd "/Users/kushaalrana/Developer/Vide Coding Journey to 1/My First app"
npm run dev
# → http://localhost:5173

npm run build
# Must pass with zero TypeScript errors before any deploy
```

---

## Design Principles (Always Apply)

- **Apple/Dribbble quality UI** — clean, minimal, lots of whitespace, premium feel
- **Mobile-first** — BottomNav on mobile, Sidebar on desktop
- **No tables on dashboard** — progress bars, charts, cards only
- **Bucket colors are sacred** — always from `BUCKET_CONFIG[key].color`
  - Must: `#ef4444` (red) | Desire: `#f59e0b` (amber) | Self Pampering: `#ec4899` (pink)
  - Personal Growth: `#10b981` (emerald) | Make a Difference: `#8b5cf6` (violet)
  - Passive Income: `#6366f1` (indigo) | Buffer: `#64748b` (slate)
- **Progress bars turn red at 90%+ usage**
- **All dollar amounts via `formatCurrency()` from `@/lib/utils`**

---

## Supabase Security Rules (Never Break)

1. RLS is ON for all 4 tables — `profiles, bucket_allocations, expenses, income_entries`
2. Every RLS policy uses `auth.uid() = user_id` — no exceptions
3. `user_id` always from `supabase.auth.getUser()` in service layer — NEVER from form data
4. Only `VITE_SUPABASE_ANON_KEY` in frontend env vars — service_role key NEVER in frontend
5. Soft delete only — no hard deletes from UI
6. Zod validates all inputs before insert/update

---

## About Kushaal (Context for Personalization)

- Software engineer at Google, Santa Clara
- PMDSPM taught by his financial coach Mitesh
- This app should eventually be scalable to SaaS (multi-user)
