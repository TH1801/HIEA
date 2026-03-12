-- ============================================================
-- Fix infinite recursion in RLS policies
-- The admin_read_all_profiles policy on profiles table queries
-- profiles itself, causing infinite recursion.
-- Solution: use a SECURITY DEFINER function that bypasses RLS.
-- ============================================================

-- Helper function: checks if current user has admin role.
-- SECURITY DEFINER bypasses RLS so it won't trigger recursive checks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Fix profiles policies
DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
CREATE POLICY "admin_read_all_profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- Fix categories admin policy (same pattern)
DROP POLICY IF EXISTS "admin_manage" ON categories;
CREATE POLICY "admin_manage" ON categories
  FOR ALL USING (public.is_admin());

-- Fix articles admin policy (same pattern)
DROP POLICY IF EXISTS "admin_full_access" ON articles;
CREATE POLICY "admin_full_access" ON articles
  FOR ALL USING (public.is_admin());
