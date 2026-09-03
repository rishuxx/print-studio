-- ==============================================================================
-- Migration: 20260904010000_phase_12c_performance.sql
-- Description: Denormalize category handles onto products table to avoid 
-- sequential massive IN() clause filtering performance bottlenecks.
-- ==============================================================================

-- 1. Add array column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category_handles text[] DEFAULT '{}'::text[];

-- 2. Create GIN index for blazing fast array containment queries (@>)
CREATE INDEX IF NOT EXISTS idx_products_category_handles 
ON public.products USING GIN (category_handles);

-- 3. Create function to recalculate category handles for a given product
CREATE OR REPLACE FUNCTION public.sync_product_category_handles(prod_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products p
  SET category_handles = COALESCE(
    (
      SELECT array_agg(c.handle)
      FROM public.product_category_links pcl
      JOIN public.categories c ON c.id = pcl.category_id
      WHERE pcl.product_id = prod_id
    ), 
    '{}'::text[]
  )
  WHERE p.id = prod_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger function for product_category_links
CREATE OR REPLACE FUNCTION public.trigger_sync_category_handles()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.sync_product_category_handles(NEW.product_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.sync_product_category_handles(OLD.product_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach triggers to product_category_links
DROP TRIGGER IF EXISTS sync_category_handles_on_link_change ON public.product_category_links;
CREATE TRIGGER sync_category_handles_on_link_change
AFTER INSERT OR UPDATE OR DELETE ON public.product_category_links
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sync_category_handles();

-- 6. Attach trigger to categories table (in case a category handle is renamed)
CREATE OR REPLACE FUNCTION public.trigger_sync_category_handles_on_category_change()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.handle IS DISTINCT FROM OLD.handle THEN
    -- Update all products linked to this category
    UPDATE public.products p
    SET category_handles = COALESCE(
      (
        SELECT array_agg(c.handle)
        FROM public.product_category_links pcl
        JOIN public.categories c ON c.id = pcl.category_id
        WHERE pcl.product_id = p.id
      ), 
      '{}'::text[]
    )
    WHERE EXISTS (
      SELECT 1 FROM public.product_category_links pcl WHERE pcl.product_id = p.id AND pcl.category_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_category_handles_on_category_rename ON public.categories;
CREATE TRIGGER sync_category_handles_on_category_rename
AFTER UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sync_category_handles_on_category_change();

-- 7. Backfill existing products
DO $$
DECLARE
  prod RECORD;
BEGIN
  FOR prod IN SELECT id FROM public.products
  LOOP
    PERFORM public.sync_product_category_handles(prod.id);
  END LOOP;
END;
$$;
