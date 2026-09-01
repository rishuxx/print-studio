# Production Configuration & Environment Checklist

**System:** Print Studio E-Commerce & Production Operating System  
**Document Version:** 1.0 (Phase 11B)  

---

## 1. Application & Hosting Configuration

- [ ] **Canonical Production Domain:** Primary domain configured (e.g. `https://printstudio.in`) with 301 redirect from `www.printstudio.in` (or vice-versa).
- [ ] **HTTPS Enforcement:** Strict TLS 1.3 / HTTPS enforced with HTTP -> HTTPS redirection.
- [ ] **Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` configured in `next.config.ts`.
- [ ] **Runtime Environment Validation:** `lib/env.ts` fails fast during server startup if essential secrets are missing.
- [ ] **Health Monitoring:** `/api/health` returns operational ping for uptime monitors without leaking secrets.
- [ ] **SEO & Search Indexing Protection:** `app/robots.ts` disallows search bot crawling on `/admin/*`, `/account/*`, `/orders/*`, and `/checkout`.

---

## 2. Supabase Production Project Checklist

- [ ] **Dedicated Production Project:** Separate Supabase production project created (distinct from local/staging development project).
- [ ] **Database Schema Migrations:** All version-controlled migrations from `supabase/migrations/` applied in order.
- [ ] **Row-Level Security (RLS):** Verified RLS enabled on all 20 public tables (`docs/production-rls-matrix.md`).
- [ ] **Storage Buckets Created:**
  - `product-media` (Public bucket for catalog images)
  - `artwork` (Private bucket for customer uploads and digital proofs)
- [ ] **Backups & Point-in-Time Recovery (PITR):** Daily automated backups or PITR enabled under Supabase database settings.
- [ ] **Connection Pooling:** PgBouncer / Supavisor pooler URL configured for serverless query scalability.

---

## 3. Razorpay Payment Gateway Checklist

- [ ] **Live API Credentials:** Live `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` generated from Razorpay Live Dashboard.
- [ ] **Webhook Endpoint Configured:** Webhook URL registered at `https://yourdomain.com/api/webhooks/razorpay`.
- [ ] **Webhook Secret Generated:** Secret configured in Razorpay and added to environment variables as `RAZORPAY_WEBHOOK_SECRET`.
- [ ] **Subscribed Webhook Events:**
  - `payment.captured`
  - `payment.failed`
  - `refund.created`
  - `refund.processed`
- [ ] **Live Payment Smoke Test:** A ₹1.00 live test transaction executed and verified before public customer traffic.

---

## 4. Logistics & Shipping Provider Checklist

- [ ] **Delhivery Production Token:** Production `DELHIVERY_API_TOKEN` configured for live waybill generation and real-time pincode serviceability.
- [ ] **Shiprocket Fulfillment:** Production API credentials configured for secondary/surface dispatch.
- [ ] **Fulfillment Facility Origin:** Production pickup hub address registered (e.g. Dehradun Central Facility 248007).

---

## 5. Environment Variables Reference Matrix

| Variable Name | Required | Target Environment | Scope | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | Production | Server | Set to `production` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production | Client/Server | Canonical storefront domain |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Dev / Prod | Client/Server | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Dev / Prod | Client/Server | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Dev / Prod | Server ONLY | Privileged administrative operations key |
| `RAZORPAY_KEY_ID` | Yes | Dev / Prod | Client/Server | Razorpay public Key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Dev / Prod | Server ONLY | Razorpay private Secret Key |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Dev / Prod | Server ONLY | Secret used to verify webhook HMAC signatures |
| `DELHIVERY_API_TOKEN` | Optional | Prod | Server ONLY | Live Delhivery logistics carrier token |
| `SHIPROCKET_API_TOKEN` | Optional | Prod | Server ONLY | Live Shiprocket logistics carrier token |
