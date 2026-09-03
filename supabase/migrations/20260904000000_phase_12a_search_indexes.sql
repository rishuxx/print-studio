-- ==============================================================================
-- PHASE 12A: SEARCH ARCHITECTURE
-- Project: print-studio-production
-- Purpose: Add Full-Text Search (tsvector), GIN indexes, and pg_trgm fallback.
-- ==============================================================================

-- 1. Enable pg_trgm for typo tolerance and partial matches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Add search_vector generated column to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(sku, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(product_type, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'D')
) STORED;

-- 3. Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON public.products USING GIN (search_vector);

-- 4. Create GIN index for pg_trgm on title (typo fallback)
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON public.products USING GIN (title gin_trgm_ops);

-- 5. RPC Function for Public Product Search
-- Returns a list of matching product IDs sorted by relevance (ts_rank)
-- Uses SECURITY INVOKER so it automatically inherits the caller's RLS policies
-- (which naturally restrict 'public' role to active and public visibility products).
CREATE OR REPLACE FUNCTION public.search_public_products(
  search_query text,
  search_limit integer DEFAULT 48,
  search_offset integer DEFAULT 0
)
RETURNS TABLE (
  product_id uuid,
  relevance real
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_tsquery tsquery;
  v_trimmed text;
BEGIN
  v_trimmed := trim(search_query);

  -- Handle empty query safety
  IF v_trimmed = '' OR v_trimmed IS NULL THEN
    RETURN QUERY
    SELECT p.id, 0::real
    FROM public.products p
    ORDER BY p.sort_order ASC, p.created_at DESC
    LIMIT search_limit OFFSET search_offset;
    RETURN;
  END IF;

  -- Create full text search query handling spaces as AND
  -- websearch_to_tsquery provides a safe Google-like query translation
  v_tsquery := websearch_to_tsquery('english', v_trimmed);

  -- If websearch_to_tsquery produces an empty query (e.g. from stop words), fallback to basic
  IF v_tsquery::text = '' THEN
    RETURN QUERY
    SELECT p.id, 0::real
    FROM public.products p
    WHERE p.title ILIKE '%' || v_trimmed || '%'
    ORDER BY p.sort_order ASC, p.created_at DESC
    LIMIT search_limit OFFSET search_offset;
    RETURN;
  END IF;

  -- First, try exact/prefix matching via full-text search
  RETURN QUERY
  SELECT 
    p.id, 
    ts_rank(p.search_vector, v_tsquery) as rank
  FROM public.products p
  WHERE p.search_vector @@ v_tsquery
  ORDER BY rank DESC, p.sort_order ASC, p.created_at DESC
  LIMIT search_limit OFFSET search_offset;

  -- NOTE: If we get 0 results, the caller (application layer) can decide
  -- to invoke a trigram query instead for typo tolerance. 
  -- We don't automatically do it here to keep the query plan simple and predictable.
END;
$$;

-- 6. RPC Function for Trigram Fallback (Typo Search)
CREATE OR REPLACE FUNCTION public.search_public_products_fuzzy(
  search_query text,
  search_limit integer DEFAULT 48,
  search_offset integer DEFAULT 0
)
RETURNS TABLE (
  product_id uuid,
  relevance real
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_trimmed text;
BEGIN
  v_trimmed := trim(search_query);

  IF v_trimmed = '' OR v_trimmed IS NULL THEN
    RETURN;
  END IF;

  -- Trigram similarity matching for typos
  RETURN QUERY
  SELECT 
    p.id, 
    similarity(p.title, v_trimmed)::real as rank
  FROM public.products p
  WHERE p.title % v_trimmed -- uses the pg_trgm similarity operator
     OR p.title ILIKE '%' || v_trimmed || '%'
  ORDER BY rank DESC, p.sort_order ASC, p.created_at DESC
  LIMIT search_limit OFFSET search_offset;
END;
$$;
