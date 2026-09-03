-- Migration: Fix transition_order_status role check to allow 'owner' and 'staff' in addition to 'admin'

CREATE OR REPLACE FUNCTION public.transition_order_status(
  p_order_id UUID,
  p_target_status TEXT,
  p_expected_current_status TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_order RECORD;
  v_caller_role TEXT;
  v_is_admin_or_owner BOOLEAN := false;
  v_is_owner BOOLEAN := false;
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

  v_is_admin_or_owner := (v_caller_role IN ('owner', 'admin', 'staff'));
  v_is_owner := (v_order.user_id = auth.uid());

  -- 4. Check Allowed Transitions & Business Roles
  -- PENDING
  IF v_order.status = 'pending' THEN
    IF p_target_status IN ('confirmed', 'artwork_review') AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_is_admin_or_owner OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- CONFIRMED
  ELSIF v_order.status = 'confirmed' THEN
    IF p_target_status = 'artwork_review' AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_is_admin_or_owner OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- ARTWORK_REVIEW
  ELSIF v_order.status = 'artwork_review' THEN
    IF p_target_status IN ('proof_pending', 'proof_approved', 'in_production') AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_is_admin_or_owner OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- PROOF_PENDING
  ELSIF v_order.status = 'proof_pending' THEN
    IF p_target_status = 'proof_approved' AND (v_is_admin_or_owner OR v_is_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'artwork_review' AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    ELSIF p_target_status = 'cancelled' AND (v_is_admin_or_owner OR v_is_owner) THEN
      v_valid_transition := true;
    END IF;

  -- PROOF_APPROVED
  ELSIF v_order.status = 'proof_approved' THEN
    IF p_target_status = 'in_production' AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    END IF;

  -- IN_PRODUCTION
  ELSIF v_order.status = 'in_production' THEN
    IF p_target_status = 'quality_check' AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    END IF;

  -- QUALITY_CHECK
  ELSIF v_order.status = 'quality_check' THEN
    IF p_target_status IN ('ready', 'in_production') AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    END IF;

  -- READY
  ELSIF v_order.status = 'ready' THEN
    IF p_target_status = 'shipped' AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    END IF;

  -- SHIPPED
  ELSIF v_order.status = 'shipped' THEN
    IF p_target_status IN ('out_for_delivery', 'delivered') AND (v_is_admin_or_owner) THEN
      v_valid_transition := true;
    END IF;

  -- OUT_FOR_DELIVERY
  ELSIF v_order.status = 'out_for_delivery' THEN
    IF p_target_status = 'delivered' AND (v_is_admin_or_owner) THEN
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
      v_event_title := 'Quality Inspection';
      v_event_desc := 'Color densitometry, substrate gauge, and trim registration verified.';
    WHEN 'ready' THEN
      v_event_title := 'Packed & Labelled';
      v_event_desc := 'Order packed in moisture-resistant export packaging with shipping barcode.';
    WHEN 'shipped' THEN
      v_event_title := 'Handed to Logistics Partner';
      v_event_desc := 'Consignment handed to courier partner for domestic transport.';
    WHEN 'out_for_delivery' THEN
      v_event_title := 'Out for Local Delivery';
      v_event_desc := 'Shipment onboard courier delivery van for doorstep handover.';
    WHEN 'delivered' THEN
      v_event_title := 'Successfully Delivered';
      v_event_desc := 'Consignment delivered and verified with OTP/Signature.';
    WHEN 'cancelled' THEN
      v_event_title := 'Order Cancelled';
      v_event_desc := 'Order cancelled prior to plate exposure and press run.';
    ELSE
      v_event_title := 'Status Updated';
      v_event_desc := 'Order status changed to ' || p_target_status;
  END CASE;

  -- 6. Update order status
  UPDATE public.orders
  SET
    status = p_target_status::public.order_status,
    updated_at = NOW()
  WHERE id = v_order.id;

  -- 7. Insert audit event into order_events
  INSERT INTO public.order_events (
    order_id,
    status,
    title,
    description,
    created_by,
    created_at
  ) VALUES (
    v_order.id,
    p_target_status::public.order_status,
    v_event_title,
    v_event_desc,
    auth.uid(),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'new_status', p_target_status,
    'event_title', v_event_title
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
