# Phase 11C Production Performance Architecture

**System:** Print Studio E-Commerce & Production Operating System  
**Document Version:** 1.0 (Phase 11C)  

---

## 1. High-Concurrency Request & Data Flow Architecture

```text
                           ┌───────────────────────────┐
                           │      CLIENT BROWSER       │
                           │  Storefront / Checkout /  │
                           │     Admin Operations      │
                           └─────────────┬─────────────┘
                                         │
                                         ▼ [HTTPS / Strict Security Headers / CDN Cached Assets]
                           ┌───────────────────────────┐
                           │      NEXT.JS EDGE/SSR     │
                           │  Turbopack / React 19 /   │
                           │     Server Components     │
                           └─────────────┬─────────────┘
                                         │
                ┌────────────────────────┼────────────────────────┐
                │                        │                        │
                ▼                        ▼                        ▼
     ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
     │   PRICING ENGINE    │  │  ADMIN OPERATIONS   │  │   WEBHOOK INGEST    │
     │  Integer Arithmetic │  │   RBAC Guarded      │  │   Idempotency Check │
     │  431,000+ ops/sec   │  │   Bounded Queries   │  │   HMAC Verification │
     │  p95 < 0.01ms       │  │   p95 < 5ms         │  │   p95 < 0.02ms      │
     └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘
                │                        │                        │
                └────────────────────────┼────────────────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   SUPABASE POSTGRESQL     │
                           │   Composite Indexing /    │
                           │   Row-Level Security /    │
                           │   Connection Pooling      │
                           └───────────────────────────┘
```

---

## 2. Checkout, Razorpay & Webhook Concurrency Workflow

```text
[CUSTOMER CHECKOUT]
       │
       ▼
1. Authoritative Server Pricing Recomputation (p95 < 0.01ms)
       │
       ▼
2. Anti-Tampering Evaluation (recalc.totalPaise vs clientTotalPaise)
       │
       ▼
3. Atomic Order Insertion (status: 'pending', payment_status: 'pending')
       │
       ▼
4. Razorpay Gateway Order Creation (receipt: PRT-2026-XXXX)
       │
       ▼
5. Payment Modal Launch (HMAC-SHA256 Client Callback)
       │
       ├──► [Path A: Immediate Client Signature Verification] ──► Captured & Marked Paid
       │
       └──► [Path B: Asynchronous Razorpay Webhook Ingestion]
                   │
                   ▼
             Check `webhook_events` by `provider_event_id` (Index lookup)
                   │
                   ├── If duplicate ──► Safely Acknowledged (Zero Mutation)
                   └── If unique ────► Atomic Transition to 'artwork_review'
```

---

## 3. Database Indexing Strategy

| Table | Index Name | Columns Indexed | Query Type Accelerated |
| :--- | :--- | :--- | :--- |
| `orders` | `idx_orders_user_id_created_at` | `(user_id, created_at DESC)` | Customer "My Orders" listing |
| `orders` | `idx_orders_status_created_at` | `(status, created_at DESC)` | Admin Order Console filtering |
| `orders` | `idx_orders_order_number` | `(order_number)` | Order reference search |
| `payments` | `idx_payments_provider_payment_id`| `(provider_payment_id)` | Razorpay signature verification |
| `payments` | `idx_payments_order_id` | `(order_id)` | Financial ledger lookup |
| `payment_refunds` | `idx_payment_refunds_idempotency_key` | `(idempotency_key)` | Duplicate refund prevention |
| `products` | `idx_products_status_visibility_featured` | `(status, visibility, is_featured, sort_order)` | Storefront catalog browsing |
| `shipping_shipments`| `idx_shipping_shipments_awb_number` | `(awb_number)` | Logistics tracking search |
| `webhook_events` | `idx_webhook_events_provider_event_id`| `(provider, event_id)` | Webhook deduplication |
