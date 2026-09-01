-- ==============================================================================
-- Migration: 20260901060000_phase_11c_performance_indexes.sql
-- Description: Production database performance and composite indexing for 100k+ scale
-- ==============================================================================

-- 1. Orders Table High-Volume Query & Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at 
  ON public.orders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_status_created_at 
  ON public.orders (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_payment_status_created_at 
  ON public.orders (payment_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_order_number 
  ON public.orders (order_number);

CREATE INDEX IF NOT EXISTS idx_orders_invoice_number 
  ON public.orders (invoice_number);

-- 2. Order Items & Events Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
  ON public.order_items (order_id);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id_created_at 
  ON public.order_events (order_id, created_at ASC);

-- 3. Payments & Refunds Financial Query Indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id 
  ON public.payments (order_id);

CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id 
  ON public.payments (provider_order_id);

CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id 
  ON public.payments (provider_payment_id);

CREATE INDEX IF NOT EXISTS idx_payments_status_created_at 
  ON public.payments (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_payment_id 
  ON public.payment_refunds (payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_idempotency_key 
  ON public.payment_refunds (idempotency_key);

-- 4. Products & Catalogue Fast Storefront Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_products_status_visibility_featured 
  ON public.products (status, visibility, is_featured, sort_order);

CREATE INDEX IF NOT EXISTS idx_products_handle 
  ON public.products (handle);

CREATE INDEX IF NOT EXISTS idx_products_sku 
  ON public.products (sku);

CREATE INDEX IF NOT EXISTS idx_product_category_links_cat_prod 
  ON public.product_category_links (category_id, product_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id_status 
  ON public.product_variants (product_id, status);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id_sort 
  ON public.product_media (product_id, sort_order);

-- 5. Shipping & Webhook Events Fast Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_shipping_shipments_order_id 
  ON public.shipping_shipments (order_id);

CREATE INDEX IF NOT EXISTS idx_shipping_shipments_awb_number 
  ON public.shipping_shipments (awb_number);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event_id 
  ON public.webhook_events (provider, event_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_created 
  ON public.admin_audit_logs (actor_id, created_at DESC);
