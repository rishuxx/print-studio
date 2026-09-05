-- ==============================================================================
-- ADD FAVICON_URL TO BUSINESS_SETTINGS IF NOT EXISTS
-- ==============================================================================

ALTER TABLE IF EXISTS public.business_settings
ADD COLUMN IF NOT EXISTS favicon_url TEXT;

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';
