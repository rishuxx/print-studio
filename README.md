# Print Studio (AGY Web Platform) 🖨️✨

> **Enterprise-Grade Web-to-Print & Custom Merchandising E-Commerce Platform**  
> Built with Next.js 16 (Turbopack), TypeScript, Tailwind CSS, Supabase PostgreSQL, and Razorpay Enterprise Payments.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-blue?style=flat-square&logo=razorpay)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-Proprietary-purple?style=flat-square)]()

---

## 🌟 Executive Overview

**Print Studio** is a full-featured, production-ready e-commerce platform tailored specifically for commercial printing businesses, bulk corporate merchandising, personalized stationery, custom apparel, and on-demand packaging. 

Engineered from the ground up to support complex volume discounting matrices, multi-tiered add-ons, real-time file proofing uploads, and authoritative server-side pricing validation.

---

## 🚀 Key Modules & Capabilities

### 1. 🛍️ Customer Storefront & Product Catalogue
- **165+ Configured Products**: High-fidelity catalogue spanning Visiting Cards, Custom Apparel, Personalized Corporate Gifts, Packaging & Boxes, Signage & Posters, Stationery, Drinkware, and Festive Collections.
- **Dynamic Configuration & Quantity Tiers**: Interactive price matrix automatically calculating volume discounts (100, 250, 500, 1000+ units) with live price factor recalculation.
- **Add-On Modifiers**: Seamless upsell for Design Assistance, Printed Hard Proofs, and Rush Production.
- **Artwork Upload & Validation**: Secure customer file upload to Supabase Storage with dimension and resolution checks.

### 2. ⚡ Authoritative Pricing Engine (Phase 10F)
- **Zero Client Trust**: All pricing calculations are authoritatively computed and enforced server-side.
- **Multi-layered Rule Hierarchy**: Evaluates Base Price &rarr; Quantity Tiers &rarr; Scheduled Sales &rarr; Promotional Coupons &rarr; Margin Floor Protection.
- **Live Pricing Simulator & Trace**: Admin diagnostic tool to simulate exact line item math and trace rule execution in real-time.
- **Smart GST & Tax Policy**:
  - **Smart All-Inclusive MRP Mode (Recommended)**: Hides GST within displayed consumer prices to reduce cart abandonment; back-calculates 18% GST (SAC 9989 / HSN 4911) for legal tax invoices.
  - **Exclusive Surcharge Mode (B2B)**: Explicitly adds GST at checkout.
  - Configurable tariff percentage slider with instant reactive sync.

### 3. 💳 Production Payments & Reconciliation (Phase 10D)
- **Razorpay Native Checkout & Standard Flow**: End-to-end payment lifecycle handling orders, verification, and webhooks.
- **HMAC SHA-256 Anti-Tamper Verification**: Cryptographically validates payment signatures before confirming orders.
- **Idempotent Webhook Processing**: State-machine guarded order status transitions (`pending_payment` &rarr; `processing` &rarr; `printing` &rarr; `shipped` &rarr; `delivered`).
- **Automated & Manual Refunds**: Full and partial refund processing integrated with ledger audit logging.

### 4. 🎛️ Command Center & Admin Operations
- **Real-Time KPI Dashboard**: Live tracking of Gross Revenue, Order Volume, Average Order Value (AOV), Pending Payments, and In-Production counts.
- **Order Lifecycle & Production Workflow**: Interactive order management with status transitions, shipment tracking, and customer communications.
- **Catalogue & Variant Management**: Full CRUD over products, categories, SKU pricing, and stock visibility.
- **Promotions & Scheduled Sales**: Create sitewide flash sales, category-specific discounts, and stackable/non-stackable promo codes with date scheduling.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3.2 (App Router, Turbopack, Server Actions) |
| **Language** | TypeScript 5 (Strict Type Checking) |
| **Styling** | Vanilla CSS + Tailwind CSS tokens + Lucide Icons |
| **State Management** | Zustand (Persistent Cart & Storefront State) |
| **Database & Auth** | Supabase PostgreSQL + Row Level Security (RLS) |
| **Payment Gateway** | Razorpay Node SDK + Webhook Handlers |
| **Storage** | Supabase Storage (Customer Artwork & Production Assets) |

---

## 📂 Project Architecture

```
printo-web/
├── app/                              # Next.js App Router
│   ├── (storefront)/                 # Customer-facing routes
│   │   ├── cart/                     # Shopping cart & discounts
│   │   ├── category/[handle]/        # Category browsing
│   │   ├── checkout/                 # Order checkout & address
│   │   ├── payment/                  # Razorpay checkout & gateway
│   │   └── product/[handle]/         # Interactive configurator
│   ├── admin/                        # Admin Operations Suite
│   │   ├── categories/               # Taxonomy & Category CRUD
│   │   ├── orders/                   # Order lifecycle & tracking
│   │   ├── payments/                 # Payment logs & reconciliation
│   │   ├── pricing/                  # Pricing engine & promo manager
│   │   └── products/                 # Product & variant catalog
│   └── api/                          # Serverless API routes
│       ├── payments/razorpay/        # Order creation & signature verification
│       └── webhooks/razorpay/        # Cryptographic webhook handlers
├── components/                       # Modular UI Components
│   ├── admin/                        # Admin dashboard, tables, and modals
│   ├── checkout/                     # Checkout client view
│   ├── layout/                       # Header, footer, announcement bars
│   └── product/                      # Configurator, gallery, price cards
├── lib/                              # Core Domain & Business Logic
│   ├── admin/                        # KPI metrics, aggregations, queries
│   ├── data/products/                # 165+ synthesized product definitions
│   ├── payments/                     # Razorpay client, server calculator, refunds
│   ├── pricing/                      # Pricing engine, money math, mutations
│   └── supabase/                     # Database client, server actions, auth
└── supabase/
    └── migrations/                   # SQL Schemas (Phases 8b through 10f)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm
- Supabase project credentials
- Razorpay Test / Live Key & Secret

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rishuxx/print-studio.git
cd print-studio
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3. Run Migrations & Seed Database
Execute the SQL migration files inside `supabase/migrations/` in sequence on your Supabase SQL Editor.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin console.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security & Data Integrity

- **Cryptographic Signatures**: Webhooks and payment verifications utilize HMAC SHA-256 validation.
- **Server-Side Invariants**: Cart totals and order pricing cannot be modified from client storage; they are authoritatively verified against database price books prior to payment creation.
- **Optimistic Concurrency**: Price and catalogue updates maintain version tokens to prevent race conditions during concurrent admin edits.
- **Row Level Security (RLS)**: Enforces access isolation between customer orders and admin commands.

---

## 📄 License & Maintainer

Designed and developed by **[Rishu (rishuxx)](https://github.com/rishuxx)**.  
Proprietary commercial software. All rights reserved.
