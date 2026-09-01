# Production Disaster Recovery Runbook

**System:** Print Studio E-Commerce & Production Operating System  
**Document Version:** 1.0 (Phase 11B)  
**Target RPO (Recovery Point Objective):** < 1 hour (Automated Point-In-Time Backup)  
**Target RTO (Recovery Time Objective):** < 30 minutes for API/App, < 1 hour for DB restore  

---

## 1. Incident Severity Definitions

| Severity | Definition | Examples | SLA / Response Time |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Complete customer or financial outage; critical data corruption | Database offline, payment capture failing globally, active security breach | Immediate (< 15 mins) |
| **SEV-2 (Major)** | Major functionality broken with no workaround | Order placement blocked, webhook processing failure, storage upload failure | < 30 mins |
| **SEV-3 (Moderate)** | Operational issue with available workaround | Admin filter slow, single carrier API timeout, non-critical cron failure | < 2 hours |
| **SEV-4 (Minor)** | Cosmetic or minor discrepancy | Typo in email template, non-blocking UI alignment | Next business day |

---

## 2. Disaster Recovery Scenarios & Playbooks

### Scenario A: PostgreSQL Database Outage / Connection Drop
- **Detection:** Health check `/api/health` reports `status: degraded` / 503; Supabase dashboard alerts.
- **Immediate Action:**
  1. Verify Supabase project status at [https://status.supabase.com](https://status.supabase.com).
  2. Inspect connection pooler status (PgBouncer / Supavisor pool exhaustion).
  3. Temporarily enable storefront maintenance mode if queries fail repeatedly (`lib/settings/queries.ts` -> `store_status: PAUSED`).
- **Containment & Recovery:**
  1. If connection pooling exhausted, restart pooling server via Supabase Management Console.
  2. If instance corrupted, trigger automated Point-in-Time Recovery (PITR) to timestamp before failure.
- **Post-Incident Review:** Audit active connection spikes and query slow logs.

---

### Scenario B: Accidental Data Modification / Deletion
- **Detection:** Customer reports missing orders; admin detects mass record alteration.
- **Immediate Action:**
  1. Revoke write permissions on affected tables via SQL/RLS freeze if ongoing abuse is suspected.
  2. Inspect `admin_audit_logs` to identify actor, timestamp, and scope of mutation.
- **Containment & Recovery:**
  1. Supabase Point-in-Time Recovery (PITR) allows restoring database to exact second before corruption occurred.
  2. For isolated record restoration: restore to a temporary staging DB, extract corrupted rows, and re-insert into production with preserved UUIDs.
- **Post-Incident Review:** Tighten RLS policies and restrict bulk update permissions.

---

### Scenario C: Bad / Breaking Database Migration
- **Detection:** Application build or server action throws PostgreSQL syntax/column missing errors.
- **Immediate Action:**
  1. Follow the **Expand -> Migrate -> Verify -> Contract** rule. Never execute irreversible drop commands without forward-fix migrations.
- **Containment & Recovery:**
  1. Apply forward-fix migration (e.g. re-add dropped view, restore index, fix foreign key).
  2. If schema is corrupted, restore previous migration snapshot.

---

### Scenario D: Supabase Storage Outage / Upload Failures
- **Detection:** Customer artwork uploads fail; product images return 404/500 errors.
- **Immediate Action:**
  1. Verify Supabase Storage bucket quotas and permission policies.
  2. Temporarily instruct customers on checkout that digital proofs can be emailed to pre-press desk.
- **Containment & Recovery:**
  1. Verify bucket public/private access settings (`product-media` = public, `artwork` = private).
  2. Re-sync CDN cache if image delivery is stale.

---

### Scenario E: Razorpay Gateway Outage
- **Detection:** Spike in payment initialization failures at `/api/payments/razorpay/create-order`.
- **Immediate Action:**
  1. Check Razorpay Status at [https://status.razorpay.com](https://status.razorpay.com).
  2. Provide clear, non-technical customer toast: *"Payment gateway is undergoing momentary maintenance. Please try again shortly."*
- **Containment & Recovery:**
  1. Verify webhook delivery backlog in Razorpay Dashboard.
  2. When Razorpay restores, verify incoming `payment.captured` webhooks are processed idempotently.

---

### Scenario F: Shipping Carrier Outage (Delhivery / Shiprocket)
- **Detection:** `/api/shipping/serviceability` times out; AWB allocation fails during admin dispatch.
- **Immediate Action:**
  1. The logistics routing engine automatically falls back to alternate configured carrier partners (e.g. Shiprocket or Blue Dart) if primary fails.
- **Containment & Recovery:**
  1. Retry unassigned shipments once carrier API resumes.
  2. Check carrier status portals.

---

### Scenario G: Webhook Delivery Outage / Backlog
- **Detection:** Webhook events in `webhook_events` table show high pending or failed counts.
- **Immediate Action:**
  1. Check signature validation logs at `/api/webhooks/razorpay`.
  2. Razorpay automatically retries failed webhook deliveries with exponential backoff for up to 24 hours.
- **Containment & Recovery:**
  1. Idempotency keys prevent duplicate ledger entries when retries arrive.
  2. Run admin reconciliation query in Admin Payments dashboard to verify state consistency.

---

### Scenario H: Credential Compromise / Secret Exposure
- **Detection:** Unauthorized API calls detected in Supabase or Razorpay logs.
- **Immediate Action:**
  1. **ROTATE IMMEDIATELY:** Regenerate `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY`.
  2. Update hosting environment variables (Vercel / Railway) and trigger immediate production redeployment.
  3. Invalidate active admin sessions in Supabase Auth.
- **Post-Incident Review:** Audit Git commit history and server logs to determine exposure window.

---

### Scenario I: Hosting / Vercel Edge Outage
- **Detection:** Global DNS or CDN delivery errors (502 / 504 Bad Gateway).
- **Immediate Action:**
  1. Check Vercel status at [https://www.vercel-status.com](https://www.vercel-status.com).
  2. DNS failover configuration (if multi-region or secondary hosting configured).
- **Recovery:**
  1. Clear deployment build cache and redeploy stable Git tag/commit.
