-- ==============================================================================
-- PHASE 11B: IN-APP NOTIFICATIONS
-- Project: PreetyPrints
-- Purpose: Expand notifications table to support IN_APP channel with UI fields,
--          read state, and fast indexing.
-- ==============================================================================

-- 1. ADD NEW COLUMNS TO NOTIFICATIONS TABLE
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS category VARCHAR(32),
  ADD COLUMN IF NOT EXISTS priority VARCHAR(16) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS resource_type VARCHAR(32),
  ADD COLUMN IF NOT EXISTS resource_id VARCHAR(64),
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- 2. UPDATE CHANNEL CONSTRAINT TO ALLOW 'IN_APP'
-- Drop the existing check constraint on channel and status. 
-- In Postgres, if a constraint was created without an explicit name (e.g. inline check), 
-- it's usually named table_column_check. We use a safe PL/pgSQL block to handle this dynamically.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.notifications'::regclass 
        AND contype = 'c' 
        AND (consrc LIKE '%channel%' OR pg_get_constraintdef(oid) LIKE '%channel%')
    LOOP
        EXECUTE 'ALTER TABLE public.notifications DROP CONSTRAINT ' || r.conname;
    END LOOP;
    
    FOR r IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.notifications'::regclass 
        AND contype = 'c' 
        AND (consrc LIKE '%status%' OR pg_get_constraintdef(oid) LIKE '%status%')
    LOOP
        EXECUTE 'ALTER TABLE public.notifications DROP CONSTRAINT ' || r.conname;
    END LOOP;
END$$;

-- Add back the expanded constraints
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_channel_check 
  CHECK (channel IN ('EMAIL', 'WHATSAPP', 'PUSH', 'IN_APP'));

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_status_check 
  CHECK (status IN ('PENDING', 'SENT', 'FAILED_RETRYABLE', 'FAILED_PERMANENT', 'NOT_CONFIGURED', 'DELIVERED', 'READ'));

-- 3. CREATE INDEXES FOR FAST UNREAD COUNTS AND PAGINATION
CREATE INDEX IF NOT EXISTS idx_notifications_in_app_unread 
  ON public.notifications (user_id, created_at DESC) 
  WHERE channel = 'IN_APP' AND read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_in_app_list 
  ON public.notifications (user_id, created_at DESC) 
  WHERE channel = 'IN_APP' AND is_archived = false;

-- 4. UPDATE ROW LEVEL SECURITY (RLS) FOR NOTIFICATIONS
-- We need to allow customers to UPDATE the read_at column of their own IN_APP notifications.
DROP POLICY IF EXISTS "Customers can update read_at for their own notifications" ON public.notifications;
CREATE POLICY "Customers can update read_at for their own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND channel = 'IN_APP')
  WITH CHECK (user_id = auth.uid() AND channel = 'IN_APP');
