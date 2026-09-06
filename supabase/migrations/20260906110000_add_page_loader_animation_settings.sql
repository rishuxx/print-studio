-- Migration: Add Page Loader Lottie Animation Controls to Business Settings
ALTER TABLE IF EXISTS public.business_settings
ADD COLUMN IF NOT EXISTS page_loader_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS page_loader_lottie_url TEXT DEFAULT 'https://lottie.host/d81c2a5a-19a8-4153-8e46-4aee9b50cf2b/U0uqeX0LSG.lottie',
ADD COLUMN IF NOT EXISTS page_loader_size_px INTEGER NOT NULL DEFAULT 160,
ADD COLUMN IF NOT EXISTS page_loader_bg_mode TEXT NOT NULL DEFAULT 'glass',
ADD COLUMN IF NOT EXISTS page_loader_max_duration_ms INTEGER NOT NULL DEFAULT 1200,
ADD COLUMN IF NOT EXISTS page_loader_scope TEXT NOT NULL DEFAULT 'initial_session';

NOTIFY pgrst, 'reload schema';
