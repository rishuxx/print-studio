# Phase 12I: Architecture Audit Report — Returns, Refunds, Replacements & Post-Delivery Resolution

**System Identifier**: `Print Studio Production (PreetyPrints)`  
**Audit Timestamp**: `2026-09-04T01:05:00+05:30`  
**Target Phase**: `Phase 12I — Returns, Refunds, Replacements & Post-Delivery Resolution`  

---

## 1. Existing Systems Inspection

### 1.1 Orders & Order State Machine
- **Table**: `public.orders`
- **Current Canonical Order Statuses**:
  `pending` → `confirmed` → `artwork_review` → `proof_pending` → `proof_approved` → `in_production` → `quality_check` → `ready` → `shipped` → `out_for_delivery` → `delivered`, and `cancelled`.
- **Order Lifecycle Service** (`lib/orders/lifecycle.ts`):
  - Strictly defines permitted state transitions.
  - Delivered orders are final commercial fulfillment states, but real-world customer issues (shipping damage, print flaws, missing accessories, wrong quantity, defect) occur post-delivery.

### 1.2 Payments & Refund Architecture
- **Tables**: `public.payments`, `public.payment_refunds`, `public.credit_notes`
- **Payment Lifecycle**: `created` → `authorized` → `captured` → `refunded` / `partially_refunded` / `failed`.
- **Payment Refund Engine** (`lib/payments/refunds.ts`):
  - Idempotent refund processor `processPaymentRefund({ paymentId, amountMinor, reason, idempotencyKey })`.
  - Reusable Razorpay API execution via `createRazorpayRefund()`.
  - Over-refund protection: verified against `amount_minor - amount_refunded_minor`.
  - Stored in `payment_refunds` with gateway ARN / RRN tracking references.
  - **Critical Rule**: Do NOT create a duplicate refund engine or duplicate Razorpay client. Resolution refunds must directly invoke `processPaymentRefund` with an authorized idempotency key.

### 1.3 Production & Quality Control (Phase 12G)
- **Tables**: `public.production_jobs`, `public.production_qc_records`, `public.production_job_events`.
- **Chain of Custody**:
  - Links to order items, artwork manifests, proof approval timestamps, and physical QC inspections.
  - When replacement is approved, replacement jobs must leverage `atomic_create_production_jobs_for_order` or direct production job spawning rather than building a separate manufacturing pipeline.

### 1.4 Logistics & Shipping (Phase 11 & 12H)
- **Tables**: `public.shipping_carriers`, `public.shipping_shipments`, `public.shipping_events`.
- **Shipping Gate**: Validates production completion before outbound dispatch.
- **Return Shipments**: Outbound shipments have `direction = 'outbound'`. Return shipments require customer → business reverse logistics tracking (`direction = 'return'`).

### 1.5 Storage & Evidence
- **Bucket**: `artwork` (and new `resolution-evidence` or private `resolutions` prefix in private storage).
- **Security**: Binary magic-bytes inspection (`lib/artwork/file-inspector.ts`), short-lived expiring signed URLs, no client-side file upload trust.

---

## 2. Domain Model & Resolution Concept

```
Customer
   ↓
Order (Delivered / Out for Delivery)
   ↓
Resolution Request (REP / REF / RET)
   ├── Resolution Items (Order item, quantity affected, defect category)
   ├── Resolution Evidence (Private photos, videos, descriptions, magic bytes verified)
   ├── Resolution Decision (Approved / Rejected / Evidence Requested / Return Required)
   └── Resolution Action:
         ├── Razorpay Partial / Full Source Refund (via lib/payments/refunds.ts)
         ├── Store Credit Ledger Entry (credit_ledger)
         ├── Replacement Production Job (via Phase 12G production_jobs)
         └── Reverse Return Shipment (via shipping_shipments direction='return')
```

---

## 3. Custom-Product Policy & Eligibility Engine

Because PreetyPrints manufactures custom-printed products (visiting cards, brochures, Diwali cards, banners, personalized merchandise):
1. **Custom Products are Non-Returnable for Remorse / Mind-Change**:
   - Customer-supplied spelling errors or customer-approved proof errors do NOT qualify for standard return/refund.
2. **Defects & Fulfillment Errors are Fully Protected**:
   - Printing defect (ink smear, mis-registration, color shift > $\Delta E$).
   - Structural trim / die-cut sizing defect.
   - Damaged in transit (carrier package breach).
   - Short quantity or missing packages.
   - Wrong product / wrong configuration delivered.
3. **Configurable Eligibility Engine**:
   - Validates delivered timestamp vs return window (default: 7 days for defects, 0 days for remorse on custom products).
   - Re-evaluates server-side; rejects spoofed client claims.

---

## 4. Required Database Migrations & Entities

We will introduce migration `20260904040000_phase_12i_resolutions.sql`:
1. `resolution_requests`: Main resolution entity with sequence-backed `request_number` (`RES-2026-000101`).
2. `resolution_request_items`: Line-item specific claimed vs approved quantities.
3. `resolution_evidence`: Secured customer upload paths, file size, MIME type, checksums.
4. `resolution_decisions`: Formally recorded staff decision, action taken, and notes.
5. `credit_ledger`: Auditable ledger for store credits (`amount_paise`, balance derivation).
6. Atomic stored procedures: `atomic_create_resolution_request`, `atomic_decide_resolution_request`.
7. Performance indexes and strict customer isolation + admin RBAC RLS.

---

## 5. Summary of Reuse & Avoidance of Duplication

| Feature Area | Reused System | Implementation Approach |
| :--- | :--- | :--- |
| Gateway Refund | `lib/payments/refunds.ts` | Calls existing `processPaymentRefund()` with idempotency key |
| Production Replacements | `lib/production/job-service.ts` | Creates linked production jobs under existing Phase 12G system |
| Evidence Storage | `lib/storage/artwork.ts` / Supabase Storage | Uses private storage with signed expiring URLs and magic byte inspection |
| Admin Navigation | `lib/admin/navigation.ts` | Adds `/admin/resolutions` under Commerce & Operations |
| Order Detail Views | Customer `/orders/[orderId]` & Admin `/admin/orders/[orderId]` | Integrates "Report Issue / Resolutions" card seamlessly |
