# Production-Level Hero Redesign & Admin Control Implementation Plan

Completely redesign the frontend UI/UX of the homepage Hero section and provide dynamic Admin Panel control for Hero Banners and Branding (Logo/Mode/Colors), replacing the static dark-purple/vibe-coded hero with an image-first, Pepperfry-grade e-commerce promotional banner carousel.

## User Review Required

> [!IMPORTANT]
> **Zero Business Logic Modification**:
> No modifications to checkout, cart, Razorpay, authentication, pricing calculators, products, or existing orders.
> All database migrations follow strict Supabase RLS and backward-compatible fallbacks so the site will work seamlessly whether or not banners are configured.

> [!NOTE]
> **Admin Control Capabilities Added**:
> 1. **Homepage -> Hero Banners**: Upload desktop (16:5 / 16:6) and mobile (4:5 / 1:1) promotional banners, toggle between "Image Only" and "Image + Overlay Content", set custom CTAs, reorder, and preview.
> 2. **Homepage / Branding -> Logo & Colors**: Toggle Image Logo vs. Text Logo, upload custom logo file or set custom typography styling, configure brand colors with automatic storefront header/footer/mobile drawer synchronization.

---

## Proposed Changes

### 1. Database & Storage Architecture

#### [NEW] [20260904050000_homepage_hero_and_branding.sql](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/supabase/migrations/20260904050000_homepage_hero_and_branding.sql)
- Creates `public.homepage_hero_banners` table:
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `title TEXT NOT NULL`
  - `subtitle TEXT`
  - `eyebrow TEXT`
  - `description TEXT`
  - `desktop_image_url TEXT NOT NULL`
  - `mobile_image_url TEXT`
  - `alt_text TEXT`
  - `content_mode TEXT NOT NULL DEFAULT 'image_overlay' CHECK (content_mode IN ('image_only', 'image_overlay'))`
  - `primary_cta_text TEXT`
  - `primary_cta_url TEXT`
  - `primary_cta_bg_color TEXT DEFAULT '#e53935'`
  - `primary_cta_text_color TEXT DEFAULT '#ffffff'`
  - `secondary_cta_text TEXT`
  - `secondary_cta_url TEXT`
  - `secondary_cta_bg_color TEXT DEFAULT '#ffffff'`
  - `secondary_cta_text_color TEXT DEFAULT '#222225'`
  - `text_color TEXT DEFAULT '#222225'`
  - `overlay_enabled BOOLEAN NOT NULL DEFAULT false`
  - `overlay_opacity INTEGER NOT NULL DEFAULT 30`
  - `display_order INTEGER NOT NULL DEFAULT 0`
  - `is_active BOOLEAN NOT NULL DEFAULT true`
  - `start_date TIMESTAMPTZ`
  - `end_date TIMESTAMPTZ`
  - `created_at`, `updated_at`
- Indexes: `idx_hero_banners_active` on `(is_active, display_order ASC)`.
- RLS: Public can SELECT active banners (`is_active = true`), Admins have full access (`public.is_admin()`).
- Add branding columns to `business_settings` (with backward compatibility):
  - `logo_mode TEXT DEFAULT 'text'` ('text' | 'image')
  - `logo_url TEXT`
  - `logo_mobile_url TEXT`
  - `logo_alt_text TEXT`
  - `primary_brand_color TEXT DEFAULT '#e53935'`
  - `secondary_brand_color TEXT DEFAULT '#fef2f2'`
  - `accent_brand_color TEXT DEFAULT '#f97316'`
- Storage Bucket: Ensures public bucket `product-media` allows uploads under `hero/` and `branding/` folders with proper RLS policies.

---

### 2. Domain Types & Server Actions

#### [NEW] [lib/hero/types.ts](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/lib/hero/types.ts)
- Types for `HeroBannerRecord`, `CreateHeroBannerInput`, `UpdateHeroBannerInput`.
- Safe defaults and fallback hero banner.

#### [NEW] [lib/hero/queries.ts](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/lib/hero/queries.ts)
- `getActiveHeroBanners()`: Server-side fetch for the storefront, with clean fallback if table is empty or banner query fails.
- `getAllHeroBannersAdmin()`: Admin-only query with all items, order, active state.

#### [NEW] [lib/hero/actions.ts](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/lib/hero/actions.ts)
- Server actions with `requirePermission("settings.view", "/admin")`:
  - `saveHeroBannerAction(input)`
  - `deleteHeroBannerAction(id)`
  - `toggleHeroBannerStatusAction(id, is_active)`
  - `reorderHeroBannersAction(orderedIds)`
  - `uploadHeroBannerImageAction(formData)` (uploads to `product-media` bucket under `hero/`)
  - `uploadBrandingLogoAction(formData)` (uploads to `product-media` bucket under `branding/`)

---

### 3. Storefront Hero Banner Redesign

#### [MODIFY] [components/home/home-hero.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/home/home-hero.tsx)
- Replaces the static dark-purple/vibe-coded hero with an image-first, Pepperfry-style production promotional banner carousel.
- Image-first responsive rendering:
  - Supports `<picture>` with separate mobile (`<source media="(max-width: 640px)">`) and desktop image sources.
  - Fallback to desktop image if mobile image is not provided.
  - Aspect ratio: 16:5 / 16:6 on desktop (with subtle rounded corners `rounded-2xl` and soft shadow), 4:5 or 1:1 on mobile.
- Content Modes:
  - `image_only`: The promotional banner graphic speaks for itself, clickable entirely to primary CTA destination or with minimal floating action.
  - `image_overlay`: Clean Pepperfry-style left-aligned text overlay with small marketing label, headline, description, primary CTA button, and secondary CTA button.
- Smooth Carousel Controls:
  - Subtle slide transition (reduced motion supported).
  - Next/Previous navigation buttons with subtle hover states.
  - Dot indicators for pagination.
  - Touch/swipe support on mobile and pause on hover.
  - No flashy bouncing or vibe-coded glows.

---

### 4. Admin Panel Controls

#### [NEW] [app/admin/hero/page.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/app/admin/hero/page.tsx)
- Admin section under `ADMIN_NAVIGATION`: "Hero Banners"
- Lists all hero banners with desktop/mobile thumbnails, status badges, display order, date ranges, and actions (Edit, Duplicate, Preview, Delete with confirmation dialog).
- Drag-and-drop / File upload with progress and validation.
- Responsive live preview (Desktop & Mobile switchable tabs).

#### [NEW] [components/admin/hero/hero-banner-manager.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/admin/hero/hero-banner-manager.tsx)
- Interactive banner creation/editing modal or inline editor.
- Desktop & mobile image upload zones.
- Switch for Content Mode: "Image Only" vs "Image + Content Overlay".
- Input fields for Title, Subtitle, Eyebrow, CTAs (labels + links + colors).
- Instant preview pane before publishing.

#### [NEW] [app/admin/branding/page.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/app/admin/branding/page.tsx)
- Dedicated Branding & Logo Admin console:
  - Logo mode: Image Logo vs. Text Logo.
  - Image Logo uploader with live preview, delete, replace, and alt text.
  - Text Logo customization: Brand name, typography style.
  - Brand color presets and custom color hex pickers (primary, secondary, accent).

#### [MODIFY] [lib/admin/navigation.ts](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/lib/admin/navigation.ts)
- Adds "Hero Banners" and "Branding & Logo" to the Admin sidebar navigation under "Content & Branding".

---

### 5. Header, Mobile Header & Footer Logo Dynamic Sync

#### [NEW] [components/shared/site-logo.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/shared/site-logo.tsx)
- Reusable logo component that reads `logo_mode` and `logo_url` from `useStoreSettings()`.
- If `logo_mode === "image"` and `logo_url` is valid: renders the uploaded logo image with configured `alt_text`.
- If `logo_mode === "text"` or `logo_url` is missing: gracefully falls back to the clean styled text logo with subtle CMYK mark.

#### [MODIFY] [components/layout/site-header.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/layout/site-header.tsx)
- Uses `<SiteLogo />` instead of hardcoded text.

#### [MODIFY] [components/mobile/MobileHeader.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/mobile/MobileHeader.tsx)
- Uses `<SiteLogo />` for mobile header.

#### [MODIFY] [components/layout/site-footer.tsx](file:///c:/Users/5upvi/OneDrive/Desktop/claudeProject/printo-web/components/layout/site-footer.tsx)
- Uses `<SiteLogo />` for footer brand presentation.

---

## Verification Plan

### Automated Build Verification
```bash
npm run build
```
- Ensure zero TypeScript compiler errors and zero Turbopack build errors.

### Manual Verification
1. **Homepage Hero Section**:
   - Check desktop layout at 1440px and 1920px: clean promotional banner aspect ratio, proper max-width and breathing room.
   - Check mobile layout at 375px/390px/430px: verify mobile banner image loads, no horizontal scroll, swipe gestures work, CTAs are easily tappable.
   - Test carousel navigation (dots, arrows, keyboard left/right).
2. **Admin Hero Banner Management**:
   - Access `/admin/hero`.
   - Test creating a banner with both desktop and mobile images.
   - Test toggling between "Image Only" and "Image + Content Overlay".
   - Test changing CTA labels and links.
   - Test reordering banners and toggling active/inactive status.
   - Verify changes reflect on the homepage.
3. **Admin Branding & Logo Management**:
   - Access `/admin/branding`.
   - Test uploading a custom logo image and switching between "Image Logo" and "Text Logo".
   - Verify header, mobile header, and footer update dynamically.
4. **Regression Safety Check**:
   - Verify product catalog, cart, customer checkout, orders, and authentication are 100% unaffected.
