-- ==============================================================================
-- PHASE 10G: INVENTORY LEDGER & ATOMIC OPERATIONS SCHEMA
-- Project: print-studio-production
-- Purpose: Strict inventory tracking, reservations, and atomic operations.
-- ==============================================================================

-- 1. INVENTORY MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('PURCHASE', 'RESERVATION', 'RELEASE', 'SALE', 'RESTOCK', 'ADJUSTMENT', 'RETURN', 'CANCELLATION')),
  reference_id TEXT, -- E.g., Order ID, Session ID
  reason TEXT,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_variant ON public.inventory_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_reference ON public.inventory_movements(reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);

-- 2. RLS POLICIES FOR INVENTORY MOVEMENTS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory movements"
  ON public.inventory_movements FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage inventory movements"
  ON public.inventory_movements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. ATOMIC INVENTORY FUNCTIONS

-- Function to reserve inventory (prevents overselling)
CREATE OR REPLACE FUNCTION public.reserve_inventory(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_reference_id TEXT,
  p_actor_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator
SET search_path = public
AS $$
DECLARE
  v_available INTEGER;
  v_product_id UUID;
  v_track_inventory BOOLEAN;
  v_allow_backorder BOOLEAN;
BEGIN
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Reservation quantity must be greater than zero';
  END IF;

  -- Lock the row for update to prevent concurrent race conditions
  SELECT 
    product_id,
    track_inventory,
    allow_backorder,
    (inventory_quantity - reserved_quantity) INTO v_product_id, v_track_inventory, v_allow_backorder, v_available
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  -- If inventory tracking is disabled, we still record the movement but always allow it
  IF NOT v_track_inventory THEN
    INSERT INTO public.inventory_movements (product_id, variant_id, quantity, movement_type, reference_id, actor_id, reason)
    VALUES (v_product_id, p_variant_id, p_quantity, 'RESERVATION', p_reference_id, p_actor_id, 'Untracked reservation');
    RETURN TRUE;
  END IF;

  -- Check if sufficient stock exists or backorders are allowed
  IF v_available < p_quantity AND NOT v_allow_backorder THEN
    RETURN FALSE; -- Insufficient stock
  END IF;

  -- Update reserved quantity
  UPDATE public.product_variants
  SET 
    reserved_quantity = reserved_quantity + p_quantity,
    updated_at = now()
  WHERE id = p_variant_id;

  -- Log movement
  INSERT INTO public.inventory_movements (product_id, variant_id, quantity, movement_type, reference_id, actor_id, reason)
  VALUES (v_product_id, p_variant_id, p_quantity, 'RESERVATION', p_reference_id, p_actor_id, 'Checkout reservation');

  RETURN TRUE;
END;
$$;

-- Function to confirm sale (converts reservation to actual deduction)
CREATE OR REPLACE FUNCTION public.confirm_sale_inventory(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_reference_id TEXT,
  p_actor_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id UUID;
  v_track_inventory BOOLEAN;
BEGIN
  -- Lock row
  SELECT product_id, track_inventory INTO v_product_id, v_track_inventory
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  IF v_track_inventory THEN
    -- Deduct from physical stock and release reservation
    UPDATE public.product_variants
    SET 
      inventory_quantity = inventory_quantity - p_quantity,
      reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
      updated_at = now()
    WHERE id = p_variant_id;
  END IF;

  -- Log movement
  INSERT INTO public.inventory_movements (product_id, variant_id, quantity, movement_type, reference_id, actor_id, reason)
  VALUES (v_product_id, p_variant_id, p_quantity, 'SALE', p_reference_id, p_actor_id, 'Order confirmed');

  RETURN TRUE;
END;
$$;

-- Function to release reserved inventory (e.g. cart abandoned)
CREATE OR REPLACE FUNCTION public.release_inventory(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_reference_id TEXT,
  p_actor_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id UUID;
  v_track_inventory BOOLEAN;
BEGIN
  -- Lock row
  SELECT product_id, track_inventory INTO v_product_id, v_track_inventory
  FROM public.product_variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Variant not found';
  END IF;

  IF v_track_inventory THEN
    -- Reduce reserved quantity
    UPDATE public.product_variants
    SET 
      reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
      updated_at = now()
    WHERE id = p_variant_id;
  END IF;

  -- Log movement
  INSERT INTO public.inventory_movements (product_id, variant_id, quantity, movement_type, reference_id, actor_id, reason)
  VALUES (v_product_id, p_variant_id, p_quantity, 'RELEASE', p_reference_id, p_actor_id, 'Reservation released');

  RETURN TRUE;
END;
$$;
