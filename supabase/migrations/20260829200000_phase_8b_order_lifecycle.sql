-- ==============================================================================
-- PHASE 8B: STEP 10 — ATOMIC ORDER LIFECYCLE STATE MACHINE RPC & POLICIES
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Atomic status transition, event insertion, double-submission protection
-- ==============================================================================

-- 1. ATOMIC STATUS TRANSITION FUNCTION (PostgreSQL Transactional RPC)
CREATE OR REPLACE FUNCTION public.transition_order_status(
  p_order_id UUID,
  p_target_status TEXT,
  p_expected_current_status TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_caller_role TEXT;
  v_is_owner BOOLEAN;
  v_event_title TEXT;
  v_event_desc TEXT;
  v_valid_transition BOOLEAN := false;
BEGIN
  -- 1. Lock and fetch target order
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found.');
  END IF;

  -- 2. Concurrency / Double-submission check
  IF p_expected_current_status IS NOT NULL AND v_order.status != p_expected_current_status THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Order status has already changed or concurrent modification occurred.',
      'current_status', v_order.status
    );
  END IF;

  -- 3. Determine caller authorization
  SELECT role INTO v_caller_role
  FROM public.profiles
  WHERE id = auth.uid();

  v_is_owner := (v_order.user_id = auth.uid());

  -- 4. Check Allowed Transitions & Business Roles
  -- PENDING
  IF v_order.status = 'pending' THEN
    IF p_target_status IN ('confirmed', 'artwork_review') AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_caller_role = 'admin' OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- CONFIRMED
  ELSIF v_order.status = 'confirmed' THEN
    IF p_target_status = 'artwork_review' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_caller_role = 'admin' OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- ARTWORK_REVIEW
  ELSIF v_order.status = 'artwork_review' THEN
    IF p_target_status IN ('proof_pending', 'proof_approved', 'in_production') AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_caller_role = 'admin' OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- PROOF_PENDING
  ELSIF v_order.status = 'proof_pending' THEN
    IF p_target_status = 'proof_approved' AND (v_caller_role = 'admin' OR v_is_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'artwork_review' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_caller_role = 'admin' OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- PROOF_APPROVED
  ELSIF v_order.status = 'proof_approved' THEN
    IF p_target_status = 'in_production' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;

  -- IN_PRODUCTION
  ELSIF v_order.status = 'in_production' THEN
    IF p_target_status = 'quality_check' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;

  -- QUALITY_CHECK
  ELSIF v_order.status = 'quality_check' THEN
    IF p_target_status IN ('ready', 'in_production') AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;

  -- READY
  ELSIF v_order.status = 'ready' THEN
    IF p_target_status = 'shipped' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;

  -- SHIPPED
  ELSIF v_order.status = 'shipped' THEN
    IF p_target_status IN ('out_for_delivery', 'delivered') AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;

  -- OUT_FOR_DELIVERY
  ELSIF v_order.status = 'out_for_delivery' THEN
    IF p_target_status = 'delivered' AND (v_caller_role = 'admin') THEN
      v_valid_transition := true;
    END IF;
  END IF;

  IF NOT v_valid_transition THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid status transition or insufficient authorization.',
      'from', v_order.status,
      'to', p_target_status
    );
  END IF;

  -- 5. Derive Title and Description for atomic timeline event
  CASE p_target_status
    WHEN 'confirmed' THEN
      v_event_title := 'Payment Verified';
      v_event_desc := 'Transaction verified and order scheduled for pre-press audit.';
    WHEN 'artwork_review' THEN
      v_event_title := 'Pre-Press & Artwork Review';
      v_event_desc := 'Studio technician verifying 300 DPI resolution, 3mm bleed margins, and CMYK gamut.';
    WHEN 'proof_pending' THEN
      v_event_title := 'Digital Proof Dispatched';
      v_event_desc := 'Digital proof generated and awaiting customer approval.';
    WHEN 'proof_approved' THEN
      v_event_title := 'Proof Approved';
      v_event_desc := 'Pre-press digital proof approved for plate imaging and press scheduling.';
    WHEN 'in_production' THEN
      v_event_title := 'Press Printing & Finishing';
      v_event_desc := 'Offset / Digital press run, substrate coating, and die-cutting in progress.';
    WHEN 'quality_check' THEN
      v_event_title := 'Studio Quality Inspection';
      v_event_desc := 'Quality check for color fidelity, sheet count, and structural trim accuracy.';
    WHEN 'ready' THEN
      v_event_title := 'Packed & Labelled';
      v_event_desc := 'Order packed in protective moisture-resistant shipping carton.';
    WHEN 'shipped' THEN
      v_event_title := 'Handed to Logistics Partner';
      v_event_desc := 'Order dispatched and tracking docket generated.';
    WHEN 'out_for_delivery' THEN
      v_event_title := 'Out for Local Delivery';
      v_event_desc := 'Courier partner has dispatched order for final doorstep delivery.';
    WHEN 'delivered' THEN
      v_event_title := 'Successfully Delivered';
      v_event_desc := 'Consignment handed over to recipient. Print order completed.';
    WHEN 'cancelled' THEN
      v_event_title := 'Order Cancelled';
      v_event_desc := 'Order cancelled prior to plate exposure and press run.';
    ELSE
      v_event_title := 'Status Updated';
      v_event_desc := 'Order status transitioned to ' || p_target_status;
  END CASE;

  -- 6. Perform Atomic Update
  UPDATE public.orders
  SET status = p_target_status,
      updated_at = NOW()
  WHERE id = p_order_id;

  INSERT INTO public.order_events (
    order_id,
    status,
    title,
    description,
    created_at
  ) VALUES (
    p_order_id,
    p_target_status,
    v_event_title,
    v_event_desc,
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'new_status', p_target_status,
    'title', v_event_title
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
