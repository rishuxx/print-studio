# VERCEL & SUPABASE PRODUCTION LAUNCH RUNBOOK
**Platform**: PreetyPrints / Print Studio  
**Target Environment**: Vercel (Next.js 16 App Router) + Supabase (PostgreSQL 15+, Auth, Storage)  

---

## 1. SUPABASE PRODUCTION SETUP

### A. Apply Migrations to Your Supabase Production Project
You can apply all migrations using either the Supabase CLI or by running SQL files in your Supabase Dashboard **SQL Editor**:

1. **Option 1: Supabase CLI (Recommended)**
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

2. **Option 2: Supabase Dashboard SQL Editor**
   Ensure the following key migrations are executed in sequence:
   - `supabase/migrations/20260904000000_phase_12a_search_indexes.sql`
   - `supabase/migrations/20260904010000_phase_12c_performance.sql`
   - `supabase/migrations/20260904020000_phase_12f_artwork_workflow.sql`
   - `supabase/migrations/20260904030000_phase_12g_production_jobs.sql`
   - `supabase/migrations/20260904040000_phase_12i_resolutions.sql`

### B. Storage Buckets Configuration
Ensure the private storage bucket exists in Supabase Dashboard -> **Storage**:
- **Bucket Name**: `artwork`
- **Public**: **OFF** (Private bucket)
- **Allowed MIME types**: `image/png`, `image/jpeg`, `application/pdf`, `image/tiff`
- **Max file size**: `50MB`

### C. Authentication & Redirect URLs
In Supabase Dashboard -> **Authentication** -> **URL Configuration**:
- **Site URL**: `https://your-production-domain.vercel.app` (or your custom domain `https://preetyprints.com`)
- **Redirect URLs**:
  - `https://your-production-domain.vercel.app/**`
  - `https://your-production-domain.vercel.app/auth/callback`

---

## 2. VERCEL ENVIRONMENT VARIABLES CONFIGURATION

Add the following environment variables in **Vercel Dashboard -> Project Settings -> Environment Variables** (Apply to **Production**):

| Variable Name | Environment | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Production | Public | Canonical URL (e.g. `https://preetyprints.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Public | Your Supabase Project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Public | Supabase Anon / Publishable API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Secret | Supabase Service Role Key (Used for webhooks/admin) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production | Public | Live Razorpay Key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_ID` | Production | Secret | Live Razorpay Key ID (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Production | Secret | Live Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Production | Secret | Webhook secret configured in Razorpay Dashboard |
| `DELHIVERY_API_TOKEN` | Production | Secret | Production Delhivery API token |
| `DELHIVERY_CLIENT_NAME` | Production | Secret | Delhivery registered client name |
| `RESEND_API_KEY` | Production | Secret | Email provider API key (Resend or SMTP) |
| `WHATSAPP_PHONE_NUMBER_ID` | Production | Secret | (Optional) Meta Cloud API Phone Number ID |
| `WHATSAPP_ACCESS_TOKEN` | Production | Secret | (Optional) Meta System User Token |

---

## 3. WEBHOOKS CONFIGURATION

### A. Razorpay Dashboard Webhooks
In Razorpay Dashboard -> **Settings** -> **Webhooks** -> **Add New Webhook**:
- **Webhook URL**: `https://your-production-domain.vercel.app/api/webhooks/razorpay`
- **Secret**: Set a random secure string (save it in `RAZORPAY_WEBHOOK_SECRET` on Vercel)
- **Active Events**:
  - `payment.authorized`
  - `payment.captured`
  - `payment.failed`
  - `refund.processed`
  - `refund.failed`

### B. Delhivery Webhooks
In Delhivery Client Portal -> **Settings** -> **Webhooks**:
- **Webhook URL**: `https://your-production-domain.vercel.app/api/webhooks/delhivery`
- **Secret**: Save in `DELHIVERY_WEBHOOK_SECRET` on Vercel
- **Events**: `Scan Push / Status Updates` (`In Transit`, `Out for Delivery`, `Delivered`)

---

## 4. VERCEL DEPLOYMENT SETTINGS

In Vercel:
1. **Framework Preset**: `Next.js`
2. **Root Directory**: `./` (current directory)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Node.js Version**: `20.x` or `22.x`

---

## 5. POST-DEPLOYMENT VERIFICATION CHECKLIST

After Vercel finishes the build:
1. Visit `https://your-domain.vercel.app/api/health` -> should return `{ status: "ok", database: "healthy" }`.
2. Test a sample checkout with a small value to verify live Razorpay capture.
3. Check Supabase Dashboard -> Table Editor -> `payments` to see the captured row.
4. Log in to `/admin` using your admin account to verify permissions.
