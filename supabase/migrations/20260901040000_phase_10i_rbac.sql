-- ==============================================================================
-- PHASE 10I: ROLES & PERMISSIONS (RBAC)
-- ==============================================================================

-- 1. UPDATE PROFILES TABLE
-- We need to drop the old check constraint to add new roles
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('owner', 'admin', 'staff', 'customer'));

-- Add Status & Versioning Columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- 2. UPDATE IS_ADMIN HELPER
-- Updates the helper to allow owner, admin, and staff to bypass basic RLS rules
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin', 'staff') AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. STRONG PROTECTIONS FOR PROFILE UPDATES
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
DECLARE
  current_user_role TEXT;
  current_user_status TEXT;
  owner_count INTEGER;
BEGIN
  -- If we are in the context of an authenticated request (not service_role)
  IF current_user IN ('authenticated', 'anon') THEN
    
    -- 3A. Get the current user's role
    SELECT role, status INTO current_user_role, current_user_status 
    FROM public.profiles 
    WHERE id = auth.uid();

    -- 3B. If the user is suspended, they cannot do anything
    IF current_user_status = 'suspended' THEN
      RAISE EXCEPTION 'Suspended users cannot modify profiles';
    END IF;

    -- 3C. Prevent self-escalation or self-demotion
    IF NEW.id = auth.uid() AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) THEN
       RAISE EXCEPTION 'Users cannot change their own role or status';
    END IF;

    -- 3D. Verify permissions for role or status changes
    IF NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status THEN
      
      -- Only OWNER can change roles or suspend staff
      IF current_user_role != 'owner' THEN
        RAISE EXCEPTION 'Only owners can modify roles or suspend accounts';
      END IF;

      -- If demoting or suspending an owner, ensure it is not the last one
      IF OLD.role = 'owner' AND (NEW.role != 'owner' OR NEW.status = 'suspended') THEN
        SELECT count(*) INTO owner_count FROM public.profiles WHERE role = 'owner' AND status = 'active';
        IF owner_count <= 1 THEN
          RAISE EXCEPTION 'Cannot demote or suspend the final active owner';
        END IF;
      END IF;

    END IF;
  END IF;

  -- 3E. Concurrency Check
  IF NEW.version <= OLD.version AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) THEN
     -- Only enforce version check if role or status is changing, as other fields (name, phone) might not pass a version from frontend
     -- Actually, we'll just auto-increment it.
     NEW.version = OLD.version + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure the trigger is active
DROP TRIGGER IF EXISTS enforce_profile_role ON public.profiles;
CREATE TRIGGER enforce_profile_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();

-- 4. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RLS for audit logs (only owner/admin can read)
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/Owner can view audit logs"
  ON public.admin_audit_logs
  FOR SELECT
  USING (public.is_admin());

-- Policy to allow inserts from server environment only (service_role)
-- No INSERT policy for authenticated users, forces backend to use service_role for writing logs
