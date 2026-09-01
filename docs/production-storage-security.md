# Production Storage Architecture & Security Matrix

**System:** Print Studio E-Commerce & Production Operating System  
**Storage Provider:** Supabase Storage (S3-compatible Object Store)  
**Document Version:** 1.0 (Phase 11B)  

---

## 1. Storage Buckets Overview

| Bucket Name | Access Mode | Max File Size | Allowed MIME Types | Intended Contents |
| :--- | :--- | :--- | :--- | :--- |
| **`product-media`** | **PUBLIC** | 10 MB | `image/webp`, `image/png`, `image/jpeg`, `image/svg+xml` | Official catalog mockups, product gallery photos, category thumbnails |
| **`artwork`** | **PRIVATE** | 25 MB | `application/pdf`, `image/png`, `image/jpeg`, `image/webp`, `image/tiff` | Customer uploaded print designs, pre-press vector files, digital proofs |

---

## 2. Customer Artwork Security Rules

1. **Private Storage:** The `artwork` bucket has public access strictly disabled. Objects cannot be enumerated or downloaded via public URL without an authenticated signed token.
2. **Deterministic Ownership Paths:**
   - Files are stored using ownership-aware path partitioning:  
     `u_{userId}/{sessionId}/{uniqueUUID}.{ext}`
   - Path traversal sequences (`..`, `/`, `\`) are sanitized and stripped by `validateArtworkFile()` in `lib/storage/artwork.ts`.
3. **Signed Download URLs:**
   - Pre-press staff and customers access artwork files via time-limited Supabase Signed URLs (e.g. 15–60 minutes expiration).
4. **File Validation at Ingestion:**
   - Size limit: 25 MB maximum.
   - Extension & MIME type validation: Executable files (`.exe`, `.sh`, `.bat`, `.js`, `.php`, `.py`) are rejected.

---

## 3. Product Media Storage Rules

1. **Public Read-Only Delivery:**
   - WebP / PNG / JPG images are cached at edge CDN for optimal storefront performance.
2. **Admin-Only Mutation:**
   - File uploads, replacements, and deletions require `products.manage` permission via `uploadProductMediaAction()` and `deleteProductMediaAction()`.
3. **Orphan Prevention:**
   - If database insertion fails during image upload, the newly uploaded storage object is automatically cleaned up.
   - Deleting a product media record automatically deletes the associated storage key from `product-media`.
