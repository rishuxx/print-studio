-- ==============================================================================
-- PHASE 8.9: SUPABASE STORAGE BUCKET & RLS POLICIES FOR CUSTOMER ARTWORK
-- Project: print-studio-production (vsbexmohwbhlyfinobnv)
-- Purpose: Dedicated private 'artwork' bucket, owner access, and admin access
-- ==============================================================================

-- 1. Create Private Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artwork',
  'artwork',
  false,
  26214400, -- 25 MB in bytes
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/tiff'
  ];

-- 2. Storage Policies for 'artwork' Bucket

-- A. Allow authenticated users and guests to upload into their own prefix path
DROP POLICY IF EXISTS "Allow user upload own artwork" ON storage.objects;
CREATE POLICY "Allow user upload own artwork"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (
  bucket_id = 'artwork'
  AND (
    -- Authenticated user uploading into their own prefix u_<userId>/...
    (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = 'u_' || auth.uid()::text)
    -- Or guest user uploading into guest/... prefix
    OR (auth.uid() IS NULL AND (storage.foldername(name))[1] = 'guest')
  )
);

-- B. Allow authenticated users to view/download their own uploaded artwork
DROP POLICY IF EXISTS "Allow user view own artwork" ON storage.objects;
CREATE POLICY "Allow user view own artwork"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'artwork'
  AND (
    (storage.foldername(name))[1] = 'u_' || auth.uid()::text
    OR public.is_admin()
  )
);

-- C. Allow admins full access to manage artwork objects
DROP POLICY IF EXISTS "Allow admin manage all artwork" ON storage.objects;
CREATE POLICY "Allow admin manage all artwork"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'artwork' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'artwork' AND public.is_admin()
);
