-- ==============================================================================
-- PHASE 11F: NOTIFICATION & CUSTOMER COMMUNICATION SYSTEM
-- Project: PreetyPrints
-- Purpose: Provider-independent customer notifications table, delivery states,
--          idempotency keys, delivery tracking, customer preferences, and RLS.
-- ==============================================================================

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type VARCHAR(64) NOT NULL,
  channel VARCHAR(16) NOT NULL CHECK (channel IN ('EMAIL', 'WHATSAPP', 'PUSH')),
  recipient TEXT NOT NULL,
  template_key VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (
    status IN ('PENDING', 'SENT', 'FAILED_RETRYABLE', 'FAILED_PERMANENT', 'NOT_CONFIGURED')
  ),
  provider VARCHAR(32) NOT NULL DEFAULT 'mock',
  provider_message_id TEXT,
  idempotency_key VARCHAR(128) UNIQUE NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_code TEXT,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ
);

-- 2. CUSTOMER NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.customer_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_order_updates BOOLEAN NOT NULL DEFAULT true,
  whatsapp_order_updates BOOLEAN NOT NULL DEFAULT true,
  push_order_updates BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. INDEXES FOR HIGH-THROUGHPUT LOOKUPS & AUDIT
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created 
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_order_id_created 
  ON public.notifications (order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_status_created 
  ON public.notifications (status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_notifications_event_type 
  ON public.notifications (event_type);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notification_preferences ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR NOTIFICATIONS
DROP POLICY IF EXISTS "Customers can view their own notifications" ON public.notifications;
CREATE POLICY "Customers can view their own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'support', 'production')
    )
  );

DROP POLICY IF EXISTS "Admins have full access to notifications" ON public.notifications;
CREATE POLICY "Admins have full access to notifications"
  ON public.notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'support')
    )
  );

-- 6. RLS POLICIES FOR CUSTOMER PREFERENCES
DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON public.customer_notification_preferences;
CREATE POLICY "Users can manage their own notification preferences"
  ON public.customer_notification_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view customer notification preferences" ON public.customer_notification_preferences;
CREATE POLICY "Admins can view customer notification preferences"
  ON public.customer_notification_preferences
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
