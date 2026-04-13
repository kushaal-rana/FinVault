-- ============================================================
-- PMDSPM Tracker — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Profiles (extends auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Bucket Allocations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bucket_allocations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month       TEXT NOT NULL,
  bucket      TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, month, bucket)
);

-- ── Expenses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.expenses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount       NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  description  TEXT NOT NULL,
  bucket       TEXT NOT NULL,
  category     TEXT NOT NULL,
  expense_type TEXT NOT NULL DEFAULT 'own',
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  month        TEXT NOT NULL,
  notes        TEXT,
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Income Entries (future-proof) ────────────────────────────
CREATE TABLE IF NOT EXISTS public.income_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month       TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  source      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS expenses_user_month_idx
  ON public.expenses (user_id, month)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS expenses_user_bucket_idx
  ON public.expenses (user_id, bucket)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS allocations_user_month_idx
  ON public.bucket_allocations (user_id, month);

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_allocations_updated_at
  BEFORE UPDATE ON public.bucket_allocations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
