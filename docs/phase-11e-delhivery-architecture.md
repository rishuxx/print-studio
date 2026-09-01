# PHASE 11E — DELHIVERY PRODUCTION & STAGING ARCHITECTURE

**System:** PreetyPrints E-Commerce & Production Operating System  
**Primary Logistics Provider:** Delhivery Express & Surface REST APIs  
**Environment Abstraction:** `DELHIVERY_ENVIRONMENT=staging|production`  
**Date:** September 1, 2026  
**Status:** **ACTIVE / VERIFIED**

---

## 1. System Architecture Diagram

```
                              CUSTOMER STOREFRONT
                                      │
                                      ▼
                        CHECKOUT / PINCODE VALIDATION
                                      │
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
         [Pincode Serviceability]            [Rate Calculation]
         (Prepaid/COD/ODA Lookup)            (Weight/Slab Matrix)
                     │                                 │
                     └────────────────┬────────────────┘
                                      │
                                      ▼
                               ORDER PLACED
                                      │
                                      ▼
                           ADMIN SHIPPING COMMAND
                          (/admin/shipping / Orders)
                                      │
                           [Carrier Assignment Lock]
                                      │
                                      ▼
                         DELHIVERY CARRIER ADAPTER
                       (lib/shipping/carriers/delhivery)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        STAGING GATEWAY                       PRODUCTION GATEWAY
(staging-express.delhivery.com)              (track.delhivery.com)
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │
                   [Atomic Waybill / AWB Allocation]
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
             [Label URL]      [Pickup Schedule]    [Tracking Poll]
                   │                  │                  │
                   └──────────────────┼──────────────────┘
                                      │
                                      ▼
                       DELHIVERY PUSH SCAN WEBHOOK
                        (/api/webhooks/delhivery)
                                      │
                          [SHA-256 Deduplication]
                                      │
                          [Status Normalization]
              (DL -> delivered, OFD -> out_for_delivery, etc.)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
         [Admin Ops Timeline]                  [Customer Timeline]
         (Raw scan info + hub)              (Clean milestone UI)
```

---

## 2. Environment Isolation & Configuration

All communications are strictly server-authoritative. Environment switching is handled cleanly via `.env.local`:

| Variable | Staging (UAT) | Production |
| :--- | :--- | :--- |
| `DELHIVERY_ENV` | `staging` | `production` |
| `Base URL` | `https://staging-express.delhivery.com` | `https://track.delhivery.com` |
| `DELHIVERY_API_TOKEN` | Staging API Token | Live Production API Token |
| `DELHIVERY_PICKUP_LOCATION` | Registered Warehouse Name | Registered Warehouse Name |

---

## 3. Database Schema & Idempotency Controls

1. **`shipping_shipments` Table:**
   - Enforces `UNIQUE(carrier_id, awb_number)` and `UNIQUE(order_id)`.
   - Partner assignment lock: once an AWB is created, the carrier cannot be reassigned without a formal cancellation workflow.
2. **`shipping_tracking_events` Table:**
   - Stores `raw_payload_hash` (SHA-256) with unique fingerprinting to prevent duplicate scans.
3. **`shipping_webhook_receipts` Table:**
   - Prevents duplicate webhook processing under network replay.
