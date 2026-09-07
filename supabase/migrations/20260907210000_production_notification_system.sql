-- ==============================================================================
-- PHASE 14: PRODUCTION IN-APP NOTIFICATION & UPDATE SYSTEM SCHEMA (ALL-IN-ONE)
-- Project: PreetyPrints
-- Purpose: Ensures all notification columns (title, body, action_url, action_label,
--          icon, severity, target_type, scheduled_at, etc.), user_notifications table,
--          customer preferences, indexes, RLS, and schema cache reload are in place.
-- ==============================================================================

-- 1. EXTEND NOTIFICATIONS TABLE (Ensuring both Phase 11b and Phase 14 columns exist)
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS category VARCHAR(32),
  ADD COLUMN IF NOT EXISTS priority VARCHAR(16) DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS resource_type VARCHAR(32),
  ADD COLUMN IF NOT EXISTS resource_id VARCHAR(64),
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS action_url TEXT,
  ADD COLUMN IF NOT EXISTS action_label VARCHAR(64),
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS icon VARCHAR(64) DEFAULT 'bell',
  ADD COLUMN IF NOT EXISTS severity VARCHAR(16) DEFAULT 'info',
  ADD COLUMN IF NOT EXISTS target_type VARCHAR(16) DEFAULT 'INDIVIDUAL',
  ADD COLUMN IF NOT EXISTS target_segment VARCHAR(64),
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_dismissible BOOLEAN DEFAULT true;

-- Update constraints safely using pg_get_constraintdef for modern PostgreSQL compatibility
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop old status constraints
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.notifications'::regclass 
        AND contype = 'c' 
        AND pg_get_constraintdef(oid) LIKE '%status%'
    LOOP
        EXECUTE 'ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;

    -- Drop old channel constraints
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.notifications'::regclass 
        AND contype = 'c' 
        AND pg_get_constraintdef(oid) LIKE '%channel%'
    LOOP
        EXECUTE 'ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END$$;

-- Add updated constraints
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_channel_check 
  CHECK (channel IN ('EMAIL', 'WHATSAPP', 'PUSH', 'IN_APP'));

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_status_check 
  CHECK (status IN (
    'PENDING', 'SENT', 'FAILED_RETRYABLE', 'FAILED_PERMANENT', 
    'NOT_CONFIGURED', 'DELIVERED', 'READ',
    'DRAFT', 'SCHEDULED', 'PUBLISHED', 'CANCELLED', 'EXPIRED'
  ));

-- 2. CREATE USER_NOTIFICATIONS TABLE & ENABLE RLS IMMEDIATELY
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_notification UNIQUE (notification_id, user_id)
);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- 3. EXTEND CUSTOMER NOTIFICATION PREFERENCES TABLE
ALTER TABLE public.customer_notification_preferences
  ADD COLUMN IF NOT EXISTS in_app_order_updates BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS in_app_promotional_updates BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS in_app_product_updates BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS in_app_system_updates BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS in_app_account_updates BOOLEAN NOT NULL DEFAULT true;

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_unread 
  ON public.user_notifications (user_id, created_at DESC) 
  WHERE read_at IS NULL AND dismissed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_feed 
  ON public.user_notifications (user_id, created_at DESC) 
  WHERE dismissed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_notifications_notif_id 
  ON public.user_notifications (notification_id);

CREATE INDEX IF NOT EXISTS idx_notifications_scheduled 
  ON public.notifications (status, scheduled_at) 
  WHERE status = 'SCHEDULED';

CREATE INDEX IF NOT EXISTS idx_notifications_expires 
  ON public.notifications (expires_at) 
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_target_type 
  ON public.notifications (target_type, created_at DESC);

-- 5. STRICT RLS POLICIES FOR USER_NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view their own user_notifications" ON public.user_notifications;
CREATE POLICY "Users can view their own user_notifications"
  ON public.user_notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'staff')
    )
  );

DROP POLICY IF EXISTS "Users can update their own user_notifications read state" ON public.user_notifications;
CREATE POLICY "Users can update their own user_notifications read state"
  ON public.user_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins have full access to user_notifications" ON public.user_notifications;
CREATE POLICY "Admins have full access to user_notifications"
  ON public.user_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- 6. REINFORCE RLS POLICIES FOR NOTIFICATIONS TABLE
DROP POLICY IF EXISTS "Users can view relevant notifications" ON public.notifications;
CREATE POLICY "Users can view relevant notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR target_type = 'ALL'
    OR EXISTS (
      SELECT 1 FROM public.user_notifications
      WHERE user_notifications.notification_id = notifications.id
      AND user_notifications.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'staff')
    )
  );

DROP POLICY IF EXISTS "Admins can insert and manage notifications" ON public.notifications;
CREATE POLICY "Admins can insert and manage notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'staff')
    )
  );

-- 7. REFRESH SUPABASE SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
