# Phase 10J — System Architecture & Trust Boundary Map

## 1. Customer Storefront Lifecycle

```
Customer
   │
   ├── (Auth: Supabase SSR Cookie Auth)
   │
   ▼
Catalogue & Product Page
   │
   ├── (Price Configurator: Unit & Quantity Tiers)
   │
   ▼
Cart
   │
   ▼
Checkout
   │
   ├── 1. POST /api/payments/razorpay/create-order
   │      - Server recalcuates authoritative price via recalculateAuthoritativeCartTotal()
   │      - Checks min/max order value against business_settings
   │      - Creates pending order in PostgreSQL
   │      - Generates Razorpay Order via secret key
   │
   ▼
Razorpay Checkout Modal
   │
   ├── 2. POST /api/payments/razorpay/verify
   │      - Server verifies HMAC-SHA256 signature
   │      - Updates payment to 'captured' and order to 'artwork_review' / 'paid'
   │
   ├── 3. POST /api/webhooks/razorpay (Async Idempotent Fallback)
   │      - Verifies webhook signature
   │      - Checks idempotency table (webhook_events)
   │      - Updates payment & order state
   │
   ▼
Order Processing & Production Press Queue
   │
   ├── Staff / Admin assigns Carrier (Shiprocket / Delhivery / Sandbox)
   │
   ▼
Delivery & Real-time Scan Ingestion
   │
   ├── POST /api/webhooks/delhivery
   ├── POST /api/webhooks/shipping/shiprocket
   │
   ▼
Delivered / Cancelled / Refunded
```

## 2. Admin Command Center Architecture

```
Admin Login (/login)
   │
   ▼
requireAdminAuth (Server Guard)
   │
   ├── Verified role in ('owner', 'admin', 'staff')
   ├── Account status == 'active' (not 'suspended')
   │
   ▼
RBAC Authorization Layer (requirePermission)
   │
   ├── Reads role_permissions from PostgreSQL (Cached per-request)
   │
   ▼
Admin Shell
   ├── Dashboard (/admin) ───────────► [dashboard.view]
   ├── Orders (/admin/orders) ───────► [orders.view / orders.manage]
   ├── Payments (/admin/payments) ───► [payments.view / payments.refund]
   ├── Products (/admin/products) ───► [products.view / products.manage]
   ├── Pricing (/admin/pricing) ─────► [pricing.view / pricing.manage]
   ├── Customers (/admin/customers) ─► [customers.view]
   ├── Shipping (/admin/shipping) ───► [settings.view]
   ├── Settings (/admin/settings) ───► [settings.view]
   ├── Users (/admin/users) ─────────► [users.view / users.manage]
   └── Audit Log (/admin/audit-log) ─► [users.view]
```

## 3. Trust Boundaries & Invariants
- **Client/Browser:** Completely Untrusted. Cannot dictate prices, cannot dictate payment status, cannot cancel orders past artwork stage, cannot escalate roles.
- **Server Action / API Gateway:** Authoritative validation, integer arithmetic, role requirement enforcement.
- **Database (PostgreSQL):** Canonical single source of truth.
