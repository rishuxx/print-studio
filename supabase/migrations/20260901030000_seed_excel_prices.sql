-- ==============================================================================
-- PHASE 13: INITIAL RATE CARD SEED
-- Generated from Initial_Product_Rate_Card_Competitor_Matched.xlsx
-- ==============================================================================


DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'standard-business-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('standard-business-visiting-cards', 'Standard Business Visiting Cards', 'PRN-' || upper(substring('standard-business-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/standard-material-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'rounded-corner-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('rounded-corner-visiting-cards', 'Rounded Corner Visiting Cards', 'PRN-' || upper(substring('rounded-corner-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 500, 100, 500, 'https://printo.in/categories/business-cards/customizable-products/rounded-corner-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'square-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('square-visiting-cards', 'Square Visiting Cards', 'PRN-' || upper(substring('square-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 400, 100, 400, 'https://printo.in/categories/business-cards/customizable-products/square-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'eco-friendly-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('eco-friendly-visiting-cards', 'Eco-Friendly Visiting Cards', 'PRN-' || upper(substring('eco-friendly-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 100, 600, 'https://printo.in/categories/business-cards/customizable-products/eco', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'raised-foil-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('raised-foil-visiting-cards', 'Raised Foil Visiting Cards', 'PRN-' || upper(substring('raised-foil-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 100, 1300, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/raised-foil-business-cards', 'Premium finish');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'non-tearable-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('non-tearable-visiting-cards', 'Non-Tearable Visiting Cards', 'PRN-' || upper(substring('non-tearable-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 700, 100, 700, 'https://printo.in/categories/business-cards/customizable-products/non-tearable-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'mini-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('mini-visiting-cards', 'Mini Visiting Cards', 'PRN-' || upper(substring('mini-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/mini-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'spot-uv-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('spot-uv-visiting-cards', 'Spot UV Visiting Cards', 'PRN-' || upper(substring('spot-uv-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1100, 100, 1100, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/spot-uv-visiting-cards', 'Premium finish');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'silver-foil-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('silver-foil-visiting-cards', 'Silver Foil Visiting Cards', 'PRN-' || upper(substring('silver-foil-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 100, 1300, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/silver-foil-visiting-cards', 'Premium finish');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'gold-foil-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('gold-foil-visiting-cards', 'Gold Foil Visiting Cards', 'PRN-' || upper(substring('gold-foil-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 100, 1300, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/gold-foil-visiting-cards', 'Premium finish');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-visiting-cards', 'Premium Visiting Cards', 'PRN-' || upper(substring('premium-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1100, 100, 1100, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/premium-finish-business-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'special-metallic-paper-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('special-metallic-paper-visiting-cards', 'Special (Metallic) Paper Visiting Cards', 'PRN-' || upper(substring('special-metallic-paper-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 700, 100, 700, 'https://printo.in/categories/business-cards/customizable-products/metallic-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'textured-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('textured-visiting-cards', 'Textured Visiting Cards', 'PRN-' || upper(substring('textured-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 100, 600, 'https://printo.in/categories/business-cards/customizable-products/textured-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'laminated-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('laminated-visiting-cards', 'Laminated Visiting Cards', 'PRN-' || upper(substring('laminated-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 500, 100, 500, 'https://printo.in/categories/business-cards/customizable-products/premium-laminated-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-sandwich-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-sandwich-visiting-cards', 'Premium Sandwich Visiting Cards', 'PRN-' || upper(substring('premium-sandwich-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1100, 50, 1100, 'https://printo.in/categories/business-cards/customizable-products/sandwich-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'luxury-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('luxury-visiting-cards', 'Luxury Visiting Cards', 'PRN-' || upper(substring('luxury-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1100, 100, 1100, 'https://printo.in/categories/premiumfinish-business-cards/customizable-products/luxury-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'qr-code-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('qr-code-visiting-cards', 'QR Code Visiting Cards', 'PRN-' || upper(substring('qr-code-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/qr-code-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'plastic-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('plastic-visiting-cards', 'Plastic Visiting Cards', 'PRN-' || upper(substring('plastic-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 700, 100, 700, 'https://printo.in/categories/business-cards/customizable-products/plastic-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'matte-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('matte-visiting-cards', 'Matte Visiting Cards', 'PRN-' || upper(substring('matte-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/matte-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'glossy-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('glossy-visiting-cards', 'Glossy Visiting Cards', 'PRN-' || upper(substring('glossy-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/glossy-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'kraft-paper-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('kraft-paper-visiting-cards', 'Kraft Paper Visiting Cards', 'PRN-' || upper(substring('kraft-paper-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 100, 600, 'https://printo.in/categories/business-cards/customizable-products/kraft-paper-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'die-cut-visiting-cards-shape';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('die-cut-visiting-cards-shape', 'Die-Cut Visiting Cards (Shape)', 'PRN-' || upper(substring('die-cut-visiting-cards-shape' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1900, 100, 1900, 'https://printo.in/categories/business-cards/customizable-products/die-cut-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'classic-rectangle-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('classic-rectangle-visiting-cards', 'Classic Rectangle Visiting Cards', 'PRN-' || upper(substring('classic-rectangle-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 300, 100, 300, 'https://printo.in/categories/business-cards/customizable-products/rectangle-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'circular-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('circular-visiting-cards', 'Circular Visiting Cards', 'PRN-' || upper(substring('circular-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 400, 100, 400, 'https://printo.in/categories/business-cards/customizable-products/round-business-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'u-shape-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('u-shape-visiting-cards', 'U-Shape Visiting Cards', 'PRN-' || upper(substring('u-shape-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 400, 100, 400, 'https://printo.in/categories/business-cards/customizable-products/u-shape-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'oval-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('oval-visiting-cards', 'Oval Visiting Cards', 'PRN-' || upper(substring('oval-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 400, 100, 400, 'https://printo.in/categories/business-cards/customizable-products/oval-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-shape-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-shape-visiting-cards', 'Custom Shape Visiting Cards', 'PRN-' || upper(substring('custom-shape-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1900, 100, 1900, 'https://printo.in/categories/business-cards/customizable-products/custom-shape-business-card', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-finish-stationery-combo';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 4200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-finish-stationery-combo', 'Premium Finish Stationery (Combo)', 'PRN-' || upper(substring('premium-finish-stationery-combo' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 4200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 4200, 100, 4200, 'https://printo.in/categories/business-stationery-combo/customizable-products/premium-finish-stationery', 'VC+letterhead+envelope combo');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'business-cards-visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('business-cards-visiting-cards', 'Business Cards & Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-business-stationery-combo';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 4800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-business-stationery-combo', 'Premium Business Stationery (Combo)', 'PRN-' || upper(substring('premium-business-stationery-combo' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 4800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 4800, 100, 4800, 'https://printo.in/categories/business-stationery-combo/customizable-products/premium-business-stationery', 'VC+letterhead+envelope combo');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'pre-ink-rubber-stamps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 37600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('pre-ink-rubber-stamps', 'Pre-Ink Rubber Stamps', 'PRN-' || upper(substring('pre-ink-rubber-stamps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 37600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 37600, 1, 37600, 'https://printo.in/categories/rubber-stamp/customizable-products/pre-ink-rubber-stamps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'pvc-id-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 13600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('pvc-id-cards', 'PVC ID Cards', 'PRN-' || upper(substring('pvc-id-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 13600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 13600, 1, 13600, 'https://printo.in/categories/id-cards/customizable-products/teslin-id-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-letterheads-a4';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-letterheads-a4', 'Custom Letterheads (A4)', 'PRN-' || upper(substring('custom-letterheads-a4' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2200, 10, 2200, 'https://printo.in/categories/letterheads/customizable-products/a4-letterheads', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = '10-long-envelope';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('10-long-envelope', '#10 Long Envelope', 'PRN-' || upper(substring('10-long-envelope' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2300, 25, 2300, 'https://printo.in/categories/envelopes/customizable-products/10-envelope-long', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-envelopes';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-envelopes', 'Custom Printed Envelopes', 'PRN-' || upper(substring('custom-printed-envelopes' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2300, 25, 2300, 'https://printo.in/categories/envelopes/customizable-products/custom-printed-envelopes', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-office-essentials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-office-essentials', 'Stationery & Office Essentials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'kraft-shipping-envelopes';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('kraft-shipping-envelopes', 'Kraft Shipping Envelopes', 'PRN-' || upper(substring('kraft-shipping-envelopes' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1800, 100, 1800, 'https://printo.in/categories/shipping-envelopes/customizable-products/kraft-shipping-envelopes', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'ultra-premium-round-neck-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 62900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('ultra-premium-round-neck-t-shirt', 'Ultra Premium Round Neck T-shirt', 'PRN-' || upper(substring('ultra-premium-round-neck-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 62900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 62900, 1, 62900, 'https://printo.in/categories/t-shirts/customizable-products/ultra-premium-round-neck-tshirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'cotton-premium-round-neck-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 49900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('cotton-premium-round-neck-t-shirt', 'Cotton Premium Round Neck T-shirt', 'PRN-' || upper(substring('cotton-premium-round-neck-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 49900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 49900, 1, 49900, 'https://printo.in/categories/t-shirts/customizable-products/round-neck-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'eco-friendly-round-neck-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 37900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('eco-friendly-round-neck-t-shirt', 'Eco-Friendly Round Neck T-Shirt', 'PRN-' || upper(substring('eco-friendly-round-neck-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 37900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 37900, 1, 37900, 'https://printo.in/categories/t-shirts/customizable-products/unisex-round-neck-eco-t-shirt', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'dry-fit-round-neck-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 57900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('dry-fit-round-neck-t-shirt', 'Dry-Fit Round Neck T-shirt', 'PRN-' || upper(substring('dry-fit-round-neck-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 57900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 57900, 1, 57900, 'https://printo.in/categories/t-shirts/customizable-products/dry-fit-round-neck', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'men-s-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 49900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('men-s-polo-t-shirt', 'Men''s Polo T-shirt', 'PRN-' || upper(substring('men-s-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 49900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 49900, 1, 49900, 'https://printo.in/categories/branded-t-shirts/customizable-products/mens-polo-t-shirt', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'signature-popcorn-knit-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 83900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('signature-popcorn-knit-polo-t-shirt', 'Signature Popcorn Knit Polo T-shirt', 'PRN-' || upper(substring('signature-popcorn-knit-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 83900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 83900, 1, 83900, 'https://printo.in/categories/branded-t-shirts/customizable-products/signature-popcorn-knit-polo', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'ultra-premium-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 97900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('ultra-premium-polo-t-shirt', 'Ultra Premium Polo T-shirt', 'PRN-' || upper(substring('ultra-premium-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 97900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 97900, 1, 97900, 'https://printo.in/categories/t-shirts/customizable-products/premium-polo-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'eco-friendly-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 58000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('eco-friendly-polo-t-shirt', 'Eco-Friendly Polo T-Shirt', 'PRN-' || upper(substring('eco-friendly-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 58000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 58000, 1, 58000, 'https://printo.in/categories/t-shirts/customizable-products/eco-polos', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'dry-fit-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 83900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('dry-fit-polo-t-shirt', 'Dry-Fit Polo T-shirt', 'PRN-' || upper(substring('dry-fit-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 83900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 83900, 1, 83900, 'https://printo.in/categories/t-shirts/customizable-products/dry-fit-polo', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'm-s-polo-t-shirt-branded';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 146900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('m-s-polo-t-shirt-branded', 'M&S Polo T-shirt (Branded)', 'PRN-' || upper(substring('m-s-polo-t-shirt-branded' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 146900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 146900, 1, 146900, 'https://printo.in/categories/branded-t-shirts/customizable-products/mands-polo-t-shirt', 'Branded');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'scott-organic-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 93000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('scott-organic-polo-t-shirt', 'Scott Organic Polo T-Shirt', 'PRN-' || upper(substring('scott-organic-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 93000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 93000, 1, 93000, 'https://printo.in/categories/branded-t-shirts/customizable-products/scott-organic-polo-t-shirt', 'Branded');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'ultra-premium-crew-neck-sweatshirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 100600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('ultra-premium-crew-neck-sweatshirt', 'Ultra Premium Crew Neck Sweatshirt', 'PRN-' || upper(substring('ultra-premium-crew-neck-sweatshirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 100600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 100600, 1, 100600, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/crew-neck-sweatshirt-no-zipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'eco-classic-high-neck-jacket';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 126500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('eco-classic-high-neck-jacket', 'Eco Classic High Neck Jacket', 'PRN-' || upper(substring('eco-classic-high-neck-jacket' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 126500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 126500, 1, 126500, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/eco-classic-high-neck-jacket', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'ultra-premium-hoodie';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 151900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('ultra-premium-hoodie', 'Ultra Premium Hoodie', 'PRN-' || upper(substring('ultra-premium-hoodie' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 151900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 151900, 1, 151900, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/multicolour-printed-zip-hoodies', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'eco-classic-hoodie';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 89900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('eco-classic-hoodie', 'Eco Classic Hoodie', 'PRN-' || upper(substring('eco-classic-hoodie' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 89900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 89900, 1, 89900, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/embroidery-hoodie', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'high-neck-jacket';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 153900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('high-neck-jacket', 'High Neck Jacket', 'PRN-' || upper(substring('high-neck-jacket' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 153900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 153900, 1, 153900, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/high-neck-jackets', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-hoodies-and-jackets';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 89900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-hoodies-and-jackets', 'Custom Hoodies and Jackets', 'PRN-' || upper(substring('custom-hoodies-and-jackets' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 89900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 89900, 1, 89900, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/personalized-hoodies', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'embroidered-polo-t-shirt';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 98900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('embroidered-polo-t-shirt', 'Embroidered Polo T-shirt', 'PRN-' || upper(substring('embroidered-polo-t-shirt' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 98900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 98900, 1, 98900, 'https://printo.in/categories/t-shirts/customizable-products/embroidery-polo-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'embroidered-jackets';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 120900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('embroidered-jackets', 'Embroidered Jackets', 'PRN-' || upper(substring('embroidered-jackets' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 120900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 120900, 1, 120900, 'https://printo.in/categories/sweatshirt-and-hoodies/customizable-products/embroidered-jackets', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'rainsuit-with-hood-pant';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 99900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('rainsuit-with-hood-pant', 'Rainsuit with Hood & Pant', 'PRN-' || upper(substring('rainsuit-with-hood-pant' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 99900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 99900, 1, 99900, 'https://printo.in/categories/apparel-accessories/customizable-products/rainsuit-with-hood-pant', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'raincoat-long-with-hood';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 99900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('raincoat-long-with-hood', 'Raincoat Long with Hood', 'PRN-' || upper(substring('raincoat-long-with-hood' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 99900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 99900, 1, 99900, 'https://printo.in/categories/apparel-accessories/customizable-products/raincoat-long-with-hood', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'umbrella-small-two-fold';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 63000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('umbrella-small-two-fold', 'Umbrella Small Two Fold', 'PRN-' || upper(substring('umbrella-small-two-fold' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 63000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 63000, 1, 63000, 'https://printo.in/categories/apparel-accessories/customizable-products/umbrella-small-2fold', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'umbrella-long-golf-style';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 95000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('umbrella-long-golf-style', 'Umbrella Long Golf Style', 'PRN-' || upper(substring('umbrella-long-golf-style' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 95000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 95000, 1, 95000, 'https://printo.in/categories/apparel-accessories/customizable-products/umbrella-long-golf-style', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-cotton-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 28000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-cotton-caps', 'Premium Cotton Caps', 'PRN-' || upper(substring('premium-cotton-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 28000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 28000, 1, 28000, 'https://printo.in/categories/caps/customizable-products/premium-cotton-caps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-line-stitching-cotton-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 20400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-line-stitching-cotton-caps', 'Premium Line Stitching Cotton Caps', 'PRN-' || upper(substring('premium-line-stitching-cotton-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 20400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 20400, 50, 20400, 'https://printo.in/categories/caps/customizable-products/line-caps', 'MOQ 50');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-piping-cotton-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 20400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-piping-cotton-caps', 'Premium Piping Cotton Caps', 'PRN-' || upper(substring('premium-piping-cotton-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 20400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 20400, 50, 20400, 'https://printo.in/categories/caps/customizable-products/piping-caps', 'MOQ 50');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-t-shirts-polos-winterwear';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-t-shirts-polos-winterwear', 'Apparel (T-Shirts, Polos, Winterwear)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-tipping-cotton-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 20400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-tipping-cotton-caps', 'Premium Tipping Cotton Caps', 'PRN-' || upper(substring('premium-tipping-cotton-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 20400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 20400, 50, 20400, 'https://printo.in/categories/caps/customizable-products/tipping-caps', 'MOQ 50');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-finish-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-finish-stickers', 'Premium Finish Stickers', 'PRN-' || upper(substring('premium-finish-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1500, 50, 1500, 'https://printo.in/categories/premium-stickers/customizable-products/premium-finish-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'matte-laminated-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('matte-laminated-stickers', 'Matte Laminated Stickers', 'PRN-' || upper(substring('matte-laminated-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2800, 30, 2800, 'https://printo.in/categories/premium-stickers/customizable-products/matte-laminated-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'holographic-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('holographic-stickers', 'Holographic Stickers', 'PRN-' || upper(substring('holographic-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2000, 50, 2000, 'https://printo.in/categories/stickers-and-labels/customizable-products/holographic-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'silver-foiling-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('silver-foiling-stickers', 'Silver Foiling Stickers', 'PRN-' || upper(substring('silver-foiling-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1600, 50, 1600, 'https://printo.in/categories/premium-stickers/customizable-products/silver-foiling-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'spot-uv-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('spot-uv-stickers', 'Spot UV Stickers', 'PRN-' || upper(substring('spot-uv-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1500, 50, 1500, 'https://printo.in/categories/premium-stickers/customizable-products/spot-uv-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'gold-foiling-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('gold-foiling-stickers', 'Gold Foiling Stickers', 'PRN-' || upper(substring('gold-foiling-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1600, 50, 1600, 'https://printo.in/categories/premium-stickers/customizable-products/gold-foiling-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'dome-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 6300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('dome-stickers', 'Dome Stickers', 'PRN-' || upper(substring('dome-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 6300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 6300, 50, 6300, 'https://printo.in/categories/stickers-and-labels/customizable-products/dome-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'matte-sticker-sheets';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 22100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('matte-sticker-sheets', 'Matte Sticker Sheets', 'PRN-' || upper(substring('matte-sticker-sheets' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 22100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 22100, 5, 22100, 'https://printo.in/categories/premium-stickers/customizable-products/matte-laminated-sticker-sheets', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-sheet-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 12500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-sheet-stickers', 'Custom Printed Sheet Stickers', 'PRN-' || upper(substring('custom-printed-sheet-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 12500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 12500, 10, 12500, 'https://printo.in/categories/sheet-stickers/customizable-products/custom-printed-sheet-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'front-adhesive-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('front-adhesive-stickers', 'Front Adhesive Stickers', 'PRN-' || upper(substring('front-adhesive-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 900, 50, 900, 'https://printo.in/categories/stickers-and-labels/customizable-products/front-adhesive-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-opaque-vinyl-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-opaque-vinyl-stickers', 'Custom Opaque (Vinyl) Stickers', 'PRN-' || upper(substring('custom-opaque-vinyl-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1600, 30, 1600, 'https://printo.in/categories/stickers-and-labels/customizable-products/opaque-vinyl-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'clear-vinyl-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('clear-vinyl-stickers', 'Clear (Vinyl) Stickers', 'PRN-' || upper(substring('clear-vinyl-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 30, 1300, 'https://printo.in/categories/stickers-and-labels/customizable-products/clear-vinyl-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'rectangle-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('rectangle-stickers', 'Rectangle Stickers', 'PRN-' || upper(substring('rectangle-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 30, 1300, 'https://printo.in/categories/stickers-and-labels/customizable-products/rectangle-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'square-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('square-stickers', 'Square Stickers', 'PRN-' || upper(substring('square-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1600, 30, 1600, 'https://printo.in/categories/stickers-and-labels/customizable-products/square-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'circle-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('circle-stickers', 'Circle Stickers', 'PRN-' || upper(substring('circle-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1500, 30, 1500, 'https://printo.in/categories/stickers-and-labels/customizable-products/circle-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'die-cut-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('die-cut-stickers', 'Die-Cut Stickers', 'PRN-' || upper(substring('die-cut-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1600, 30, 1600, 'https://printo.in/categories/stickers-and-labels/customizable-products/die-cut-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-laptop-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-laptop-stickers', 'Custom Laptop Stickers', 'PRN-' || upper(substring('custom-laptop-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 30, 1300, 'https://printo.in/categories/stickers-and-labels/customizable-products/custom-laptop-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-shape-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-shape-stickers', 'Custom Shape Stickers', 'PRN-' || upper(substring('custom-shape-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 1300, 30, 1300, 'https://printo.in/categories/stickers-and-labels/customizable-products/custom-shape-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-shape-decals';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 15600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-shape-decals', 'Custom Shape Decals', 'PRN-' || upper(substring('custom-shape-decals' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 15600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 15600, 1, 15600, 'https://printo.in/categories/decals/customizable-products/custom-shape-wall-decals', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-window-decals';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 18800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-window-decals', 'Custom Window Decals', 'PRN-' || upper(substring('custom-window-decals' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 18800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 18800, 1, 18800, 'https://printo.in/categories/decals/customizable-products/custom-window-decals', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'bumper-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 16100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('bumper-stickers', 'Bumper Stickers', 'PRN-' || upper(substring('bumper-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 16100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 16100, 1, 16100, 'https://printo.in/categories/decals/customizable-products/bumper-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'frosted-vinyl-decals';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 13400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('frosted-vinyl-decals', 'Frosted Vinyl Decals', 'PRN-' || upper(substring('frosted-vinyl-decals' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 13400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 13400, 1, 13400, 'https://printo.in/categories/decals/customizable-products/frosted-decals', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'kraft-paper-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('kraft-paper-labels', 'Kraft Paper Labels', 'PRN-' || upper(substring('kraft-paper-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 50, 600, 'https://printo.in/categories/labels/customizable-products/kraft-paper-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'product-packaging-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('product-packaging-labels', 'Product Packaging Labels', 'PRN-' || upper(substring('product-packaging-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 50, 600, 'https://printo.in/categories/labels/customizable-products/product-packaging-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'water-proof-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('water-proof-labels', 'Water Proof Labels', 'PRN-' || upper(substring('water-proof-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 800, 50, 800, 'https://printo.in/categories/labels/customizable-products/water-proof-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stickers-labels-decals';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stickers-labels-decals', 'Stickers, Labels & Decals', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'circle-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('circle-labels', 'Circle Labels', 'PRN-' || upper(substring('circle-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 600, 50, 600, 'https://printo.in/categories/labels/customizable-products/circle-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'packaging-boxes';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('packaging-boxes', 'Packaging & Boxes', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'flat-mailer-boxes';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 3100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('flat-mailer-boxes', 'Flat Mailer Boxes', 'PRN-' || upper(substring('flat-mailer-boxes' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 3100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 3100, 10, 3100, 'https://printo.in/categories/shipping-and-flat-mailer-boxes/customizable-products/flat-mailer-boxes', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'packaging-boxes';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('packaging-boxes', 'Packaging & Boxes', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-flexible-pouches';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 3700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-flexible-pouches', 'Custom Printed Flexible Pouches', 'PRN-' || upper(substring('custom-printed-flexible-pouches' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 3700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 3700, 500, 3700, 'https://printo.in/categories/standup-pouches/customizable-products/custom-printed-flexible-pouches', 'MOQ 500');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'packaging-boxes';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('packaging-boxes', 'Packaging & Boxes', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-premium-paper-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 6300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-premium-paper-bags', 'Custom Premium Paper Bags', 'PRN-' || upper(substring('custom-premium-paper-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 6300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 6300, 100, 6300, 'https://printo.in/categories/premium-paper-bags/customizable-products/premium-paper-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'packaging-boxes';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('packaging-boxes', 'Packaging & Boxes', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'personalized-gift-wrapping-paper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2100 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('personalized-gift-wrapping-paper', 'Personalized Gift Wrapping Paper', 'PRN-' || upper(substring('personalized-gift-wrapping-paper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2100)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 2100, 25, 2100, 'https://printo.in/categories/gift-wrapping-paper/customizable-products/custom-gift-wrapping-paper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'packaging-boxes';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('packaging-boxes', 'Packaging & Boxes', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-hang-tags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-hang-tags', 'Custom Printed Hang Tags', 'PRN-' || upper(substring('custom-printed-hang-tags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 500, 100, 500, 'https://printo.in/categories/hang-tags/customizable-products/custom-hang-tags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-hanging-acrylic-sign-board';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-hanging-acrylic-sign-board', 'Custom Hanging Acrylic Sign Board', 'PRN-' || upper(substring('custom-hanging-acrylic-sign-board' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 32600, 1, 19900, 'https://printo.in/categories/acrylic-signage/customizable-products/custom-hanging-acrylic-sign-board', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-acrylic-sign-board-with-d-s-tape';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-acrylic-sign-board-with-d-s-tape', 'Custom Acrylic Sign Board with D/S Tape', 'PRN-' || upper(substring('custom-acrylic-sign-board-with-d-s-tape' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 23600, 1, 19900, 'https://printo.in/categories/acrylic-signage/customizable-products/custom-acrylic-sign-board-with-ds-tape', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-acrylic-sign-board-with-studs';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-acrylic-sign-board-with-studs', 'Custom Acrylic Sign Board with Studs', 'PRN-' || upper(substring('custom-acrylic-sign-board-with-studs' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 64800, 1, 19900, 'https://printo.in/categories/acrylic-signage/customizable-products/custom-acrylic-sign-board-with-studs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'stick-on-signs';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('stick-on-signs', 'Stick On Signs', 'PRN-' || upper(substring('stick-on-signs' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 19000, 1, 19900, 'https://printo.in/categories/sun-board-signs/customizable-products/stick-on-signs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'hanging-display-boards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('hanging-display-boards', 'Hanging Display Boards', 'PRN-' || upper(substring('hanging-display-boards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 25400, 1, 19900, 'https://printo.in/categories/sun-board-signs/customizable-products/hanging-board-signs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'wall-mount-signs';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('wall-mount-signs', 'Wall Mount Signs', 'PRN-' || upper(substring('wall-mount-signs' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 41500, 1, 19900, 'https://printo.in/categories/sun-board-signs/customizable-products/wall-mounted-signs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'roll-up-standees';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('roll-up-standees', 'Roll Up Standees', 'PRN-' || upper(substring('roll-up-standees' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 185100, 1, 19900, 'https://printo.in/categories/standees/customizable-products/roll-up-standees', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-name-plates';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-name-plates', 'Custom Printed Name Plates', 'PRN-' || upper(substring('custom-printed-name-plates' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 50700, 1, 19900, 'https://printo.in/categories/name-plates/customizable-products/personalized-name-plates', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-sun-board-posters-foam-mounted';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-sun-board-posters-foam-mounted', 'Custom Sun Board Posters (Foam-Mounted)', 'PRN-' || upper(substring('custom-sun-board-posters-foam-mounted' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 143300, 1, 19900, 'https://printo.in/categories/posters/customizable-products/foam-mounted-posters', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'large-format-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('large-format-stickers', 'Large Format Stickers', 'PRN-' || upper(substring('large-format-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 229600, 1, 19900, 'https://printo.in/categories/signages-and-banners/customizable-products/large-format-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-decals';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-decals', 'Custom Printed Decals', 'PRN-' || upper(substring('custom-printed-decals' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 15600, 1, 19900, 'https://printo.in/categories/decals/customizable-products/custom-shape-wall-decals', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-printed-banners';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-printed-banners', 'Custom Printed Banners', 'PRN-' || upper(substring('custom-printed-banners' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 114900, 1, 19900, 'https://printo.in/categories/banners/customizable-products/custom-printed-banners', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'acrylic-wood-qr-stands';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('acrylic-wood-qr-stands', 'Acrylic Wood QR Stands', 'PRN-' || upper(substring('acrylic-wood-qr-stands' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 26700, 1, 19900, 'https://printo.in/categories/acrylic-desk-stands/customizable-products/wooden-acrylic-qr-code-stand', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signage-banners-standees';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signage-banners-standees', 'Signage, Banners & Standees', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'acrylic-desk-stands';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 19900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('acrylic-desk-stands', 'Acrylic Desk Stands', 'PRN-' || upper(substring('acrylic-desk-stands' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 19900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 14000, 1, 19900, 'https://printo.in/categories/acrylic-desk-stands/customizable-products/acrylic-desk-stands', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'radiate-tumbler-1200ml-all-colours';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 94900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('radiate-tumbler-1200ml-all-colours', 'Radiate Tumbler 1200ml (all colours)', 'PRN-' || upper(substring('radiate-tumbler-1200ml-all-colours' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 94900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 94900, 1, 94900, 'https://printo.in/categories/drinkwares/customizable-products/radiate-tumbler-1200ml-white', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'luna-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 90000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('luna-sipper', 'Luna Sipper', 'PRN-' || upper(substring('luna-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 90000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 90000, 1, 90000, 'https://printo.in/categories/drinkwares/customizable-products/luna-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'hydro-x-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 71000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('hydro-x-sipper', 'Hydro X Sipper', 'PRN-' || upper(substring('hydro-x-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 71000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 71000, 1, 71000, 'https://printo.in/categories/drinkwares/customizable-products/hydro-x-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'nomad-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 85000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('nomad-sipper', 'Nomad Sipper', 'PRN-' || upper(substring('nomad-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 85000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 85000, 1, 85000, 'https://printo.in/categories/drinkwares/customizable-products/nomad-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'drift-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 85000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('drift-sipper', 'Drift Sipper', 'PRN-' || upper(substring('drift-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 85000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 85000, 1, 85000, 'https://printo.in/categories/drinkwares/customizable-products/drift-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'dash-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 32900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('dash-sipper', 'Dash Sipper', 'PRN-' || upper(substring('dash-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 32900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 32900, 1, 32900, 'https://printo.in/categories/drinkwares/customizable-products/dash-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'hexa-bottle';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 94300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('hexa-bottle', 'Hexa Bottle', 'PRN-' || upper(substring('hexa-bottle' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 94300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 94300, 1, 94300, 'https://printo.in/categories/drinkwares/customizable-products/hexa-bottle-white', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'frosty-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 69000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('frosty-sipper', 'Frosty Sipper', 'PRN-' || upper(substring('frosty-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 69000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 69000, 1, 69000, 'https://printo.in/categories/drinkwares/customizable-products/frosty-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'commuter-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 54300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('commuter-sipper', 'Commuter Sipper', 'PRN-' || upper(substring('commuter-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 54300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 54300, 1, 54300, 'https://printo.in/categories/drinkwares/customizable-products/commuter-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'zenwood-ceramic-mug';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 79000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('zenwood-ceramic-mug', 'Zenwood Ceramic Mug', 'PRN-' || upper(substring('zenwood-ceramic-mug' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 79000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 79000, 1, 79000, 'https://printo.in/categories/drinkwares/customizable-products/zenwood-ceramic-mug', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'freo-sipper-insulated-bottle';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 90000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('freo-sipper-insulated-bottle', 'Freo Sipper / Insulated Bottle', 'PRN-' || upper(substring('freo-sipper-insulated-bottle' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 90000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 90000, 1, 90000, 'https://printo.in/categories/drinkwares/customizable-products/freo-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'glass-bottle-with-jute-sleeve';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 50900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('glass-bottle-with-jute-sleeve', 'Glass Bottle with Jute Sleeve', 'PRN-' || upper(substring('glass-bottle-with-jute-sleeve' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 50900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 50900, 1, 50900, 'https://printo.in/categories/drinkwares/customizable-products/glass-bottle-with-jute-sleeve', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'sleek-flow-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 108300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('sleek-flow-sipper', 'Sleek Flow Sipper', 'PRN-' || upper(substring('sleek-flow-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 108300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 108300, 1, 108300, 'https://printo.in/categories/drinkwares/customizable-products/Sleek-flow-sipper', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'debonair-spill-free-mug';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 60000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('debonair-spill-free-mug', 'Debonair Spill Free Mug', 'PRN-' || upper(substring('debonair-spill-free-mug' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 60000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 60000, 1, 60000, 'https://printo.in/categories/drinkwares/customizable-products/debonair-spill-free-mug-red', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'prime-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 34500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('prime-sipper', 'Prime Sipper', 'PRN-' || upper(substring('prime-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 34500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 34500, 1, 34500, 'https://printo.in/categories/drinkwares/customizable-products/sipper-prime', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'glaze-spill-free-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 170900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('glaze-spill-free-sipper', 'Glaze Spill Free Sipper', 'PRN-' || upper(substring('glaze-spill-free-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 170900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 170900, 1, 170900, 'https://printo.in/categories/drinkwares/customizable-products/spill-free-sipper-black', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'elite-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 59200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('elite-sipper', 'Elite Sipper', 'PRN-' || upper(substring('elite-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 59200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 59200, 1, 59200, 'https://printo.in/categories/drinkwares/customizable-products/sipper-elite', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'lanky-hot-cold-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 120200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('lanky-hot-cold-sipper', 'Lanky Hot & Cold Sipper', 'PRN-' || upper(substring('lanky-hot-cold-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 120200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 120200, 1, 120200, 'https://printo.in/categories/drinkwares/customizable-products/lanky-hot-and-cold-sipper-white', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'switch-flask';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 280400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('switch-flask', 'Switch Flask', 'PRN-' || upper(substring('switch-flask' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 280400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 280400, 1, 280400, 'https://printo.in/categories/drinkwares/customizable-products/switch-black', 'Premium flask');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'puregrip-borosilicate-bottle';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 39900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('puregrip-borosilicate-bottle', 'PureGrip Borosilicate Bottle', 'PRN-' || upper(substring('puregrip-borosilicate-bottle' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 39900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 39900, 1, 39900, 'https://printo.in/categories/drinkwares/customizable-products/puregrip-borosilicate-bottle-black', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'vega-ss-bottle';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 52900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('vega-ss-bottle', 'Vega SS Bottle', 'PRN-' || upper(substring('vega-ss-bottle' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 52900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 52900, 1, 52900, 'https://printo.in/categories/drinkwares/customizable-products/vega-ss-bottle-black', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'sublime-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 45300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('sublime-sipper', 'Sublime Sipper', 'PRN-' || upper(substring('sublime-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 45300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 45300, 1, 45300, 'https://printo.in/categories/drinkwares/customizable-products/sipper-sublime', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'curvy-sipper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 155600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('curvy-sipper', 'Curvy Sipper', 'PRN-' || upper(substring('curvy-sipper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 155600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 155600, 1, 155600, 'https://printo.in/categories/drinkwares/customizable-products/curvy-sipper-black', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'multicolour-printed-steel-bottle-1000ml';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 73500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('multicolour-printed-steel-bottle-1000ml', 'Multicolour Printed Steel Bottle (1000ml)', 'PRN-' || upper(substring('multicolour-printed-steel-bottle-1000ml' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 73500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 73500, 1, 73500, 'https://printo.in/categories/sippers-and-bottles/customizable-products/personalized-steel-bottle-multicolour-printed', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'trek-flask';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 119700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('trek-flask', 'Trek Flask', 'PRN-' || upper(substring('trek-flask' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 119700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 119700, 1, 119700, 'https://printo.in/categories/drinkwares/customizable-products/trek-black', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'dazzle-dark-grey-mug';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 144500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('dazzle-dark-grey-mug', 'Dazzle Dark Grey Mug', 'PRN-' || upper(substring('dazzle-dark-grey-mug' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 144500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 144500, 10, 144500, 'https://printo.in/categories/drinkwares/customizable-products/dazzle-dark-grey-mug', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'drinkware-bottles-sippers-mugs';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('drinkware-bottles-sippers-mugs', 'Drinkware (Bottles, Sippers, Mugs)', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'the-let-s-go-kit-gift-hamper';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 484200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('the-let-s-go-kit-gift-hamper', 'The Let''s Go Kit (Gift Hamper)', 'PRN-' || upper(substring('the-let-s-go-kit-gift-hamper' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 484200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Printo' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Printo') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Printo', 484200, 5, 484200, 'https://printo.in/categories/gift-hampers/customizable-products/the-lets-go-kit', 'Corporate gift hamper');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('visiting-cards', 'Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'standard-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('standard-visiting-cards', 'Standard Visiting Cards', 'PRN-' || upper(substring('standard-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 20000, 100, 200, 'https://www.vistaprint.in/business-cards/standard', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('visiting-cards', 'Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'classic-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 230 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('classic-visiting-cards', 'Classic Visiting Cards', 'PRN-' || upper(substring('classic-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 230)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 23000, 100, 230, 'https://www.vistaprint.in/business-cards/classic', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('visiting-cards', 'Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'rounded-corner-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 250 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('rounded-corner-visiting-cards', 'Rounded Corner Visiting Cards', 'PRN-' || upper(substring('rounded-corner-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 250)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 25000, 100, 250, 'https://www.vistaprint.in/business-cards/rounded-corner-visiting-cards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'visiting-cards';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('visiting-cards', 'Visiting Cards', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'spot-uv-visiting-cards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 580 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('spot-uv-visiting-cards', 'Spot UV Visiting Cards', 'PRN-' || upper(substring('spot-uv-visiting-cards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 580)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 58000, 100, 580, 'https://www.vistaprint.in/business-cards/spot-uv', 'Premium finish');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'letterheads';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2300 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('letterheads', 'Letterheads', 'PRN-' || upper(substring('letterheads' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2300)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 23000, 10, 2300, 'https://www.vistaprint.in/stationery/letterheads', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'self-inking-stamps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 32000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('self-inking-stamps', 'Self Inking Stamps', 'PRN-' || upper(substring('self-inking-stamps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 32000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 32000, 1, 32000, 'https://www.vistaprint.in/stationery/stamps/self-inking-stamps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'basic-rubber-stamps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 18000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('basic-rubber-stamps', 'Basic Rubber Stamps', 'PRN-' || upper(substring('basic-rubber-stamps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 18000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 18000, 1, 18000, 'https://www.vistaprint.in/stationery/stamps/basic-rubber-stamps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'personalised-notebooks';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 31000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('personalised-notebooks', 'Personalised Notebooks', 'PRN-' || upper(substring('personalised-notebooks' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 31000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 31000, 1, 31000, 'https://www.vistaprint.in/stationery/notebooks/personalised-notebooks', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'writing-pads';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 17500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('writing-pads', 'Writing Pads', 'PRN-' || upper(substring('writing-pads' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 17500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 87500, 5, 17500, 'https://www.vistaprint.in/stationery/writing-pads', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'diary-with-pen-holder';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 46500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('diary-with-pen-holder', 'Diary with Pen Holder', 'PRN-' || upper(substring('diary-with-pen-holder' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 46500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 46500, 1, 46500, 'https://www.vistaprint.in/stationery/diary-with-pen-holder', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'stationery-stamps';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('stationery-stamps', 'Stationery & Stamps', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'lanyards';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 7400 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('lanyards', 'Lanyards', 'PRN-' || upper(substring('lanyards' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 7400)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 74000, 10, 7400, 'https://www.vistaprint.in/stationery/office/lanyards', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'photo-albums';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 71500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('photo-albums', 'Photo Albums', 'PRN-' || upper(substring('photo-albums' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 71500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 71500, 1, 71500, 'https://www.vistaprint.in/photo-gifts/photo-albums', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'personalised-mugs';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 29000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('personalised-mugs', 'Personalised Mugs', 'PRN-' || upper(substring('personalised-mugs' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 29000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 29000, 1, 29000, 'https://www.vistaprint.in/photo-gifts/mugs/personalised-mugs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'canvas-prints';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 79000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('canvas-prints', 'Canvas Prints', 'PRN-' || upper(substring('canvas-prints' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 79000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 79000, 1, 79000, 'https://www.vistaprint.in/photo-gifts/canvas-prints', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'photo-with-frame';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 31000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('photo-with-frame', 'Photo With Frame', 'PRN-' || upper(substring('photo-with-frame' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 31000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 31000, 1, 31000, 'https://www.vistaprint.in/photo-gifts/photo-with-frame', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-mouse-pads';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 32000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-mouse-pads', 'Custom Mouse Pads', 'PRN-' || upper(substring('custom-mouse-pads' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 32000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 32000, 1, 32000, 'https://www.vistaprint.in/photo-gifts/custom-mouse-pads', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'customised-tumblers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 97500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('customised-tumblers', 'Customised Tumblers', 'PRN-' || upper(substring('customised-tumblers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 97500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 97500, 1, 97500, 'https://www.vistaprint.in/photo-gifts/drinkware/customised-tumblers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'photo-gifts-mugs-albums';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('photo-gifts-mugs-albums', 'Photo Gifts, Mugs & Albums', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-water-bottles';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 49000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-water-bottles', 'Custom Water Bottles', 'PRN-' || upper(substring('custom-water-bottles' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 49000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 49000, 1, 49000, 'https://www.vistaprint.in/photo-gifts/drinkware/custom-water-bottles', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'men-s-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 45000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('men-s-t-shirts', 'Men''s T-Shirts', 'PRN-' || upper(substring('men-s-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 45000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 45000, 1, 45000, 'https://www.vistaprint.in/clothing-bags/t-shirts/mens-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'polyester-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 37000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('polyester-t-shirts', 'Polyester T-shirts', 'PRN-' || upper(substring('polyester-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 37000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 37000, 1, 37000, 'https://www.vistaprint.in/clothing-bags/t-shirts/polyester-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'men-s-polo-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 59000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('men-s-polo-t-shirts', 'Men''s Polo T-Shirts', 'PRN-' || upper(substring('men-s-polo-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 59000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 59000, 1, 59000, 'https://www.vistaprint.in/clothing-bags/polos/mens-polo-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'women-s-polo-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 59000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('women-s-polo-t-shirts', 'Women''s Polo T-shirts', 'PRN-' || upper(substring('women-s-polo-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 59000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 59000, 1, 59000, 'https://www.vistaprint.in/clothing-bags/polos/womens-polo-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-polo-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 80000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-polo-t-shirts', 'Premium Polo T-Shirts', 'PRN-' || upper(substring('premium-polo-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 80000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 80000, 1, 80000, 'https://www.vistaprint.in/clothing-bags/polos/premium-polo-t-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'printed-polos-multi-location';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 59000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('printed-polos-multi-location', 'Printed Polos - Multi Location', 'PRN-' || upper(substring('printed-polos-multi-location' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 59000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 59000, 1, 59000, 'https://www.vistaprint.in/clothing-bags/polos/printed-polos-multi-location', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'men-s-scott-polo-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 103000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('men-s-scott-polo-t-shirts', 'Men''s Scott Polo T-Shirts', 'PRN-' || upper(substring('men-s-scott-polo-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 103000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 103000, 1, 103000, 'https://www.vistaprint.in/clothing-bags/polos/mens-scott-polo-t-shirts', 'Branded');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'puma-polo-t-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 174000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('puma-polo-t-shirts', 'Puma® Polo T-shirts', 'PRN-' || upper(substring('puma-polo-t-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 174000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 174000, 1, 174000, 'https://www.vistaprint.in/clothing-bags/puma-polo-t-shirts', 'Branded');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'men-s-embroidered-dress-shirts';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 99000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('men-s-embroidered-dress-shirts', 'Men''s Embroidered Dress Shirts', 'PRN-' || upper(substring('men-s-embroidered-dress-shirts' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 99000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 99000, 1, 99000, 'https://www.vistaprint.in/clothing-bags/office-shirts/mens-dress-shirts', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'hoodies';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 103000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('hoodies', 'Hoodies', 'PRN-' || upper(substring('hoodies' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 103000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 103000, 1, 103000, 'https://www.vistaprint.in/clothing-bags/sweatshirts/hoodies', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'fleece-jackets';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 122000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('fleece-jackets', 'Fleece Jackets', 'PRN-' || upper(substring('fleece-jackets' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 122000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 122000, 1, 122000, 'https://www.vistaprint.in/clothing-bags/jackets/fleece-jacket', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'high-neck-jacket';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 112500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('high-neck-jacket', 'High Neck Jacket', 'PRN-' || upper(substring('high-neck-jacket' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 112500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 112500, 1, 112500, 'https://www.vistaprint.in/clothing-bags/jackets/high-neck-jacket', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'winter-jacket-sleeveless';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 112500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('winter-jacket-sleeveless', 'Winter Jacket - Sleeveless', 'PRN-' || upper(substring('winter-jacket-sleeveless' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 112500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 112500, 1, 112500, 'https://www.vistaprint.in/clothing-bags/jackets/winter-jacket-sleeveless', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'embroidered-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 31000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('embroidered-caps', 'Embroidered Caps', 'PRN-' || upper(substring('embroidered-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 31000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 31000, 1, 31000, 'https://www.vistaprint.in/clothing-bags/caps/embroidered-caps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'freedom-rain-caps';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 27500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('freedom-rain-caps', 'Freedom Rain Caps', 'PRN-' || upper(substring('freedom-rain-caps' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 27500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 27500, 1, 27500, 'https://www.vistaprint.in/clothing-bags/caps/freedom-rain-caps', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'tote-bags-cotton';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 34500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('tote-bags-cotton', 'Tote Bags (Cotton)', 'PRN-' || upper(substring('tote-bags-cotton' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 34500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 34500, 1, 34500, 'https://www.vistaprint.in/clothing-bags/bags/cotton-tote-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'premium-jute-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 38000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('premium-jute-bags', 'Premium Jute Bags', 'PRN-' || upper(substring('premium-jute-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 38000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 38000, 1, 38000, 'https://www.vistaprint.in/clothing-bags/bags/premium-jute-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'embroidered-laptop-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 105000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('embroidered-laptop-bags', 'Embroidered Laptop Bags', 'PRN-' || upper(substring('embroidered-laptop-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 105000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 105000, 1, 105000, 'https://www.vistaprint.in/clothing-bags/bags/embroidered-laptop-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'harissons-nemesis-office-laptop-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 137000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('harissons-nemesis-office-laptop-bags', 'Harissons® Nemesis Office Laptop Bags', 'PRN-' || upper(substring('harissons-nemesis-office-laptop-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 137000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 137000, 1, 137000, 'https://www.vistaprint.in/clothing-bags/bags/harissons-nemesis-office-laptop-bags', 'Branded');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'golf-umbrellas';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 112500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('golf-umbrellas', 'Golf Umbrellas', 'PRN-' || upper(substring('golf-umbrellas' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 112500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 112500, 1, 112500, 'https://www.vistaprint.in/clothing-bags/umbrellas/golf-umbrellas', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'apparel-caps-bags';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('apparel-caps-bags', 'Apparel, Caps & Bags', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'bulk-two-fold-umbrellas';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 27500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('bulk-two-fold-umbrellas', 'Bulk Two-Fold Umbrellas', 'PRN-' || upper(substring('bulk-two-fold-umbrellas' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 27500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 687500, 25, 27500, 'https://www.vistaprint.in/clothing-bags/umbrellas/bulk-two-fold-umbrellas', 'Bulk');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'stickers-general';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('stickers-general', 'Stickers (general)', 'PRN-' || upper(substring('stickers-general' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 15000, 10, 1500, 'https://www.vistaprint.in/marketing-materials/labels-stickers/custom-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'sheet-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 667 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('sheet-stickers', 'Sheet Stickers', 'PRN-' || upper(substring('sheet-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 667)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 16000, 24, 667, 'https://www.vistaprint.in/marketing-materials/labels-stickers/sheet-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'product-packaging-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 667 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('product-packaging-labels', 'Product & Packaging Labels', 'PRN-' || upper(substring('product-packaging-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 667)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 16000, 24, 667, 'https://www.vistaprint.in/marketing-materials/labels-stickers/product-and-packaging-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-shape-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1900 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-shape-stickers', 'Custom Shape Stickers', 'PRN-' || upper(substring('custom-shape-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1900)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 19000, 10, 1900, 'https://www.vistaprint.in/marketing-materials/labels-stickers/custom-shape-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'sticker-singles';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 490 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('sticker-singles', 'Sticker Singles', 'PRN-' || upper(substring('sticker-singles' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 490)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 24500, 50, 490, 'https://www.vistaprint.in/marketing-materials/labels-stickers/sticker-singles', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'uv-ink-transfer-stickers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 4167 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('uv-ink-transfer-stickers', 'UV Ink Transfer Stickers', 'PRN-' || upper(substring('uv-ink-transfer-stickers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 4167)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 50000, 12, 4167, 'https://www.vistaprint.in/marketing-materials/labels-stickers/uv-ink-transfer-stickers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'transparent-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('transparent-labels', 'Transparent Labels', 'PRN-' || upper(substring('transparent-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 40000, 40, 1000, 'https://www.vistaprint.in/marketing-materials/labels-stickers/transparent-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'return-address-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 243 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('return-address-labels', 'Return Address Labels', 'PRN-' || upper(substring('return-address-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 243)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 34000, 140, 243, 'https://www.vistaprint.in/stationery/return-address-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-iron-on-labels';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 9000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-iron-on-labels', 'Custom Iron-on Labels', 'PRN-' || upper(substring('custom-iron-on-labels' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 9000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 36000, 4, 9000, 'https://www.vistaprint.in/marketing-materials/labels-stickers/custom-iron-on-labels', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'self-adhesive-tapes';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 110000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('self-adhesive-tapes', 'Self Adhesive Tapes', 'PRN-' || upper(substring('self-adhesive-tapes' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 110000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 660000, 6, 110000, 'https://www.vistaprint.in/packaging-materials/self-adhesive-tapes', 'Bulk/carton tape');
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-paper-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 4800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-paper-bags', 'Custom Paper Bags', 'PRN-' || upper(substring('custom-paper-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 4800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 48000, 10, 4800, 'https://www.vistaprint.in/marketing-materials/paper-bags/custom-paper-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-premium-gift-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 8800 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-premium-gift-bags', 'Custom (Premium) Gift Bags', 'PRN-' || upper(substring('custom-premium-gift-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 8800)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 88000, 10, 8800, 'https://www.vistaprint.in/packaging-materials/premium-gift-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'printed-carry-bags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 3000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('printed-carry-bags', 'Printed Carry Bags', 'PRN-' || upper(substring('printed-carry-bags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 3000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 300000, 100, 3000, 'https://www.vistaprint.in/packaging-materials/printed-carry-bags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'tuck-top-boxes';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 2500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('tuck-top-boxes', 'Tuck Top Boxes', 'PRN-' || upper(substring('tuck-top-boxes' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 2500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 25000, 10, 2500, 'https://www.vistaprint.in/packaging-materials/tuck-top-boxes', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'labels-stickers-packaging';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('labels-stickers-packaging', 'Labels, Stickers & Packaging', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'hang-tags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 700 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('hang-tags', 'Hang Tags', 'PRN-' || upper(substring('hang-tags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 700)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 17500, 25, 700, 'https://www.vistaprint.in/marketing-materials/hang-tags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'flyers';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('flyers', 'Flyers', 'PRN-' || upper(substring('flyers' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 15000, 25, 600, 'https://www.vistaprint.in/marketing-materials/flyers', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'brochures';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 1720 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('brochures', 'Brochures', 'PRN-' || upper(substring('brochures' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 1720)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 43000, 25, 1720, 'https://www.vistaprint.in/marketing-materials/brochures', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'booklets';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 18000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('booklets', 'Booklets', 'PRN-' || upper(substring('booklets' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 18000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 18000, 1, 18000, 'https://www.vistaprint.in/stationery/booklets', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'posters';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 46500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('posters', 'Posters', 'PRN-' || upper(substring('posters' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 46500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 46500, 1, 46500, 'https://www.vistaprint.in/signs-posters/posters', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'banners';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 24500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('banners', 'Banners', 'PRN-' || upper(substring('banners' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 24500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 24500, 1, 24500, 'https://www.vistaprint.in/signs-posters/banners', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'standees';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 175000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('standees', 'Standees', 'PRN-' || upper(substring('standees' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 175000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 175000, 1, 175000, 'https://www.vistaprint.in/signs-posters/standees', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'presentation-folders';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 5600 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('presentation-folders', 'Presentation Folders', 'PRN-' || upper(substring('presentation-folders' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 5600)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 56000, 10, 5600, 'https://www.vistaprint.in/marketing-materials/presentation-folders', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'tension-fabric-displays';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 390000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('tension-fabric-displays', 'Tension Fabric Displays', 'PRN-' || upper(substring('tension-fabric-displays' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 390000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 390000, 1, 390000, 'https://www.vistaprint.in/signs-posters/tension-fabric-displays', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'led-translite-sign-board';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 150000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('led-translite-sign-board', 'LED Translite Sign Board', 'PRN-' || upper(substring('led-translite-sign-board' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 150000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 150000, 1, 150000, 'https://www.vistaprint.in/signs-posters/signs/translite-board', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'led-lollipop-display-board';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 260000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('led-lollipop-display-board', 'LED Lollipop Display Board', 'PRN-' || upper(substring('led-lollipop-display-board' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 260000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 260000, 1, 260000, 'https://www.vistaprint.in/signs-posters/signs/lollipop-board', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'customised-qr-code-stand';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 22000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('customised-qr-code-stand', 'Customised QR Code Stand', 'PRN-' || upper(substring('customised-qr-code-stand' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 22000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 22000, 1, 22000, 'https://www.vistaprint.in/signs-posters/customised-qr-code-stand', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'acrylic-signs';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 65000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('acrylic-signs', 'Acrylic Signs', 'PRN-' || upper(substring('acrylic-signs' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 65000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 65000, 1, 65000, 'https://www.vistaprint.in/signs-posters/acrylic-signs', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'promotional-canopy-tents';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 575000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('promotional-canopy-tents', 'Promotional Canopy Tents', 'PRN-' || upper(substring('promotional-canopy-tents' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 575000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 575000, 1, 575000, 'https://www.vistaprint.in/signs-posters/promotional-canopy-tents', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'customised-ribbons';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 125000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('customised-ribbons', 'Customised Ribbons', 'PRN-' || upper(substring('customised-ribbons' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 125000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 125000, 1, 125000, 'https://www.vistaprint.in/stationery/customised-ribbons', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'signs-posters-marketing-materials';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('signs-posters-marketing-materials', 'Signs, Posters & Marketing Materials', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'table-flags';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 195000 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('table-flags', 'Table Flags', 'PRN-' || upper(substring('table-flags' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 195000)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 195000, 1, 195000, 'https://www.vistaprint.in/signs-posters/table-flags', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'pens';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('pens', 'Pens', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'custom-full-white-ball-pens';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 3200 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('custom-full-white-ball-pens', 'Custom Full White Ball Pens', 'PRN-' || upper(substring('custom-full-white-ball-pens' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 3200)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 160000, 50, 3200, 'https://www.vistaprint.in/pens/executive-pens/custom-full-white-ball-pens', NULL);
    END IF;
  END IF;
END $$;

DO $$
DECLARE
  v_category_id UUID;
  v_product_id UUID;
BEGIN
  -- Category
  SELECT id INTO v_category_id FROM public.categories WHERE handle = 'pens';
  IF v_category_id IS NULL THEN
    INSERT INTO public.categories (handle, title, status) VALUES ('pens', 'Pens', 'active') RETURNING id INTO v_category_id;
  END IF;

  -- Product
  SELECT id INTO v_product_id FROM public.products WHERE handle = 'green-with-silver-ball-pens';
  IF v_product_id IS NOT NULL THEN
    UPDATE public.products SET base_price_minor = 5500 WHERE id = v_product_id;
  ELSE
    INSERT INTO public.products (handle, title, sku, status, base_price_minor)
    VALUES ('green-with-silver-ball-pens', 'Green with Silver Ball Pens', 'PRN-' || upper(substring('green-with-silver-ball-pens' from 1 for 8)) || '-' || floor(random() * 10000)::text, 'active', 5500)
    RETURNING id INTO v_product_id;
    
    INSERT INTO public.product_category_links (product_id, category_id) VALUES (v_product_id, v_category_id);
  END IF;

  -- Competitor Price
  IF 'Vistaprint' IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM public.competitor_prices WHERE product_id = v_product_id AND competitor_name = 'Vistaprint') THEN
      INSERT INTO public.competitor_prices (product_id, competitor_name, listed_price_minor, quantity, normalized_unit_price_minor, source_url, notes)
      VALUES (v_product_id, 'Vistaprint', 27500, 5, 5500, 'https://www.vistaprint.in/pens/value-pens/green-with-silver-ball-pens', NULL);
    END IF;
  END IF;
END $$;
