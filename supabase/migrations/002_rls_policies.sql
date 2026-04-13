-- ============================================================
-- PMDSPM Tracker — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ── Enable RLS on all tables ─────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_entries ENABLE ROW LEVEL SECURITY;

-- ── Profiles ─────────────────────────────────────────────────
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── Bucket Allocations ───────────────────────────────────────
CREATE POLICY "allocations_select_own" ON public.bucket_allocations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "allocations_insert_own" ON public.bucket_allocations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allocations_update_own" ON public.bucket_allocations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "allocations_delete_own" ON public.bucket_allocations
  FOR DELETE USING (auth.uid() = user_id);

-- ── Expenses ─────────────────────────────────────────────────
CREATE POLICY "expenses_select_own" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "expenses_insert_own" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expenses_update_own" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "expenses_delete_own" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- ── Income Entries ───────────────────────────────────────────
CREATE POLICY "income_select_own" ON public.income_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "income_insert_own" ON public.income_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "income_update_own" ON public.income_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "income_delete_own" ON public.income_entries
  FOR DELETE USING (auth.uid() = user_id);
